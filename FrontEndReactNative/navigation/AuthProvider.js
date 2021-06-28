import React, { createContext, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firebase from 'firebase/app';
import "firebase/auth";

import { 
    DefaultTheme as NavigationDefaultTheme,
    DarkTheme as NavigationDarkTheme
} from '@react-navigation/native';
import { 
    Provider as PaperProvider,
    DefaultTheme as PaperDefaultTheme,
    DarkTheme as PaperDarkTheme
} from "react-native-paper";

// Loading env variables
import {
    // LOCAL_DEV_IP,
    REACT_APP_FIREBASE_API_KEY,
    REACT_APP_FIREBASE_AUTH_DOMAIN,
    REACT_APP_FIREBASE_PROJECT_ID,
    REACT_APP_FIREBASE_STORAGE_BUCKET,
    REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    REACT_APP_FIREBASE_APP_ID,
    REACT_APP_FIREBASE_MEASUREMENT_ID
} from '@env'

// Loading env variables
import getEnvVars from '../environment';
const { API_URL } = getEnvVars();

// https://docs.expo.io/guides/using-firebase/
// Initialize Firebase
const firebaseConfig = {
    apiKey              : REACT_APP_FIREBASE_API_KEY,
    authDomain          : REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId           : REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket       : REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId   : REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId               : REACT_APP_FIREBASE_APP_ID,
    measurementId       : REACT_APP_FIREBASE_MEASUREMENT_ID
};
// Initialize Firebase
if(!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
} else {
    // if already initialized, use that one
    firebase.app();
}

const firebase_auth = firebase.auth();

// Context provides a way to pass data thru the component tree
// w/o having to pass "props" down manually at every level
// More info: https://reactjs.org/docs/context.html
export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [userId, setUserId] = useState(null);
    const [isDarkTheme, setIsDarkTheme] = useState(false);
    const theme = isDarkTheme ? CustomDarkTheme : CustomDefaultTheme;
    const [authError, setAuthError] = useState("");         // https://firebase.google.com/docs/auth/admin/errors
    const [authStatus, setAuthStatus] = useState("");

    const setToken = async (user) => {
        try {
            await AsyncStorage.setItem(key='userData', value=JSON.stringify(user));
        } catch (error) {
            console.log('[AuthProvider] setToken() failed: ', error);
        }
    }

    const getToken = async () => {
        try {
            let userData = await AsyncStorage.getItem('userData');
            let data = JSON.parse(userData);
            // console.log(data);
            return data;
        } catch (error) {
            console.log('[AuthProvider] getToken() failed: ', error);
        }
    }

    const removeToken = async () => {
        try {
            await AsyncStorage.removeItem('userData');
        } catch (error) {
            console.log('[AuthProvider] removeToken() failed: ', error);
        }
    }

    return (
        <PaperProvider theme={theme}>
        <AuthContext.Provider 
            value={{
                userId, setUserId,                      // to be able to set this user from any other file
                theme, toggleTheme: () => {         // to be able to access "theme"
                    setIsDarkTheme( !isDarkTheme )
                },
                authError, setAuthError,
                authStatus, setAuthStatus,
                getToken,
                login: async (inEmail, inPassword) => { 
                    console.log("[AuthProvider] login()")
                    try {
                        await firebase_auth.signInWithEmailAndPassword(inEmail, inPassword)
                        .then((userCredential) => {
                            // Signed in
                            setToken(userCredential.user);
                            setUserId(userCredential.user.uid);
                        })
                        .catch((error) => {
                            var errorCode = error.code;
                            var errorMessage = error.message;
                            setAuthError(errorMessage);
                            // console.log("Error signing in...", errorCode, errorMessage);
                    });
                    } catch (e) {
                        console.log(e);
                    }
                },  // ending login

                signup: async(inEmail, inPassword, inFirstName, inLastName, inDob, inAvgDaysPerPeriod) => { 
                    console.log("[AuthProvider] signup()")
                    try {
                        await firebase_auth.createUserWithEmailAndPassword(inEmail, inPassword)
                        .then((userCredential) => {
                            fetch(`${API_URL}/api/user/${userCredential.user.uid}`, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    "userId"    : userCredential.user.uid,
                                    "email"     : userCredential.user.email,
                                    "firstName" : inFirstName,
                                    "lastName"  : inLastName,
                                    "dob"       : inDob,
                                    "avgDaysPerPeriod"  : inAvgDaysPerPeriod,
                                    "profileImageId"    : "default_profile_women_1.jpg"
                                })
                            })
                            .then(resp => resp.json())
                            .then(userData => {
                                setUserId(userData);
                            })
                        });
                    } catch(e) {
                        console.log(e);
                        setAuthError(e);
                    }
                },  // ending signup

                logout: async() => { 
                    console.log("[AuthProvider] logout()")
                    try {
                        await firebase_auth.signOut();
                        removeToken();
                        setUserId(null);
                    } catch(e) {
                        console.log(e);
                        setAuthError(e);
                    }
                },   // ending logout

                resetPassword: async(inEmail) => {
                    console.log("[AuthProvider] resetPassword()")
                    try {
                        await firebase_auth.sendPasswordResetEmail(inEmail)
                        .then(() => {
                            setAuthStatus("Please check your email for reset password instructions")
                        })
                    } catch(e) {
                        setAuthError(String(e));
                    }
                },  // ending resetPassword
            }}>
            {children}
        </AuthContext.Provider>
        </PaperProvider>
    )
}

// ----------------------------------------------------------------------------
// Styles
const CustomDefaultTheme = {
    ...NavigationDefaultTheme,
    ...PaperDefaultTheme,
    colors: {
        ...NavigationDefaultTheme.colors,
        ...PaperDefaultTheme.colors,
        background: '#ffffff',
        text: '#333333'
    }
}

const CustomDarkTheme = {
    ...NavigationDarkTheme,
    ...PaperDarkTheme,
    colors: {
        ...NavigationDarkTheme.colors,
        ...PaperDarkTheme.colors,
        background: '#333333',
        text: '#ffffff'
    }
}
// ----------------------------------------------------------------------------

export default AuthProvider;
import React, { createContext, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail, signOut } from 'firebase/auth';

import {
    DefaultTheme as NavigationDefaultTheme,
    DarkTheme as NavigationDarkTheme
} from '@react-navigation/native';
import {
    Provider as PaperProvider,
    DefaultTheme as PaperDefaultTheme,
    DarkTheme as PaperDarkTheme
} from "react-native-paper";

import { MODAL_TEMPLATE } from '../models/PeriodDate';

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
} from '@env';

// Loading env variables
import getEnvVars from '../environment';
const { API_URL } = getEnvVars();

// https://docs.expo.io/guides/using-firebase/
// Initialize Firebase
const firebaseConfig = {
    apiKey: REACT_APP_FIREBASE_API_KEY,
    authDomain: REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: REACT_APP_FIREBASE_APP_ID,
    measurementId: REACT_APP_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const firebaseAuth = getAuth(firebaseApp);

// Context provides a way to pass data thru the component tree
// w/o having to pass "props" down manually at every level
// More info: https://reactjs.org/docs/context.html
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [userId, setUserId] = useState(null);
    const [isDarkTheme, setIsDarkTheme] = useState(false);
    const theme = isDarkTheme ? CustomDarkTheme : CustomDefaultTheme;
    const [authError, setAuthError] = useState("");         // https://firebase.google.com/docs/auth/admin/errors
    const [authStatus, setAuthStatus] = useState("");

    const setToken = async (user) => {
        try {
            await AsyncStorage.setItem(key = 'userData', value = JSON.stringify(user));
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
                        setIsDarkTheme(!isDarkTheme)
                    },
                    authError, setAuthError,
                    authStatus, setAuthStatus,
                    getToken,
                    login: async (inEmail, inPassword) => {
                        console.log("[AuthProvider] login()")
                        try {
                            await signInWithEmailAndPassword(firebaseAuth, inEmail, inPassword)
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

                    signup: async (inEmail, inPassword, inFirstName, inLastName, inDob, inAvgDaysPerPeriod) => {
                        console.log("[AuthProvider] signup()")
                        try {
                            await createUserWithEmailAndPassword(firebaseAuth, inEmail, inPassword)
                                .then((userCredential) => {
                                    fetch(`${API_URL}/api/user/${userCredential.user.uid}`, {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({
                                            "userId": userCredential.user.uid,
                                            "email": userCredential.user.email,
                                            "firstName": inFirstName,
                                            "lastName": inLastName,
                                            "dob": inDob,
                                            "avgDaysPerPeriod": inAvgDaysPerPeriod,
                                            "profileImageId": "default_profile_women_1.jpg",
                                            "symptomsTrack": new MODAL_TEMPLATE().getKeys()
                                        })
                                    })
                                        .then(resp => resp.json())
                                        .then(userData => {
                                            setUserId(userData);
                                        })
                                });
                        } catch (e) {
                            console.log(e);
                            setAuthError(e);
                        }
                    },  // ending signup

                    logout: async () => {
                        console.log("[AuthProvider] logout()")
                        try {
                            await signOut(firebaseAuth);
                            removeToken();
                            setUserId(null);
                        } catch (e) {
                            console.log(e);
                            setAuthError(e);
                        }
                    },   // ending logout

                    resetPassword: async (inEmail) => {
                        console.log("[AuthProvider] resetPassword()")
                        try {
                            await sendPasswordResetEmail(firebaseAuth, inEmail)
                                .then(() => {
                                    setAuthStatus("Please check your email for reset password instructions")
                                })
                        } catch (e) {
                            setAuthError(String(e));
                        }
                    },  // ending resetPassword
                }}>
                {children}
            </AuthContext.Provider>
        </PaperProvider>
    )
}


// Styles
const CustomDefaultTheme = {
    ...NavigationDefaultTheme,
    ...PaperDefaultTheme,
    roundness: 50,
    colors: {
        // ...NavigationDefaultTheme.colors,
        // ...PaperDefaultTheme.colors,
        primary: '#F56A37',
        accent: '#FFFBEE',
        background: '#FFFBEE',
        text: '#F56A37',
        fonts: 'regular',
        placeholder: 'black'
    },

    btnTextHighlight: {
        text: 'white'
    },
    btnText: {
        text: 'yellow'
    }
}

const CustomDarkTheme = {
    ...NavigationDarkTheme,
    ...PaperDarkTheme,
    roundness: 50,
    colors: {
        ...NavigationDarkTheme.colors,
        ...PaperDarkTheme.colors,
        background: '#333333',
        text: '#ffffff'
    },

    btnTextHighlight: {
        text: 'white'
    },
    btnText: {
        text: 'yellow'
    }
}


export default AuthProvider;
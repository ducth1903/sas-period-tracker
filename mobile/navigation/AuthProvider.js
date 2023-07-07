import React, { createContext, useState, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from 'firebase/app';
import {
    createUserWithEmailAndPassword,
    getAuth,
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
    signOut,
    GoogleAuthProvider,
    signInWithCredential,
} from 'firebase/auth';
import { MODAL_TEMPLATE } from '../models/PeriodDate';
import { SettingsContext } from './SettingsProvider';
import i18n from '../translations/i18n';

// Loading env variables
import {
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
    const { selectedSettingsLanguage } = useContext(SettingsContext);
    const [userId, setUserId] = useState(null);
    const [authError, setAuthError] = useState("");         // https://firebase.google.com/docs/auth/admin/errors
    const [authStatus, setAuthStatus] = useState("");
    const [hasDoneSurvey, setHasDoneSurvey] = useState(true);
    const [userData, setUserData] = useState({});
    const [firstName, setFirstName] = useState("");

    const setToken = async (user) => {
        try {
            await AsyncStorage.setItem('userData', JSON.stringify(user));
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
        <AuthContext.Provider
            value={{
                userId, setUserId,                  // to be able to set this user from any other file
                authError, setAuthError,
                authStatus, setAuthStatus,
                hasDoneSurvey, setHasDoneSurvey,
                firstName, setFirstName,
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
                                const errorCode = error.code;
                                const errorMessage = error.message;
                                setAuthError(errorMessage);
                                // console.log("Error signing in...", errorCode, errorMessage);
                            });
                    } catch (e) {
                        console.log(e);
                    }
                },  // ending login

                loginWithGoogle: async (googleResponse) => {
                    try {
                        // Build Firebase credential with the Google ID token.
                        const idToken = googleResponse.authentication.idToken;
                        const accessToken = googleResponse.authentication.accessToken;
                        const credential = GoogleAuthProvider.credential(idToken, accessToken);

                        // Sign in with credential from the Google user.
                        const result = await signInWithCredential(firebaseAuth, credential);

                        const userCredential = result.user;
                        const userUid = userCredential.uid;
                        // const userApiKey = userCredential.apiKey;
                        // const userEmail = userCredential.email;
                        // const userDisplayName = userCredential.displayName;
                        // const userPhotoURL = userCredential.photoURL;
                        setUserId(userUid);

                        // Token response
                        // const tokenResponse = result._tokenResponse;
                        // const userFirstName = tokenResponse.firstName;
                        // const userLastName = tokenResponse.lastName;
                        // const userFullName = tokenResponse.fullName;
                        // const userIdToken = tokenResponse.idToken;
                        // setToken(userIdToken);
                        setToken(userCredential);
                    } catch (error) {
                        // Handle Errors here.
                        const errorCode = error.code;
                        const errorMessage = error.message;
                        // The email of the user's account used.
                        const email = error.email;
                        // The credential that was used.
                        const credential = GoogleAuthProvider.credentialFromError(error);
                        console.log('Error when login with Google:', error, errorCode);
                    }

                },  // ending loginWithGoogle 

                signup: async (inEmail, inPassword, inFirstName, inLastName, inDob, inAvgDaysPerPeriod) => {
                    console.log("[AuthProvider] signup()")
                    try {
                        const userCredential = await createUserWithEmailAndPassword(firebaseAuth, inEmail, inPassword)
                        const resp = await fetch(`${API_URL}/users/${userCredential.user.uid}`, {
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
                                "symptomsTrack": new MODAL_TEMPLATE().getKeys(),
                                "hasDoneSurvey": false,
                                "surveyAnswers": {}
                            })
                        });
                        setFirstName(inFirstName);
                        const obj = await resp.json();
                        setUserId(obj.userId);
                    } catch (e) {
                        console.log(`[AuthProvider] signup() error: ${e}`);
                        if (JSON.stringify(e).includes("already-in-use")) {
                            setAuthError(i18n.t('authentication.emailAlreadyInUse'));
                            return;
                        }
                        if (JSON.stringify(e).includes("weak-password")) {
                            setAuthError(i18n.t('authentication.weakPassword'));
                            return;
                        }
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
                                setAuthStatus(i18n.t('authentication.pleaseCheckYourEmail'))
                            })
                    } catch (e) {
                        setAuthError(String(e));
                    }
                },  // ending resetPassword
            }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider;

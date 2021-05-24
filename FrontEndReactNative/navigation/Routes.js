import React, { useContext, useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import firebase from 'firebase/app';
import "firebase/auth";

import { AuthContext } from './AuthProvider';
import AuthStack from './AuthStack';
import AppStack from './AppStack';

const Routes = () => {
    const {userId, setUserId, theme} = useContext(AuthContext);
    const [initializing, setInitializing] = useState(true);

    // Similar to componentDidMount(), componentDidUpdate() from class component
    // Authentication State Observer
    useEffect(() => {
        firebase.auth().onAuthStateChanged(function(user) {
            if (userId) {
                // User is signed in, see docs for a list of available properties
                // https://firebase.google.com/docs/reference/js/firebase.User
                setUserId(user.uid);
                if (initializing) setInitializing(false);
            } else {
                // No user is signed in.
                setInitializing(false);
                setUserId(null);
            }
        });

        if (userId) {
            console.log("Routes->useEffect(): userId=", userId)
        } else {
            console.log("Routes->useEffect(): NULL user")
        }
    }, []);

    // if (initializing) {
    //     // To find user token?
    //     setInitializing(false)
    //     console.log("Routes->initializing...");
    //     return (<Text>Loading...</Text>);
    //     // return null;      // can use loading screen instead
    // }

    return (
        <NavigationContainer theme={theme}>
            { userId ? <AppStack/> : <AuthStack/>}
        </NavigationContainer>
    )
}

export default Routes;
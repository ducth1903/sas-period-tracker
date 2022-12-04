import React, { useContext, useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { getAuth, onAuthStateChanged } from "firebase/auth";

import { AuthContext } from './AuthProvider';
import AuthStack from './AuthStack';
import AppStack from './AppStack';

const Routes = () => {
    const auth = getAuth();
    const {userId, setUserId, theme}        = useContext(AuthContext);
    const [initializing, setInitializing]   = useState(true);

    // Authentication State Observer
    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (userId) {
                // User is signed in, see docs for a list of available properties
                // https://firebase.google.com/docs/reference/js/firebase.User
                setUserId(user.uid);
                setInitializing(false);
            } else {
                // No user is signed in.
                setInitializing(false);
                setUserId(null);
            }
        });
    }, []);

    if (initializing) {
        // To find user token...
        console.log("[Routes] initializing...");
        return (<ActivityIndicator size="large" />)
    } else {
        return (
            <NavigationContainer theme={theme}>
                {/* Must explicitly handle isMounted in AuthStack.useEffect()
                Initially, userId is null and AuthStack useEffect is activated
                but components did not mount */}
                { userId ? <AppStack/> : <AuthStack/> }
            </NavigationContainer>
        )
    }
}

export default Routes;
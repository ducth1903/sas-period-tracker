import React, { useContext, useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { getAuth, onAuthStateChanged } from "firebase/auth";

import { AuthContext } from './AuthProvider';
import AuthStack from './AuthStack';
import AppStack from './AppStack';
import SurveyStack from './SurveyStack';

// Loading env variables
import getEnvVars from '../environment';
const { API_URL } = getEnvVars();

const Routes = () => {
    const auth = getAuth();
    const { userId, setUserId, hasDoneSurvey, setHasDoneSurvey } = useContext(AuthContext);
    const [initializing, setInitializing] = useState(true);

    async function checkHasDoneSurvey() {
        try {
            let response = await fetch(`${API_URL}/users/${userId}`);
            let json = await response.json();
            setHasDoneSurvey(json.hasDoneSurvey);
        }
        catch (error) {
            setHasDoneSurvey(false);
            console.log(`[Routes] checkHasDoneSurvey error: ${error}`);
        }
    }
    
    // Authentication State Observer
    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (userId) {
                // User is signed in, see docs for a list of available properties
                // https://firebase.google.com/docs/reference/js/firebase.User
                setUserId(user.uid);
                checkHasDoneSurvey();
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
            <NavigationContainer>
                {/* Must explicitly handle isMounted in AuthStack.useEffect()
                Initially, userId is null and AuthStack useEffect is activated
                but components did not mount */}
                {userId ? (hasDoneSurvey ? <AppStack /> : <SurveyStack/>) : <AuthStack />}
            </NavigationContainer>
        )
    }
}

export default Routes;
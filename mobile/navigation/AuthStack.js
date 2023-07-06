import React, { useEffect, useState, useContext } from 'react';
import { StyleSheet, View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
// import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';

import OnboardingScreen from '../screens/Authentication/OnboardingScreen';
import LandingScreen from '../screens/Authentication/LandingScreen';
import LoginScreen from '../screens/Authentication/LoginScreen';
import SignupScreen from '../screens/Authentication/SignupScreen';
import ForgotPasswordScreen from '../screens/Authentication/ForgotPasswordScreen';
import LoadingIndicator from '../components/LoadingIndicator';
import { AuthContext } from './AuthProvider';
import i18n from '../translations/i18n';

const Stack = createStackNavigator();

const AuthStack = () => {
  const { setUserId, getToken } = useContext(AuthContext);
  const [initializing, setInitializing] = useState(true);
  const [isFirstLaunch, setIsFirstLaunch] = useState(null);     // Only show OnboardingScreen on first-time launch

  useEffect(() => {
    let isMounted = true;

    (async () => {
      let myToken = await getToken();
      if (myToken !== null) {
        console.log('[AuthStack] useEffect: user found in AsyncStorage');
        // let user_lastLoginAt = myToken.toJSON().lastLoginAt;
        // console.log('here in AuthStack: user_lastLoginAt = ', user_lastLoginAt);
        if (isMounted) { setUserId(myToken.uid); }
      } else {
        console.log('[AuthStack] useEffect: no user found in AsyncStorage');
        if (isMounted) { setUserId(null); }
      }
    })()

    AsyncStorage.getItem('alreadyLaunched')
      .then(value => {
        if (value == null) {
          AsyncStorage.setItem('alreadyLaunched', 'true')
          if (isMounted) { setIsFirstLaunch(true) }
        } else {
          if (isMounted) { setIsFirstLaunch(false) }
        }
      })

    if (initializing) {
      if (isMounted) { setInitializing(false); }
    }

    return () => { isMounted = false }
  }, []);   // end useEffect()

  if (initializing || isFirstLaunch == null) {
    console.log("[Routes] initializing...");
    return (<LoadingIndicator />)
  }

  return (
    <View style={styles.container}>
      <Stack.Navigator
        screenOptions={{
          headerMode: 'screen'
        }}>
        {isFirstLaunch ? (
          <Stack.Screen
            name="OnboardingScreen"
            component={OnboardingScreen}
            options={{ header: () => null }} />
        ) : null}
        <Stack.Screen
          name="LandingScreen"
          component={LandingScreen}
          options={{ header: () => null, title: "" }} />
        <Stack.Screen
          name="LoginScreen"
          component={LoginScreen}
          options={{ title: "" }} />
        <Stack.Screen
          name="SignupScreen"
          component={SignupScreen}
          options={{ title: "" }} />
        <Stack.Screen
          name="ForgotPasswordScreen"
          component={ForgotPasswordScreen}
          options={{ title: i18n.t('authentication.forgotPassword') }} />
        {/* <StatusBar style="auto" /> */}
      </Stack.Navigator>
    </View>
  );
} // end AuthStack()

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FEFFF4',
    justifyContent: 'center',
  },
  textStyle: {
    fontSize: 25,
    color: "red"
  },
});


export default AuthStack;
import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { DefaultTheme, Provider as PaperProvider } from "react-native-paper";
// import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';

import OnboardingScreen from '../screens/Authentication/OnboardingScreen';
import LandingScreem from '../screens/Authentication/LandingScreen';
import LoginScreen from '../screens/Authentication/LoginScreen';
import SignupScreen from '../screens/Authentication/SignupScreen';

const Stack = createStackNavigator();

const AuthStack = () => {
    console.log("in AuthStack...");

    // Only show OnboardingScreen on first-time launch
    const [isFirstLaunch, setIsFirstLaunch] = React.useState(null);
    useEffect(() => {
        AsyncStorage.getItem('alreadyLaunched')
        .then(value => {
            if (value==null) { 
            AsyncStorage.setItem('alreadyLaunched', 'true')
            setIsFirstLaunch(true)
            } else {
            setIsFirstLaunch(false)
            }
        })
    }, []);

    // Then, just need to check against isFirstLaunch...
    return (
        <View style={styles.container}>
        <Stack.Navigator initialRouteName="LandingScreen">
            {/* <PaperProvider theme={theme}> */}
                <Stack.Screen 
                    name="OnboardingScreen" 
                    component={OnboardingScreen} 
                    options={ {header: ()=>null} }/>
                <Stack.Screen 
                    name="LandingScreen" 
                    component={LandingScreem} 
                    options={ {header: ()=>null} }/>
                <Stack.Screen 
                    name="LoginScreen" 
                    component={LoginScreen} 
                    options={ {title: "Log in"} }/>
                <Stack.Screen 
                    name="SignupScreen" 
                    component={SignupScreen}
                    options={ {title: "Sign up"} } />
                {/* <StatusBar style="auto" /> */}
            {/* </PaperProvider> */}
        </Stack.Navigator>
        </View>
  );
} // end AuthStack()

// Three dots syntax is "property spread notation"
const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: '#f7c5ae',
    accent: '#f1c40f',
  },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    // alignItems: 'center',
    justifyContent: 'center',
  },

  textStyle: {
    fontSize: 25,
    color: "red"
  },
});


export default AuthStack;
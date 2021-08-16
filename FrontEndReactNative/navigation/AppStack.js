import React from 'react';
import { StyleSheet } from 'react-native';
// import { createStackNavigator } from '@react-navigation/stack';
import { createMaterialBottomTabNavigator  } from '@react-navigation/material-bottom-tabs';
import { FontAwesome, Foundation, MaterialIcons } from '@expo/vector-icons';

import HomeScreen from '../screens/HomeScreen';
import PeriodCalendarScreen from '../screens/PeriodCalendarScreen';
import SettingScreen from '../screens/SettingScreen';
import ResourceStack from '../screens/Resource/ResourceStack';
// import TestScreen from '../screens/TestScreen';

// const Stack = createStackNavigator();
const Tab = createMaterialBottomTabNavigator();

const AppStack = () => {
    console.log("in AppStack...");
    return (
        // <Stack.Navigator initialRouteName="Home" screenOptions={headerNavigation}>
        //     <Stack.Screen name="Home" component={Home} options={ {header: ()=>null} } />
        // </Stack.Navigator>
        <Tab.Navigator initialRouteName="HomeScreen" barStyle={{ backgroundColor: '#E1EEDD' }} >
            <Tab.Screen 
                name="HomeScreen" 
                component={HomeScreen} 
                options={{
                    // header: ()=>null, 
                    tabBarLabel: "Home",
                    tabBarIcon: () => (<FontAwesome name="home" size={24} color="#183A1D" />)
                }} />
            <Tab.Screen 
                name="PeriodCalendarScreen" 
                component={PeriodCalendarScreen} 
                options={{ 
                    tabBarLabel: "My Period",
                    tabBarIcon: () => (<FontAwesome name="calendar" size={24} color="#183A1D" />)
                }} />
            {/* <Tab.Screen 
                name="ResourceScreen" 
                component={ResourceScreen} 
                options={{
                    tabBarLabel: "Resources",
                    tabBarIcon: () => (<Foundation name="clipboard-notes" size={24} color="#183A1D" />)
                }} /> */}
            <Tab.Screen 
                name="ResourceStack" 
                component={ResourceStack} 
                options={{
                    tabBarLabel: "Resources",
                    tabBarIcon: () => (<Foundation name="clipboard-notes" size={24} color="#183A1D" />)
                }} />
            <Tab.Screen 
                name="SettingScreen" 
                component={SettingScreen} 
                options={{
                    tabBarLabel: "Settings",
                    tabBarIcon: () => (<MaterialIcons name="settings" size={24} color="#183A1D" />)
                }} />
            {/* <Tab.Screen 
                name="TestScreen" 
                component={TestScreen} 
                options={{
                    tabBarLabel: "Test",
                    tabBarIcon: () => (<MaterialIcons name="settings" size={24} color="#183A1D" />)
                }} /> */}
        </Tab.Navigator>
    );
}

const styles = StyleSheet.create({
    tabNavigationStyle: {
        // position: 'absolute',
        // bottom: 25,
        // left: 20,
        // right: 20,
        // elevation: 0,
        backgroundColor: '#ffffff',
        // borderRadius: 15,
        // height: 90
    }
})

const headerNavigation = {
    headerStyle: { backgroundColor: '#f7c5ae' },
    headerTintColor: '#fff',
    headerTitleStyle: { fontWeight: 'bold' },
}

export default AppStack;

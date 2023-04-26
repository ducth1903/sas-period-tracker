import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesome, Foundation, MaterialIcons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';

import HomeScreen from '../screens/HomeScreen';
// import PeriodCalendarScreen from '../screens/PeriodCalendarScreen';
import PeriodCalendarScreen from '../screens/PeriodCalendarScreen';
import SettingScreen from '../screens/SettingScreen';
import ResourceStack from '../screens/Resource/ResourceStack';

const Tab = createBottomTabNavigator();

const AppStack = () => {
    return (
        <>
            <Tab.Navigator initialRouteName="HomeScreen" barStyle={{ backgroundColor: '#E1EEDD' }}
                screenOptions={{ headerShown: false }}>
                <Tab.Screen
                    name="HomeScreen"
                    component={HomeScreen}
                    options={{
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
            </Tab.Navigator>
            <Toast />
        </>
    );
};

// const styles = StyleSheet.create({
//     tabNavigationStyle: {
//         // position: 'absolute',
//         // bottom: 25,
//         // left: 20,
//         // right: 20,
//         // elevation: 0,
//         backgroundColor: '#ffffff',
//         // borderRadius: 15,
//         // height: 90
//     }
// });

// const headerNavigation = {
//     headerStyle: { backgroundColor: '#f7c5ae' },
//     headerTintColor: '#fff',
//     headerTitleStyle: { fontWeight: 'bold' },
// };

export default AppStack;

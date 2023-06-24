import React, { useContext } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesome, Foundation, MaterialCommunityIcons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';

import HomeScreen from '../screens/HomeScreen';
import PeriodCalendarScreen from '../screens/PeriodCalendarScreen';
import SettingScreen from '../screens/SettingScreen';
import ResourceStack from '../screens/Resource/ResourceStack';
import i18n from '../translations/i18n';
import { SettingsContext } from './SettingsProvider';

const SIZE_ICON_FOCUSED = 30;
const SIZE_ICON_UNFOCUSED = 24;

const Tab = createBottomTabNavigator();

const AppStack = () => {
    // make this component aware of the user's current language selection state so it refreshes on change
    const { selectedSettingsLanguage } = useContext(SettingsContext);
    
    return (
        <>
            <Tab.Navigator initialRouteName="HomeScreen"
                screenOptions={{
                    headerShown: false,
                    tabBarActiveTintColor: 'tomato',
                    tabBarInactiveTintColor: 'gray',
                    tabBarStyle: { backgroundColor: 'rgba(254 255 244 / 1.0)' }
                }}
            >
                <Tab.Screen
                    name="HomeScreen"
                    component={HomeScreen}
                    sx={{}}
                    options={{
                        tabBarLabel: i18n.t('navigation.home'),
                        tabBarIcon: ({ focused }) => (<FontAwesome name="home" size={focused ? SIZE_ICON_FOCUSED : SIZE_ICON_UNFOCUSED} color="#183A1D" />)
                    }} />
                <Tab.Screen
                    name="PeriodCalendarScreen"
                    component={PeriodCalendarScreen}
                    options={{
                        tabBarLabel: i18n.t('navigation.analysis'),
                        tabBarIcon: ({ focused }) => (<FontAwesome name="calendar" size={focused ? SIZE_ICON_FOCUSED : SIZE_ICON_UNFOCUSED} color="#183A1D" />)
                    }} />
                <Tab.Screen
                    name="ResourceStack"
                    component={ResourceStack}
                    options={{
                        tabBarLabel: i18n.t('navigation.education'),
                        tabBarIcon: ({ focused }) => (<Foundation name="clipboard-notes" size={focused ? SIZE_ICON_FOCUSED : SIZE_ICON_UNFOCUSED} color="#183A1D" />)
                    }} />
                <Tab.Screen
                    name="SettingScreen"
                    component={SettingScreen}
                    options={{
                        tabBarLabel: i18n.t('navigation.settings'),
                        tabBarIcon: ({ focused }) => (<MaterialCommunityIcons name="account-circle-outline" size={focused ? SIZE_ICON_FOCUSED : SIZE_ICON_UNFOCUSED} color="#183A1D" />)
                    }} />
            </Tab.Navigator>
            <Toast />
        </>
    );
};

export default AppStack;

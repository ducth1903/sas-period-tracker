import React, { useContext } from 'react';
import { StyleSheet, Text, View, Pressable, ScrollView, SafeAreaView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native'; //contains navigator and screen
import {createNativeStackNavigator} from '@react-navigation/native-stack';
// import * as ImagePicker from 'expo-image-picker';
// import BottomSheet from '@gorhom/bottom-sheet';
// import BottomSheetCustomBackground from '../components/BottomSheetCustomBackground';
import AccountInfo from './Settings/AccountInfo';
import SettingsHome from './Settings/SettingsHome';
import LanguageSetting from './Settings/LanguageSetting';
import Notification from './Settings/Notification';
import SecurityPage from './Settings/SecurityPage';
import Survey from './Settings/Survey';
import Contributors from './Settings/Contributors';

const Stack = createNativeStackNavigator();
const SettingScreen = () => {

    return (
        <Stack.Navigator screenOptions={{
            headerStyle: { backgroundColor: '#FEFFF4',  },
            headerShadowVisible: false,
            headerBackTitleVisible: false,
            
          }}>
            <Stack.Screen 
                name="Settings"
                component={SettingsHome} 
                options={{headerShown: false}}
            />
            <Stack.Screen 
                name="Account"
                component={AccountInfo} 
                options={{ 
                    title: "Account Info"
                }}
            />
            <Stack.Screen
                name='Language'
                component={LanguageSetting}
                options={{ 
                    title: "Language/Audio"
                }}
            />
            <Stack.Screen
                name='Notification'
                component={Notification}
                options={{
                    title: "Notification Preferences"
                }}
            />
            <Stack.Screen
                name='SecurityPage'
                component={SecurityPage}
                options={{
                    title: "Security"
                }}
            />
            <Stack.Screen
                name='Survey'
                component={Survey}
                options={{
                    title: "Survey"
                }}
            />
            <Stack.Screen
                name='Contributors'
                component={Contributors}
                options={{
                    title: "Contributors"
                }}
            />
        </Stack.Navigator>
    )
}

export default SettingScreen;
import { Text, View, SafeAreaView, TouchableOpacity } from 'react-native';
import { useState, useContext } from 'react';
import { SettingsContext } from '../../navigation/SettingsProvider';
import i18n from '../../translations/i18n';

export default SecurityPage = () => {
    const { selectedSettingsLanguage } = useContext(SettingsContext);

    // TODO: frontend and backend for password change (modal?)

    return (<SafeAreaView className="flex-1 bg-[#FEFFF4]">
        <View className="p-9 items-center h-screen">
            <TouchableOpacity className="rounded-full bg-dullwhite w-full p-6 my-2"><Text className="text-center">{i18n.t('settings.security.editPassword')}</Text></TouchableOpacity>
            <TouchableOpacity className="rounded-full border-2 border-salmon w-full p-6 my-2">
                <Text className="text-center text-salmon ">{i18n.t('settings.security.deleteAccount')}</Text>
            </TouchableOpacity>
        </View>
    </SafeAreaView>);
}
import { Text, View, SafeAreaView, TouchableOpacity } from 'react-native';
import { useState, useContext } from 'react';
import { SettingsContext } from '../../navigation/SettingsProvider';
import i18n from '../../translations/i18n';

export default Notification = () => {
    const { selectedSettingsLanguage } = useContext(SettingsContext);
    const [isMessageOn, setIsMessageOn] = useState(false);
    const [isPeriodOn, setIsPeriodOn] = useState(false);

    // TODO: backend integration for notification preferences (dynamodb?)

    return (<SafeAreaView className="flex-1 bg-[#FEFFF4]">
        <View className="p-9 h-screen">
            <View className="flex my-4 pt-1 h-1/6">
                <Text className="font-semibold text-xl mb-4">{i18n.t('settings.notificationPreferences.message')}</Text>
                <View className="w-full">
                    <View className={`rounded-full absolute p-4 flex w-7/12 left-0 ${isMessageOn?"bg-teal z-10":"bg-dullwhite z-0"}`}>
                        <Text 
                            className={`text-center font-semibold ${isMessageOn?"text-white":""}`}
                            onPress={()=>setIsMessageOn(!isMessageOn)}>{i18n.t('settings.notificationPreferences.off')}</Text>
                    </View>
                    <View className={`rounded-full absolute p-4 flex w-7/12 right-0 ${isMessageOn?"bg-dullwhite z-0":"bg-teal z-10"}`}>
                        <Text 
                            className={`text-center font-semibold ${!isMessageOn?"text-white":""}`}
                            onPress={()=>setIsMessageOn(!isMessageOn)}>{i18n.t('settings.notificationPreferences.on')}</Text>
                    </View>
                </View>
            </View>
            <View className="flex my-4 pt-1">
                <Text className="font-semibold text-xl mb-4">{i18n.t('settings.notificationPreferences.period')}</Text>
                <View className="w-full">
                    <View className={`rounded-full absolute p-4 flex w-7/12 left-0 ${isPeriodOn?"bg-teal z-10":"bg-dullwhite z-0"}`}>
                        <Text 
                            className={`text-center font-semibold ${isPeriodOn?"text-white":""}`}
                            onPress={()=>setIsPeriodOn(!isPeriodOn)}>{i18n.t('settings.notificationPreferences.off')}</Text>
                    </View>
                    <View className={`rounded-full absolute p-4 flex w-7/12 right-0 ${isPeriodOn?"bg-dullwhite z-0":"bg-teal z-10"}`}>
                        <Text 
                            className={`text-center font-semibold ${!isPeriodOn?"text-white":""}`}
                            onPress={()=>setIsPeriodOn(!isPeriodOn)}>{i18n.t('settings.notificationPreferences.on')}</Text>
                    </View>
                </View>
            </View>
        </View>
    </SafeAreaView>);
}
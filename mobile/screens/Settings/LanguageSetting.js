import { useState, useContext } from 'react';
import { StyleSheet, Text, View, Pressable, SafeAreaView, TouchableOpacity } from 'react-native';
import LanguagePicker from "../../components/LanguagePicker";
import { SettingsContext } from '../../navigation/SettingsProvider';
import i18n from '../../translations/i18n';

export default LanguageSetting = () => {
    const { selectedSettingsLanguage } = useContext(SettingsContext);
    const [isAudioOn, setIsAudioOn] = useState(false);
    
    return (
        <SafeAreaView className="flex-1 bg-[#FEFFF4]">
            <View className="p-9">
                <View className="flex my-4 pt-1 z-50">
                    <Text className="font-semibold text-xl mb-4">{i18n.t('settings.languageAudio.language')}</Text>
                    <LanguagePicker className="z-50"/>
                </View>
                {/* <View className="flex my-4 pt-1 z-0">
                    <Text className="font-semibold text-xl mb-4">{i18n.t('settings.languageAudio.audio')}</Text>
                    <View className="w-full">
                        <View className={`rounded-full absolute p-4 flex w-7/12 left-0 ${isAudioOn?"bg-teal z-10":"bg-dullwhite z-0"}`}>
                            <Text 
                                className={`text-center font-semibold ${isAudioOn?"text-white":""}`}
                                onPress={()=>setIsAudioOn(!isAudioOn)}>{i18n.t('settings.languageAudio.off')}</Text>
                        </View>
                        <View className={`rounded-full absolute p-4 flex w-7/12 right-0 ${isAudioOn?"bg-dullwhite z-0":"bg-teal z-10"}`}>
                            <Text 
                                className={`text-center font-semibold ${!isAudioOn?"text-white":""}`}
                                onPress={()=>setIsAudioOn(!isAudioOn)}>{i18n.t('settings.languageAudio.on')}</Text>
                        </View>
                    </View>
                </View> */}
            </View>
        </SafeAreaView>);
}
const styles = StyleSheet.create({
    formInputContainer: {
        paddingLeft: 25,
        paddingRight: 25,
      },
});
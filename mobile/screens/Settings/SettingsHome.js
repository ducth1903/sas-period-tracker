import { Text, View, Pressable, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import AccountIcon from '../../assets/account_icon.svg'
import { AuthContext } from '../../navigation/AuthProvider';
import { SettingsContext } from '../../navigation/SettingsProvider';
import { useState, useEffect, useContext } from 'react';
import i18n from '../../translations/i18n'

// Loading env variables
import getEnvVars from '../../environment';
const { API_URL } = getEnvVars();

export default SettingsHome = ({navigation}) => {
    const { userId, logout, toggleTheme, getToken } = useContext(AuthContext);
    // introduce this as a state variable so screen is refreshed when it changes
    const { selectedSettingsLanguage } = useContext(SettingsContext);
    const [userToken, setUserToken] = useState('');
    const [userObj, setUserObj] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    const fetchUserData = async () => {
        try {
            const resp = await fetch(`${API_URL}/users/${userId}`, { method: "GET" });
            const resp_json = await resp.json();
            setUserObj(resp_json);
            // getImagePresignedUrl(resp_json['profileImageId']);
            setIsLoading(false);
        } catch (error) {
            console.log("[HomeScreen] fetchUserData() error:", error);
            Toast.show({
                type: 'error',
                text1: 'Failed to fetch from server',
                text2: error
            });
        }
    }

    // init user email
    const fetchUserToken = async () => {
        try {
            let token = await getToken();
            setUserToken(token);
        }
        catch (error) {
            console.log(`[SettingsHome] Error getting token: ${error}]`);
        }
    };

    useEffect(() => {
        fetchUserData();
        fetchUserToken();
    }, []);
    
    return (
    <SafeAreaView className="flex-1 bg-[#FEFFF4]">
        <ScrollView>
            <View className="flex items-center p-7 pb-2 pt-10">
                <AccountIcon/>
                <Text className="py-5 text-xl font-semibold">{userObj.firstName}</Text>
                <TouchableOpacity onPress={()=>navigation.navigate("Account")} className="rounded-full bg-dullwhite w-11/12 p-6 my-2"><Text className="text-center">{i18n.t('settings.accountInfo.title')}</Text></TouchableOpacity>
                <TouchableOpacity onPress={()=>navigation.navigate("Language")} className="rounded-full bg-dullwhite w-11/12 p-6 my-2"><Text className="text-center">{i18n.t('settings.languageAudio.title')}</Text></TouchableOpacity>
                <TouchableOpacity onPress={()=>navigation.navigate("Notification")} className="rounded-full bg-dullwhite w-11/12 p-6 my-2"><Text className="text-center">{i18n.t('settings.notificationPreferences.title')}</Text></TouchableOpacity>
                <TouchableOpacity onPress={()=>navigation.navigate("SecurityPage")} className="rounded-full bg-dullwhite w-11/12 p-6 my-2"><Text className="text-center">{i18n.t('settings.security.title')}</Text></TouchableOpacity>
                <TouchableOpacity onPress={()=>navigation.navigate("Survey")} className="rounded-full bg-dullwhite w-11/12 p-6 my-2"><Text className="text-center">{i18n.t('settings.accountInfo.survey.title')}</Text></TouchableOpacity>
                <TouchableOpacity onPress={()=>navigation.navigate("Contributors")} className="rounded-full bg-dullwhite w-11/12 p-6 my-2"><Text className="text-center">{i18n.t('settings.contributors.title')}</Text></TouchableOpacity>
                <TouchableOpacity className="rounded-full border-2 border-salmon w-11/12 p-6 my-2 " 
                    onPress={() => logout()}><Text className="text-center text-salmon">{i18n.t('settings.logOut.title')}</Text></TouchableOpacity>

                {/* <Pressable mode="contained" onPress={() => logout()}>
                    <Text>Sign Out</Text>
                </Pressable> */}
            </View>
        </ScrollView>
    </SafeAreaView>);
};
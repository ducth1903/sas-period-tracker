import { Text, View, Pressable, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import AccountIcon from '../../assets/account_icon.svg'
import { AuthContext } from '../../navigation/AuthProvider';
import { useContext } from 'react';

export default SettingsHome = ({navigation}) => {
    const { userId, logout, toggleTheme } = useContext(AuthContext);
    return (
    <SafeAreaView className="flex-1 bg-[#FEFFF4]">
        <ScrollView>
            <View className="flex items-center p-7 pb-2 pt-10">
                <AccountIcon/>
                <Text className="py-5 text-xl font-semibold">Name</Text>
                <TouchableOpacity onPress={()=>navigation.navigate("Account")} className="rounded-full bg-dullwhite w-11/12 p-6 my-2"><Text className="text-center">Account Info</Text></TouchableOpacity>
                <TouchableOpacity onPress={()=>navigation.navigate("Language")} className="rounded-full bg-dullwhite w-11/12 p-6 my-2"><Text className="text-center">Language/Audio</Text></TouchableOpacity>
                <TouchableOpacity onPress={()=>navigation.navigate("Notification")} className="rounded-full bg-dullwhite w-11/12 p-6 my-2"><Text className="text-center">Notification Preferences</Text></TouchableOpacity>
                <TouchableOpacity onPress={()=>navigation.navigate("SecurityPage")} className="rounded-full bg-dullwhite w-11/12 p-6 my-2"><Text className="text-center">Security</Text></TouchableOpacity>
                <TouchableOpacity onPress={()=>navigation.navigate("Survey")} className="rounded-full bg-dullwhite w-11/12 p-6 my-2"><Text className="text-center">Survey</Text></TouchableOpacity>
                <TouchableOpacity onPress={()=>navigation.navigate("Contributors")} className="rounded-full bg-dullwhite w-11/12 p-6 my-2"><Text className="text-center">Contributors</Text></TouchableOpacity>
                <TouchableOpacity className="rounded-full border-2 border-salmon w-11/12 p-6 my-2 " 
                    onPress={() => logout()}><Text className="text-center text-salmon">Sign Out</Text></TouchableOpacity>

                {/* <Pressable mode="contained" onPress={() => logout()}>
                    <Text>Sign Out</Text>
                </Pressable> */}
            </View>
        </ScrollView>
    </SafeAreaView>);
};
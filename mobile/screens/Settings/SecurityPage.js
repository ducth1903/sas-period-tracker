import { Text, View, SafeAreaView, TouchableOpacity } from 'react-native';
import { useState } from 'react';

export default SecurityPage = () => {
    const [isMessageOn, setIsMessageOn] = useState(false);
    const [isPeriodOn, setIsPeriodOn] = useState(false);

    return (<SafeAreaView className="flex-1 bg-[#FEFFF4]">
        <View className="p-9 items-center h-screen">
            <TouchableOpacity className="rounded-full bg-dullwhite w-full p-6 my-2"><Text className="text-center">Edit Password</Text></TouchableOpacity>
            <TouchableOpacity className="rounded-full border-2 border-salmon w-full p-6 my-2">
                <Text className="text-center text-salmon ">Delete Account</Text>
            </TouchableOpacity>
        </View>
    </SafeAreaView>);
}
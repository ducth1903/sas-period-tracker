import { Text, View, SafeAreaView, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import EditIcon from '../../assets/edit_icon.svg'
import DateTimePicker from '@react-native-community/datetimepicker';
import { ScrollView } from 'react-native-gesture-handler';
import DateDisplay from '../../components/DateDisplay';

export default Survey = () => {
    const [firstPeriod, setFirstPeriod] = useState(false);
    const [recentPeriod, setRecentPeriod] = useState(false);
    const [date, setDate] = useState(new Date());
    const [showPicker, setShowPicker] = useState(false);

    const toggleDatePicker = () => {
        setShowPicker(!showPicker);
    }

    const onChange = ({type}, selectedDate) => {
        if(type == "set"){
            const currentDate = selectedDate;
            setDate(currentDate)
        }
        else{
            toggleDatePicker();
        }
    }

    return (<SafeAreaView className="flex-1 bg-[#FEFFF4]">
    <ScrollView>
        <View className="p-9">
            <View className="flex pt-1">
                <View className="w-full">
                    <Text className="font-semibold text-xl">First Period</Text>
                    <View className={`absolute bottom-1 right-0 ${firstPeriod?"bg-gray p-1 rounded-full":""}`} ><EditIcon onPress={()=>setFirstPeriod(!firstPeriod)}/></View>
                </View>
            </View>
            <DateDisplay/>

            <View className="flex pt-1">
                <View className="w-full">
                    <Text className="font-semibold text-xl">Recent Period</Text>
                    <View className={`absolute bottom-1 right-0 ${recentPeriod?"bg-gray p-1 rounded-full":""}`} ><EditIcon onPress={()=>setRecentPeriod(!recentPeriod)}/></View>
                </View>
            </View>
            <Text className="font-semibold mt-2 text-xl">Start</Text>
            <DateDisplay/>
            {/* <DateTimePicker
                mode="date"
                display="spinner"
                value={date}
                onChange={onChange}
                androidVariant="nativeAndroid"
            /> */}
            <Text className="font-semibold mt-2 text-xl">End</Text>
            <DateDisplay/>
            {/* <DateTimePicker
                mode="date"
                display="spinner"
                value={date}
                onChange={onChange}
                androidVariant="nativeAndroid"
            /> */}
            <TouchableOpacity className="rounded-full border-2 border-salmon w-full p-6 mt-10">
                <Text className="text-center text-salmon">Remove Data</Text>
            </TouchableOpacity>
            <TouchableOpacity className="rounded-full bg-teal w-full p-6 mt-4 mb-10">
                <Text className="text-center text-white">Save Changes</Text>
            </TouchableOpacity>
        </View>
    </ScrollView>
    </SafeAreaView>);
}
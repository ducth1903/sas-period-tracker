import { Text, View, SafeAreaView, TouchableOpacity } from 'react-native';
import { useState, useContext } from 'react';
import EditIcon from '../../assets/edit_icon.svg'
import DateTimePicker from '@react-native-community/datetimepicker';
import { ScrollView } from 'react-native-gesture-handler';
import DateDisplay from '../../components/DateDisplay';
import { SettingsContext } from '../../navigation/SettingsProvider';
import i18n from '../../translations/i18n';

export default Survey = () => {
    const { selectedSettingsLanguage } = useContext(SettingsContext);
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

    // TODO: ScrollPicker refactor + backend integration for survey data (dynamodb?)

    return (<SafeAreaView className="flex-1 bg-[#FEFFF4]">
    <ScrollView>
        <View className="p-9">
            <View className="flex pt-1">
                <View className="w-full">
                    <Text className="font-semibold text-xl">{i18n.t('settings.accountInfo.survey.firstPeriod')}</Text>
                    <View className={`absolute bottom-1 right-0 ${firstPeriod?"bg-gray p-1 rounded-full":""}`} ><EditIcon onPress={()=>setFirstPeriod(!firstPeriod)}/></View>
                </View>
            </View>
            <DateDisplay/>

            <View className="flex pt-1">
                <View className="w-full">
                    <Text className="font-semibold text-xl">{i18n.t('settings.accountInfo.survey.recentPeriod')}</Text>
                    <View className={`absolute bottom-1 right-0 ${recentPeriod?"bg-gray p-1 rounded-full":""}`} ><EditIcon onPress={()=>setRecentPeriod(!recentPeriod)}/></View>
                </View>
            </View>
            <Text className="font-semibold mt-2 text-xl">{i18n.t('settings.accountInfo.survey.start')}</Text>
            <DateDisplay/>
            {/* <DateTimePicker
                mode="date"
                display="spinner"
                value={date}
                onChange={onChange}
                androidVariant="nativeAndroid"
            /> */}
            <Text className="font-semibold mt-2 text-xl">{i18n.t('settings.accountInfo.survey.end')}</Text>
            <DateDisplay/>
            {/* <DateTimePicker
                mode="date"
                display="spinner"
                value={date}
                onChange={onChange}
                androidVariant="nativeAndroid"
            /> */}
            <TouchableOpacity className="rounded-full border-2 border-salmon w-full p-6 mt-10">
                <Text className="text-center text-salmon">{i18n.t('settings.accountInfo.survey.removeData')}</Text>
            </TouchableOpacity>
            <TouchableOpacity className="rounded-full bg-teal w-full p-6 mt-4 mb-10">
                <Text className="text-center text-white">{i18n.t('settings.accountInfo.survey.saveChanges')}</Text>
            </TouchableOpacity>
        </View>
    </ScrollView>
    </SafeAreaView>);
}
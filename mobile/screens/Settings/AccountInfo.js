import React, { useState, useEffect, useContext } from "react";
import { Text, View, Pressable, ScrollView, SafeAreaView, TextInput, TouchableOpacity } from 'react-native';
import { AuthContext } from '../../navigation/AuthProvider';
import { SettingsContext } from '../../navigation/SettingsProvider';
import AccountIcon from '../../assets/account_icon.svg'
import EditIcon from '../../assets/edit_icon.svg'
import DateTimePicker from '@react-native-community/datetimepicker';
import i18n from '../../translations/i18n';

import Toast from 'react-native-toast-message';

// Loading env variables
import getEnvVars from '../../environment';
const { API_URL } = getEnvVars();

const AccountInfo = () => {
    const { userId } = useContext(AuthContext);
    const { selectedSettingsLanguage } = useContext(SettingsContext);
    const [date, setDate] = useState(new Date());
    const [showPicker, setShowPicker] = useState(false);
    const [nameEdit, setNameEdit] = useState(false);
    const [emailEdit, setEmailEdit] = useState(false);
    const [isEdited, setIsEdited] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [userObj, setUserObj] = useState({});

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

    const onChangeName = async () => {

    }

    const onChangeEmail = async () => {

    }

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

    useEffect(() => {
        fetchUserData();
    }, [])

    return (
        <SafeAreaView className="flex-1 bg-[#FEFFF4]">
            <ScrollView>
                <View className="flex items-center p-9 pb-2 pt-1">
                    <View className="relative items-center w-[130px]">
                        <AccountIcon/>
                        <View  className="absolute bottom-1 right-0" ><EditIcon/></View>
                    </View>
                    <View className="py-12 w-full">
                        <View className="my-3.5">
                            <TextInput
                                className={`w-full border-b-[1px] py-3 font-semibold text-base ${nameEdit?"text-black":"text-turquoise"}`}
                                onChangeText={onChangeName}
                                value={userObj.firstName + " " + userObj.lastName}
                                editable={nameEdit}
                            />
                            <View className={`absolute bottom-2 right-0 ${nameEdit?"bg-gray p-1 rounded-full":""}`} ><EditIcon onPress={()=>setNameEdit(!nameEdit)}/></View>
                        </View>
                        <View className="my-3.5">
                            <TextInput
                                className={`w-full border-b-[1px] py-3 font-semibold text-base ${emailEdit?"text-black":"text-turquoise"}`}
                                onChangeText={onChangeEmail}
                                value={userObj.email}
                                editable={emailEdit}
                            />
                            <View  className={`absolute bottom-2 right-0 ${emailEdit?"bg-gray p-1 rounded-full":""}`} ><EditIcon onPress={()=>setEmailEdit(!emailEdit)}/></View>
                        </View>
                        <View className="my-3.5">
                            <TextInput
                                className={`w-full border-b-[1px] py-3 font-semibold text-base ${showPicker?"text-black":"text-turquoise"}`}
                                onChangeText={onChange}
                                value={date.toISOString().slice(0,10).split('-').reverse().join('/')}
                            />
                            <View className={`absolute bottom-2 right-0 ${showPicker?"bg-gray p-1 rounded-full":""}`} ><EditIcon onPress={toggleDatePicker}/></View>
                        </View>
                        {/* TODO: change this to ScrollPicker component in Modal */}
                        {showPicker && <DateTimePicker
                                mode="date"
                                display="spinner"
                                value={date}
                                onChange={onChange}
                            />}
                    </View>
                    <TouchableOpacity 
                        onPress={()=>{
                            setIsEdited(!isEdited)
                            setNameEdit(!nameEdit)
                            setShowPicker(!showPicker)
                            setEmailEdit(!emailEdit)
                        }}  
                        className={`rounded-full w-full p-6 my-2 ${isEdited?"bg-teal":"bg-dullwhite text-white"}`}>
                        <Text className={`text-center ${isEdited?"text-white":""}`}>{isEdited? i18n.t('settings.accountInfo.survey.saveChanges') : i18n.t('settings.accountInfo.editSurveyResponses')}</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>);
}

export default AccountInfo;
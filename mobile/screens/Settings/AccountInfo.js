import React from "react";
import { Text, View, Pressable, ScrollView, SafeAreaView, TextInput, TouchableOpacity } from 'react-native';
import AccountIcon from '../../assets/account_icon.svg'
import EditIcon from '../../assets/edit_icon.svg'
import { useState } from "react";
import DateTimePicker from '@react-native-community/datetimepicker';

const AccountInfo = () => {
    const [name, onChangeName] = useState('First Name');
    const [date, setDate] = useState(new Date());
    const [showPicker, setShowPicker] = useState(false);
    const [nameEdit, setNameEdit] = useState(false);
    const [email, onChangeEmail] = useState('testuser1@gmail.com');
    const [emailEdit, setEmailEdit] = useState(false);
    const [isEdited, setIsEdited] = useState(false);

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
                                value={name}
                                editable={nameEdit}
                            />
                            <View className={`absolute bottom-2 right-0 ${nameEdit?"bg-gray p-1 rounded-full":""}`} ><EditIcon onPress={()=>setNameEdit(!nameEdit)}/></View>
                        </View>
                        <View className="my-3.5">
                            <TextInput
                                className={`w-full border-b-[1px] py-3 font-semibold text-base ${emailEdit?"text-black":"text-turquoise"}`}
                                onChangeText={onChangeEmail}
                                value={email}
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
                        <Text className={`text-center ${isEdited?"text-white":""}`}>{isEdited?"Save changes":"Edit survey response"}</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>);
}

export default AccountInfo;
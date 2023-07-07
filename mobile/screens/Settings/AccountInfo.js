import React, { useState, useEffect, useContext, useCallback } from "react";
import { Text, View, Pressable, ScrollView, SafeAreaView, TextInput, TouchableOpacity } from 'react-native';
import { AuthContext } from '../../navigation/AuthProvider';
import { SettingsContext } from '../../navigation/SettingsProvider';
import AccountIcon from '../../assets/account_icon.svg'
import EditIcon from '../../assets/edit_icon.svg'
import DateTimePicker from '@react-native-community/datetimepicker';
import i18n from '../../translations/i18n';
import ScrollPicker from "../../components/ScrollPicker";

import Modal from 'react-native-modal';
import Toast from 'react-native-toast-message';

// Loading env variables
import getEnvVars from '../../environment';
const { API_URL } = getEnvVars();

const AccountInfo = () => {
    const { userId } = useContext(AuthContext);
    const { selectedSettingsLanguage } = useContext(SettingsContext);
    const [date, setDate] = useState(new Date());
    const [showPicker, setShowPicker] = useState(false);
    const [dobMonth, setDobMonth] = useState(date.getMonth() + 1);
    const [dobYear, setDobYear] = useState(date.getFullYear());
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [firstNameEdit, setFirstNameEdit] = useState(false);
    const [lastNameEdit, setLastNameEdit] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [userObj, setUserObj] = useState({});

    const scrollPickerItemHeight = 46;

    const fetchUserData = async () => {
        try {
            console.log(`fetching from ${API_URL}/users/${userId}`)
            const resp = await fetch(`${API_URL}/users/${userId}`, { method: "GET" });
            const resp_json = await resp.json();
            setUserObj(resp_json);
            setFirstName(resp_json.firstName);
            setLastName(resp_json.lastName);
            let dobParts = resp_json.dob.split("/");
            setDobMonth(dobParts[0].slice(1));
            setDobYear(dobParts[1]);
            setIsLoading(false);
        } catch (error) {
            console.log("[AccountInfo] fetchUserData() error:", error);
            Toast.show({
                type: 'error',
                text1: i18n.t('errors.failedToRetrieveUserData'),
                text2: error
            });
        }
    }

    const onDataChange = async () => {
        try {
            const resp = await fetch(`${API_URL}/users/${userId}`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    firstName: firstName,
                    lastName: lastName,
                    dob: `${dobMonth < 10 ? '0' : ''}${dobMonth}/${dobYear}`
                })
            });
            const resp_json = await resp.json();
            console.log(`[AccountInfo] onDataChange() response: ${JSON.stringify(resp_json)}`);
        }
        catch (error) {
            console.log("[AccountInfo] onDataChange() error:", error);
            Toast.show({
                type: 'error',
                text1: i18n.t('errors.failedToUploadUserData'),
                text2: error
            });
        }
    }
    
    const toggleDatePicker = () => {
        setShowPicker(!showPicker);
    }

    useEffect(() => {
        fetchUserData();
    }, [])

    const handleMonthChanged = useCallback(({ viewableItems }) => {
        if (!viewableItems[1]) return;
        let centerViewable = viewableItems[1].item.id;
        setDobMonth(centerViewable);
    }, [])

    const handleYearChanged = useCallback(({ viewableItems }) => {
        if (!viewableItems[1]) return;
        let centerViewable = viewableItems[1].item.id;
        setDobYear(centerViewable);
    }, [])

    return (
        <SafeAreaView className="flex-1 bg-[#FEFFF4]">
            <ScrollView>
                <View className="flex items-center p-9 pb-2 pt-1">
                    <View className="relative items-center w-[130px]">
                        <AccountIcon/>
                    </View>
                    <View className="py-12 w-full">
                        <View className="my-3.5">
                            <TextInput
                                className={`w-full border-b-[1px] py-3 font-semibold text-base ${firstNameEdit?"text-black":"text-turquoise"}`}
                                onChangeText={setFirstName}
                                value={firstName}
                                editable={firstNameEdit}
                            />
                            <View className={`absolute bottom-2 right-0 ${firstNameEdit?"bg-gray p-1 rounded-full":""}`} >
                                <Pressable
                                    onPress={()=>{
                                        const negatedNameEdit = !firstNameEdit;
                                        setFirstNameEdit(negatedNameEdit)
                                    }}
                                    hitSlop={25}
                                >
                                    <EditIcon />  
                                </Pressable>
                            </View>
                        </View>
                        <View className="my-3.5">
                            <TextInput
                                className={`w-full border-b-[1px] py-3 font-semibold text-base ${lastNameEdit?"text-black":"text-turquoise"}`}
                                onChangeText={setLastName}
                                value={lastName}
                                editable={lastNameEdit}
                            />
                            <View className={`absolute bottom-2 right-0 ${lastNameEdit?"bg-gray p-1 rounded-full":""}`} >
                                <Pressable
                                    onPress={()=>{setLastNameEdit(!lastNameEdit)}}
                                    hitSlop={25}
                                >
                                    <EditIcon />
                                </Pressable>
                            </View>
                        </View>
                        {/* <View className="my-3.5">
                            <TextInput
                                className={`w-full border-b-[1px] py-3 font-semibold text-base ${emailEdit?"text-black":"text-turquoise"}`}
                                onChangeText={onChangeEmail}
                                value={userObj.email}
                                editable={emailEdit}
                            />
                            <View  className={`absolute bottom-2 right-0 ${emailEdit?"bg-gray p-1 rounded-full":""}`} >
                                <EditIcon onPress={()=>{
                                    const negatedEmailEdit = !emailEdit;
                                    if (negatedEmailEdit) {
                                        onChangeEmail();
                                    }
                                    setLastNameEdit(negatedEmailEdit)
                                }}/>
                            </View>
                        </View> */}
                        <View className="my-3.5">
                            <TextInput
                                className={`w-full border-b-[1px] py-3 font-semibold text-base ${showPicker?"text-black":"text-turquoise"}`}
                                value={`${dobMonth < 10 ? '0' : ''}${dobMonth}/${dobYear}`}
                            />
                            <View className={`absolute bottom-2 right-0 ${showPicker?"bg-gray p-1 rounded-full":""}`} >
                                <Pressable
                                    onPress={toggleDatePicker}
                                    hitSlop={25}
                                >
                                    <EditIcon />
                                </Pressable>
                            </View>
                        </View>
                        <Modal
                            animationIn={"slideInUp"}
                            animationOut={"slideOutUp"}
                            animationTiming={500}
                            backdropOpacity={0.5}
                            isVisible={showPicker}
                            onBackdropPress={() => {
                                setShowPicker(!showPicker);
                            }}
                            onRequestClose={() => {
                                setShowPicker(!showPicker);
                            }}
                            className="mx-2"
                        >
                        <View className="flex flex-row px-8">
                            <ScrollPicker
                                data={[...Array(12).keys()].map((monthIndex) => {
                                    return {title: new Date(2021, monthIndex, 1).toLocaleString(selectedSettingsLanguage, {month: 'short'}), id: monthIndex}
                                })}
                                initialScrollIndex={dobMonth - 1}
                                onViewableItemsChanged={handleMonthChanged}
                                itemHeight={scrollPickerItemHeight}
                                keyPrefix="month"
                                roundLeft={true}
                            />
                            <ScrollPicker
                                data={[...Array((new Date()).getFullYear()).keys()].map((yearIndex) => {
                                    return {title: yearIndex + 1, id: yearIndex}
                                })}
                                initialScrollIndex={dobYear - 1}
                                onViewableItemsChanged={handleYearChanged}
                                itemHeight={scrollPickerItemHeight}
                                keyPrefix="year"
                                roundRight={true}
                            />
                        </View>
                    </Modal>
                    </View>
                    <TouchableOpacity 
                        onPress={()=>{
                            setFirstNameEdit(false)
                            setShowPicker(false)

                            onDataChange().then(() => {
                                Toast.show({
                                    type: 'success',
                                    text1: i18n.t('settings.accountInfo.changesSavedSuccessfully')
                                })
                            }).catch((error) => {
                                console.log("[AccountInfo] onDataChange() error:", error);
                                Toast.show({
                                    type: 'error',
                                    text1: i18n.t('settings.accountInfo.errorSavingChanges'),
                                    text2: error
                                });
                            });
                        }}  
                        className={`rounded-full w-full p-6 my-2 bg-teal`}>
                        <Text className={`text-center text-offwhite`}>{i18n.t('settings.accountInfo.survey.saveChanges')}</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>);
}

export default AccountInfo;
import { Text, View, TouchableHighlight, SafeAreaView, Pressable, TouchableOpacity } from 'react-native';
import { useState, useContext, useCallback, useEffect } from 'react';

import { ScrollView } from 'react-native-gesture-handler';
import Modal from 'react-native-modal';
import Toast from 'react-native-toast-message';

import ScrollPicker from '../../components/ScrollPicker';
import EditIcon from '../../assets/edit_icon.svg'
import FormInput from '../../components/FormInput';
import { AuthContext } from '../../navigation/AuthProvider';
import { SettingsContext } from '../../navigation/SettingsProvider';
import i18n from '../../translations/i18n';

import getEnvVars from '../../environment';
const { API_URL } = getEnvVars();

export default Survey = () => {
    const { userId } = useContext(AuthContext);
    const { selectedSettingsLanguage } = useContext(SettingsContext);
    const [userObj, setUserObj] = useState({}); // user object from fetchUserInfoData()
    const [firstPeriod, setFirstPeriod] = useState(false);
    const [recentPeriod, setRecentPeriod] = useState(false);
    const [date, setDate] = useState(new Date());
    const [showPicker, setShowPicker] = useState(false);

    const scrollPickerItemHeight = 46;

    const [answers, setAnswers] = useState({ 
        // all can be null if user chooses not to answer
        "gottenFirstPeriod": "dontrememberornotrecorded", // "yes", "no", "dontrememberornotrecorded"
        "firstPeriodYearMonth": "dontrememberornotrecorded", // YYYY-MM or "dontrememberornotrecorded"
        "recentPeriodYearMonthDayStart": "dontrememberornotrecorded", // YYYY-MM-DD or "dontrememberornotrecorded"
        "recentPeriodYearMonthDayEnd": "dontrememberornotrecorded", // YYYY-MM-DD or "dontrememberornotrecorded"
    });

    const [firstPeriodModalVisible, setFirstPeriodModalVisible] = useState(false);
    const [firstPeriodStartYear, setFirstPeriodStartYear] = useState(new Date().getFullYear());
    const [firstPeriodStartMonth, setFirstPeriodStartMonth] = useState(new Date().getMonth() + 1);
    
    const [recentPeriodModalVisible, setRecentPeriodModalVisible] = useState(false);
    const [recentPeriodStartDate, setRecentPeriodStartDate] = useState({
        day: new Date().getDate(),
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
    });
    const [recentPeriodEndDate, setRecentPeriodEndDate] = useState({
        day: new Date().getDate(),
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
    });

    async function fetchUserInfoData() {
        try {
            const resp = await fetch(`${API_URL}/users/${userId}`, { method: "GET" });
            const userObjCopy = await resp.json();
            setUserObj(userObjCopy);
            setAnswers(userObjCopy.surveyAnswers);

            const firstPeriodYearMonth = userObjCopy.surveyAnswers.firstPeriodYearMonth;
            if (firstPeriodYearMonth !== "dontrememberornotrecorded") {
                setFirstPeriodStartYear(firstPeriodYearMonth.split("-")[0]);
                setFirstPeriodStartMonth(firstPeriodYearMonth.split("-")[1]);
            }
            const recentPeriodYearMonthDayStart = userObjCopy.surveyAnswers.recentPeriodYearMonthDayStart;
            if (recentPeriodYearMonthDayStart !== "dontrememberornotrecorded") {
                setRecentPeriodStartDate({
                    day: recentPeriodYearMonthDayStart.split("-")[2],
                    month: recentPeriodYearMonthDayStart.split("-")[1],
                    year: recentPeriodYearMonthDayStart.split("-")[0],
                });
            }
            const recentPeriodYearMonthDayEnd = userObjCopy.surveyAnswers.recentPeriodYearMonthDayEnd;
            if (recentPeriodYearMonthDayEnd !== "dontrememberornotrecorded") {
                setRecentPeriodEndDate({
                    day: recentPeriodYearMonthDayEnd.split("-")[2],
                    month: recentPeriodYearMonthDayEnd.split("-")[1],
                    year: recentPeriodYearMonthDayEnd.split("-")[0],
                });
            }
        } catch (error) {
            console.log("[HomeScreen] fetchUserData() error:", error);
        }
    }

    const handleYearChangedFirstPeriod = useCallback(({ viewableItems }) => {
        if (!viewableItems[1]) return;
        let centerViewable = viewableItems[1].item.id;
        setFirstPeriodStartYear(centerViewable);
    }, []);

    const handleMonthChangedFirstPeriod = useCallback(({ viewableItems }) => {
        if (!viewableItems[1]) return;
        let centerViewable = viewableItems[1].item.id;
        setFirstPeriodStartMonth(centerViewable);
    }, []);

    const handleDayChangedRecentPeriodStart = useCallback(({ viewableItems }) => {
        if (!viewableItems[1]) return;
        let centerViewable = viewableItems[1].item.id;
        setRecentPeriodStartDate((prevState) => ({
            ...prevState,
            day: centerViewable,
        }));
    }, []);

    const handleMonthChangedRecentPeriodStart = useCallback(({ viewableItems }) => {
        if (!viewableItems[1]) return;
        let centerViewable = viewableItems[1].item.id;
        setRecentPeriodStartDate((prevState) => ({
            ...prevState,
            month: centerViewable,
        }));
    }, []);

    const handleYearChangedRecentPeriodStart = useCallback(({ viewableItems }) => {
        if (!viewableItems[1]) return;
        let centerViewable = viewableItems[1].item.id;
        setRecentPeriodStartDate((prevState) => ({
            ...prevState,
            year: centerViewable,
        }));
    }, []);

    const handleDayChangedRecentPeriodEnd = useCallback(({ viewableItems }) => {
        if (!viewableItems[1]) return;
        let centerViewable = viewableItems[1].item.id;
        setRecentPeriodEndDate((prevState) => ({
            ...prevState,
            day: centerViewable + 1,
        }));
    }, []);

    const handleMonthChangedRecentPeriodEnd = useCallback(({ viewableItems }) => {
        if (!viewableItems[1]) return;
        let centerViewable = viewableItems[1].item.id;
        setRecentPeriodEndDate((prevState) => ({
            ...prevState,
            month: centerViewable,
        }));
    }, []);

    const handleYearChangedRecentPeriodEnd = useCallback(({ viewableItems }) => {
        if (!viewableItems[1]) return;
        let centerViewable = viewableItems[1].item.id;
        setRecentPeriodEndDate((prevState) => ({
            ...prevState,
            year: centerViewable,
        }));
    }, []);

    const postSurveyData = async (remove=false) => {
        try {
            const resp = await fetch(`${API_URL}/users/${userId}`, { method: "GET" });
            const userObjCopy = await resp.json();
            setUserObj(userObjCopy);

            console.log(`answers: ${JSON.stringify(answers)}`)
            
            // update the user object with the survey data
            userObjCopy.surveyAnswers = answers;
            
            await fetch(`${API_URL}/users/${userId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: remove ? JSON.stringify({
                    ...userObjCopy,
                    "surveyAnswers": {
                        "firstPeriodYearMonth": "dontrememberornotrecorded",
                        "recentPeriodYearMonthDayStart": "dontrememberornotrecorded",
                        "recentPeriodYearMonthDayEnd": "dontrememberornotrecorded",
                        "gottenFirstPeriod": "dontrememberornotrecorded",
                    }
                })
                : JSON.stringify(userObjCopy),
            });
            Toast.show({
                type: 'success',
                text1: i18n.t('settings.accountInfo.changesSavedSuccessfully'),
            })
            fetchUserInfoData(); // refresh
        }
        catch (error) {
            console.log("[SurveyScreen] postSurveyData() error:", error);
            Toast.show({
                type: 'error',
                text1: i18n.t('settings.accountInfo.errorSavingChanges'),
            })
        }
    }
    
    useEffect(() => {
        const monthNumString = firstPeriodStartMonth < 10 ? `0${firstPeriodStartMonth}` : `${firstPeriodStartMonth}`;
        const yearMonthString = `${firstPeriodStartYear}-${monthNumString}`;
        setAnswers((prevState) => ({ ...prevState, firstPeriodYearMonth: yearMonthString }));
    }, [firstPeriodStartMonth, firstPeriodStartYear])

    useEffect(() => {
        const startDay = recentPeriodStartDate.day;
        const startMonth = recentPeriodStartDate.month;
        const startYear = recentPeriodStartDate.year;
        const endDay = recentPeriodEndDate.day;
        const endMonth = recentPeriodEndDate.month;
        const endYear = recentPeriodEndDate.year;

        if (startDay && startMonth && startYear && endDay && endMonth && endYear) {
            const startDateString = `${startYear}-${startMonth < 10 ? `0${startMonth}` : startMonth}-${startDay < 10 ? `0${startDay}` : startDay}`;
            const endDateString = `${endYear}-${endMonth < 10 ? `0${endMonth}` : endMonth}-${endDay < 10 ? `0${endDay}` : endDay}`;
            setAnswers((prevState) => ({ ...prevState, recentPeriodYearMonthDayStart: startDateString, recentPeriodYearMonthDayEnd: endDateString }));
        }
    }, [recentPeriodStartDate, recentPeriodEndDate])

    useEffect(() => {
        fetchUserInfoData();
    }, []);

    return (
        <SafeAreaView className="flex-1 bg-[#FEFFF4]">
            <ScrollView clasName="px-20" contentContainerStyle={{paddingHorizontal: 20}}>
                <View className="flex-row">
                    <Text className="text-greydark text-[18px] font-bold mt-8">
                        {i18n.t('survey.whenStartFirstPeriod.whenDidYouStartYourFirstPeriod')}
                    </Text>
                    <View className={`absolute bottom-1 right-0 ${firstPeriodModalVisible?"bg-gray p-1 rounded-full":""}`} >
                        <Pressable
                            onPress={() => setFirstPeriodModalVisible(!firstPeriodModalVisible)}
                            hitSlop={25}
                        >
                            <EditIcon/>
                        </Pressable>
                    </View>
                </View>
                <FormInput
                    editable={false}
                    labelValue="firstPeriodStart"
                    placeholderText={answers.firstPeriodYearMonth === "dontrememberornotrecorded" ? i18n.t('survey.whenStartFirstPeriod.iDontRemember') : answers.firstPeriodYearMonth.replaceAll("00", "0")}
                    isRequired={true}
                    iconType="user"
                    color="black"
                    keyboardType="email-address"
                    value={answers.firstPeriodYearMonth === "dontrememberornotrecorded" ? i18n.t('survey.whenStartFirstPeriod.iDontRemember') : answers.firstPeriodYearMonth.replaceAll("00", "0")}
                    onChangeText={(val) => {}} // logic handled in ScrollPickers
                    onFocus={() => {}}
                />
                <TouchableHighlight
                    className="flex rounded-[50px] items-center justify-center px-3 py-1 my-3"
                    style = {{ backgroundColor: '#005C6A'}}
                    underlayColor="#5B9F8F"
                    onPress={() => { setAnswers((prevState) => ({ ...prevState, firstPeriodYearMonth: "dontrememberornotrecorded" }))}}
                >
                    <View className="flex-row items-center">
                        <Text className="text-offwhite text-[14px] font-bold py-1">
                            {i18n.t('survey.whenStartFirstPeriod.iDontRemember')}
                        </Text>
                    </View>
                </TouchableHighlight>
                <Modal
                    animationIn={"slideInUp"}
                    animationOut={"slideOutUp"}
                    animationTiming={500}
                    backdropOpacity={0.5}
                    isVisible={firstPeriodModalVisible}
                    onBackdropPress={() => {
                        setFirstPeriodModalVisible(!firstPeriodModalVisible);
                    }}
                    onRequestClose={() => {
                        setFirstPeriodModalVisible(!firstPeriodModalVisible);
                    }}
                    className="mx-2"
                >
                    <View className="flex flex-row px-8">
                        <ScrollPicker
                            data={[...Array(12).keys()].map((monthIndex) => {
                                return {title: new Date(2021, monthIndex, 1).toLocaleString(selectedSettingsLanguage, {month: 'short'}), id: monthIndex}
                            })}
                            initialScrollIndex={firstPeriodStartMonth - 1}
                            onViewableItemsChanged={handleMonthChangedFirstPeriod}
                            itemHeight={scrollPickerItemHeight}
                            keyPrefix="month"
                            roundLeft={true}
                        />
                        <ScrollPicker
                            data={[...Array((new Date()).getFullYear()).keys()].map((yearIndex) => {
                                return {title: yearIndex + 1, id: yearIndex}
                            })}
                            initialScrollIndex={firstPeriodStartYear - 1}
                            onViewableItemsChanged={handleYearChangedFirstPeriod}
                            itemHeight={scrollPickerItemHeight}
                            keyPrefix="year"
                            roundRight={true}
                        />
                    </View>
                </Modal>
                    
                
                {/* Two more sets of D/M/Y ScrollPickers, one for recentPeriodStartDate, one for recentPeriodEndDate */}
                <View className="flex-row">
                    <Text className="text-greydark text-[18px] font-bold mt-8">
                        {i18n.t('survey.whenMostRecentPeriod.whenWasYourMostRecentPeriod')}
                    </Text>
                    <View className={`absolute bottom-1 right-0 ${recentPeriodModalVisible?"bg-gray p-1 rounded-full":""}`} >
                        <Pressable
                            onPress={() => setRecentPeriodModalVisible(!recentPeriodModalVisible)}
                            hitSlop={25}
                        >
                            <EditIcon/>
                        </Pressable>
                    </View>
                </View>
                <Text className="text-greydark text-[18px] font-bold my-2">
                    {i18n.t('analysis.trends.export.start')}
                </Text>
                <FormInput
                    editable={false}
                    labelValue="recentPeriodStart"
                    placeholderText={answers.recentPeriodYearMonthDayStart === "dontrememberornotrecorded" ? i18n.t('survey.whenStartFirstPeriod.iDontRemember') : answers.recentPeriodYearMonthDayStart.replaceAll("00", "0")}
                    isRequired={true}
                    iconType="user"
                    color="black"
                    keyboardType="email-address"
                    value={answers.recentPeriodYearMonthDayStart === "dontrememberornotrecorded" ? i18n.t('survey.whenStartFirstPeriod.iDontRemember') : answers.recentPeriodYearMonthDayStart.replaceAll("00", "0")}
                    onChangeText={(val) => {}} // logic handled in ScrollPickers
                    onFocus={() => {}}
                />
                <Text className="text-greydark text-[18px] font-bold my-2">
                    {i18n.t('analysis.trends.export.end')}
                </Text>
                <FormInput
                    editable={false}
                    labelValue="recentPeriodEnd"
                    placeholderText={answers.recentPeriodYearMonthDayEnd === "dontrememberornotrecorded" ? i18n.t('survey.whenStartFirstPeriod.iDontRemember') : answers.recentPeriodYearMonthDayEnd.replaceAll("00", "0")}
                    isRequired={true}
                    iconType="user"
                    color="black"
                    keyboardType="email-address"
                    value={answers.recentPeriodYearMonthDayEnd === "dontrememberornotrecorded" ? i18n.t('survey.whenStartFirstPeriod.iDontRemember') : answers.recentPeriodYearMonthDayEnd.replaceAll("00", "0")}
                    onChangeText={(val) => {}} // logic handled in ScrollPickers
                    onFocus={() => {}}
                />
                <TouchableHighlight
                    className="flex rounded-[50px] items-center justify-center px-3 py-1 my-3"
                    style = {{ backgroundColor: '#005C6A' }}
                    underlayColor="#5B9F8F"
                    onPress={() => { setAnswers((prevAnswers) => ({...prevAnswers, recentPeriodYearMonthDayStart: "dontrememberornotrecorded", recentPeriodYearMonthDayEnd: "dontrememberornotrecorded"})) }}
                >
                    <View className="flex-row items-center">
                        <Text className="text-offwhite text-[14px] font-bold py-1">
                            {i18n.t('survey.whenStartFirstPeriod.iDontRemember')}
                        </Text>
                    </View>
                </TouchableHighlight>

                <Modal
                    animationIn={"slideInUp"}
                    animationOut={"slideOutUp"}
                    animationTiming={500}
                    backdropOpacity={0.5}
                    isVisible={recentPeriodModalVisible}
                    onBackdropPress={() => {
                        setRecentPeriodModalVisible(!recentPeriodModalVisible);
                    }}
                    onRequestClose={() => {
                        setRecentPeriodModalVisible(!recentPeriodModalVisible);
                    }}
                    className="mx-2"
                >
                    <View className="bg-offwhite rounded-[20px] border-[3px] border-seafoam mx-6 py-4 px-6">
                        {/* recent period start date scroll pickers */}
                        <Text className="text-greydark text-[18px] font-bold my-2">
                            {i18n.t('analysis.trends.export.start')}
                        </Text>
                        <View className="flex flex-row px-8">
                            <ScrollPicker
                                data={[...Array(31).keys()].map((dayIndex) => {
                                    return { title: dayIndex + 1, id: dayIndex };
                                })}
                                initialScrollIndex={recentPeriodStartDate.day - 1}
                                onViewableItemsChanged={handleDayChangedRecentPeriodStart}
                                itemHeight={scrollPickerItemHeight}
                                keyPrefix="dayStart"
                                roundLeft={true}
                            />
                            <ScrollPicker
                                data={[...Array(12).keys()].map((monthIndex) => {
                                return {
                                    title: new Date(2021, monthIndex, 1).toLocaleString(
                                        selectedSettingsLanguage,
                                        { month: 'short' }
                                    ),
                                    id: monthIndex,
                                };
                                })}
                                initialScrollIndex={recentPeriodStartDate.month - 1}
                                onViewableItemsChanged={handleMonthChangedRecentPeriodStart}
                                itemHeight={scrollPickerItemHeight}
                                keyPrefix="monthStart"
                            />
                            <ScrollPicker
                                data={[...Array((new Date()).getFullYear()).keys()].map((yearIndex) => {
                                    return { title: yearIndex + 1, id: yearIndex };
                                })}
                                initialScrollIndex={recentPeriodStartDate.year - 1}
                                onViewableItemsChanged={handleYearChangedRecentPeriodStart}
                                itemHeight={scrollPickerItemHeight}
                                keyPrefix="yearStart"
                                roundRight={true}
                            />
                        </View>

                        {/* recent period end date scroll pickers */}
                        <Text className="text-greydark text-[18px] font-bold my-2">
                            {i18n.t('analysis.trends.export.end')}
                        </Text>
                        <View className="flex flex-row px-8">
                            <ScrollPicker
                                data={[...Array(31).keys()].map((dayIndex) => {
                                    return { title: dayIndex + 1, id: dayIndex };
                                })}
                                initialScrollIndex={recentPeriodEndDate.day - 1}
                                onViewableItemsChanged={handleDayChangedRecentPeriodEnd}
                                itemHeight={scrollPickerItemHeight}
                                keyPrefix="dayEnd"
                                roundLeft={true}
                            />
                            <ScrollPicker
                                data={[...Array(12).keys()].map((monthIndex) => {
                                    return {
                                        title: new Date(2021, monthIndex, 1).toLocaleString(
                                        selectedSettingsLanguage,
                                        { month: 'short' }
                                        ),
                                        id: monthIndex,
                                    };
                                })}
                                initialScrollIndex={recentPeriodEndDate.month - 1}
                                onViewableItemsChanged={handleMonthChangedRecentPeriodEnd}
                                itemHeight={scrollPickerItemHeight}
                                keyPrefix="monthEnd"
                            />
                            <ScrollPicker
                                data={[...Array((new Date()).getFullYear()).keys()].map((yearIndex) => {
                                    return { title: yearIndex + 1, id: yearIndex };
                                })}
                                initialScrollIndex={recentPeriodEndDate.year - 1}
                                onViewableItemsChanged={handleYearChangedRecentPeriodEnd}
                                itemHeight={scrollPickerItemHeight}
                                keyPrefix="yearEnd"
                                roundRight={true}
                            />
                        </View>
                    </View>
                </Modal>
                <TouchableOpacity
                    className="rounded-full border-2 border-salmon w-full p-6 mt-10"
                    onPress={() => {
                        postSurveyData(remove=true);
                    }}
                >
                    <Text className="text-center text-salmon">{i18n.t('settings.accountInfo.survey.removeData')}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    className="rounded-full bg-teal w-full p-6 mt-4 mb-10"
                    onPress={() => {
                        postSurveyData();
                    }}
                >
                    <Text className="text-center text-white">{i18n.t('settings.accountInfo.survey.saveChanges')}</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}
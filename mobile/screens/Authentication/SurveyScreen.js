import { useContext, useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableHighlight,
    TouchableOpacity,
    Pressable,
} from 'react-native';
import Modal from 'react-native-modal';
import DropDownPicker from "react-native-dropdown-picker";

import { AuthContext } from '../../navigation/AuthProvider';
import { SettingsContext } from '../../navigation/SettingsProvider';
import i18n from '../../translations/i18n';
import ScrollPicker from '../../components/ScrollPicker';
import FormInput from '../../components/FormInput';

import XIcon from '../../assets/icons/x.svg';
import EditIcon from '../../assets/edit_icon.svg';

// Loading env variables
import getEnvVars from '../../environment';
import AsyncStorage from '@react-native-async-storage/async-storage';
const { API_URL } = getEnvVars();

const SurveyScreen = () => {
    const { userId, setHasDoneSurvey, firstName } = useContext(AuthContext);
    const { selectedSettingsLanguage } = useContext(SettingsContext);
    const scrollPickerItemHeight = 46;

    async function checkHasDoneSurvey() {
        try {
            let response = await fetch(`${API_URL}/users/${userId}`);
            let json = await response.json();
            setHasDoneSurvey(json.hasDoneSurvey);
        }
        catch (error) {
            setHasDoneSurvey(false);
            console.log(`[LandingScreen] checkHasDoneSurvey error: ${error}`);
        }
    }
    
    const [userObj, setUserObj] = useState({});
    const [answers, setAnswers] = useState({ 
        // all can be null if user chooses not to answer
        "gottenFirstPeriod": "dontrememberornotrecorded", // "yes", "no", "dontrememberornotrecorded"
        "firstPeriodYearMonth": "dontrememberornotrecorded", // YYYY-MM or "dontrememberornotrecorded"
        "recentPeriodYearMonthDayStart": "dontrememberornotrecorded", // YYYY-MM-DD or "dontrememberornotrecorded"
        "recentPeriodYearMonthDayEnd": "dontrememberornotrecorded", // YYYY-MM-DD or "dontrememberornotrecorded"
    });

    const [firstPeriodDropdownOpen, setFirstPeriodDropdownOpen] = useState(false);
    const [firstPeriodDropdownValue, setFirstPeriodDropdownValue] = useState(i18n.t('survey.all.yes'));
    const [firstPeriodDropdownItems, setFirstPeriodDropdownItems] = useState([
        { label: i18n.t('survey.all.yes'), value: "yes" },
        { label: i18n.t('survey.all.no'), value: "no" },
        { label: i18n.t('survey.gottenFirstPeriod.imNotSure'), value: "dontrememberornotrecorded" },
    ]);

    const [whatsAPeriodModalVisible, setWhatsAPeriodModalVisible] = useState(false);
    const [firstPeriodModalVisible, setFirstPeriodModalVisible] = useState(false);
    const [firstPeriodStartYear, setFirstPeriodStartYear] = useState(new Date().getFullYear());
    const [firstPeriodStartMonth, setFirstPeriodStartMonth] = useState(new Date().getMonth() + 1);
    
    const [recentPeriodModalVisible, setRecentPeriodModalVisible] = useState(false);
    const [recentPeriodStartDate, setRecentPeriodStartDate] = useState({
        day: new Date().getDate(),
        month: new Date().getMonth(),
        year: new Date().getFullYear(),
    });
    const [recentPeriodEndDate, setRecentPeriodEndDate] = useState({
        day: new Date().getDate(),
        month: new Date().getMonth(),
        year: new Date().getFullYear(),
    });

    async function fetchUserInfoData() {
        try {
            const resp = await fetch(`${API_URL}/users/${userId}`, { method: "GET" });
            setUserObj(await resp.json());

        } catch (error) {
            console.log("[HomeScreen] fetchUserData() error:", error);
        }
    }

    const handleYearChangedFirstPeriod = useCallback(({ viewableItems }) => {
        if (!viewableItems[1]) return;
        let centerViewable = viewableItems[1].item.id;
        console.log(`setting firstPeriodStartYear to ${centerViewable + 1}`)
        setFirstPeriodStartYear(centerViewable);
    }, []);

    const handleMonthChangedFirstPeriod = useCallback(({ viewableItems }) => {
        if (!viewableItems[1]) return;
        let centerViewable = viewableItems[1].item.id;
        console.log(`setting firstPeriodStartMonth to ${centerViewable + 1}`)
        setFirstPeriodStartMonth(centerViewable);
    }, []);

    const handleDayChangedRecentPeriodStart = useCallback(({ viewableItems }) => {
        if (!viewableItems[1]) return;
        let centerViewable = viewableItems[1].item.id;
        console.log(`setting recentPeriodStartDate.day to ${centerViewable + 1}`)
        setRecentPeriodStartDate((prevState) => ({
            ...prevState,
            day: centerViewable,
        }));
    }, []);

    const handleMonthChangedRecentPeriodStart = useCallback(({ viewableItems }) => {
        if (!viewableItems[1]) return;
        let centerViewable = viewableItems[1].item.id;
        console.log(`setting recentPeriodStartDate.month to ${centerViewable + 1}`)
        setRecentPeriodStartDate((prevState) => ({
            ...prevState,
            month: centerViewable,
        }));
    }, []);

    const handleYearChangedRecentPeriodStart = useCallback(({ viewableItems }) => {
        if (!viewableItems[1]) return;
        let centerViewable = viewableItems[1].item.id;
        console.log(`setting recentPeriodStartDate.year to ${centerViewable + 1}`)
        setRecentPeriodStartDate((prevState) => ({
            ...prevState,
            year: centerViewable,
        }));
    }, []);

    const handleDayChangedRecentPeriodEnd = useCallback(({ viewableItems }) => {
        if (!viewableItems[1]) return;
        let centerViewable = viewableItems[1].item.id;
        console.log(`setting recentPeriodEndDate.day to ${centerViewable + 1}`)
        setRecentPeriodEndDate((prevState) => ({
            ...prevState,
            day: centerViewable,
        }));
    }, []);

    const handleMonthChangedRecentPeriodEnd = useCallback(({ viewableItems }) => {
        if (!viewableItems[1]) return;
        let centerViewable = viewableItems[1].item.id;
        console.log(`setting recentPeriodEndDate.month to ${centerViewable + 1}`)
        setRecentPeriodEndDate((prevState) => ({
            ...prevState,
            month: centerViewable,
        }));
    }, []);

    const handleYearChangedRecentPeriodEnd = useCallback(({ viewableItems }) => {
        if (!viewableItems[1]) return;
        let centerViewable = viewableItems[1].item.id;
        console.log(`setting recentPeriodEndDate.year to ${centerViewable + 1}`)
        setRecentPeriodEndDate((prevState) => ({
            ...prevState,
            year: centerViewable,
        }));
    }, []);

    const postSurveyData = async () => {
        try {
            const resp = await fetch(`${API_URL}/users/${userId}`, { method: "GET" });
            const userObjCopy = await resp.json();
            setUserObj(userObjCopy);

            // update the user object with the survey data
            userObjCopy.surveyAnswers = answers;
            userObjCopy.hasDoneSurvey = true;
            

            await fetch(`${API_URL}/users/${userId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(userObjCopy),
            });
        }
        catch (error) {
            console.log("[SurveyScreen] postSurveyData() error:", error);
        }
        finally {
            // more important for the user to be able to use the app than to have the survey data
            setHasDoneSurvey(true);
        }
    }
    
    useEffect(() => {
        setAnswers((prevState) => ({ ...prevState, gottenFirstPeriod: firstPeriodDropdownValue }))
    }, [firstPeriodDropdownValue])
    
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
        checkHasDoneSurvey();
        fetchUserInfoData();
    }, []);

    return (
        <ScrollView className="flex flex-col bg-offwhite p-3">
            <View className="mb-10">
                <View className="justify-center">
                    <Text className="text-greydark text-[22px] font-bold">
                        {i18n.t('survey.all.hiName').replace('{name}', firstName ? firstName : '')}
                    </Text>
                </View>
                <Text className="text-greydark text-[18px] font-bold mt-3">
                    {i18n.t('survey.intro.toPersonalize')}
                </Text>
                <Text className="text-greydark text-[18px] font-bold mt-8">
                    {i18n.t('survey.gottenFirstPeriod.haveYouGottenYourFirstPeriod')}
                </Text>
                <View className="flex-row mt-3 mb-24 items-center justify-between">
                    <DropDownPicker
                        open={firstPeriodDropdownOpen}
                        value={firstPeriodDropdownValue}
                        items={firstPeriodDropdownItems}
                        setOpen={setFirstPeriodDropdownOpen}
                        setValue={setFirstPeriodDropdownValue}
                        setItems={setFirstPeriodDropdownItems}
                        placeholder={firstPeriodDropdownValue}
                        style={{backgroundColor: '#EDEEE0', borderWidth: 0, borderRadius: 3, minHeight: 35, zIndex: 3000}}
                        containerStyle={{width: 200, zIndex: 3000}}
                        dropDownContainerStyle={{backgroundColor: '#EDEEE0', borderColor: '#777', borderWidth: 1, borderRadius: 3, zIndex: 3000}}
                        textStyle={{color: '#272727', fontSize: 16, fontWeight: 'bold', zIndex: 3000}}
                    />
                    <TouchableHighlight
                        className="flex rounded-[50px] items-center justify-center bg-turquoise px-3 py-1"
                        onPress={() => {
                            setWhatsAPeriodModalVisible(!whatsAPeriodModalVisible);
                        }}
                        underlayColor="#5B9F8F"
                    >
                        <View className="flex-row items-center">
                            <Text className="text-offwhite text-[14px] font-bold py-1">
                                {i18n.t('survey.gottenFirstPeriod.whatsAPeriod')}
                            </Text>
                        </View>
                    </TouchableHighlight>
                </View>

                <View className="flex-row">
                    <Text className="text-greydark text-[18px] font-bold mt-8">
                        {i18n.t('survey.whenStartFirstPeriod.whenDidYouStartYourFirstPeriod')}
                    </Text>
                    <View className={`absolute bottom-1 right-0 ${firstPeriodModalVisible?"bg-gray p-1 rounded-full":""}`} >
                        <Pressable
                            onPress={() => {
                                setFirstPeriodModalVisible(!firstPeriodModalVisible);
                            }}
                            hitSlop={25}
                        >
                            <EditIcon/>
                        </Pressable>
                    </View>
                </View>
                <FormInput
                    editable={false}
                    labelValue="firstPeriodStart"
                    placeholderText={answers.firstPeriodYearMonth === "dontrememberornotrecorded" ? i18n.t('survey.whenStartFirstPeriod.iDontRemember') : answers.firstPeriodYearMonth}
                    isRequired={true}
                    iconType="user"
                    color="black"
                    keyboardType="email-address"
                    value={answers.firstPeriodYearMonth === "dontrememberornotrecorded" ? i18n.t('survey.whenStartFirstPeriod.iDontRemember') : answers.firstPeriodYearMonth}
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
                            onPress={() => {
                                setRecentPeriodModalVisible(!recentPeriodModalVisible);
                            }}
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
                    placeholderText={answers.recentPeriodYearMonthDayStart === "dontrememberornotrecorded" ? i18n.t('survey.whenStartFirstPeriod.iDontRemember') : answers.recentPeriodYearMonthDayStart}
                    isRequired={true}
                    iconType="user"
                    color="black"
                    keyboardType="email-address"
                    value={answers.recentPeriodYearMonthDayStart === "dontrememberornotrecorded" ? i18n.t('survey.whenStartFirstPeriod.iDontRemember') : answers.recentPeriodYearMonthDayStart}
                    onChangeText={(val) => {}} // logic handled in ScrollPickers
                    onFocus={() => {}}
                />
                <Text className="text-greydark text-[18px] font-bold my-2">
                    {i18n.t('analysis.trends.export.end')}
                </Text>
                <FormInput
                    editable={false}
                    labelValue="recentPeriodEnd"
                    placeholderText={answers.recentPeriodYearMonthDayEnd === "dontrememberornotrecorded" ? i18n.t('survey.whenStartFirstPeriod.iDontRemember') : answers.recentPeriodYearMonthDayEnd}
                    isRequired={true}
                    iconType="user"
                    color="black"
                    keyboardType="email-address"
                    value={answers.recentPeriodYearMonthDayEnd === "dontrememberornotrecorded" ? i18n.t('survey.whenStartFirstPeriod.iDontRemember') : answers.recentPeriodYearMonthDayEnd}
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

                {/* Finish button */}
                <TouchableHighlight
                    className="flex rounded-[50px] items-center justify-center bg-turquoise px-3 py-3 mt-4"
                    onPress={() => {
                        postSurveyData();
                    }}
                    underlayColor="#5B9F8F"
                >
                    <View className="flex-row items-center">
                        <Text className="text-offwhite text-[22px] font-bold py-1">
                            {i18n.t('survey.whenMostRecentPeriod.finish')}
                        </Text>
                    </View>
                </TouchableHighlight>

                {/* "What's a period?" Modal */}
                <Modal
                    animationIn={"slideInUp"}
                    animationOut={"slideOutUp"}
                    animationTiming={500}
                    backdropOpacity={0.5}
                    isVisible={whatsAPeriodModalVisible}
                    onBackdropPress={() => {
                        setWhatsAPeriodModalVisible(!whatsAPeriodModalVisible);
                    }}
                    onRequestClose={() => {
                        setWhatsAPeriodModalVisible(!whatsAPeriodModalVisible);
                    }}
                    className="mx-2"
                >
                    <View className="flex flex-col bg-offwhite items-center rounded-[20px] border-[3px] border-seafoam py-4 px-4">
                        <View className="flex-row mb-3 items-center">
                            <Text className="text-greydark text-[22px] font-bold flex-grow">
                                {i18n.t('survey.gottenFirstPeriod.whatsAPeriod')}
                            </Text>
                            <TouchableOpacity 
                                className="self-end"
                                onPress={() => {
                                    setWhatsAPeriodModalVisible(!whatsAPeriodModalVisible);
                                }}
                            >
                                <XIcon width={30} height={30} />
                            </TouchableOpacity>
                        </View>
                        <Text className="flex-grow text-[16px]">
                            {i18n.t('survey.gottenFirstPeriod.periodExplanation')}
                        </Text>
                    </View>
                </Modal>
            </View>
        </ScrollView>
    );
}

export default SurveyScreen;
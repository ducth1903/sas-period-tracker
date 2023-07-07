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

import XIcon from '../../assets/icons/x.svg';

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
            console.log(`[LandingScreen] checkHasDoneSurvey: ${JSON.stringify(json)}`);
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
    
    const [firstPeriodScrollPickerVisible, setFirstPeriodScrollPickerVisible] = useState(true);
    const [firstPeriodStartYear, setFirstPeriodStartYear] = useState(new Date().getFullYear());
    const [firstPeriodStartMonth, setFirstPeriodStartMonth] = useState(new Date().getMonth() + 1);
    
    const [firstPeriodModalVisible, setFirstPeriodModalVisible] = useState(false);

    const [recentPeriodScrollPickersVisible, setRecentPeriodScrollPickersVisible] = useState(true);
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
            setUserObj(await resp.json());

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
            day: centerViewable,
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
        if (firstPeriodScrollPickerVisible) {
            const monthNumString = firstPeriodStartMonth + 1 < 10 ? `0${firstPeriodStartMonth + 1}` : `${firstPeriodStartMonth + 1}`;
            const yearMonthString = `${firstPeriodStartYear}-${monthNumString}`;
            setAnswers((prevState) => ({ ...prevState, firstPeriodYearMonth: yearMonthString }));
        }
        else {
            setAnswers((prevState) => ({ ...prevState, firstPeriodYearMonth: "dontrememberornotrecorded" }));
        }
    }, [firstPeriodStartMonth, firstPeriodStartYear])

    useEffect(() => {
        const startDay = recentPeriodStartDate.day;
        const startMonth = recentPeriodStartDate.month + 1;
        const startYear = recentPeriodStartDate.year;
        const endDay = recentPeriodEndDate.day;
        const endMonth = recentPeriodEndDate.month + 1;
        const endYear = recentPeriodEndDate.year;

        if (recentPeriodScrollPickersVisible) {
            if (startDay && startMonth && startYear && endDay && endMonth && endYear) {
                const startDateString = `${startYear}-${startMonth < 10 ? `0${startMonth}` : startMonth}-${startDay < 10 ? `0${startDay}` : startDay}`;
                const endDateString = `${endYear}-${endMonth < 10 ? `0${endMonth}` : endMonth}-${endDay < 10 ? `0${endDay}` : endDay}`;
                setAnswers((prevState) => ({ ...prevState, recentPeriodYearMonthDayStart: startDateString, recentPeriodYearMonthDayEnd: endDateString }));
            }
        }
        else {
            setAnswers((prevState) => ({ ...prevState, recentPeriodYearMonthDayStart: "dontrememberornotrecorded", recentPeriodYearMonthDayEnd: "dontrememberornotrecorded" }));
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
                            setFirstPeriodModalVisible(true);
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

                <Text className="text-greydark text-[18px] font-bold mt-8">
                    {i18n.t('survey.whenStartFirstPeriod.whenDidYouStartYourFirstPeriod')}
                </Text>
                <Pressable
                    className="flex rounded-[50px] items-center justify-center px-3 py-1 my-3"
                    style = {{ backgroundColor: firstPeriodScrollPickerVisible ? '#005C6A' : '#5B9F8F'}}
                    onPress={() => {
                        let negatedFirstPeriodScrollPickerVisible = !firstPeriodScrollPickerVisible;
                        setFirstPeriodScrollPickerVisible(negatedFirstPeriodScrollPickerVisible);
                        if (negatedFirstPeriodScrollPickerVisible) {
                            setAnswers((prevState) => ({ ...prevState, firstPeriodYearMonth: "dontrememberornotrecorded" }))
                        }
                        else {
                            setAnswers((prevState) => ({ ...prevState, firstPeriodYearMonth: `${(new Date()).getFullYear()}-${(new Date()).getMonth() + 1}` }))
                        }
                    }}
                >
                    <View className="flex-row items-center">
                        <Text className="text-offwhite text-[14px] font-bold py-1">
                            {i18n.t('survey.whenStartFirstPeriod.iDontRemember')}
                        </Text>
                    </View>
                </Pressable>
                {
                    firstPeriodScrollPickerVisible &&
                    <View className="flex flex-row px-8">
                        <ScrollPicker
                            data={[...Array(12).keys()].map((monthIndex) => {
                                return {title: new Date(2021, monthIndex, 1).toLocaleString(selectedSettingsLanguage, {month: 'short'}), id: monthIndex}
                            })}
                            initialScrollIndex={(new Date()).getMonth()}
                            onViewableItemsChanged={handleMonthChangedFirstPeriod}
                            itemHeight={scrollPickerItemHeight}
                            keyPrefix="month"
                            roundLeft={true}
                        />
                        <ScrollPicker
                            data={[...Array((new Date()).getFullYear()).keys()].map((yearIndex) => {
                                return {title: yearIndex + 1, id: yearIndex}
                            })}
                            initialScrollIndex={(new Date()).getFullYear() - 1}
                            onViewableItemsChanged={handleYearChangedFirstPeriod}
                            itemHeight={scrollPickerItemHeight}
                            keyPrefix="year"
                            roundRight={true}
                        />
                    </View>
                }
                
                {/* Two more sets of D/M/Y ScrollPickers, one for recentPeriodStartDate, one for recentPeriodEndDate */}
                <Text className="text-greydark text-[18px] font-bold mt-8">
                    {i18n.t('survey.whenMostRecentPeriod.whenWasYourMostRecentPeriod')}
                </Text>
                <Pressable
                    className="flex rounded-[50px] items-center justify-center px-3 py-1 my-3"
                    style = {{ backgroundColor: recentPeriodScrollPickersVisible ? '#005C6A' : '#5B9F8F'}}
                    onPress={() => {
                        let negatedRecentPeriodScrollPickersVisible = !recentPeriodScrollPickersVisible;
                        setRecentPeriodScrollPickersVisible(negatedRecentPeriodScrollPickersVisible);
                        if (negatedRecentPeriodScrollPickersVisible) {
                            setAnswers((prevAnswers) => ({...prevAnswers, recentPeriodYearMonthDayStart: "dontrememberornotrecorded", recentPeriodYearMonthDayEnd: "dontrememberornotrecorded"}))
                        }
                        else {
                            setAnswers((prevAnswers) => ({...prevAnswers, recentPeriodYearMonthDayStart: `${(new Date()).getFullYear()}-${(new Date()).getMonth() + 1}-${(new Date()).getDate()}`, recentPeriodYearMonthDayEnd: `${(new Date()).getFullYear()}-${(new Date()).getMonth() + 1}-${(new Date()).getDate()}`}))
                        }
                    }}
                >
                    <View className="flex-row items-center">
                        <Text className="text-offwhite text-[14px] font-bold py-1">
                            {i18n.t('survey.whenStartFirstPeriod.iDontRemember')}
                        </Text>
                    </View>
                </Pressable>

                {/* recent period start date scroll pickers */}
                {
                    recentPeriodScrollPickersVisible &&
                    <>
                        <Text className="text-greydark text-[18px] font-bold my-2">
                            {i18n.t('analysis.trends.export.start')}
                        </Text>

                        <View className="flex flex-row px-8">
                            <ScrollPicker
                                data={[...Array(31).keys()].map((dayIndex) => {
                                    return { title: dayIndex + 1, id: dayIndex };
                                })}
                                initialScrollIndex={(new Date).getDate() - 1}
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
                                initialScrollIndex={(new Date()).getMonth()}
                                onViewableItemsChanged={handleMonthChangedRecentPeriodStart}
                                itemHeight={scrollPickerItemHeight}
                                keyPrefix="monthStart"
                            />
                            <ScrollPicker
                                data={[...Array((new Date()).getFullYear()).keys()].map((yearIndex) => {
                                    return { title: yearIndex + 1, id: yearIndex };
                                })}
                                initialScrollIndex={(new Date()).getFullYear() - 1}
                                onViewableItemsChanged={handleYearChangedRecentPeriodStart}
                                itemHeight={scrollPickerItemHeight}
                                keyPrefix="yearStart"
                                roundRight={true}
                            />
                        </View>

                    </>
                }

                {/* recent period end date scroll pickers */}
                {
                    recentPeriodScrollPickersVisible &&
                    <>
                        <Text className="text-greydark text-[18px] font-bold my-2">
                            {i18n.t('analysis.trends.export.end')}
                        </Text>
                        <View className="flex flex-row px-8">
                            <ScrollPicker
                                data={[...Array(31).keys()].map((dayIndex) => {
                                    return { title: dayIndex + 1, id: dayIndex };
                                })}
                                initialScrollIndex={(new Date).getDate() - 1}
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
                                initialScrollIndex={(new Date()).getMonth()}
                                onViewableItemsChanged={handleMonthChangedRecentPeriodEnd}
                                itemHeight={scrollPickerItemHeight}
                                keyPrefix="monthEnd"
                            />
                            <ScrollPicker
                                data={[...Array((new Date()).getFullYear()).keys()].map((yearIndex) => {
                                    return { title: yearIndex + 1, id: yearIndex };
                                })}
                                initialScrollIndex={(new Date()).getFullYear() - 1}
                                onViewableItemsChanged={handleYearChangedRecentPeriodEnd}
                                itemHeight={scrollPickerItemHeight}
                                keyPrefix="yearEnd"
                                roundRight={true}
                            />
                        </View>
                    </>
                }
                    
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
                    isVisible={firstPeriodModalVisible}
                    onBackdropPress={() => {
                        setFirstPeriodModalVisible(!firstPeriodModalVisible);
                    }}
                    onRequestClose={() => {
                        setFirstPeriodModalVisible(!firstPeriodModalVisible);
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
                                    setFirstPeriodModalVisible(!firstPeriodModalVisible);
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
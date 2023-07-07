import React, { useContext, useEffect, useState, useCallback } from 'react';
import {
    StyleSheet,
    Text,
    View,
    RefreshControl,
    ScrollView,
    SafeAreaView,
    // Platform,
    // ImageBackground,
    // Animated,
    Dimensions,
    Image,
    Pressable,
    Platform
} from 'react-native';
// import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { Skeleton } from '@rneui/themed';

import { AuthContext } from '../navigation/AuthProvider';
import { SettingsContext } from '../navigation/SettingsProvider';
// import FormButton from '../components/FormButton';
import DateCircle from '../components/DateCircle';
import TextCard from '../components/TextCard';
// import ProgressiveImage from '../components/ProgressiveImage';
import i18n from '../translations/i18n';
import * as SVG from '../assets/svg';
import DynamicNote from '../components/DynamicNote';

// Loading env variables
import getEnvVars from '../environment';
const { API_URL } = getEnvVars();

const HomeScreen = () => {
    const { height } = Dimensions.get("screen");
    const { userId } = useContext(AuthContext);
    const { selectedSettingsLanguage } = useContext(SettingsContext);
    const [userObj, setUserObj] = useState(null);
    const [periodObj, setPeriodObj] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [dateCircleArr, setDateCirleArr] = useState(null);
    const [showRecommendationText, setShowRecommendationText] = useState(false);

    const FLOWS = [
        { label: i18n.t('flow.none'), key: 'none', selected: false, DefaultIcon: SVG.FlowNoneDefault, SelectedIcon: SVG.FlowNoneSelected },
        { label: i18n.t('flow.light'), key: 'light', selected: false, DefaultIcon: SVG.FlowLightDefault, SelectedIcon: SVG.FlowLightSelected },
        { label: i18n.t('flow.medium'), key: 'medium', selected: false, DefaultIcon: SVG.FlowMediumDefault, SelectedIcon: SVG.FlowMediumSelected },
        { label: i18n.t('flow.heavy'), key: 'heavy', selected: false, DefaultIcon: SVG.FlowHeavyDefault, SelectedIcon: SVG.FlowHeavySelected },
        { label: i18n.t('flow.notSure'), key: 'notSure', selected: false, DefaultIcon: SVG.FlowNotSureDefault, SelectedIcon: SVG.FlowNotSureSelected },
    ];
    
    const MOODS = [
        { label: i18n.t('moods.excited'), DefaultIcon: SVG.MoodExcitedDefault, SelectedIcon: SVG.MoodExcitedSelected, key: 'excited', },
        { label: i18n.t('moods.happy'), DefaultIcon: SVG.MoodHappyDefault, SelectedIcon: SVG.MoodHappySelected, key: 'happy', },
        { label: i18n.t('moods.sensitive'), DefaultIcon: SVG.MoodSensitiveDefault, SelectedIcon: SVG.MoodSensitiveSelected, key: 'sensitive', },
        { label: i18n.t('moods.sad'), DefaultIcon: SVG.MoodSadDefault, SelectedIcon: SVG.MoodSadSelected, key: 'sad', },
        { label: i18n.t('moods.anxious'), DefaultIcon: SVG.MoodAnxiousDefault, SelectedIcon: SVG.MoodAnxiousSelected, key: 'anxious', },
        { label: i18n.t('moods.angry'), DefaultIcon: SVG.MoodAngryDefault, SelectedIcon: SVG.MoodAngrySelected, key: 'angry', },
        { label: i18n.t('moods.customize'), DefaultIcon: SVG.MoodCustomizeDefault, SelectedIcon: SVG.MoodCustomizeSelected, key: 'customize', },
    ];
    
    const SYMPTOMS = [
        { label: i18n.t('symptoms.cravings'), key: 'cravings', DefaultIcon: SVG.SymptomCravingsDefault, SelectedIcon: SVG.SymptomCravingsSelected },
        { label: i18n.t('symptoms.backache'), key: 'backache', DefaultIcon: SVG.SymptomBackacheDefault, SelectedIcon: SVG.SymptomBackacheSelected },
        { label: i18n.t('symptoms.cramps'), key: 'cramps', DefaultIcon: SVG.SymptomCrampsDefault, SelectedIcon: SVG.SymptomCrampsSelected },
        { label: i18n.t('symptoms.bloating'), key: 'bloating', DefaultIcon: SVG.SymptomBloatingDefault, SelectedIcon: SVG.SymptomBloatingSelected },
        { label: i18n.t('symptoms.tenderBreasts'), key: 'tenderBreasts', DefaultIcon: SVG.SymptomTenderDefault, SelectedIcon: SVG.SymptomTenderSelected },
        { label: i18n.t('symptoms.headache'), key: 'headache', DefaultIcon: SVG.SymptomHeadacheDefault, SelectedIcon: SVG.SymptomHeadacheSelected },
        { label: i18n.t('symptoms.fatigue'), key: 'fatigue', DefaultIcon: SVG.SymptomFatigueDefault, SelectedIcon: SVG.SymptomFatigueSelected },
        { label: i18n.t('symptoms.nausea'), key: 'nausea', DefaultIcon: SVG.SymptomNauseaDefault, SelectedIcon: SVG.SymptomNauseaSelected },
        { label: i18n.t('discharge.stringy'), key: 'stringy', DefaultIcon: SVG.SymptomDischargeStringy, SelectedIcon: SVG.SymptomDischargeStringySelected },
        { label: i18n.t('discharge.watery'), key: 'watery', DefaultIcon: SVG.SymptomDischargeWatery, SelectedIcon: SVG.SymptomDischargeWaterySelected },
        { label: i18n.t('discharge.transparent'), key: 'transparent', DefaultIcon: SVG.SymptomDischargeTransparent, SelectedIcon: SVG.SymptomDischargeTransparentSelected },
        { label: i18n.t('discharge.creamy'), key: 'creamy', DefaultIcon: SVG.SymptomDischargeCreamy, SelectedIcon: SVG.SymptomDischargeCreamySelected },
        { label: i18n.t('discharge.clumpy'), key: 'clumpy', DefaultIcon: SVG.SymptomDischargeClumpy, SelectedIcon: SVG.SymptomDischargeClumpySelected },
        { label: i18n.t('discharge.sticky'), key: 'sticky', DefaultIcon: SVG.SymptomDischargeSticky, SelectedIcon: SVG.SymptomDischargeStickySelected },
    ];
    const [flowIconEnable, setFlowIconEnable] = useState(null);
    const [moodIconEnable, setMoodIconEnable] = useState(null);
    const [symptomIconEnable, setSymptomIconEnable] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [periodDayData, setPeriodDayData] = useState(null);
    const [currentPeriodDay, setCurrentPeriodDay] = useState(1);

    const dischargeKeys = SYMPTOMS.filter(({ label, key }) => label.toLowerCase().includes('discharge')).map(({ key }) => key);

    // Async function to fetch user data
    async function fetchUserInfoData() {
        try {
            const resp = await fetch(`${API_URL}/users/${userId}`, { method: "GET" });
            return resp.json();
        } catch (error) {
            console.log("[HomeScreen] fetchUserData() error:", error);
        }
    }

    async function fetchUserPeriodData() {
        try {
            const resp = await fetch(`${API_URL}/periods/${userId}`, { method: "GET" });
            return resp.json();
        }
        catch (error) {
            console.log("[HomeScreen] fetchUserPeriodData() error:", error);
        }
    }

    // TODO: Occasional "cannot convert null value to object" error
    async function fetchUserData() {
        try {
            // fetch user info data
            const userRespJson = await fetchUserInfoData();
            setUserObj(userRespJson);

            // fetch user period data
            const periodRespJson = await fetchUserPeriodData();
            setPeriodObj(periodRespJson);
        }
        catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Failed to fetch from server',
                text2: error
            });
        }
    }

    async function postDayPeriodData(data) {
        try {
            const response = await fetch(`${API_URL}/periods/${userId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: (
                    () => {
                        return JSON.stringify([data])
                    }
                )()
            });

            const resp = await response.json();
        }
        catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Failed to upload data to server',
                text2: error
            });
        }
    }

    function getPeriodDataForDate(date) {
        if (!periodObj) return null;
        const periodDays = periodObj.reduce((acc, obj) => {
            const daysForCurrentMonth = obj.details;
            acc.push(...daysForCurrentMonth);
            return acc;
        }, []);

        let dateStr = `${date.getFullYear()}-${date.getMonth() + 1 < 10 ? "0" : ""}${date.getMonth() + 1}-${date.getDate() < 10 ? "0" : ""}${date.getDate()}`;
        let periodDataForDate = periodDays.find(obj => obj.dateStr === dateStr);
        return periodDataForDate; // undefined if not found
    }

    // find the days of the month (1-31 at most) that are period days 
    // a day will be considered a "period day" if (user logs any flow || (the day before and after are period days && at least 1 symptom or discharge is recorded))
    function getPeriodDays() {
        if (!periodObj) return null;

        // flows above none
        const positiveFlows = ['light', 'medium', 'heavy', 'notSure'];

        // selectedDate can only be in current month, so new Date is fine to avoid situations where selectedDate is null
        const currentDate = new Date();
        const daysForCurrentMonth = [...Array(daysInMonth()).keys()].map(num => num + 1);
        const datesForCurrentMonth = daysForCurrentMonth.map(day => new Date(currentDate.getFullYear(), currentDate.getMonth(), day));
        const periodDataForCurrentMonth = datesForCurrentMonth.map(date => getPeriodDataForDate(date)).filter(obj => obj);
        
        const periodDays = [];
        // first pass to add all days with flows above none
        periodDataForCurrentMonth.forEach((obj, index) => {
            if (positiveFlows.includes(obj.flow)) {
                periodDays.push(obj);
                return;
            };
        });
        // second pass to add any days that are between two period days and have at least 1 symptom or discharge
        periodDataForCurrentMonth.forEach((obj, index) => {
            const prevObj = periodDataForCurrentMonth[index - 1];
            const nextObj = periodDataForCurrentMonth[index + 1];
            if (prevObj && nextObj) {
                const symptomsLength = obj.symptoms ? obj.symptoms.length : 0;
                const dischargeLength = obj.discharge ? obj.discharge.length : 0;
                if (periodDays.includes(prevObj) && periodDays.includes(nextObj)) {
                    if (symptomsLength > 0 || dischargeLength > 0) {
                        periodDays.push(obj);
                        return;
                    }
                }
            }
        });

        // at this point, it has the objects that correspond to period days, now we just need to extract the days of the month
        return periodDays.map(obj => Number(obj.dateStr.split('-')[2]))
    }
    
    // initial useEffect for fetching data
    // This will be run after the component is mounted and after every render cycle
    // i.e. whenever your functional component re-runs/re-renders
    useEffect(() => {
        // to avoid state update on unmounted component issue
        // https://www.debuggr.io/react-update-unmounted-component/
        fetchUserData();

        // selected date will be tracked in local timezone 
        setSelectedDate(new Date());
    }, []);

    // initialize dateCircleArr and initial icon values
    useEffect(() => {
        // dateCircleArr init
        if (!userObj || !periodObj || !selectedDate) return;
        // Get number of days for this month and populate dateCircleArr
        const numDaysInMonth = daysInMonth();
        const dateCircleRotateDegree = 360 / numDaysInMonth;
        const periodDays = getPeriodDays();
        const currentPeriodDay = periodDays.indexOf(selectedDate.getDate()) + 1;
        setCurrentPeriodDay(currentPeriodDay);
        const tmp = [];
        for (let i = 0; i < numDaysInMonth; i++) {
            let rotateDeg = Math.round(dateCircleRotateDegree * i);
            tmp.push(
                <DateCircle
                    inText={i + 1}
                    outerRotate={{ transform: [{ rotate: `${rotateDeg + 45}deg` }] }}
                    innerRotate={{ transform: [{ rotate: `-${rotateDeg + 45}deg` }] }}
                    selectedDate={selectedDate}
                    key={i + 1}
                    periodDays={periodDays}
                    dayStatus={dayStatus}
                />
            );
        }
        setDateCirleArr(tmp);

        // TODO: undefined error here
        const periodDataForDate = getPeriodDataForDate(selectedDate);
        let { flow, moods, symptoms, discharge } = { flow: null, moods: [], symptoms: [], discharge: null };

        if (periodDataForDate) {
            ({ flow, moods, symptoms, discharge } = periodDataForDate);
        }

        let symptomsAndDischarge = [];
        if (symptoms) {
            symptomsAndDischarge.push(...symptoms);
        }
        if (discharge) {
            symptomsAndDischarge.push(discharge);
        }

        // flowIconEnable, moodIconEnable, symptomIconEnable init
        setFlowIconEnable(FLOWS.reduce((acc, { key }) => ({ ...acc, [key]: flow ? flow === key : false }), {}));
        setMoodIconEnable(MOODS.reduce((acc, { key }) => ({ ...acc, [key]: moods ? moods.includes(key) : false }), {}));
        setSymptomIconEnable(SYMPTOMS.reduce((acc, { key }) => ({ ...acc, [key]: symptomsAndDischarge.includes(key)}), {}));

        // set loading to false if both user info and period data are fetched
        setIsLoading(false);

        // console.log(`periodobj = ${JSON.stringify(periodObj, null, 2)}`)
    }, [userObj, periodObj, selectedDate])

    // update interface and post most up-to-date data to server (and track it locally in periodDayData)
    useEffect(() => {
        if (!flowIconEnable || !moodIconEnable || !symptomIconEnable) return;

        // get current values of flow, mood, symptom        
        let currentFlow = null;
        for (const [key, value] of Object.entries(flowIconEnable)) {
            if (value) {
                currentFlow = key;
                break;
            }
        }   
        
        let currentMoods = [];
        for (const [key, value] of Object.entries(moodIconEnable)) {
            if (value) {
                currentMoods.push(key);
            }
        }

        let currentSymptoms = [];
        let currentDischarge = null;
        // console.log(`symptomIconEnable = ${JSON.stringify(symptomIconEnable, null, 2)}`)
        for (const [key, value] of Object.entries(symptomIconEnable)) {
            if (value) {
                if (dischargeKeys.includes(key)) {
                    currentDischarge = key;
                }
                else {
                    currentSymptoms.push(key);
                }
            }
        }
 
        // construct object to post for the current day
        const periodData = {
            // TODO: add check for mood, flow, symptom being one of the possible values (i.e., "happy", "sad", "angry", etc. with enum)
            userId: userId,
            timestamp: selectedDate.toISOString(),
            date: `${selectedDate.getFullYear()}-${selectedDate.getMonth() + 1 < 10 ? "0" : ""}${selectedDate.getMonth() + 1}-${selectedDate.getDate() < 10 ? "0" : ""}${selectedDate.getDate()}`,
            flow: currentFlow,
            moods: currentMoods,
            symptoms: currentSymptoms,
            discharge: currentDischarge
        }

        setPeriodDayData(periodData);
        postDayPeriodData(periodData);
    }, [flowIconEnable, moodIconEnable, symptomIconEnable]);
    
    useEffect(() => {
        console.log('date changed')
        onRefresh();
    }, [selectedDate])

    // Pull down to refresh
    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        fetchUserData();
        setRefreshing(false);
    }, []);

    // Month in JavaScript is 0-indexed (January is 0, February is 1, etc), 
    // but by using 0 as the day it will give us the last day of the prior
    // month. So passing in 1 as the month number will return the last day
    // of January, not February
    const daysInMonth = () => {
        let now = new Date();
        return new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    }

    const currentDateStr = () => {
        // TODO: go into SettingsContext and add a useState for currentLanguage
        const now = new Date();
        const day = now.getDate();
        const month = now.toLocaleString(selectedSettingsLanguage, { month: selectedSettingsLanguage === 'en' ? 'short' : 'long' });
        const year = now.getFullYear();

        return `${day} ${month}, ${year}`
    }

    const toggleMood = (moodKey) => {
        setMoodIconEnable((prev) => {
            const newState = { ...prev, [moodKey]: !prev[moodKey] };
            setMoodIconEnable(newState);
            return newState;
        });
    };

    const toggleFlow = (flowKey) => {
        setFlowIconEnable((prev) => {
            const temp = FLOWS.reduce((acc, { key }) => ({ ...acc, [key]: false }), {});
            const newState = { ...temp, [flowKey]: !prev[flowKey] };
            setFlowIconEnable(newState);
            return newState;
        });
    };

    const toggleSymptom = (symptomKey) => {
        setSymptomIconEnable((prev) => {
            const newState = { ...prev, [symptomKey]: !prev[symptomKey] };
            setSymptomIconEnable(newState);
            return newState;
        });
    };

    const dayStatus = (num) => {
        // current date is latest that it can be
        if (num <= new Date().getDate()) {
            setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), num));
        }
    }

    // Main View return()
    if (isLoading) {
        return (
            <SafeAreaView className="bg-offwhite flex-1">
                <ScrollView
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                >
                    <View className="min-h-[90vw] flex-1 justify-center items-center">
                        <Skeleton circle width={height * 0.1} height={height * 0.1} />
                    </View>

                    <View className="pl-7 pr-7">
                        <Skeleton animation="pulse" width={80} height={40} />
                        <View className="pt-7" />
                        <Skeleton animation="pulse" width="100%" height="20%" />
                        <View className="pt-9" />
                        <Skeleton animation="pulse" width={80} height={40} />
                        <View className="pt-7" />
                        <Skeleton animation="pulse" width="100%" height="20%" />
                    </View>
                </ScrollView>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="bg-offwhite flex-1">
            <ScrollView
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            >
                <View className="p-7 pb-2 gap-y-5">
                    <View className="flex flex-row justify-between items-center">
                        <View className="bg-[#EDEEE0] self-center px-4 py-1 rounded-lg">
                            <Text className="text-lg font-semibold text-teal">{currentDateStr()}</Text>
                        </View>
                        {/* <MaterialCommunityIcons name="account-circle-outline" size={24} color="black" /> */}
                    </View>
                    {showRecommendationText &&
                        <View className="py-2">
                            <TextCard inText={"It seems that you are having an above average blood flow, we recommend you to get some tips on the education page: Blood Flow Control"} />
                        </View>
                    }
                </View>
                <View className="min-h-[90vw] flex-1 justify-center items-center">
                    <View className={`flex-1 items-center justify-center h-[63%] aspect-square absolute rounded-full bg-salmon border-[17px] ${Platform.OS === "ios" ? "border-offwhite/30" : "border-[#FF7F7380]"}`}>
                        {
                            currentPeriodDay !== 0 ?
                            <>
                                {
                                    selectedSettingsLanguage == "en" ?
                                    <>
                                        <Text className="text-slate-50 text-3xl font-semibold">Day {currentPeriodDay}</Text>
                                        <Text className="text-slate-50 text-base font-semibold mt-1">of period</Text> 
                                    </>
                                    :
                                    <Text className="text-slate-50 text-3xl font-semibold">{i18n.t('home.dayOfPeriod').replace("{day}", currentPeriodDay)}</Text>
                                }
                            </>
                            :
                            <Text className="text-slate-50 text-3xl font-semibold px-2 text-center">{i18n.t('home.logYourData')}</Text>
                        }
                    </View>
                    <View className="flex items-center justify-center">
                        {dateCircleArr}
                    </View>
                </View>

                <View className="pl-7">
                    <Text className="font-semibold text-lg mb-1.5">{i18n.t('home.bloodFlow')}</Text>
                    <ScrollView horizontal className="flex flex-row gap-4 mb-3.5">
                        {FLOWS.map(({ key, DefaultIcon, SelectedIcon, label }) => (
                            <View key={key} className="justify-center items-center">
                                {flowIconEnable[key] ? (
                                    <SelectedIcon onPress={() => toggleFlow(key)} />
                                ) : (
                                    <DefaultIcon onPress={() => toggleFlow(key)} />
                                )}
                                <Text className="text-xs text-center mt-1.5 font-light">{label}</Text>
                            </View>
                        ))}
                        <View className="mr-1"></View>
                    </ScrollView>

                    <Text className="font-semibold text-lg my-1.5">{i18n.t('home.yourMood')}</Text>
                    <ScrollView horizontal className="flex flex-row gap-4 mb-3.5">
                        {MOODS.map(({ key, DefaultIcon, SelectedIcon, label }) => (
                            <View key={key} className="justify-center items-center">
                                {moodIconEnable[key] ? (
                                    <SelectedIcon className="shadow shadow-turquoise" onPress={() => toggleMood(key)} />
                                ) : (
                                    <DefaultIcon onPress={() => toggleMood(key)} />
                                )}
                                <Text className="text-xs text-center mt-1.5 font-light">{label}</Text>
                            </View>
                        ))}
                        <View className="mr-1"></View>
                    </ScrollView>

                    <Text className="font-semibold text-lg my-1.5">{i18n.t('home.yourSymptoms')}</Text>
                    <ScrollView horizontal={true} className="flex flex-row gap-4 mb-3.5">
                        {SYMPTOMS.map(({ key, DefaultIcon, SelectedIcon, label }) => (
                            <View key={key} className="justify-center items-center">
                                {symptomIconEnable[key] ? (
                                    <SelectedIcon className="shadow shadow-turquoise" onPress={() => toggleSymptom(key)} />
                                ) : (
                                    <DefaultIcon onPress={() => toggleSymptom(key)} />
                                )}
                                <Text className="text-xs text-center mt-1.5 font-light w-[68px]">{label}</Text>
                            </View>
                        ))}
                        <View className="mr-1"></View>
                    </ScrollView>
                </View>

                <View className="mt-3">
                    <DynamicNote mode="dates" noteKey={selectedDate}/>
                </View>

                {/* TODO: Remove */}
                <View className="p-7">
                    <Text className="font-semibold text-lg mb-1.5">{i18n.t('home.forYou')}</Text>
                    <ScrollView horizontal={true} className="flex flex-row gap-6 mb-3.5">
                        <Image className="object-cover w-52 h-32 bg-teal rounded-xl" source={require("../assets/the_first_period.png")} />
                    </ScrollView>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollViewStyle: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0
    },
});

export default HomeScreen;

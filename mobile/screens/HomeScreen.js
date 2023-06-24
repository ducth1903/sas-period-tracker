import React, { useContext, useEffect, useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    RefreshControl,
    ScrollView,
    SafeAreaView,
    // Pressable,
    // Platform,
    // ImageBackground,
    // Animated,
    Dimensions,
    Image,
} from 'react-native';
// import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { Skeleton } from '@rneui/themed';
import { TextInput } from 'react-native-gesture-handler';

import { AuthContext } from '../navigation/AuthProvider';
import { SettingsContext } from '../navigation/SettingsProvider';
// import FormButton from '../components/FormButton';
import DateCircle from '../components/DateCircle';
import TextCard from '../components/TextCard';
// import ProgressiveImage from '../components/ProgressiveImage';
import i18n from '../translations/i18n';
import * as SVG from '../assets/svg';

// Loading env variables
import getEnvVars from '../environment';
const { API_URL } = getEnvVars();

const HomeScreen = () => {
    const { height } = Dimensions.get("screen");
    const { userId } = useContext(AuthContext);
    const { selectedSettingsLanguage } = useContext(SettingsContext);
    const [userObj, setUserObj] = useState(null);
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
    
    const [flowIconEnable, setFlowIconEnable] = useState(FLOWS.reduce((acc, { key }) => ({ ...acc, [key]: false }), {}));
    const [moodIconEnable, setMoodIconEnable] = useState(MOODS.reduce((acc, { key }) => ({ ...acc, [key]: false }), {}));
    const [symptomIconEnable, setSymptomIconEnable] = useState(SYMPTOMS.reduce((acc, { key }) => ({ ...acc, [key]: false }), {}));

    // Async function to fetch user data
    async function fetchUserData() {
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

    // This will be run after the component is mounted and after every render cycle
    // i.e. whenever your functional component re-runs/re-renders
    useEffect(() => {
        // to avoid state update on unmounted component issue
        // https://www.debuggr.io/react-update-unmounted-component/
        fetchUserData();

        // Get number of days for this month and populate dateCircleArr
        const numDaysInMonth = daysInMonth();
        const dateCircleRotateDegree = 360 / numDaysInMonth;
        const tmp = [];
        for (let i = 0; i < numDaysInMonth; i++) {
            let rotateDeg = Math.round(dateCircleRotateDegree * i);
            tmp.push(
                <DateCircle inText={i + 1}
                    outerRotate={{ transform: [{ rotate: `${rotateDeg + 45}deg` }] }}
                    innerRotate={{ transform: [{ rotate: `-${rotateDeg + 45}deg` }] }}
                    currentDay={new Date().getDate()}
                    key={i + 1}
                    periodDays={[3, 4, 5, 6, 7]}
                    dayStatus={dayStatus}
                />
            );
        }
        setDateCirleArr(tmp);
        // return in useEffect() specifies how to "clean up" after effects
        // return () => mounted = false;
    }, []);

    // Pull down to refresh
    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        fetchUserData();
        setRefreshing(false);
    }, []);

    // Utils
    // const getImagePresignedUrl = async (inImageId) => {
    //     try {
    //         await fetch(`${API_URL}/imagepresigned/${inImageId}`, { method: "GET" })
    //             .then(resp => resp.json())
    //             .then(data => {
    //                 // console.log('presigned url = ', data);
    //                 setProfileImageUri(data['presignedUrl']);
    //             })
    //             .catch(error => console.log(error))
    //     } catch {
    //         console.log('Error in getImagePresignedUrl', inImageId)
    //     }
    // }

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

    const mockDataStatus = [
        {
            "dateStr": "3",
            "flow": "heavy",
            "moods": ["angry","anxious"],
            "symptoms": ["cravings","cramps","headache"]
        },
        {
            "dateStr": "4",
            "flow": "medium",
            "moods": ["sad","sensitive"],
            "symptoms": ["backache","bloating","fatigue","creamy"]
        },
        {
            "dateStr": "5",
            "flow": "medium",
            "moods": ["excited"],
            "symptoms": ["bloating","nausea","cramps"]
        },
        {
            "dateStr": "6",
            "flow": "light",
            "moods": ["sad","sensitive"],
            "symptoms": ["backache","watery","tender"]
        },
        {
            "dateStr": "7",
            "flow": "light",
            "moods": ["excited","sad","sensitive","angry"],
            "symptoms": ["bloating","fatigue","backache","watery","tender"]
        },
    ];

    const dayStatus = (num) => {
        const temp_flow = FLOWS.reduce((acc, { key }) => ({ ...acc, [key]: false }), {});
        let temp_mood = MOODS.reduce((acc, { key }) => ({ ...acc, [key]: false }), {});
        let temp_symptom = SYMPTOMS.reduce((acc, { key }) => ({ ...acc, [key]: false }), {});

        setFlowIconEnable(temp_flow);
        setSymptomIconEnable(temp_mood);
        setMoodIconEnable(temp_mood);

        for(const data of mockDataStatus){
            const {dateStr, flow, moods, symptoms} = data;

            if(parseInt(dateStr) == num){
                const newState = { ...temp_flow, [flow]: true };
                setFlowIconEnable(newState);

                setMoodIconEnable(() => {
                    for(const mood of moods){
                        temp_mood = { ...temp_mood, [mood]: true };
                    }
                    return temp_mood;
                });

                setSymptomIconEnable(()=>{
                    for(const symptom of symptoms){
                        temp_symptom = { ...temp_symptom, [symptom]: true };
                    }
                    return temp_symptom;
                });
                break;
            }
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
                    <View className="flex-1 items-center justify-center h-[63%] aspect-square absolute rounded-full bg-salmon border-[17px] border-offwhite/50">
                        {
                            // TODO: get actual day of period from backend
                            // NOTE: Unsure of how to split the string onto two lines in Kannada and Hindi
                            selectedSettingsLanguage == "en" ?
                            <>
                                <Text className="text-slate-50 text-3xl font-semibold self-center text-center">Day 1</Text>
                                <Text className="text-slate-50 text-base font-semibold mt-1">of period</Text>
                            </>
                            :
                            <Text className="text-slate-50 text-3xl font-semibold self-center text-center">{i18n.t('home.dayOfPeriod').replace("{day}", 1)}</Text>
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

                <View className="px-7 w-screen">
                    <View className="w-full h-28 border-2 border-turquoise rounded-xl p-3">
                        <TextInput className="text-teal font-light" placeholder={i18n.t('home.addYourNotesHere')} />
                        <View className="bg-turquoise p-2 rounded-md absolute right-2 bottom-2"><Text className="self-center text-slate-50">{i18n.t('home.save')}</Text></View>
                    </View>
                </View>

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

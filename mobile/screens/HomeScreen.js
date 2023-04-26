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
// import FormButton from '../components/FormButton';
import DateCircle from '../components/DateCircle';
// import ProgressiveImage from '../components/ProgressiveImage';
import i18n from '../translations/i18n';
import * as SVG from '../assets/svg';

const FLOWS = [
    { key: 'none', label: 'None', selected: false, DefaultIcon: SVG.FlowNoneDefault, SelectedIcon: SVG.FlowNoneSelected },
    { key: 'light', label: 'Light', selected: false, DefaultIcon: SVG.FlowLightDefault, SelectedIcon: SVG.FlowLightSelected },
    { key: 'medium', label: 'Medium', selected: false, DefaultIcon: SVG.FlowMediumDefault, SelectedIcon: SVG.FlowMediumSelected },
    { key: 'heavy', label: 'Heavy', selected: false, DefaultIcon: SVG.FlowHeavyDefault, SelectedIcon: SVG.FlowHeavySelected },
    { key: 'notsure', label: 'Not Sure', selected: false, DefaultIcon: SVG.FlowNotSureDefault, SelectedIcon: SVG.FlowNotSureSelected },
];

const MOODS = [
    { key: 'excited', DefaultIcon: SVG.MoodExcitedDefault, SelectedIcon: SVG.MoodExcitedSelected, label: 'Excited', },
    { key: 'happy', DefaultIcon: SVG.MoodHappyDefault, SelectedIcon: SVG.MoodHappySelected, label: 'Happy', },
    { key: 'sensitive', DefaultIcon: SVG.MoodSensitiveDefault, SelectedIcon: SVG.MoodSensitiveSelected, label: 'Sensitive', },
    { key: 'sad', DefaultIcon: SVG.MoodSadDefault, SelectedIcon: SVG.MoodSadSelected, label: 'Sad', },
    { key: 'anxious', DefaultIcon: SVG.MoodAnxiousDefault, SelectedIcon: SVG.MoodAnxiousSelected, label: 'Anxious', },
    { key: 'angry', DefaultIcon: SVG.MoodAngryDefault, SelectedIcon: SVG.MoodAngrySelected, label: 'Angry', },
    { key: 'customize', DefaultIcon: SVG.MoodCustomizeDefault, SelectedIcon: SVG.MoodCustomizeSelected, label: 'Customize', },
];

const SYMPTOMS = [
    { key: 'cravings', label: 'Cravings', DefaultIcon: SVG.SymptomCravingsDefault, SelectedIcon: SVG.SymptomCravingsSelected },
    { key: 'backache', label: 'Backache', DefaultIcon: SVG.SymptomBackacheDefault, SelectedIcon: SVG.SymptomBackacheSelected },
    { key: 'cramps', label: 'Cramps', DefaultIcon: SVG.SymptomCrampsDefault, SelectedIcon: SVG.SymptomCrampsSelected },
    { key: 'bloating', label: 'Bloating', DefaultIcon: SVG.SymptomBloatingDefault, SelectedIcon: SVG.SymptomBloatingSelected },
    { key: 'tender', label: 'Tender', DefaultIcon: SVG.SymptomTenderDefault, SelectedIcon: SVG.SymptomTenderSelected },
    { key: 'headache', label: 'Headache', DefaultIcon: SVG.SymptomHeadacheDefault, SelectedIcon: SVG.SymptomHeadacheSelected },
    { key: 'fatigue', label: 'Fatigue', DefaultIcon: SVG.SymptomFatigueDefault, SelectedIcon: SVG.SymptomFatigueSelected },
    { key: 'nausea', label: 'Nausea', DefaultIcon: SVG.SymptomNauseaDefault, SelectedIcon: SVG.SymptomNauseaSelected },
    { key: 'stringy', label: 'Discharge: Stringy', DefaultIcon: SVG.SymptomDischargeStringy, SelectedIcon: SVG.SymptomDischargeStringySelected },
    { key: 'watery', label: 'Discharge: Watery', DefaultIcon: SVG.SymptomDischargeWatery, SelectedIcon: SVG.SymptomDischargeWaterySelected },
    { key: 'transparent', label: 'Discharge: Transparent', DefaultIcon: SVG.SymptomDischargeTransparent, SelectedIcon: SVG.SymptomDischargeTransparentSelected },
    { key: 'creamy', label: 'Discharge: Creamy', DefaultIcon: SVG.SymptomDischargeCreamy, SelectedIcon: SVG.SymptomDischargeCreamySelected },
    { key: 'clumpy', label: 'Discharge: Clumpy', DefaultIcon: SVG.SymptomDischargeClumpy, SelectedIcon: SVG.SymptomDischargeClumpySelected },
    { key: 'sticky', label: 'Discharge: Sticky', DefaultIcon: SVG.SymptomDischargeSticky, SelectedIcon: SVG.SymptomDischargeStickySelected },
];

// Loading env variables
import getEnvVars from '../environment';
import TextCard from '../components/TextCard';
const { API_URL } = getEnvVars();

const HomeScreen = () => {
    const { height } = Dimensions.get("screen");
    const { userId } = useContext(AuthContext);
    const [userObj, setUserObj] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [dateCircleArr, setDateCirleArr] = useState(null);
    const [flowIconEnable, setFlowIconEnable] = useState(FLOWS.reduce((acc, { key }) => ({ ...acc, [key]: false }), {}));
    const [moodIconEnable, setMoodIconEnable] = useState(MOODS.reduce((acc, { key }) => ({ ...acc, [key]: false }), {}));
    const [symptomIconEnable, setSymptomIconEnable] = useState(SYMPTOMS.reduce((acc, { key }) => ({ ...acc, [key]: false }), {}));
    const [showRecommendationText, setShowRecommendationText] = useState(false);

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
        let [month, day, year] = (new Date()).toString().split(' ').splice(1, 3);
        return day + ' ' + month + ', ' + year;
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
            const newState = { ...prev, [flowKey]: !prev[flowKey] };
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
                        <Text className="text-slate-50 text-3xl font-semibold">Day 1</Text>
                        <Text className="text-slate-50 text-base font-semibold mt-1">of period</Text>
                    </View>
                    <View className="flex items-center justify-center">
                        {dateCircleArr}
                    </View>
                </View>

                <View className="pl-7">
                    <Text className="font-semibold text-lg mb-1.5">Blood flow</Text>
                    <ScrollView horizontal className="flex flex-row gap-4 mb-3.5">
                        {FLOWS.map(({ key, DefaultIcon, SelectedIcon, label }) => (
                            <View key={key}>
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

                    <Text className="font-semibold text-lg my-1.5">How do you feel?</Text>
                    <ScrollView horizontal className="flex flex-row gap-4 mb-3.5">
                        {MOODS.map(({ key, DefaultIcon, SelectedIcon, label }) => (
                            <View key={key}>
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

                    <Text className="font-semibold text-lg my-1.5">Your symptoms</Text>
                    <ScrollView horizontal={true} className="flex flex-row gap-4 mb-3.5">
                        {SYMPTOMS.map(({ key, DefaultIcon, SelectedIcon, label }) => (
                            <View key={key}>
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
                        <TextInput className="text-teal font-light" placeholder="Add your notes here..." />
                        <View className="bg-turquoise w-16 p-2 rounded-md absolute right-2 bottom-2"><Text className="self-center text-slate-50">Save</Text></View>
                    </View>
                </View>

                <View className="p-7">
                    <Text className="font-semibold text-lg mb-1.5">For you</Text>
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

import React, { useContext, useEffect, useState, useRef, useMemo, useCallback, useReducer } from 'react';
import {
    StyleSheet,
    Text,
    View,
    RefreshControl,
    ScrollView,
    SafeAreaView,
    Pressable,
    Platform,
    ImageBackground,
    Animated,
    TouchableHighlight,
    Dimensions,
    Image,
} from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
// import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import BottomSheet from '@gorhom/bottom-sheet';
import BottomSheetCustomBackground from '../components/BottomSheetCustomBackground';

import { AuthContext } from '../navigation/AuthProvider';
import FormButton from '../components/FormButton';
import DateCircle from '../components/DateCircle';
// import LoadingIndicator from '../components/LoadingIndicator';
// import ProgressiveImage from '../components/ProgressiveImage';
import i18n from '../translations/i18n';

import * as SVG from '../svg'

const FLOWS = [
    { key: 'none', label: 'None', selected: false, DefaultIcon: SVG.FlowNoneDefault, SelectedIcon: SVG.FlowNoneSelected },
    { key: 'light', label: 'Light', selected: false, DefaultIcon: SVG.FlowLightDefault, SelectedIcon: SVG.FlowLightSelected },
    { key: 'medium', label: 'Medium', selected: false, DefaultIcon: SVG.FlowMediumDefault, SelectedIcon: SVG.FlowMediumSelected },
    { key: 'heavy', label: 'Heavy', selected: false, DefaultIcon: SVG.FlowHeavyDefault, SelectedIcon: SVG.FlowHeavySelected },
    { key: 'notsure', label: 'Not Sure', selected: false, DefaultIcon: SVG.FlowNotSureDefault, SelectedIcon: SVG.FlowNotSureSelected },
];

const MOODS = [
    { key: 'excited', DefaultIcon: SVG.MoodExcitedDefault, SelectedIcon: SVG.MoodExcitedSelected, label: 'Excited',},
    { key: 'happy', DefaultIcon: SVG.MoodHappyDefault, SelectedIcon: SVG.MoodHappySelected, label: 'Happy',},
    { key: 'sensitive', DefaultIcon: SVG.MoodSensitiveDefault, SelectedIcon: SVG.MoodSensitiveSelected, label: 'Sensitive',},
    { key: 'sad', DefaultIcon: SVG.MoodSadDefault, SelectedIcon: SVG.MoodSadSelected, label: 'Sad',},
    { key: 'anxious', DefaultIcon: SVG.MoodAnxiousDefault, SelectedIcon: SVG.MoodAnxiousSelected, label: 'Anxious',},
    { key: 'angry', DefaultIcon: SVG.MoodAngryDefault, SelectedIcon: SVG.MoodAngrySelected, label: 'Angry',},
    { key: 'customize', DefaultIcon: SVG.MoodCustomizeDefault, SelectedIcon: SVG.MoodCustomizeSelected, label: 'Customize',},
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
import { Switch, TextInput } from 'react-native-gesture-handler';
import { Button } from 'react-native-paper';
const { API_URL } = getEnvVars();

const HomeScreen = ({ props }) => {
    const { userId } = useContext(AuthContext);
    const [userObj, setUserObj] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const bottomSheetRef = useRef(null);
    const snapPoints = useMemo(() => ['30%'], []);
    const [profileImageUri, setProfileImageUri] = useState('../assets/profile_images/default_profile_women_1.jpg');
    const fall = useRef(new Animated.Value(1)).current;    // useRef = mutable object
    let fall_ctrl = 1;
    const [dateCircleArr, setDateCirleArr] = useState(null);
    let dateCircleRotateDegree = 0;
    const [flowIconEnable, setFlowIconEnable] = useState(FLOWS.reduce((acc, { key }) => ({ ...acc, [key]: false }), {}));
    const [moodIconEnable, setMoodIconEnable] = useState(MOODS.reduce((acc, { key }) => ({ ...acc, [key]: false }), {}));
    const [symptomIconEnable, setSymptomIconEnable] = useState(SYMPTOMS.reduce((acc, { key }) => ({ ...acc, [key]: false }), {}));

    // Async function to fetch user data
    async function fetchUserData() {
        await fetch(`${API_URL}/users/${userId}`, { method: "GET" })
            .then(resp => resp.json())
            .then(data => {
                setUserObj(data);
                getImagePresignedUrl(data['profileImageId']);
                setIsLoading(false);
            })
            .catch(error => { console.log("[HomeScreen] fetchUserData() error:", error) })
    }

    // This will be run after the component is mounted and after every render cycle
    // i.e. whenever your functional component re-runs/re-renders
    useEffect(() => {
        // to avoid state update on unmounted component issue
        // https://www.debuggr.io/react-update-unmounted-component/
        fetchUserData();

        // Get number of days for this month and populate dateCircleArr
        const numDaysInMonth = daysInMonth();
        dateCircleRotateDegree = 360 / numDaysInMonth;
        let tmp = [];
        for (let i = 0; i < numDaysInMonth; i++) {
            let rotateDeg = Math.round(dateCircleRotateDegree * i);
            tmp.push(
                <DateCircle inText={i + 1}
                    outerRotate={{ transform: [{ rotate: `${rotateDeg + 45}deg` }] }}
                    innerRotate={{ transform: [{ rotate: `-${rotateDeg + 45}deg` }] }} 
                    currentDay={new Date().getDate()}
                    key={i+1}
                    periodDays={[3,4,5,6,7]}
                />
            );
            // if (i == 2) break
        }
        // console.log('here...', tmp)
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

    // -----------------------------------------------
    // Bottom sheet for uploading/taking profile image
    // -----------------------------------------------
    // const renderBottomSheetContent = () => (
    //     <View
    //     style={{
    //         backgroundColor: 'white',
    //         padding: 20,
    //         paddingTop: 20,
    //     }}
    //     >
    //         <FormButton 
    //             btnTitle="Take Photo"
    //             isHighlight={true} 
    //             onPress={ onPressTakingPhoto } />
    //         <FormButton 
    //             btnTitle="Upload Photo"
    //             isHighlight={true} 
    //             onPress={ onPressUploadPhoto } />
    //     </View>
    // );
    // const renderBottomSheetHeader = () => (
    //     <View style={styles.bottomSheetHeader}>
    //         <View style={styles.bottomSheetPanelHeader}>
    //             <View style={styles.bottomSheetPanelHandle} />
    //         </View>
    //     </View>
    // );

    const handleSheetChanges = useCallback((index) => {
        console.log('handleSheetChanges', index);
        fall_ctrl = fall_ctrl ^ 1;
        Animated.timing(fall, {
            toValue: fall_ctrl,
            duration: 100,
            useNativeDriver: true,
        }).start();
    }, []);

    async function onPressTakingPhoto() {
        if (Platform.OS !== 'web') {
            const { status } = await ImagePicker.requestCameraPermissionsAsync();
            if (status !== 'granted') {
                alert('You may need to change it in Settings if you want to proceed!');
            }
        }

        let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.cancelled) {
            // Upload image to S3 in 2 steps:
            // 1. Contact server to get presigned URL to S3
            // 2. Upload image to S3 using presigned URL
            postImagePresignedUrl(result.uri);
            updateUserImageInDB();
            setProfileImageUri(result.uri);
            bottomSheetRef.current?.close();
        }
    }

    async function onPressUploadPhoto() {
        if (Platform.OS !== 'web') {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                alert('You may need to change it in Settings if you want to proceed!');
            }
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.cancelled) {
            // Upload image to S3 in 2 steps:
            // 1. Contact server to get presigned URL to S3
            // 2. Upload image to S3 using presigned URL
            postImagePresignedUrl(result.uri);
            updateUserImageInDB();
            setProfileImageUri(result.uri);
            bottomSheetRef.current?.close();
        }
    };
    // End Bottom sheet

    // Utils
    const getImagePresignedUrl = async (inImageId) => {
        try {
            await fetch(`${API_URL}/imagepresigned/${inImageId}`, { method: "GET" })
                .then(resp => resp.json())
                .then(data => {
                    // console.log('presigned url = ', data);
                    setProfileImageUri(data['presignedUrl']);
                })
                .catch(error => console.log(error))
        } catch {
            console.log('Error in getImagePresignedUrl', inImageId)
        }
    }

    const uploadImageViaPresignedUrl = async (imageUri, inPresignedUrl) => {
        // get image blob
        const inImageUri = Platform.OS === 'ios' ? imageUri.replace('file://', '') : imageUri;
        const response = await fetch(inImageUri);
        const blob = await response.blob();
        // const reader = new FileReader();
        // reader.readAsDataURL(blob)       // convert to base64-encoding?

        await fetch(inPresignedUrl, {
            method: "PUT",
            body: blob,
            headers: {
                "Content-Type": "image/jpeg",
            }
        })
            .catch(error => console.log(error))
    }

    const postImagePresignedUrl = async (imageUri) => {
        let presignedUrl = ''
        await fetch(`${API_URL}/imagepresigned/${userId}.jpg`, {
            method: "POST",
        })
            .then(resp => resp.json())
            .then(data => {
                presignedUrl = data['presignedUrl']
            })
            .catch(error => { console.log(error) })

        if (presignedUrl) {
            // Now that we have presigned URL -> upload image to S3
            uploadImageViaPresignedUrl(imageUri, presignedUrl)
        }
    }

    async function updateUserImageInDB() {
        await fetch(`${API_URL}/users/${userId}`, {
            method: "PUT",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                "profileImageId": `${userId}.jpg`
            })
        })
            .catch(error => { console.log(error) })
    }

    // Month in JavaScript is 0-indexed (January is 0, February is 1, etc), 
    // but by using 0 as the day it will give us the last day of the prior
    // month. So passing in 1 as the month number will return the last day
    // of January, not February
    const daysInMonth = () => {
        let now = new Date();
        return new Date(now.getFullYear(), now.getMonth()+1, 0).getDate();
    }

    const currentDateStr = () => {
        let [month, day, year] = (new Date()).toString().split(' ').splice(1,3);
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
        console.log('[HomeScreen] loading...');
        return (
            <ScrollView
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                contentContainerStyle={styles.scrollViewStyle}
            >
                {/* <LoadingIndicator/> */}
                {/* <SkeletonPlaceholder>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <View style={{ width: 60, height: 60, borderRadius: 50 }} />
                    <View style={{ marginLeft: 20 }}>
                    <View style={{ width: 120, height: 20, borderRadius: 4 }} />
                    <View
                        style={{ marginTop: 6, width: 80, height: 20, borderRadius: 4 }}
                    />
                    </View>
                </View>
                </SkeletonPlaceholder> */}
            </ScrollView>
        )
    }

    return (
        <SafeAreaView className="flex-1">
            <ScrollView
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            >
                <View className="p-7 pb-2 gap-y-5">
                    <View className="flex flex-row justify-between items-center">
                        <View className="bg-[#EDEEE0] self-center px-4 py-1 rounded-lg">
                            <Text className="text-lg font-semibold text-teal">{currentDateStr()}</Text>
                        </View>
                        <MaterialCommunityIcons name="account-circle-outline" size={24} color="black" />
                    </View>
                    <View 
                        className="border-[0.8px] px-4 py-2 rounded-2xl"
                        style={styles.textbox}
                    >
                        <Text className="text-teal text-xs">
                        It seems that you are having an above average blood flow, we recommend you to get some tips on the education page: Blood Flow Control
                        </Text>
                    </View>
                </View>

                <View className="min-h-[90vw] flex-1 justify-center items-center">
                    <View className="
                    flex-1 items-center justify-center h-[63%] aspect-square absolute rounded-full bg-salmon border-[17px] border-offwhite/50">
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

                    <Text className="font-semibold text-lg my-1.5">Your mood</Text>
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
                                <DefaultIcon  onPress={() => toggleSymptom(key)} />
                            )}
                            <Text className="text-xs text-center mt-1.5 font-light w-[68px]">{label}</Text>
                            </View>
                        ))}
                        <View className="mr-1"></View>
                    </ScrollView>
                </View>

                <View className="px-7 w-screen">
                    <View className="w-full h-28 border-2 border-turquoise rounded-xl p-3">
                        <TextInput className="text-teal font-light" placeholder="Add your notes here..."/>
                        <View className="bg-turquoise w-16 p-2 rounded-md absolute right-2 bottom-2"><Text className="self-center text-slate-50">Save</Text></View>
                    </View>
                </View>

                <View className="p-7">
                    <Text className="font-semibold text-lg mb-1.5">For you</Text>
                    <ScrollView horizontal={true} className="flex flex-row gap-6 mb-3.5"> 
                        <Image className="object-cover w-52 h-32 bg-teal rounded-xl" source={require("../assets/the_first_period.png")}/>
                    </ScrollView>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}


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

    // bottomSheetHeader: {
    //     backgroundColor: '#FFFFFF',
    //     shadowColor: '#333333',
    //     shadowOffset: {width: -1, height: -3},
    //     shadowRadius: 2,
    //     shadowOpacity: 0.4,
    //     // elevation: 5,
    //     paddingTop: 20,
    //     borderTopLeftRadius: 20,
    //     borderTopRightRadius: 20,
    // },
    // bottomSheetPanelHeader: {
    //     alignItems: 'center',
    // },
    // bottomSheetPanelHandle: {
    //     width: 40,
    //     height: 8,
    //     borderRadius: 4,
    //     backgroundColor: '#00000040',
    //     marginBottom: 10,
    // },

    bottomSheetStyle: {
        // backgroundColor: 'red',
        shadowColor: "#333333",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.32,
        shadowRadius: 5.46,
        elevation: 9,
    },

    textbox: {
        borderColor: '#00394E',
    }
})

export default HomeScreen;
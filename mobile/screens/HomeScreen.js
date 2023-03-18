import React, { useContext, useEffect, useState, useRef, useMemo, useCallback } from 'react';
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
    Dimensions
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

// Loading env variables
import getEnvVars from '../environment';
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
    const [todayStr, setTodayStr] = useState('');
    let dateCircleRotateDegree = 0;

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
                    innerRotate={{ transform: [{ rotate: `-${rotateDeg + 45}deg` }] }} />
            );
            // if (i == 2) break
        }
        // console.log('here...', tmp)
        setDateCirleArr(tmp);
        setTodayStr(currentDate());
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

    const currentDate = () => {
        let [month, day, year] = (new Date()).toString().split(' ').splice(1,3)
        return day + ' ' + month + ', ' + year;
    }
    // End utils

    // Main View return()
    if (!isLoading) {
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
                <View className="p-6 pb-2 gap-y-5">
                    <View className="flex flex-row justify-between items-center">
                        <View className="bg-dullgray self-center px-4 py-1 rounded-lg">
                            <Text className="text-lg font-semibold text-teal">{todayStr}</Text>
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

                <View className="min-h-[85vw] flex-1 justify-center items-center">
                    <TouchableHighlight className="
                    flex-1 items-center justify-center h-3/5 aspect-square absolute rounded-full bg-red-400 border-[15px] border-offwhite/50">
                        <Text className="text-white">Hello Circle</Text>
                    </TouchableHighlight>
                    <View className="flex items-center justify-center">
                        {dateCircleArr}
                    </View>
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
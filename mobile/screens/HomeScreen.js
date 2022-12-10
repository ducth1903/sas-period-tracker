import React, {useContext, useEffect, useState, useRef, useMemo, useCallback} from 'react';
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
    Animated
} from 'react-native';
import { Feather } from '@expo/vector-icons'; 
import * as ImagePicker from 'expo-image-picker';
// import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import BottomSheet from '@gorhom/bottom-sheet';
import BottomSheetCustomBackground from '../components/BottomSheetCustomBackground';

import { AuthContext } from '../navigation/AuthProvider';
import FormButton from '../components/FormButton';
// import LoadingIndicator from '../components/LoadingIndicator';
// import ProgressiveImage from '../components/ProgressiveImage';
import i18n from '../translations/i18n';

// Loading env variables
import getEnvVars from '../environment';
const { API_URL } = getEnvVars();

const HomeScreen = ({ props }) => {
    const { userId }                    = useContext(AuthContext);
    const [userObj, setUserObj]         = useState(null);
    const [isLoading, setIsLoading]     = useState(true);
    const [refreshing, setRefreshing]   = useState(false);
    const bottomSheetRef                = useRef(null);
    const snapPoints                    = useMemo(() => ['30%'], []);
    const [profileImageUri, setProfileImageUri] = useState('../assets/profile_images/default_profile_women_1.jpg');
    const fall                          = useRef(new Animated.Value(1)).current;    // useRef = mutable object
    let fall_ctrl                       = 1;

    // Async function to fetch user data
    async function fetchUserData() {
        await fetch(`${API_URL}/users/${userId}`, { method: "GET" })
        .then(resp => resp.json())
        .then(data => {
            setUserObj(data);
            getImagePresignedUrl(data['profileImageId']);
            setIsLoading(false);
        })
        .catch(error => {console.log("[HomeScreen] fetchUserData() error:", error)})
    }

    // This will be run after the component is mounted and after every render cycle
    // i.e. whenever your functional component re-runs/re-renders
    useEffect(() => {
        // to avoid state update on unmounted component issue
        // https://www.debuggr.io/react-update-unmounted-component/
        fetchUserData();

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
            const {status} = await ImagePicker.requestCameraPermissionsAsync();
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
            setProfileImageUri( result.uri );
            bottomSheetRef.current?.close();
        }
    }

    async function onPressUploadPhoto() {
        if (Platform.OS !== 'web') {
            const {status} = await ImagePicker.requestMediaLibraryPermissionsAsync();
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
            setProfileImageUri( result.uri );
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
        const inImageUri= Platform.OS === 'ios' ? imageUri.replace('file://', '') : imageUri;
        const response  = await fetch(inImageUri);
        const blob      = await response.blob();
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
        .catch(error => {console.log(error)})
        
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
                "profileImageId"    : `${userId}.jpg`
            })
        })
        .catch(error => {console.log(error)})
    }

    // End utils
    
    // Main View return()
    if (isLoading) {
        console.log('[HomeScreen] loading...');
        return (
            <ScrollView
                refreshControl={ <RefreshControl refreshing={refreshing} onRefresh={onRefresh}/> }
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
        <SafeAreaView style={styles.container}>
            <ScrollView
            refreshControl={ <RefreshControl refreshing={refreshing} onRefresh={onRefresh}/> }
            contentContainerStyle={styles.scrollViewStyle}
            >
                <Animated.View style={[
                    styles.scrollViewStyle,
                    {opacity: Animated.add(0.2, Animated.multiply(fall, 1.0))}
                ]}>
                    <Pressable onPress={() => {
                        bottomSheetRef.current?.snapToIndex(0);
                        // bottomSheetRef.current?.expand();
                    }}>
                        {/* <Avatar.Image
                            source={{ uri: profileImageUri }}
                            size={100}
                            style={{margin: 10}} />
                        <Feather name="camera" size={24} color="black" /> */}
                        <ImageBackground
                            source={{ uri: profileImageUri }}
                            style={{margin: 10, height: 100, width: 100}}
                            imageStyle={{borderRadius: 15}}
                        >
                            <View style={{flex:1, justifyContent: 'center', alignItems: 'center'}}>
                                <Feather name="camera" size={24} color="white"/>
                            </View>
                        </ImageBackground>

                        {/* <ProgressiveImage
                            defaultImageSrc={ require('../assets/profile_images/default_img.png') }
                            imageSrc={{ uri: profileImageUri }}
                            style={{margin: 10, height: 100, width: 100}}
                        /> */}

                    </Pressable>
                    
                    <Text>{userObj['firstName']} {userObj['lastName']}</Text>
                    <Text>Email: {userObj['email']}</Text>
                    <Text>DoB: {userObj['dob']}</Text>
                    <Text>Server IP: {API_URL}</Text>
                    <Text>{i18n.t('home.welcome', {appName: 'SAS'})}</Text>
                </Animated.View>
            </ScrollView>
            
            <BottomSheet
                ref={bottomSheetRef}
                index={-1}
                snapPoints={snapPoints}
                onChange={handleSheetChanges}
                style={styles.bottomSheetStyle}
                backgroundComponent={BottomSheetCustomBackground}
                enablePanDownToClose={true}
            >
                <FormButton 
                    btnTitle="Take Photo"
                    isHighlight={true} 
                    onPress={ onPressTakingPhoto } />
                <FormButton 
                    btnTitle="Upload Photo"
                    isHighlight={true} 
                    onPress={ onPressUploadPhoto } />
            </BottomSheet>
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
        backgroundColor: '#fff',
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
    }
})

export default HomeScreen;
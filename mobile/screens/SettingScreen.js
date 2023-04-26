import React, { useContext } from 'react';
import { SafeAreaView, StyleSheet, Text, View, Pressable } from 'react-native';
import { AuthContext } from '../navigation/AuthProvider';

const SettingScreen = () => {
    const { userId, logout, toggleTheme } = useContext(AuthContext);

    // For bottom sheet upload image
    // const bottomSheetRef = useRef(null);
    // const snapPoints = useMemo(() => ['30%'], []);
    // const [profileImageUri, setProfileImageUri] = useState('../assets/profile_images/default_profile_women_1.jpg');
    // const fall = useRef(new Animated.Value(1)).current;    // useRef = mutable object
    // let fall_ctrl = 1;

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
    //
    // const handleSheetChanges = useCallback((index) => {
    //     fall_ctrl = fall_ctrl ^ 1;
    //     Animated.timing(fall, {
    //         toValue: fall_ctrl,
    //         duration: 100,
    //         useNativeDriver: true,
    //     }).start();
    // }, []);
    //
    // async function onPressTakingPhoto() {
    //     if (Platform.OS !== 'web') {
    //         const { status } = await ImagePicker.requestCameraPermissionsAsync();
    //         if (status !== 'granted') {
    //             alert('You may need to change it in Settings if you want to proceed!');
    //         }
    //     }
    //
    //     let result = await ImagePicker.launchCameraAsync({
    //         mediaTypes: ImagePicker.MediaTypeOptions.Images,
    //         allowsEditing: true,
    //         aspect: [4, 3],
    //         quality: 1,
    //     });
    //
    //     if (!result.cancelled) {
    //         // Upload image to S3 in 2 steps:
    //         // 1. Contact server to get presigned URL to S3
    //         // 2. Upload image to S3 using presigned URL
    //         postImagePresignedUrl(result.uri);
    //         updateUserImageInDB();
    //         setProfileImageUri(result.uri);
    //         bottomSheetRef.current?.close();
    //     }
    // }
    //
    // async function onPressUploadPhoto() {
    //     if (Platform.OS !== 'web') {
    //         const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    //         if (status !== 'granted') {
    //             alert('You may need to change it in Settings if you want to proceed!');
    //         }
    //     }
    //
    //     let result = await ImagePicker.launchImageLibraryAsync({
    //         mediaTypes: ImagePicker.MediaTypeOptions.Images,
    //         allowsEditing: true,
    //         aspect: [4, 3],
    //         quality: 1,
    //     });
    //
    //     if (!result.cancelled) {
    //         // Upload image to S3 in 2 steps:
    //         // 1. Contact server to get presigned URL to S3
    //         // 2. Upload image to S3 using presigned URL
    //         postImagePresignedUrl(result.uri);
    //         updateUserImageInDB();
    //         setProfileImageUri(result.uri);
    //         bottomSheetRef.current?.close();
    //     }
    // };
    // const uploadImageViaPresignedUrl = async (imageUri, inPresignedUrl) => {
    //     // get image blob
    //     const inImageUri = Platform.OS === 'ios' ? imageUri.replace('file://', '') : imageUri;
    //     const response = await fetch(inImageUri);
    //     const blob = await response.blob();
    //     // const reader = new FileReader();
    //     // reader.readAsDataURL(blob)       // convert to base64-encoding?
    //
    //     await fetch(inPresignedUrl, {
    //         method: "PUT",
    //         body: blob,
    //         headers: {
    //             "Content-Type": "image/jpeg",
    //         }
    //     })
    //         .catch(error => console.log(error))
    // }
    //
    // const postImagePresignedUrl = async (imageUri) => {
    //     let presignedUrl = ''
    //     await fetch(`${API_URL}/imagepresigned/${userId}.jpg`, {
    //         method: "POST",
    //     })
    //         .then(resp => resp.json())
    //         .then(data => {
    //             presignedUrl = data['presignedUrl']
    //         })
    //         .catch(error => { console.log(error) })
    //
    //     if (presignedUrl) {
    //         // Now that we have presigned URL -> upload image to S3
    //         uploadImageViaPresignedUrl(imageUri, presignedUrl)
    //     }
    // }
    //
    // async function updateUserImageInDB() {
    //     await fetch(`${API_URL}/users/${userId}`, {
    //         method: "PUT",
    //         headers: { 'Content-Type': 'application/json' },
    //         body: JSON.stringify({
    //             "profileImageId": `${userId}.jpg`
    //         })
    //     })
    //         .catch(error => { console.log(error) })
    // }
    // End Bottom sheet

    return (
        <SafeAreaView className="bg-offwhite flex-1 justify-center items-center">
            <Text>Setting Page</Text>
            <Pressable mode="contained" onPress={() => logout()}>
                <Text>Sign Out</Text>
            </Pressable>
        </SafeAreaView>
    )
}

export default SettingScreen;
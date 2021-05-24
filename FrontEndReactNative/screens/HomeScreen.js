import React, {useContext, useEffect, useState} from 'react';
import { render } from 'react-dom';
import { StyleSheet, Text, View, RefreshControl, ScrollView, SafeAreaView, Pressable, Platform } from 'react-native';
import { Avatar, FAB } from 'react-native-paper';
import { Feather } from '@expo/vector-icons'; 
import Animated from 'react-native-reanimated';
import BottomSheet from 'reanimated-bottom-sheet';
import * as ImagePicker from 'expo-image-picker';

import { AuthContext } from '../navigation/AuthProvider';
import FormButton from '../components/FormButton';

// Loading env variables
import { LOCAL_DEV_IP } from '@env'

const HomeScreen = ({ props }) => {
    const { userId }                    = useContext(AuthContext);
    const [userObj, setUserObj]         = useState(null);
    const [isLoading, setIsLoading]     = useState(true);
    const [refreshing, setRefreshing]   = useState(false);
    const [profileImageUri, setProfileImageUri] = useState('https://s3-sas-period-tracker.s3.amazonaws.com/profile-images/default_profile_women_1.jpg');
    const bottomSheetRef                = React.useRef(null);
    const fall                          = new Animated.Value(1);

    // Async function to fetch user data
    async function fetchUserData() {
        await fetch(`${LOCAL_DEV_IP}/api/user/${userId}`, { method: "GET" })
        .then(resp => resp.json())
        .then(data => {
            console.log(data);
            setUserObj(data);
            setIsLoading(false);
        })
        .catch(error => {console.log(error)})
    }

    // This will be run after the component is mounted and after every render cycle
    // i.e. whenever your functional component re-runs/re-renders
    useEffect(() => {
        console.log('HomeScreen.useEffect()...')
        let mounted = true;         // to avoid state update on unmounted component issue
                                    // https://www.debuggr.io/react-update-unmounted-component/
        if (mounted) {
            fetchUserData();
        }

        // return in useEffect() specifies how to "clean up" after effects
        return () => mounted = false;
    }, []);

    // const wait = (timeout) => {
    //     return new Promise(resolve => setTimeout(resolve, timeout));
    // }
    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        // wait(2000).then(() => setRefreshing(false));
        fetchUserData();
        setRefreshing(false)
    }, []);

    
    // --- Bottom sheet for uploading/taking profile image
    const onPressProfileImage = () => {
        bottomSheetRef.current.snapTo(0)
    }
    const renderBottomSheetContent = () => (
        <SafeAreaView>
            <View
            style={{
                backgroundColor: 'white',
                padding: 20,
                height: 450,
            }}
            >
                <FormButton 
                    btnTitle="Take Photo"
                    isHighlight={true} 
                    onPress={ ()=>{console.log("take photo clicked")} } />
                <FormButton 
                    btnTitle="Upload Photo"
                    isHighlight={true} 
                    onPress={ onPressUploadPhoto } />
            </View>
        </SafeAreaView>
    );
    const renderBottomSheetHeader = () => (
        <View style={styles.bottomSheetHeader}>
            <View style={styles.bottomSheetPanelHeader}>
                <View style={styles.bottomSheetPanelHandle} />
            </View>
        </View>
    );

    async function onPressUploadPhoto() {
        if (Platform.OS !== 'web') {
            const {status} = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                alert('You may need to change it in Settings if you want to proceed!');
            }
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        console.log('done upload photo: ', result)
        if (!result.cancelled) {
            setProfileImageUri( result.uri );
        }
    };
    // ---
    
    if (isLoading) {
        return (<View><Text>Loading...</Text></View>)
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                refreshControl={ <RefreshControl refreshing={refreshing} onRefresh={onRefresh}/> }
                contentContainerStyle={styles.scrollViewStyle}
            >
                <BottomSheet
                    ref={bottomSheetRef}
                    snapPoints={['30%', 0]}
                    initialSnap={1}
                    callbackNode={fall}
                    borderRadius={10}
                    renderContent={renderBottomSheetContent}
                    renderHeader={renderBottomSheetHeader}
                />
                <Pressable onPress={onPressProfileImage}>
                    {/* <a href="https://www.freepik.com/vectors/woman">Woman vector created by jcomp - www.freepik.com</a> */}
                    <Avatar.Image
                        source={{ uri: profileImageUri }}
                        size={100}
                        style={{margin: 10}} >
                    </Avatar.Image>
                    <Feather name="camera" size={24} color="black" />
                </Pressable>
                <Text>{userObj['firstName']} {userObj['lastName']}</Text>
                <Text>Email: {userObj['email']}</Text>
                <Text>DoB: {userObj['dob']}</Text>
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
        backgroundColor: '#fff',
    },

    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0
    },

    bottomSheetHeader: {
        backgroundColor: '#FFFFFF',
        shadowColor: '#333333',
        shadowOffset: {width: -1, height: -3},
        shadowRadius: 2,
        shadowOpacity: 0.4,
        // elevation: 5,
        paddingTop: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    bottomSheetPanelHeader: {
        alignItems: 'center',
    },
    bottomSheetPanelHandle: {
        width: 40,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#00000040',
        marginBottom: 10,
    },
})

export default HomeScreen;
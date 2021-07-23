import React, { useContext, useEffect, useState } from 'react';
import { Text, View, StyleSheet, Linking, Pressable, Platform } from 'react-native';
// import { Calendar } from 'react-native-calendars';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Animatable from 'react-native-animatable';

import { AuthContext } from '../../navigation/AuthProvider';
import FormInput from '../../components/FormInput';
import { styles as stylesFormInput } from '../../components/FormInput';
import FormButton from '../../components/FormButton';
// import SocialButton from '../../components/SocialButton';

const SignupScreen = ({navigation}) => {
    const initDob = "Date of Birth*"

    const {signup, authError, setAuthError}     = useContext(AuthContext);
    const [inUserData, setInUserData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        dob: initDob,
        firstName: '',
        lastName: '',
        avgDaysPerPeriod: '',
        // isValidUser: true,
        isValidPassword: true
    });

    const [date, setDate] = useState(new Date());
    const [showDateTimePicker, setShowDateTimePicker] = useState(false);
    const handleDobPicker = (event, selectedDate) => {
        const currentDate = selectedDate || date
        currentDateString = JSON.stringify(currentDate).slice(1).split('T')[0].split('-').join('/')
        setInUserData({...inUserData, dob: currentDateString})
        setShowDateTimePicker( Platform.OS === 'ios' )
        setDate(currentDate)
    };
    
    handleConfirmPassword = (inConfirmPassword) => {
        // let inConfirmPassword = inConfirmPasswordEvent.nativeEvent.text;
        let isEqual = false;
        if (inConfirmPassword !== inUserData.password) {
            // setSignupDisabled(true)
            isEqual = false;
        } else {
            isEqual = true;
        }
        setInUserData({...inUserData, confirmPassword: inConfirmPassword, isValidPassword: isEqual})
    }

    handleSignUpClicked = () => {
        if (inUserData.email==='') {
            setAuthError("Email cannot be empty")
            return
        }
        if (inUserData.password==='' || inUserData.confirmPassword==='') {
            setAuthError("Password cannot be empty")
            return
        }
        if (inUserData.firstName==='') {
            setAuthError("First Name cannot be empty")
            return
        }
        if (inUserData.lastName==='') {
            setAuthError("Last Name cannot be empty")
            return
        }
        if (inUserData.dob===initDob) {
            setAuthError("Date of Birth cannot be empty")
            return
        }
        if (!inUserData.isValidPassword) {
            return
        }
        
        signup(inUserData.email, inUserData.password, inUserData.firstName, inUserData.lastName, inUserData.dob, inUserData.avgDaysPerPeriod)
    }

    useEffect(()=>{
        setAuthError('');
    }, []);

    return (
        <View>
            <FormInput 
                labelValue="Email"
                placeholderText="Email"
                isRequired={true}
                iconType="user"
                color="black"
                keyboardType="email-address"
                value={inUserData.email}
                onChangeText={(inEmail) => {
                    setInUserData({...inUserData, email: inEmail})
                }}
                onFocus={()=>{ setShowDateTimePicker(false) }} />
            <FormInput 
                labelValue="Password"
                placeholderText="Password"
                isRequired={true}
                iconType="lock"
                color="black"
                // isPassword={true}
                secureTextEntry={true}
                value={inUserData.password}
                onChangeText={(inPassword) => {
                    setInUserData({...inUserData, password: inPassword})
                }}
                onFocus={()=>{ setShowDateTimePicker(false) }} />
            <FormInput 
                labelValue="Confirm Password"
                placeholderText="Confirm Password"
                isRequired={true}
                iconType="lock"
                color="black"
                // isPassword={true}
                secureTextEntry={true}
                value={inUserData.confirmPassword}
                onChangeText={ handleConfirmPassword }
                // onEndEditing={ handleConfirmPassword }
                onFocus={()=>{ setShowDateTimePicker(false) }} />
            {inUserData.isValidPassword ? null :
            <Animatable.View animation="fadeInLeft" duration={500}>
                <Text style={[styles.centerItems, styles.errTextSyle]}>Password does not match</Text>
            </Animatable.View>}

            <FormInput 
                labelValue="First Name"
                placeholderText="First Name"
                isRequired={true}
                iconType="user"
                color="black"
                value={inUserData.firstName}
                onChangeText={(inFirstName) => {
                    setInUserData({...inUserData, firstName: inFirstName})
                }}
                onFocus={()=>{ setShowDateTimePicker(false) }} />
            <FormInput 
                labelValue="Last Name"
                placeholderText="Last Name"
                isRequired={true}
                iconType="user"
                color="black"
                value={inUserData.lastName}
                onChangeText={(inLastName)=>{
                    setInUserData({...inUserData, lastName: inLastName})
                }}
                onFocus={()=>{ setShowDateTimePicker(false) }} />
            <Pressable
                onPress={()=>{ setShowDateTimePicker(true) }} >
                <View style={stylesFormInput.viewStyle}>
                    <Text style={[stylesFormInput.textInputStyle, inUserData.dob==initDob ? styles.dobInitTextStyle : styles.dobTextStyle]} >
                        {inUserData.dob}
                    </Text>
                </View>
            </Pressable>
            { showDateTimePicker ?
                <DateTimePicker
                    value={date}
                    mode="date"
                    display="spinner"
                    timeZoneOffsetInMinutes={-60*24}
                    maximumDate={new Date()}
                    onChange={handleDobPicker} 
                />
            : null }
            
            <FormInput 
                labelValue=""
                placeholderText="On average, how many days is your period?"
                value={ inUserData.avgDaysPerPeriod }
                keyboardType={"number-pad"}
                onChangeText={ (inAvgDaysPerPeriod) => {
                    setInUserData({...inUserData, avgDaysPerPeriod: inAvgDaysPerPeriod})
                }}
                onFocus={()=>{ setShowDateTimePicker(false) }} />
            <FormButton
                btnTitle="Sign Up"
                isHighlight={true}
                // disabled={inUserData.isValidPassword}
                onPress={ handleSignUpClicked }
            />

            {authError ?
            <Animatable.View animation="fadeInLeft" duration={500}>
            <Text style={[styles.centerItems, styles.errTextSyle]}>{authError}</Text>
            </Animatable.View>
            : null}

            <Text style={styles.centerItems}>
                By signing up, you agree to our 
                <Text style={styles.underlineStyle} onPress={()=>Linking.openURL('https://google.com')}> Terms of Service </Text> 
                and 
                <Text style={styles.underlineStyle} onPress={()=>Linking.openURL('https://apple.com')}> Privacy Policy</Text>
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    centerItems: {
        alignItems: 'center',
        margin: 10,
    },
    underlineStyle: {
        textDecorationLine: 'underline'
    },
    modalStyle: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22,
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    dobInitTextStyle: {
        color: 'lightgray'
    },
    dobTextStyle: {
        color: 'black'
    },
    errTextSyle: {
        color: 'red'
    }
})

export default SignupScreen;
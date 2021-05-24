import React, { useContext, useEffect, useState } from 'react';
import { Text, View, StyleSheet, Linking, Modal, Pressable, Platform } from 'react-native';
// import { Calendar } from 'react-native-calendars';
import DateTimePicker from '@react-native-community/datetimepicker';

import { AuthContext } from '../../navigation/AuthProvider';
import FormInput from '../../components/FormInput';
import { styles as stylesFormInput } from '../../components/FormInput';
import FormButton from '../../components/FormButton';
// import SocialButton from '../../components/SocialButton';

const SignupScreen = ({navigation}) => {
    const initDob = "Date of Birth*"

    const {signup, authError, setAuthError}     = useContext(AuthContext);
    const [email, setEmail]                     = useState();
    const [password, setPassword]               = useState();
    const [dob, setDob]                         = useState(initDob);
    const [firstName, setFirstName]             = useState();
    const [lastName, setLastName]               = useState();
    const [confirmPassword, setConfirmPassword] = useState();
    const [statusPassword, setStatusPassword]   = useState("");
    const [signupDisabled, setSignupDisabled]   = useState(false);
    const [avgDaysPerPeriod, setAvgDaysPerPeriod] = useState("");

    const [date, setDate]                       = useState(new Date());
    const [showDateTimePicker, setShowDateTimePicker] = useState(false);
    const handleDobPicker = (event, selectedDate) => {
        const currentDate = selectedDate || date
        currentDateString = JSON.stringify(currentDate).slice(1).split('T')[0].split('-').join('/')
        setDob( currentDateString )
        setShowDateTimePicker( Platform.OS === 'ios' )
        setDate(currentDate)
    };
    
    handleConfirmPassword = (inConfirmPassword) => {
        setConfirmPassword(inConfirmPassword)
        // console.log(password, confirmPassword)
        // if (confirmPassword === password) {
        //     setStatusPassword("Password matched!")
        //     setSignupDisabled(false)
            
        // } else {
        //     setStatusPassword("Password does not match...")
        //     setSignupDisabled(true)
        // }
    }

    handleSignUpClicked = () => {
        if (email==undefined) {
            setAuthError("Email cannot be empty")
            return
        }
        if (password==undefined || confirmPassword==undefined) {
            setAuthError("Password cannot be empty")
            return
        }
        if (firstName==undefined) {
            setAuthError("First Name cannot be empty")
            return
        }
        if (lastName==undefined) {
            setAuthError("Last Name cannot be empty")
            return
        }
        if (dob=="Date of Birth") {
            setAuthError("Date of Birth cannot be empty")
            return
        }
        
        signup(email, password, firstName, lastName, dob, avgDaysPerPeriod)
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
                value={email}
                onChangeText={(inEmail)=>{setEmail(inEmail)}}
                onFocus={()=>{ setShowDateTimePicker(false) }} />
            <FormInput 
                labelValue="Password"
                placeholderText="Password"
                isRequired={true}
                iconType="lock"
                color="black"
                // isPassword={true}
                secureTextEntry={true}
                value={password}
                onChangeText={(inPassword)=>{setPassword(inPassword)}}
                onFocus={()=>{ setShowDateTimePicker(false) }} />
            <FormInput 
                labelValue="Confirm Password"
                placeholderText="Confirm Password"
                isRequired={true}
                iconType="lock"
                color="black"
                // isPassword={true}
                secureTextEntry={true}
                value={confirmPassword}
                onChangeText={ handleConfirmPassword }
                onFocus={()=>{ setShowDateTimePicker(false) }} />
            <FormInput 
                labelValue="First Name"
                placeholderText="First Name"
                isRequired={true}
                iconType="user"
                color="black"
                value={ firstName }
                onChangeText={(inName)=>{setFirstName(inName)}}
                onFocus={()=>{ setShowDateTimePicker(false) }} />
            <FormInput 
                labelValue="Last Name"
                placeholderText="Last Name"
                isRequired={true}
                iconType="user"
                color="black"
                value={ lastName }
                onChangeText={(inName)=>{setLastName(inName)}}
                onFocus={()=>{ setShowDateTimePicker(false) }} />
            <Pressable
                onPress={()=>{ setShowDateTimePicker(true) }} >
                <View style={stylesFormInput.viewStyle}>
                    <Text style={[stylesFormInput.textInputStyle, dob==initDob ? styles.dobInitTextStyle : styles.dobTextStyle]} >
                        {dob}
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
                value={ avgDaysPerPeriod }
                keyboardType={"number-pad"}
                onChangeText={ (inAvgDaysPerPeriod)=>{setAvgDaysPerPeriod(inAvgDaysPerPeriod)} }
                onFocus={()=>{ setShowDateTimePicker(false) }} />
            {/* <Text>{statusPassword}</Text> */}
            
            <FormButton
                btnTitle="Sign Up"
                isHighlight={true}
                disabled={signupDisabled}
                onPress={ handleSignUpClicked }
            />
            <Text style={[styles.centerItems, styles.errTextSyle]}>{authError}</Text>
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
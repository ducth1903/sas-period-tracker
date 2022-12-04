import React, { useContext, useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native';
// import * as Animatable from 'react-native-animatable';
// import { Button, TextInput } from 'react-native-paper';

import { AuthContext } from '../../navigation/AuthProvider';
import FormInput from '../../components/FormInput';
import FormButton from '../../components/FormButton';
// import SocialButton from '../../components/SocialButton';
import i18n from '../../translations/i18n';

const LoginScreen = ({navigation}) => {
    const {login, authError, setAuthError}    = useContext(AuthContext);
    const [hiddenPassword, setHiddenPassword] = useState(true);

    const [inUserData, setInUserData] = useState({
        email: '',
        password: '',
        // isValidUser: true,
        // isValidPassword: true
    });

    useEffect(() => {
        setAuthError('');
    }, []);

    handleEmail = (inEmail) => { 
        setInUserData({
            ...inUserData,
            email: inEmail
        }) 
    }
    handlePassword = (inPassword) => { 
        setInUserData({
            ...inUserData,
            password: inPassword
        })
    }
    login_with_email = (inEmail, inPassword) => {
        login(inEmail, inPassword);
    }
    handleEyeClicked = () => { setHiddenPassword( !hiddenPassword ) }

    return (
        // <View style={styles.container}>
        <View>
            <View>
                <FormInput 
                    labelValue="Email"
                    placeholderText={i18n.t('authentication.email')}
                    iconType="user"
                    color="black"
                    keyboardType="email-address"
                    value={inUserData.email}
                    onChangeText={handleEmail} />
                <FormInput 
                    labelValue="Password"
                    placeholderText={i18n.t('authentication.password')}
                    iconType="lock"
                    color="black"
                    isPassword={true}
                    secureTextEntry={hiddenPassword}
                    value={inUserData.password}
                    onChangeText={handlePassword}
                    onPressEyeBtn={handleEyeClicked} />
                <FormButton 
                    btnTitle={i18n.t('authentication.signIn')}
                    isHighlight={true}
                    onPress={ () => login_with_email(inUserData.email, inUserData.password) } />

                {authError ?
                // <Animatable.View animation="fadeInLeft" duration={500}>
                <View>
                    <Text style={[styles.centerItems, styles.errorMsg]}>{authError}</Text>
                </View>
                : null}

                {/* <SocialButton 
                    btnTitle="Sign In With Google"
                    btnType="google"
                    btnColor="#de4d41" 
                    bgColor="#f5e5ea"
                    onPress={ () => console.log("gmail") } /> */}
                {/* <SocialButton 
                    btnTitle="Sign In With Facebook"
                    btnType="facebook-square"
                    btnColor="#4867aa" 
                    bgColor="#e6eaf4"
                    onPress={ () => console.log("facebook") } /> */}
                <TouchableOpacity 
                    onPress={ ()=>{navigation.navigate("ForgotPasswordScreen")} }
                    style={styles.centerItems} >
                    <Text style={[styles.textStyle, styles.textUnderlineStyle, styles.bottomItems]}>
                        {i18n.t('authentication.forgotPassword')}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    onPress={ ()=>{navigation.navigate("SignupScreen")} }
                    style={styles.centerItems} >      
                    <Text style={[styles.textStyle, styles.textUnderlineStyle]}>
                        {i18n.t('authentication.noAccountSignUp')}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const {height} = Dimensions.get("screen");
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F6F6F6',
        justifyContent: 'flex-start',
        alignItems: 'stretch',
    },
    // footer: {
    //     flex: 1,
    //     backgroundColor: '#F6F6F6',
    //     alignItems: 'center',
    //     // justifyContent: 'flex-start',
    //     borderTopLeftRadius: 30,
    //     borderTopRightRadius: 30,
    //     paddingVertical: 50,
    //     paddingHorizontal: 30,

    //     flexDirection: 'row',
    //     flexWrap: 'wrap',
    //     // alignItems: 'flex-start'
    // },

    centerItems: {
        alignItems: 'center',
        justifyContent: 'center',
        margin: 10,
    },
    textStyle: {
        fontSize: 15,
        color: "#AC3632",
    },
    textUnderlineStyle: {
        textDecorationLine: 'underline'
    },
    bottomItems: {
        // flex: 1,
        justifyContent: "flex-end"
    },
    errorMsg: {
        color: '#FF0000',
        fontSize: 14,
    },
});

export default LoginScreen;
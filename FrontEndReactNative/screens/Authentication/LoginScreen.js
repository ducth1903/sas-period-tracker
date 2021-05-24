import React, { useContext, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, Dimensions } from 'react-native';
import { Button, TextInput } from 'react-native-paper';

import { AuthContext } from '../../navigation/AuthProvider';
import FormInput from '../../components/FormInput';
import FormButton from '../../components/FormButton';
import SocialButton from '../../components/SocialButton';

const LoginScreen = ({navigation}) => {
    const [email, setEmail]         = useState();
    const [password, setPassword]   = useState();
    const [hiddenPassword, setHiddenPassword] = useState(true);
    const {login, authError}                  = useContext(AuthContext);

    handleEmail = (inEmail) => { setEmail(inEmail) }
    handlePassword = (inPassword) => { setPassword(inPassword) }
    login_with_email = (inEmail, inPassword) => {
        login(inEmail, inPassword);
    }
    handleEyeClicked = () => { setHiddenPassword( !hiddenPassword ) }

    return (
        <View style={styles.container}>
            <View>
                <FormInput 
                    labelValue="Email"
                    placeholderText="Email"
                    iconType="user"
                    color="black"
                    keyboardType="email-address"
                    value={email}
                    onChangeText={handleEmail} />
                <FormInput 
                    labelValue="Password"
                    placeholderText="Password"
                    iconType="lock"
                    color="black"
                    isPassword={true}
                    secureTextEntry={hiddenPassword}
                    value={password}
                    onChangeText={handlePassword}
                    onPressEyeBtn={handleEyeClicked} />
                <FormButton 
                    btnTitle="Sign In With Email"
                    isHighlight={true}
                    onPress={ () => login_with_email(email, password) } />
                <Text style={[styles.centerItems, styles.textStyle]}>{authError}</Text>
                <SocialButton 
                    btnTitle="Sign In With Google"
                    btnType="google"
                    btnColor="#de4d41" 
                    bgColor="#f5e5ea"
                    onPress={ () => console.log("gmail") } />
                <SocialButton 
                    btnTitle="Sign In With Facebook"
                    btnType="facebook-square"
                    btnColor="#4867aa" 
                    bgColor="#e6eaf4"
                    onPress={ () => console.log("facebook") } />
                <TouchableOpacity 
                    onPress={ ()=>{console.log("Forgot password pressed...")} }
                    style={styles.centerItems} >
                    <Text style={[styles.textStyle, styles.textUnderlineStyle, styles.bottomItems]}>Forgot Password?</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    onPress={ ()=>{navigation.navigate("SignupScreen")} }
                    style={styles.centerItems} >      
                    <Text style={[styles.textStyle, styles.textUnderlineStyle]}>Don't have an account? Sign up one!</Text>
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
    }
});

export default LoginScreen;
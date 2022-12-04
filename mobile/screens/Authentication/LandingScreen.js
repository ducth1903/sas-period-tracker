import React from 'react';
import { StyleSheet, View, Image, Dimensions, ImageBackground } from 'react-native';
import FormButton from '../../components/FormButton';
import i18n from '../../translations/i18n';

const LoginScreen = ({navigation}) => {
    return (
        <View style={styles.container}>
            <ImageBackground source={require('../../assets/landingPage.jpg')} style={styles.backgroundImageStyle}>
                <View style={styles.header}>
                    <Image source={require('../../assets/sas_logo.png')}
                    style={styles.logo}
                    resizeMode="stretch" />
                </View>
                <View style={styles.footer}>
                    <View style={styles.item}>
                        <FormButton
                            btnTitle={i18n.t('authentication.login')}
                            isHighlight={false}
                            onPress={ ()=>{navigation.navigate("LoginScreen")} }
                        />
                    </View>
                    <View style={styles.item}>
                        <FormButton
                            btnTitle={i18n.t('authentication.signup')}
                            isHighlight={true}
                            onPress={ ()=>{navigation.navigate("SignupScreen")} }
                        />
                    </View>
                </View>
            </ImageBackground>
        </View>
    )
}

const {height} = Dimensions.get("screen");
const styles = StyleSheet.create({
    container: {
      flex: 1,
    //   backgroundColor: '#6d5b57',
      justifyContent: 'center',
    },
    header: {
        flex: 7,
        justifyContent: 'center',
        alignItems: 'center'
    },
    footer: {
        flex: 1,
        backgroundColor: '#FFFBEE',
        alignItems: 'center',
        // justifyContent: 'flex-start',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingVertical: 50,
        paddingHorizontal: 30,

        flexDirection: 'row',
        flexWrap: 'wrap',
        // alignItems: 'flex-start'
    },
    item: {
        width: '50%'        // 50% of container width
    },
    logo: {
        width: height*0.2,
        height: height*0.2
    },
    textStyle: {
      fontSize: 25,
      color: "red"
    },
    backgroundImageStyle: {
        flex: 1,
        resizeMode: "cover",
        justifyContent: "center"
    }
  });

export default LoginScreen;
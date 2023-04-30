import React from 'react';
import { StyleSheet, View, Image, Dimensions } from 'react-native';
import FormButton from '../../components/FormButton';
import i18n from '../../translations/i18n';

const LandingScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Image source={require('../../assets/revised-logo.png')} style={styles.logo} />
            </View>
            <View style={styles.footer}>
                <View className="w-1/2">
                    <FormButton
                        btnTitle={i18n.t('authentication.signup')}
                        isHighlight={true}
                        onPress={() => { navigation.navigate("SignupScreen") }}
                    />
                </View>
                <View className="w-1/2">
                    <FormButton
                        btnTitle={i18n.t('authentication.login')}
                        isHighlight={true}
                        onPress={() => { navigation.navigate("LoginScreen") }}
                    />
                </View>
            </View>
        </View>
    )
}

const { height } = Dimensions.get("screen");
const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: '#6d5b57',
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
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingVertical: 50,
        paddingHorizontal: 30,
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    logo: {
        width: height * 0.2,
        height: height * 0.2,
        resizeMode: "stretch"
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

export default LandingScreen;
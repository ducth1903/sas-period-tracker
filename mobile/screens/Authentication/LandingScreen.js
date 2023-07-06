import React from 'react';
import { StyleSheet, View, Image, Dimensions, Text } from 'react-native';
import FormButton from '../../components/FormButton';
import i18n from '../../translations/i18n';

const LandingScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Image source={require('../../assets/revised-logo.png')} style={styles.logo} />
                <Text className="text-greydark text-[32px] font-bold mt-2">
                    {i18n.t('appName')}
                </Text>
            </View>
            <View style={styles.footer}>
                <View className="w-1/2">
                    <FormButton
                        btnTitle={i18n.t('authentication.signUp')}
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
        justifyContent: 'center',
        backgroundColor: '#FEFFF4'
    },
    header: {
        flex: 7,
        justifyContent: 'center',
        alignItems: 'center'
    },
    footer: {
        flex: 1,
        backgroundColor: '#EDEEE0',
        alignItems: 'center',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingVertical: 30,
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
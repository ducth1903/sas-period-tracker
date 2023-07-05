import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { AuthContext } from '../../navigation/AuthProvider';
import FormInput from '../../components/FormInput';
import FormButton from '../../components/FormButton';
import i18n from '../../translations/i18n';

const ForgotPasswordScreen = ({navigation}) => {
    const {
        authStatus,
        setAuthStatus,
        authError,
        setAuthError,
        resetPassword
    } = useContext(AuthContext);
    const [email, setEmail] = useState();

    useEffect(() => {
        setAuthStatus("");
        setAuthError('');
    }, []);

    const errorToString = (error) => {
        if (error.includes("user-not-found")) {
            return i18n.t('authentication.userNotFound');
        }
        else {
            return i18n.t('authentication.unrecognizedError')
        }
    };

    return (
        <View style={styles.container}>
            <FormInput
                labelValue="Email"
                placeholderText={i18n.t('authentication.emailAddress')}
                iconType="user"
                color="black"
                keyboardType="email-address"
                value={email}
                onChangeText={(inEmail) => {setEmail(inEmail)}} />
            <FormButton
                btnTitle={i18n.t('authentication.resetPassword')}
                isHighlight={true}
                onPress={ () => resetPassword(email) } />
            { authError ?
            <Text style={[styles.centerItems, styles.errTextStyle]}>{errorToString(authError)}</Text> :
            <Text style={[styles.centerItems, styles.statusTextStyle]}>{authStatus}</Text> }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F6F6F6',
        justifyContent: 'flex-start',
        alignItems: 'stretch',
    },
    centerItems: {
        alignItems: 'center',
        margin: 10,
    },
    statusTextStyle: {
        color: 'green'
    },
    errTextStyle: {
        color: 'red'
    }
})

export default ForgotPasswordScreen;

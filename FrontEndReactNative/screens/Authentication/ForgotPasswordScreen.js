import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { AuthContext } from '../../navigation/AuthProvider';
import FormInput from '../../components/FormInput';
import FormButton from '../../components/FormButton';

const ForgotPasswordScreen = ({navigation}) => {
    const {authStatus, setAuthStatus, authError, setAuthError, resetPassword}    = useContext(AuthContext);
    const [email, setEmail] = useState();

    useEffect(() => {
        setAuthStatus("");
        setAuthError('');
    }, []);

    return (
        <View style={styles.container}>
            <FormInput 
                labelValue="Email"
                placeholderText="Email"
                iconType="user"
                color="black"
                keyboardType="email-address"
                value={email}
                onChangeText={(inEmail) => {setEmail(inEmail)}} />
            <FormButton 
                btnTitle="Reset Password"
                isHighlight={true}
                onPress={ () => resetPassword(email) } />
            { authError ? 
            <Text style={[styles.centerItems, styles.errTextSyle]}>{authError}</Text> :
            <Text style={[styles.centerItems, styles.statusTextSyle]}>{authStatus}</Text> }
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
    statusTextSyle: {
        color: 'green'
    },
    errTextSyle: {
        color: 'red'
    }
})

export default ForgotPasswordScreen;
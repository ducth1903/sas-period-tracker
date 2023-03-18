import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { TextInputMask } from 'react-native-masked-text';
import { Feather } from '@expo/vector-icons';

// https://icons.expo.fyi/
const FormInput = ({ labelValue, placeholderText, iconType, color, isRequired=false, isPassword=false, isDate=false, ...restProps }) => {
    return (
        <View>
            {/* <Text style={styles.textStyle}>{labelValue}</Text> */}
            <View style={styles.viewStyle}>
                { isDate ? 
                <TextInputMask
                    type={'datetime'}
                    options={ {format: 'YYYY/MM/DD'} }
                    placeholder={isRequired ? placeholderText+"*" : placeholderText}
                    {...restProps} />
                :
                <TextInput 
                    style={styles.textInputStyle}
                    value={labelValue} 
                    placeholder={isRequired ? placeholderText : placeholderText} 
                    placeholderTextColor="#272727CC"
                    {...restProps} />
                }
                { isPassword ? 
                    <TouchableOpacity onPress={restProps.onPressEyeBtn}>
                        <Feather name={restProps.secureTextEntry ? "eye-off" : "eye"} size={24} color="black" />
                    </TouchableOpacity> 
                : null }
                
            </View>
        </View>
    )
}

export const styles = StyleSheet.create({
    textStyle: {
        marginTop: 10
    },

    viewStyle: {
        flexDirection: 'row',
        height: 70,
        margin: 8,
        paddingTop: 10,
        paddingBottom: 5,
        // flex: 1,
        padding: 35,
        borderWidth: 2,
        borderColor: '#EDEEE0',
        backgroundColor: '#EDEEE0',
        borderRadius: 50,
    },

    textInputStyle: {
        flex: 1,
        color: '#000000',
        fontSize: 16
        // padding: 10,
        // borderWidth: 2,
        // borderColor: '#F59B3F',
        // borderRadius: 9,
    }
})

export default FormInput;
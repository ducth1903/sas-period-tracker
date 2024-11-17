import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Text, StyleSheet, View, Pressable } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

const FormButton = ({ btnTitle, isHighlight, ...restProps }) => {
    const iconName = restProps?.iconName;

    return (
        <View style={styles.container}>
            <Pressable {...restProps}>
                <LinearGradient
                    className="flex-row space-x-3"
                    colors={isHighlight ? ['#005C6A', '#005C6A'] : ['#ededed', '#e3e3e3']}
                    style={[styles.commonBtnStyle, isHighlight ? styles.formBtnStyleHighlight : styles.formBtnStyle]}>
                    {iconName && <AntDesign name={iconName} size={24} color="white" />}
                    <Text style={[styles.commonTxtStyle, isHighlight ? styles.formTxtStyleHighlight : styles.formTxtStyle]}>
                        {btnTitle}
                    </Text>
                </LinearGradient>
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        margin: 10,
    },
    commonTxtStyle: {
        fontFamily: 'System',
        fontSize: 16,
        fontWeight: '400'
    },
    commonBtnStyle: {
        width: '100%',
        height: 70,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },

    // not highlight
    formBtnStyle: {
        // borderWidth: 2,
        // borderColor: '#bababa',
        borderRadius: 25
    },
    formTxtStyle: {
        color: '#919191'
    },

    // highlight
    formBtnStyleHighlight: {
        borderRadius: 25
    },
    formTxtStyleHighlight: {
        color: '#ffffff'
    }
})

export default FormButton;
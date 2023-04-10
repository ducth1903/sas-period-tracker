import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Text, StyleSheet, View, Pressable } from 'react-native';

const FormButton = ({ btnTitle, isHighlight, ...restProps }) => {
    return (
        <View style={styles.container}>
            <Pressable {...restProps}>
                <LinearGradient
                    colors={isHighlight ? ['#005C6A', '#005C6A'] : ['#FFFFFF', '#FFFFFF']}
                    style={[styles.commonBtnStyle, isHighlight ? styles.formBtnStyleHighlight : styles.formBtnStyle]}>

                    <Text style={[styles.commonTxtStyle, isHighlight ? styles.formTxtStyleHighlight : styles.formTxtStyle]}>{btnTitle}</Text>
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
        borderWidth: 2,
        borderColor: '#F59B3F',
        borderRadius: 25
    },
    formTxtStyle: {
        color: '#F59B3F'
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
import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Text, StyleSheet, View, Pressable } from 'react-native';

const FormButton = ({ btnTitle, isHighlight, ...restProps }) => {
    return (
        <View style={styles.container}>
            <Pressable {...restProps}>
                <LinearGradient
                    colors={isHighlight ? ['#F59B3F', '#E64A38'] : ['#FFFFFF', '#FFFFFF']}
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
        fontSize: 18,
        fontWeight: 'bold'
    },
    commonBtnStyle: {
        width: '100%',
        height: 50,
        borderRadius: 9,
        justifyContent: 'center',
        alignItems: 'center',
    },

    formBtnStyle: {
        borderWidth: 2,
        borderColor: '#F59B3F',
        borderRadius: 9
    },
    formTxtStyle: {
        color: '#F59B3F'
    },

    formBtnStyleHighlight: {

    },
    formTxtStyleHighlight: {
        color: '#ffffff'
    }
})

export default FormButton;
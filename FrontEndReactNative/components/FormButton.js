import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Text, StyleSheet, View, Pressable } from 'react-native';
import { Button, useTheme } from 'react-native-paper';

const FormButton = ({ btnTitle, isHighlight, ...restProps }) => {
    const { btnTextHighlight, btnText } = useTheme();

    return (
        <View style={styles.container}>
            <Pressable {...restProps}>
                <LinearGradient
                    colors={isHighlight ? ['#F59B3F', '#E64A38'] : ['#FFFFFF', '#FFFFFF']}
                    style={[styles.commonBtnStyle, isHighlight ? styles.formBtnStyleHighlight : styles.formBtnStyle]}>
                    
                    <Text style={[styles.commonTxtStyle, isHighlight ? styles.formTxtStyleHighlight : styles.formTxtStyle]}>{btnTitle}</Text>
                </LinearGradient>
            </Pressable>
            {/* <Button mode="contained" {...restProps}>
                <Text style={[styles.commonTxtStyle, isHighlight ? btnTextHighlight.text : btnText.text]}>{btnTitle}</Text>
            </Button> */}
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
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },

    formBtnStyle: {
        borderWidth: 2,
        borderColor: '#F59B3F',
        borderRadius: 25
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
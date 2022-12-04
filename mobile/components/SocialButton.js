import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { AntDesign } from '@expo/vector-icons'; 

// https://icons.expo.fyi/
const SocialButton = ({ btnTitle, btnType, btnColor, bgColor, ...restProps }) => {
    return (
        <View>
            <TouchableOpacity style={[styles.buttonContainer, {backgroundColor: bgColor}]} 
            {...restProps}>
                <View style={styles.iconWrapper}>
                    <AntDesign name={btnType} size={32} color={btnColor} />
                </View>
                <View style={styles.buttonTextWrapper}>
                    <Text style={[styles.buttonText, {color: btnColor}]}>{btnTitle}</Text>
                </View>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    buttonContainer: {
        marginTop: 10,
        width: '100%',
        // height: windowHeight / 15,
        padding: 10,
        flexDirection: 'row',
        borderRadius: 3,
    },
    iconWrapper: {
        width: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    icon: {
        fontWeight: 'bold',
    },
    buttonTextWrapper: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        fontSize: 18,
        fontWeight: 'bold',
        fontFamily: 'System',
    },
})

export default SocialButton;
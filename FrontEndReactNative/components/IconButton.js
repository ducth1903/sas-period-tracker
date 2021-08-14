import React, { useState } from 'react';
import { Text, StyleSheet, View, Pressable, Image } from 'react-native';

const IconButton = ({ btnTitle, initPressedState, iconSource, ...restProps }) => {
    const [isPressed, setIsPressed] = useState(initPressedState);

    return (
        <View style={styles.container}>
            <Pressable
            onPress={()=>{ restProps.onPress() ; setIsPressed( !isPressed ) }}
            style={{alignItems: 'center', justifyContent:'center'}}>
                <Image
                source={iconSource}
                style={[styles.imageStyle, isPressed ? [styles.imageStylePressed, {borderColor: restProps.pressedColor}] : null]}
                />
                <Text 
                style={[styles.commonTxtStyle, isPressed ? [styles.formTxtStyleHighlight, {color: restProps.pressedColor}] : styles.formTxtStyle]}>
                {btnTitle}
                </Text>
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
    },
    formTxtStyle: {
        color: 'black'
    },
    formTxtStyleHighlight: {
        fontWeight: 'bold'
    },
    imageStyle: {
        margin: 10, 
        height: 60, 
        width: 60, 
        // resizeMode: 'contain',
        borderRadius: 20, 
        borderWidth: 0,
        backgroundColor: '#a9d8ff'
    },
    imageStylePressed: {
        borderWidth: 3,
    }
})

export default IconButton;
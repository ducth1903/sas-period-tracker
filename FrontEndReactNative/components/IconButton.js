import React, { useState } from 'react';
import { Text, StyleSheet, View, Pressable, Image } from 'react-native';

const IconButton = ({ btnTitle, initPressedState, ...restProps }) => {
    const [isPressed, setIsPressed] = useState(initPressedState);

    return (
        <View style={styles.container}>
            <Pressable
            onPress={()=>{ restProps.onPress() ; setIsPressed( !isPressed ) }}
            style={{alignItems: 'center', justifyContent:'center'}}>
                <Image
                // source={{ uri: "../assets/profile_images/default_img.png" }}
                source={ require("../assets/profile_images/default_img.png") }
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
        borderRadius: 20, 
        borderWidth: 0
    },
    imageStylePressed: {
        borderWidth: 2,
    }
})

export default IconButton;
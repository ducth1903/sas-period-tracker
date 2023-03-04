import React from "react";
import {
    TouchableHighlight, Text, View
} from 'react-native';

const DateCircle = ({ inText, outerRotate, innerRotate }) => {
    return (
        <TouchableHighlight
            className={`w-1/2 aspect-square absolute`}
            style={outerRotate} >
            <View className="flex-none w-6 aspect-square bg-cyan-800/50 rounded-full items-center justify-center"
                style={innerRotate}>
                <Text className="text-black">{inText}</Text>
            </View>
        </TouchableHighlight>
    )
}

export default DateCircle;
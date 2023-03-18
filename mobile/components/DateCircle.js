import React from "react";
import {
    TouchableHighlight, Text, View
} from 'react-native';

const DateCircle = ({ inText, outerRotate, innerRotate }) => {
    return (
        <TouchableHighlight
            className={`w-1/2 aspect-square absolute`}
            style={outerRotate} >
            <View className="-m-1.5 bg-teal/20 flex-none w-5 aspect-square rounded-full items-center justify-center"
                style={innerRotate}>
                <Text className="text-black text-xs">{inText}</Text>
            </View>
        </TouchableHighlight>
    )
}

export default DateCircle;
import React from "react";
import {
    TouchableHighlight, Text, View
} from 'react-native';

const DateCircle = ({ inText, outerRotate, innerRotate, currentDay }) => {
    return (
        <View
            className={`w-1/2 aspect-square absolute`}
            style={outerRotate} 
        >
            {inText===currentDay?<View className="absolute -m-3.5 w-2 h-2 bg-salmon rounded-full"></View>:<></>}
            <View className={`-m-1.5 ${currentDay===inText?"bg-salmon":"bg-teal/20"} flex-none w-5 aspect-square rounded-full items-center justify-center`}
                style={innerRotate}>
                <Text className={`${inText===currentDay?"text-slate":"text-teal"} text-xs font-medium`}>{inText}</Text>
            </View>
        </View>
    )
}

export default DateCircle;
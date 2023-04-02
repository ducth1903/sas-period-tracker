import React from "react";
import {
    TouchableHighlight, Text, View
} from 'react-native';

const DateCircle = ({ inText, outerRotate, innerRotate, currentDay, periodDays }) => {
    return (
        <View
            className={`w-1/2 aspect-square absolute`}
            style={outerRotate}
        >
            {inText===currentDay?<View className="absolute -m-6 w-2 h-2 bg-salmon rounded-full"></View>:<></>}
            <View className={`-m-4 ${currentDay===inText?"bg-salmon":periodDays.includes(inText)?"bg-salmon/50":"bg-teal/20"} flex-none w-6 aspect-square rounded-full items-center justify-center`}
                style={innerRotate}>
                <Text className={`${inText===currentDay?"text-slate-50":"text-teal"} text-s font-medium`}>{inText}</Text>
            </View>
        </View>
    )
}

export default DateCircle;
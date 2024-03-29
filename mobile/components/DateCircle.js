import React from "react";
import { Text, View, TouchableHighlight } from 'react-native';

const DateCircle = ({ inText, outerRotate, innerRotate, selectedDate, periodDays, dayStatus }) => {
    const currentDay = new Date().getDate()
    return (
        <View
            className={`w-1/2 aspect-square absolute`}
            style={outerRotate}
        >
            {inText === selectedDate.getDate() ? <View className="absolute -m-6 w-2 h-2 bg-salmon rounded-full"></View> : <></>}
            <TouchableHighlight
                onPress={()=>dayStatus(Number(inText))}
                underlayColor="#FF7F73"
            >
                <View className={`-m-4 ${currentDay === inText ? "bg-salmon" : periodDays.includes(inText) ? "bg-salmon/50" : "bg-teal/20"} flex-none w-6 aspect-square rounded-full items-center justify-center`}
                    style={innerRotate}>
                    <Text  className={`${inText === currentDay ? "text-slate-50" : "text-teal"} text-s font-medium`}>{inText}</Text>
                </View>
            </TouchableHighlight>
        </View>
    )
}

export default DateCircle;
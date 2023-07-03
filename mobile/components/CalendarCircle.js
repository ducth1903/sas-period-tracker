import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';

const colorsToHex = {
    'greydark': '#272727',
    'seafoam': '#5B9F8F',
    'salmon': '#ff7f73'
}

const CalendarCircle = ({ date, day=0, fillColor="offwhite", flowLevel="none", borderFillColor="greydark", borderInnerRing=true, onCirclePress=((date) => {}) }) => {
    let fillPercent = 0;
    switch (flowLevel) {
        case "light":
            fillPercent = 25;
            break;
        case "medium":
            fillPercent = 50;
            break;
        case "heavy":
            fillPercent = 100;
            break;
        default:
            break;
    }

    return (
        <Pressable
            style={{ borderColor: colorsToHex[borderFillColor] }}
            className={`w-[calc(100%/7.3)] aspect-square rounded-full border-2 mr-0.5`}
            onPress={() => {
                onCirclePress(date);
            }}
        >
            <View className={`flex-grow rounded-full ${borderInnerRing ? "border-2 border-offwhite": ""} overflow-hidden justify-center items-center`}>
                {/* <View style={{ backgroundColor: colorsToHex[fillColor], height: statefulFillPercent === 100 ? "100%" : statefulFillPercent === 50 ? "50%" : statefulFillPercent === 25 ? "25%" : "0%" }} className={`w-full bottom-0 absolute items-center justify-center`}/> */}
                <View style={{ backgroundColor: colorsToHex[fillColor], height: `${fillPercent}%` }} className={`w-full bottom-0 absolute items-center justify-center`}/>
                <Text className={`text-greydark text-[11px] font-bold`}>
                    {day}
                </Text>
            </View>
        </Pressable>
    );
}

export default CalendarCircle;

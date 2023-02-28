import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';

const CalendarCircle = ({ day=0, fillColor="offwhite", flowLevel="none", borderFillColor="greydark", borderInnerRing=true }) => {

    // TODO: Make hex colors work with fillColor and borderFillColor

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

    const [statefulFillPercent, setStatefulFillPercent] = useState(fillPercent);

    return (
        <Pressable
            // TODO: 7.3 is a hacky fix. It just happens that dividing by 7.3 gets the circles to fit nicely without overflowing the View. Need to figure out a better way to do this.
            className={`w-[calc(100%/7.3)] aspect-square rounded-full border-2 border-${borderFillColor} mr-0.5`}
            onPress={() => {
                console.log('Pressed Calendar Circle');
                // fillPercent + 25 > 100 ? fillPercent = 0 : fillPercent += 25;
                // setStatefulFillPercent(statefulFillPercent + 25 > 100 ? 0 : statefulFillPercent + 25)
                switch (statefulFillPercent) {
                    case 0:
                        setStatefulFillPercent(25);
                        break;
                    case 25:
                        setStatefulFillPercent(50);
                        break;
                    case 50:
                        setStatefulFillPercent(100);
                        break;
                    case 100:
                        setStatefulFillPercent(0);
                        break;
                    default:
                        break;
                }
                
                console.log(`statefulFillPercent after press: ${statefulFillPercent}`);
            }}
        >
            <View className={`flex-grow rounded-full ${borderInnerRing ? "border-2 border-offwhite": ""} overflow-hidden justify-center items-center`}>
                <View className={`bg-${fillColor} w-full h-${statefulFillPercent === 100 ? "full" : statefulFillPercent === 50 ? "1/2" : statefulFillPercent === 25 ? "1/4" : "0"} bottom-0 absolute items-center justify-center`}/>
                <Text className={`text-greydark text-[11px] font-bold`}>
                    {day}
                </Text>
            </View>
        </Pressable>
    );
}

export default CalendarCircle;

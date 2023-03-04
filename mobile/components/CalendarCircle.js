import React from 'react';
import { TouchableHighlight, Text } from 'react-native';

const CalendarCircle = ({ borderFillColor, fillPercent, inCurrMonth, day=0 }) => {
    // TODO: Dynamic height for calendar circles 
    // TODO: semi-circle fill for individual bubbles

    const mainFillColor = inCurrMonth ? "lavender" : "lavenderlight";
    const textAlpha = inCurrMonth ? "100" : "70";

    return (
        <TouchableHighlight
            className={`bg-${mainFillColor} w-[calc(100%/7)] h-11 rounded-full${borderFillColor ? ` border-2 border-${borderFillColor} ` : " "}justify-center items-center mr-0.5`}
            onPress={() => {
                console.log('Placeholder Calendar Dot Pressed!')
            }}
            underlayColor="#DDD6F6"
            >
                <Text className={`text-greydark text-[11px] font-bold opacity-${textAlpha}`}>
                    {day}
                </Text>
        </TouchableHighlight>
    );
}

export default CalendarCircle;

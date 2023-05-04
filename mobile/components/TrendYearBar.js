import React from 'react';
import {
    View,
    Text
} from 'react-native';

const TrendYearBar = ({ period }) => {
    const dateDiff = (earlierDate, laterDate) => {
        return Math.floor((laterDate - earlierDate) / (1000 * 60 * 60 * 24)) + 1  // add 1 to include first day
    }

    const getDateFromString = (dateString) => {
        const dateParts = dateString.split('-').map(part => Number(part));

        // year is the only mandatory part of the date string
        return new Date(dateParts[0], dateParts[1] ? dateParts[1] - 1 : dateParts[1], dateParts[2] ? dateParts[2] : 1);
    }
    
    const getPeriodLength = (period) => {
        const periodDays = period.details;
        // can assume sorted
        const firstDate = getDateFromString(periodDays[periodDays.length - 1].dateStr);
        const lastDate = getDateFromString(periodDays[0].dateStr);
        const periodLength = dateDiff(firstDate, lastDate);
        return periodLength;
    }

    const periodLength = getPeriodLength(period)

    return (
        <View className="flex flex-row flex-grow rounded-[7px] bg-[#EDEEE0] mt-1">
            {/* Salmon-colored bar containing info on period length */}
            <View className="bg-salmon rounded-md px-2">
                <Text numberOfLines={1} style={{color: '#272727', fontSize: 14, marginRight: 10 * periodLength}}>
                    {`${periodLength} Day Period`}
                </Text>
            </View>

            {/* static spacing View to separate Period and Ovulation bars */}
            <View className="h-full w-12"/>

            {/* seafoam-colored Ovulation bar */}
            <View className="bg-seafoam rounded-md px-2">
                <Text className="text-greydark text-[14px]">
                    Ovulation
                </Text>
            </View>
        </View>
    )
}

export default TrendYearBar;

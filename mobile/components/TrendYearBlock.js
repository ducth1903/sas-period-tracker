import React, { useState } from 'react';
import { View, Text } from 'react-native';
import TrendYearBar from './TrendYearBar';

/**
 * 
 * @param {number} year
 * @param {Object} yearData periods grouped by earliest start date in descending order
 * @param {Object[]} yearData.details array of individual days containing information (symptoms, mood, etc.) for that day
 * @param {string} yearData.year_month YYYY-MM date string for period (MM represents month the period started in)
 * @param {Object} yearData.details Object containing information for a single day (date, symptoms, mood, etc.)
 * @param {string} yearData.details.dateStr YYYY-MM-DD date string for that day
 * @param {string[]} yearData.details.symptoms array of symptoms for that day
 * @param {string[]} yearData.details.moods array of moods for that day
 * @param {string[]} yearData.details.flow array of flow for that day (should be length 1, making array for flexibility + consistency with other fields)
 * @param {string[]} yearData.details.discharge array of discharge for that day (should be length 1, making array for flexibility + consistency with other fields)
 * @returns {JSX.Element} component used to group and display period data for a single year in descending date order in the trends screen
 * 
 * The following sorting properties can be assumed of yearData:
 * 1. yearData is sorted by earliest year in descending order
 * 2. the periods in each year of yearData are sorted by earliest start date in descending order
 * 3. the days in each period are sorted by earliest date in descending order
 */
const TrendYearBlock = ({ year, firstPeriodOfNextYear=null, yearData }) => {
    const dateDiff = (earlierDate, laterDate) => {
        // returns number of days between two dates
        return Math.floor((laterDate - earlierDate) / (1000 * 60 * 60 * 24))  // add 1 to include first day
    }

    const getFirstDateOfPeriod = (period) => {
        let periodDays = period.details;
        return periodDays.reduce((earliestDate, day) => {
            const currentDate = getDateFromString(day.dateStr);
            return currentDate < earliestDate ? currentDate : earliestDate;
        }, getDateFromString(periodDays[0].dateStr));
    }

    const getDateFromString = (dateString) => {
        const dateParts = dateString.split('-').map(part => Number(part));

        // year is the only mandatory part of the date string
        return new Date(dateParts[0], dateParts[1] ? dateParts[1] - 1 : dateParts[1], dateParts[2] ? dateParts[2] : 1);
    }
    
    const getDateRangeString = (firstDate, secondDate=null) => {
        const first = {
            day: firstDate.getDate(),
            monthNum: firstDate.getMonth(),
            monthString: firstDate.toLocaleString('default', {month: 'short'}),
            year: firstDate.getFullYear()
        }
        
        if (!secondDate) {
            return `${first.monthString} ${first.day}`
        }
        
        const last = {
            day: secondDate.getDate(),
            monthNum: secondDate.getMonth(),
            monthString: secondDate.toLocaleString('default', {month: 'short'}),
            year: secondDate.getFullYear()
        }

        return `${first.monthString} ${first.day} - ${first.monthNum !== last.monthNum ? last.monthString + ' ' : ''}${last.day}`;
    }

    const getCycleLengthString = (period, index) => {
        let nextPeriod = undefined;
        if (index > 0) {
            nextPeriod = yearData[index - 1];
        }
        else if (firstPeriodOfNextYear) {
            nextPeriod = firstPeriodOfNextYear;
        }
        
        const periodMonth = period.year_month.split('-')[1];
        const nextPeriodMonth = nextPeriod ? nextPeriod.year_month.split('-')[1] : null;
        if (!nextPeriod || nextPeriodMonth - periodMonth % 12 > 1) { // index === 0 && !firstPeriodOfNextYear
            return "Next period not logged"
        }

        const firstDateOfCurrentPeriod = getFirstDateOfPeriod(period);
        const firstDateOfNextPeriod = getFirstDateOfPeriod(nextPeriod);

        return `${dateDiff(firstDateOfCurrentPeriod, firstDateOfNextPeriod)} Days`;
    }

    const getCycleDateRangeString = (period, index) => {
        const firstDateOfCurrentPeriod = getFirstDateOfPeriod(period);
        let dateRangeString = getDateRangeString(firstDateOfCurrentPeriod);
        if (index === 0) {
            return `Cycle started on ${dateRangeString}`;
        }
        
        const firstDateOfNextPeriod = getFirstDateOfPeriod(yearData[index - 1]);
        dateRangeString = getDateRangeString(firstDateOfCurrentPeriod, firstDateOfNextPeriod);
        
        return dateRangeString;
    }

    return (
        <>
            <Text className="text-greydark text-[22px] font-bold pt-8">
                {year}
            </Text>
            {
                yearData.map((period, index) => {
                    return (
                        <View className="pt-4" key={`monthblock-${index}`}>
                            <Text className="text-greydark text-[16px]">
                                {`Cycle length: ${getCycleLengthString(period, index)}`}
                            </Text>
                            <Text className="text-greydark text-[14px]">
                                {getCycleDateRangeString(period, index)}
                            </Text>
                            <View className="flex-row">
                                <TrendYearBar period={period} />
                            </View>
                        </View>
                    );
                })
            }
        </>
    );
}

export default TrendYearBlock;

import { useContext, memo } from "react"
import {
    View,
    Text
} from 'react-native';

import { SettingsContext } from "../navigation/SettingsProvider";
import CalendarCircle from '../components/CalendarCircle';

const CalendarMonth = ({ yearMonthDate, monthData, onCirclePress=((date) => {}) }) => {
    const { selectedSettingsLanguage } = useContext(SettingsContext);
    
    const calendarRowKey = "calendarRow";
    const calendarCircleKey = "calendarCircle";
    let dayNum = 1;
    
    const daysInMonth = () => {
        // returns the number of days in the month of the current date
        return new Date(yearMonthDate.getFullYear(), yearMonthDate.getMonth() + 1, 0).getDate();
    }

    // NOTE: This is good enough for now, but calendar rendering for a scrollable, infinite calendar will require a rebuild of this
    let daysLeftToRender = daysInMonth();
    const weekCount = Math.ceil(daysLeftToRender / 7);

    return (
        <View className="flex-col mt-4">
            <View>
                <Text className="text-[20px] font-bold mb-3">
                    {`${yearMonthDate.toLocaleString(selectedSettingsLanguage, { month: 'long' })} ${yearMonthDate.getFullYear()}`}
                </Text>
                {
                    [...Array(weekCount).keys()].map((rowN) => {
                        return (
                            <View className="flex-row my-1" key={calendarRowKey+rowN}>
                                {
                                    [...Array(daysLeftToRender >= 7 ? 7 : daysLeftToRender).keys()].map((circleN) => {
                                        let borderFillColor = "greydark";
                                        let flowLevel = "none";
                                        if (monthData && monthData[dayNum]) {
                                            if (monthData[dayNum]["flow"]) {
                                                borderFillColor = "salmon";
                                                flowLevel = monthData[dayNum]["flow"];
                                            }
                                        }

                                        let calendarCircle = (
                                            <CalendarCircle
                                                key={calendarCircleKey+(rowN * 7 + circleN)}
                                                date={new Date(yearMonthDate.getFullYear(), yearMonthDate.getMonth(), dayNum)}
                                                day={dayNum}
                                                borderFillColor={borderFillColor}
                                                fillColor="salmon"
                                                flowLevel={flowLevel}
                                                onCirclePress={onCirclePress}
                                            />
                                        )

                                        dayNum += 1;
                                        daysLeftToRender -= 1;
                                        return calendarCircle;
                                    })
                                }
                            </View>
                        )}
                    )
                }
            </View>
        </View>
    )
}

export default memo(CalendarMonth);
import React, {useCallback, useContext, useEffect, useRef, useState} from 'react';
import {
    Dimensions,
    SafeAreaView,
    ScrollView,
    Text,
    TouchableHighlight,
    View,
} from 'react-native'

import { AuthContext } from '../navigation/AuthProvider'; 
import PeriodDate, { MODAL_TEMPLATE, formatDate } from '../models/PeriodDate';
import CalendarCircle from '../components/CalendarCircle';

// Loading env variables
import getEnvVars from '../environment';
import { color } from 'react-native-reanimated';
import FormInput from '../components/FormInput';

const { API_URL } = getEnvVars();
const { width } = Dimensions.get('screen');
const MODAL_MARGIN = 20;
const MODAL_PADDING = 35;
const markedDateStyle = {
    container: {
        backgroundColor: '#F56A37',
        borderColor: '#183A1D',
        borderWidth: 2,
        elevation: 2
    },
    text: {
        color: '#183A1D',
        fontWeight: 'bold'
    }
}

const PeriodCalendarScreen = ({ props }) => {
    const modal_default_template                = new MODAL_TEMPLATE();

    const { userId }                            = useContext(AuthContext);
    const [symptomSetting, setSymptomSetting]   = useState(new Set());
    const [symptomSettingArray, setSymptomSettingArray]       = useState([]);       // for Switch values (true/false)

    const [modalVisible, setModalVisible]       = useState(false);
    const [modalVisibleScrollCal, setmodalVisibleScrollCal]   = useState(false);
    const [modalInfoVisible, setModalInfoVisible]             = useState(false);
    const [modalInfo, setModalInfo]             = useState("");
    const [modalHistory, setModalHistory]       = useState(false);
    const [modalEmailHistory, setModalEmailHistory]           = useState(false);
    const [modalSetting, setModalSetting]       = useState(false);
    const [snackBarVisible, setSnackBarVisible] = useState(false);
    const [snackBarText, setSnackBarText]       = useState("");
    const [statusBarHidden, setStatusBarHidden] = useState(false);
    const [refreshing, setRefreshing]           = useState(false);

    // either "month" (default), "week", or "day"
    const [dayWeekMonthSelector, setDayWeekMonthSelector] = useState("month");
    // dwm = Day Week Month
    const [dwmDividersVisible, setDwmDividersVisible] = useState([true, false]);
    const dwmNonActive = "flex w-14 h-14 rounded-full justify-center items-center bg-turquoise";
    const dwmActive = "flex w-14 h-14 rounded-full justify-center items-center bg-teal"

    // For Calendar
    const [fetchedData, setFetchedData] = useState({});
    const [markedDates, setMarkedDates] = useState({
        // i.e.
        // '2021-05-22': {startingDay: true, color: 'green'},
        // '2021-05-23': {selected: true, endingDay: true, color: 'green', textColor: 'gray'},
        // '2021-05-04': {selected: false, marked: true, selectedColor: 'blue'},
        // '2021-05-31': {marked: true, dotColor: 'red', activeOpacity: 0}
    });
    const [lastPeriod, setLastPeriod]         = useState(0);
    const [currDateObject, setCurrDateObject] = useState(new Date());
    const [lastMarkedDate, setLastMarkDate]   = useState(null);
    const [fetchedHistory, setFetchedHistory] = useState([]);
    const [calendarViewHeight, setCalendarViewHeight] = useState(0);
    const [calendarViewWidth, setCalendarViewWidth] = useState(0);
    const calendarViewRef = useRef(null);

    // For Collapsible History
    const [activeSections, setActiveSections] = useState([]);

    async function fetchUserData() {
        await fetch(`${API_URL}/users/${userId}`, { method: "GET" })
        .then(resp => resp.json())
        .then(data => {
            setSymptomSetting(new Set(data['symptomsTrack']));      // convert from Array to Set
        })
        .catch(error => {console.log(error)})
    }

    async function fetchPeriodData() {
        // let todayDateEpoch = getDateEpoch(new Date());
        // let numMonthsToFetch = 2;
        // let startMonthToFetch = todayDateEpoch - numMonthsToFetch*30*24*3600;
        // let endMonthToFetch   = todayDateEpoch + numMonthsToFetch*30*24*3600;
        let currDateFormat = formatDate(currDateObject);
        
        await fetch(`${API_URL}/periods/${userId}/${currDateFormat}`, { method: "GET" })
        .then(resp => resp.json())
        .then(data => {
            let tmpData = {};
            let styleData = {};

            data.map((obj) => {
                let currDate = obj['dateStr'].split('T')[0];
                tmpData[currDate] = new PeriodDate(currDate, obj['symptoms'])
                styleData[currDate] = {customStyles: markedDateStyle}
            })

            setFetchedData(tmpData);
            setMarkedDates(styleData);
        })
        .catch(error => {console.log(error)})
    }

    async function fetchLastPeriod() {
        await fetch(`${API_URL}/periods/${userId}/last-period`, { method: "GET" })
        .then(resp => resp.json())
        .then(data => {
            if (data.length) {
                let lastPeriodDate = new Date(data[0]['dateStr']);
                let todayDate = new Date(new Date().toDateString());
                let diff_ms = todayDate-lastPeriodDate;
                setLastPeriod( Math.floor(diff_ms/(24*3600*1000)) );
            }
        })
        .catch(error => {console.log(error)})
    }

    async function fetchPeriodHistory() {
        await fetch(`${API_URL}/periods/${userId}`, { method: "GET" })
        .then(resp => resp.json())
        .then(data => {
            setFetchedHistory(data);
        })
        .catch(error => {console.log(error)})
    }

    async function updateUserSymptomTracking(inSymp) {
        await fetch(`${API_URL}/users/${userId}`, {
            method: "PUT",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                "symptomsTrack"    : Array.from(inSymp)
            })
        })
        .catch(error => {console.log(error)})
    }

    const getKeyFromPeriodHistory = () => {
        return fetchedHistory.map((ele) => ele['year_month'])
    }

    useEffect(() => {
        console.log('[PeriodCalendarScreen] useEffect()')
        fetchPeriodData();
        fetchLastPeriod();
        fetchUserData();
    }, [currDateObject]);

    // Pull down to refresh
    // Pull down to refresh
    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        fetchPeriodData();
        fetchLastPeriod();
        fetchUserData();
        setCurrDateObject(new Date());
        setRefreshing(false);
    }, []);

    // Helpers
    const daysInThisMonth = () => {
        return (currDateObject.getFullYear(), currDateObject.getMonth() + 1, 0).getDate();
    }

    const getFirstDay = () => {
        let tenDaysBefore = new Date(currDateObject.getTime());
        tenDaysBefore.setDate(tenDaysBefore.getDate() - 10);
        console.log("ten days before date string: ", tenDaysBefore.toDateString());
        return tenDaysBefore.getDate();
    }

    const getDateFromDiff = (diff) => {
        let dayAtDiff = new Date(currDateObject.getTime());
        dayAtDiff.setDate(dayAtDiff.getDate() + diff);
        return dayAtDiff;
    }

    // Dynamic rendering
    const renderStandardLetter = (letter) => {
        return (
            <Text className="text-[11px] font-normal text-offwhite">
                {letter}
            </Text>
        );
    }

    // const getCalendarViewSize = () => {
    //     // console.log(Object.keys(calendarViewRef.current).filter(key => key.includes('e')))
    //     // console.log(calendarViewRef.current)
    //     setCalendarViewHeight(calendarViewRef.current.clientHeight);        
    //     setCalendarViewWidth(calendarViewRef.current.clientWidth);
    // }

    // useEffect(() => {
    //     getCalendarViewSize();
    // }, [calendarViewRef])
    
    const renderCalendar = () => {
        let dayDiff = -16;
        let calendarRowKey = "calendarRow";
        let calendarCircleKey = "calendarCircle";

        return (
            <View className="mt-4" ref={calendarViewRef}>
                {
                    [...Array(9).keys()].map((rowN) => (
                        <View className="flex-row my-1" key={calendarRowKey+rowN}>
                            {
                                [...Array(7).keys()].map((circleN) => {
                                    const dateFromDiff = getDateFromDiff(dayDiff);
                                    
                                    let calendarCircle = <CalendarCircle
                                        key={calendarCircleKey+(rowN * 7 + circleN)}
                                        day={dateFromDiff.getDate()}
                                        inCurrMonth={dateFromDiff.getMonth() === currDateObject.getMonth()}
                                        borderFillColor = {dateFromDiff.getMonth() === currDateObject.getMonth() ? "salmon" : null}
                                    />

                                    dayDiff += 1;
                                    return calendarCircle;
                                })
                            }
                        </View>
                    ))
                }
            </View>
        )
    }
        
    return (
        <SafeAreaView className="flex-1 bg-offwhite">
            <ScrollView className="flex p-[35px]" nestedScrollEnabled={true}>
                    {/* Header */}
                    <View className="flex-row items-center">
                        {/* invisible View to be able to center text  in flex row*/}
                        <View className="mr-auto w-10"></View>
                        
                        {/* TODO: Satoshi Font */}
                        <Text className="text-[32px] font-bold text-center">
                            Summary
                        </Text>
                        <View className="ml-auto">
                            {/* TODO: Try to make circle size more accurate */}
                            <TouchableHighlight
                                className="flex w-14 h-14 rounded-full justify-center items-center bg-turquoise"
                                onPress={() => console.log('Pressed Profile!')}
                                underlayColor="#5B9F8F"
                            >
                                {/* TODO: Dynamically get first initial */}
                                <Text className="text-[18px] font-bold text-offwhite">
                                    A
                                </Text> 
                            </TouchableHighlight>
                        </View>
                    </View>

                    {/* Day/Week/Month Selector */}
                    <View className="flex-row justify-center items-center rounded-[7px] bg-teal mt-4">
                        <TouchableHighlight
                            className={`flex-1 rounded-[7px] items-center pt-1 pb-1 ${dayWeekMonthSelector == "day" ? "bg-seafoam" : "bg-teal"}`}
                            onPressIn={() => {
                                console.log('Selected Day!');
                                if (!(dayWeekMonthSelector == "day")) {
                                    setDayWeekMonthSelector("day");
                                    setDwmDividersVisible([false, true]);
                                }
                            }}
                            underlayColor="#5B9F8F"
                        >
                            {renderStandardLetter("D")}
                        </TouchableHighlight>

                        <View className={`${dwmDividersVisible[0] ? "border-offwhite" : "border-teal"} border-[0.3px] h-2/3`}></View>

                        <TouchableHighlight
                            className={`flex-1 rounded-[7px] items-center pt-1 pb-1 ${dayWeekMonthSelector == "week" ? "bg-seafoam" : "bg-teal"}`}
                            onPressIn={() => {
                                console.log('Selected Week!');
                                if (!(dayWeekMonthSelector == "week")) {
                                    setDayWeekMonthSelector("week");
                                    setDwmDividersVisible([false, false]);
                                }
                            }}
                            underlayColor="#5B9F8F"
                        >
                            {renderStandardLetter("W")}
                        </TouchableHighlight>
                        
                        <View className={`${dwmDividersVisible[1] ? "border-offwhite" : "border-teal"} border-[0.3px] h-2/3`}></View>

                        <TouchableHighlight
                            className={`flex-1 rounded-[7px] items-center pt-1 pb-1 ${dayWeekMonthSelector == "month" ? "bg-seafoam" : "bg-teal"}`}
                            onPressIn={() => {
                                console.log('Selected Month!');
                                if (!(dayWeekMonthSelector == "month")) {
                                    setDayWeekMonthSelector("month");
                                    setDwmDividersVisible([true, false]);
                                }
                            }}
                            underlayColor="#5B9F8F"
                        >
                            {renderStandardLetter("M")}    
                        </TouchableHighlight>
                    </View>

                    {/* Month & Year + Export Button View */}
                    <View className="flex-row mt-4 px-1">
                        <Text className="font-bold justify-start self-end text-[22px]">
                            {currDateObject.toLocaleString('default', {month: 'long'})} {currDateObject.toLocaleString('default', {year: 'numeric'})}
                        </Text>
                        <View className="flex-1"></View>
                        <TouchableHighlight
                            className="flex rounded-[9px] self-start items-center justify-center bg-teal px-3 py-1"
                            onPressIn={() => console.log('Pressed Export!')}
                            underlayColor="#5B9F8F"
                        >
                            <Text className="text-offwhite text-xs">
                                Export
                            </Text>
                        </TouchableHighlight>
                    </View>

                    {/* Days (S, M, T ... S) Header */}
                    <View className="flex-row justify-center items-center rounded-[7px] bg-teal mt-5 py-1">
                        {
                            ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"].map((day) => {
                                return (
                                    <View className="flex-grow items-center" key={day}>
                                        {renderStandardLetter(day[0])}
                                    </View>
                                )
                            })
                        }
                    </View>

                    {/* Calendar */}
                    {renderCalendar()}
            </ScrollView>
        </SafeAreaView>
    );
}

export default PeriodCalendarScreen;
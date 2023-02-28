import React, {useContext, useEffect, useRef, useState} from 'react';
import {
    Dimensions,
    Modal,
    SafeAreaView,
    ScrollView,
    Text,
    TouchableHighlight,
    View,
} from 'react-native'

import { AuthContext } from '../navigation/AuthProvider'; 
import PeriodDate, { MODAL_TEMPLATE, formatDate } from '../models/PeriodDate';
import CalendarCircle from '../components/CalendarCircle';

import TimelineIcon from '../assets/icons/timeline.svg';

// Loading env variables
import getEnvVars from '../environment';

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

    const [trendsModalVisible, setTrendsModalVisible]               = useState(false);
    const [modalInfo, setModalInfo]             = useState("");
    const [modalHistory, setModalHistory]       = useState(false);
    const [modalEmailHistory, setModalEmailHistory]           = useState(false);
    const [modalSetting, setModalSetting]       = useState(false);
    const [snackBarVisible, setSnackBarVisible] = useState(false);
    const [snackBarText, setSnackBarText]       = useState("");
    const [statusBarHidden, setStatusBarHidden] = useState(false);
    const [refreshing, setRefreshing]           = useState(false);

    // either "month" (default), "week", or "day"
    const [monthWeekDaySelector, setMonthWeekDaySelector] = useState("month");
    // dwm = Day Week Month
    const [mwdDividersVisible, setMwdDividersVisible] = useState([false, true]);

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
    const daysInMonth = (yearDiff=0, monthDiff=0) => {
        // returns the number of days in the month of the current date with no yearDiff or monthDiff
        // returns the number of days in the month of the current date + yearDiff or monthDiff otherwise
        return new Date(currDateObject.getFullYear() + yearDiff, currDateObject.getMonth() + monthDiff + 1, 0).getDate();
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

    // const getCalendarViewSize = () => {
    //     // console.log(Object.keys(calendarViewRef.current).filter(key => key.includes('e')))
    //     // console.log(calendarViewRef.current)
    //     setCalendarViewHeight(calendarViewRef.current.clientHeight);        
    //     setCalendarViewWidth(calendarViewRef.current.clientWidth);
    // }

    // useEffect(() => {
    //     getCalendarViewSize();
    // }, [calendarViewRef])
    
    // TODO: Separate into its own component
    const renderCalendar = () => {
        let calendarRowKey = "calendarRow";
        let calendarCircleKey = "calendarCircle";
        let dayNum = 1;

        // NOTE: This is good enough for now, but calendar rendering for a scrollable, infinite calendar will require a rebuild of this
        let daysLeftToRender = daysInMonth();
        const weekCount = Math.ceil(daysLeftToRender / 7);
        
        return (
            <View className="mt-4" ref={calendarViewRef}>
                <Text className="text-[20px] font-bold mb-3">
                    {/* TODO: get dynamic month name */}
                    March
                </Text>
                
                {
                    [...Array(weekCount).keys()].map((rowN) => {
                        return (
                            <View className="flex-row my-1" key={calendarRowKey+rowN}>
                                {
                                    [...Array(daysLeftToRender >= 7 ? 7 : daysLeftToRender).keys()].map((circleN) => {
                                        let calendarCircle = (
                                            <CalendarCircle
                                                key={calendarCircleKey+(rowN * 7 + circleN)}
                                                day={dayNum}
                                                // TODO: Dynamic fillColor and fillPercent based on user period data
                                                fillColor="salmon"
                                                flowLevel="heavy"
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
        )
    }
        
    // TODO: Satoshi Font
    return (
        <SafeAreaView className="flex-1 bg-offwhite">
            <ScrollView className="flex p-[35px]" nestedScrollEnabled={true}>
                    {/* Header */}
                    <View className="flex-row justify-center items-center">
                        <Text className="text-[32px] font-bold">
                            Analysis
                        </Text>
                    </View>

                    {/* Day/Week/Month Selector */}
                    <View className="flex-row justify-center items-center rounded-[7px] bg-teal mt-4">
                        <TouchableHighlight
                            className={`flex-1 rounded-[7px] items-center pt-1 pb-1 ${monthWeekDaySelector == "month" ? "bg-seafoam" : "bg-teal"}`}
                            onPressIn={() => {
                                console.log('Selected Month!');
                                if (!(monthWeekDaySelector == "month")) {
                                    setMonthWeekDaySelector("month");
                                    setMwdDividersVisible([false, true]);
                                }
                            }}
                            underlayColor="#5B9F8F"
                        >
                            <Text className="text-[11px] font-normal text-offwhite">
                                M
                            </Text>
                        </TouchableHighlight>

                        <View className={`${mwdDividersVisible[0] ? "border-offwhite" : "border-teal"} border-[0.3px] h-2/3`}></View>

                        <TouchableHighlight
                            className={`flex-1 rounded-[7px] items-center pt-1 pb-1 ${monthWeekDaySelector == "week" ? "bg-seafoam" : "bg-teal"}`}
                            onPressIn={() => {
                                console.log('Selected Week!');
                                if (!(monthWeekDaySelector == "week")) {
                                    setMonthWeekDaySelector("week");
                                    setMwdDividersVisible([false, false]);
                                }
                            }}
                            underlayColor="#5B9F8F"
                        >
                            <Text className="text-[11px] font-normal text-offwhite">
                                W
                            </Text>
                        </TouchableHighlight>
                        
                        <View className={`${mwdDividersVisible[1] ? "border-offwhite" : "border-teal"} border-[0.3px] h-1/2`}></View>

                        <TouchableHighlight
                            className={`flex-1 rounded-[7px] items-center pt-1 pb-1 ${monthWeekDaySelector == "day" ? "bg-seafoam" : "bg-teal"}`}
                            onPressIn={() => {
                                console.log('Selected Day!');
                                if (!(monthWeekDaySelector == "day")) {
                                    setMonthWeekDaySelector("day");
                                    setMwdDividersVisible([true, false]);
                                }
                            }}
                            underlayColor="#5B9F8F"
                        >
                            <Text className="text-[11px] font-normal text-offwhite">
                                D
                            </Text>
                        </TouchableHighlight>
                    </View>

                    <Modal
                        animationType="slide"
                        transparent={false}
                        visible={trendsModalVisible}
                        onRequestClose={() => {
                            setTrendsModalVisible(!trendsModalVisible);
                        }}
                    >
                        <SafeAreaView>
                            <Text className="text-[20px] font-bold">This is the trends screen</Text>
                        </SafeAreaView>
                        <TouchableHighlight
                            className="flex rounded-[50px] self-start items-center justify-center bg-turquoise px-3 py-1 mt-4"
                            onPress={() => {
                               setTrendsModalVisible(!trendsModalVisible)
                            }}
                        >
                            <View className="flex-row items-center">
                                <Text className="text-offwhite text-[14px] font-bold py-1">
                                    Exit Trends
                                </Text>
                            </View>
                        </TouchableHighlight>
                    </Modal>

                    {/* Month & Year + Trends Button View */}
                    <View className="flex-row mt-2 px-1">
                        <Text className="font-bold justify-start self-end text-[22px]">
                            {currDateObject.toLocaleString('default', {year: 'numeric'})}
                        </Text>
                        <View className="flex-1"></View>
                        <TouchableHighlight
                            className="flex rounded-[50px] self-start items-center justify-center bg-turquoise px-3 py-1"
                            onPress={() => {
                                setTrendsModalVisible(true);
                            }}
                            underlayColor="#5B9F8F"
                        >
                            <View className="flex-row items-center">
                                <TimelineIcon width={22} height={12}/>
                                <Text className="text-offwhite text-[14px] font-bold ml-[6px] py-1">
                                    Trends
                                </Text>
                            </View>
                        </TouchableHighlight>
                    </View>

                    {/* Days (S, M, T ... S) Header */}
                    <View className="flex-row justify-center items-center rounded-[7px] bg-[#EDEEE0] mt-3 py-1">
                        {
                            ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => {
                                return (
                                    <View className="flex-grow items-center" key={day}>
                                        {/* pass first letter of 3-letter abbreviation keys */}
                                        <Text className="text-[11px] font-normal text-greydark">
                                            {day !== "Thu" ? day[0] : "R"}
                                        </Text>
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
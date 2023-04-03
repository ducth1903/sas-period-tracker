import React, {useContext, useEffect, useRef, useState} from 'react';
import {
    Dimensions,
    Modal,
    SafeAreaView,
    ScrollView,
    Systrace,
    Text,
    TouchableHighlight,
    View,
} from 'react-native'

import { AuthContext } from '../navigation/AuthProvider'; 
import PeriodDate, { MODAL_TEMPLATE, formatDate } from '../models/PeriodDate';
import CalendarCircle from '../components/CalendarCircle';
import WeekColumn from '../components/WeekColumn';

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

    // TODO: translations
    const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
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

    const getDateFromDiff = (diff, date=currDateObject) => {
        let dayAtDiff = new Date(date.getTime());
        dayAtDiff.setDate(dayAtDiff.getDate() + diff);
        return dayAtDiff;
    }

    // TODO: make async and actually fetch
    function fetchNotesForDate(date) {
        return "Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit";
    }

    // fetch methods here will return an object for each day in the week
    const fetchWeekFlow = (startDate) => {
        // TODO: ACTUALLY FETCH FROM BACKEND
        // returning it in this object format will take some manipulation of the data
        return {
            sunday: "light",
            monday: "medium",
            tuesday: "heavy",
            wednesday: "medium",
            thursday: "notsure",
            friday: "light",
            saturday: "none"
        };
    }
    
    const fetchWeekDischarge = (startDate) => {
        // TODO: ACTUALLY FETCH FROM BACKEND
        
        return {
            sunday: "stringy",
            monday: "watery",
            tuesday: "transparent",
            wednesday: "creamy",
            thursday: "clumpy",
            friday: "watery",
            saturday: "sticky"
        };
    }

    const fetchWeekSymptoms = (startDate) => {
        // TODO: ACTUALLY FETCH FROM BACKEND
        
        return {
            sunday: {
                cravings: true,
                backache: true,
                tenderBreasts: false,
                headache: false,
                fatigue: false,
                nausea: false,
            },
            monday: {
                cravings: false,
                backache: false,
                tenderBreasts: true,
                headache: true,
                fatigue: false,
                nausea: false,
            },
            tuesday: {
                cravings: false,
                backache: false,
                tenderBreasts: false,
                headache: false,
                fatigue: true,
                nausea: true,
            },
            wednesday: {
                cravings: false,
                backache: false,
                tenderBreasts: false,
                headache: false,
                fatigue: false,
                nausea: false,
            },
            thursday:{
                cravings: false,
                backache: false,
                tenderBreasts: false,
                headache: false,
                fatigue: false,
                nausea: false,
            },
            friday: {
                cravings: false,
                backache: false,
                tenderBreasts: false,
                headache: false,
                fatigue: false,
                nausea: false,
            },
            saturday:{
                cravings: false,
                backache: false,
                tenderBreasts: false,
                headache: false,
                fatigue: false,
                nausea: false,
            }
        };
    }

    const fetchWeekMood = (startDate) => {
        // TODO: ACTUALLY FETCH FROM BACKEND
        return {
            sunday: {
                excited: true,
                happy: false,
                sensitive: false,
                sad: false,
                anxious: false,
                angry: false
            },
            monday: {
                excited: false,
                happy: true,
                sensitive: false,
                sad: false,
                anxious: false,
                angry: false
            },
            tuesday: {
                excited: false,
                happy: false,
                sensitive: true,
                sad: false,
                anxious: false,
                angry: false
            },
            wednesday: {
                excited: false,
                happy: false,
                sensitive: true,
                sad: false,
                anxious: false,
                angry: false
            },
            thursday:{
                excited: false,
                happy: false,
                sensitive: false,
                sad: true,
                anxious: false,
                angry: false
            },
            friday: {
                excited: false,
                happy: false,
                sensitive: false,
                sad: false,
                anxious: true,
                angry: false
            },
            saturday:{
                excited: true,
                happy: false,
                sensitive: false,
                sad: false,
                anxious: false,
                angry: true
            }
        };
    };

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

    let flag = true;
    function getWeekDates() {
        let currDayOfWeek = currDateObject.getDay();
        let daysSinceSunday = currDayOfWeek === 0 ? 0 : currDayOfWeek;
        let sundayDate = new Date(currDateObject.getFullYear(), currDateObject.getMonth(), currDateObject.getDate() - daysSinceSunday);

        return [...Array(7).keys()].map((d) => getDateFromDiff(d, sundayDate));
    }

    const getCurrWeekRangeString = () => {
        const weekDates = getWeekDates();

        const firstDateOfWeek = weekDates[0];
        const lastDateOfWeek = weekDates[6];
        
        const first = {
            day: firstDateOfWeek.getDate(),
            monthNum: firstDateOfWeek.getMonth(),
            monthString: firstDateOfWeek.toLocaleString('default', {month: 'short'}),
            year: firstDateOfWeek.getFullYear()
        }
        
        const last = {
            day: lastDateOfWeek.getDate(),
            monthNum: lastDateOfWeek.getMonth(),
            monthString: lastDateOfWeek.toLocaleString('default', {month: 'short'}),
            year: lastDateOfWeek.getFullYear()
        }

        return `${first.monthString} ${first.day} - ${first.monthNum !== last.monthNum ? last.monthString + ' ' : ''}${last.day}, ${first.year}${first.year === last.year ? '' : ' - ' + last.year}`;
    }

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
            <View className="flex-col mt-4" ref={calendarViewRef}>
                <View>
                    <Text className="text-[20px] font-bold mb-3">
                        {currDateObject.toLocaleString('default', { month: 'long' })}
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
                                                    // borderFillColor="salmon"
                                                    fillColor="salmon"
                                                    flowLevel="none"
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

    const renderWeekly = () => {
        const weekData = {
            flow: fetchWeekFlow(),
            discharge: fetchWeekDischarge(),
            symptoms: fetchWeekSymptoms(),
            mood: fetchWeekMood()
        }
        
        return (
            <View className="flex flex-col">
                <View className="flex-row">
                    {
                        weekDays.map(s => s.toLowerCase()).map((day) => 
                            <WeekColumn 
                                flow={weekData.flow[day]}
                                discharge={weekData.discharge[day]}
                                symptoms={weekData.symptoms[day]}
                                moods={weekData.mood[day]}
                                day={day}
                                key={`weekcolumn-${day}`}
                            />
                        )
                    }
                </View>
                
                <Text className="text-[20px] font-bold mt-14 mb-2">
                    Notes
                </Text>

                {
                    getWeekDates().map((date) => 
                        <View key={`note-${date.toLocaleString('default', { weekday: 'long' }).toLowerCase()}`}>
                            <Text className="text-[18px] font-bold mt-4">{`${weekDays[date.getDay()]}, ${date.toLocaleString('default', { month: 'long' })} ${date.getDate()}`}</Text>
                            <View className="items-center justify-center border-2 min-h-[112px] border-turquoise rounded-xl mt-1.5 px-4 py-8">
                                <Text className="text-teal">{fetchNotesForDate()}</Text>
                            </View>
                        </View>
                    )
                }

            </View>
        );
    }

    const renderDaily = () => {
        return null;
    }
    
    const renderMwdContent = () => {
        {/* TODO: Separate these components out into separate files in the components folder */}
        switch (monthWeekDaySelector) {
            case "month":
                return renderCalendar();
            case "week":
                return renderWeekly();
            case "day": 
                return renderDaily();
        }
    }
        
    // TODO: Satoshi Font
    // TODO: Add padding at bottom for navigation bar
    return (
        <SafeAreaView className="flex-1 bg-offwhite">
            <ScrollView className="flex p-[35px]" nestedScrollEnabled={true}>
                <View className="mb-14">
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
                    <View className="flex-row mt-2">
                        <View className="flex-grow justify-end shrink mr-1">
                            <Text adjustsFontSizeToFit={true} numberOfLines={1} className="font-bold text-[22px]">
                                {
                                    monthWeekDaySelector == "month" ? 
                                    currDateObject.toLocaleString('default', {year: 'numeric'})
                                    :
                                    // need to get date of the most recent sunday
                                    // currDateObject.toLocaleString('default', {month: 'long', year: 'numeric'})
                                    monthWeekDaySelector == "week" ?
                                    // "test"
                                    getCurrWeekRangeString()
                                    :
                                    `${currDateObject.toLocaleString('default', {month: 'long', day: 'numeric'})}, ${currDateObject.toLocaleString('default', {year: 'numeric'})}`
                                }
                            </Text>
                        </View>
                        {/* <View className="flex-1"></View> */}
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

                    {/* Main content (calendaar, weekly view, or daily view) */}
                    {renderMwdContent()}

                    {/* Debug Button */}
                    {/* <TouchableHighlight
                        className="flex rounded-[50px] self-start items-center justify-center bg-turquoise px-3 py-1 mt-4"
                        onPressIn={() => {
                        }}
                    >
                        <View className="flex-row items-center">
                            <Text className="text-offwhite text-[14px] font-bold py-1">
                                Debug Button
                            </Text>
                        </View>
                    </TouchableHighlight> */}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

export default PeriodCalendarScreen;
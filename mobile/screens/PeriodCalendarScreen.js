import React, {useContext, useEffect, useRef, useState, useCallback} from 'react';
import {
    Dimensions,
    SafeAreaView,
    ScrollView,
    Text,
    TouchableHighlight,
    TouchableOpacity,
    Pressable,
    View,
    useWindowDimensions,
} from 'react-native'
import Modal from 'react-native-modal';
import DropDownPicker from "react-native-dropdown-picker";

import { AuthContext } from '../navigation/AuthProvider'; 
import PeriodDate, { MODAL_TEMPLATE, formatDate } from '../models/PeriodDate';
import CalendarCircle from '../components/CalendarCircle';
import WeekColumn from '../components/WeekColumn';
import StaticNote from '../components/StaticNote';
import DailyGrid from '../components/DailyGrid';
import TrendYearBlock from '../components/TrendYearBlock';
import ScrollPicker from '../components/ScrollPicker';

import TimelineIcon from '../assets/icons/timeline.svg';
import BackArrowIcon from '../assets/icons/back_arrow.svg';
import ShareIcon from '../assets/icons/share.svg';
import XIcon from '../assets/icons/x.svg';
import ExportCheckIcon from '../assets/icons/export_check.svg';

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
    const { height, width } = useWindowDimensions();

    const [trendsModalVisible, setTrendsModalVisible] = useState(false);
    const [exportModalVisible, setExportModalVisible] = useState(false);
    const [exportDropdownOpen, setExportDropdownOpen] = useState(false);
    const [exportDropdownValue, setExportDropdownValue] = useState("PDF");
    const [exportDropdownItems, setExportDropdownItems] = useState([
        { label: "PDF", value: "PDF" },
    ]);
    const [exportButtonPressed, setExportButtonPressed] = useState(false);
    const [exportButtonColor,  setExportButtonColor] = useState("#00394E"); // default teal
    const [exportStartMonth, setExportStartMonth] = useState(new Date().getMonth());
    const [exportStartYear, setExportStartYear] = useState(new Date().getFullYear());
    const [exportEndMonth, setExportEndMonth] = useState(new Date().getMonth());
    const [exportEndYear, setExportEndYear] = useState(new Date().getFullYear());
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
    const [fetchedPeriodData, setFetchedPeriodData] = useState({});
    const [periodDataByYear, setPeriodDataByYear] = useState({});
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
    const scrollPickerItemHeight = 46;
    
    async function fetchUserData() {
        await fetch(`${API_URL}/users/${userId}`, { method: "GET" })
        .then(resp => resp.json())
        .then(data => {
            setSymptomSetting(new Set(data['symptomsTrack']));      // convert from Array to Set
        })
        .catch(error => {console.log(error)})
    }

    async function fetchPeriodData() {
        try {
            console.log(`[PeriodCalendarScreen] fetching period data at ${API_URL}/periods/${userId}`)
            const resp = await fetch(`${API_URL}/periods/${userId}`, { method: "GET" })
            const data = await resp.json();

            // data is an array of objects {"details": object[], "year_month": string}[] where each represents one period corresponding to one month
            setFetchedPeriodData(data);

            // group by years, e.g., periodDataByYear[2021] = [period1, period2, ...] where period{n} represents an array of individual period days for one period
            let periodDataByYear = {};

            // each period is an array of individual period days
            data.forEach((periodMonth) => {
                const currYear = periodMonth.year_month.substring(0, 4);
                if (!Object.keys(periodDataByYear).includes(currYear)) {
                  periodDataByYear[currYear] = [];
                }
                
                periodDataByYear[currYear].push(periodMonth);
            });

            setPeriodDataByYear(periodDataByYear);
        }
        catch (error) {
            // TODO: Display error Toast popup?
            console.log(`[PeriodCalendarScreen] fetchPeriodData() error: ${error}`);
        }
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
                
                <Text className="text-[20px] font-bold mt-12 mb-2">
                    Notes
                </Text>

                {
                    getWeekDates().map((date) => 
                        <StaticNote date={date} key={`note-${date.toLocaleString('default', { weekday: 'long' }).toLowerCase()}`}/>
                    )
                }

            </View>
        );
    }

    const renderDaily = () => {
        return (
            <View className="flex-col">
                <View>
                    {/* TODO: Data */}
                    <DailyGrid />
                </View>
                <Text className="text-[20px] font-bold mt-10 mb-2">
                    Notes
                </Text>
                <StaticNote date={currDateObject}></StaticNote>
            </View>
        );
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
        
    const onEveryPress = () => {
        setExportDropdownOpen(false);
    }

    // gross code duplication, but can revisit later if needed (not necessary to make it more scalable at this point)
    const handleViewableItemsChangedStartMonth = useCallback(({viewableItems, changed}) => {
        let centerViewable = viewableItems[1].item.id; // for the first moments of rendering, it might error without this check
        setExportStartMonth(centerViewable);
    }, []);

    const handleViewableItemsChangedStartYear = useCallback(({viewableItems, changed}) => {
        let centerViewable = viewableItems[1].item.id; // for the first moments of rendering, it might error without this check
        setExportStartYear(centerViewable);
    }, []);

    const handleViewableItemsChangedEndMonth = useCallback(({viewableItems, changed}) => {
        if (viewableItems.length < 2) return; // for the first moments of rendering, it might error without this check
        let centerViewable = viewableItems[1].item.id;
        setExportEndMonth(centerViewable);
    }, []);

    const handleViewableItemsChangedEndYear = useCallback(({viewableItems, changed}) => {
        let centerViewable = viewableItems[1].item.id; // for the first moments of rendering, it might error without this check
        setExportEndYear(centerViewable);
    }, []);

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
                                onEveryPress();
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
                                onEveryPress();
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
                                onEveryPress();
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
                        animationIn={"slideInRight"}
                        animationOut={"slideOutRight"}
                        animationInTiming={500}
                        animationOutTiming={500}
                        hasBackdrop={false}
                        isVisible={trendsModalVisible}
                        onRequestClose={() => {
                            setTrendsModalVisible(!trendsModalVisible);
                        }}
                        // margin 0 makes modal fullscreen,
                        className="m-0"
                    >
                        <SafeAreaView className="flex-grow flex-col items-start bg-offwhite">
                            <ScrollView className="w-full h-full p-[35px]">
                                {/* Header */}
                                <View className="flex-row items-center w-full">
                                    <Pressable
                                        onPress={() => {
                                            onEveryPress();
                                            setTrendsModalVisible(!trendsModalVisible)
                                        }}
                                        hitSlop={25}
                                    >
                                        <BackArrowIcon className="self-start"/>
                                    </Pressable>
                                    <View className="flex-grow"/>
                                    <Text className="text-[32px] font-bold self-center">
                                        Trends
                                    </Text>
                                    <View className="flex-grow"/>
                                    <Pressable
                                        onPress={() => {
                                            onEveryPress();
                                            setExportModalVisible(!exportModalVisible);
                                        }}
                                        hitSlop={25}
                                    >
                                        <ShareIcon className="self-end"/>
                                    </Pressable>
                                </View>

                                {/* Content */}
                                {
                                    Object.keys(periodDataByYear).map(year => Number(year))
                                                                 .sort((a, b) => b - a) // sort by year descending
                                                                 .map((year) =>
                                        {
                                            // sort year data by descending first day of period for each month (first day to account for multiple periods same month edge case)
                                            return <TrendYearBlock
                                                    year={year}
                                                    firstPeriodOfNextYear={String(year + 1) in periodDataByYear ? periodDataByYear[year + 1][periodDataByYear[year + 1].length - 1] : null}
                                                    yearData={
                                                        periodDataByYear[year].sort((periodA, periodB) => {
                                                            const getEarliestDateOfPeriod = (period) => {
                                                                // first map each day to an array of the dates on which the period occurred, then reduce to get earliest
                                                                return period.details.map((dayOfPeriod) => {
                                                                    // assuming format YYYY-MM-DD
                                                                    const [year, month, day] = dayOfPeriod.dateStr.split('-')
                                                                                                                  .map(str => Number(str));
                                                                    return new Date(year, month - 1, day)
                                                                }).reduce((min, curr) => curr < min ? curr : min, new Date());
                                                            }

                                                            const aDate = getEarliestDateOfPeriod(periodA);
                                                            const bDate = getEarliestDateOfPeriod(periodB);
                                                            return bDate - aDate;
                                                        }).map((period) => { // then sort in-place individual periods by descending date
                                                            // sort period.details in-place then just return period
                                                            period.details.sort((periodDayA, periodDayB) => {
                                                                const [yearA, monthA, dayA] = periodDayA.dateStr.split('-')
                                                                                                          .map(str => Number(str));
                                                                const [yearB, monthB, dayB] = periodDayB.dateStr.split('-')
                                                                                                          .map(str => Number(str));
                                                                return new Date(yearB, monthB - 1, dayB) - new Date(yearA, monthA - 1, dayA);
                                                            })
                                                            return period;
                                                        })
                                                    }
                                                    key={`trendyearblock-${year}`}/>
                                        }
                                    )
                                }

                                <Modal
                                    animationIn={"slideInUp"}
                                    animationOut={"slideOutUp"}
                                    animationTiming={500}
                                    backdropOpacity={0.5}
                                    isVisible={exportModalVisible}
                                    onBackdropPress={() => {
                                        onEveryPress();
                                        setExportModalVisible(!exportModalVisible);
                                    }}
                                    onRequestClose={() => {
                                        onEveryPress();
                                        setTrendsModalVisible(!exportModalVisible);
                                    }}
                                >
                                    <Pressable
                                        onPress={() => {
                                            setExportDropdownOpen(false);
                                        }}
                                    >
                                        <View className="bg-offwhite rounded-[20px] border-[3px] border-seafoam mx-6 py-4 px-6">
                                            <View className="flex-row justify-center">
                                                <Text className="text-[22px] font-bold">
                                                    Export
                                                </Text>
                                                <TouchableOpacity 
                                                    className="absolute right-0"
                                                    onPress={() => {
                                                        onEveryPress();
                                                        setExportModalVisible(!exportModalVisible);
                                                    }}
                                                >
                                                    <XIcon/>
                                                </TouchableOpacity>
                                            </View>
                                            <View className="flex-row mt-3 items-center justify-between">
                                                <Text className="text-[20px] font-bold">
                                                    Format
                                                </Text>
                                                <DropDownPicker
                                                    open={exportDropdownOpen}
                                                    value={exportDropdownValue}
                                                    items={exportDropdownItems}
                                                    setOpen={setExportDropdownOpen}
                                                    setValue={setExportDropdownValue}
                                                    setItems={setExportDropdownItems}
                                                    placeholder={exportDropdownValue}
                                                    style={{backgroundColor: '#EDEEE0', borderWidth: 0, borderRadius: 3, minHeight: 35}}
                                                    containerStyle={{width: 90}}
                                                    dropDownContainerStyle={{backgroundColor: '#EDEEE0', borderColor: '#777', borderWidth: 1, borderRadius: 3}}
                                                    textStyle={{color: '#272727', fontSize: 16, fontWeight: 'bold'}}
                                                />
                                            </View>

                                            <Text className="text-[20px] font-bold mt-3">
                                                Start
                                            </Text>
                                            <View className="flex-row mt-3">
                                                <ScrollPicker
                                                    data={[...Array(12).keys()].map((monthIndex) => {
                                                        return {title: new Date(2021, monthIndex, 1).toLocaleString('default', {month: 'short'}), id: monthIndex}
                                                    })}
                                                    initialScrollIndex={currDateObject.getMonth()}
                                                    onViewableItemsChanged={handleViewableItemsChangedStartMonth}
                                                    itemHeight={scrollPickerItemHeight}
                                                    keyPrefix="month"
                                                    roundLeft={true}
                                                />
                                                <ScrollPicker
                                                    data={[...Array(10_000).keys()].map((yearIndex) => {
                                                        return {title: yearIndex + 1, id: yearIndex}
                                                    })}
                                                    initialScrollIndex={currDateObject.getFullYear() - 1}
                                                    onViewableItemsChanged={handleViewableItemsChangedStartYear}
                                                    itemHeight={scrollPickerItemHeight}
                                                    keyPrefix="year"
                                                    roundRight={true}
                                                />
                                            </View>
                                            <Text className="text-[20px] font-bold mt-3">
                                                End
                                            </Text>
                                            <View className="flex-row mt-3">
                                                <ScrollPicker
                                                    data={[...Array(12).keys()].map((monthIndex) => {
                                                        return {title: new Date(2021, monthIndex, 1).toLocaleString('default', {month: 'short'}), id: monthIndex}
                                                    })}
                                                    initialScrollIndex={currDateObject.getMonth()}
                                                    onViewableItemsChanged={handleViewableItemsChangedEndMonth}
                                                    itemHeight={scrollPickerItemHeight}
                                                    keyPrefix="month"
                                                    roundLeft={true}
                                                />
                                                <ScrollPicker
                                                    data={[...Array(10_000).keys()].map((yearIndex) => {
                                                        return {title: yearIndex + 1, id: yearIndex}
                                                    })}
                                                    initialScrollIndex={currDateObject.getFullYear() - 1}
                                                    onViewableItemsChanged={handleViewableItemsChangedEndYear}
                                                    itemHeight={scrollPickerItemHeight}
                                                    keyPrefix="year"
                                                    roundRight={true}
                                                />
                                            </View>

                                            {/* Export Button */}
                                            <Pressable
                                                onPress={() => {
                                                    setExportButtonPressed(true);
                                                    setExportButtonColor("#5B9F8F");
                                                    setTimeout(() => {
                                                        // TODO: Check for success in sending email to user
                                                        setExportModalVisible(false);

                                                        // letting modal fly out before setting variables to ensure animation fluidity
                                                        setTimeout(() => {
                                                            setExportButtonColor("#00394E");
                                                            setExportButtonPressed(false);
                                                        }, 1000);
                                                    }, 1000);
                                                }}
                                            >
                                                <View 
                                                    className="flex-row rounded-[50px] justify-center items-center mt-4 py-4 px-6"
                                                    style={{ backgroundColor: exportButtonColor }}
                                                >
                                                    {
                                                        exportButtonPressed
                                                        &&
                                                        <View className="mr-3">
                                                            <ExportCheckIcon width={25} height={25} />
                                                        </View>
                                                    }
                                                    <View className="justify-center items-center h-[25px]">
                                                        <Text className="text-offwhite text-[16px]">
                                                            {exportButtonPressed ? "Exported Successfully" : "Export"}
                                                        </Text>
                                                    </View>
                                                </View>
                                            </Pressable>
                                        </View>

                                    </Pressable>
                                </Modal>
                            </ScrollView>
                        </SafeAreaView>
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
                                onEveryPress();
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
                    {
                    monthWeekDaySelector === "day" ? (
                        <View className="flex-row justify-center items-center rounded-[7px] bg-[#EDEEE0] mt-3 py-1 px-2">
                            {/* NOTE: Add in DD/MM/YYYY here? Not the same format in India, goes  */}
                            <Text className="text-[12px] text-greydark">
                                {weekDays[currDateObject.getDay()]}
                            </Text>
                            <View className="flex-grow"/>
                            <Text className="text-[12px] text-greydark">
                                {/* TODO: un-hardcode this */}
                                {`Day ${1} of ${6} of menstrual flow`}
                            </Text>
                        </View>
                    )
                    :
                    (
                        <View className="flex-row justify-center items-center rounded-[7px] bg-[#EDEEE0] mt-3 py-1">
                            {
                            weekDays.map((day) => {
                                return (
                                    <View className="flex-grow items-center" key={`daybar-${day}`}>
                                        {/* pass first letter of 3-letter abbreviation keys */}
                                        <Text className="text-[11px] font-normal text-greydark">
                                            {day !== "Thu" ? day[0] : "R"}
                                        </Text>
                                    </View>
                                )
                            })
                        }
                    </View>
                    )

                    }

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
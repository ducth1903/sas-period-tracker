import {useContext, useEffect, useState, useCallback, useRef} from 'react';
import {
    SafeAreaView,
    ScrollView,
    Text,
    TouchableHighlight,
    TouchableOpacity,
    Pressable,
    View,
    FlatList,
    Dimensions,
    RefreshControl,
    Image
} from 'react-native'
import Modal from 'react-native-modal';
import DropDownPicker from "react-native-dropdown-picker";
import Toast from 'react-native-toast-message';
import { Skeleton } from '@rneui/themed';
import * as MailComposer from 'expo-mail-composer';
import * as Print from 'expo-print';
import { useNavigation } from '@react-navigation/native';

import { AuthContext } from '../navigation/AuthProvider'; 
import { SettingsContext } from '../navigation/SettingsProvider';
import CalendarMonth from '../components/CalendarMonth';
import WeekColumn from '../components/WeekColumn';
import StaticNote from '../components/StaticNote';
import DailyGrid from '../components/DailyGrid';
import TrendYearBlock from '../components/TrendYearBlock';
import ScrollPicker from '../components/ScrollPicker';
import i18n from '../translations/i18n';

import TimelineIcon from '../assets/icons/timeline.svg';
import BackArrowIcon from '../assets/icons/back_arrow.svg';
import ShareIcon from '../assets/icons/share.svg';
import XIcon from '../assets/icons/x.svg';
import ExportCheckIcon from '../assets/icons/export_check.svg';

// Loading env variables
import getEnvVars from '../environment';

const { API_URL } = getEnvVars();

const PeriodCalendarScreen = ({ props }) => {
    // make this component aware of the user's current language selection state so it refreshes on change
    const { selectedSettingsLanguage } = useContext(SettingsContext);

    const { userId } = useContext(AuthContext);

    const { height, width } = Dimensions.get('window');

    const y = useRef();

    const [trendsModalVisible, setTrendsModalVisible] = useState(false);
    const [exportModalVisible, setExportModalVisible] = useState(false);
    const [ovulationModalVisible, setOvulationModalVisible] = useState(false);
    const [exportDropdownOpen, setExportDropdownOpen] = useState(false);
    const [exportDropdownValue, setExportDropdownValue] = useState("PDF");
    const [exportDropdownItems, setExportDropdownItems] = useState([
        { label: "PDF", value: "PDF" },
    ]);
    const [exportSuccessful, setExportSuccessful] = useState(false);
    const [exportButtonColor,  setExportButtonColor] = useState("#00394E"); // default teal
    const [exportStartMonth, setExportStartMonth] = useState(new Date().getMonth());
    const [exportStartYear, setExportStartYear] = useState(new Date().getFullYear());
    const [exportEndMonth, setExportEndMonth] = useState(new Date().getMonth());
    const [exportEndYear, setExportEndYear] = useState(new Date().getFullYear());
    const [refreshing, setRefreshing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // either "month" (default), "week", or "day"
    const [monthWeekDaySelector, setMonthWeekDaySelector] = useState("month");
    // dwm = Day Week Month
    const [mwdDividersVisible, setMwdDividersVisible] = useState([false, true]);

    const getCalendarMonthsForYear = (year) => {
        // returns an array of { date: Date, month: string, year, number, key: string } objects
        const data = [];
        const currDate = new Date();
        const currYear = currDate.getFullYear();
        for (let month = (year === currYear ? currDate.getMonth() : 11); month >= 0; month--) {
            const date = new Date(year, month, 1);
            data.push({
                date: date,
                key: `${month}-${year}`
            })
        }

        return data;
    }

    const [userObj, setUserObj] = useState({});
    const [periodObj, setPeriodObj] = useState({});
    const [periodDataByTime, setPeriodDataByTime] = useState({}); // object keyed by year, then month, then day (strings YYYY, then YYYY-MM, then YYYY-MM-DD)
    const [periodDataByYear, setPeriodDataByYear] = useState({});
    const [lastPeriod, setLastPeriod] = useState(0);
    const [currDateObject, setCurrDateObject] = useState(new Date());
    const [calendarMonths, setCalendarMonths] = useState(getCalendarMonthsForYear(new Date().getFullYear()));
    const [latestCalendarDataYear, setLatestCalendarDataYear] = useState(2023);
    const [weekDates, setWeekDates] = useState(getWeekDates(new Date()));

    const weekDaysEnglish = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const weekDays = [i18n.t('days.long.sunday'), i18n.t('days.long.monday'), i18n.t('days.long.tuesday'), i18n.t('days.long.wednesday'), i18n.t('days.long.thursday'), i18n.t('days.long.friday'), i18n.t('days.long.saturday')];
    const weekDaysShort = [i18n.t('days.short.sunday'), i18n.t('days.short.monday'), i18n.t('days.short.tuesday'), i18n.t('days.short.wednesday'), i18n.t('days.short.thursday'), i18n.t('days.short.friday'), i18n.t('days.short.saturday')];
    const weekDaysSingleLetter = [i18n.t('days.singleLetter.sunday'), i18n.t('days.singleLetter.monday'), i18n.t('days.singleLetter.tuesday'), i18n.t('days.singleLetter.wednesday'), i18n.t('days.singleLetter.thursday'), i18n.t('days.singleLetter.friday'), i18n.t('days.singleLetter.saturday')];
    const scrollPickerItemHeight = 46;
    
    // Helpers
    function getDayOfMenstrualFlow(date) {
        let count = 0;

        let currDate = new Date(date.getTime());
        while (getDayData(currDate) && count < 20) {
            count++;
            currDate.setDate(currDate.getDate() - 1);
        }
        
        return count;
    }

    function getDateFromDiff(diff, date=currDateObject) {
        let dayAtDiff = new Date(date.getTime());
        dayAtDiff.setDate(dayAtDiff.getDate() + diff);
        return dayAtDiff;
    }
    
    function getWeekDates(date) {
        let currDayOfWeek = date.getDay();
        let daysSinceSunday = currDayOfWeek === 0 ? 0 : currDayOfWeek;
        let sundayDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() - daysSinceSunday);

        return [...Array(7).keys()].map((d) => getDateFromDiff(d, sundayDate));
    }

    function getDayData(date) {
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        if (periodDataByTime[year] && periodDataByTime[year][month] && periodDataByTime[year][month][day]) {
            return periodDataByTime[year][month][day];
        }
        else {
            return undefined;
        }
    }

    const getCurrWeekRangeString = () => {
        const weekDates = getWeekDates(currDateObject);

        const firstDateOfWeek = weekDates[0];
        const lastDateOfWeek = weekDates[6];
        
        const first = {
            day: firstDateOfWeek.getDate(),
            monthNum: firstDateOfWeek.getMonth(),
            monthString: firstDateOfWeek.toLocaleString(selectedSettingsLanguage, {month: 'short'}),
            year: firstDateOfWeek.getFullYear()
        }
        
        const last = {
            day: lastDateOfWeek.getDate(),
            monthNum: lastDateOfWeek.getMonth(),
            monthString: lastDateOfWeek.toLocaleString(selectedSettingsLanguage, {month: 'short'}),
            year: lastDateOfWeek.getFullYear()
        }

        return `${first.monthString} ${first.day} - ${first.monthNum !== last.monthNum ? last.monthString + ' ' : ''}${last.day}, ${first.year}${first.year === last.year ? '' : ' - ' + last.year}`;
    }

    function bottomPad() {
        rawValue = Math.floor((height/75))
        //console.log(rawValue)
        padding = "mb-" + rawValue.toString()
        return padding
    }
    
    const renderCalendar = () => {
        return (
            <FlatList
                showsVerticalScrollIndicator={false}
                nestedScrollEnabled={true}
                data={calendarMonths}
                className={bottomPad()} ///WHERE WE ARE CURRENTLY PADDING
                renderItem={({item}) => {
                    // item.date: Date object
                    // item.key: string
                    return (
                        <CalendarMonth
                            yearMonthDate={item.date}
                            monthData={periodDataByTime[item.date.getFullYear()] ? periodDataByTime[item.date.getFullYear()][item.date.getMonth() + 1] : undefined}
                            onCirclePress={(date) => {
                                setCurrDateObject(date);
                                setWeekDates(getWeekDates(date));
                                setMonthWeekDaySelector("day");
                                setMwdDividersVisible([true, false]);
                            }}
                        />
                    )
                }}
                onEndReachedThreshold={1}
                onEndReached={() => {
                    Toast.show({
                        type: 'success',
                        text1: i18n.t('errors.loadedMoreMonths')
                    })
                    setCalendarMonths([...calendarMonths, ...getCalendarMonthsForYear(latestCalendarDataYear - 1)])
                    setLatestCalendarDataYear(latestCalendarDataYear - 1);
                }}
                keyExtractor={(item) => item.key}
            />
        )
    }

    const renderWeekly = () => {
        // TODO: manual week change
        const weekData = {};
        weekDaysEnglish.forEach((day) => {
            weekData[day] = {
                date: weekDates[weekDaysEnglish.indexOf(day)],
                data: getDayData(weekDates[weekDaysEnglish.indexOf(day)])
            }
        })
            
        return (
            <View className="flex flex-col mb-28">
                <View className="flex-row justify-center">
                    {
                        weekDaysEnglish.map((day) => 
                            <View className="w-[calc(100%/7)] justify-center items-center" key={`weekcolumn-${day}`}>
                                <WeekColumn
                                    flow={weekData[day]["data"] ? weekData[day]["data"]["flow"] : null}
                                    discharge={weekData[day]["data"] ? weekData[day]["data"]["discharge"] : null}
                                    symptoms={weekData[day]["data"] ? weekData[day]["data"]["symptoms"] : null}
                                    moods={weekData[day]["data"] ? weekData[day]["data"]["mood"] : null}
                                    day={weekDays[weekDaysEnglish.indexOf(day)]}
                                    key={`weekcolumn-${day}`}
                                />
                            </View>
                        )
                    }
                </View>
                
                <Text className="text-[20px] font-bold mt-14 mb-2">
                    { i18n.t('analysis.week.notes') }
                </Text>

                {
                    getWeekDates(currDateObject).map((date) => 
                        <StaticNote mode="dates" noteKey={date} key={`note-${date.toLocaleString('default', { weekday: 'long' }).toLowerCase()}`}/>
                    )
                }

            </View>
        );
    }

    const renderDaily = (date) => {
        const data = getDayData(date);
        
        return (
            <View className="flex-col mb-28">
                <View>
                    <DailyGrid
                        data={data}
                    />
                </View>
                <Text className="text-[20px] font-bold mt-10 mb-2">
                    { i18n.t('analysis.week.notes') }
                </Text>
                <StaticNote mode="dates" noteKey={currDateObject}></StaticNote>
            </View>
        );
    }
    
    const renderMwdContent = () => {
        return (
            () => {
                switch (monthWeekDaySelector) {
                    case "month":
                       return (
                            <View className="mb-[50vh]">
                                {renderCalendar()}
                            </View>
                       )
                    case "week":
                        return (
                            <ScrollView className="mb-[30vh]" showsVerticalScrollIndicator={false}>
                                {renderWeekly()}
                            </ScrollView>
                        )
                    case "day": 
                        return (
                            <ScrollView className="mb-[30vh]" showsVerticalScrollIndicator={false}>
                                {renderDaily(currDateObject)}
                            </ScrollView>
                        )
                }
            }
        )()
    }
        
    const onEveryTrendsPress = () => {
        setExportDropdownOpen(false);
    }

    const handleViewableItemsChangedStartMonth = useCallback(({viewableItems, changed}) => {
        if (!viewableItems[1]) return;
        let centerViewable = viewableItems[1].item.id; // for the first moments of rendering, it might error without this check
        setExportStartMonth(centerViewable);
    }, []);

    const handleViewableItemsChangedStartYear = useCallback(({viewableItems, changed}) => {
        if (!viewableItems[1]) return;
        let centerViewable = viewableItems[1].item.id; // for the first moments of rendering, it might error without this check
        setExportStartYear(centerViewable);
    }, []);

    const handleViewableItemsChangedEndMonth = useCallback(({viewableItems, changed}) => {
        if (!viewableItems[1]) return;
        let centerViewable = viewableItems[1].item.id;
        setExportEndMonth(centerViewable);
    }, []);

    const handleViewableItemsChangedEndYear = useCallback(({viewableItems, changed}) => {
        if (!viewableItems[1]) return;
        let centerViewable = viewableItems[1].item.id; // for the first moments of rendering, it might error without this check
        setExportEndYear(centerViewable);
    }, []);

    // Async function to fetch user data
    async function fetchUserInfoData() {
        try {
            const resp = await fetch(`${API_URL}/users/${userId}`, { method: "GET" });
            return resp.json();
        } catch (error) {
            console.log("[HomeScreen] fetchUserData() error:", error);
        }
    }

    async function fetchUserPeriodData() {
        try {
            const resp = await fetch(`${API_URL}/periods/${userId}`, { method: "GET" });
            return resp.json();
        }
        catch (error) {
            console.log("[HomeScreen] fetchUserPeriodData() error:", error);
        }
    }

    function getPeriodDataByYear(data) {
        // group by years for trends screen, e.g., periodDataByYear[2021] = [period1, period2, ...] where period{n} represents an array of individual period days for one period
        let periodDataByYear = {};

        // each period is an array of individual period days
        data.forEach((periodMonth) => {
            const currYear = periodMonth.year_month.substring(0, 4);
            if (!Object.keys(periodDataByYear).includes(currYear)) {
              periodDataByYear[currYear] = [];
            }
            
            periodDataByYear[currYear].push(periodMonth);
        });

        return periodDataByYear;
    }

    function getPeriodDataByTime(data) {
        // group by years for trends screen, e.g., periodDataByYear[2021] = [period1, period2, ...] where period{n} represents an array of individual period days for one period
        // each { details: Object[], year_month: string } represents a month of period days
        let periodDataByTime = {};

        // find all unique years first
        let years = data.map((periodMonth) => periodMonth.year_month.substring(0, 4));
        years = [...(new Set(years))];
        // console.log(`[PeriodCalendarScreen] getPeriodDataByTime() years:`, years);
        
        // init top-level year objects in periodDataByTime
        years.forEach((year) => { periodDataByTime[Number(year)] = {}; });
        
        // find all unique months for each year
        years.forEach((year) => {
            let months = data.filter((periodMonth) => periodMonth.year_month.substring(0, 4) === year).map((periodMonth) => periodMonth.year_month.substring(5, 7));
            year = Number(year);
            months = [...(new Set(months))];
            periodDataByTime[year] = {};
            months.forEach((month) => { periodDataByTime[year][Number(month)] = {}; });
        });
        // flatten all period day objects into a single array
        let periodDays = data.map((periodMonth) => periodMonth.details).flat();

        // place each period day object into the correct year/month object in periodDataByTime
        // invariant: year and month for each day *will* exist in periodDataByTime by this point
        periodDays.forEach((periodDay) => {
            const year = Number(periodDay.dateStr.substring(0, 4));
            const month = Number(periodDay.dateStr.substring(5, 7));
            const day = Number(periodDay.dateStr.substring(8, 10));
            periodDataByTime[year][month][day] = periodDay;
        })

        return periodDataByTime;
    }

    async function fetchUserData() {
        try {
            setIsLoading(true);
            // fetch user info data
            const userRespJson = await fetchUserInfoData();
            setUserObj(userRespJson);

            // fetch user period data
            const periodRespJson = await fetchUserPeriodData();
            // console.log(`[PeriodCalendarScreen] fetchUserData() periodRespJson:`, JSON.stringify(periodRespJson, null, 2));
            setPeriodObj(periodRespJson);
            setPeriodDataByYear(getPeriodDataByYear(periodRespJson)); // for trends screen, should refactor to use periodDataByTime
            setPeriodDataByTime(getPeriodDataByTime(periodRespJson));
            setIsLoading(false);
        }
        catch (error) {
            Toast.show({
                type: 'error',
                text1: i18n.t('errors.failedToRetrieveUserData'),
                text2: error
            });
            console.log(`[PeriodCalendarScreen] fetchUserData() error:`, error);
        }
    }

    useEffect(() => {
        console.log(`[PeriodCalendarScreen] useEffect()`)
        fetchUserData();
    }, [])

    // Pull down to refresh
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        Toast.show({
            type: 'info',
            text1: i18n.t('errors.refreshing'),
        });
        fetchUserData();
        setRefreshing(false);
    }, []);

    const navigation = useNavigation();
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            fetchUserData();
        });
    
        return unsubscribe;
      }, [navigation]);    

    if (isLoading) {
        return (
            <SafeAreaView className="bg-offwhite flex-1">
                <ScrollView
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                >
                    <Text className="text-[15px] font-semibold text-greydark text-center">{i18n.t('errors.pullDownToRefresh')}</Text>
                    <View className="min-h-[40vw] flex-1 justify-center items-center">
                        <Skeleton animation="pulse" width={width * 0.6} height={height * 0.05} />
                    </View>

                    <View className="pl-7 pr-7 items-center">
                        <Skeleton animation="pulse" width={width * 0.9} height={30} />
                        <View className="pt-7" />
                        <Skeleton animation="pulse" width={width * 0.9} height={200} />
                    </View>
                </ScrollView>
            </SafeAreaView>
        );
    }
    
    return (
        <SafeAreaView className="flex-1 bg-offwhite">
            <View className="flex p-[35px]">
                <View className="mb-14">
                    <View
                        onTouchStart={e=> y.current = e.nativeEvent.pageY}
                        onTouchEnd={e => {
                            if (y.current - e.nativeEvent.pageY < -50) {
                                onRefresh()
                            }
                        }}
                    >
                            {/* Header */}
                            <View className="flex-row justify-center items-center">
                                <Text className="text-[32px] font-bold text-greydark">
                                    {i18n.t('navigation.analysis')}
                                </Text>
                            </View>

                            {/* Day/Week/Month Selector */}
                            <View className="flex-row justify-center items-center rounded-[7px] bg-teal mt-4">
                                <TouchableHighlight
                                    className={`flex-1 rounded-[7px] items-center pt-1 pb-1 ${monthWeekDaySelector == "month" ? "bg-seafoam" : "bg-teal"}`}
                                    onPressIn={() => {
                                        onEveryTrendsPress();
                                        if (!(monthWeekDaySelector == "month")) {
                                            setMonthWeekDaySelector("month");
                                            setMwdDividersVisible([false, true]);
                                        }
                                    }}
                                    underlayColor="#5B9F8F"
                                >
                                    <Text className="text-[11px] font-normal text-offwhite">
                                        {i18n.t('analysis.navigationHeaders.month')}
                                    </Text>
                                </TouchableHighlight>

                                <View className={`${mwdDividersVisible[0] ? "border-offwhite" : "border-teal"} border-[0.3px] h-2/3`}></View>

                                <TouchableHighlight
                                    className={`flex-1 rounded-[7px] items-center pt-1 pb-1 ${monthWeekDaySelector == "week" ? "bg-seafoam" : "bg-teal"}`}
                                    onPressIn={() => {
                                        onEveryTrendsPress();
                                        if (!(monthWeekDaySelector == "week")) {
                                            setMonthWeekDaySelector("week");
                                            setMwdDividersVisible([false, false]);
                                        }
                                    }}
                                    underlayColor="#5B9F8F"
                                >
                                    <Text className="text-[11px] font-normal text-offwhite">
                                        {i18n.t('analysis.navigationHeaders.week')}
                                    </Text>
                                </TouchableHighlight>
                                
                                <View className={`${mwdDividersVisible[1] ? "border-offwhite" : "border-teal"} border-[0.3px] h-1/2`}></View>

                                <TouchableHighlight
                                    className={`flex-1 rounded-[7px] items-center pt-1 pb-1 ${monthWeekDaySelector == "day" ? "bg-seafoam" : "bg-teal"}`}
                                    onPressIn={() => {
                                        onEveryTrendsPress();
                                        if (!(monthWeekDaySelector == "day")) {
                                            setMonthWeekDaySelector("day");
                                            setMwdDividersVisible([true, false]);
                                        }
                                    }}
                                    underlayColor="#5B9F8F"
                                >
                                    <Text className="text-[11px] font-normal text-offwhite">
                                        {i18n.t('analysis.navigationHeaders.day')}
                                    </Text>
                                </TouchableHighlight>
                            </View>

                            {/* Month & Year + Ovulation Button + Trends Button View */}
                            <View className="flex-row mt-2">
                                <View className="flex-grow justify-center shrink mr-1">
                                    <Text adjustsFontSizeToFit={true} numberOfLines={1} className="font-bold text-[24px]">
                                        {
                                            monthWeekDaySelector == "month" ? 
                                            currDateObject.toLocaleString(selectedSettingsLanguage, {year: 'numeric'})
                                            :
                                            monthWeekDaySelector == "week" ?
                                            getCurrWeekRangeString()
                                            :
                                            `${currDateObject.toLocaleString(selectedSettingsLanguage, {month: 'long', day: 'numeric'})}, ${currDateObject.toLocaleString(selectedSettingsLanguage, {year: 'numeric'})}`
                                        }
                                    </Text>
                                </View>

                                <View className="flex-col items-end justify-end">
                                    <View className="flex-row flex-grow mb-1">
                                        <TouchableHighlight
                                            className="flex flex-grow rounded-[50px] items-center justify-center bg-turquoise px-3 py-1"
                                            onPress={() => {
                                                onEveryTrendsPress();
                                                setOvulationModalVisible(true);
                                            }}
                                            underlayColor="#5B9F8F"
                                        >
                                            <View className="flex-row items-center">
                                                <Text className="text-offwhite text-[14px] font-bold py-1">
                                                    {i18n.t('analysis.ovulation.ovulationInfo')}
                                                </Text>
                                            </View>
                                        </TouchableHighlight>
                                    </View>

                                    <View className="flex-row flex-grow">
                                        <TouchableHighlight
                                            className="flex flex-grow rounded-[50px] items-center justify-center bg-turquoise px-3 py-1"
                                            onPress={() => {
                                                onEveryTrendsPress();
                                                setTrendsModalVisible(true);
                                            }}
                                            underlayColor="#5B9F8F"
                                        >
                                            <View className="flex-row items-center">
                                                <TimelineIcon width={22} height={12}/>
                                                <Text className="text-offwhite text-[14px] font-bold ml-[3px] py-1">
                                                    {i18n.t('analysis.trends.trends')}
                                                </Text>
                                            </View>
                                        </TouchableHighlight>
                                    </View>
                                </View>
                            </View>

                            {/* Days (S, M, T ... S) Header */}
                            {
                                monthWeekDaySelector === "day" ? (
                                    <View className="flex-row justify-center items-center rounded-[7px] bg-[#EDEEE0] mt-3 py-1 px-2">
                                        <Text className="text-[12px] text-greydark">
                                            {weekDays[currDateObject.getDay()]}
                                        </Text>
                                        <View className="flex-grow"/>
                                        <Text className="text-[12px] text-greydark">
                                            {(() => {
                                                const day = getDayOfMenstrualFlow(currDateObject);
                                                if (getDayData(currDateObject) || day === 0) {
                                                    return i18n.t('analysis.day.flowDay').replace('{day}', getDayOfMenstrualFlow(currDateObject));
                                                }
                                                else {
                                                    return i18n.t('analysis.day.notInPeriod');
                                                }
                                            })()}
                                        </Text>
                                    </View>
                                )
                                :
                                (
                                    <View className="flex-row justify-center items-center rounded-[7px] bg-[#EDEEE0] mt-3 py-1">
                                        {
                                        weekDaysSingleLetter.map((day, index) => {
                                            return (
                                                <View className="flex-grow items-center" key={`weekdayheader-${weekDaysEnglish[index]}`}>
                                                    <Text className="text-[11px] font-normal text-greydark">
                                                        {day}
                                                    </Text>
                                                </View>   
                                            )
                                        }
                                    )}
                                </View>
                                )
                            }
                    </View>

                    {/* Main content (calendaar, weekly view, or daily view) */}
                    {renderMwdContent()}

                    {/* Trends modal */}
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
                                            onEveryTrendsPress();
                                            setTrendsModalVisible(!trendsModalVisible)
                                        }}
                                        hitSlop={25}
                                    >
                                        <BackArrowIcon className="self-start"/>
                                    </Pressable>
                                    <View className="flex-grow"/>
                                    <Text className="text-[32px] font-bold self-center text-greydark">
                                        {i18n.t('analysis.trends.trends')}
                                    </Text>
                                    <View className="flex-grow"/>
                                    <Pressable
                                        onPress={() => {
                                            onEveryTrendsPress();
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
                                                                // first map each period to an array of the dates on which the period occurred, then reduce to get earliest
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

                                {/* Export modal */}
                                <Modal
                                    animationIn={"slideInUp"}
                                    animationOut={"slideOutUp"}
                                    animationTiming={500}
                                    backdropOpacity={0.5}
                                    isVisible={exportModalVisible}
                                    onBackdropPress={() => {
                                        onEveryTrendsPress();
                                        setExportModalVisible(!exportModalVisible);
                                    }}
                                    onRequestClose={() => {
                                        onEveryTrendsPress();
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
                                                    {i18n.t('analysis.trends.export.export')}
                                                </Text>
                                                <TouchableOpacity 
                                                    className="absolute right-0"
                                                    onPress={() => {
                                                        onEveryTrendsPress();
                                                        setExportModalVisible(!exportModalVisible);
                                                    }}
                                                >
                                                    <XIcon/>
                                                </TouchableOpacity>
                                            </View>
                                            <View className="flex-row mt-3 items-center justify-between">
                                                <Text className="text-[20px] font-bold">
                                                    {i18n.t('analysis.trends.export.format')}
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
                                                {i18n.t('analysis.trends.export.start')}
                                            </Text>
                                            <View className="flex-row mt-3">
                                                <ScrollPicker
                                                    data={[...Array(12).keys()].map((monthIndex) => {
                                                        return {title: new Date(2021, monthIndex, 1).toLocaleString(selectedSettingsLanguage, {month: 'short'}), id: monthIndex}
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
                                                {i18n.t('analysis.trends.export.end')}
                                            </Text>
                                            <View className="flex-row mt-3">
                                                <ScrollPicker
                                                    data={[...Array(12).keys()].map((monthIndex) => {
                                                        return {title: new Date(2021, monthIndex, 1).toLocaleString(selectedSettingsLanguage, {month: 'short'}), id: monthIndex}
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
                                                    // compose period data PDF
                                                    const htmlContent = `
                                                        <!DOCTYPE html>
                                                        <html lang="en">
                                                        <head>
                                                            <meta charset="UTF-8">
                                                            <meta name="viewport" content="width=device-width, initial-scale=1.0">
                                                            <title>Pdf Content</title>
                                                            <style>
                                                                body {
                                                                    font-size: 8px;
                                                                    color: rgb(0, 0, 0);
                                                                }
                                                                
                                                                h1 {
                                                                    text-align: center;
                                                                }
                                                            </style>
                                                        </head>
                                                        <body>
                                                            ${
                                                                // for now, just print all period days with symptoms
                                                                (
                                                                    () => {
                                                                        let html = "";
                                                                        periodObj.filter((periodMonth) => {
                                                                            const dateParts = periodMonth.year_month.split("-");
                                                                            const year = parseInt(dateParts[0]);
                                                                            const month = parseInt(dateParts[1]);
                                                                            return year >= exportStartYear && year <= exportEndYear && month >= exportStartMonth && month <= exportEndMonth;
                                                                        }).forEach((periodMonth) => {
                                                                            const dateParts = periodMonth.year_month.split("-");
                                                                            const date = new Date(dateParts[0], dateParts[1] - 1, 1);
                                                                            html += `<h2>${date.toLocaleString(selectedSettingsLanguage, { month: 'long', year: 'numeric' })}</h2>`;
                                                                            periodMonth.details.forEach((periodDay) => {
                                                                                const dateParts = periodDay.dateStr.split("-");
                                                                                const date = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
                                                                                html += `
                                                                                    <ul>
                                                                                    <h3>${date.toLocaleString(selectedSettingsLanguage, { month: 'long', day: 'numeric' })}</h3>
                                                                                `;

                                                                                // Add flow
                                                                                html += `
                                                                                    <li> ${i18n.t('home.bloodFlow')}: ${periodDay.flow ? i18n.t(`flow.${periodDay.flow}`) : i18n.t('analysis.trends.export.notLogged')}</li>
                                                                                `;
                                                                                
                                                                                // Add moods
                                                                                let moodsList = "";
                                                                                const moodsRecorded = periodDay.moods && periodDay.moods.length > 0;
                                                                                if (moodsRecorded) {
                                                                                    periodDay.moods.forEach((mood) => {
                                                                                        moodsList += `<li>${i18n.t(`moods.${mood}`)}</li>`;
                                                                                    })
                                                                                }
                                                                                html += `
                                                                                    <li> ${i18n.t('home.yourMood')}${!moodsRecorded ? ', ' + i18n.t('analysis.trends.export.notLogged') : ''}
                                                                                        ${
                                                                                            moodsRecorded ?
                                                                                            `<ul>` + moodsList + '</ul>'
                                                                                            :
                                                                                            ''
                                                                                        }
                                                                                    </li>
                                                                                `;
                                                                                
                                                                                // Add symptoms
                                                                                let symptomsList = "";
                                                                                const symptomsRecorded = periodDay.symptoms && periodDay.symptoms.length > 0;
                                                                                if (symptomsRecorded) {
                                                                                    periodDay.symptoms.forEach((symptom) => {
                                                                                        symptomsList += `<li>${i18n.t(`symptoms.${symptom}`)}</li>`;
                                                                                    })
                                                                                }
                                                                                html += `
                                                                                    <li> ${i18n.t('home.yourSymptoms')}${!symptomsRecorded ? ', ' + i18n.t('analysis.trends.export.notLogged') : ''}
                                                                                        ${
                                                                                            symptomsRecorded ?
                                                                                            `<ul>` + symptomsList + '</ul>'
                                                                                            :
                                                                                            ''
                                                                                        }
                                                                                    </li>
                                                                                `;

                                                                                // Add discharge
                                                                                html += `
                                                                                    <li> ${periodDay.discharge ? i18n.t(`discharge.${periodDay.discharge}`) : i18n.t('discharge.discharge') + ' ' + i18n.t('analysis.trends.export.notLogged')}</li>
                                                                                `;

                                                                                html += '</ul>';
                                                                            })
                                                                        })
                                                                        return html;
                                                                    }
                                                                )()
                                                            }
                                                        </body>
                                                        </html>
                                                    `;

                                                    const sendEmail = async (html) => {
                                                        try {
                                                            const { uri } = await Print.printToFileAsync({ html });

                                                            const options = {
                                                                subject: "My Period Data",
                                                                recipients: [userObj.email],
                                                                body: "",
                                                                attachments: [uri]
                                                            }
    
                                                            const resp = await MailComposer.composeAsync(options);
                                                            if (resp.status !== "sent") {
                                                                throw new Error("Email request failed")
                                                            }
                                                        }
                                                        catch (error) {
                                                            Toast.show({
                                                                type: "error",
                                                                position: "top",
                                                                text1: i18n.t('errors.emailFailedToSend'),
                                                                visibilityTime: 3000,
                                                                autoHide: true,
                                                            });
                                                            console.log(`[PeriodCalendarScreen] email failed to send ${error}`)
                                                        }
                                                    };

                                                    setExportButtonColor("#5B9F8F");
                                                    sendEmail(htmlContent).then((resp) => {
                                                        setExportSuccessful(true);
                                                        setTimeout(() => {
                                                            setExportButtonColor("#00394E");
                                                            setExportSuccessful(false);
                                                            setExportModalVisible(false);
                                                        }, 1000)
                                                    }).catch(error => { console.log(`[PeriodCalendarScreen] email failed to send ${error}`) });
                                                }}
                                            >
                                                <View 
                                                    className="flex-row rounded-[50px] justify-center items-center mt-4 py-4 px-6"
                                                    style={{ backgroundColor: exportButtonColor }}
                                                >
                                                    {
                                                        exportSuccessful
                                                        &&
                                                        <View className="mr-3">
                                                            <ExportCheckIcon width={25} height={25} />
                                                        </View>
                                                    }
                                                    <View className="justify-center items-center h-[25px]">
                                                        <Text className="text-offwhite text-[16px]">
                                                            {exportSuccessful ? i18n.t('analysis.trends.export.exportedSuccessfully') : i18n.t('analysis.trends.export.export')}
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

                    {/* Ovulation Modal */}
                    <Modal
                        animationIn={"slideInUp"}
                        animationOut={"slideOutUp"}
                        animationTiming={500}
                        backdropOpacity={0.5}
                        isVisible={ovulationModalVisible}
                        onBackdropPress={() => {
                            setOvulationModalVisible(!ovulationModalVisible);
                        }}
                        onRequestClose={() => {
                            setOvulationModalVisible(!ovulationModalVisible);
                        }}
                        className="mx-2"
                    >
                        <View className="flex flex-col bg-offwhite items-center rounded-[20px] border-[3px] border-seafoam py-4 px-4">
                            {/* Header */}
                            <View className="flex-row mb-3 items-center">
                                <Text className="text-greydark text-[22px] font-bold flex-grow">
                                    {i18n.t('analysis.ovulation.ovulationInfo')}
                                </Text>
                                <TouchableOpacity 
                                    className="self-end"
                                    onPress={() => {
                                        setOvulationModalVisible(!ovulationModalVisible);
                                    }}
                                >
                                    <XIcon width={30} height={30} />
                                </TouchableOpacity>
                            </View>
                            {/* Body */}
                            <View className="flex-row w-full mt-[-30px]">
                                <Image
                                    source={require('../assets/ovulation.jpg')}
                                    resizeMode="contain"
                                    className="w-full aspect-square"
                                />
                            </View>
                            <View className="flex-row">
                                <Text className="flex-grow text-[16px] mt-[-20px]">
                                    {i18n.t('analysis.ovulation.infoText')}
                                </Text>
                            </View>
                        </View>
                    </Modal>
                </View>
            </View>
        </SafeAreaView>
    );
}

export default PeriodCalendarScreen;
import React, {useCallback, useContext, useEffect, useState} from 'react';
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
    const [date, setDate]                       = useState(new Date());

    // either "month" (default), "week", or "day"
    const [dayWeekMonthSelector, setDayWeekMonthSelector]     = useState("month");
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
        setDate(new Date());
        setRefreshing(false);
    }, []);

    // Helpers
    const daysInThisMonth = () => {
        let now = new Date();
        return new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    }

    // For Calendar
    

    const renderCalendar = () => {
        let dots = []
        // for (let i = 0; i < 3; i++) {
        for (let i = 0; i < 2; i++) {
            dots.push(
                <TouchableOpacity
                        className="w-20 h-20 rounded-full flex justify-center items-center bg-offwhite"
                        onPress={() => console.log('Pressed!')}
                        underlayColor="#FFFFFF"
                    >
                        <Text>test</Text> 
                    </TouchableOpacity>
            )
        }
        return dots
    }
        
    return (
        <SafeAreaView className="flex-1 bg-offwhite">
            <ScrollView className="p-[35px]">
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
                                }
                            }}
                            underlayColor="#5B9F8F"
                        >
                            <Text className="text-[10px] font-normal text-offwhite">
                                D
                            </Text>
                        </TouchableHighlight>

                        <TouchableHighlight
                            className={`flex-1 rounded-[7px] items-center pt-1 pb-1 ${dayWeekMonthSelector == "week" ? "bg-seafoam" : "bg-teal"}`}
                            onPressIn={() => {
                                console.log('Selected Week!');
                                if (!(dayWeekMonthSelector == "week")) {
                                    setDayWeekMonthSelector("week");
                                }
                            }}
                            underlayColor="#5B9F8F"
                        >
                            <Text className="text-[10px] font-normal text-offwhite">
                                W
                            </Text>
                        </TouchableHighlight>
                        
                        <TouchableHighlight
                            className={`flex-1 rounded-[7px] items-center pt-1 pb-1 ${dayWeekMonthSelector == "month" ? "bg-seafoam" : "bg-teal"}`}
                            onPressIn={() => {
                                console.log('Selected Month!');
                                if (!(dayWeekMonthSelector == "month")) {
                                    setDayWeekMonthSelector("month");
                                }
                            }}
                            underlayColor="#5B9F8F"
                        >
                            <Text className="text-[10px] font-normal text-offwhite">
                                M
                            </Text>    
                        </TouchableHighlight>
                    </View>

                    {/* Calendar */}


            </ScrollView>
        </SafeAreaView>
    );
}

export default PeriodCalendarScreen;
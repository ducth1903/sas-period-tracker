import React, {useCallback, useContext, useEffect, useState} from 'react';
import { 
    StyleSheet, 
    Text, 
    View, 
    SafeAreaView, 
    Pressable, 
    Animated, 
    Dimensions,
    RefreshControl, 
    ScrollView,
    TouchableOpacity,
    Alert,
    StatusBar
} from 'react-native';
import { Divider, Snackbar, Switch } from 'react-native-paper';
import Accordion from 'react-native-collapsible/Accordion';

// https://github.com/wix/react-native-calendars
import { Calendar, CalendarList } from 'react-native-calendars';
import { FontAwesome, Ionicons, AntDesign, Entypo } from '@expo/vector-icons';

import { AuthContext } from '../navigation/AuthProvider'; 
import CalendarCard from '../components/CalendarCard';
import Modal from 'react-native-modal';
// import ScalingDot from '../components/ScalingDot';
// import { Checkbox } from 'react-native-paper';
// import BouncyCheckbox from "react-native-bouncy-checkbox";
import PeriodDate, { MODAL_TEMPLATE, formatDate } from '../models/PeriodDate';
import PeriodSymptomCard from '../components/PeriodSymptomCard';
import FormButton from '../components/FormButton';
import Dropdown from '../components/Dropdown';

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

// Global variables
var userPeriods = [];
var currPeriodDate = null;
var tmpSymptomSetting = new Set();      // a copy of symptomSetting set

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

    // ---------------------
    // For Calendar
    // ---------------------
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

    // ---------------------
    // For Collapsible History
    // ---------------------
    const [activeSections, setActiveSections] = useState([]);

    async function fetchUserData() {
        await fetch(`${API_URL}/api/user/${userId}`, { method: "GET" })
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
        
        await fetch(`${API_URL}/api/period/${userId}/${currDateFormat}`, { method: "GET" })
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
        await fetch(`${API_URL}/api/period/${userId}/lastPeriod`, { method: "GET" })
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
        await fetch(`${API_URL}/api/period/${userId}`, { method: "GET" })
        .then(resp => resp.json())
        .then(data => {
            setFetchedHistory(data);
        })
        .catch(error => {console.log(error)})
    }

    async function updateUserSymptomTracking(inSymp) {
        await fetch(`${API_URL}/api/user/${userId}`, {
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
    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        fetchPeriodData();
        fetchLastPeriod();
        fetchUserData();
        setRefreshing(false);
    }, []);

    // Press on a date
    const updateNewMarkedDate = (newDateString) => {
        // 'day' is an object but day.dateString() = newDateString = 'YYYY-MM-DD'
        setLastMarkDate(newDateString);
        userPeriods = [];
        if (newDateString in fetchedData) {
            currPeriodDate = fetchedData[newDateString];
        } else {
            currPeriodDate = new PeriodDate(newDateString);
        }
        setModalVisible(true);
    }

    // Long pressed on a date
    const removeMarkedDate = (inDateString) => {
        if (inDateString in markedDates) {
            // If already exists, remove the date
            // Need to ask backend DB to remove it too
            deleteUserPeriodDates(inDateString);
            
            // delete markedDates[inDateString];
            // setMarkedDates(
            //     Object.assign({}, markedDates, {})      // shallow clone
            // )
        }
    }
    
    // ---------------------
    // For Modal
    // ---------------------
    const scrollX = React.useRef(new Animated.Value(0)).current;
    const keyExtractor = React.useCallback((_, index) => index.toString(), []);
    // let flatListRef = React.useRef(null);
    const renderModalItem = useCallback(({item}) => {
        return (
            <View style={styles.modalItemView}>
                <View style={{flex: 1, flexDirection: 'row'}}>
                    <View style={[styles.wrapperTitleStyle, {backgroundColor: `${item.titleColor}`, borderRadius: 15}]}>
                        <Text style={styles.titleStyle}>{item.title}</Text>
                    </View>
                    <View style={styles.wrapperInfoButton}>
                        <Pressable
                        onPress={()=>{ 
                            setModalInfo(item['description'])
                            setModalInfoVisible(true)
                        }}>
                            <Ionicons name="information-circle-outline" size={24} color="black" />
                        </Pressable>
                    </View>
                </View>
                <PeriodSymptomCard inData={item} periodDateObject={currPeriodDate} />
            </View>
        )
    }, []);

    const modalItemSubmitPressed = async () => {
        setSnackBarText("Submitting your data...");
        setSnackBarVisible(true);

        userPeriods.push(currPeriodDate);
        await postUserPeriodDates(userPeriods);

        setSnackBarVisible(false);
        setModalVisible(!modalVisible);
        setSnackBarText("");
    }

    const postUserPeriodDates = async(inUserPeriods) => {
        try {
            await fetch(`${API_URL}/api/period/${userId}`, { 
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(inUserPeriods)
            })
            .then(resp => resp.json())
            .then(data => {
                if (data['status_code']==200) {
                    fetchPeriodData();
                    fetchLastPeriod();
                }
            })
            .catch(error => {console.log(error)})
        } catch(e) {
            console.log('[PeriodCalendarScreen] postUserPeriodDates():', e)
        }
    }

    const deleteUserPeriodDates = async(inDateString) => {        
        try {
            inDateString = inDateString.split('-').join('/');
            await fetch(`${API_URL}/api/period/${userId}/${inDateString}`, { method: "DELETE" })
            .then(resp => resp.json())
            .then(data => {
                if (data['status_code']==200) {
                    fetchPeriodData();
                    fetchLastPeriod();
                }
            })
            .catch(error => {console.log(error)})
        } catch(e) {
            console.log('[PeriodCalendarScreen] deleteUserPeriodDates():', e)
        }
    }

    // ---------------------
    // Modal - Period History
    // ---------------------
    const renderModalHistory = ({item, index}) => {
        let tmp = new MODAL_TEMPLATE();
        return (
            <View style={styles.historyItemWrapper}>
                <Divider style={{marginBottom: 10}} inset={false}/>
                <Text style={styles.historyText}>{item['dateStr']}</Text>
                { Object.entries(item['symptoms']).map((ele, ele_index) => {
                    let [curr_title_idx, curr_title] = tmp.getTitleFromKey(ele[0]);
                    let curr_symptoms = [];
                    for (let i=0; i<ele[1].length; i++) {
                        curr_symptoms.push(
                            tmp.getSymptomFromKey(ele[1][i], curr_title_idx)
                        )
                    }
                    return (
                        <Text key={ele_index}>{curr_title}: {curr_symptoms.join(', ')}</Text>
                    )
                }) }
            </View>
        )
    };

    // ---------------------
    // For History Email
    // ---------------------
    const [toEmail, setToEmail] = useState("");
    const [emailMonthYear, setEmailMonthYear] = useState("YYYY-MM");
    const postSendEmailHistory = async(toEmail, emailMonthYear) => {
        try {
            await fetch(`${API_URL}/api/period/${userId}/email`, { 
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    "toEmail"           : toEmail,
                    "emailMonthYear"    : emailMonthYear,
                })
            })
            .then(resp => resp.json())
            .then(data => {
                
            })
            .catch(error => {console.log(error)})
        } catch(e) {
            console.log('[PeriodCalendarScreen] postSendEmailHistory():', e)
        }
    }

    // ---------------------
    // Main
    // ---------------------
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
            refreshControl={ <RefreshControl refreshing={refreshing} onRefresh={onRefresh}/> }
            contentContainerStyle={styles.scrollViewStyle}
            >
                <View style={{flex:1, flexDirection: 'row', justifyContent:'flex-end', alignItems: 'flex-end'}}>
                    <TouchableOpacity 
                    style={{marginRight: '5%', marginTop: '5%'}}
                    onPress={()=>{
                        setStatusBarHidden(!statusBarHidden)
                        setmodalVisibleScrollCal(!modalVisibleScrollCal)
                    }}>
                        <FontAwesome name="calendar" size={24} color="black" />
                    </TouchableOpacity>
                    <TouchableOpacity
                    style={{marginRight: '5%', marginTop: '5%'}}
                    onPress={()=>{
                        setStatusBarHidden(!statusBarHidden)
                        setModalSetting(!modalSetting)
                        
                        // Update symptomSettingArray based on symptomSetting set
                        let tmp = [];
                        modal_default_template.getKeys().map((ele) => {
                            if (symptomSetting.has(ele)) {
                                tmp.push(true)
                            } else {
                                tmp.push(false)
                            }
                        })
                        setSymptomSettingArray(tmp)
                        tmpSymptomSetting = new Set(symptomSetting)
                    }}>
                        <Entypo name="dots-three-vertical" size={24} color="black" />
                    </TouchableOpacity>

                    {/* Modal for symptom settings */}
                    <Modal
                        animationIn="slideInLeft"
                        animationOut="slideOutRight"
                        transparent={false}
                        isVisible={modalSetting}
                        onRequestClose={() => {
                            setModalSetting(!modalSetting);
                        }}
                        statusBarTranslucent={true}
                        style={{margin: 0, backgroundColor: 'white'}}
                    >
                        <SafeAreaView style={{flex: 1}}>
                            <View style={{flex: 1}}/>
                            <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-start', paddingLeft: '4%'}}>
                                <View style={{flex: 1}}>
                                    <TouchableOpacity onPress={() => {
                                        setModalSetting(!modalSetting);
                                    }}>
                                        <AntDesign name="closecircleo" size={24} color="black" />
                                    </TouchableOpacity>
                                </View>
                                <View style={{flex: 2}}>
                                    <Text style={{marginBottom: 15, textAlign: "center", fontSize: 20, fontWeight: "bold"}}>
                                        Tracking Symptoms
                                    </Text>
                                </View>
                                <View style={{flex: 1}}/>
                            </View>
                            <View style={{flex: 8}}>
                                {modal_default_template.getKeys().map((ele, index) => {
                                    return (
                                        <View style={styles.symptomSettingRowWrapper} key={index}>
                                            <View>
                                                <Text>{modal_default_template.getTitleFromKey(ele)[1]}</Text>
                                            </View>
                                            <Switch 
                                            // value={symptomSetting.has(ele) ? true : false} 
                                            value={symptomSettingArray[index]}
                                            color={'skyblue'}
                                            onValueChange={()=>{
                                                let newVal = false;
                                                if(tmpSymptomSetting.has(ele)) {
                                                    // setSymptomSetting(() => {
                                                    //     symptomSetting.delete(ele)
                                                    //     return symptomSetting
                                                    // })
                                                    tmpSymptomSetting.delete(ele)
                                                    newVal = false
                                                } else {
                                                    // setSymptomSetting((currSetting) => {
                                                    //     let newSet = currSetting.add(ele)
                                                    //     return newSet
                                                    // })
                                                    tmpSymptomSetting = tmpSymptomSetting.add(ele)
                                                    newVal = true
                                                }

                                                let tmpArr = [...symptomSettingArray];       // shallow copy array
                                                tmpArr[index] = newVal;
                                                setSymptomSettingArray(tmpArr);
                                            }} />
                                        </View>
                                    )
                                })}
                            </View>
                            <View style={{flex: 1}}>
                                <FormButton
                                btnTitle="Update"
                                isHighlight={true}
                                onPress={() => {
                                    if (symptomSetting.size !== tmpSymptomSetting.size) {
                                        updateUserSymptomTracking(tmpSymptomSetting);
                                        setSymptomSetting(tmpSymptomSetting);
                                        setModalSetting(!modalSetting);
                                    }
                                }}
                                />
                            </View>
                        </SafeAreaView>
                    </Modal>
                </View>
                <View style={styles.calendarContainer}>
                    {/* Modal for symptoms */}
                    <Modal
                        animationIn="slideInLeft"
                        animationOut="slideOutRight"
                        transparent={false}
                        isVisible={modalVisible}
                        onRequestClose={() => {
                            setModalVisible(!modalVisible);
                        }}
                        statusBarTranslucent={true}
                        style={{margin: 0, backgroundColor: '#ADCDFF'}}
                    >
                        {/* Modal for info */}
                        <Modal
                            animationIn="slideInLeft"
                            animationOut="slideOutRight"
                            transparent={true}
                            isVisible={modalInfoVisible}
                            onRequestClose={() => {
                                setModalInfoVisible(!modalInfoVisible);
                            }}
                            statusBarTranslucent={true}
                            style={{marginLeft: MODAL_MARGIN, marginRight: MODAL_MARGIN}}
                        >
                            <SafeAreaView style={{flex: 1}}>
                                <View style={styles.modalCenteredView}>
                                    <View style={styles.modalView}>
                                        <Text style={{marginBottom: '10%'}}>{modalInfo}</Text>
                                        <Pressable
                                        style={[styles.button, styles.buttonClose]}
                                        onPress={() => setModalInfoVisible(!modalInfoVisible)}
                                        >
                                            <Text style={styles.textStyle}>Hide</Text>
                                        </Pressable>
                                    </View>
                                </View>
                            </SafeAreaView>
                        </Modal>
                        {/* End modal for info */}

                        <SafeAreaView style={{flex: 1}}>
                            <View style={{flex: 1}}/>
                            <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-start', paddingLeft: '4%'}}>
                                <View style={{flex: 1}}>
                                    <TouchableOpacity onPress={() => {
                                        setModalVisible(!modalVisible)
                                    }}>
                                        <AntDesign name="closecircleo" size={24} color="black" />
                                    </TouchableOpacity>
                                </View>
                                <View style={{flex: 2}}>
                                    <Text style={{marginBottom: 15, textAlign: "center", fontSize: 25, fontWeight: "bold"}}>
                                        {lastMarkedDate}
                                    </Text>
                                </View>
                                <View style={{flex: 1}}/>
                            </View>

                            <View style={{flex: 8, backgroundColor: '#ADCDFF'}}>
                            {lastMarkedDate in fetchedData ? 
                            <Animated.FlatList
                            data={fetchedData[lastMarkedDate].renderSymptom(symptomSetting)}
                            renderItem={renderModalItem}
                            keyExtractor={keyExtractor}
                            // pagingEnabled
                            horizontal={false}
                            showsHorizontalScrollIndicator={false}
                            decelerationRate={'normal'}
                            scrollEventThrottle={16}
                            onScroll={Animated.event(
                                [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                                {
                                useNativeDriver: false,
                                }
                            )}
                            />
                            :
                            <Animated.FlatList
                            // ref={flatListRef}
                            // onViewableItemsChanged={onViewRef.current}
                            // data={modal_default_template.default_template}
                            data={modal_default_template.getDefaultTemplate(symptomSetting)}
                            renderItem={renderModalItem}
                            keyExtractor={keyExtractor}
                            // pagingEnabled
                            horizontal={false}
                            showsHorizontalScrollIndicator={false}
                            decelerationRate={'normal'}
                            scrollEventThrottle={16}
                            onScroll={Animated.event(
                                [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                                {
                                useNativeDriver: false,
                                }
                            )}
                            />
                            }
                            </View>

                            <View style={{flex: 1, margin: '2%'}}>
                                {snackBarVisible ? 
                                <Snackbar
                                visible={snackBarVisible}
                                onDismiss={() => {setSnackBarVisible(false)}}
                                duration={Infinity}
                                style={{backgroundColor: '#F3692B'}}
                                >
                                    <Text style={styles.titleStyle}>{snackBarText}</Text>
                                </Snackbar>
                                :
                                <FormButton
                                btnTitle="Submit"
                                isHighlight={true}
                                onPress={modalItemSubmitPressed}
                                />
                                }
                            </View>
                        </SafeAreaView>
                    </Modal>
                    {/* End modal for symptoms */}
                    
                    <Calendar
                        style={styles.calendar}
                        theme={{
                            // backgroundColor: 'red',
                            calendarBackground: '#FFDA64',
                            textSectionTitleColor: '#183A1D',
                            textSectionTitleDisabledColor: '#F6F6F6',
                            selectedDayBackgroundColor: '#F56A37',
                            selectedDayTextColor: '#183A1D',
                            todayTextColor: '#00adf5',
                            dayTextColor: '#183A1D',
                            textDisabledColor: '#999999',
                            dotColor: '#00adf5',
                            // selectedDotColor: 'red',
                            arrowColor: '#F56A37',
                            disabledArrowColor: '#d9e1e8',
                            monthTextColor: '#183A1D',
                            // indicatorColor: '#F56A37',
                            // textDayFontFamily: 'monospace',
                            // textMonthFontFamily: 'monospace',
                            // textDayHeaderFontFamily: 'monospace',
                            textDayFontWeight: 'bold',
                            textMonthFontWeight: 'bold',
                            textDayHeaderFontWeight: 'bold',
                            textDayFontSize: 16,
                            textMonthFontSize: 16,
                            textDayHeaderFontSize: 16
                        }}

                        // Enable the option to swipe between months. Default = false
                        enableSwipeMonths={true}

                        onDayPress={(day) => updateNewMarkedDate(day.dateString)}
                        onDayLongPress={(day) => {
                            if (day.dateString in fetchedData) {
                                Alert.alert(
                                    "Remove this date",
                                    "Are you sure to proceed?",
                                    [
                                        {text: "Cancel", style: "cancel"}, 
                                        {text: "OK", onPress: () => removeMarkedDate(day.dateString) }
                                    ]
                                )
                            }
                        }}
                        onMonthChange={(month) => { 
                            setCurrDateObject( new Date(month.dateString) )
                            // this will trigger useEffect(), which will trigger fetchPeriodData()
                        }}

                        markedDates={ markedDates }
                        // Date marking style [simple/period/multi-dot/custom]. Default = 'simple'
                        // markingType={'period'}
                        markingType={'custom'}
                    />

                    {/* Modal for Scrollable Calendar */}
                    <Modal
                        animationIn="slideInLeft"
                        animationOut="slideOutRight"
                        transparent={false}
                        isVisible={modalVisibleScrollCal}
                        onRequestClose={() => {
                            setModalVisible(!modalVisibleScrollCal);
                        }}
                        statusBarTranslucent={true}
                        style={{margin: 0, backgroundColor: "white"}}
                    >
                        <SafeAreaView style={{flex: 1}}>
                            {/* <StatusBar
                            animated={true}
                            backgroundColor="#61dafb"
                            hidden={statusBarHidden} /> */}
                            <View style={{flex:1, flexDirection: 'column', justifyContent: 'flex-end', paddingLeft: '4%'}}>
                                <TouchableOpacity onPress={()=>{setmodalVisibleScrollCal(!modalVisibleScrollCal)}}>
                                <AntDesign name="closecircleo" size={30} color="black" />
                                </TouchableOpacity>
                            </View>
                            <View style={{flex: 8}}>
                                <CalendarList
                                onVisibleMonthsChange={(months) => {console.log('now these months are visible');}}
                                // Max amount of months allowed to scroll to the past. Up to -4 years
                                pastScrollRange={50}
                                // Max amount of months allowed to scroll to the future. Up to +4 years
                                futureScrollRange={50}
                                scrollEnabled={true}
                                showScrollIndicator={false} 
                                
                                // When true, the calendar list scrolls to top when the status bar is tapped
                                scrollsToTop={ true }   
                                markedDates={ markedDates }
                                markingType={'custom'}
                                onDayPress={(day) => updateNewMarkedDate(day.dateString)}
                                />
                            </View>
                        </SafeAreaView>
                    </Modal>
                </View>
                <View style={[{flex: 1}, styles.card]}>
                    <CalendarCard leftContent={lastPeriod} rightContent='Days since your last period'/>
                    {/* <CalendarCard leftContent='14' rightContent='Days until your next ovulation'/> */}
                </View>
                <View style={{flex: 1}}>
                    <View style={{flex:1, flexDirection: 'row'}}>
                        <View style={{flex: 1}}/>
                        <View style={{flex: 2}}>
                            <FormButton
                            btnTitle="Period History"
                            isHighlight={true}
                            onPress={()=>{
                                fetchPeriodHistory();
                                setModalHistory(true);
                            }}
                            />
                        </View>
                        <View style={{flex: 1}}/>
                    </View>

                    {/* Modal for Period History */}
                    <Modal
                    animationIn="slideInLeft"
                    animationOut="slideOutRight"
                    transparent={false}
                    isVisible={modalHistory}
                    onRequestClose={() => {
                        setModalHistory(!modalHistory);
                    }}
                    statusBarTranslucent={true}
                    style={{margin: 0, backgroundColor: "white"}}
                    >
                        <SafeAreaView style={{flex: 1, backgroundColor: '#ADCDFF'}}>
                            <View style={{flex: 1}}/>
                            <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-start', paddingLeft: '4%'}}>
                                <View style={{flex: 1}}>
                                </View>
                                <View style={{flex: 3}}>
                                    <Text style={{marginBottom: 15, textAlign: "center", fontSize: 22, fontWeight: "bold"}}>
                                        Your Period History
                                    </Text>
                                </View>
                                <View style={{flex: 1}}/>
                            </View>

                            <View style={{flex: 10}}>
                                <View style={styles.historyView}>
                                    {/* <Animated.FlatList
                                    data={fetchedHistory}
                                    renderItem={renderModalHistory}
                                    keyExtractor={keyExtractor}
                                    // pagingEnabled
                                    horizontal={false}
                                    showsHorizontalScrollIndicator={false}
                                    decelerationRate={'normal'}
                                    scrollEventThrottle={16}
                                    onScroll={Animated.event(
                                        [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                                        {useNativeDriver: false}
                                    )}
                                    /> */}
                                    <Accordion
                                    sections={fetchedHistory}
                                    activeSections={activeSections}
                                    renderSectionTitle={() => {}}
                                    renderHeader={(content, index, isActive)=>{
                                        return (
                                            <View 
                                            style={[
                                                isActive ? styles.historyHeaderWrapperActive : styles.historyHeaderWrapperInactive, 
                                                {flexDirection: 'row', justifyContent: 'space-between'}
                                            ]}>
                                                <View>
                                                    <Text style={styles.historyHeaderText}>{content['year_month']}</Text>
                                                </View>
                                                <View>
                                                    {isActive ? 
                                                    <AntDesign name="upcircleo" size={24} color="black" />
                                                    :
                                                    <AntDesign name="downcircleo" size={24} color="black" />
                                                    }
                                                </View>
                                            </View>
                                        )
                                    }}
                                    renderContent={(content, index, isActive) => {
                                        return (
                                            <View style={styles.historyContentView}>
                                                <Animated.FlatList
                                                data={content['details']}
                                                renderItem={renderModalHistory}
                                                keyExtractor={keyExtractor}
                                                horizontal={false}
                                                showsHorizontalScrollIndicator={false}
                                                decelerationRate={'normal'}
                                                scrollEventThrottle={16}
                                                onScroll={Animated.event(
                                                    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                                                    {useNativeDriver: false}
                                                )}
                                                />
                                            </View>
                                        )
                                    }}
                                    onChange={(activeSections) => {
                                        setActiveSections(activeSections)
                                    }}
                                    renderAsFlatList={true}     // to make it scrollable
                                    underlayColor=''
                                    />
                                </View>
                            </View>
                            <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                                <View style={{flex: 3, marginLeft: 10}}>
                                    <FormButton
                                    btnTitle="Email PDF"
                                    isHighlight={true}
                                    onPress={()=>{setModalEmailHistory(true)}}
                                    />

                                    {/* Modal for Email PDF History */}
                                    <Modal
                                        animationIn="slideInLeft"
                                        animationOut="slideOutRight"
                                        transparent={false}
                                        isVisible={modalEmailHistory}
                                        onRequestClose={() => {
                                            setModalEmailHistory(!modalEmailHistory);
                                        }}
                                        statusBarTranslucent={true}
                                        style={{margin: 0, backgroundColor: "white"}}
                                    >
                                        <SafeAreaView style={{flex: 1, backgroundColor: '#ADCDFF'}}>
                                            <View style={{flex: 1}}/>
                                            <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-start', paddingLeft: '4%'}}>
                                                <View style={{flex: 1}}>
                                                    <TouchableOpacity onPress={() => {
                                                        setModalEmailHistory(!modalEmailHistory);
                                                    }}>
                                                        <AntDesign name="closecircleo" size={24} color="black" />
                                                    </TouchableOpacity>
                                                </View>
                                                <View style={{flex: 3}}>
                                                    <Text style={{marginBottom: 15, textAlign: "center", fontSize: 22, fontWeight: "bold"}}>
                                                        Email PDF
                                                    </Text>
                                                </View>
                                                <View style={{flex: 1}}/>
                                            </View>
                                            <View style={{flex:8}}>
                                                <FormInput
                                                labelValue="Email"
                                                placeholderText="Emails separated by newline"
                                                value={toEmail}
                                                onChangeText={(inEmail)=>{setToEmail(inEmail)}} 
                                                multiline
                                                />
                                                <Dropdown
                                                inValues={getKeyFromPeriodHistory()}
                                                onSelect={setEmailMonthYear}
                                                />
                                                <FormButton
                                                btnTitle="Email PDF"
                                                isHighlight={true}
                                                onPress={()=>{
                                                    // Snack bar
                                                    setSnackBarText("Sending email...")
                                                    setSnackBarVisible(true);

                                                    let email_list = toEmail.split("\n")
                                                    email_list = email_list.map((ele) => ele.trim())
                                                    postSendEmailHistory(email_list, emailMonthYear)

                                                    setSnackBarVisible(false);
                                                    setModalEmailHistory(!modalEmailHistory);
                                                    setModalHistory(!modalHistory);
                                                    setSnackBarText("");
                                                }}
                                                />
                                            </View>
                                            <View style={{flex: 1}}>
                                            <Snackbar
                                            visible={snackBarVisible}
                                            onDismiss={() => {setSnackBarVisible(false)}}
                                            duration={Infinity}
                                            style={{backgroundColor: '#F3692B'}}
                                            >
                                                <Text style={styles.titleStyle}>{snackBarText}</Text>
                                            </Snackbar>
                                            </View>
                                        </SafeAreaView>
                                    </Modal>
                                </View>
                                <View style={{flex: 1}}/>
                                <View style={{flex: 1, alignSelf: 'center'}}>
                                    <TouchableOpacity onPress={()=>{setModalHistory(!modalHistory)}}>
                                        <Ionicons name="chevron-back-circle-outline" size={38} color="black" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={{flex: 1}}/>
                        </SafeAreaView>
                    </Modal>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    scrollViewStyle: {
        flex: 1,
    },
    container: {
        flex: 1,
        // alignItems: 'center',
        // justifyContent: 'center',
        backgroundColor: '#ffffff',
    },
    calendarContainer: {
        flex: 3,
        margin: '3%',
        padding: '3%',
        backgroundColor: '#FFDA64',
        borderRadius: 20
    },
    calendar: {
        // borderWidth: 1,
        // borderColor: 'gray',
        // height: 350,
        // flex:1,
        // backgroundColor: "#F56A37",
    },
    modalCenteredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "stretch",
    },
    modalView: {
        backgroundColor: "white",
        borderRadius: 20,
        padding: MODAL_PADDING,
        margin: 0,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    modalItemView: {
        flex: 1,
        margin: 10,
        backgroundColor: 'white',
        // borderColor: 'black',
        // borderWidth: 2,
        borderRadius: 25,
    },

    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2
    },
    buttonOpen: {
        backgroundColor: "#F194FF",
    },
    buttonClose: {
        backgroundColor: "#2196F3",
    },
    wrapperTitleStyle: {
        alignSelf: 'flex-start',
        marginTop: 10,
        marginLeft: 20,
        padding: 10,
    },
    titleStyle: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
        textAlign: "center"
    },
    wrapperInfoButton: {
        flex: 1, 
        flexDirection: 'row-reverse', 
        alignSelf: 'center', 
        marginLeft: '4%',
    },
    card: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-evenly',
    },
    historyView: {
        margin: 5,
        padding: 5,
    },
    historyItemWrapper: {
        flex: 1, 
        padding: 20
    },
    historyHeaderWrapperActive: {
        flex: 1, 
        margin: 10,
        marginBottom: 0,
        padding: 20,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        backgroundColor: 'white'
    },
    historyHeaderWrapperInactive: {
        flex: 1, 
        margin: 10,
        padding: 20,
        borderRadius: 15,
        backgroundColor: 'white'
    },
    historyHeaderText: {
        fontWeight: 'bold',
        fontSize: 20,
    },
    historyText: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    historyContentView: {
        flex: 1, 
        marginTop: 0,
        margin: 10,
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15,
        backgroundColor: 'white'
    },
    symptomSettingRowWrapper: {
        flexDirection: 'row', 
        justifyContent:'space-between', 
        alignItems: 'center', 
        paddingHorizontal: '20%',
        paddingVertical: '2%'
    }
})

export default PeriodCalendarScreen;
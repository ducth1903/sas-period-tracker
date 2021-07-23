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

// https://github.com/wix/react-native-calendars
import { Calendar, CalendarList } from 'react-native-calendars';
import { Entypo, FontAwesome } from '@expo/vector-icons';

import { AuthContext } from '../navigation/AuthProvider'; 
import CalendarCard from '../components/CalendarCard';
import Modal from 'react-native-modal';
import ScalingDot from '../components/ScalingDot';
// import { Checkbox } from 'react-native-paper';
import BouncyCheckbox from "react-native-bouncy-checkbox";
import PeriodDate, { MODAL_TEMPLATE, formatDate } from '../models/PeriodDate';

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

var userPeriods = [];
var currPeriodDate = null;

const PeriodCalendarScreen = ({ props }) => {
    const { userId }                            = useContext(AuthContext);
    const [modalVisible, setModalVisible]       = useState(false);
    const [modalVisible_2, setModalVisible_2]   = useState(false);
    const [statusBarHidden, setStatusBarHidden] = useState(false);
    const [refreshing, setRefreshing]           = useState(false);
    const [todayDate, setTodayDate]             = useState(new Date());

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
    const [currDateObject, setCurrDateObject] = useState(new Date());
    const [lastMarkedDate, setLastMarkDate]   = useState(null);

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

    useEffect(() => {
        console.log('[PeriodCalendarScreen] useEffect()')
        fetchPeriodData();
    }, [currDateObject]);

    // Pull down to refresh
    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        fetchPeriodData();
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
            <View style={[styles.modalItemView]}>
                <Text style={{fontSize: 20, fontWeight: 'bold'}}>{item.title}</Text>
                { item['availableOptions'].map( (ele, index) => {
                    return (
                    <View key={index} style={{flexDirection: 'row'}}>
                        <BouncyCheckbox
                        size={25}
                        fillColor="red"
                        unfillColor="#FFFFFF"
                        iconStyle={{ borderColor: "red" }}
                        isChecked={item['isChecked'][index]}
                        onPress={(isChecked) => {
                            currPeriodDate.setSymptom(
                                item['key'],
                                item['availableOptions_id'][index], 
                                isChecked
                            )
                        }}
                        />
                        <Text>{ele}</Text>
                    </View>
                )})}
            </View>
        )
    }, []);

    const modalItemSubmitPressed = async () => {
        userPeriods.push(currPeriodDate);
        await postUserPeriodDates(userPeriods);
        setModalVisible(!modalVisible);
        
        // if (!(lastMarkedDate in markedDates)) {
        //     // if not exists, add the date
        //     let newMarkedDate = {};
        //     newMarkedDate[lastMarkedDate] = {
        //         customStyles: markedDateStyle
        //     }
        //     setMarkedDates(
        //         Object.assign({}, markedDates, newMarkedDate)
        //     )
        // }
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
                }
            })
            .catch(error => {console.log(error)})
        } catch(e) {
            console.log('[PeriodCalendarScreen] postUserPeriodDates():', e)
        }
    }

    const deleteUserPeriodDates = async(inDateString) => {        
        try {
            await fetch(`${API_URL}/api/period/${userId}/${inDateString}`, { method: "DELETE" })
            .then(resp => resp.json())
            .then(data => {
                if (data['status_code']==200) {
                    fetchPeriodData();
                }
            })
            .catch(error => {console.log(error)})
        } catch(e) {
            console.log('[PeriodCalendarScreen] deleteUserPeriodDates():', e)
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
                <View style={{flex:1, justifyContent: 'space-around', alignItems: 'flex-end'}}>
                    <TouchableOpacity onPress={()=>{
                        setStatusBarHidden(!statusBarHidden)
                        setModalVisible_2(!modalVisible_2)
                    }}>
                        <FontAwesome name="calendar" size={24} color="black" />
                    </TouchableOpacity>
                </View>
                <View style={styles.calendarContainer}>
                    <Modal
                        animationIn="slideInLeft"
                        animationOut="slideOutRight"
                        transparent={true}
                        isVisible={modalVisible}
                        onRequestClose={() => {
                            setModalVisible(!modalVisible);
                        }}
                        statusBarTranslucent={true}
                        style={{marginLeft: MODAL_MARGIN, marginRight: MODAL_MARGIN}}
                    >
                        <View style={styles.modalCenteredView}>
                            <View style={styles.modalView}>
                                <TouchableOpacity onPress={() => {setModalVisible(!modalVisible)}}>
                                    <Entypo name="cross" size={24} color="black" />
                                </TouchableOpacity>
                                <Text style={{marginBottom: 15, textAlign: "center", fontSize: 25, fontWeight: "bold"}}>{lastMarkedDate}</Text>
                                
                                {lastMarkedDate in fetchedData ? 
                                <Animated.FlatList
                                data={fetchedData[lastMarkedDate].renderSymptom()}
                                renderItem={renderModalItem}
                                keyExtractor={keyExtractor}
                                pagingEnabled
                                horizontal
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
                                data={new MODAL_TEMPLATE().default_template}
                                renderItem={renderModalItem}
                                keyExtractor={keyExtractor}
                                pagingEnabled
                                horizontal
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

                                <ScalingDot 
                                data={new MODAL_TEMPLATE().default_template}
                                expandingDotWidth={30}
                                scrollX={scrollX}
                                inActiveDotOpacity={0.6}
                                dotStyle={{
                                    width: 10,
                                    height: 10,
                                    backgroundColor: '#347af0',
                                    borderRadius: 5,
                                    marginHorizontal: 5
                                }}
                                containerStyle={{
                                    // top: 30,
                                }}
                                />
                                <Pressable
                                style={[styles.button, styles.buttonClose]}
                                onPress={modalItemSubmitPressed}>
                                    <Text style={styles.textStyle}>Submit</Text>
                                </Pressable>
                            </View>
                        </View>
                    </Modal>
                    
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
                        isVisible={modalVisible_2}
                        onRequestClose={() => {
                            setModalVisible(!modalVisible_2);
                        }}
                        statusBarTranslucent={true}
                        style={{backgroundColor: "red", margin: 0}}
                    >
                        <SafeAreaView style={{flex: 1}}>
                            {/* <StatusBar
                            animated={true}
                            backgroundColor="#61dafb"
                            hidden={statusBarHidden} /> */}
                            <View style={{flex:1, justifyContent: 'flex-end', flexDirection: 'column'}}>
                                <TouchableOpacity onPress={()=>{setModalVisible_2(!modalVisible_2)}}>
                                    <Entypo name="cross" size={24} color="black" />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={()=>{setTodayDate(new Date())}}>
                                    <Text>Today</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{flex: 8}}>
                                <CalendarList
                                onVisibleMonthsChange={(months) => {console.log('now these months are visible', months);}}
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
                <View style={[{flex:1}, styles.card]}>
                    <CalendarCard leftContent='28' rightContent='Days until your next period'/>
                    <CalendarCard leftContent='14' rightContent='Days until your next ovulation'/>
                </View>
                <View style={{flex:1}}/>
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
        flexDirection: 'column',
        width: width-MODAL_MARGIN*2-MODAL_PADDING*2,
        justifyContent: 'center',
        alignItems: 'center',
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
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    card: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-evenly',
    },
})

export default PeriodCalendarScreen;
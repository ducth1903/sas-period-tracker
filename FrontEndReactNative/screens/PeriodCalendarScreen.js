import React, {useContext, useRef, useState} from 'react';
import { StyleSheet, Text, View, Modal, SafeAreaView, Pressable } from 'react-native';
// import { Button, Card, FAB } from 'react-native-paper';

// https://github.com/wix/react-native-calendars
import { Calendar } from 'react-native-calendars';

import { AuthContext } from '../navigation/AuthProvider'; 
import FormButton from '../components/FormButton';

const PeriodCalendarScreen = ({ props }) => {
    const { userId } = useContext(AuthContext);
    const [modalVisible, setModalVisible] = useState(false);
    const [markedDates, setMarkedDates] = useState({
        '2021-05-22': {startingDay: true, color: 'green'},
        '2021-05-23': {selected: true, endingDay: true, color: 'green', textColor: 'gray'},
        '2021-05-04': {selected: false, marked: true, selectedColor: 'blue'},
        '2021-05-31': {marked: true, dotColor: 'red', activeOpacity: 0}
    });

    const updateNewMarkedDate = (newDateString) => {
        if (newDateString in markedDates) {
            // if already exists, remove the date
            delete markedDates[newDateString];
            setMarkedDates(
                Object.assign({}, markedDates, {})
            )
        } else {
            // if not exists, add the date
            newMarkedDate = {};
            // newMarkedDate[newDateString] = {textColor: 'white', color: '#F59D3F', startingDay: true, endingDay: true}
            newMarkedDate[newDateString] = {
                customStyles: {
                    container: {
                        backgroundColor: '#F59D3F',
                        borderColor: 'white',
                        borderWidth: 1,
                        elevation: 2
                    },
                    text: {
                        color: 'white',
                        fontWeight: 'bold'
                    }
                }
            }
            setMarkedDates(
                Object.assign({}, markedDates, newMarkedDate)
            )

            setModalVisible(true);
        } 
    }
    
    return (
        <SafeAreaView style={styles.container}>
            {/* <Text style={{flex:1}}>Period Calendar Page: {userId} </Text> */}
            <View style={{flex:1}}></View>
            <View style={styles.calendarContainer}>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
                        setModalVisible(!modalVisible);
                    }}
                >
                    <View style={styles.modalCenteredView}>
                        <View style={styles.modalView}>
                            <Text style={{marginBottom: 15, textAlign: "center"}}>Hello World!</Text>
                            <Pressable
                                style={[styles.button, styles.buttonClose]}
                                onPress={() => setModalVisible(!modalVisible)} >
                                <Text style={styles.textStyle}>Hide Modal</Text>
                            </Pressable>
                        </View>
                    </View>
                </Modal>
                
                {/* Calendar */}
                <Calendar
                    style={styles.calendar}
                    theme={{
                        backgroundColor: '#ffffff',
                        calendarBackground: '#F56A37',
                        textSectionTitleColor: '#b6c1cd',
                        textSectionTitleDisabledColor: '#d9e1e8',
                        selectedDayBackgroundColor: '#00adf5',
                        selectedDayTextColor: '#ffffff',
                        todayTextColor: '#00adf5',
                        // dayTextColor: '#2d4150',
                        dayTextColor: 'white',
                        textDisabledColor: '#242424',
                        dotColor: '#00adf5',
                        selectedDotColor: '#ffffff',
                        arrowColor: '#F59D3F',
                        disabledArrowColor: '#d9e1e8',
                        monthTextColor: 'white',
                        // indicatorColor: '#F59D3F',
                        // textDayFontFamily: 'monospace',
                        // textMonthFontFamily: 'monospace',
                        // textDayHeaderFontFamily: 'monospace',
                        textDayFontWeight: '300',
                        textMonthFontWeight: 'bold',
                        textDayHeaderFontWeight: '300',
                        textDayFontSize: 16,
                        textMonthFontSize: 16,
                        textDayHeaderFontSize: 16
                    }}

                    // Enable the option to swipe between months. Default = false
                    enableSwipeMonths={true}

                    onDayPress={(day) => updateNewMarkedDate(day.dateString)}
                    onDayLongPress={(day) => {console.log('long pressed day', day)}}

                    markedDates={ markedDates }
                    // Date marking style [simple/period/multi-dot/custom]. Default = 'simple'
                    // markingType={'period'}
                    markingType={'custom'}
                />
            </View>
            <View style={{flex:1}}>
                {/* <FormButton 
                    btnTitle="Open modal"
                    isHighlight={true} 
                    onPress={ ()=>{ setModalVisible(true) } } /> */}
            </View>
            <View style={{flex:1}}></View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
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
        backgroundColor: '#F56A37',
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
        alignItems: "center",
        marginTop: 22
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
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
})

export default PeriodCalendarScreen;
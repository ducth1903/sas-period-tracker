import React, {useContext, useState} from 'react';
import { render } from 'react-dom';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import { Button, Card, FAB } from 'react-native-paper';

import { AuthContext } from '../navigation/AuthProvider'; 

const PeriodCalendarScreen = ({ props }) => {
    const { userId } = useContext(AuthContext);
    
    return (
        <View style={styles.container}>
            <Text>Period Calendar Page: {userId} </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
    },

})

export default PeriodCalendarScreen;
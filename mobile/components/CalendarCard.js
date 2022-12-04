import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Avatar } from 'react-native-paper';

const CalendarCard = ({ leftContent, rightContent, ...restProps }) => {
    return (
        <View style={{alignContent: 'center', alignItems: 'center'}}>
            <View style={styles.viewStyle}>
                <Avatar.Text 
                    size={64} 
                    label={leftContent}
                    color='#183A1D'
                    {...restProps}
                />
            </View>
            <Text>{rightContent}</Text>
        </View>
)
}

export const styles = StyleSheet.create({
    viewStyle: {
        flexDirection: 'row',
        margin: 10,
        paddingTop: 10,
        paddingBottom: 5,
        padding: 10,
    },
})

export default CalendarCard;
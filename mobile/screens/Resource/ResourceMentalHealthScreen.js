import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const ResourceMentalHealthScreen = ({ props }) => {
    return (
        <View style={styles.container}>
            <Text>ResourceMentalHealthScreen Page</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
    }
})

export default ResourceMentalHealthScreen;
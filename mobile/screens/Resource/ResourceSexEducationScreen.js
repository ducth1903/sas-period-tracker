import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const ResourceSexEducationScreen = ({ props }) => {
    return (
        <View style={styles.container}>
            <Text>ResourceSexEducationScreen Page</Text>
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

export default ResourceSexEducationScreen;
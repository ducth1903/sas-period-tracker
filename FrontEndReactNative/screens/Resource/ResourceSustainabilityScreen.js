import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const ResourceSustainabilityScreen = ({ props }) => {
    return (
        <View style={styles.container}>
            <Text>ResourceSustainabilityScreen Page</Text>
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

export default ResourceSustainabilityScreen;
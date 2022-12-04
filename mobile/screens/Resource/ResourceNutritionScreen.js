import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const ResourceNutritionScreen = ({ props }) => {
    return (
        <View style={styles.container}>
            <Text>ResourceNutritionScreen Page</Text>
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

export default ResourceNutritionScreen;
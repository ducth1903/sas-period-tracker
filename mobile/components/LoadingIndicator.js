import * as React from 'react';
import { StyleSheet, View, Text } from 'react-native';

const LoadingIndicator = () => (
    <View style={styles.container}>
        <Text>Loading...</Text>
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default LoadingIndicator;
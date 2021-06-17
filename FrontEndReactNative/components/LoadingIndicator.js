import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';

const LoadingIndicator = () => (
    <View style={styles.container}>
        <ActivityIndicator animating={true} size='large' />
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
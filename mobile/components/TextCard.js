import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const TextCard = ({ inText }) => (
    <View
        className="border-[0.8px] px-4 py-2 rounded-2xl"
        style={styles.textbox}
    >
        <Text className="text-teal text-xs">
            {inText}
        </Text>
    </View>
);

const styles = StyleSheet.create({
    textbox: {
        borderColor: '#00394E',
    }
});

export default TextCard;

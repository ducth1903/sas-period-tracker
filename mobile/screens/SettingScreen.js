import React, {useContext, useState} from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import { Button, TouchableRipple, Switch, useTheme } from 'react-native-paper';

import { AuthContext } from '../navigation/AuthProvider'; 

const SettingScreen = ({ props }) => {
    const { userId, logout, toggleTheme } = useContext(AuthContext);
    const paperTheme = useTheme();

    return (
        <View style={styles.container}>
            <Text>Setting Page</Text>
            <Button mode="contained" onPress={ () => logout() }>Sign Out</Button>
            {/* <TouchableRipple onPress={() => {toggleTheme()}}> */}
            <TouchableRipple onPress={() => { toggleTheme() }}>
                <View style={styles.preference}>
                    <Text>Dark Theme</Text>
                    <View pointerEvents="none">
                        <Switch value={ paperTheme.dark }/>
                    </View>
                </View>
            </TouchableRipple>
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
    preference: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
})

export default SettingScreen;
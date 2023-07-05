import { useState, useEffect, useContext } from 'react';
import { View, Text, TouchableHighlight, TextInput } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

import { SettingsContext } from '../navigation/SettingsProvider';
import i18n from '../translations/i18n';

const getDateStr = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}-${month < 10 ? '0' : ''}${month}-${day < 10 ? '0' : ''}${day}`;
}

const StaticNote = ({ mode, noteKey }) => {
    const [noteText, setNoteText] = useState(null);
    const { selectedSettingsLanguage } = useContext(SettingsContext);

    async function initNoteText() {
        try {
            const stringifiedKey = noteKey instanceof Date ? getDateStr(noteKey) : noteKey

            let notes = await AsyncStorage.getItem('notes');
            notes = JSON.parse(notes);
            
            const noteText = notes[mode][stringifiedKey];
            if (noteText) {
                setNoteText(noteText);
            }
        }
        catch (error) {
            console.log('[DynamicNote] noteText initialization failed: ', error);
        }
    }

    async function updateNoteText() {
        try {
            const stringifiedKey = noteKey instanceof Date ? getDateStr(noteKey) : noteKey

            let notes = await AsyncStorage.getItem('notes');
            notes = JSON.parse(notes);
            
            notes[mode][stringifiedKey] = noteText;
            await AsyncStorage.setItem('notes', JSON.stringify(notes));

            //! delete later, just for debugging
            console.log(`current notes object: `, notes);
        }
        catch (error) {
            console.log(`[DynamicNote] noteText update for key ${noteKey instanceof Date ? getDateStr(noteKey) : noteKey} failed: `, error);
        }
    }
    
    useEffect(() => {
        // init noteText if it exists
        initNoteText();
    }, [])

    useEffect(() => {
        if (!noteText) return;
        updateNoteText();
    }, [noteText])

    return (
        <View className="px-7 w-screen">
            <View className="flex flex-col w-full min-h-[15vh] border-2 border-turquoise rounded-xl p-3">
                <View className="flex-row flex-grow">
                    <TextInput
                        className="w-[80%] text-teal font-light flex-grow flex-wrap"
                        placeholder={i18n.t('home.addYourNotesHere')}
                        placeholderTextColor={'#00394E80'}
                        value={noteText ? noteText : ''}
                        onChangeText={setNoteText}
                        multiline={true}
                    />

                    <View className="justify-end flex-grow">
                        <TouchableHighlight className="bg-turquoise p-2 rounded-md self-end">
                            <Text className="self-center text-slate-50">{i18n.t('home.save')}</Text>
                        </TouchableHighlight>
                    </View>
                </View>
            </View>
        </View>
    )
}

export default StaticNote;
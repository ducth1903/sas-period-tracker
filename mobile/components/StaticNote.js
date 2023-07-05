import { useState, useEffect, useContext } from 'react';
import { View, Text } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { SettingsContext } from '../navigation/SettingsProvider';
import i18n from '../translations/i18n';

const getDateStr = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}-${month < 10 ? '0' : ''}${month}-${day < 10 ? '0' : ''}${day}`;
}

// this component is used strictly for fetching and displaying user's stored notes. DynamicNote is for editing notes.
// mode is "dates" or "articles", noteKey should be an english article title or a date object
const StaticNote = ({ mode, noteKey }) => {
    const weekDays = [i18n.t('days.long.sunday'), i18n.t('days.long.monday'), i18n.t('days.long.tuesday'), i18n.t('days.long.wednesday'), i18n.t('days.long.thursday'), i18n.t('days.long.friday'), i18n.t('days.long.saturday')];
    const { selectedSettingsLanguage } = useContext(SettingsContext);
    const [noteText, setNoteText] = useState(null);

    //! DELETE
    async function debugAS() {
        try {
            let value = await AsyncStorage.getItem(key);
            console.log(`[StaticNote] ${key}: ${value}`);
        }
        catch (error) {
            console.log(`[StaticNote] debugAS() failed: ${error}`);
        }
    }

    async function initNoteStorage() {
        try {
            let notes = await AsyncStorage.getItem('notes');
            if (!notes) { /// this block will typically be run once per device
                notes = {
                    "dates": {

                    },
                    "articles": {

                    }
                };
                await AsyncStorage.setItem('notes', JSON.stringify(notes));
            }
        }
        catch (error) {
            console.log('[StaticNote] init note storage failed: ', error);
        }
    }

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
            console.log('[StaticNote] noteText initialization failed: ', error);
        }
    }    

    useEffect(() => {
        // init note storage if not already
        initNoteStorage();

        // init noteText
        initNoteText();

        // debugAS();
    }, [])

    return (
        <View>
            {
                mode === 'dates' &&
                <Text className="text-[18px] text-greydark font-bold mt-4">
                    {`${weekDays[noteKey.getDay()]}, ${noteKey.toLocaleString(selectedSettingsLanguage, { month: 'long' })} ${noteKey.getDate()}`}
                </Text>
            }
            <View className="items-center justify-center border-2 min-h-[112px] border-turquoise rounded-xl mt-1.5 px-4 py-8">
                <Text className="text-teal">
                    {noteText ? noteText : 'Notes for this day appear here.'}
                </Text>
            </View>
        </View>
    );
}

export default StaticNote;

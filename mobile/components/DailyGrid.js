import { useContext } from 'react';
import { View, Text, useWindowDimensions } from 'react-native';
import * as SVG from '../assets/svg.js'

import i18n from '../translations/i18n.js';
import { SettingsContext } from '../navigation/SettingsProvider.js';

// takes in a specific date's data and renders symptoms grid in the daily view
const DailyGrid = ({ data }) => {
    const { selectedSettingsLanguage } = useContext(SettingsContext);
    const { height, width } = useWindowDimensions();
    const iconDimensions = width/5;

    let moods = [];
    let symptoms = [];
    if (data) {
        moods = data.moods ? [...data.moods] : [];
        symptoms = data.symptoms ? [...data.symptoms] : [];
    }
    
    let tileCount = 0;
    return (
        <View className="items-center justify-center pt-1.5 mt-6">
            {
                data && (data.flow || data.discharge || data.moods || data.symptoms) ? (
                    <View style={{ width: iconDimensions * 3.1, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                        {/* pick flow icon to render */}
                        {(() => {
                            if (!data || !data.flow) {
                                return null;
                            }
                            ++tileCount;
                            return (
                                <View style={{ flexDirection: 'column' }}>
                                    {SVG.renderFlow(data.flow, true, iconDimensions, iconDimensions, 0, 1.5)}
                                    <View style={{ width: iconDimensions }}>
                                        <Text className="text-[12px] text-center text-greydark font-semibold">{i18n.t(`flow.${data.flow}`)}</Text>
                                    </View>
                                </View>
                            );
                        })()}
                        
                        {/* pick discharge icon to render */}
                        {(() => {
                            if (!data || !data.discharge) {
                                return null;
                            }
                            ++tileCount;
                            return (
                                <View style={{ flexDirection: 'column', overflow: 'hidden' }}>
                                    {SVG.renderDischarge(data.discharge, true, iconDimensions, iconDimensions, 0, 1.5)}
                                    <View style={{ width: iconDimensions }}>
                                        <Text className="text-[12px] text-center text-greydark font-semibold">{i18n.t(`discharge.${data.discharge}`)}</Text>
                                    </View>
                                </View>
                            );
                        })()}

                        {/* render moods */}
                        {moods.map((mood, index) => {
                            ++tileCount;
                            return (
                                <View key={`daily-mood-${index}`} style={{ flexDirection: 'column', overflow: 'hidden' }}>
                                    {SVG.renderMood(`daily-mood-icon-${index}`, mood, true, iconDimensions, iconDimensions, 0, 1.5)}
                                    <View style={{ width: iconDimensions }}>
                                        <Text className="text-[12px] text-center text-greydark font-semibold">{i18n.t(`moods.${mood}`)}</Text>
                                    </View>
                                </View>
                            );
                        })}

                        {/* render symptoms */}
                        {symptoms.map((symptom, index) => {
                            ++tileCount;
                            return (
                                <View key={`daily-symptom-${index}`} style={{ flexDirection: 'column', overflow: 'hidden' }}>
                                    {SVG.renderSymptom(`daily-symptom-icon-${index}`, symptom, true, iconDimensions, iconDimensions, 0, 1.5)}
                                    <View style={{ width: iconDimensions }}>
                                        <Text className="text-[12px] text-center text-greydark font-semibold">{i18n.t(`symptoms.${symptom}`)}</Text>
                                    </View>
                                </View>
                            );
                        })}
                        
                        {
                            // fill in empty tiles (this prints 3 blank tiles for null data, but that's actually good because it creates some spoce)
                            tileCount % 3 === 0 ? null : [...Array(3 - (tileCount % 3))].map((_, index) => {
                                return (
                                    <View key={`empty-${index}`} style={{ width: iconDimensions, height: iconDimensions }}/>
                                )
                            })
                        }
                    </View>
                )
                :
                <Text className="text-[22px]">{i18n.t('analysis.day.noData')}</Text>
            }
        </View>
    );
}

export default DailyGrid;

import React, { useState, useContext } from 'react';
import { View, Text } from 'react-native';
import * as SVG from '../assets/svg.js';
import i18n from '../translations/i18n.js';
import { SettingsContext } from '../navigation/SettingsProvider.js';
import { Hyphenate } from 'react-native-hyphenate';

// There are 15 icons in each column
const WeekColumn = ({ flow, discharge, symptoms, moods, day }) => {
    /**
     * Required Rows:
     * 1. Flow level based on period information on that day
     * 2. Discharge type based on period information on that day
     * 3. Cravings (selected or default depending on user data)
     * 4. Backache (selected or default depending on user data)
     * 5. Tender breasts (selected or default depending on user data)
     * 6. Headache (selected or default depending on user data)
     * 7. Fatigue (selected or default depending on user data)
     * 8. Nausea (selected or default depending on user data)
     * 9. Excited (selected or default depending on user data)
     * 10. Happy (selected or default depending on user data)
     * 11. Sensitive (selected or default depending on user data)
     * 12. Sad (selected or default depending on user data)
     * 13. Anxious (selected or default depending on user data)
     * 14. Angry (selected or default depending on user data)
     */

    const { selectedSettingsLanguage } = useContext(SettingsContext);

    // TODO: Integrate custom moods
    return (
        <View className="flex-col mt-3">
            {/* flow icon for this row */}
            {
                (() => 
                    <View className="h-[70px]">
                        {SVG.renderFlow(flow, true, 40, 40, 1.5, 0)}
                        <View style={{ width: 40, overflow: 'hidden' }}>
                            <Text className="text-[8px] text-center text-greydark font-semibold overflow-hidden">{flow ? i18n.t(`flow.${flow}`) : i18n.t('analysis.trends.export.notLogged')}</Text>
                        </View>
                    </View>
                )()
            }
            
            {/* discharge icon for this row */}
            {(() => 
                <View className="h-[70px]">
                    {SVG.renderDischarge(discharge, true, 40, 40, 1.5, 0)}
                        <View style={{ width: 40, overflow: 'hidden' }}>
                            <Text className="text-[8px] text-center text-greydark font-semibold overflow-hidden">{discharge ? i18n.t(`discharge.${discharge}`) : i18n.t('analysis.trends.export.notLogged')}</Text>
                        </View>
                </View>
            )()}
            
            {/* {SVG.renderDischarge(discharge, true, 40, 40, 1.5, 0)} */}

            {/* symptoms icons for this row */}
            {
                Object.keys(SVG.symptomSVGs.default).map(
                    (symptom, index) => (
                        <View className="h-[70px]" key={`symptom-${index}-${day}`}>
                            {SVG.renderSymptom(`symptom-${symptom}-${day}`, symptom, symptoms ? symptoms.includes(symptom) : false, 40, 40, 1.5, 0)}
                            <View style={{ width: 40 }}>
                                <Text className="text-[8px] text-center text-greydark font-semibold inline-block">{i18n.t(`symptoms.${symptom}`)}</Text>
                            </View>
                        </View>
                    )
                )
            }

            {/* moods icons for this row */}
            {
                Object.keys(SVG.moodSVGs.default).map(
                    (mood, index) => (
                        <View className="h-[70px]" key={`mood-${index}-${day}`}>
                            {SVG.renderMood(`mood-${mood}-${day}`, mood, moods ? moods.includes(mood) : false, 40, 40, 1.5, 0)}
                            <View style={{ width: 40 }}>
                                <Text className="text-[8px] text-center text-greydark font-semibold inline-block">{i18n.t(`moods.${mood}`)}</Text>
                            </View>
                        </View>
                    )
                )
            }
        </View>
    );
}

export default WeekColumn;

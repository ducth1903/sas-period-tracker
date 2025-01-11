import React, { useState, useContext } from 'react';
import { View, Text } from 'react-native';
import * as SVG from '../assets/svg.js';
import i18n from '../translations/i18n.js';
import { SettingsContext } from '../navigation/SettingsProvider.js';

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
        <View className="flex-col" style={{ 
                flex: 1, justifyContent: 'flex-start', 
            }}>
            {/* Render Flow icon only if it has a value */}
            {flow && (
                <View className="h-[70px]">
                    {SVG.renderFlow(flow, true, 40, 40, 1.5, 0)}
                    <View style={{ width: 40, overflow: 'hidden' }}>
                        <Text className="text-[8px] text-center text-greydark font-semibold overflow-hidden">
                            {i18n.t(`flow.${flow}`)}
                        </Text>
                    </View>
                </View>
            )}

            {/* Render Discharge icon only if it has a value */}
            {discharge && (
                <View className="h-[70px]">
                    {SVG.renderDischarge(discharge, true, 40, 40, 1.5, 0)}
                    <View style={{ width: 40, overflow: 'hidden' }}>
                        <Text className="text-[8px] text-center text-greydark font-semibold overflow-hidden">
                            {i18n.t(`discharge.${discharge}`)}
                        </Text>
                    </View>
                </View>
            )}

            {/* Render Symptoms icons only for selected symptoms */}
            {symptoms && symptoms.length > 0 && symptoms.map((symptom, index) => (
                <View className="h-[70px]" key={`symptom-${index}-${day}`}>
                    {SVG.renderSymptom(`symptom-${symptom}-${day}`, symptom, true, 40, 40, 1.5, 0)}
                    <View style={{ width: 40 }}>
                        <Text className="text-[8px] text-center text-greydark font-semibold inline-block">
                            {i18n.t(`symptoms.${symptom}`)}
                        </Text>
                    </View>
                </View>
            ))}

            {/* Render Moods icons only for selected moods */}
            {moods && moods.length > 0 && moods.map((mood, index) => (
                <View className="h-[70px]" key={`mood-${index}-${day}`}>
                    {SVG.renderMood(`mood-${mood}-${day}`, mood, true, 40, 40, 1.5, 0)}
                    <View style={{ width: 40 }}>
                        <Text className="text-[8px] text-center text-greydark font-semibold inline-block">
                            {i18n.t(`moods.${mood}`)}
                        </Text>
                    </View>
                </View>
            ))}
        </View>
    );
}

export default WeekColumn;

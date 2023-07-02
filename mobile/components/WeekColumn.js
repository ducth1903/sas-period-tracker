import React, { useState } from 'react';
import { View } from 'react-native';
import * as SVG from '../assets/svg.js';

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

    const [isLoading, setIsLoading] = useState(true);
    const [weekFlow, setWeekFlow] = useState(null);
    const [weekDischarge, setWeekDischarge] = useState(null);
    const [weekSymptoms, setWeekSymptoms] = useState(null);
    const [weekMood, setWeekMood] = useState(null);

    // TODO: Integrate custom moods
    // TODO: Backend integration
    return (
        <View className="flex-col mt-3">
            {/* flow icon for this row */}
            {SVG.renderFlow(flow, true)}
            
            {/* discharge icon for this row */}
            {SVG.renderDischarge(discharge, true)}

            {/* symptoms icons for this row */}
            {
                Object.keys(SVG.symptomSVGs.default).map(
                    symptom => SVG.renderSymptom(key=`symptom-${symptom}-${day}`,symptom, symptoms[symptom])
                )
            }

            {/* moods icons for this row */}
            {
                Object.keys(SVG.moodSVGs.default).map(
                    mood => SVG.renderMood(key=`mood-${mood}-${day}`, mood, moods[mood])
                )
            }
        </View>
    );
}

export default WeekColumn;

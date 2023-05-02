import React, { useState } from 'react';
import { View, useWindowDimensions } from 'react-native';
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
    // TODO: refactor props to be passed in as lists
    return (
        <View className="flex-col mt-3">
            {/* flow icon for this row */}
            {SVG.renderFlow(flow, true, 40, 40, 1.5, 0)}
            
            {/* discharge icon for this row */}
            {SVG.renderDischarge(discharge, true, 40, 40, 1.5, 0)}

            {/* symptoms icons for this row */}
            {
                Object.keys(SVG.symptomSVGs.default).map(
                    symptom => SVG.renderSymptom(`symptom-${symptom}-${day}`, symptom, symptoms[symptom], 40, 40, 1.5, 0)
                )
            }

            {/* moods icons for this row */}
            {
                Object.keys(SVG.moodSVGs.default).map(
                    mood => SVG.renderMood(`mood-${mood}-${day}`, mood, moods[mood], 40, 40, 1.5, 0)
                )
            }
        </View>
    );
}

export default WeekColumn;

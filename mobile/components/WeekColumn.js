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

    // console.log(`WeekColumn: ${flow}, ${discharge}, ${JSON.stringify(symptoms)}, ${JSON.stringify(moods)}`);

    const flowSVGs = {
        light: SVG.FlowLightSelected,
        medium: SVG.FlowMediumSelected,
        heavy: SVG.FlowHeavySelected,
        notsure: SVG.FlowNotSureSelected,
        none: SVG.FlowNoneSelected
    };

    const dischargeSVGs = {
        stringy: SVG.SymptomDischargeStringySelected,
        watery: SVG.SymptomDischargeWaterySelected,
        transparent: SVG.SymptomDischargeTransparentSelected,
        creamy: SVG.SymptomDischargeCreamySelected,
        clumpy: SVG.SymptomDischargeClumpySelected,
        sticky: SVG.SymptomDischargeStickySelected
    };

    const symptomSVGs = {
        cravings: symptoms['cravings'] ? SVG.SymptomCravingsSelected : SVG.SymptomCravingsDefault,
        backache: symptoms['backache'] ? SVG.SymptomBackacheSelected : SVG.SymptomBackacheDefault,
        tenderBreasts: symptoms['tenderBreasts'] ? SVG.SymptomTenderSelected : SVG.SymptomTenderDefault,
        headache: symptoms['headache'] ? SVG.SymptomHeadacheSelected : SVG.SymptomHeadacheDefault,
        fatigue: symptoms['fatigue'] ? SVG.SymptomFatigueSelected : SVG.SymptomFatigueDefault,
        nausea: symptoms['nausea'] ? SVG.SymptomNauseaSelected : SVG.SymptomNauseaDefault
    };

    const moodSVGs = {
        excited: moods['excited'] ? SVG.MoodExcitedSelected : SVG.MoodExcitedDefault,
        happy: moods['happy'] ? SVG.MoodHappySelected : SVG.MoodHappyDefault,
        sensitive: moods['sensitive'] ? SVG.MoodSensitiveSelected : SVG.MoodSensitiveDefault,
        sad: moods['sad'] ? SVG.MoodSadSelected : SVG.MoodSadDefault,
        anxious: moods['anxious'] ? SVG.MoodAnxiousSelected : SVG.MoodAnxiousDefault,
        angry: moods['angry'] ? SVG.MoodAngrySelected : SVG.MoodAngryDefault
    };

    const renderFlow = () => {
        const FlowIcon = flowSVGs[flow];
        return <FlowIcon className="mb-1.5 mr-1.5" width={40} height={40} />;
    }

    const renderDischarge = () => {
        const DischargeIcon = dischargeSVGs[discharge];
        return <DischargeIcon className="mb-1.5 mr-1.5" width={40} height={40} />;
    }

    const renderSymptom = (symptomName) => {
        const SymptomIcon = symptomSVGs[symptomName];
        return <SymptomIcon className="mb-1.5 mr-1.5" width={40} height={40} key={`${day}-${symptomName}`} />;
    }

    const renderMood = (moodName) => {
        const MoodIcon = moodSVGs[moodName];
        return <MoodIcon className="mb-1.5 mr-1.5" width={40} height={40} key={`${day}-${moodName}`} />;
    }
    
    // TODO: Integrate custom moods
    // TODO: Backend integration
    return (
        <View className="flex-col mt-3">
            {/* flow icon for this row */}
            {renderFlow()}
            
            {/* discharge icon for this row */}
            {renderDischarge()}

            {/* symptoms icons for this row */}
            {
                Object.keys(symptoms).map((symptomName) => renderSymptom(symptomName))
            }

            {/* moods icons for this row */}
            {
                Object.keys(moods).map((moodName) => renderMood(moodName))
            }
        </View>
    );
}

export default WeekColumn;

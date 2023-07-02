import { View, Text, useWindowDimensions } from 'react-native';
import * as SVG from '../assets/svg.js'

const tempData = {
    dateStr: "2021-09-09",
    symptoms: {
        discharge: [
            "stringy"
        ],
        mood: [
            "happy",
            "excited"
        ],
        symptoms: [
            "backache",
            "headache"
        ],
        flow: [
            "medium"
        ]
    }
}

// takes in a specific date's data and renders symptoms grid in the daily view
const DailyGrid = ({ data=null }) => {
    // TODO: remove this once backend in place
    data = tempData;

    const { height, width } = useWindowDimensions();
    const iconDimensions = width/5;

    const moodCopy = [...data.symptoms.mood];
    const symptomsCopy = [...data.symptoms.symptoms];
    let moodsLeft = moodCopy.length > 0;
    let symptomsLeft = symptomsCopy.length > 0;

    const nextMood = () => {
        if (moodCopy.length === 0) {
            moodsLeft = false;
            // handled in renderMood
            return null;
        }
        return moodCopy.shift();
    }

    const nextSymptom = () => {
        if (symptomsCopy.length === 0) {
            symptomsLeft = false;
            // handled in renderSymptom
            return null;
        }
        return symptomsCopy.shift();
    }

    return (
        // 1.5 extra top padding to match the 1.5 bottom padding of the bottom row of icons
        <View className="items-center justify-center pt-1.5 mt-6">
            <View className="flex-row">
                {/* pick flow icon to render */}
                {SVG.renderFlow(data.symptoms.flow[0], true, iconDimensions, iconDimensions)}
                
                {/* pick discharge icon to render */}
                {SVG.renderDischarge(data.symptoms.discharge[0], true, iconDimensions, iconDimensions)}

                {/* pick symptom icons to render */}
                {SVG.renderSymptom(`daily-symptom-1`, nextSymptom(), symptomsLeft, iconDimensions, iconDimensions)}
            </View>
            <View className="flex-row">
                {SVG.renderSymptom(`daily-symptom-2`, nextSymptom(), symptomsLeft, iconDimensions, iconDimensions)}

                {SVG.renderSymptom(`daily-symptom-3`, nextSymptom(), symptomsLeft, iconDimensions, iconDimensions)}

                {SVG.renderSymptom(`daily-symptom-4`, nextSymptom(), symptomsLeft, iconDimensions, iconDimensions)}
            </View>
            <View className="flex-row">
                {SVG.renderMood(`daily-mood-1`, nextMood(), moodsLeft, iconDimensions, iconDimensions)}

                {SVG.renderMood(`daily-mood-2`, nextMood(), moodsLeft, iconDimensions, iconDimensions)}

                {SVG.renderMood(`daily-mood-3`, nextMood(), moodsLeft, iconDimensions, iconDimensions)}
            </View>
        </View>
    );
}

export default DailyGrid;

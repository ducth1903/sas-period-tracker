// Class PeriodDate for each date in period calendar
// Properties to track:
//  - date
// 

class MODAL_TEMPLATE {
    constructor() {
        this.default_template = [
            {
                key: 'flow',
                title: 'Flow',
                titleColor: '#FF6F72',
                iconBackgroundColor: '#d8adfe',
                multipleChoices: false,
                availableOptions: ['Light', 'Medium', 'Heavy', 'Unusually Heavy', 'Spotting'],
                availableOptions_id: ['light', 'medium', 'heavy', 'unusually_heavy', 'spotting'],
                isChecked: [false, false, false, false, false],
                description: 'Info for Flow'
            },
            {
                key: 'collection',
                title: 'Collection Method',
                titleColor: '#F3692B',
                iconBackgroundColor: '#a9d8ff',
                multipleChoices: true,
                availableOptions: ['Disposable Pad', 'Tampon', 'Menstrual Cup', 'Resuable Pad', 'Period Underwear', 'Panty Liner'],
                availableOptions_id: ['disposable_pad', 'tampon', 'menstrual_cup', 'reusable_pad', 'period_underwear', 'panty_liner'],
                isChecked: [false, false, false, false, false, false],
                description: 'Info for Collection method'
            },
            {
                key: 'discharge',
                title: 'Discharge',
                titleColor: '#0697FF',
                iconBackgroundColor: '#febccf',
                multipleChoices: true,
                availableOptions: ['Thin/clear', 'Stringy', 'creamy', 'Sticky', 'Watery', 'Spotting'],
                availableOptions_id: ['thin_clear', 'stringy', 'creamy', 'sticky', 'watery', 'spotting'],
                isChecked: [false, false, false, false, false, false, false],
                description: 'Info for Discharge'
            },
            {
                key: 'symptoms',
                title: 'Symptoms',
                titleColor: '#FF9900',
                iconBackgroundColor: '#a9d8ff',
                multipleChoices: true,
                availableOptions: ['Headache', 'Cramps', 'Backache', 'Fatigue', 'Tender Breasts', 'Acne', 'Bloating', 'Craving', 'Nausea'],
                availableOptions_id: ['headache', 'cramps', 'backache', 'fatigue', 'tender_breasts', 'acne', 'bloating', 'craving', 'nausea'],
                isChecked: [false, false, false, false, false, false, false, false, false],
                description: 'Info for symptoms'
            },
            {
                key: 'mood',
                title: 'Mood',
                titleColor: '#006666',
                iconBackgroundColor: '#a9d8ff',
                multipleChoices: true,
                availableOptions: ['Content', 'Excited', 'Sad', 'Angry', 'Sensitive', 'Anxious', 'Stressed', 'Self-critical', 'Other'],
                availableOptions_id: ['content', 'excited', 'sad', 'angry', 'sensitive', 'anxious', 'stressed', 'self_critical', 'other'],
                isChecked: [false, false, false, false, false, false, false, false, false],
                description: 'Info for Mood'
            },
            // {
            //     key: 'sexual_drive',
            //     title: 'Sexual Drive',
            //     titleColor: '#ec03fc',
            //     multipleChoices: true,
            //     availableOptions: ['Low', 'Moderate', 'High'],
            //     availableOptions_id: ['low', 'moderate', 'high'],
            //     isChecked: [false, false, false],
            //     description: 'Info for Sexual Drive'
            // },
            // {
            //     key: 'sexual_activity',
            //     title: 'Sexual Activity',
            //     titleColor: '#92f01f',
            //     multipleChoices: true,
            //     availableOptions: ['Protected penetrative sex', 'Unprotected penetrative sex', 'Protected anal sex', 'Unprotected anal sex', 'Protected oral sex', 'Unprotected oral sex', 'Masturbation'],
            //     availableOptions_id: ['protected_penetrative_sex', 'unprotected_penetrative_sex', 'protected_anal_sex', 'unprotected_anal_sex', 'protected_oral_sex', 'unprotected_oral_sex', 'masturbation'],
            //     isChecked: [false, false, false, false, false, false, false],
            //     description: 'Info for Sexual activity'
            // },
            // {
            //     key: 'sleep',
            //     title: 'Sleep',
            //     titleColor: '#cdf01f',
            //     multipleChoices: false,
            //     availableOptions: ['0-3 hours', '3-6 hours', '6-9 hours', '9+ hours'],
            //     availableOptions_id: ['0_3_hours', '3_6_hours', '6_9_hours', '9plus_hours'],
            //     isChecked: [false, false, false, false],
            //     description: 'Info for Sleep'
            // },
        ]

        // <key>: <avaiableOptions_id>"
        // Must do this since 'require' does not allow variable path
        this.default_icons = {
            flow: {
                light: require("../assets/symptom_icons/flow_light.png"),
                medium: require("../assets/symptom_icons/flow_medium.png"),
                heavy: require("../assets/symptom_icons/flow_heavy.png"),
                unusually_heavy: require("../assets/symptom_icons/flow_unusually_heavy.png"),
                spotting: require("../assets/symptom_icons/flow_spotting.png")
            },
            collection: {
                reusable_pad: require("../assets/symptom_icons/collection_resuable_pad.png"),
                disposable_pad: require("../assets/symptom_icons/collection_disposable_pad.png"),
                tampon: require("../assets/symptom_icons/collection_tampon.png"),
                panty_liner: require("../assets/symptom_icons/collection_pantry_liner.png"),
                menstrual_cup: require("../assets/symptom_icons/collection_menstrual_cup.png"),
                period_underwear: require("../assets/symptom_icons/collection_underwear.png")
            },
            discharge: {
                thin_clear: require("../assets/symptom_icons/discharge_thin.png"),
                stringy: require("../assets/symptom_icons/discharge_stringy.png"),
                creamy: require("../assets/symptom_icons/discharge_creamy.png"),
                sticky: require("../assets/symptom_icons/discharge_sticky.png"),
                watery: require("../assets/symptom_icons/discharge_watery.png"),
                spotting: require("../assets/symptom_icons/discharge_spotting.png"),
            },
            symptoms: {
                headache: require("../assets/symptom_icons/symptoms_headache.png"),
                cramps: require("../assets/symptom_icons/symptoms_cramps.png"),
                backache: require("../assets/symptom_icons/symptoms_backache.png"),
                fatigue: require("../assets/symptom_icons/symptoms_fatigue.png"),
                tender_breasts: require("../assets/symptom_icons/symptoms_tender_breast.png"),
                acne: require("../assets/symptom_icons/symptoms_acne.png"),
                bloating: require("../assets/symptom_icons/symptoms_bloating.png"),
                craving: require("../assets/symptom_icons/symptoms_craving.png"),
                nausea: require("../assets/symptom_icons/symptoms_nausea.png")
            },
            mood: {
                content: require("../assets/symptom_icons/mood_content.png"),
                excited: require("../assets/symptom_icons/mood_excited.png"),
                sad: require("../assets/symptom_icons/mood_sad.png"),
                angry: require("../assets/symptom_icons/mood_angry.png"),
                sensitive: require("../assets/symptom_icons/mood_sensitive.png"),
                anxious: require("../assets/symptom_icons/mood_anxious.png"),
                stressed: require("../assets/symptom_icons/mood_stressed.png"),
                self_critical: require("../assets/symptom_icons/mood_self_critical.png"),
                other: require("../assets/symptom_icons/mood_other.png")
            }
        }
    }

    getTitleFromKey = (inKey) => {
        for (let i=0; i<this.default_template.length; i++) {
            if (inKey == this.default_template[i].key) {
                return [i, this.default_template[i].title];
            }
        }
        return [-1, ''];
    }

    getSymptomFromKey = (inSymptom, inKeyIdx=null) => {
        for (let i=0; i<this.default_template[inKeyIdx]['availableOptions_id'].length; i++) {
            if (inSymptom == this.default_template[inKeyIdx]['availableOptions_id'][i]) {
                return this.default_template[inKeyIdx]['availableOptions'][i];
            }
        }
        return `N/A (${inSymptom})`;
    }
}

// const getDateEpoch = (dateObject) => {
//     dateObject.setHours(0, 0, 0, 0);
//     return Number(dateObject)/1000;
// }

// Format date object to "YYYY-MM-DD"
const formatDate = (dateObject) => {
    let year    = dateObject.getFullYear();
    let month   = dateObject.getMonth() + 1;
    let day     = dateObject.getDate();
    return [year, month, day].join('/');
}

class PeriodDate {
    constructor(inDateStr, inSymptoms={}) {
        this.date       = inDateStr;
        // this.isPeriod   = false;

        // Only store "true" (selected) symptoms
        // i.e. {"flow": ["low"], "discharge": ["type1", "type2"], ...}
        this.symptomIds = inSymptoms;
    }

    // i.e. symptomIds = {
    //      'flow': {'low': false, 'medium': false, 'high': false},
    //      'collection': {...}
    // }
    // Hash # prefix makes this method private => encapsulation
    #resetSymptomIds = () => {}

    setSymptom = (key, option, val) => {
        if (key in this.symptomIds) {
            if (val==true) {
                this.symptomIds[key].push(option)
            } else {
                const removeIndex = this.symptomIds[key].indexOf(option);
                if (removeIndex > -1) {
                    this.symptomIds[key].splice(removeIndex, 1);
                }
            }
        } else if (val==true) {
            this.symptomIds[key] = [option];
        }
        
        // this.symptomIds[key][option] = val;
        // console.log('[PeriodDate.setSymptom()] this.symptomIds = ', this.symptomIds)
    }

    // Render complete list of symptoms
    // 'true' for marked symptom, 'false' otherwise
    renderSymptom = () => {
        let res = new MODAL_TEMPLATE().default_template;
        for (let i=0; i<res.length; i++) {
            let curr_key = res[i].key;
            for (let ii=0; ii<res[i]['isChecked'].length; ii++) {
                if (curr_key in this.symptomIds) {
                    if ( this.symptomIds[curr_key].includes(res[i]['availableOptions_id'][ii]) ) {
                        res[i]['isChecked'][ii] = true;
                    }
                }
            }
        }
        return res;
    }
}

export { MODAL_TEMPLATE, formatDate };
export default PeriodDate;
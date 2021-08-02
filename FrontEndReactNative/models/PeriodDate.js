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
                multipleChoices: true,
                availableOptions: ['Resuable Pad', 'Disposable Pad', 'Tampon', 'Panty Liner', 'Menstrual Cup', 'Period Underwear'],
                availableOptions_id: ['reusable_pad', 'disposable_pad', 'tampon', 'panty_liner', 'menstrual_cup', 'period_underwear'],
                isChecked: [false, false, false, false, false, false],
                description: 'Info for Collection method'
            },
            {
                key: 'discharge',
                title: 'Discharge',
                titleColor: '#0697FF',
                multipleChoices: true,
                availableOptions: ['Thin/clear', 'Stringy/stretchy', 'Thick/creamy', 'Sticky', 'Watery', 'White/clumpy', 'Yellow/green/grey'],
                availableOptions_id: ['thin_clear', 'stringy_stretchy', 'thick_creamy', 'sticky', 'watery', 'white_clumpy', 'yellow_green_grey'],
                isChecked: [false, false, false, false, false, false, false],
                description: 'Info for Discharge'
            },
            {
                key: 'symptoms',
                title: 'Symptoms',
                titleColor: '#FF9900',
                multipleChoices: true,
                availableOptions: ['Headache', 'Cramps', 'Backache', 'Fatigue', 'Tender Breasts', 'Acne', 'Bloating', 'Gassiness', 'Nausea'],
                availableOptions_id: ['headache', 'cramps', 'backache', 'fatigue', 'tender_breasts', 'acne', 'bloating', 'gasiness', 'nausea'],
                isChecked: [false, false, false, false, false, false, false, false, false],
                description: 'Info for symptoms'
            },
            {
                key: 'mood',
                title: 'Mood',
                titleColor: '#006666',
                multipleChoices: true,
                availableOptions: ['Content', 'Excited', 'Sad', 'Angry', 'Sensitive', 'Anxious', 'Stressed', 'Self-critical', 'Other'],
                availableOptions_id: ['content', 'excited', 'sad', 'angry', 'sensitive', 'anxious', 'stressed', 'self_critical', 'other'],
                isChecked: [false, false, false, false, false, false, false, false, false],
                description: 'Info for Mood'
            },
            {
                key: 'sexual_drive',
                title: 'Sexual Drive',
                titleColor: '#ec03fc',
                multipleChoices: true,
                availableOptions: ['Low', 'Moderate', 'High'],
                availableOptions_id: ['low', 'moderate', 'high'],
                isChecked: [false, false, false],
                description: 'Info for Sexual Drive'
            },
            {
                key: 'sexual_activity',
                title: 'Sexual Activity',
                titleColor: '#92f01f',
                multipleChoices: true,
                availableOptions: ['Protected penetrative sex', 'Unprotected penetrative sex', 'Protected anal sex', 'Unprotected anal sex', 'Protected oral sex', 'Unprotected oral sex', 'Masturbation'],
                availableOptions_id: ['protected_penetrative_sex', 'unprotected_penetrative_sex', 'protected_anal_sex', 'unprotected_anal_sex', 'protected_oral_sex', 'unprotected_oral_sex', 'masturbation'],
                isChecked: [false, false, false, false, false, false, false],
                description: 'Info for Sexual activity'
            },
            {
                key: 'sleep',
                title: 'Sleep',
                titleColor: '#cdf01f',
                multipleChoices: false,
                availableOptions: ['0-3 hours', '3-6 hours', '6-9 hours', '9+ hours'],
                availableOptions_id: ['0_3_hours', '3_6_hours', '6_9_hours', '9plus_hours'],
                isChecked: [false, false, false, false],
                description: 'Info for Sleep'
            },
        ]
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
    return [year, month, day].join('-');
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
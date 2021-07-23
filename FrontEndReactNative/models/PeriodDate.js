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
                multipleChoices: false,
                availableOptions: ['Low', 'Medium', 'High'],
                availableOptions_id: ['low', 'medium', 'high'],
                isChecked: [false, false, false]
            },
            {
                key: 'collection',
                title: 'Collection Method',
                multipleChoices: true,
                availableOptions: ['Tampon', 'Pad/Napkin', 'Menstrual Cups', 'Underwear'],
                availableOptions_id: ['tampon', 'pad_napkin', 'menstrual_cups', 'underwear'],
                isChecked: [false, false, false, false]
            },
            {
                key: 'discharge',
                title: 'Discharge',
                multipleChoices: false,
                availableOptions: ['Type 1', 'Type 2', 'Type 3', 'Type 4'],
                availableOptions_id: ['type1', 'type2', 'type3', 'type4'],
                isChecked: [false, false, false, false]
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
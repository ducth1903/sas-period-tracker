// TODO: this should probably be stored in AWS instead of locally for easier syncing
// map from folder names to the language-specific names for topics
export const topicsToTitles = {
    "en": {
        "exercise": "Exercise",
        "maternal_health": "Maternal Health",
        "menstruation": "Menstruation",
        "mental_health": "Mental Health",
        "nutrition": "Nutrition",
        "period_and_society": "Period and Society: Taboos & Misconceptions",
        "physical_changes": "Physical Changes",
        "recipe_hub": "Recipe Hub",
        "repoductive_health": "Reproductive Health"
    },
    "kn": {
        "exercise": "ವ್ಯಾಯಾಮ",
        "maternal_health": "ತಾಯಿಯ ಆರೋಗ್ಯ",
        "menstruation": "ಋತುಚಕ್ರ (ಪಿರಿಯಡ್)",
        "mental_health": "ಮಾನಸಿಕ ಆರೋಗ್ಯ",
        "nutrition": "ಪೋಷಣೆ",
        "physical_changes": "ದೈಹಿಕ ಬದಲಾವಣೆಗಳು",
        "recipe_hub": "ರೆಸಿಪಿ ಹಬ್/ಪಾಕವಿಧಾನ",
        "repoductive_health": "ಸಂತಾನೋತ್ಪತ್ತಿ ಆರೋಗ್ಯ"
    },
    "hi": {
        "exercise": "व्यायाम",
        "maternal_health": "मातृक स्वास्थ्य",
        "menstruation": "माहवारी",
        "mental_health": "मानसिक स्वास्थ्य",
        "nutrition": "पोषण",
        "physical_changes": "शारीरिक परिवर्तन",
        "recipe_hub": "रेसिपियों का घर",
        "repoductive_health": "प्रजनन स्वास्थ्य"
    }
}

// map from folder names to the language-specific names for sections
export const sectionsToTitles = {
    "en": {
        "exercises_for_phases_of_your_cycle": "Exercises for phases of your cycle",
        "post_pregnancy": "Post-Pregnancy",
        "pre_pregnancy": "Pre-Pregnancy",
        "pregnancy": "Pregnancy",
        "pregnancy_common_complications": "Pregnancy: Common Complications",
        "pregnancy_prenatal_care": "Pregnancy: Prenatal Care",
        "pregnancy_wellbeing": "Pregnancy: Wellbeing",
        "things_to_know": "Things to know",
        "menstrual_health_hygiene": "Menstrual Health & Hygiene",
        "menstrual_how_tos": "Menstrual How-Tos",
        "menstruation_basics": "Menstruation Basics",
        "appearance": "Appearance",
        "eating_mental_health": "Eating & Mental Health",
        "maternal_mental_health": "Maternal Mental Health ",
        "menstrual_health_stigmas": "Menstrual Health & Stigmas",
        "mental_health_during_menstruation": "Mental Health During Menstruation",
        "mental_health_toolbox": "Mental Health Toolbox",
        "social_pressures": "Social Pressures",
        "eating_health": "Eating & Health",
        "nutrition_throughout_the_cycle": "Nutrition Throughout the Cycle",
        "periods_society_taboos_misconceptions": "Period & Society: Taboos & Misconceptions",
        "body_care": "Body Care",
        "body_changes": "Body Changes",
        "body_hair_growth": "Body Hair Growth",
        "breast_development": "Breast Development",
        "facial_care": "Facial Care",
        "period_basics": "Period Basics",
        "cravings": "Cravings",
        "pain_relief": "Pain Relief",
        "common_health_concerns": "Common Health Concerns",
        "introduction_to_medical_examinations": "Introduction to Medical Examinations"
    },
    "kn": {
        "exercises_for_phases_of_your_cycle": "ನಿಮ್ಮ ಪಿರಿಯಡ್  ಹಂತಗಳಿಗೆ ತಕ್ಕ  ವ್ಯಾಯಾಮಗಳು",
        "post_pregnancy": "ಗರ್ಭಾವಸ್ಥೆಯ ನಂತರ",
        "pre_pregnancy": "ಗರ್ಭಧಾರಣೆಯ ಪೂರ್ವ",
        "pregnancy": "ಗರ್ಭಾವಸ್ಥೆ",
        "pregnancy_common_complications": "ಗರ್ಭಾವಸ್ಥೆ: ಸಾಮಾನ್ಯ ತೊಡಕುಗಳು",
        "pregnancy_prenatal_care": "ಗರ್ಭಾವಸ್ಥೆ: ಪ್ರಸವಪೂರ್ವ ಆರೈಕೆ",
        "pregnancy_wellbeing": "ಗರ್ಭಾವಸ್ಥೆ: ಯೋಗಕ್ಷೇಮ",
        "things_to_know": "ತಿಳಿಯಬೇಕಾದ ವಿಷಯಗಳು",
        "menstrual_health_hygiene": "ಋತುಚಕ್ರದ ಆರೋಗ್ಯ & ನೈರ್ಮಲ್ಯ",
        "menstrual_how_tos": "ಋತುಚಕ್ರ : ಹೇಗೆ ನೋಡಿಕೊಳ್ಳುವುದು",
        "menstruation_basics": "ಋತುಚಕ್ರದ ಮೂಲ ಮಾಹಿತಿಗಳು",
        "appearance": "ತೋರಿಕೆ",
        "eating_mental_health": "ಆಹಾರ ಮತ್ತು ಮಾನಸಿಕ ಆರೋಗ್ಯ",
        "maternal_mental_health": "ಗರ್ಭಾವಸ್ಥೆ: ಯೋಗಕ್ಷೇಮ",
        "menstrual_health_stigmas": "ಋತುಚಕ್ರದ ಆರೋಗ್ಯ ಮತ್ತು ಕಳಂಕ",
        "mental_health_during_menstruation": "ಮಂದಸ್ಥಿತಿ ಸಮಯದಲ್ಲಿ ಮಾನಸಿಕ ಆರೋಗ್ಯ",
        "mental_health_toolbox": "ಮಾನಸಿಕ ಆರೋಗ್ಯ ಟೂಲ್‌ಬಾಕ್ಸ್",
        "social_pressures": "ಸಾಮಾಜಿಕ ಒತ್ತಡಗಳು",
        "eating_health": "ಆಹಾರ ಮತ್ತು ಆರೋಗ್ಯ",
        "nutrition_throughout_the_cycle": "ಋತುಚಕ್ರದ ಉದ್ದಕ್ಕೂ ಆಹಾರ ಪೋಷಣೆ",
        "periods_society_taboos_misconceptions": "ಮುಟ್ಟು  ಮತ್ತು ಸಮಾಜ: ನಿಶಿದ್ಧ ಮತ್ತು ತಪ್ಪು ಕಲ್ಪನೆಗಳು",
        "body_care": "ದೇಹದ ಕಾಳಜಿ",
        "body_changes": "ದೇಹದ ಬದಲಾವಣೆಗಳು",
        "body_hair_growth": "ದೇಹದ ಕೂದಲಿನ ಬೆಳವಣಿಗೆ",
        "breast_development": "ಸ್ತನಗಳ  ಬೆಳವಣಿಗೆ ",
        "facial_care": "ಮುಖದ ಆರೈಕೆ",
        "period_basics": "ಪಿರಿಯಡಿನ  ಮೂಲಭೂತ ಅಂಶಗಳು",
        "cravings": "ಕಡುಬಯಕೆಗಳು",
        "pain_relief": "ನೋವನ್ನು ತಗ್ಗಿಸುವುದು",
        "common_health_concerns": "ಸಾಮಾನ್ಯ ಆರೋಗ್ಯ ಸಮಸ್ಯೆಗಳು",
        "introduction_to_medical_examinations": "ವೈದ್ಯಕೀಯ ಪರೀಕ್ಷೆಗಳ ಪರಿಚಯ"
    },
    "hi": {
        "exercises_for_phases_of_your_cycle": "आपकी अवधि के चरणों के लिए उपयुक्त व्यायाम",
        "post_pregnancy": "गर्भावस्था के बाद",
        "pre_pregnancy": "गर्भावस्था के पहले",
        "pregnancy": "गर्भावस्था",
        "pregnancy_common_complications": "गर्भावस्था - आम परेशानियाँ",
        "pregnancy_prenatal_care": "गर्भावस्था -  प्रसवपूर्व सुरक्षा",
        "pregnancy_wellbeing": "गर्भावस्था - भलाई",
        "things_to_know": "ये जानें",
        "menstrual_health_hygiene": "मासिक धर्म चक्र स्वास्थ्य और स्वास्थ्य कारिता",
        "menstrual_how_tos": "माहवारी विधियाँ",
        "menstruation_basics": "माहवारी की आधार भूत जानकारी",
        "appearance": "उपस्थिति",
        "eating_mental_health": "खाने और मानसिक स्वास्थ्य",
        "maternal_mental_health": "मातृक स्वास्थ्य",
        "menstrual_health_stigmas": "मासिक धर्म स्वास्थ्य और कलंक",
        "mental_health_during_menstruation": "मासिक धर्म के दौरान मासिक स्वास्थ्य",
        "mental_health_toolbox": "मानसिक स्वास्थ्य टूलबॉक्स",
        "social_pressures": "सामाजिक दबाव",
        "eating_health": "खाना और स्वास्थ्य",
        "nutrition_throughout_the_cycle": "चक्र के दौरान पोषण",
        "periods_society_taboos_misconceptions": "मासिक धर्म चक्र और समाज - वर्जान और मुग़ालते",
        "body_care": "शरीर की देखभाल",
        "body_changes": "शरीर में परिवर्तन",
        "body_hair_growth": "शरीर के बालों की वृद्धि",
        "breast_development": "स्तनों का विकास",
        "facial_care": "चेहरे की देखभाल",
        "period_basics": "मासिक धर्म की महत्वपूर्ण जानकारी",
        "cravings": "ललकें",
        "pain_relief": "दर्द से राहत",
        "common_health_concerns": "आम स्वास्थ्य की पीड़ाएँ",
        "introduction_to_medical_examinations": "चिकित्सीय परीक्षाओं का प्रस्तुतीकरण"
    }
}

export const topicsToImages = {
    "exercise": require('../../assets/resources_images/exercise_banner.png'),
    "maternal_health": require('../../assets/resources_images/maternal_health_banner.png'),
    "menstruation": require('../../assets/resources_images/menstruation_banner.png'),
    "mental_health": require('../../assets/resources_images/mental_health_banner.png'),
    "nutrition": require('../../assets/resources_images/nutrition_banner.png'),
    "physical_changes": require('../../assets/resources_images/growing_up_banner.png'),
    "recipe_hub": require('../../assets/resources_images/nutrition_banner.png'),
    "reproductive_health": require('../../assets/resources_images/reproductive_health_banner.png')
}

export const mockData2 = [
    { // each object represents a topic
        image: 'menstruation', // from topic to image map
        en: {
            title: 'Menstruation', // from topic map
            sections: [
                {
                    title: 'Menstruation Basics', // from section map
                    articles: [
                        {
                            title: 'An Average/Normal Period',
                            text: 'Some text here',
                        }
                    ]
                }
            ]
        },
        kn: {
            title: 'ಋತುಚಕ್ರ (ಪಿರಿಯಡ್)', // from topic map
            sections: [
                {
                    title: 'ಋತುಚಕ್ರ ಬೇಸಿಗೆಯ ಸಾಮಾನ್ಯ ವಿವರಗಳು', // from section map
                    articles: [
                        {
                            title: 'ಸಾಮಾನ್ಯ ಋತುಚಕ್ರ',
                            text: 'ಇಲ್ಲಿ ಕೆಲವು ಪಠ್ಯಗಳಿವೆ',
                        }
                    ]
                }
            ]
        },
        hi: {

        }
    }
]

export const mockData = [
    // beginning of red-background items in the home screen
    {
        title: 'Saved',
        data: [
          {
            key: '1',
            text: 'How to Soothe Cramps',
            image: 'menstruation'
          },
          {
            key: '2',
            text: 'See All'
          },
        ],
    },
    {
        title: 'Recently Viewed',
        data: [
          {
            key: '3',
            text: 'What to Do on Your Period',
            image: 'menstruation'
          },
          {
            key: '4',
            text: 'Eating and Health',
            image: 'growing_up'
          }
        ],
    },

    // beginning of purple-background items in the home screen
    {
        title: 'Menstruation',
        data: [
            {
                key: '5',
                text: 'Period Basics',
                image: 'menstruation',
                introText: 'Menstruation, or a “period”, is when a girl or woman loses blood through her vagina every month. This is a normal biological process. Taking care of yourself before, during, and after your period is important because you can experience many different health changes. In this section, you can learn more information about periods, how to contain bleeding, and what health issues to expect related to your period.',
                topics: [
                    {
                      key: '1',
                      text: 'The Cycle'
                    },
                    {
                      key: '2',
                      text: 'First Period',
                      introText: 'First Period? A girl generally begins menstruation between the ages of 8 and 15, or two years after her breasts start to develop and pubic hair begins to grow. The age your biological mother got her first period could also be a good indicator for when you get your first period. ',
                      images: [
                        require('../../assets/resources_images/period.png')
                      ],
                      otherText: 'Other things such as ethnicity, body weight, health, and exercise can also impact when you get your first period. If a period starts later or earlier than this range, it is best to consult a doctor to figure out what’s going on.'
                    },
                    {
                        key: '3',
                        text: 'What to do'
                    },
                    {
                        key: '4',
                        text: 'Menopause'
                    },
                    {
                        key: '5',
                        text: 'Average Period'
                    },
                    {
                        key: '6',
                        text: 'Irregular Period'
                    },
                    {
                        key: '7',
                        text: 'Blood Clots'
                    }
                ],
            },
            {
                key: '6',
                text: "How-to's",
                image: 'menstruation'
            },
            {
                key: '7',
                text: 'Health and Hygiene',
                image: 'menstruation'
            },
            {
                key: '8',
                text: 'Taboos and Misconceptions',
                image: 'menstruation'
            },
        ],
    },
    {
        title: 'Sexual Health',
        data: [
            {
                key: '9',
                text: 'What is Sexual Health?',
                image: 'sexual_health'
            },
            {
                key: '10',
                text: "Barrier Methods",
                image: 'sexual_health'
            },
            {
                key: '11',
                text: 'Forms of Contraception',
                image: 'sexual_health'
            },
        ],
    },
    {
        title: 'Maternal Health',
        data: [
            {
                key: '12',
                text: 'Maternal Health Basics',
                image: 'maternal_health'
            },
            {
                key: '13',
                text: "Things to know",
                image: 'maternal_health'
            },
            {
                key: '14',
                text: "Pre - pregnancy",
                image: 'maternal_health'
            },
            {
                key: '15',
                text: "Pregnancy",
                image: 'maternal_health'
            },
            {
                key: '16',
                text: "Wellbeing",
                image: 'maternal_health'
            },
            {
                key: '17',
                text: "Pre-natal care",
                image: 'maternal_health'
            },
            {
                key: '18',
                text: "Post-pregnancy",
                image: 'maternal_health'
            },
            {
                key: '19',
                text: "Complications",
                image: 'maternal_health'
            },
        ],
    },
    {
        title: 'Reproductive Health',
        data: [
            {
                key: '20',
                text: 'Maternal Health Basics',
                image: 'reproductive_health'
            },
            {
                key: '21',
                text: "Things to know",
                image: 'reproductive_health'
            },
            {
                key: '22',
                text: "Pre - pregnancy",
                image: 'reproductive_health'
            },
        ]
    },
    {
        title: 'Nutrition',
        data: [
            {
                key: '23',
                text: 'Nutrition Throughout the Cycle',
                image: 'nutrition'
            },
            {
                key: '24',
                text: 'Eating and Health',
                image: 'nutrition'
            },
            {
                key: '25',
                text: 'Recipe Hub',
                image: 'nutrition'
            },
        ]
    },
    {
        title: 'Exercise',
        data: [
            {
                key: '26',
                text: 'Why Exercise?',
                image: 'exercise'
            },
            {
                key: '27',
                text: 'Menstrual Phase',
                image: 'exercise'
            },
            {
                key: '28',
                text: 'Follicular Phase',
                image: 'exercise'
            },
            {
                key: '29',
                text: 'Ovulatory Phase',
                image: 'exercise'
            },
            {
                key: '30',
                text: 'Luteal Phase',
                image: 'exercise'
            },
        ],
    },
    {
        title: 'Mental Health',
        data: [
            {
                key: '31',
                text: 'Maternal Mental Health',
                image: 'mental_health'
            }, 
            {
                key: '32',
                text: 'Adolescent Mental Health',
                image: 'mental_health'
            },
        ]
    },
    {
        title: 'Growing Up',
        data: [
            {
                key: '33',
                text: 'Physical Body Changes',
                image: 'growing_up'
            },
            {
                key: '34',
                text: 'Period Basics',
                image: 'growing_up'
            },
            {
                key: '35',
                text: 'Breast Development',
                image: 'growing_up'
            },
            {
                key: '36',
                text: 'Body Hair',
                image: 'growing_up'
            },
            {
                key: '37',
                text: 'Facial Care',
                image: 'growing_up'
            },
            {
                key: '38',
                text: 'Body Care',
                image: 'growing_up'
            },
        ]
    }
]
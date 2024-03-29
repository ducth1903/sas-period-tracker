# Period symptoms template
# If updated, need to update on Frontend too!
default_template = [
    {
        "key": "flow",
        "title": "Flow",
        "titleColor": "#FF6F72",
        "iconBackgroundColor": "#d8adfe",
        "multipleChoices": False,
        "availableOptions": ["Light", "Medium", "Heavy", "Unusually Heavy", "Spotting"],
        "availableOptions_id": [
            "light",
            "medium",
            "heavy",
            "unusually_heavy",
            "spotting",
        ],
        "isChecked": [False, False, False, False, False],
        "description": "Info for Flow",
    },
    {
        "key": "collection",
        "title": "Collection Method",
        "titleColor": "#F3692B",
        "iconBackgroundColor": "#a9d8ff",
        "multipleChoices": True,
        "availableOptions": [
            "Disposable Pad",
            "Tampon",
            "Menstrual Cup",
            "Resuable Pad",
            "Period Underwear",
            "Panty Liner",
        ],
        "availableOptions_id": [
            "disposable_pad",
            "tampon",
            "menstrual_cup",
            "reusable_pad",
            "period_underwear",
            "panty_liner",
        ],
        "isChecked": [False, False, False, False, False, False],
        "description": "Info for Collection method",
    },
    {
        "key": "discharge",
        "title": "Discharge",
        "titleColor": "#0697FF",
        "iconBackgroundColor": "#febccf",
        "multipleChoices": True,
        "availableOptions": [
            "Thin/clear",
            "Stringy",
            "creamy",
            "Sticky",
            "Watery",
            "Spotting",
            "Transparent",
        ],
        "availableOptions_id": [
            "thin_clear",
            "stringy",
            "creamy",
            "sticky",
            "watery",
            "spotting",
            "transparent",
        ],
        "isChecked": [False, False, False, False, False, False, False],
        "description": "Info for Discharge",
    },
    {
        "key": "symptoms",
        "title": "Symptoms",
        "titleColor": "#FF9900",
        "iconBackgroundColor": "#a9d8ff",
        "multipleChoices": True,
        "availableOptions": [
            "Headache",
            "Cramps",
            "Backache",
            "Fatigue",
            "Tender Breasts",
            "Acne",
            "Bloating",
            "Craving",
            "Nausea",
        ],
        "availableOptions_id": [
            "headache",
            "cramps",
            "backache",
            "fatigue",
            "tender_breasts",
            "acne",
            "bloating",
            "craving",
            "nausea",
        ],
        "isChecked": [False, False, False, False, False, False, False, False, False],
        "description": "Info for symptoms",
    },
    {
        "key": "mood",
        "title": "Mood",
        "titleColor": "#006666",
        "iconBackgroundColor": "#a9d8ff",
        "multipleChoices": True,
        "availableOptions": [
            "Content",
            "Excited",
            "Sad",
            "Angry",
            "Sensitive",
            "Anxious",
            "Stressed",
            "Self-critical",
            "Other",
        ],
        "availableOptions_id": [
            "content",
            "excited",
            "sad",
            "angry",
            "sensitive",
            "anxious",
            "stressed",
            "self_critical",
            "other",
        ],
        "isChecked": [False, False, False, False, False, False, False, False, False],
        "description": "Info for Mood",
    },
]
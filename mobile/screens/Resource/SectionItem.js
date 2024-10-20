import i18n from '../../translations/i18n';
import {
    StyleSheet,
    Text,
    View,
    Pressable,
    ImageBackground,
    StatusBar,
} from 'react-native';

export default function SectionItem({ item, selectedSettingsLanguage, navigation }) {
    let paramResource = {};
    paramResource[selectedSettingsLanguage] = {
        introText: item.parentTopicObject[selectedSettingsLanguage].introText,
        sectionTitle: item.sectionTitle,
        articles: item.articles
    }

    // get array of other languages not currently selected
    let otherLanguages = Object.keys(i18n.translations).filter((lang) => lang !== selectedSettingsLanguage);

    // horribly inefficient, but it works for now :(, also not resilient to there being different education content between languages
    for (const lang in otherLanguages) {
        const otherLang = otherLanguages[lang];
        
        const introText = item.parentTopicObject[otherLang].introText;
        const matchingSection = item.parentTopicObject[otherLang].sections.find((section) => section.sectionId === item.sectionId);
        const sectionTitle = matchingSection.sectionTitle;
        const articles = matchingSection.articles;
        
        paramResource[otherLang] = { introText, sectionTitle, articles }
    }

    return (
        <Pressable onPress={() => navigation.navigate('ResourceContent', { resource: paramResource } )}>
            <ImageBackground source={{uri: item["parentTopicObject"]["image"]}} style={styles.sectionBox} imageStyle={{ borderRadius: 15 }}>
                <View style={styles.darkness} />
                <Text style={styles.sectionBoxText}>{item["sectionTitle"]}</Text>
            </ImageBackground>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    sectionBox: {
        margin: 20,
        width: 180,
        height: 180,
        backgroundColor: '#D9D1F7',
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 5,
        marginRight: 5,
    },
    sectionBoxText: {
        color: 'white',
        fontSize: 22,
        fontWeight: '600',
        textAlign: 'center',
        width: '100%',
    },
    darkness: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.2)',
        borderRadius: 15,
    },
})

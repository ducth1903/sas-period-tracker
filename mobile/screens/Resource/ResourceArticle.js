import React, { useEffect, useContext, useState}  from 'react';
import { 
    StyleSheet, 
    Text, 
    View,  
    FlatList,
    Pressable, 
    SafeAreaView,  
    StatusBar,
    Image,
    ScrollView,
    TouchableOpacity,
    TextInput,
    KeyboardAvoidingView
} from 'react-native';
import RESOURCE_TEMPLATE from '../../models/ResourceModel';
// import { AuthContext } from '../../navigation/AuthProvider'; 
import { MARKDOWN_S3_URL } from '@env';
import { useNavigation } from '@react-navigation/native';

import BackIcon from '../../assets/icons/back.svg';
import TranslateIcon from '../../assets/icons/translate.svg';
import SpeakerIcon from '../../assets/icons/speaker.svg';
import SaveInitialIcon from '../../assets/icons/save-initial.svg';
import SaveAfterIcon from '../../assets/icons/save-after.svg';

const mockData = [
    {
        title: 'Saved',
        data: [
          {
            key: '1',
            text: 'How to Soothe Cramps'
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
            key: '1',
            text: 'What to Do on Your Period'
          },
          {
            key: '2',
            text: 'The First Period'
          }
        ],
    },
    {
        title: 'Menstruation',
        data: [
            {
                key: '1',
                text: 'Period Basics'
            },
            {
                key: '2',
                text: "How-to's"
            },
            {
                key: '3',
                text: 'Health and Hygiene'
            },
            {
                key: '4',
                text: 'Taboos and Misconceptions'
            },
        ],
    }
]

const ResourceArticle = ({ route, navigation }) => {

    const { outerResource, resource } = route.params;
    const [save, setSave] = useState(false);
    const images = resource.images

    const PurpleListItem = ({ item }) => {
        return (
          <Pressable onPress={() => navigation.navigate('ResourceArticle', {resource: resource})}>
                <View style={styles.purpleBox}>
                    <Text style={styles.purpleBoxText}>{item.text}</Text>
                </View>
          </Pressable>
        );
    };

    return (
        <SafeAreaView>
            <View style={styles.topBarInline}>
                    <TouchableOpacity onPress={() => navigation.navigate('ResourceContent', { resource: outerResource })}>
                        <BackIcon style={styles.headerBackIcon} />
                    </TouchableOpacity>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '13%', marginRight: 35, marginTop: 10}}>
                        <TranslateIcon style={styles.translateIcon}/>
                        <SpeakerIcon style={styles.speakerIcon}/>
                    </View>
            </View>
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.headerInline}>
                    <Text style={styles.headerText}>{resource.text}</Text>
                    <TouchableOpacity onPress={() => setSave(!save)}>
                        {/* TODO: upload to user's saved articles */}
                        {save ? <SaveAfterIcon style={styles.saveIcon}/> : <SaveInitialIcon style={styles.saveIcon}/>}
                    </TouchableOpacity>
                </View>
                {/* <View style={styles.introText}>
                    <Text style={styles.introTextContent}>{resource.introText}</Text>
                </View>
                <View style={styles.images}>
                    <Image source={images[0]} style={styles.periodImage}/>
                </View>
                <View style={styles.introText}>
                    <Text style={styles.introTextContent}>{resource.otherText}</Text>
                </View> */}
                <View style={styles.container}>
                    <TextInput
                        multiline={true}
                        numberOfLines={4}
                        placeholder="Add a note..."
                        style={styles.noteInput}
                    />
                </View>
                <View style={{marginTop: 20, marginBottom: 10}}>
                    {/* TODO: link to next article */}
                    <Text style={styles.scrollText}>tap to see next article</Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        padding: 20,
        justifyContent: 'center',
    },
    headerText: {
        fontSize: 35,
        fontWeight: "600",
        color: "black",
        textAlign: "center",
        marginTop: 10
    },
    headerBackIcon: {
        width: 11,
        height: 21,
        marginTop: 10,
        marginRight: 40,
        marginLeft: 35
    },
    headerSearchIcon: {
        width: 30, 
        height: 30, 
        marginTop: 10, 
        marginLeft: 30,
    },
    inline: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'left',
        alignItems: 'center',
        width: '100%',
    },
    introText: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '80%',
        marginLeft: '8%',
        marginTop: 25,
    },
    introTextContent: {
        fontSize: 15.8,
        fontWeight: "400",
        color: "black",
        textAlign: "left",
    },
    scrollText: {
        fontSize: 17.8,
        fontWeight: "600",
        color: "black",
        textAlign: "center",
        textDecorationLine: 'underline',
        marginBottom: 150
    },
    scrollIcon: {
        width: 20,
        height: 12.43,
        alignSelf: 'center',
        marginTop: 15,
    },
    redBox: {
        margin: 20,
        width: 250,
        height: 170,
        backgroundColor: '#FF7F73',
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 5,
        marginRight: 5,
    },
    redBoxText: {
        color: 'white',
        fontSize: 24,
        fontWeight: '600',
        textAlign: 'center',
        width: '80%',
    },
    purpleBox: {
        margin: 20,
        width: 150,
        height: 150,
        backgroundColor: '#D9D1F7',
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 5,
        marginLeft: 0,
        marginTop: 20,
        marginBottom: 10,
    },
    purpleBoxText: {
        color: 'black',
        fontSize: 15,
        fontWeight: '600',
        textAlign: 'center',
        width: '100%',
    },
    topicsList: {
        width: '90%',
        marginLeft: 30,
        marginBottom: 60,
    },
    translateIcon: {
        width: 21,
        height: 17,
    },
    speakerIcon: {
        width: 20,
        height: 19,
    },
    topBarInline: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
    },
    headerInline: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        marginTop: 15,
        marginLeft: 5,
    },
    saveIcon: {
        width: 20,
        height: 26,
        marginTop: 12,
        marginLeft: -10,
    },
    periodImage: {
        width: 200,
        height: 200,
        marginTop: 20,
        marginLeft: 30,
    },
    noteInput: {
        width: 320,
        height: 150,
        backgroundColor: '#F2F2F2',
        borderWidth: 1,
        borderRadius: 15,
        borderColor: '#005C6A',
        marginTop: 40,
        padding: 20,
        paddingTop: 20,
        fontSize: 15,
        color: '#005C6A'
    },
})

export default ResourceArticle;

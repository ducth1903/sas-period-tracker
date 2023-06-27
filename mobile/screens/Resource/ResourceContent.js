import React, { useEffect, useContext, useState } from 'react';
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
    TouchableOpacity
} from 'react-native';
import RESOURCE_TEMPLATE from '../../models/ResourceModel';
// import { AuthContext } from '../../navigation/AuthProvider'; 
// import { MARKDOWN_S3_URL } from '@env';
import { useNavigation } from '@react-navigation/native';

import BackIcon from '../../assets/icons/back.svg';
import ScrollIcon from '../../assets/icons/scroll.svg';

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

const ResourceContent = ({ route, navigation }) => {

    const { resource } = route.params;

    const PurpleListItem = ({ item }) => {
        return (
            <Pressable onPress={() => navigation.navigate('ResourceArticle', { outerResource: resource, resource: item })}>
                <View style={styles.purpleBox}>
                    <Text style={styles.purpleBoxText}>{item.text}</Text>
                </View>
            </Pressable>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.inline}>
                <TouchableOpacity onPress={() => navigation.navigate('ResourceHomeScreen')}>
                    <BackIcon style={styles.headerBackIcon} />
                </TouchableOpacity>
                <Text style={styles.headerText}>{resource.text}</Text>
                {/* <TouchableOpacity onPress={() => navigation.navigate('ResourceSearch')}>
                        <Image source={require('../../assets/icons/search.svg')} style={styles.headerSearchIcon}/>
                    </TouchableOpacity> */}
            </View>
            <ScrollView>
                <View style={styles.introText}>
                    <Text style={styles.introTextContent}>{resource.introText}</Text>
                </View>
                <View style={{ marginTop: 20, marginBottom: 10 }}>
                    <Text style={styles.scrollText}>scroll to see topics</Text>
                    <ScrollIcon style={styles.scrollIcon} />
                </View>

                <View style={styles.topicsList}>
                    {
                        // group into pairs of two
                        resource.topics.reduce((groupedArr, topic, index) => {
                            if (index % 2 == 0) {
                                groupedArr.push([topic]);
                            } else {
                                groupedArr[groupedArr.length - 1].push(topic);
                            }
                            return groupedArr;
                        }, []).map((pair, index) => {
                            return (
                                <View style={{ marginLeft: 'auto', marginRight: 'auto' }} key={index}>
                                    <PurpleListItem item={pair[0]} />
                                    {pair.length > 1 ? <PurpleListItem item={pair[1]} /> : null}
                                </View>
                            )
                        })
                    }
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    headerText: {
        fontSize: 35,
        fontWeight: "600",
        color: "black",
        textAlign: "center",
        marginTop: 10,
        width: 230,
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
    // not the same style as purpleBox in ResourceHomeScreen.js; this style has no built-in margins to be more flexible
    purpleBox: {
        marginBottom: 30,
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
    },
    purpleBoxText: {
        color: 'black',
        fontSize: 15,
        fontWeight: '600',
        textAlign: 'center',
        width: '100%',
    },
    topicsList: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignSelf: 'center',
        marginBottom: 60,
        width: '90%'
    }
})

export default ResourceContent;

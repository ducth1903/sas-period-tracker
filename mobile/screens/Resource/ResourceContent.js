import React, { useContext } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Pressable,
    SafeAreaView,
    StatusBar,
    ScrollView,
    TouchableOpacity,
    Platform
} from 'react-native';

import { SettingsContext } from '../../navigation/SettingsProvider';
import i18n from '../../translations/i18n';

import BackIcon from '../../assets/icons/back.svg';
import ScrollIcon from '../../assets/icons/scroll.svg';

const ResourceContent = ({ route, navigation }) => {
    const { resource } = route.params;
    const { selectedSettingsLanguage } = useContext(SettingsContext);

    const ArticleItem = ({ item }) => {
        return (
            <Pressable onPress={() => navigation.navigate('ResourceArticle', { outerResource: resource, resource: item })}>
                <View style={styles.articleBox}>
                    <Text style={styles.articleBoxText}>{item.articleTitle}</Text>
                </View>
            </Pressable>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View>
                <TouchableOpacity
                    style={{alignSelf: 'flex-start', marginTop: 10, marginLeft: Platform.OS === "ios" ? 20 : 0}}
                    onPress={() => navigation.navigate('ResourceHomeScreen')}
                >
                    <BackIcon />
                </TouchableOpacity>

                <View style={styles.inline}>
                    <Text style={styles.headerText}>{resource.sectionTitle}</Text>
                    {/* <TouchableOpacity onPress={() => navigation.navigate('ResourceSearch')}>
                            <Image source={require('../../assets/icons/search.svg')} style={styles.headerSearchIcon}/>
                        </TouchableOpacity> */}
                    {/* <View className="h-[4px] w-full rounded-md bg-[#EDEEE0]"></View> */}
                </View>

                <View style={styles.divider} />
                
                <ScrollView persistentScrollbar={true}>
                    <View style={{marginHorizontal: Platform.OS === "ios" ? 25 : 0}}>
                        <View style={styles.introText}>
                            <Text style={styles.introTextContent}>{resource.introText}</Text>
                        </View>
                    </View>
                    <View style={styles.backIcon}>
                        <Text style={styles.scrollText}>{i18n.t('education.scrolltoSeeTopics')}</Text>
                        <ScrollIcon style={styles.scrollIcon} />
                    </View>

                    <View style={styles.topicsList}>
                        {
                            // group into pairs of two
                            resource.articles.reduce((groupedArr, topic, index) => {
                                if (index % 2 == 0) {
                                    groupedArr.push([topic]);
                                } else {
                                    groupedArr[groupedArr.length - 1].push(topic);
                                }
                                return groupedArr;
                            }, []).map((pair, index) => {
                                return (
                                    <View style={{ justifyContent: 'space-between', flexDirection: 'row' }} key={index}>
                                        <ArticleItem item={pair[0]} />
                                        {pair.length > 1 ? <ArticleItem item={pair[1]} /> : <View style={styles.placeHolder} />}
                                    </View>
                                )
                            })
                        }
                    </View>
                </ScrollView>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        // alignContent: 'center',
        backgroundColor: '#FEFFF4',
        paddingTop: StatusBar.currentHeight,
        paddingHorizontal: 20,
    },
    backIcon: {
        marginTop: 20,
        marginBottom: 10
    },
    headerText: {
        fontSize: 32,
        flexGrow: 1,
        fontWeight: "600",
        color: "black",
        textAlign: "center",
        marginTop: 10,
        color: "#5B9F8F",
    },
    divider: {
        backgroundColor: '#EDEEE0',
        height: 4,
        width: '90%',
        marginTop: 10,
        borderRadius: 20,
        alignSelf: 'center',
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
        alignItems: 'center',
        width: '100%',
        flexDirection: 'column'
    },
    introText: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
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
    articleBox: {
        marginBottom: 30,
        width: 155,
        height: 155,
        backgroundColor: "#8FD3C3",
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 5,
        paddingVertical: 2,
        paddingHorizontal: 4
    },
    articleBoxText: {
        color: 'black',
        fontSize: 14,
        fontWeight: '400',
        textAlign: 'center',
        width: '100%',
        lineHeight: 20
    },
    placeHolder: {
        marginBottom: 30,
        width: 155,
        height: 155,
        backgroundColor: "#FEFFF4",
        borderRadius: 15,
    },
    topicsList: {
        flex: 1,
        flexDirection: 'column',
        flexWrap: 'wrap',
        alignSelf: 'center',
        marginBottom: 150,
        paddingHorizontal: Platform.OS === "ios" ? 20 : 0,
        width: '100%',
    }
})

export default ResourceContent;

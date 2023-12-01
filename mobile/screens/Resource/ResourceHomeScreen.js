import { useEffect, useState, useContext, useCallback } from 'react';
import {
    StyleSheet,
    Text,
    View,
    FlatList,
    Pressable,
    SafeAreaView,
    StatusBar,
    ScrollView,
    RefreshControl,
    ImageBackground,
    useWindowDimensions
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../../navigation/AuthProvider'; 
import { Skeleton } from '@rneui/themed';
import { SettingsContext } from '../../navigation/SettingsProvider';
import { useNavigation } from '@react-navigation/native';
// import { topicsToTitles, sectionsToTitles, topicsToImages } from './resourceMaps'; // ! don't use these, use the ones in sas-metadata in S3
import SearchIcon from '../../assets/icons/search.svg'
import i18n from '../../translations/i18n';
import SectionItem from './SectionItem';
import ArticleItem from './ArticleItem';

// Loading env variables
import getEnvVars from '../../environment';
const { API_URL } = getEnvVars();

const ResourceHomeScreen = ({ navigation, props }) => {
    const { width, height } = useWindowDimensions();
    const { userId } = useContext(AuthContext);
    const { selectedSettingsLanguage } = useContext(SettingsContext);
    const [resourcesMap, setResourcesMap] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    
    function findFavorites(resourceMap, lang, favorites) {
        return resourceMap.map((topicObject) => {
            return topicObject[lang]["sections"].map((sectionObject) => {
                return sectionObject["articles"].map((articleObject) => {
                    if (favorites.includes(articleObject["articleId"])) {
                        return articleObject;
                    }
                })
            })
        }).flat(2).filter((article) => article) // filter out null values
    }
    
    async function initFavoritedResources(resourceMap) {
        try {
            let favoritedResourcesResp = await AsyncStorage.getItem('favoritedResources');
            if (!favoritedResourcesResp) {
                const userKeyedFavoritedResources = {};
                await AsyncStorage.setItem('favoritedResources', JSON.stringify(userKeyedFavoritedResources)); // init empty saved resources
                favoritedResourcesResp = await AsyncStorage.getItem('favoritedResources');
            }
    
            let parsedResp = JSON.parse(favoritedResourcesResp);
            if (!parsedResp[userId]) {
                parsedResp[userId] = [];
                await AsyncStorage.setItem('favoritedResources', JSON.stringify(parsedResp));
                parsedResp = JSON.parse(await AsyncStorage.getItem('favoritedResources'));
            }
            
            const deviceFavoritedResources = JSON.parse(favoritedResourcesResp)
            // list of id's for favorited articles
            const userFavoritedResources = deviceFavoritedResources[userId];
    
            resourceMap.unshift({
                en: {
                    topicTitle: "Favorites",
                    articles: findFavorites(resourceMap, "en", userFavoritedResources)
                },
                kn: {
                    topicTitle: "ಮೆಚ್ಚಿದ ಲೇಖನಗಳು",
                    articles: findFavorites(resourceMap, "kn", userFavoritedResources)
                },
                hi: {
                    topicTitle: "पसंदीदा आलेख",
                    articles: findFavorites(resourceMap, "hi", userFavoritedResources)
                }
            })
        }
        catch (error) {
            console.log(`[ResourceHomeScreen] error initializing saved resources: ${error}`)
        }
    }
    
    async function fetchAllResources(attempts = 1) {
        try {
            setIsLoading(true);
            console.log(`[ResourceHomeScreen] fetching all resources attempt ${attempts}`)
            const contentResp = await fetch(`${API_URL}/resources/content`, { method: "GET" });
            const content = await contentResp.json();

            const metadataResp = await fetch(`${API_URL}/resources/metadata`, { method: "GET" });
            const metadata = await metadataResp.json();
            const { topics_to_titles, sections_to_titles, topics_to_images, articles_to_titles, articles_to_media } = metadata;
    
            // fetch text for each resource
            await Promise.all(content.map(async (item, index, arr) => {
                const resourceText = await fetchSingleResource(item["resource_url"]);
                const resourceId = item["resource_filename"].slice(3, -3); // remove .md and language from filename
                const resourceLang = item["resource_language"];

                const resourceTitle = articles_to_titles[resourceLang][resourceId];
                const resourceMedia = articles_to_media[resourceId];

                arr[index] = {
                    ...item,
                    "resource_text": resourceText,
                    "resource_title": resourceTitle,
                    "resource_media": resourceMedia,
                    "resource_id": resourceId,
                };
            }));

            // find unique topics
            let topics = content.map((item) => item["resource_topic"]);
            topics = [...new Set(topics)];

            let resourceMap = [];
            topics.forEach((topic) => {
                resourceMap.push({
                    image: topics_to_images[topic],
                    en: {
                        topicTitle: topics_to_titles["en"][topic],
                        introText: "",
                        sections: []
                    },
                    kn: {
                        topicTitle: topics_to_titles["kn"][topic],
                        introText: "",
                        sections: []
                    },
                    hi: {
                        topicTitle: topics_to_titles["hi"][topic],
                        introText: "",
                        sections: []
                    }
                });
            })

            content.forEach((item) => {
                const itemTopic = item["resource_topic"];
                const itemSection = item["resource_section"];
                const itemLanguage = item["resource_filename"].split("_")[0];
                const itemTitle = item["resource_title"];
                const itemText = item["resource_text"];
                const itemId = item["resource_id"];

                // this search might be too slow, but we'll see
                const topicObject = resourceMap.find((obj) => obj[itemLanguage]["topicTitle"] === topics_to_titles[itemLanguage][itemTopic]);

                if (!itemSection) { // is intro file, intro files don't have sections
                    topicObject[itemLanguage]["introText"] = itemText;
                    return;
                }
                
                // create new section object if it doesn't exist
                let sectionObject = topicObject[itemLanguage]["sections"].find((section) => section["sectionTitle"] === sections_to_titles[itemLanguage][itemSection]);
                if (!sectionObject) {
                    sectionObject = {
                        parentTopicObject: topicObject, // need copy in each section for FLatList renderItem
                        sectionId: itemSection,
                        sectionTitle: sections_to_titles[itemLanguage][itemSection],
                        articles: []
                    }
                    topicObject[itemLanguage]["sections"].push(sectionObject);
                }

                sectionObject.articles.push({
                    articleTitle: itemTitle,
                    articleText: itemText,
                    articleId: itemId,
                    articleMedia: articles_to_media[itemId]
                });
            });

            console.log(`[ResourceHomeScreen] fetch attempt ${attempts} successful`)

            // init saved resources and unshift them to the beginning of resourceMap
            await initFavoritedResources(resourceMap);

            setIsLoading(false);
            setResourcesMap(resourceMap);
        }
        catch (error) {
            // TODO: find a more robust solution to why this sometimes fails, but for now this is okay because it seems to help (I think it was just an android emulator error actually)
            if (attempts >= 6) {
                console.log(`[ResourceHomeScreen] resources still could not be fetched after ${attempts} attempts: ${error}`)
                return;
            }
            console.log(`[ResourceHomeScreen] Error fetching resources on attempt ${attempts}: ${error}`);
            fetchAllResources(attempts + 1)
        }
    }

    async function fetchSingleResource(resource_url) {
        const resp = await fetch(resource_url, { method: "GET" });
        const data = await resp.text();
        return data;
    }

    useEffect(() => {
        fetchAllResources();
    }, []);

    useEffect(() => {
        fetchAllResources();
    }, [selectedSettingsLanguage])

    const images = {
        exercise: require('../../assets/resources_images/exercise_banner.png'),
        growing_up: require('../../assets/resources_images/growing_up_banner.png'),
        maternal_health: require('../../assets/resources_images/maternal_health_banner.png'),
        menstruation: require('../../assets/resources_images/menstruation_banner.png'),
        mental_health: require('../../assets/resources_images/mental_health_banner.png'),
        nutrition: require('../../assets/resources_images/nutrition_banner.png'),
        reproductive_health: require('../../assets/resources_images/reproductive_health_banner.png'),
        sexual_health: require('../../assets/resources_images/sexual_health_banner.png'),
    }

    // Pull down to refresh
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setIsLoading(true)
        fetchAllResources();
        setRefreshing(false);
    }, []);

    if (isLoading) {
        return (
            <SafeAreaView className="bg-offwhite flex-1">
                <ScrollView
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                >
                    <Text className="text-[15px] font-semibold text-greydark text-center">{i18n.t('errors.pullDownToRefresh')}</Text>
                    <View className="min-h-[40vw] flex-1 justify-center items-center">
                        <Skeleton animation="pulse" width={width * 0.6} height={height * 0.05} />
                    </View>

                    <View className="pl-7 pr-7 items-center">
                        <Skeleton animation="pulse" width={width * 0.9} height={30} />
                        <View className="pt-7" />
                        <Skeleton animation="pulse" width={width * 0.9} height={200} />
                    </View>
                </ScrollView>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}            
            >
                <View style={styles.inline}>
                    <Text style={styles.headerText}>{ i18n.t('navigation.education') }</Text>
                    {/* <TouchableOpacity onPress={() => navigation.navigate('ResourceSearch')}>
                        <SearchIcon style={styles.headerSearchIcon} />
                    </TouchableOpacity> */}
                </View>

                {
                    resourcesMap.map((ele, index) => {
                        // console.log(`this is ele: ${JSON.stringify(ele, null, 2)}`)
                        if (index >= 1 && ele[selectedSettingsLanguage] && ele[selectedSettingsLanguage]["sections"]) {
                            if (ele[selectedSettingsLanguage]["sections"].length > 0) {
                                return (
                                    <View key={`${ele["en"]["topicTitle"]}-${index}`}>
                                        <Text style={styles.subHeaderText}>{ele[selectedSettingsLanguage]["topicTitle"]}</Text>
                                        <FlatList
                                            horizontal
                                            data={ele[selectedSettingsLanguage]["sections"]}
                                            renderItem={({ item }) => <SectionItem item={item} key={`${item["sectionTitle"]}`} selectedSettingsLanguage={selectedSettingsLanguage} navigation={navigation}/>}
                                            showsHorizontalScrollIndicator={false}
                                            style={{ marginBottom: -15 }}
                                            keyExtractor={(item, index) => `${item["sectionTitle"]}`}
                                        />
                                    </View>
                                )
                            }
                            else return null;
                        }
                        else if (ele[selectedSettingsLanguage] && ele[selectedSettingsLanguage]["articles"]) {
                            return (
                                <View key={`${ele["en"]["topicTitle"]}-${index}`}>
                                    <Text style={styles.subHeaderText}>{ele[selectedSettingsLanguage]["topicTitle"]}</Text>
                                    {
                                        ele[selectedSettingsLanguage]["articles"].length > 0 ?
                                        <FlatList
                                            horizontal
                                            data={ele[selectedSettingsLanguage]["articles"]}
                                            renderItem={({ item }) => <ArticleItem item={item} key={item.articleTitle} navigation={navigation} />}
                                            showsHorizontalScrollIndicator={false}
                                            style={{ marginBottom: -15 }}
                                            keyExtractor={(item, index) => item.articleTitle}
                                        />
                                        :
                                        <View style={styles.articleBox}>
                                            <View style={styles.darkness} />
                                            <Text style={styles.articleBoxText}>{i18n.t('education.noArticlesFavorited')}</Text>
                                        </View>
                                    }
                                    
                                </View>
                            )
                        }
                        else {
                            return null;
                        }
                    })
                }
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
        // marginLeft: 70,
    },
    headerSearchIcon: {
        width: 30,
        height: 30,
        marginTop: 10,
        marginLeft: 50
    },
    inline: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    articleBox: {
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
    articleBoxText: {
        color: 'white',
        fontSize: 24,
        fontWeight: '600',
        textAlign: 'center',
        width: '80%',
    },
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
    subHeaderText: {
        fontSize: 24,
        fontWeight: "600",
        color: "black",
        textAlign: "left",
        marginTop: 20,
        marginLeft: 20,
        marginBottom: -5
    },
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        // alignContent: 'center',
        backgroundColor: '#FEFFF4',
        paddingTop: StatusBar.currentHeight,
        paddingBottom: 40
    },
    menurow: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        //alignSelf: 'center',
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        // alignContent: 'center',
        //marginTop: 10,
        //borderWidth: 2,
        //borderColor: 'black',
        // backgroundColor: 'skyblue',
        //marginHorizontal: 20,
    },
    menubox: {
        flex: 1,
        justifyContent: "center",
        alignContent: "center",
        width: '80%',
        height: '50%',
        marginTop: '10%',
        marginBottom: '10%',
        marginLeft: '10%',
        marginRight: '10%',
        backgroundColor: 'blue',
        borderRadius: 20,
    },
    // scrollView: {
    //   backgroundColor: 'pink',
    //   marginHorizontal: 20,
    // },
    // heading: {
    //   fontSize: 40,
    //   fontWeight: "bold",
    //   color: "#ff7120",
    //   textAlign: "center",
    //   marginTop: 50,
    // },
    button: {
        alignItems: "center",
        justifyContent: "flex-end",
        //paddingVertical: 10,
        //paddingHorizontal: 20,
        //borderRadius: 5,
        //borderWidth: 2,
        elevation: 1,
        // backgroundColor: "orange",
        height: "100%",
        width: "100%",
        paddingBottom: "6%"
    },
    buttontext: {
        textAlign: "center",
        fontSize: 20,
        // fontWeight: "bold",
        color: "black",
    },
    footnote: {
        flex: 1,
        bottom: 0,
        alignItems: "center",
        justifyContent: "flex-end",
        marginBottom: 10,
    },
    imageButton: {
        flex: 1,
        resizeMode: "stretch",
        width: "100%",
        height: 150,
        paddingBottom: "10%",
        borderRadius: 20
    }
})

export default ResourceHomeScreen;

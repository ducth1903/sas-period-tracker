import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Accordion from 'react-native-collapsible/Accordion';
import { AntDesign } from '@expo/vector-icons';
import Markdown from 'react-native-markdown-display';
import LoadingIndicator from '../../components/LoadingIndicator';

// STYLE CONSTANTS
MARGIN          = '3%'
PADDING         = '3%'
BORDER_RADIUS   = 20

const ResourceMenstruationScreen = ({ route, navigation }) => {
    const resourcesJson = route.params['resourcesJson'][0];
    const [activeSections, setActiveSections] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [allContents, setAllContents] = useState(new Array(resourcesJson['mappings'].length));
    
    function getMarkdown(inURL) {
        return fetch(inURL, {
            method: "GET",
            headers: {
                // "Content-Type": "text/markdown",
                "Content-Type": "text/plain"
            }
        })
        .then(resp => resp.text())
        .then(data => {
            return data
        })
        .catch(error => console.log('Error: ', error))
    }

    async function getAllMarkdowns() {
        var fetches = resourcesJson['mappings'].map((ele) => getMarkdown(ele['s3Link']) );

        // Parallel fetching!
        await Promise.all(fetches)
        .then(resp => {
            let tmp = resourcesJson['mappings'].map((ele, ele_index) => {
                return {
                    'question': ele['question'],
                    'answer': resp[ele_index]
                }
            })
            setAllContents(tmp)
            setIsLoading(false)
        })
        .catch(error => {console.log(error)})
    }

    useEffect(() => {
        getAllMarkdowns()
    }, []);

    return (
        <View style={styles.container}>
            {isLoading ? <LoadingIndicator/> 
            : 
            <Accordion
            sections={allContents}
            activeSections={activeSections}
            onChange={(activeSections) => {
                setActiveSections(activeSections)
            }}
            renderAsFlatList={true}     // to make it scrollable
            keyExtractor={item => item['question'].toString()}
            underlayColor=''
            renderSectionTitle={() => {}}
            renderHeader={(content, index, isActive)=>{
                return (
                    <View 
                    style={[
                        isActive ? styles.itemHeaderActiveWrapper : styles.itemHeaderWrapper,
                        {flexDirection: 'row', justifyContent: 'space-between'}
                    ]}>
                        <View>
                            <Text style={styles.textHeader}>{content['question']}</Text>
                        </View>
                        <View>
                            {isActive ? 
                            <AntDesign name="upcircleo" size={24} color="black" />
                            :
                            <AntDesign name="downcircleo" size={24} color="black" />
                            }
                        </View>
                    </View>
                )
            }}
            renderContent={(content, index, isActive) => {
                return (
                    <View style={styles.itemContentWrapper}>
                        <Markdown style={markdownStyles}>{ content['answer'] }</Markdown>
                    </View>
                )
            }}
            />
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // alignItems: 'center',
        // justifyContent: 'center',
        backgroundColor: 'skyblue',
    },
    itemHeaderWrapper: {
        margin: MARGIN,
        padding: PADDING,
        borderRadius: BORDER_RADIUS,
        backgroundColor: 'white'
    },
    itemHeaderActiveWrapper: {
        margin: MARGIN,
        marginBottom: 0,
        padding: PADDING,
        borderTopLeftRadius: BORDER_RADIUS,
        borderTopRightRadius: BORDER_RADIUS,
        backgroundColor: 'white'
    },
    textHeader: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    itemContentWrapper: {
        flex: 1,
        // flexWrap: 'wrap',
        margin: MARGIN,
        marginTop: 0,
        padding: PADDING,
        borderBottomLeftRadius: BORDER_RADIUS,
        borderBottomRightRadius: BORDER_RADIUS,
        backgroundColor: 'white'
    },
})

const markdownStyles = StyleSheet.create({
    text: {
        // letterSpacing: 3
        lineHeight: 30
    }
})

export default ResourceMenstruationScreen;
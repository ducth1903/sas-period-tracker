import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Accordion from 'react-native-collapsible/Accordion';
import { AntDesign } from '@expo/vector-icons';
import { MENSTRUATION } from '../../models/ResourceModel';

// STYLE CONSTANTS
MARGIN          = '3%'
PADDING         = '3%'
BORDER_RADIUS   = 20

const ResourceMenstruationScreen = ({ props }) => {
    const [activeSections, setActiveSections] = useState([]);

    return (
        <View style={styles.container}>
            <Accordion
            sections={MENSTRUATION}
            activeSections={activeSections}
            onChange={(activeSections) => {
                setActiveSections(activeSections)
            }}
            renderAsFlatList={true}     // to make it scrollable
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
                        <Text>{content['answer']}</Text>
                    </View>
                )
            }}
            />
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
    }
})

export default ResourceMenstruationScreen;
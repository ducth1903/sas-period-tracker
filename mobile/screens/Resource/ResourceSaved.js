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
import SearchIcon from '../../assets/icons/search.svg';

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

const PurpleListItem = ({ item }) => {
    return (
        <View style={styles.purpleBox}>
            <Text style={styles.purpleBoxText}>{item.text}</Text>
        </View>
    );
};

const ResourceSaved = ({ navigation, props }) => {

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.inline}>
                <TouchableOpacity onPress={() => navigation.navigate('ResourceHomeScreen')}>
                    <BackIcon style={styles.headerBackIcon} />
                </TouchableOpacity>
                <Text style={styles.headerText}>Saved</Text>
                <TouchableOpacity onPress={() => navigation.navigate('ResourceSearch')}>
                    <SearchIcon style={styles.headerSearchIcon} />
                </TouchableOpacity>
            </View>
            <FlatList
                data={mockData[2].data}
                numColumns={1}
                renderItem={({ item }) => <PurpleListItem item={item} />}
                showsHorizontalScrollIndicator={false}
                style={{ marginTop: 20 }}
            />
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
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
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
        width: 330,
        height: 180,
        backgroundColor: '#D9D1F7',
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 5,
        marginLeft: 30,
        marginTop: 20,
        marginBottom: 10,
    },
    purpleBoxText: {
        color: 'black',
        fontSize: 22,
        fontWeight: '600',
        textAlign: 'center',
        width: '100%',
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

export default ResourceSaved;

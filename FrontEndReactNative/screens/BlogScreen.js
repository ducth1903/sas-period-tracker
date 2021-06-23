import React, {useContext, useState, Component} from 'react';
import { render } from 'react-dom';
import { StyleSheet, Text, View, Button, Alert, FlatList, Pressable, SafeAreaView, ScrollView, StatusBar } from 'react-native';
import { Card, FAB } from 'react-native-paper';

import { AuthContext } from '../navigation/AuthProvider'; 

const BlogScreen = ({ props }) => {
  const { userId } = useContext(AuthContext);

  return (
    <View style={styles.container}>
      <View>
        <View style={styles.menurow}>
          <View style={[styles.menubox]}>
            <Pressable style={styles.button} onPress={() => Alert.alert("Simple button pressed")}>
              <Text style={styles.buttontext}>More About Menstruation</Text>
            </Pressable>
          </View>
          <View style={[styles.menubox]}>
            <Pressable style={styles.button} onPress={() => Alert.alert("Simple button pressed")}>
              <Text style={styles.buttontext}>Nutrition</Text>
            </Pressable>
          </View>
          <View style={[styles.menubox]}>
            <Pressable style={styles.button} onPress={() => Alert.alert("Simple button pressed")}>
              <Text style={styles.buttontext}>Exercise</Text>
            </Pressable>
          </View>
          <View style={[styles.menubox]}>
            <Pressable style={styles.button} onPress={() => Alert.alert("Simple button pressed")}>
              <Text style={styles.buttontext}>Mental Health</Text>
            </Pressable>
          </View>
          <View style={[styles.menubox]}>
            <Pressable style={styles.button} onPress={() => Alert.alert("Simple button pressed")}>
              <Text style={styles.buttontext}>Sex Education</Text>
            </Pressable>
          </View>
          <View style={[styles.menubox]}>
            <Pressable style={styles.button} onPress={() => Alert.alert("Simple button pressed")}>
              <Text style={styles.buttontext}>Sustainability</Text>
            </Pressable>
          </View>
          <View style={[styles.menubox]}>
          </View>
          <View style={[styles.menubox]}>
          </View>
        </View>
      </View>
    </View>
  )
}

function ResourceScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Test Screen</Text>
      <Button
        title="Go to Details"
        onPress={() => navigation.navigate('Details')}
      />
    </View>
  );
}


/* Scratch */
//<Pressable style={styles.button} onPress={() => Alert.alert("Simple button pressed")}>
//  <Text style={styles.buttontext}>Menstruation Basics</Text>
//</Pressable>
//<Pressable style={styles.button} onPress={() => Alert.alert("Simple button pressed")}>
//  <Text>Sex Education</Text>
//</Pressable>
//
      //<View style={styles.footnote}>
      //  <Text>
      //    Blog Page: {userId}
      //  </Text>
      //</View>
//
        /*<Text h1 style={styles.heading}>
          Resources
        </Text>*/

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignContent: 'center',
    backgroundColor: 'white',
    paddingTop: StatusBar.currentHeight,
  },
  scrollView: {
    backgroundColor: 'pink',
    marginHorizontal: 20,
  },
  heading: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#ff7120",
    textAlign: "center",
    marginTop: 50,
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    //paddingVertical: 10,
    //paddingHorizontal: 20,
    //borderRadius: 5,
    //borderWidth: 2,
    elevation: 1,
    //backgroundColor: "orange",
    height: "100%",
    width: "100%",
  },
  buttontext: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  menurow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    //alignSelf: 'center',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignContent: 'center',
    //marginTop: 10,
    //borderWidth: 2,
    //borderColor: 'black',
    //backgroundColor: 'skyblue',
    //backgroundColor: 'pink',
    //marginHorizontal: 20,
  },
  menubox: {
    //flex: 1,
    justifyContent: "center",
    alignContent: "center",
    width: '40%',
    height: '20%',
    marginTop: '2%',
    marginBottom: '2%',
    marginLeft: '3%',
    marginRight: '3%',
    backgroundColor: '#ff7120',
    borderRadius: 20,
  },
  footnote: {
    flex: 1,
    bottom: 0,
    alignItems: "center",
    justifyContent: "flex-end",
    marginBottom: 10,
  },

})

export default BlogScreen;

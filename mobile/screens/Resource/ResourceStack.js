import React from 'react';
import { StyleSheet, View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import ResourceHomeScreen from './ResourceHomeScreen';
import ResourceMenstruationScreen from './ResourceMenstruationScreen';
import ResourceNutritionScreen from './ResourceNutritionScreen';
import ResourceExerciseScreen from './ResourceExerciseScreen';
import ResourceMentalHealthScreen from './ResourceMentalHealthScreen';
import ResourceSexEducationScreen from './ResourceSexEducationScreen';
import ResourceSustainabilityScreen from './ResourceSustainabilityScreen';
import ResourceSearch from './ResourceSearch';
import ResourceSaved from './ResourceSaved';
import ResourceContent from './ResourceContent';
import ResourceArticle from './ResourceArticle';

const rStack = createStackNavigator();

const ResourceStack = () => {
    return (
        <View style={styles.container}>
            <rStack.Navigator initialRouteName="ResourceHomeScreen">
                <rStack.Screen
                    name="ResourceHomeScreen"
                    component={ResourceHomeScreen}
                    options={{ header: () => null }} />
                <rStack.Screen
                    name="ResourceSearch"
                    component={ResourceSearch}
                    options={{ header: () => null }} />
                <rStack.Screen
                    name="ResourceSaved"
                    component={ResourceSaved}
                    options={{ header: () => null }} />
                <rStack.Screen
                    name="ResourceContent"
                    component={ResourceContent}
                    options={{ header: () => null }} />
                <rStack.Screen
                    name="ResourceArticle"
                    component={ResourceArticle}
                    options={{ header: () => null }} />
                <rStack.Screen
                    name="ResourceMenstruationScreen"
                    component={ResourceMenstruationScreen}
                    options={{ title: "Menstruation" }} />
                <rStack.Screen
                    name="ResourceNutritionScreen"
                    component={ResourceNutritionScreen}
                    options={{ title: "Nutrition" }} />
                <rStack.Screen
                    name="ResourceExerciseScreen"
                    component={ResourceExerciseScreen}
                    options={{ title: "Exercise" }} />
                <rStack.Screen
                    name="ResourceMentalHealthScreen"
                    component={ResourceMentalHealthScreen}
                    options={{ title: "Mental Health" }} />
                <rStack.Screen
                    name="ResourceSexEducationScreen"
                    component={ResourceSexEducationScreen}
                    options={{ title: "Sex Education" }} />
                <rStack.Screen
                    name="ResourceSustainabilityScreen"
                    component={ResourceSustainabilityScreen}
                    options={{ title: "Sustainability" }} />
                {/* <StatusBar style="auto" /> */}
            </rStack.Navigator>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
    },

});

export default ResourceStack;
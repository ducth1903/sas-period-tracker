import React, { useState } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { MODAL_TEMPLATE } from '../models/PeriodDate';
import IconButton from './IconButton';

const PeriodSymptomCard = ({inData, periodDateObject, ...restProps }) => {
    const [isPressedArray, setIsPressedArray] = useState(inData['isChecked']);

    const scrollX = React.useRef(new Animated.Value(0)).current;
    const keyExtractor = React.useCallback((_, index) => index.toString(), []);
    const renderItem = ({item, index}) => {
        return (
            <View style={styles.itemStyle}>
                <IconButton
                btnTitle={item}
                initPressedState={isPressedArray[index]}
                iconSource={ new MODAL_TEMPLATE().default_icons[inData['key']][inData['availableOptions_id'][index]] }
                pressedColor={inData['titleColor']}
                onPress={() => {
                    let tmpArr = [...isPressedArray];       // shallow copy array
                    tmpArr[index] = !tmpArr[index];
                    setIsPressedArray(tmpArr);
                    periodDateObject.setSymptom(
                        inData['key'],
                        inData['availableOptions_id'][index], 
                        tmpArr[index]
                    )
                    // console.log('here...', item, index, isPressedArray[index], periodDateObject);
                }}
                />
            </View>
        )
    };

    return (
        <View style={{flex: 1}}>
            <Animated.FlatList
            data={ inData['availableOptions'] }
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            // pagingEnabled
            horizontal
            showsHorizontalScrollIndicator={false}
            decelerationRate={'normal'}
            scrollEventThrottle={16}
            onScroll={Animated.event(
                [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                {
                useNativeDriver: false,
                }
            )}
            />
        </View>
    )
}

export const styles = StyleSheet.create({
    itemStyle: {
        // backgroundColor: 'yellow', 
        // padding: 10, 
        // margin: 10
    }
})

export default PeriodSymptomCard;
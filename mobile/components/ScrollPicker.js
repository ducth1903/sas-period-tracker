import {
    View,
    FlatList,
    Text,
    TouchableWithoutFeedback,
    StyleSheet
} from 'react-native';

// IMPORTANT NOTE: Reloading the page with ctrl/cmd + s while this component is viewable will cause an error because when the entire screen
// refreshes, it refreshes the onViewableItemsChanged prop, which is not allowed. Unaware of a fix for this, but just use this program in screens
// where the page won't be regularly refreshed. This should not be an issue in production, just in Expo development.
const ScrollPicker = ({ data, initialScrollIndex, onViewableItemsChanged, itemHeight=22, keyPrefix="scrollpicker", roundLeft=false, roundRight=false }) => {
    // not using tailwiund in this file since dynamic styling is needed
    const ITEM_HEIGHT = itemHeight;
    
    // dynamic styles that use variables and can't be easily translated to tailwind
    const styles = StyleSheet.create({
        container: {
            height: ITEM_HEIGHT * 3,
        },
        flatListView: {
            borderTopLeftRadius: roundLeft ? 10 : 0,
            borderBottomLeftRadius: roundLeft ? 10 : 0,
            borderTopRightRadius: roundRight ? 10 : 0,
            borderBottomRightRadius: roundRight ? 10 : 0,
        },
        flatListContainer: {
            paddingTop: ITEM_HEIGHT,
            paddingBottom: ITEM_HEIGHT,
            backgroundColor: '#EDEEE0',
        },
        itemContainer: {
            height: ITEM_HEIGHT,
        },
        topMask: {
            height: ITEM_HEIGHT,
            top: 0
        },
        bottomMask: {
            height: ITEM_HEIGHT,
            top: ITEM_HEIGHT * 2,
        }
    });

    return (
        <View className="flex-grow items-center" style={{ height: ITEM_HEIGHT * 3 }}>
            <FlatList
                data={data}
                keyExtractor={(item, index) => `${keyPrefix}item${index}`}
                getItemLayout={(data, index) => (
                    { length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index }
                )}
                initialScrollIndex={initialScrollIndex}
                onViewableItemsChanged={onViewableItemsChanged}
                snapToInterval={ITEM_HEIGHT}
                className="w-full bg-[#FEFFF4]"
                style={styles.flatListView}
                contentContainerStyle={styles.flatListContainer}
                showsVerticalScrollIndicator={false}
                renderItem={({item, index, separators}) => {
                    // needs to be a touchable or it won't scroll (not sure why)
                    return (
                        <TouchableWithoutFeedback>
                            <View className="justify-center items-center relative" style={styles.itemContainer}>
                                {/* 7th and 8th digits of hexcode specify opacity */}
                                <Text className="text-[22px] text-[#272727] font-bold relative" suppressHighlighting={true}>
                                    {item.title}
                                </Text>
                            </View>
                        </TouchableWithoutFeedback>                                                                
                    )
                }}
            />
            <View pointerEvents="none" className="w-full bg-offwhite opacity-80 absolute" style={styles.topMask}></View>
            <View pointerEvents="none" className="w-full bg-offwhite opacity-80 absolute" style={styles.bottomMask}></View>
        </View>
    )
}

export default ScrollPicker;

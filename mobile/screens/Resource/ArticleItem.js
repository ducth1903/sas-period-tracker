import {
    StyleSheet,
    Text,
    View,
    Pressable,
} from 'react-native';

export default function ArticleItem({ item, navigation }) {
    return (
        <Pressable onPress={() => navigation.navigate('ResourceArticle', { resource: item })}>
            <View style={styles.articleBox} imageStyle={{ borderRadius: 15 }}>
                <View style={styles.darkness} />
                <Text style={styles.articleBoxText}>{item["articleTitle"]}</Text>
            </View>
        </Pressable>
    );
};


const styles = StyleSheet.create({
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
})

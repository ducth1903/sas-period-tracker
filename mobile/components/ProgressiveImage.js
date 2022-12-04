import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';

const ProgressiveImage = ({ defaultImageSrc, imageSrc, style, ...props }) => {
    defaultImageAnimated    = new Animated.Value(0);
    imageAnimated           = new Animated.Value(0);

    handleDefaultImageLoad = () => {
        Animated.timing(defaultImageAnimated, {
            toValue: 1,
            useNativeDriver: true
        }).start();
    }
    handleImageLoad = () => {
        Animated.timing(imageAnimated, {
            toValue: 1,
            useNativeDriver: true
        }).start();
    }

    return (
        <View>
            <Animated.Image
                source={defaultImageSrc}
                style={[style, {opacity: defaultImageAnimated}]}
                onLoad={handleDefaultImageLoad}
                blurRadius={1} 
            />

            <Animated.Image
                source={imageSrc}
                style={[style, {opacity: imageAnimated}, styles.imageOverlay]}
                onLoad={handleImageLoad}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    imageOverlay: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
    }
})

export default ProgressiveImage;
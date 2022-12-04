import React, { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { BottomSheetBackgroundProps } from '@gorhom/bottom-sheet';
import Animated, {
  useAnimatedStyle,
  interpolateColor,
} from 'react-native-reanimated';

const BottomSheetCustomBackground: React.FC<BottomSheetBackgroundProps> = ({
  style,
  animatedIndex,
}) => {
  //#region styles
  const containerAnimatedStyle = useAnimatedStyle(() => ({
    // @ts-ignore
    backgroundColor: interpolateColor(
      animatedIndex.value,
      [0, 1],
      ['#FFFFFF', '#FFFFFF']
    ),
  }));
  const containerStyle = useMemo(
    () => [style, containerAnimatedStyle, moreStyles],
    [style, containerAnimatedStyle]
  );
  //#endregion

  // render
  return <Animated.View pointerEvents="none" style={containerStyle} />;
};

const moreStyles = StyleSheet.create({
    borderTopStartRadius: 24,
    borderTopEndRadius: 24,
})

export default BottomSheetCustomBackground;
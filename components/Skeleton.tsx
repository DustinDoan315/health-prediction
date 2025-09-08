import { BorderRadius, Colors } from '@/constants';
import React, { useEffect } from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import Animated, {
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming,
} from 'react-native-reanimated';

import { useColorScheme } from '@/hooks';

interface ISkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
  children?: React.ReactNode;
}

export function Skeleton({
  width = '100%',
  height = 20,
  borderRadius = BorderRadius.sm,
  style,
  children,
}: ISkeletonProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const shimmerOpacity = useSharedValue(0.3);

  useEffect(() => {
    shimmerOpacity.value = withRepeat(
      withTiming(1, { duration: 1000 }),
      -1,
      true
    );
  }, [shimmerOpacity]);

  const animatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      shimmerOpacity.value,
      [0.3, 1, 0.3],
      [0.3, 0.7, 0.3]
    );

    return {
      opacity,
    };
  });

  const skeletonStyle: ViewStyle[] = [
    styles.skeleton,
    {
      width: width as any,
      height,
      borderRadius,
      backgroundColor: colors.surface,
    },
    ...(style ? [style] : []),
  ];

  if (children) {
    return (
      <Animated.View style={[skeletonStyle, animatedStyle]}>
        {children}
      </Animated.View>
    );
  }

  return <Animated.View style={[skeletonStyle, animatedStyle]} />;
}

const styles = StyleSheet.create({
  skeleton: {
    overflow: 'hidden',
  },
});

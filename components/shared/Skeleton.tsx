import { BorderRadius, Colors } from '@/constants';
import { useColorScheme } from '@/hooks';
import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, ViewStyle } from 'react-native';


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
  const shimmerOpacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const startAnimation = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(shimmerOpacity, {
            toValue: 0.7,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(shimmerOpacity, {
            toValue: 0.3,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    startAnimation();
  }, [shimmerOpacity]);

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
      <Animated.View style={[skeletonStyle, { opacity: shimmerOpacity }]}>
        {children}
      </Animated.View>
    );
  }

  return <Animated.View style={[skeletonStyle, { opacity: shimmerOpacity }]} />;
}

const styles = StyleSheet.create({
  skeleton: {
    overflow: 'hidden',
  },
});

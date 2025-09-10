import { Colors } from '@/constants';
import { useAppSelector } from '@/hooks';
import { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import { PlatformPressable } from '@react-navigation/elements';
import * as Haptics from 'expo-haptics';
import { useEffect, useRef } from 'react';
import { Animated, Platform, StyleSheet, View } from 'react-native';

export function HapticTab(props: BottomTabBarButtonProps) {
  const { isDark } = useAppSelector(state => state.theme);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const indicatorAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (props.accessibilityState?.selected) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1.08,
          useNativeDriver: true,
          tension: 300,
          friction: 8,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(indicatorAnim, {
          toValue: 1,
          useNativeDriver: true,
          tension: 300,
          friction: 10,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          tension: 300,
          friction: 8,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(indicatorAnim, {
          toValue: 0,
          useNativeDriver: true,
          tension: 300,
          friction: 10,
        }),
      ]).start();
    }
  }, [
    props.accessibilityState?.selected,
    scaleAnim,
    opacityAnim,
    indicatorAnim,
  ]);

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <PlatformPressable
        {...props}
        onPressIn={ev => {
          if (Platform.OS === 'ios') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          }

          Animated.spring(scaleAnim, {
            toValue: 0.92,
            useNativeDriver: true,
            tension: 400,
            friction: 6,
          }).start();

          props.onPressIn?.(ev);
        }}
        onPressOut={ev => {
          Animated.spring(scaleAnim, {
            toValue: props.accessibilityState?.selected ? 1.08 : 1,
            useNativeDriver: true,
            tension: 300,
            friction: 8,
          }).start();

          props.onPressOut?.(ev);
        }}
        style={[props.style, styles.container]}
      >
        <View style={styles.content}>
          {props.children}
          <Animated.View
            style={[
              styles.activeIndicator,
              {
                backgroundColor: Colors[isDark ? 'dark' : 'light'].primary,
                opacity: opacityAnim,
                transform: [
                  {
                    scaleY: indicatorAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, 1],
                    }),
                  },
                ],
              },
            ]}
          />
        </View>
      </PlatformPressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: -8,
    width: 4,
    height: 4,
    borderRadius: 2,
  },
});

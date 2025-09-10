import { useAppSelector } from '@/hooks';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View } from 'react-native';

export default function TabBarBackground() {
  const { isDark } = useAppSelector(state => state.theme);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={
          isDark
            ? ['#1F2937', '#111827', '#0F172A']
            : ['#FFFFFF', '#F7F8FA', '#F1F5F9']
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.gradient}
      />
      <View
        style={[
          styles.overlay,
          {
            backgroundColor: isDark
              ? 'rgba(0, 0, 0, 0.1)'
              : 'rgba(255, 255, 255, 0.8)',
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  gradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});

export function useBottomTabOverflow() {
  return 0;
}

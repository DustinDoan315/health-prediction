import * as Haptics from 'expo-haptics';
import {
  BorderRadius,
  Colors,
  Elevation,
  Spacing,
  Typography
  } from '@/constants';
import { memo, useCallback } from 'react';
import { router } from 'expo-router';
import { UIText } from '@/content';

import {
    StyleSheet,
    Text,
    TouchableOpacity,
} from 'react-native';


interface PrimaryCTAProps {
  isDark: boolean;
}

const PrimaryCTA = memo<PrimaryCTAProps>(({ isDark }) => {
  const colors = Colors[isDark ? 'dark' : 'light'];

  const handlePress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/health-prediction');
  }, []);

  return (
    <TouchableOpacity 
      style={[styles.container, { backgroundColor: colors.primary }]}
      onPress={handlePress}
    >
      <Text style={[styles.text, { color: colors.surface }]}>
        {UIText.home.seeMyRiskPlan}
      </Text>
      <Text style={[styles.arrow, { color: colors.surface }]}>→</Text>
    </TouchableOpacity>
  );
});

PrimaryCTA.displayName = 'PrimaryCTA';

const styles = StyleSheet.create({
  container: {
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.xl,
    marginBottom: Spacing.xl,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.xl,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    ...Elevation.modal,
  },
  text: {
    ...Typography.h3,
    fontWeight: '600',
    marginRight: Spacing.sm,
  },
  arrow: {
    fontSize: 24,
    fontWeight: '600',
  },
});

export default PrimaryCTA;

import * as Haptics from 'expo-haptics';
import {
    BorderRadius,
    Colors,
    Elevation,
    Spacing,
    Typography
    } from '@/constants';
import { memo } from 'react';
import { router } from 'expo-router';
import { UIText } from '@/content';

import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';


interface HomeHeaderProps {
  userName?: string;
  isDark: boolean;
  onToggleTheme: () => void;
}

const HomeHeader = memo<HomeHeaderProps>(({ userName, isDark, onToggleTheme }) => {
  const colors = Colors[isDark ? 'dark' : 'light'];

  const handleSearch = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleProfile = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/profile');
  };

  return (
    <View style={styles.header}>
      <View>
        <Text style={[styles.greeting, { color: colors.text }]}>
          {UIText.home.greeting.replace('{name}', userName || '') || UIText.home.greetingFallback}
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          {UIText.home.subtitle}
        </Text>
      </View>
      <View style={styles.headerActions}>
        <TouchableOpacity 
          style={[styles.actionButton, { backgroundColor: colors.surface }]}
          onPress={handleSearch}
        >
          <Text style={[styles.actionIcon, { color: colors.textSecondary }]}>
            {UIText.common.search}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.actionButton, { backgroundColor: colors.surface }]}
          onPress={onToggleTheme}
        >
          <Text style={[styles.actionIcon, { color: colors.textSecondary }]}>
            {isDark ? '☀️' : '🌙'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.profilePic, { backgroundColor: colors.primary }]}
          onPress={handleProfile}
        >
          <Text style={[styles.profileEmoji, { color: colors.surface }]}>
            {UIText.common.profile}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
});

HomeHeader.displayName = 'HomeHeader';

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  greeting: {
    ...Typography.h1,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    ...Typography.body,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  actionButton: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    ...Elevation.card,
  },
  actionIcon: {
    fontSize: 20,
  },
  profilePic: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileEmoji: {
    fontSize: 20,
  },
});

export default HomeHeader;

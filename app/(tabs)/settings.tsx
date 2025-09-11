import { Spacing, Typography } from '@/constants';
import { BorderRadius, Colors, Elevation } from '@/constants/Colors';
import { UIText } from '@/content';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { setThemeModeAsync } from '@/store/slices';
import { logoutUser } from '@/store/slices/authSlice';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';

import {
    Alert,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';


export default function SettingsScreen() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(state => state.auth);
  const { isDark, mode } = useAppSelector(state => state.theme);
  const colors = Colors[isDark ? 'dark' : 'light'];

  const handleLogout = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: () => {
          dispatch(logoutUser());
          router.replace('/welcome');
        },
      },
    ]);
  };

  const handleSettingPress = (onPress: () => void) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  const handleThemeChange = (newMode: 'light' | 'dark' | 'system') => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    dispatch(setThemeModeAsync(newMode));
  };

  const settingsOptions = [
    {
      title: 'Account',
      items: [
        {
          title: 'Profile Information',
          subtitle: 'Update your personal details',
          icon: '👤',
          onPress: () => router.push('/profile' as any),
        },
        {
          title: 'Notification Preferences',
          subtitle: 'Manage your notification settings',
          icon: '🔔',
          onPress: () => router.push('/reminders' as any),
        },
      ],
    },
    {
      title: 'Health',
      items: [
        {
          title: 'Export Health Data',
          subtitle: 'Download your health predictions',
          icon: '📊',
          onPress: () =>
            Alert.alert('Coming Soon', 'Data export will be available soon'),
        },
        {
          title: 'Health Goals',
          subtitle: 'Set and track your health goals',
          icon: '🎯',
          onPress: () => router.push('/health-goals-onboarding' as any),
        },
        {
          title: 'Health Dashboard',
          subtitle: 'View your health metrics',
          icon: '📊',
          onPress: () => router.push('/dashboard' as any),
        },
        {
          title: 'Health Education',
          subtitle: 'Learn wellness tips and articles',
          icon: '📚',
          onPress: () => router.push('/education' as any),
        },
        {
          title: 'Progress & Milestones',
          subtitle: 'Track your achievements',
          icon: '🏆',
          onPress: () => router.push('/progress-milestones' as any),
        },
      ],
    },
    {
      title: 'App',
      items: [
        {
          title: 'Theme',
          subtitle:
            mode === 'system'
              ? 'Follow system'
              : mode === 'dark'
                ? 'Dark mode'
                : 'Light mode',
          icon: isDark ? '🌙' : '☀️',
          onPress: () => {
            Alert.alert('Choose Theme', 'Select your preferred theme', [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Light', onPress: () => handleThemeChange('light') },
              { text: 'Dark', onPress: () => handleThemeChange('dark') },
              { text: 'System', onPress: () => handleThemeChange('system') },
            ]);
          },
        },
        {
          title: 'Privacy & Security',
          subtitle: 'Manage your privacy settings',
          icon: '🔒',
          onPress: () =>
            Alert.alert(
              'Coming Soon',
              'Privacy settings will be available soon'
            ),
        },
        {
          title: 'Language',
          subtitle: 'Choose your preferred language',
          icon: '🌐',
          onPress: () =>
            Alert.alert(
              'Coming Soon',
              'Language selection will be available soon'
            ),
        },
        {
          title: 'About',
          subtitle: 'App version and information',
          icon: 'ℹ️',
          onPress: () =>
            Alert.alert(
              'About',
              'Health Prediction App v1.0.0\nBuilt with React Native & Expo'
            ),
        },
      ],
    },
  ];

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            {UIText.settings.title}
          </Text>
        </View>

        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View
            style={[styles.profileCard, { backgroundColor: colors.surface }]}
          >
            <View
              style={[styles.profilePic, { backgroundColor: colors.primary }]}
            >
              <Text style={[styles.profileEmoji, { color: colors.surface }]}>
                👩‍⚕️
              </Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={[styles.profileName, { color: colors.text }]}>
                {user?.full_name || 'User'}
              </Text>
              <Text
                style={[styles.profileEmail, { color: colors.textSecondary }]}
              >
                {user?.email || 'user@example.com'}
              </Text>
              <Text style={[styles.profileStatus, { color: colors.primary }]}>
                {UIText.settings.member}
              </Text>
            </View>
            <TouchableOpacity
              style={[
                styles.editButton,
                { backgroundColor: colors.background },
              ]}
              onPress={() => router.push('/profile' as any)}
            >
              <Text style={[styles.editIcon, { color: colors.textSecondary }]}>
                ✏️
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Settings Options */}
        {settingsOptions.map((section, sectionIndex) => (
          <View key={`section-${sectionIndex}`} style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              {section.title}
            </Text>
            {section.items.map((item, itemIndex) => (
              <TouchableOpacity
                key={`item-${sectionIndex}-${itemIndex}`}
                style={[
                  styles.settingItem,
                  { backgroundColor: colors.surface },
                ]}
                onPress={() => handleSettingPress(item.onPress)}
              >
                <View
                  style={[
                    styles.settingIcon,
                    { backgroundColor: colors.background },
                  ]}
                >
                  <Text style={styles.settingEmoji}>{item.icon}</Text>
                </View>
                <View style={styles.settingContent}>
                  <Text style={[styles.settingTitle, { color: colors.text }]}>
                    {item.title}
                  </Text>
                  <Text
                    style={[
                      styles.settingSubtitle,
                      { color: colors.textSecondary },
                    ]}
                  >
                    {item.subtitle}
                  </Text>
                </View>
                <Text
                  style={[styles.settingArrow, { color: colors.textSecondary }]}
                >
                  ›
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}

        {/* Logout Button */}
        <View style={styles.section}>
          <TouchableOpacity
            style={[
              styles.logoutButton,
              { backgroundColor: colors.surface, borderColor: colors.error },
            ]}
            onPress={handleLogout}
          >
            <View
              style={[styles.settingIcon, { backgroundColor: colors.error }]}
            >
              <Text style={[styles.settingEmoji, { color: colors.surface }]}>
                🚪
              </Text>
            </View>
            <View style={styles.settingContent}>
              <Text style={[styles.settingTitle, { color: colors.error }]}>
                {UIText.settings.logout}
              </Text>
              <Text
                style={[
                  styles.settingSubtitle,
                  { color: colors.textSecondary },
                ]}
              >
                {UIText.settings.logoutSubtitle}
              </Text>
            </View>
            <Text style={[styles.settingArrow, { color: colors.error }]}>
              ›
            </Text>
          </TouchableOpacity>
        </View>

        {/* App Info */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.textSecondary }]}>
            {UIText.settings.appName}
          </Text>
          <Text style={[styles.footerText, { color: colors.textSecondary }]}>
            {UIText.settings.version}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  headerTitle: {
    ...Typography.h3,
    fontWeight: '600',
  },
  profileSection: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    ...Elevation.card,
  },
  profilePic: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  profileEmoji: {
    fontSize: 30,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    ...Typography.h3,
    fontWeight: '600',
    marginBottom: 4,
  },
  profileEmail: {
    ...Typography.caption,
    marginBottom: 2,
  },
  profileStatus: {
    ...Typography.caption,
    fontWeight: '500',
  },
  editButton: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editIcon: {
    fontSize: 16,
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    ...Typography.body,
    fontWeight: '600',
    marginBottom: Spacing.sm,
    marginHorizontal: Spacing.lg,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    marginHorizontal: Spacing.lg,
    marginBottom: 2,
    borderRadius: BorderRadius.md,
    ...Elevation.card,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  settingEmoji: {
    fontSize: 18,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    ...Typography.body,
    fontWeight: '500',
    marginBottom: 2,
  },
  settingSubtitle: {
    ...Typography.caption,
  },
  settingArrow: {
    fontSize: 18,
    fontWeight: '300',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    marginHorizontal: Spacing.lg,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    ...Elevation.card,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    paddingBottom: Spacing.xl,
  },
  footerText: {
    ...Typography.caption,
    marginBottom: 4,
  },
});

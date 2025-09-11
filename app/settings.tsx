import {
    BorderRadius,
    Colors,
    Elevation,
    Spacing,
    Typography
} from '@/constants';
import { useColorScheme } from '@/hooks/useColorScheme';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import * as Sharing from 'expo-sharing';
import { useCallback, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
    Alert,
    ScrollView,
    StatusBar,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';


interface SettingsData {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  hapticFeedback: boolean;
  accessibility: {
    largeText: boolean;
    highContrast: boolean;
    reducedMotion: boolean;
    screenReader: boolean;
  };
  privacy: {
    dataCollection: boolean;
    analytics: boolean;
    crashReporting: boolean;
  };
}

export default function SettingsScreen() {
  const [settings, setSettings] = useState<SettingsData>({
    theme: 'auto',
    notifications: true,
    hapticFeedback: true,
    accessibility: {
      largeText: false,
      highContrast: false,
      reducedMotion: false,
      screenReader: false,
    },
    privacy: {
      dataCollection: true,
      analytics: true,
      crashReporting: true,
    },
  });
  
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const updateSettings = useCallback((updates: Partial<SettingsData>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  }, []);

  const updateAccessibility = useCallback((updates: Partial<SettingsData['accessibility']>) => {
    setSettings(prev => ({
      ...prev,
      accessibility: { ...prev.accessibility, ...updates }
    }));
  }, []);

  const updatePrivacy = useCallback((updates: Partial<SettingsData['privacy']>) => {
    setSettings(prev => ({
      ...prev,
      privacy: { ...prev.privacy, ...updates }
    }));
  }, []);

  const handleShareApp = useCallback(async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    try {
      const shareMessage = `Check out HealthAI - Your personal health companion powered by AI! 🏥✨\n\nGet personalized health insights, risk assessments, and smart recommendations.\n\nDownload now and start your health journey!`;
      
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync('data:text/plain;charset=utf-8,' + encodeURIComponent(shareMessage), {
          mimeType: 'text/plain',
          dialogTitle: 'Share HealthAI',
        });
      } else {
        Alert.alert('Sharing Not Available', 'Sharing is not available on this device.');
      }
    } catch {
      Alert.alert('Error', 'Failed to share app. Please try again.');
    }
  }, []);

  const handleExportData = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert(
      'Export Data',
      'This feature will allow you to export your health data in a secure format.',
      [{ text: 'OK' }]
    );
  }, []);

  const handleDeleteAccount = useCallback(() => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
            Alert.alert('Account Deleted', 'Your account has been deleted successfully.');
          },
        },
      ]
    );
  }, []);

  const SettingItem = ({ 
    title, 
    subtitle, 
    icon, 
    onPress, 
    rightElement,
    isDestructive = false 
  }: {
    title: string;
    subtitle?: string;
    icon: string;
    onPress?: () => void;
    rightElement?: React.ReactNode;
    isDestructive?: boolean;
  }) => (
    <TouchableOpacity
      style={[styles.settingItem, { backgroundColor: colors.surface }]}
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View style={styles.settingLeft}>
        <Text style={styles.settingIcon}>{icon}</Text>
        <View style={styles.settingText}>
          <Text style={[
            styles.settingTitle,
            { color: isDestructive ? '#EF4444' : colors.text }
          ]}>
            {title}
          </Text>
          {subtitle && (
            <Text style={[styles.settingSubtitle, { color: colors.textSecondary }]}>
              {subtitle}
            </Text>
          )}
        </View>
      </View>
      {rightElement}
    </TouchableOpacity>
  );

  const ThemeSelector = () => (
    <View style={styles.themeSelector}>
      {[
        { value: 'light', label: 'Light', icon: '☀️' },
        { value: 'dark', label: 'Dark', icon: '🌙' },
        { value: 'auto', label: 'Auto', icon: '🔄' },
      ].map((theme) => (
        <TouchableOpacity
          key={theme.value}
          style={[
            styles.themeOption,
            {
              backgroundColor: settings.theme === theme.value ? colors.primary : colors.surface,
              borderColor: settings.theme === theme.value ? colors.primary : colors.border,
            },
          ]}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            updateSettings({ theme: theme.value as any });
          }}
        >
          <Text style={styles.themeIcon}>{theme.icon}</Text>
          <Text style={[
            styles.themeLabel,
            { color: settings.theme === theme.value ? colors.surface : colors.text }
          ]}>
            {theme.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <LinearGradient
      colors={['#F8FAFC', '#F1F5F9', '#E2E8F0']}
      style={styles.container}
    >
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <SafeAreaView style={styles.container}>
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton} 
              onPress={() => router.back()}
            >
              <Text style={styles.backButtonText}>←</Text>
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: colors.text }]}>
              Settings
            </Text>
            <View style={styles.placeholder} />
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Appearance
            </Text>
            
            <View style={[styles.sectionCard, { backgroundColor: colors.surface }]}>
              <Text style={[styles.cardTitle, { color: colors.text }]}>
                Theme
              </Text>
              <ThemeSelector />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Preferences
            </Text>
            
            <SettingItem
              title="Notifications"
              subtitle="Receive health reminders and updates"
              icon="🔔"
              rightElement={
                <Switch
                  value={settings.notifications}
                  onValueChange={(value) => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    updateSettings({ notifications: value });
                  }}
                  trackColor={{ false: colors.border, true: colors.primary }}
                  thumbColor={settings.notifications ? '#FFFFFF' : colors.textSecondary}
                />
              }
            />

            <SettingItem
              title="Haptic Feedback"
              subtitle="Feel vibrations for interactions"
              icon="📳"
              rightElement={
                <Switch
                  value={settings.hapticFeedback}
                  onValueChange={(value) => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    updateSettings({ hapticFeedback: value });
                  }}
                  trackColor={{ false: colors.border, true: colors.primary }}
                  thumbColor={settings.hapticFeedback ? '#FFFFFF' : colors.textSecondary}
                />
              }
            />
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Accessibility
            </Text>
            
            <SettingItem
              title="Large Text"
              subtitle="Increase text size for better readability"
              icon="🔍"
              rightElement={
                <Switch
                  value={settings.accessibility.largeText}
                  onValueChange={(value) => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    updateAccessibility({ largeText: value });
                  }}
                  trackColor={{ false: colors.border, true: colors.primary }}
                  thumbColor={settings.accessibility.largeText ? '#FFFFFF' : colors.textSecondary}
                />
              }
            />

            <SettingItem
              title="High Contrast"
              subtitle="Increase contrast for better visibility"
              icon="🎨"
              rightElement={
                <Switch
                  value={settings.accessibility.highContrast}
                  onValueChange={(value) => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    updateAccessibility({ highContrast: value });
                  }}
                  trackColor={{ false: colors.border, true: colors.primary }}
                  thumbColor={settings.accessibility.highContrast ? '#FFFFFF' : colors.textSecondary}
                />
              }
            />

            <SettingItem
              title="Reduced Motion"
              subtitle="Minimize animations and transitions"
              icon="🎬"
              rightElement={
                <Switch
                  value={settings.accessibility.reducedMotion}
                  onValueChange={(value) => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    updateAccessibility({ reducedMotion: value });
                  }}
                  trackColor={{ false: colors.border, true: colors.primary }}
                  thumbColor={settings.accessibility.reducedMotion ? '#FFFFFF' : colors.textSecondary}
                />
              }
            />

            <SettingItem
              title="Screen Reader"
              subtitle="Optimize for screen readers"
              icon="👁️"
              rightElement={
                <Switch
                  value={settings.accessibility.screenReader}
                  onValueChange={(value) => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    updateAccessibility({ screenReader: value });
                  }}
                  trackColor={{ false: colors.border, true: colors.primary }}
                  thumbColor={settings.accessibility.screenReader ? '#FFFFFF' : colors.textSecondary}
                />
              }
            />
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Privacy & Data
            </Text>
            
            <SettingItem
              title="Data Collection"
              subtitle="Allow collection of health data for insights"
              icon="📊"
              rightElement={
                <Switch
                  value={settings.privacy.dataCollection}
                  onValueChange={(value) => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    updatePrivacy({ dataCollection: value });
                  }}
                  trackColor={{ false: colors.border, true: colors.primary }}
                  thumbColor={settings.privacy.dataCollection ? '#FFFFFF' : colors.textSecondary}
                />
              }
            />

            <SettingItem
              title="Analytics"
              subtitle="Help improve the app with usage analytics"
              icon="📈"
              rightElement={
                <Switch
                  value={settings.privacy.analytics}
                  onValueChange={(value) => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    updatePrivacy({ analytics: value });
                  }}
                  trackColor={{ false: colors.border, true: colors.primary }}
                  thumbColor={settings.privacy.analytics ? '#FFFFFF' : colors.textSecondary}
                />
              }
            />

            <SettingItem
              title="Crash Reporting"
              subtitle="Send crash reports to help fix issues"
              icon="🐛"
              rightElement={
                <Switch
                  value={settings.privacy.crashReporting}
                  onValueChange={(value) => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    updatePrivacy({ crashReporting: value });
                  }}
                  trackColor={{ false: colors.border, true: colors.primary }}
                  thumbColor={settings.privacy.crashReporting ? '#FFFFFF' : colors.textSecondary}
                />
              }
            />
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Actions
            </Text>
            
            <SettingItem
              title="Share App"
              subtitle="Tell friends about HealthAI"
              icon="📤"
              onPress={handleShareApp}
              rightElement={<Text style={styles.arrowText}>→</Text>}
            />

            <SettingItem
              title="Export Data"
              subtitle="Download your health data"
              icon="💾"
              onPress={handleExportData}
              rightElement={<Text style={styles.arrowText}>→</Text>}
            />

            <SettingItem
              title="Delete Account"
              subtitle="Permanently delete your account"
              icon="🗑️"
              onPress={handleDeleteAccount}
              isDestructive
              rightElement={<Text style={styles.arrowText}>→</Text>}
            />
          </View>

          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: colors.textSecondary }]}>
              HealthAI v1.0.0
            </Text>
            <Text style={[styles.footerText, { color: colors.textSecondary }]}>
              Made with ❤️ for your health
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: Spacing.xl,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 20,
    color: '#3B82F6',
    fontWeight: '600',
  },
  headerTitle: {
    ...Typography.h1,
    fontWeight: '700',
    textAlign: 'center',
  },
  placeholder: {
    width: 44,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    ...Typography.h3,
    fontWeight: '600',
    marginBottom: Spacing.md,
  },
  sectionCard: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    ...Elevation.card,
  },
  cardTitle: {
    ...Typography.body,
    fontWeight: '600',
    marginBottom: Spacing.md,
  },
  themeSelector: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  themeOption: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
  },
  themeIcon: {
    fontSize: 20,
    marginBottom: Spacing.xs,
  },
  themeLabel: {
    ...Typography.caption,
    fontWeight: '600',
    textAlign: 'center',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.sm,
    ...Elevation.card,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    fontSize: 20,
    marginRight: Spacing.md,
    width: 24,
    textAlign: 'center',
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    ...Typography.body,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  settingSubtitle: {
    ...Typography.caption,
    lineHeight: Typography.caption.lineHeight,
  },
  arrowText: {
    fontSize: 16,
    color: Colors.light.textSecondary,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
    marginTop: Spacing.xl,
    paddingTop: Spacing.xl,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
  },
  footerText: {
    ...Typography.caption,
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
});

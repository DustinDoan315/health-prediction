import * as Haptics from 'expo-haptics';
import {
  BorderRadius,
  Colors,
  Elevation,
  Spacing,
  Typography
  } from '@/constants';
import { DataSourceRow } from '@/components';
import { logoutUser } from '@/store/slices';
import { router } from 'expo-router';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { useEffect, useState } from 'react';

import {
    Alert,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';


export default function ProfileScreen() {
  const { isDark } = useAppSelector((state) => state.theme);
  const colors = Colors[isDark ? 'dark' : 'light'];
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  
  const [dataSources, setDataSources] = useState([
    {
      id: 'apple-health',
      name: 'Apple Health',
      description: 'Sync health data from your iPhone',
      icon: '🍎',
      isConnected: true,
      lastSync: '2 hours ago',
      dataTypes: ['Steps', 'Heart Rate', 'Sleep', 'Blood Pressure'],
    },
    {
      id: 'google-fit',
      name: 'Google Fit',
      description: 'Connect your Android health data',
      icon: '🤖',
      isConnected: false,
      dataTypes: ['Steps', 'Heart Rate', 'Sleep'],
    },
    {
      id: 'manual',
      name: 'Manual Entry',
      description: 'Enter health data manually',
      icon: '✏️',
      isConnected: true,
      lastSync: '1 day ago',
      dataTypes: ['Blood Pressure', 'Weight', 'Medications'],
    },
  ]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/welcome');
      return;
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return null;
  }

  const handleLogout = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: () => dispatch(logoutUser()) },
      ]
    );
  };

  const handleExportData = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Alert.alert(
      'Export Data',
      'Your health data will be exported as a JSON file. This may take a few moments.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Export', onPress: () => {
          // TODO: Implement data export
          Alert.alert('Success', 'Data exported successfully!');
        }},
      ]
    );
  };

  const handleDeleteAccount = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    Alert.alert(
      'Delete Account',
      'This action cannot be undone. All your data will be permanently deleted.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => {
          // TODO: Implement account deletion
          Alert.alert('Account Deleted', 'Your account has been deleted.');
        }},
      ]
    );
  };

  const handleDataSourceToggle = (id: string, enabled: boolean) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setDataSources(prev => 
      prev.map(source => 
        source.id === id ? { ...source, isConnected: enabled } : source
      )
    );
  };

  const handleDataSourcePress = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // TODO: Navigate to data source details
    Alert.alert('Data Source', `Details for ${id}`);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={[styles.backIcon, { color: colors.text }]}>←</Text>
          </TouchableOpacity>
          <Text style={[styles.title, { color: colors.text }]}>Profile</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* User Info */}
        <View style={[styles.userCard, { backgroundColor: colors.surface }]}>
          <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
            <Text style={[styles.avatarText, { color: colors.surface }]}>
              {user?.full_name?.charAt(0) || 'U'}
            </Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={[styles.userName, { color: colors.text }]}>
              {user?.full_name || 'User'}
            </Text>
            <Text style={[styles.userEmail, { color: colors.textSecondary }]}>
              {user?.email || 'user@example.com'}
            </Text>
          </View>
        </View>

        {/* Account Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Account</Text>
          <View style={styles.sectionContent}>
            <TouchableOpacity 
              style={[styles.menuItem, { backgroundColor: colors.surface }]}
              onPress={() => {/* TODO: Edit profile */}}
            >
              <Text style={[styles.menuIcon, { color: colors.primary }]}>👤</Text>
              <Text style={[styles.menuText, { color: colors.text }]}>Edit Profile</Text>
              <Text style={[styles.menuArrow, { color: colors.textSecondary }]}>→</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.menuItem, { backgroundColor: colors.surface }]}
              onPress={() => {/* TODO: Change password */}}
            >
              <Text style={[styles.menuIcon, { color: colors.primary }]}>🔒</Text>
              <Text style={[styles.menuText, { color: colors.text }]}>Change Password</Text>
              <Text style={[styles.menuArrow, { color: colors.textSecondary }]}>→</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Data & Privacy Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Data & Privacy</Text>
          <View style={styles.sectionContent}>
            <TouchableOpacity 
              style={[styles.menuItem, { backgroundColor: colors.surface }]}
              onPress={handleExportData}
            >
              <Text style={[styles.menuIcon, { color: colors.primary }]}>📤</Text>
              <Text style={[styles.menuText, { color: colors.text }]}>Export Health Data</Text>
              <Text style={[styles.menuArrow, { color: colors.textSecondary }]}>→</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.menuItem, { backgroundColor: colors.surface }]}
              onPress={() => {/* TODO: Privacy settings */}}
            >
              <Text style={[styles.menuIcon, { color: colors.primary }]}>🛡️</Text>
              <Text style={[styles.menuText, { color: colors.text }]}>Privacy Settings</Text>
              <Text style={[styles.menuArrow, { color: colors.textSecondary }]}>→</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Data Sources Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Data Sources</Text>
          <Text style={[styles.sectionDescription, { color: colors.textSecondary }]}>
            Manage your health data connections
          </Text>
          <View style={styles.sectionContent}>
            {dataSources.map((source) => (
              <DataSourceRow
                key={source.id}
                name={source.name}
                description={source.description}
                icon={source.icon}
                isConnected={source.isConnected}
                lastSync={source.lastSync}
                dataTypes={source.dataTypes}
                onToggle={(enabled) => handleDataSourceToggle(source.id, enabled)}
                onPress={() => handleDataSourcePress(source.id)}
              />
            ))}
          </View>
        </View>

        {/* Notifications Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Notifications</Text>
          <View style={styles.sectionContent}>
            <TouchableOpacity 
              style={[styles.menuItem, { backgroundColor: colors.surface }]}
              onPress={() => {/* TODO: Notification settings */}}
            >
              <Text style={[styles.menuIcon, { color: colors.primary }]}>🔔</Text>
              <Text style={[styles.menuText, { color: colors.text }]}>Notification Preferences</Text>
              <Text style={[styles.menuArrow, { color: colors.textSecondary }]}>→</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>About</Text>
          <View style={styles.sectionContent}>
            <TouchableOpacity 
              style={[styles.menuItem, { backgroundColor: colors.surface }]}
              onPress={() => {/* TODO: App info */}}
            >
              <Text style={[styles.menuIcon, { color: colors.primary }]}>ℹ️</Text>
              <Text style={[styles.menuText, { color: colors.text }]}>App Version</Text>
              <Text style={[styles.menuVersion, { color: colors.textSecondary }]}>1.0.0</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.menuItem, { backgroundColor: colors.surface }]}
              onPress={() => {/* TODO: Terms of service */}}
            >
              <Text style={[styles.menuIcon, { color: colors.primary }]}>📄</Text>
              <Text style={[styles.menuText, { color: colors.text }]}>Terms of Service</Text>
              <Text style={[styles.menuArrow, { color: colors.textSecondary }]}>→</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.menuItem, { backgroundColor: colors.surface }]}
              onPress={() => {/* TODO: Privacy policy */}}
            >
              <Text style={[styles.menuIcon, { color: colors.primary }]}>📋</Text>
              <Text style={[styles.menuText, { color: colors.text }]}>Privacy Policy</Text>
              <Text style={[styles.menuArrow, { color: colors.textSecondary }]}>→</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Danger Zone */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.error }]}>Danger Zone</Text>
          <View style={styles.sectionContent}>
            <TouchableOpacity 
              style={[styles.dangerItem, { backgroundColor: colors.surface, borderColor: colors.error }]}
              onPress={handleDeleteAccount}
            >
              <Text style={[styles.dangerIcon, { color: colors.error }]}>🗑️</Text>
              <Text style={[styles.dangerText, { color: colors.error }]}>Delete Account</Text>
              <Text style={[styles.menuArrow, { color: colors.error }]}>→</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity 
          style={[styles.logoutButton, { backgroundColor: colors.surface, borderColor: colors.textSecondary }]}
          onPress={handleLogout}
        >
          <Text style={[styles.logoutText, { color: colors.textSecondary }]}>Logout</Text>
        </TouchableOpacity>

        <View style={styles.bottomSpacer} />
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 24,
    fontWeight: '600',
  },
  title: {
    ...Typography.h1,
    flex: 1,
    textAlign: 'center',
    marginLeft: -44, // Center the title
  },
  headerSpacer: {
    width: 44,
  },
  userCard: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    ...Elevation.card,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  avatarText: {
    ...Typography.h1,
    fontWeight: '700',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    ...Typography.h3,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  userEmail: {
    ...Typography.caption,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    ...Typography.h3,
    fontWeight: '600',
    marginBottom: Spacing.sm,
    paddingHorizontal: Spacing.lg,
  },
  sectionDescription: {
    ...Typography.caption,
    marginBottom: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  sectionContent: {
    paddingHorizontal: Spacing.lg,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.sm,
    ...Elevation.card,
  },
  menuIcon: {
    fontSize: 20,
    marginRight: Spacing.md,
    width: 24,
    textAlign: 'center',
  },
  menuText: {
    ...Typography.body,
    fontWeight: '500',
    flex: 1,
  },
  menuArrow: {
    fontSize: 18,
    fontWeight: '600',
  },
  menuVersion: {
    ...Typography.caption,
    fontWeight: '500',
  },
  dangerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    ...Elevation.card,
  },
  dangerIcon: {
    fontSize: 20,
    marginRight: Spacing.md,
    width: 24,
    textAlign: 'center',
  },
  dangerText: {
    ...Typography.body,
    fontWeight: '500',
    flex: 1,
  },
  logoutButton: {
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.lg,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    alignItems: 'center',
    ...Elevation.card,
  },
  logoutText: {
    ...Typography.body,
    fontWeight: '600',
  },
  bottomSpacer: {
    height: Spacing.xl,
  },
});

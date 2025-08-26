import {
  Alert,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';

import { logoutUser } from '@/store/slices/authSlice';
import { router } from 'expo-router';
import { useEffect } from 'react';

export default function SettingsScreen() {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/welcome');
    }
  }, [isAuthenticated]);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            dispatch(logoutUser());
            router.replace('/welcome');
          },
        },
      ]
    );
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
          onPress: () => Alert.alert('Coming Soon', 'Notification settings will be available soon'),
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
          onPress: () => Alert.alert('Coming Soon', 'Data export will be available soon'),
        },
        {
          title: 'Health Goals',
          subtitle: 'Set and track your health goals',
          icon: '🎯',
          onPress: () => Alert.alert('Coming Soon', 'Health goals will be available soon'),
        },
      ],
    },
    {
      title: 'App',
      items: [
        {
          title: 'Privacy & Security',
          subtitle: 'Manage your privacy settings',
          icon: '🔒',
          onPress: () => Alert.alert('Coming Soon', 'Privacy settings will be available soon'),
        },
        {
          title: 'Language',
          subtitle: 'Choose your preferred language',
          icon: '🌐',
          onPress: () => Alert.alert('Coming Soon', 'Language selection will be available soon'),
        },
        {
          title: 'About',
          subtitle: 'App version and information',
          icon: 'ℹ️',
          onPress: () => Alert.alert('About', 'Health Prediction App v1.0.0\nBuilt with React Native & Expo'),
        },
      ],
    },
  ];

  if (!isAuthenticated) {
    return null; // Will redirect to welcome
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Settings</Text>
        </View>

        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.profileCard}>
            <View style={styles.profilePic}>
              <Text style={styles.profileEmoji}>👩‍⚕️</Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{user?.full_name || 'Julia Mario'}</Text>
              <Text style={styles.profileEmail}>{user?.email || 'julia@example.com'}</Text>
              <Text style={styles.profileStatus}>Administrator</Text>
            </View>
            <TouchableOpacity 
              style={styles.editButton}
              onPress={() => router.push('/profile' as any)}
            >
              <Text style={styles.editIcon}>✏️</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Settings Options */}
        {settingsOptions.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            {section.items.map((item, itemIndex) => (
              <TouchableOpacity
                key={itemIndex}
                style={styles.settingItem}
                onPress={item.onPress}
              >
                <View style={styles.settingIcon}>
                  <Text style={styles.settingEmoji}>{item.icon}</Text>
                </View>
                <View style={styles.settingContent}>
                  <Text style={styles.settingTitle}>{item.title}</Text>
                  <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
                </View>
                <Text style={styles.settingArrow}>›</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}

        {/* Logout Button */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <View style={styles.settingIcon}>
              <Text style={styles.settingEmoji}>🚪</Text>
            </View>
            <View style={styles.settingContent}>
              <Text style={[styles.settingTitle, styles.logoutText]}>Logout</Text>
              <Text style={styles.settingSubtitle}>Sign out of your account</Text>
            </View>
            <Text style={styles.settingArrow}>›</Text>
          </TouchableOpacity>
        </View>

        {/* App Info */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Health Prediction App</Text>
          <Text style={styles.footerText}>Version 1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
    paddingBottom: Platform.OS === 'ios' ? 100 : 80,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  profileSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  profilePic: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#e3f2fd',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  profileEmoji: {
    fontSize: 30,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  profileStatus: {
    fontSize: 12,
    color: '#667eea',
    fontWeight: '500',
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editIcon: {
    fontSize: 16,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
    marginHorizontal: 20,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginHorizontal: 20,
    marginBottom: 2,
    borderRadius: 12,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  settingEmoji: {
    fontSize: 18,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  settingArrow: {
    fontSize: 18,
    color: '#ccc',
    fontWeight: '300',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ffebee',
  },
  logoutText: {
    color: '#f44336',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 30,
    paddingBottom: 50,
  },
  footerText: {
    fontSize: 14,
    color: '#999',
    marginBottom: 4,
  },
});

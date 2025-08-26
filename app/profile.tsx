import {
    Alert,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { useCallback, useEffect, useState } from 'react';

import { AnimatedCard } from '@/components/AnimatedCard';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';

export default function ProfileScreen() {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const { stats, predictions } = useAppSelector((state) => state.health);
  
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    full_name: user?.full_name || '',
    email: user?.email || '',
    username: user?.username || '',
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/welcome');
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (user) {
      setProfileData({
        full_name: user.full_name,
        email: user.email,
        username: user.username,
      });
    }
  }, [user]);

  const handleEdit = useCallback(() => {
    setIsEditing(true);
  }, []);

  const handleSave = useCallback(() => {
    // TODO: Implement profile update API call
    Alert.alert('Success', 'Profile updated successfully!');
    setIsEditing(false);
  }, [profileData]);

  const handleCancel = useCallback(() => {
    if (user) {
      setProfileData({
        full_name: user.full_name,
        email: user.email,
        username: user.username,
      });
    }
    setIsEditing(false);
  }, [user]);

  const handleInputChange = useCallback((field: string, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  }, []);

  const getHealthSummary = () => {
    if (!stats) return null;
    
    const latestPrediction = predictions[0];
    const riskLevel = latestPrediction?.risk_level || 'unknown';
    
    return {
      totalPredictions: stats.total_predictions,
      averageRisk: stats.average_risk_score,
      latestRisk: riskLevel,
      riskDistribution: stats.risk_distribution,
    };
  };

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low': return '#4CAF50';
      case 'medium': return '#FF9800';
      case 'high': return '#F44336';
      default: return '#9E9E9E';
    }
  };

  const healthSummary = getHealthSummary();

  if (!isAuthenticated) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Profile</Text>
          <TouchableOpacity 
            style={styles.editButton}
            onPress={isEditing ? handleSave : handleEdit}
          >
            <Text style={styles.editButtonText}>
              {isEditing ? 'Save' : 'Edit'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Profile Picture Section */}
        <AnimatedCard style={styles.profilePictureSection} delay={100}>
          <View style={styles.profilePictureContainer}>
            <View style={styles.profilePicture}>
              <Text style={styles.profileEmoji}>👨‍⚕️</Text>
            </View>
            <TouchableOpacity style={styles.changePictureButton}>
              <Text style={styles.changePictureText}>📷</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.memberSince}>
            Member since {new Date(user?.created_at || '').getFullYear()}
          </Text>
        </AnimatedCard>

        {/* Profile Information */}
        <AnimatedCard style={styles.profileInfo} delay={200}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Full Name</Text>
            <TextInput
              style={[styles.input, !isEditing && styles.inputDisabled]}
              value={profileData.full_name}
              onChangeText={(value) => handleInputChange('full_name', value)}
              editable={isEditing}
              placeholder="Enter your full name"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Email</Text>
            <TextInput
              style={[styles.input, !isEditing && styles.inputDisabled]}
              value={profileData.email}
              onChangeText={(value) => handleInputChange('email', value)}
              editable={isEditing}
              placeholder="Enter your email"
              placeholderTextColor="#999"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Username</Text>
            <TextInput
              style={[styles.input, !isEditing && styles.inputDisabled]}
              value={profileData.username}
              onChangeText={(value) => handleInputChange('username', value)}
              editable={isEditing}
              placeholder="Enter your username"
              placeholderTextColor="#999"
              autoCapitalize="none"
            />
          </View>

          {isEditing && (
            <View style={styles.editActions}>
              <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <LinearGradient
                  colors={['#667eea', '#764ba2']}
                  style={styles.saveButtonGradient}
                >
                  <Text style={styles.saveButtonText}>Save Changes</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}
        </AnimatedCard>

        {/* Health Summary */}
        {healthSummary && (
          <AnimatedCard style={styles.healthSummary} delay={300}>
            <Text style={styles.sectionTitle}>Health Summary</Text>
            
            <View style={styles.healthStatsGrid}>
              <View style={styles.healthStatCard}>
                <Text style={styles.healthStatNumber}>{healthSummary.totalPredictions}</Text>
                <Text style={styles.healthStatLabel}>Total Assessments</Text>
              </View>
              
              <View style={styles.healthStatCard}>
                <Text style={styles.healthStatNumber}>
                  {(healthSummary.averageRisk * 100).toFixed(0)}%
                </Text>
                <Text style={styles.healthStatLabel}>Average Risk</Text>
              </View>
              
              <View style={styles.healthStatCard}>
                <View style={[
                  styles.riskIndicator, 
                  { backgroundColor: getRiskColor(healthSummary.latestRisk) }
                ]} />
                <Text style={styles.healthStatLabel}>Latest Risk</Text>
                <Text style={[
                  styles.riskLevelText,
                  { color: getRiskColor(healthSummary.latestRisk) }
                ]}>
                  {healthSummary.latestRisk.toUpperCase()}
                </Text>
              </View>
            </View>

            <TouchableOpacity 
              style={styles.viewHistoryButton}
              onPress={() => router.push('/(tabs)/medical-history')}
            >
              <Text style={styles.viewHistoryText}>View Full History →</Text>
            </TouchableOpacity>
          </AnimatedCard>
        )}

        {/* Account Actions */}
        <AnimatedCard style={styles.accountActions} delay={400}>
          <Text style={styles.sectionTitle}>Account Actions</Text>
          
          <TouchableOpacity style={styles.actionButton}>
            <View style={styles.actionIcon}>
              <Text style={styles.actionEmoji}>🔐</Text>
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Change Password</Text>
              <Text style={styles.actionSubtitle}>Update your account password</Text>
            </View>
            <Text style={styles.actionArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <View style={styles.actionIcon}>
              <Text style={styles.actionEmoji}>📊</Text>
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Export Data</Text>
              <Text style={styles.actionSubtitle}>Download your health data</Text>
            </View>
            <Text style={styles.actionArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <View style={styles.actionIcon}>
              <Text style={styles.actionEmoji}>🔔</Text>
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Notifications</Text>
              <Text style={styles.actionSubtitle}>Manage notification preferences</Text>
            </View>
            <Text style={styles.actionArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <View style={styles.actionIcon}>
              <Text style={styles.actionEmoji}>🔒</Text>
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Privacy Settings</Text>
              <Text style={styles.actionSubtitle}>Control your data privacy</Text>
            </View>
            <Text style={styles.actionArrow}>›</Text>
          </TouchableOpacity>
        </AnimatedCard>

        {/* Quick Actions */}
        <AnimatedCard style={styles.quickActions} delay={500}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity 
              style={styles.quickActionButton}
              onPress={() => router.push('/health-prediction')}
            >
              <LinearGradient
                colors={['#4facfe', '#00f2fe']}
                style={styles.quickActionGradient}
              >
                <Text style={styles.quickActionEmoji}>🔍</Text>
                <Text style={styles.quickActionText}>New Assessment</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.quickActionButton}
              onPress={() => router.push('/(tabs)/chat')}
            >
              <LinearGradient
                colors={['#f093fb', '#f5576c']}
                style={styles.quickActionGradient}
              >
                <Text style={styles.quickActionEmoji}>💬</Text>
                <Text style={styles.quickActionText}>AI Chat</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </AnimatedCard>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  backButtonText: {
    fontSize: 18,
    color: '#333',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  editButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#667eea',
    borderRadius: 20,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  profilePictureSection: {
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    paddingVertical: 30,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  profilePictureContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#e3f2fd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileEmoji: {
    fontSize: 40,
  },
  changePictureButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#667eea',
    justifyContent: 'center',
    alignItems: 'center',
  },
  changePictureText: {
    fontSize: 16,
  },
  memberSince: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  profileInfo: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#fff',
  },
  inputDisabled: {
    backgroundColor: '#f8f9fa',
    color: '#666',
  },
  editActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    marginRight: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  saveButton: {
    flex: 1,
    marginLeft: 10,
    borderRadius: 12,
    overflow: 'hidden',
  },
  saveButtonGradient: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  healthSummary: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  healthStatsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  healthStatCard: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  healthStatNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#667eea',
    marginBottom: 5,
  },
  healthStatLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  riskIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginBottom: 5,
  },
  riskLevelText: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  viewHistoryButton: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  viewHistoryText: {
    fontSize: 14,
    color: '#667eea',
    fontWeight: '500',
  },
  accountActions: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  actionEmoji: {
    fontSize: 18,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 2,
  },
  actionSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  actionArrow: {
    fontSize: 18,
    color: '#ccc',
  },
  quickActions: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickActionButton: {
    flex: 1,
    marginHorizontal: 5,
    borderRadius: 12,
    overflow: 'hidden',
  },
  quickActionGradient: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  quickActionEmoji: {
    fontSize: 24,
    marginBottom: 5,
  },
  quickActionText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '600',
  },
});

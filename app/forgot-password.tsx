import { UIText } from '@/content';
import { useColorScheme } from '@/hooks/useColorScheme';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useState } from 'react';

import {
  Spacing,
  Typography,
} from '@/constants';
import {
  BorderRadius,
  Colors,
  Elevation,
} from '@/constants/Colors';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';


export default function ForgotPasswordScreen() {
  const [selectedOption, setSelectedOption] = useState('2fa');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const handleBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  };

  const handleOptionSelect = (option: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedOption(option);
  };

  const handleResetPassword = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setShowSuccessModal(true);
  };

  const handleResendCode = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert('Success', 'Reset code has been resent!');
  };

  const handleCloseModal = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setShowSuccessModal(false);
    router.back();
  };

  const resetOptions = [
    {
      id: 'email',
      title: 'Send via Email',
      subtitle: 'Reset password via email.',
      icon: '📧',
      color: '#6B7280',
    },
    {
      id: '2fa',
      title: 'Send via 2FA',
      subtitle: 'Reset password via 2FA.',
      icon: '🔒',
      color: colors.primary,
    },
    {
      id: 'google',
      title: 'Send via Google Auth',
      subtitle: 'Reset password via G-Auth.',
      icon: '🔐',
      color: '#6B7280',
    },
    {
      id: 'sms',
      title: 'Send via SMS',
      subtitle: 'Reset password via SMS.',
      icon: '📱',
      color: '#6B7280',
    },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
      <KeyboardAvoidingView 
        style={styles.container} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <LinearGradient
          colors={[colors.gradientStart, colors.gradientEnd]}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <TouchableOpacity style={styles.backButton} onPress={handleBack}>
              <Text style={styles.backButtonText}>←</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{UIText.forgotPassword.title}</Text>
            <Text style={styles.headerSubtitle}>{UIText.forgotPassword.subtitle}</Text>
          </View>
        </LinearGradient>

        <ScrollView 
          style={styles.scrollView} 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={[styles.formCard, { backgroundColor: colors.surface }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Choose your reset method
            </Text>
            
            {resetOptions.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.optionCard,
                  { 
                    backgroundColor: selectedOption === option.id ? colors.background : colors.surface,
                    borderColor: selectedOption === option.id ? option.color : colors.background,
                  }
                ]}
                onPress={() => handleOptionSelect(option.id)}
              >
                <View style={styles.optionContent}>
                  <Text style={styles.optionIcon}>{option.icon}</Text>
                  <View style={styles.optionText}>
                    <Text style={[styles.optionTitle, { color: colors.text }]}>
                      {option.title}
                    </Text>
                    <Text style={[styles.optionSubtitle, { color: colors.textSecondary }]}>
                      {option.subtitle}
                    </Text>
                  </View>
                  <Text style={[styles.optionArrow, { color: colors.textSecondary }]}>→</Text>
                </View>
              </TouchableOpacity>
            ))}

            <TouchableOpacity 
              style={[
                styles.resetButton, 
                { backgroundColor: colors.primary }
              ]} 
              onPress={handleResetPassword}
            >
              <Text style={[styles.resetButtonText, { color: colors.surface }]}>
                Reset Password
              </Text>
              <Text style={[styles.resetButtonIcon, { color: colors.surface }]}>🔒</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Success Modal */}
        {showSuccessModal && (
          <View style={styles.modalOverlay}>
            <View style={[styles.modalCard, { backgroundColor: colors.surface }]}>
              <View style={styles.modalIllustration}>
                <View style={[styles.phoneContainer, { backgroundColor: colors.primary }]}>
                  <View style={[styles.lockContainer, { backgroundColor: colors.surface }]}>
                    <Text style={styles.lockIcon}>🔒</Text>
                  </View>
                </View>
              </View>
              
              <Text style={[styles.modalTitle, { color: colors.text }]}>{UIText.forgotPassword.passwordSent}</Text>
              <Text style={[styles.modalMessage, { color: colors.textSecondary }]}>
                We&rsquo;ve sent the password to elem*******221b@gmail.com
              </Text>
              
              <TouchableOpacity 
                style={[styles.resendButton, { backgroundColor: colors.primary }]} 
                onPress={handleResendCode}
              >
                <Text style={[styles.resendButtonText, { color: colors.surface }]}>
                  Re-Sent Code
                </Text>
                <Text style={[styles.resendButtonIcon, { color: colors.surface }]}>+</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.closeButton} 
                onPress={handleCloseModal}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.xxl,
    paddingHorizontal: Spacing.lg,
  },
  headerContent: {
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 20,
    color: '#fff',
    fontWeight: '600',
  },
  headerTitle: {
    ...Typography.pageTitle,
    color: '#fff',
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  headerSubtitle: {
    ...Typography.body,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: Typography.body.lineHeight,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  formCard: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    marginTop: -Spacing.xl,
    ...Elevation.card,
  },
  sectionTitle: {
    ...Typography.sectionTitle,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  optionCard: {
    borderWidth: 2,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    ...Elevation.card,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionIcon: {
    fontSize: 24,
    marginRight: Spacing.md,
  },
  optionText: {
    flex: 1,
  },
  optionTitle: {
    ...Typography.body,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  optionSubtitle: {
    ...Typography.caption,
    lineHeight: Typography.caption.lineHeight,
  },
  optionArrow: {
    fontSize: 20,
    fontWeight: '600',
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.md,
    marginTop: Spacing.lg,
    ...Elevation.modal,
  },
  resetButtonText: {
    ...Typography.sectionTitle,
    fontWeight: '600',
    marginRight: Spacing.sm,
  },
  resetButtonIcon: {
    fontSize: 20,
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
  },
  modalCard: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    alignItems: 'center',
    maxWidth: 320,
    width: '100%',
    ...Elevation.modal,
  },
  modalIllustration: {
    marginBottom: Spacing.lg,
  },
  phoneContainer: {
    width: 120,
    height: 80,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ rotate: '15deg' }],
  },
  lockContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lockIcon: {
    fontSize: 30,
  },
  modalTitle: {
    ...Typography.pageTitle,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  modalMessage: {
    ...Typography.body,
    textAlign: 'center',
    lineHeight: Typography.body.lineHeight,
    marginBottom: Spacing.xl,
  },
  resendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.lg,
    ...Elevation.modal,
  },
  resendButtonText: {
    ...Typography.sectionTitle,
    fontWeight: '600',
    marginRight: Spacing.sm,
  },
  resendButtonIcon: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#374151',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 20,
    color: '#fff',
    fontWeight: '600',
  },
});

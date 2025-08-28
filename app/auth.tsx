import * as Haptics from 'expo-haptics';
import {
    BorderRadius,
    Colors,
    Elevation,
    Spacing,
    Typography
    } from '@/constants/Colors';
import { clearError, loginUser, registerUser } from '@/store/slices/authSlice';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useEffect, useState } from 'react';

import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';


export default function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    full_name: '',
  });

  const dispatch = useAppDispatch();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { isLoading, error, isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (error) {
      Alert.alert('Error', error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (isLogin) {
      if (!formData.username || !formData.password) {
        Alert.alert('Error', 'Please fill in all required fields');
        return false;
      }
    } else {
      if (!formData.username || !formData.email || !formData.password || !formData.full_name) {
        Alert.alert('Error', 'Please fill in all required fields');
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        Alert.alert('Error', 'Passwords do not match');
        return false;
      }
      if (formData.password.length < 8) {
        Alert.alert('Error', 'Password must be at least 8 characters long');
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    if (!validateForm()) return;

    if (isLogin) {
      dispatch(loginUser({
        username: formData.username,
        password: formData.password,
      }));
    } else {
      dispatch(registerUser({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        full_name: formData.full_name,
      }));
    }
  };

  const toggleMode = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsLogin(!isLogin);
    setFormData({
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      full_name: '',
    });
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const handleSocialLogin = (provider: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Alert.alert('Coming Soon', `${provider} login will be available soon!`);
  };

  const handleForgotPassword = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/forgot-password');
  };

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
            <View style={styles.logoContainer}>
              <Text style={styles.logoIcon}>+</Text>
            </View>
            <Text style={styles.headerTitle}>
              {isLogin ? 'Sign In' : 'Sign Up For Free!'}
            </Text>
            {!isLogin && (
              <Text style={styles.headerSubtitle}>
                Join us for personalized health predictions
              </Text>
            )}
          </View>
        </LinearGradient>

        <ScrollView 
          style={styles.scrollView} 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={[styles.formCard, { backgroundColor: colors.surface }]}>
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>Username</Text>
              <View style={[styles.inputContainer, { borderColor: colors.background }]}>
                <Text style={[styles.inputIcon, { color: colors.textSecondary }]}>👤</Text>
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  placeholder="Enter your username"
                  placeholderTextColor={colors.textSecondary}
                  value={formData.username}
                  onChangeText={(value) => handleInputChange('username', value)}
                  autoCapitalize="none"
                />
              </View>
            </View>

            {!isLogin && (
              <>
                <View style={styles.inputGroup}>
                  <Text style={[styles.inputLabel, { color: colors.text }]}>Full Name</Text>
                  <View style={[styles.inputContainer, { borderColor: colors.background }]}>
                    <Text style={[styles.inputIcon, { color: colors.textSecondary }]}>👤</Text>
                    <TextInput
                      style={[styles.input, { color: colors.text }]}
                      placeholder="Enter your full name"
                      placeholderTextColor={colors.textSecondary}
                      value={formData.full_name}
                      onChangeText={(value) => handleInputChange('full_name', value)}
                    />
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={[styles.inputLabel, { color: colors.text }]}>Email Address</Text>
                  <View style={[styles.inputContainer, { borderColor: colors.background }]}>
                    <Text style={[styles.inputIcon, { color: colors.textSecondary }]}>📧</Text>
                    <TextInput
                      style={[styles.input, { color: colors.text }]}
                      placeholder="Enter your email address..."
                      placeholderTextColor={colors.textSecondary}
                      value={formData.email}
                      onChangeText={(value) => handleInputChange('email', value)}
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                  </View>
                </View>
              </>
            )}

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>Password</Text>
              <View style={[styles.inputContainer, { borderColor: colors.background }]}>
                <Text style={[styles.inputIcon, { color: colors.textSecondary }]}>🔒</Text>
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  placeholder="Enter your password"
                  placeholderTextColor={colors.textSecondary}
                  value={formData.password}
                  onChangeText={(value) => handleInputChange('password', value)}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeIcon}
                >
                  <Text style={[styles.inputIcon, { color: colors.textSecondary }]}>
                    {showPassword ? '👁️' : '🙈'}
                  </Text>
                </TouchableOpacity>
              </View>
              {!isLogin && (
                <Text style={[styles.helperText, { color: colors.textSecondary }]}>
                  Password must be at least 8 characters long
                </Text>
              )}
            </View>

            {!isLogin && (
              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: colors.text }]}>Password Confirmation</Text>
                <View style={[styles.inputContainer, { borderColor: colors.background }]}>
                  <Text style={[styles.inputIcon, { color: colors.textSecondary }]}>🔒</Text>
                  <TextInput
                    style={[styles.input, { color: colors.text }]}
                    placeholder="Confirm your password"
                    placeholderTextColor={colors.textSecondary}
                    value={formData.confirmPassword}
                    onChangeText={(value) => handleInputChange('confirmPassword', value)}
                    secureTextEntry={!showConfirmPassword}
                    autoCapitalize="none"
                  />
                  <TouchableOpacity
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={styles.eyeIcon}
                  >
                    <Text style={[styles.inputIcon, { color: colors.textSecondary }]}>
                      {showConfirmPassword ? '👁️' : '🙈'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            <TouchableOpacity 
              style={[
                styles.submitButton, 
                { backgroundColor: colors.primary },
                isLoading && styles.submitButtonDisabled
              ]} 
              onPress={handleSubmit}
              disabled={isLoading}
            >
              <Text style={[styles.submitButtonText, { color: colors.surface }]}>
                {isLoading ? 'Loading...' : (isLogin ? 'Sign In' : 'Sign Up')}
              </Text>
              <Text style={[styles.submitButtonIcon, { color: colors.surface }]}>+</Text>
            </TouchableOpacity>

            {isLogin && (
              <TouchableOpacity style={styles.forgotPasswordButton} onPress={handleForgotPassword}>
                <Text style={[styles.forgotPasswordText, { color: colors.primary }]}>
                  Forgot Password?
                </Text>
              </TouchableOpacity>
            )}

            <View style={styles.separator}>
              <View style={[styles.separatorLine, { backgroundColor: colors.background }]} />
              <Text style={[styles.separatorText, { color: colors.textSecondary }]}>OR</Text>
              <View style={[styles.separatorLine, { backgroundColor: colors.background }]} />
            </View>

            <View style={styles.socialButtonsContainer}>
              <TouchableOpacity 
                style={[styles.socialButton, { backgroundColor: '#1877F2' }]}
                onPress={() => handleSocialLogin('Facebook')}
              >
                <Text style={styles.socialButtonText}>f</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.socialButton, { backgroundColor: '#DB4437' }]}
                onPress={() => handleSocialLogin('Google')}
              >
                <Text style={styles.socialButtonText}>G</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.socialButton, { backgroundColor: '#E4405F' }]}
                onPress={() => handleSocialLogin('Instagram')}
              >
                <Text style={styles.socialButtonText}>📷</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.switchButton} onPress={toggleMode}>
              <Text style={[styles.switchText, { color: colors.textSecondary }]}>
                {isLogin 
                  ? "Don't have an account? " 
                  : 'Already have an account? '
                }
                <Text style={[styles.switchTextBold, { color: colors.primary }]}>
                  {isLogin ? 'Sign Up' : 'Sign In'}
                </Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
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
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  logoIcon: {
    fontSize: 40,
    color: '#fff',
    fontWeight: 'bold',
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
  inputGroup: {
    marginBottom: Spacing.lg,
  },
  inputLabel: {
    ...Typography.body,
    fontWeight: '600',
    marginBottom: Spacing.sm,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    backgroundColor: '#fff',
  },
  inputIcon: {
    fontSize: 18,
    marginRight: Spacing.sm,
  },
  input: {
    flex: 1,
    paddingVertical: Spacing.md,
    ...Typography.body,
  },
  eyeIcon: {
    padding: Spacing.xs,
  },
  helperText: {
    ...Typography.caption,
    marginTop: Spacing.xs,
    fontStyle: 'italic',
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.md,
    marginTop: Spacing.md,
    marginBottom: Spacing.lg,
    ...Elevation.modal,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    ...Typography.sectionTitle,
    fontWeight: '600',
    marginRight: Spacing.sm,
  },
  submitButtonIcon: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  forgotPasswordButton: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  forgotPasswordText: {
    ...Typography.body,
    textDecorationLine: 'underline',
    fontWeight: '500',
  },
  separator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  separatorLine: {
    flex: 1,
    height: 1,
  },
  separatorText: {
    ...Typography.meta,
    marginHorizontal: Spacing.md,
    fontWeight: '500',
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
  },
  socialButton: {
    width: 60,
    height: 60,
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    ...Elevation.card,
  },
  socialButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  switchButton: {
    alignItems: 'center',
  },
  switchText: {
    ...Typography.body,
    textAlign: 'center',
  },
  switchTextBold: {
    fontWeight: '600',
  },
});

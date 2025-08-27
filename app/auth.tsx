import {
    BorderRadius,
    Colors,
    Elevation,
    Spacing,
    Typography
} from '@/constants/Colors';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { useColorScheme } from '@/hooks/useColorScheme';
import { clearError, loginUser, registerUser } from '@/store/slices/authSlice';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';

import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';


export default function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
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

  const handleSubmit = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    if (isLogin) {
      if (!formData.username || !formData.password) {
        Alert.alert('Error', 'Please fill in all required fields');
        return;
      }
      dispatch(loginUser({
        username: formData.username,
        password: formData.password,
      }));
    } else {
      if (!formData.username || !formData.email || !formData.password || !formData.full_name) {
        Alert.alert('Error', 'Please fill in all required fields');
        return;
      }
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
      full_name: '',
    });
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <LinearGradient
        colors={[colors.gradientStart, colors.gradientEnd]}
        style={styles.background}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.content}>
            <Text style={styles.title}>
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </Text>
            <Text style={styles.subtitle}>
              {isLogin 
                ? 'Sign in to access your health insights' 
                : 'Join us for personalized health predictions'
              }
            </Text>

            <View style={[styles.formContainer, { backgroundColor: 'rgba(255, 255, 255, 0.1)' }]}>
              <View style={styles.inputContainer}>
                <Text style={[styles.inputLabel, { color: colors.surface }]}>
                  {isLogin ? 'Username' : 'Username *'}
                </Text>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.surface, color: colors.text }]}
                  placeholder="Enter your username"
                  placeholderTextColor={colors.textSecondary}
                  value={formData.username}
                  onChangeText={(value) => handleInputChange('username', value)}
                  autoCapitalize="none"
                />
              </View>

              {!isLogin && (
                <>
                  <View style={styles.inputContainer}>
                    <Text style={[styles.inputLabel, { color: colors.surface }]}>
                      Full Name *
                    </Text>
                    <TextInput
                      style={[styles.input, { backgroundColor: colors.surface, color: colors.text }]}
                      placeholder="Enter your full name"
                      placeholderTextColor={colors.textSecondary}
                      value={formData.full_name}
                      onChangeText={(value) => handleInputChange('full_name', value)}
                    />
                  </View>

                  <View style={styles.inputContainer}>
                    <Text style={[styles.inputLabel, { color: colors.surface }]}>
                      Email *
                    </Text>
                    <TextInput
                      style={[styles.input, { backgroundColor: colors.surface, color: colors.text }]}
                      placeholder="Enter your email"
                      placeholderTextColor={colors.textSecondary}
                      value={formData.email}
                      onChangeText={(value) => handleInputChange('email', value)}
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                  </View>
                </>
              )}

              <View style={styles.inputContainer}>
                <Text style={[styles.inputLabel, { color: colors.surface }]}>
                  Password *
                </Text>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.surface, color: colors.text }]}
                  placeholder="Enter your password"
                  placeholderTextColor={colors.textSecondary}
                  value={formData.password}
                  onChangeText={(value) => handleInputChange('password', value)}
                  secureTextEntry
                  autoCapitalize="none"
                />
                {!isLogin && (
                  <Text style={[styles.helperText, { color: colors.surface }]}>
                    Password must be at least 8 characters long
                  </Text>
                )}
              </View>

              <TouchableOpacity 
                style={[
                  styles.button, 
                  { backgroundColor: colors.surface },
                  isLoading && styles.buttonDisabled
                ]} 
                onPress={handleSubmit}
                disabled={isLoading}
              >
                <Text style={[styles.buttonText, { color: colors.primary }]}>
                  {isLoading 
                    ? 'Loading...' 
                    : isLogin 
                      ? 'Sign In' 
                      : 'Create Account'
                  }
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.switchButton} onPress={toggleMode}>
                <Text style={[styles.switchText, { color: colors.surface }]}>
                  {isLogin 
                    ? "Don't have an account? Sign up" 
                    : 'Already have an account? Sign in'
                  }
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xl,
  },
  title: {
    ...Typography.pageTitle,
    color: '#fff',
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  subtitle: {
    ...Typography.body,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginBottom: Spacing.xl,
    lineHeight: Typography.body.lineHeight,
    maxWidth: 320,
    alignSelf: 'center',
  },
  formContainer: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    backdropFilter: 'blur(10px)',
  },
  inputContainer: {
    marginBottom: Spacing.md,
  },
  inputLabel: {
    ...Typography.body,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  input: {
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    ...Typography.body,
    ...Elevation.card,
  },
  helperText: {
    ...Typography.caption,
    marginTop: Spacing.xs,
    fontStyle: 'italic',
  },
  button: {
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    marginTop: Spacing.sm,
    marginBottom: Spacing.lg,
    ...Elevation.modal,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    ...Typography.sectionTitle,
    fontWeight: '600',
    textAlign: 'center',
  },
  switchButton: {
    alignItems: 'center',
  },
  switchText: {
    ...Typography.body,
    textDecorationLine: 'underline',
  },
});

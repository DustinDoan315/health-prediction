import React, { useState } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
  } from 'react-native';
import {
  BorderRadius,
  Colors,
  Spacing,
  Typography
  } from '../../../constants';
import { RegisterRequest } from '../../domain/repositories';
import { useAuthViewModel } from '../viewmodels';


interface AuthFormProps {
  isLogin: boolean;
  onToggleMode: () => void;
}

export const AuthForm: React.FC<AuthFormProps> = ({ isLogin, onToggleMode }) => {
  const { state, login, register, clearError } = useAuthViewModel();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = (): boolean => {
    if (isLogin) {
      if (!formData.username || !formData.password) {
        Alert.alert('Error', 'Please fill in all required fields');
        return false;
      }
    } else {
      if (!formData.username || !formData.email || !formData.password || !formData.fullName) {
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
    if (!validateForm()) return;

    try {
      if (isLogin) {
        await login(formData.username, formData.password);
      } else {
        const registerData: RegisterRequest = {
          username: formData.username,
          email: formData.email,
          password: formData.password,
          fullName: formData.fullName,
        };
        await register(registerData);
      }
    } catch (error) {
      Alert.alert('Error', state.error || 'An error occurred');
    }
  };

  const handleToggleMode = () => {
    clearError();
    setFormData({
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      fullName: '',
    });
    setShowPassword(false);
    setShowConfirmPassword(false);
    onToggleMode();
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Username</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.inputIcon}>👤</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter username"
            value={formData.username}
            onChangeText={(value) => handleInputChange('username', value)}
            autoCapitalize="none"
          />
        </View>
      </View>

      {!isLogin && (
        <>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Full Name</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.inputIcon}>👨‍⚕️</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter full name"
                value={formData.fullName}
                onChangeText={(value) => handleInputChange('fullName', value)}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Email Address</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.inputIcon}>📧</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter email"
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
        <Text style={styles.inputLabel}>Password</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.inputIcon}>🔐</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter password"
            value={formData.password}
            onChangeText={(value) => handleInputChange('password', value)}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
          />
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.eyeIcon}
          >
            <Text style={styles.inputIcon}>
              {showPassword ? '👁️' : '🙈'}
            </Text>
          </TouchableOpacity>
        </View>
        {!isLogin && (
          <Text style={styles.helperText}>
            Password must be at least 8 characters long
          </Text>
        )}
      </View>

      {!isLogin && (
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Confirm Password</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.inputIcon}>🔐</Text>
            <TextInput
              style={styles.input}
              placeholder="Confirm password"
              value={formData.confirmPassword}
              onChangeText={(value) => handleInputChange('confirmPassword', value)}
              secureTextEntry={!showConfirmPassword}
              autoCapitalize="none"
            />
            <TouchableOpacity
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              style={styles.eyeIcon}
            >
              <Text style={styles.inputIcon}>
                {showConfirmPassword ? '👁️' : '🙈'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <TouchableOpacity 
        style={[
          styles.submitButton, 
          { backgroundColor: Colors.light.primary },
          state.isLoading && styles.submitButtonDisabled
        ]} 
        onPress={handleSubmit}
        disabled={state.isLoading}
      >
        <Text style={[styles.submitButtonText, { color: Colors.light.surface }]}>
          {state.isLoading ? 'Loading...' : (isLogin ? 'Sign In' : 'Create Account')}
        </Text>
        <Text style={[styles.submitButtonIcon, { color: Colors.light.surface }]}>
          {isLogin ? '→' : '✨'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.switchContainer} onPress={handleToggleMode}>
        <Text style={[styles.switchText, { color: Colors.light.textSecondary }]}>
          {isLogin 
            ? "Don't have an account? " 
            : 'Already have an account? '
          }
          <Text style={[styles.switchTextBold, { color: Colors.light.primary }]}>
            {isLogin ? 'Sign Up' : 'Sign In'}
          </Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: Spacing.lg,
  },
  inputLabel: {
    ...Typography.body,
    fontWeight: '600',
    marginBottom: Spacing.sm,
    color: Colors.light.text,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    minHeight: 56,
    borderColor: Colors.light.background,
    backgroundColor: Colors.light.background,
  },
  inputIcon: {
    fontSize: 20,
    marginRight: Spacing.sm,
    color: Colors.light.textSecondary,
  },
  input: {
    flex: 1,
    paddingVertical: Spacing.md,
    ...Typography.body,
    color: Colors.light.text,
  },
  eyeIcon: {
    padding: Spacing.sm,
  },
  helperText: {
    ...Typography.caption,
    marginTop: Spacing.xs,
    fontStyle: 'italic',
    color: Colors.light.textSecondary,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.lg,
    marginTop: Spacing.md,
    marginBottom: Spacing.lg,
    minHeight: 56,
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
  switchContainer: {
    alignItems: 'center',
    paddingTop: Spacing.lg,
    paddingVertical: Spacing.md,
    marginTop: Spacing.md,
  },
  switchText: {
    ...Typography.body,
    textAlign: 'center',
  },
  switchTextBold: {
    fontWeight: '600',
  },
});

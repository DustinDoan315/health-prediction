import { clearError, loginUser, registerUser } from '@/store/slices/authSlice';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
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
        colors={['#667eea', '#764ba2']}
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

            <View style={styles.formContainer}>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Username"
                  placeholderTextColor="#999"
                  value={formData.username}
                  onChangeText={(value) => handleInputChange('username', value)}
                  autoCapitalize="none"
                />
              </View>

              {!isLogin && (
                <>
                  <View style={styles.inputContainer}>
                    <TextInput
                      style={styles.input}
                      placeholder="Full Name"
                      placeholderTextColor="#999"
                      value={formData.full_name}
                      onChangeText={(value) => handleInputChange('full_name', value)}
                    />
                  </View>

                  <View style={styles.inputContainer}>
                    <TextInput
                      style={styles.input}
                      placeholder="Email"
                      placeholderTextColor="#999"
                      value={formData.email}
                      onChangeText={(value) => handleInputChange('email', value)}
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                  </View>
                </>
              )}

              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  placeholderTextColor="#999"
                  value={formData.password}
                  onChangeText={(value) => handleInputChange('password', value)}
                  secureTextEntry
                  autoCapitalize="none"
                />
              </View>

              <TouchableOpacity 
                style={[styles.button, isLoading && styles.buttonDisabled]} 
                onPress={handleSubmit}
                disabled={isLoading}
              >
                <Text style={styles.buttonText}>
                  {isLoading 
                    ? 'Loading...' 
                    : isLogin 
                      ? 'Sign In' 
                      : 'Create Account'
                  }
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.switchButton} onPress={toggleMode}>
                <Text style={styles.switchText}>
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
    paddingHorizontal: 30,
    paddingVertical: 50,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginBottom: 40,
  },
  formContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    padding: 30,
    backdropFilter: 'blur(10px)',
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 15,
    fontSize: 16,
    color: '#333',
  },
  button: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 15,
    marginTop: 10,
    marginBottom: 20,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#667eea',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  switchButton: {
    alignItems: 'center',
  },
  switchText: {
    color: '#fff',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});

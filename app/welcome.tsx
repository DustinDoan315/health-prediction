import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { loadUser } from '@/store/slices/authSlice';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen() {
  const dispatch = useAppDispatch();
  const { isAuthenticated, isLoading } = useAppSelector((state) => state.auth);

  useEffect(() => {
    // Check if user is already authenticated
    dispatch(loadUser());
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated]);

  const handleGetStarted = () => {
    router.push('/auth');
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.background}
      >
        <View style={styles.content}>
          {/* Illustration */}
          <View style={styles.illustrationContainer}>
            <View style={styles.illustration}>
              <Text style={styles.illustrationEmoji}>👩‍⚕️</Text>
            </View>
          </View>

          {/* Title */}
          <Text style={styles.title}>Hello Beautiful</Text>
          
          {/* Subtitle */}
          <Text style={styles.subtitle}>
            Your personal health assistant powered by AI. Get insights, predictions, and personalized recommendations for better health.
          </Text>

          {/* Get Started Button */}
          <TouchableOpacity style={styles.button} onPress={handleGetStarted}>
            <Text style={styles.buttonText}>Start</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    fontSize: 18,
    color: '#666',
  },
  illustrationContainer: {
    marginBottom: 60,
  },
  illustration: {
    width: 200,
    height: 200,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  illustrationEmoji: {
    fontSize: 80,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 60,
  },
  button: {
    backgroundColor: '#fff',
    paddingHorizontal: 80,
    paddingVertical: 16,
    borderRadius: 30,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    color: '#667eea',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
});

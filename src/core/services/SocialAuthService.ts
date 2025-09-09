import * as AppleAuthentication from 'expo-apple-authentication';
import * as AuthSession from 'expo-auth-session';
import Constants from 'expo-constants';
import * as WebBrowser from 'expo-web-browser';
import { Platform } from 'react-native';

// Configure WebBrowser for better UX
WebBrowser.maybeCompleteAuthSession();

export enum AuthProvider {
  GOOGLE = 'google',
  APPLE = 'apple',
  EMAIL_PASSWORD = 'email_password',
}

export interface SocialAuthResult {
  provider: AuthProvider;
  email: string;
  fullName: string;
  idToken?: string;
  authorizationCode?: string;
  providerId: string;
}

export class SocialAuthService {
  private static instance: SocialAuthService;

  static getInstance(): SocialAuthService {
    if (!SocialAuthService.instance) {
      SocialAuthService.instance = new SocialAuthService();
    }
    return SocialAuthService.instance;
  }

  /**
   * Sign in with Google using OAuth 2.0
   */
  async signInWithGoogle(): Promise<SocialAuthResult> {
    try {
      const clientId = Constants.expoConfig?.extra?.googleClientId;
      const redirectUri = 'https://auth.expo.io/@dustindoan/health-prediction';

      console.log('Google OAuth Debug Info:');
      console.log('Client ID:', clientId);
      console.log('Redirect URI:', redirectUri);

      if (!clientId) {
        throw new Error('Google Client ID is not configured');
      }

      // Create the OAuth request using implicit flow (better for mobile)
      const request = new AuthSession.AuthRequest({
        clientId,
        scopes: ['openid', 'email', 'profile'],
        responseType: AuthSession.ResponseType.Token,
        redirectUri,
        usePKCE: false,
      });

      // Start the authentication flow
      const result = await request.promptAsync({
        authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
      });

      if (result.type === 'success') {
        console.log('Google OAuth success, fetching user info...');

        const accessToken = result.params.access_token;
        if (!accessToken) {
          throw new Error('No access token received from Google');
        }

        // Get user info from Google
        const userInfoResponse = await fetch(
          `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${accessToken}`
        );

        if (!userInfoResponse.ok) {
          throw new Error(
            `Failed to fetch user info: ${userInfoResponse.status}`
          );
        }

        const userInfo = await userInfoResponse.json();
        console.log('User info fetched successfully:', userInfo);

        return {
          provider: AuthProvider.GOOGLE,
          email: userInfo.email,
          fullName: userInfo.name || '',
          idToken: result.params.id_token,
          providerId: userInfo.id,
        };
      } else if (result.type === 'cancel') {
        throw new Error('Google sign-in was cancelled');
      } else {
        console.error('Google OAuth failed:', result);
        throw new Error(`Google sign-in failed: ${result.type}`);
      }
    } catch (error) {
      console.error('Google sign-in error:', error);
      throw new Error(
        `Google sign-in failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Sign in with Apple using expo-apple-authentication
   */
  async signInWithApple(): Promise<SocialAuthResult> {
    if (Platform.OS !== 'ios') {
      throw new Error('Apple Sign-In is only available on iOS');
    }

    try {
      // Check if Apple Authentication is available
      const isAvailable = await AppleAuthentication.isAvailableAsync();
      if (!isAvailable) {
        throw new Error('Apple Authentication is not available on this device');
      }

      console.log('Starting Apple Sign-In...');

      // Perform Apple authentication
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      console.log('Apple Sign-In credential received:', {
        user: credential.user,
        email: credential.email ? 'provided' : 'not provided',
        fullName: credential.fullName ? 'provided' : 'not provided',
        identityToken: credential.identityToken ? 'provided' : 'not provided',
        authorizationCode: credential.authorizationCode
          ? 'provided'
          : 'not provided',
      });

      // Apple provides name only on first sign-in
      const fullName = credential.fullName
        ? `${credential.fullName.givenName || ''} ${credential.fullName.familyName || ''}`.trim()
        : '';

      if (!credential.user) {
        throw new Error('No user ID received from Apple');
      }

      return {
        provider: AuthProvider.APPLE,
        email: credential.email || '',
        fullName,
        idToken: credential.identityToken || undefined,
        authorizationCode: credential.authorizationCode || undefined,
        providerId: credential.user,
      };
    } catch (error: any) {
      console.error('Apple sign-in error:', error);

      if (error.code === 'ERR_CANCELED') {
        throw new Error('Apple sign-in was cancelled');
      } else if (error.code === 'ERR_INVALID_RESPONSE') {
        throw new Error('Invalid response from Apple');
      } else if (error.code === 'ERR_NOT_HANDLED') {
        throw new Error('Apple sign-in not handled');
      } else if (error.code === 'ERR_UNKNOWN') {
        throw new Error('Unknown Apple sign-in error');
      } else if (error.message?.includes('1000')) {
        throw new Error(
          'Apple Sign-In configuration error. Please check entitlements and bundle identifier.'
        );
      } else {
        throw new Error(
          `Apple sign-in failed: ${error.message || 'Unknown error'}`
        );
      }
    }
  }

  /**
   * Sign out from all providers
   */
  async signOut(): Promise<void> {
    try {
      // For Google, we can't programmatically sign out the user from their Google account
      // The user needs to sign out from their Google account settings
      // For Apple, the user is automatically signed out when the app is uninstalled
      console.log('Social authentication sign out completed');
    } catch (error) {
      console.warn('Social sign-out warning:', error);
    }
  }

  /**
   * Check if Apple Authentication is available
   */
  async isAppleAuthAvailable(): Promise<boolean> {
    if (Platform.OS !== 'ios') {
      return false;
    }

    try {
      return await AppleAuthentication.isAvailableAsync();
    } catch {
      return false;
    }
  }
}

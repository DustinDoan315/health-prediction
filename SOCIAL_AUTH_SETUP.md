# Social Authentication Setup Guide

This guide will help you configure Google and Apple authentication for your health prediction app.

## Prerequisites

- Google Cloud Console account
- Apple Developer account (for Apple Sign-In)
- Expo CLI installed

## Google Authentication Setup

### 1. Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API:
   - Go to "APIs & Services" > "Library"
   - Search for "Google+ API" and enable it
4. Create OAuth 2.0 credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth 2.0 Client IDs"
   - Choose "Web application" as the application type
   - Add authorized redirect URIs:
     - `https://auth.expo.io/@dustindoan/health-prediction`
   - Add authorized JavaScript origins:
     - `https://auth.expo.io`
5. Copy the Client ID: `821673513998-m4skbebrifdunff61k1nd61ca2ukmc8t.apps.googleusercontent.com`

### 2. Configure app.json

Update the `googleClientId` in your `app.json`:

```json
{
  "expo": {
    "extra": {
      "googleClientId": "821673513998-m4skbebrifdunff61k1nd61ca2ukmc8t.apps.googleusercontent.com"
    }
  }
}
```

**✅ COMPLETED**: Your `app.json` has been updated with the actual Google Client ID.

### 3. Update SocialAuthService

The service is already configured to use `Constants.expoConfig?.extra?.googleClientId`.

## Apple Authentication Setup

### 1. Apple Developer Account Setup

1. Go to [Apple Developer Portal](https://developer.apple.com/)
2. Sign in with your Apple Developer account
3. Go to "Certificates, Identifiers & Profiles"
4. Select your app identifier
5. Enable "Sign In with Apple" capability

### 2. Configure app.json

The `app.json` is already configured with:

```json
{
  "expo": {
    "ios": {
      "usesAppleSignIn": true
    }
  }
}
```

### 3. Apple Sign-In Requirements

- Apple Sign-In is only available on iOS devices
- Requires iOS 13.0 or later
- Must be tested on a physical device (not simulator)

### 4. Apple Developer Provisioning Profile Update

**⚠️ IMPORTANT**: After enabling Sign In with Apple capability, you must regenerate provisioning profiles:

1. **Go to Apple Developer Console** → Certificates, Identifiers & Profiles
2. **Navigate to Profiles** section
3. **Find your app's provisioning profiles** for `com.dustindoan.healthprediction`
4. **Edit each profile** and click **"Generate"** to regenerate them
5. **Download the new profiles**

**After regenerating profiles, rebuild your app:**

```bash
# Clear EAS build cache and rebuild
eas build --platform ios --clear-cache --profile development
```

## Backend API Configuration

Your backend needs to handle the social authentication endpoints:

### Google Authentication Endpoint

```typescript
POST /auth/google
{
  "id_token": "string"
}
```

### Apple Authentication Endpoint

```typescript
POST /auth/apple
{
  "identity_token": "string",
  "authorization_code": "string"
}
```

Both endpoints should return:

```typescript
{
  "user": {
    "id": number,
    "username": string,
    "email": string,
    "full_name": string,
    "is_active": boolean,
    "created_at": string,
    "auth_provider": "google" | "apple",
    "provider_id": string
  },
  "token": string
}
```

## Quick Setup Verification

### ✅ Current Status

- **Google Client ID**: `821673513998-m4skbebrifdunff61k1nd61ca2ukmc8t.apps.googleusercontent.com` ✅
- **App.json**: Updated with Google Client ID ✅
- **Apple Sign-In**: Enabled in app.json ✅
- **Bundle ID**: `com.dustindoan.healthprediction` ✅
- **Expo Username**: `dustindoan` ✅

### 🔄 Next Steps Required

1. **Google Cloud Console**: Add redirect URI `https://auth.expo.io/@dustindoan/health-prediction`
2. **Apple Developer**: Regenerate provisioning profiles
3. **Rebuild app**: `eas build --platform ios --clear-cache`

## Testing

### Development Testing

1. Install dependencies:

   ```bash
   yarn install
   ```

2. Start the development server:

   ```bash
   yarn start
   ```

3. Test on a physical device:
   - For iOS: Use Expo Go or development build
   - For Android: Use Expo Go or development build

### Production Testing

1. Build the app:

   ```bash
   eas build --platform ios
   eas build --platform android
   ```

2. Test on TestFlight (iOS) or Google Play Console (Android)

## Troubleshooting

### Common Issues

1. **Google Sign-In not working:**
   - Check if the Client ID is correct
   - Verify the redirect URI matches your app
   - Ensure the Google+ API is enabled

2. **Apple Sign-In not working:**
   - Check if the app is running on a physical iOS device
   - Verify the Apple Developer account has the capability enabled
   - Ensure the bundle identifier matches

3. **Network errors:**
   - Check your internet connection
   - Verify the backend endpoints are accessible
   - Check the API base URL configuration

### Debug Mode

Enable debug logging by adding this to your app:

```typescript
// In your app initialization
if (__DEV__) {
  console.log('Google Client ID:', Constants.expoConfig?.extra?.googleClientId);
}
```

## Security Considerations

1. **Client ID Security:**
   - Never commit real Client IDs to version control
   - Use environment variables for production
   - Rotate credentials regularly

2. **Token Validation:**
   - Always validate tokens on the backend
   - Implement proper error handling
   - Use HTTPS for all API calls

3. **User Data Privacy:**
   - Follow HIPAA guidelines for health data
   - Implement proper data retention policies
   - Provide clear privacy notices

## Next Steps

1. Set up your Google Cloud Console project
2. Configure your Apple Developer account
3. Update the `googleClientId` in `app.json`
4. Test the authentication flow
5. Deploy to production

For more information, refer to:

- [Expo Auth Session Documentation](https://docs.expo.dev/versions/latest/sdk/auth-session/)
- [Apple Sign-In Documentation](https://developer.apple.com/sign-in-with-apple/)
- [Google OAuth Documentation](https://developers.google.com/identity/protocols/oauth2)

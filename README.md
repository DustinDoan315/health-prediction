# Health Prediction App

A comprehensive React Native mobile application for health risk assessment, built with Expo and integrated with a powerful health prediction API.

## Features

### 🔐 Authentication
- User registration and login
- Secure token-based authentication
- JWT token management with secure storage
- Auto-login and session persistence

### 🏥 Health Predictions
- Quick health assessment with basic metrics
- Detailed analysis with advanced health metrics
- AI-powered risk scoring and recommendations
- BMI calculation and health categorization
- Risk level visualization (Low, Medium, High)

### 📋 Medical History
- Complete history of health predictions
- Detailed view of past assessments
- Risk trend tracking
- Export and share capabilities

### 💬 AI Health Chat
- Real-time chat with AI health assistant
- Personalized health advice
- Quick question shortcuts
- Conversation history

### ⚙️ Settings & Profile
- User profile management
- App preferences
- Privacy settings
- Data export options

## Tech Stack

- **Framework**: React Native with Expo
- **Navigation**: Expo Router
- **State Management**: Redux Toolkit
- **HTTP Client**: Axios
- **Secure Storage**: Expo Secure Store
- **UI Components**: Custom components with Expo Vector Icons
- **Styling**: StyleSheet with Linear Gradients

## API Integration

The app integrates with a comprehensive Health Prediction API that provides:

- User authentication endpoints
- Health prediction algorithms
- AI chat functionality
- Health statistics and analytics
- Secure data storage

### API Base URL
`https://elf-fluent-morally.ngrok-free.app/api/v1`

## Installation & Setup

1. **Clone and install dependencies:**
   ```bash
   cd health-prediction
   yarn install
   ```

2. **Start the development server:**
   ```bash
   yarn start
   ```

3. **Run on device:**
   - Install Expo Go app on your mobile device
   - Scan the QR code from the terminal
   - Or use `yarn ios` / `yarn android` for simulators

## Project Structure

```
health-prediction/
├── app/                          # Screen components
│   ├── (tabs)/                  # Tab navigation screens
│   │   ├── index.tsx           # Dashboard/Home
│   │   ├── medical-history.tsx # Medical history list
│   │   ├── chat.tsx            # AI chat interface
│   │   └── settings.tsx        # Settings & profile
│   ├── _layout.tsx             # Root layout with providers
│   ├── welcome.tsx             # Welcome/onboarding
│   ├── auth.tsx                # Authentication
│   ├── health-prediction.tsx   # Health assessment form
│   └── prediction-result.tsx   # Results display
├── components/                  # Reusable UI components
├── hooks/                      # Custom hooks
│   └── redux.ts               # Redux hooks
├── services/                   # API services
│   └── api.ts                 # API client and endpoints
├── store/                      # Redux store
│   ├── store.ts               # Store configuration
│   └── slices/                # Redux slices
│       ├── authSlice.ts       # Authentication state
│       └── healthSlice.ts     # Health data state
├── constants/                  # App constants
└── assets/                     # Images and fonts
```

## Key Features Implementation

### 🔄 State Management
- Redux Toolkit for centralized state management
- Separate slices for authentication and health data
- Async thunks for API calls
- Error handling and loading states

### 🔒 Security
- JWT tokens stored in Expo Secure Store
- Automatic token refresh handling
- Protected routes with authentication checks
- Secure API communication

### 📱 User Experience
- Intuitive navigation with tab-based interface
- Loading states and error handling
- Offline support planning
- Beautiful gradient designs matching mockups
- Responsive design for different screen sizes

### 🤖 AI Integration
- Real-time chat with DeepSeek AI
- Contextual health advice
- Personalized recommendations
- Quick question shortcuts

## API Endpoints Used

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `GET /auth/me` - Get current user
- `POST /auth/logout` - Logout user

### Health Predictions
- `POST /health/predict` - Full health prediction
- `POST /health/predict-simple` - Simple prediction
- `GET /health/predictions` - User's prediction history
- `GET /health/predictions/{id}` - Specific prediction
- `GET /health/stats` - Health statistics

### AI Chat
- `POST /ai/chat` - Chat with AI
- `GET /ai/status` - AI service status

## Environment Setup

The app is configured to work with the provided API base URL. For production deployment, update the `BASE_URL` in `services/api.ts`.

## Health Metrics Supported

- **Basic Metrics**: Age, Height, Weight, Exercise hours, Smoking status
- **Advanced Metrics**: Blood pressure (systolic/diastolic), Cholesterol, Glucose
- **Calculated Values**: BMI, Risk score, Risk level
- **AI Recommendations**: Personalized health advice

## Risk Assessment Levels

- **Low Risk (Green)**: 0.1 - 0.4
- **Medium Risk (Yellow)**: 0.4 - 0.9  
- **High Risk (Red)**: 0.9 - 1.0

## Future Enhancements

- [ ] Push notifications for health reminders
- [ ] Health goal tracking
- [ ] Data visualization with charts
- [ ] Social sharing features
- [ ] Wearable device integration
- [ ] Offline data synchronization
- [ ] Multi-language support

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

---

**Built with ❤️ using React Native & Expo**
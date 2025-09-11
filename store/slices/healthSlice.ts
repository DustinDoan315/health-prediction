import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  apiService,
  HealthPrediction,
  HealthPredictionRequest,
  HealthStats
} from '../../services/api';

// Mock data for development
const mockPredictions: HealthPrediction[] = [
  {
    id: 1,
    user_id: 1,
    age: 28,
    height_cm: 175,
    weight_kg: 70,
    bmi: 22.9,
    systolic_bp: 120,
    diastolic_bp: 80,
    cholesterol: 180,
    glucose: 95,
    smoking: false,
    exercise_hours_per_week: 5,
    risk_score: 0.15,
    risk_level: 'low',
    recommendations: [
      'Maintain your current exercise routine of 5 hours per week',
      'Continue with your healthy diet and avoid processed foods',
      'Consider adding more cardiovascular exercises to your routine',
      'Schedule regular health check-ups annually'
    ],
    ai_powered: true,
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
  },
  {
    id: 2,
    user_id: 1,
    age: 28,
    height_cm: 175,
    weight_kg: 72,
    bmi: 23.5,
    systolic_bp: 125,
    diastolic_bp: 82,
    cholesterol: 190,
    glucose: 98,
    smoking: false,
    exercise_hours_per_week: 3,
    risk_score: 0.25,
    risk_level: 'medium',
    recommendations: [
      'Increase your exercise routine to at least 4-5 hours per week',
      'Monitor your blood pressure regularly',
      'Consider reducing sodium intake in your diet',
      'Maintain a consistent sleep schedule of 7-8 hours'
    ],
    ai_powered: true,
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
  },
  {
    id: 3,
    user_id: 1,
    age: 28,
    height_cm: 175,
    weight_kg: 75,
    bmi: 24.5,
    systolic_bp: 130,
    diastolic_bp: 85,
    cholesterol: 200,
    glucose: 105,
    smoking: false,
    exercise_hours_per_week: 2,
    risk_score: 0.35,
    risk_level: 'medium',
    recommendations: [
      'Significantly increase your physical activity to 5+ hours per week',
      'Focus on cardiovascular exercises like running, cycling, or swimming',
      'Consider consulting a nutritionist for dietary improvements',
      'Monitor your blood glucose levels more frequently'
    ],
    ai_powered: false,
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week ago
  },
  {
    id: 4,
    user_id: 1,
    age: 28,
    height_cm: 175,
    weight_kg: 78,
    bmi: 25.5,
    systolic_bp: 135,
    diastolic_bp: 88,
    cholesterol: 220,
    glucose: 110,
    smoking: false,
    exercise_hours_per_week: 1,
    risk_score: 0.45,
    risk_level: 'high',
    recommendations: [
      'Immediately increase physical activity to 6+ hours per week',
      'Consider working with a personal trainer for structured exercise',
      'Implement a strict low-carb, high-protein diet',
      'Schedule a consultation with a healthcare provider',
      'Monitor blood pressure and glucose levels daily'
    ],
    ai_powered: true,
    created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
  },
  {
    id: 5,
    user_id: 1,
    age: 28,
    height_cm: 175,
    weight_kg: 68,
    bmi: 22.2,
    systolic_bp: 115,
    diastolic_bp: 75,
    cholesterol: 170,
    glucose: 90,
    smoking: false,
    exercise_hours_per_week: 6,
    risk_score: 0.08,
    risk_level: 'low',
    recommendations: [
      'Excellent health metrics! Keep up the great work',
      'Continue your current exercise routine',
      'Maintain your balanced diet',
      'Consider adding meditation or stress management techniques'
    ],
    ai_powered: true,
    created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), // 2 weeks ago
  },
];

const mockStats: HealthStats = {
  total_predictions: 5,
  risk_distribution: {
    low: 2,
    medium: 2,
    high: 1,
  },
  average_risk_score: 0.26,
  ai_usage_percentage: 80,
};

const initialState: HealthState = {
  predictions: mockPredictions,
  currentPrediction: null,
  stats: mockStats,
  isLoading: false,
  error: null,
  lastFetchTime: null,
  predictionsLoaded: true,
  statsLoaded: true,
};

interface HealthState {
  predictions: HealthPrediction[];
  currentPrediction: HealthPrediction | null;
  stats: HealthStats | null;
  isLoading: boolean;
  error: string | null;
  lastFetchTime: number | null;
  predictionsLoaded: boolean;
  statsLoaded: boolean;
}

// Async thunks
export const createPrediction = createAsyncThunk(
  'health/createPrediction',
  async (data: HealthPredictionRequest, { rejectWithValue }) => {
    try {
      const prediction = await apiService.createHealthPrediction(data);
      return prediction;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to create prediction');
    }
  }
);

export const createSimplePrediction = createAsyncThunk(
  'health/createSimplePrediction',
  async (data: Pick<HealthPredictionRequest, 'age' | 'height_cm' | 'weight_kg' | 'smoking' | 'exercise_hours_per_week'>, { rejectWithValue }) => {
    try {
      const prediction = await apiService.createSimpleHealthPrediction(data);
      return prediction;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to create prediction');
    }
  }
);

export const fetchPredictions = createAsyncThunk(
  'health/fetchPredictions',
  async (limit: number, { rejectWithValue }) => {
    try {
      const predictions = await apiService.getUserPredictions(limit);
      return predictions;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to fetch predictions');
    }
  }
);

export const fetchPredictionById = createAsyncThunk(
  'health/fetchPredictionById',
  async (id: number, { rejectWithValue }) => {
    try {
      const prediction = await apiService.getPredictionById(id);
      return prediction;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to fetch prediction');
    }
  }
);

export const fetchHealthStats = createAsyncThunk(
  'health/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const stats = await apiService.getHealthStats();
      return stats;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to fetch stats');
    }
  }
);

const healthSlice = createSlice({
  name: 'health',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentPrediction: (state, action) => {
      state.currentPrediction = action.payload;
    },
    clearCurrentPrediction: (state) => {
      state.currentPrediction = null;
    },
    resetLoadedFlags: (state) => {
      state.predictionsLoaded = false;
      state.statsLoaded = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create prediction
      .addCase(createPrediction.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createPrediction.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentPrediction = action.payload;
        state.predictions.unshift(action.payload);
        state.error = null;
      })
      .addCase(createPrediction.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Create simple prediction
      .addCase(createSimplePrediction.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createSimplePrediction.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentPrediction = action.payload;
        state.predictions.unshift(action.payload);
        state.error = null;
      })
      .addCase(createSimplePrediction.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch predictions
      .addCase(fetchPredictions.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPredictions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.predictions = action.payload;
        state.lastFetchTime = Date.now();
        state.predictionsLoaded = true;
        state.error = null;
      })
      .addCase(fetchPredictions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch prediction by ID
      .addCase(fetchPredictionById.fulfilled, (state, action) => {
        state.currentPrediction = action.payload;
      })
      // Fetch stats
      .addCase(fetchHealthStats.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchHealthStats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.stats = action.payload;
        state.statsLoaded = true;
      })
      .addCase(fetchHealthStats.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError: clearHealthError, setCurrentPrediction, clearCurrentPrediction, resetLoadedFlags } = healthSlice.actions;
export default healthSlice.reducer;

import { HealthPrediction, HealthPredictionRequest, HealthStats, apiService } from '../../services/api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const initialState: HealthState = {
  predictions: [],
  currentPrediction: null,
  stats: null,
  isLoading: false,
  error: null,
  lastFetchTime: null,
  predictionsLoaded: false,
  statsLoaded: false,
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

export const { clearError, setCurrentPrediction, clearCurrentPrediction, resetLoadedFlags } = healthSlice.actions;
export default healthSlice.reducer;

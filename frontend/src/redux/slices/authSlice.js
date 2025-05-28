import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "../../services/auth";

// Async thunks for authentication
export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      return await authService.login(credentials);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue, dispatch }) => {
    try {
      // Track timing for analytics
      const startTime = performance.now();

      // Make registration request with timing options for debugging
      const response = await authService.register(userData, {
        timeout: 10000, // 10 seconds timeout
        headers: {
          "X-Client-Version": "1.0.0",
          "X-Registration-Source": "web",
        },
      });

      const endTime = performance.now();
      console.log(`Registration thunk completed in ${endTime - startTime}ms`);
      console.log("Registration success in thunk:", response);

      // Record success metrics
      if (window.analytics) {
        window.analytics.track("User Registration", {
          success: true,
          time: endTime - startTime,
        });
      }

      // If successful, try to get the current user details
      try {
        dispatch(getCurrentUser());
      } catch (userError) {
        console.warn(
          "Got user data after registration but failed to load user details:",
          userError
        );
      }

      return response;
    } catch (error) {
      console.error("Registration thunk error:", error);

      // Track failure for analytics
      if (window.analytics) {
        window.analytics.track("User Registration", {
          success: false,
          errorType: error.code || "unknown",
        });
      }

      // Enhanced error handling with more context and better user messages
      if (error.code === "USER_EXISTS") {
        return rejectWithValue({
          message:
            "This email is already registered. Please use a different email or log in.",
          field: "email",
          code: "USER_EXISTS",
        });
      } else if (error.error) {
        return rejectWithValue({
          message: error.error,
          originalError: error,
        });
      } else if (error.message) {
        return rejectWithValue({
          message: error.message,
          originalError: error,
        });
      } else if (typeof error === "string") {
        return rejectWithValue({
          message: error,
        });
      }

      return rejectWithValue({
        message: "Registration failed. Please try again.",
        originalError: error,
      });
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      await authService.logout();
      dispatch(logout());
      return true;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getCurrentUser = createAsyncThunk(
  "auth/getCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      return await authService.getCurrentUser();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  user: null,
  isAuthenticated: localStorage.getItem("authenticated") === "true",
  loading: false,
  error: null,
  errorDetails: null,
  lastRegistrationAttempt: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      // The actual API call is handled in the thunk
    },
    clearError(state) {
      state.error = null;
      state.errorDetails = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Register cases
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        // Store the enhanced error object or just use the message if it's a string
        if (typeof action.payload === "object" && action.payload !== null) {
          state.error = action.payload.message || "Registration failed";
          state.errorDetails = action.payload;
        } else {
          state.error = action.payload;
          state.errorDetails = { message: action.payload };
        }
      })

      // Logout cases
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get current user cases
      .addCase(getCurrentUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
        state.user = null;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;

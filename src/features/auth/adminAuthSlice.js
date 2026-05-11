import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from '../../services/authService';

export const adminLogin = createAsyncThunk(
  'adminAuth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authService.adminLogin(credentials);
      const payload = response.data?.data ?? response.data;
      const token = payload.access_token ?? payload.token;
      const user = payload.user ?? payload;

      if (!token || !user) {
        return rejectWithValue('Invalid login response');
      }

      if (user.role !== 'admin') {
        return rejectWithValue('Access denied. Admin role required.');
      }

      localStorage.setItem('admin_token', token);
      localStorage.setItem('admin_user', JSON.stringify(user));
      return { ...payload, access_token: token, user };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.response?.data?.error || 'Login failed');
    }
  }
);

export const adminLoginWith2FA = createAsyncThunk(
  'adminAuth/loginWith2FA',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authService.adminLoginWith2FA(credentials);
      const payload = response.data?.data ?? response.data;
      const token = payload.access_token ?? payload.token;
      const user = payload.user ?? payload;

      if (!token || !user) {
        return rejectWithValue('Invalid 2FA verification');
      }

      localStorage.setItem('admin_token', token);
      localStorage.setItem('admin_user', JSON.stringify(user));
      return { ...payload, access_token: token, user };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || '2FA verification failed');
    }
  }
);

export const adminLogout = createAsyncThunk(
  'adminAuth/logout',
  async (_, { dispatch }) => {
    try {
      await authService.adminLogout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
      dispatch(clearAdminAuth());
    }
  }
);

export const adminGetProfile = createAsyncThunk(
  'adminAuth/getProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authService.adminGetProfile();
      const user = response.data?.data || response.data;
      localStorage.setItem('admin_user', JSON.stringify(user));
      return user;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch profile');
    }
  }
);

export const adminDisable2FA = createAsyncThunk(
  'adminAuth/disable2FA',
  async (password, { dispatch, rejectWithValue }) => {
    try {
      await authService.adminDisable2FA(password);
      await dispatch(adminGetProfile());
      return true;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to disable 2FA');
    }
  }
);

const adminAuthSlice = createSlice({
  name: 'adminAuth',
  initialState: {
    user: JSON.parse(localStorage.getItem('admin_user')) || null,
    token: localStorage.getItem('admin_token') || null,
    loading: false,
    error: null,
  },
  reducers: {
    clearAdminAuth: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(adminLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(adminLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.access_token;
      })
      .addCase(adminLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(adminLoginWith2FA.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(adminLoginWith2FA.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.access_token;
      })
      .addCase(adminLoginWith2FA.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(adminGetProfile.fulfilled, (state, action) => {
        state.user = action.payload;
      });
  },
});

export const { clearAdminAuth } = adminAuthSlice.actions;
export default adminAuthSlice.reducer;

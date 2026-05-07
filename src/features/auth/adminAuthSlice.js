import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from '../../services/authService';

export const adminLogin = createAsyncThunk(
  'adminAuth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials);
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

export const adminLogout = createAsyncThunk(
  'adminAuth/logout',
  async (_, { dispatch }) => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
      dispatch(clearAdminAuth());
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
      });
  },
});

export const { clearAdminAuth } = adminAuthSlice.actions;
export default adminAuthSlice.reducer;

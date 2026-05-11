import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../services/api';

export const fetchActivePromotions = createAsyncThunk(
  'promotions/fetchActive',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/promotions/active');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch promotions');
    }
  }
);

export const fetchAllPromotions = createAsyncThunk(
  'promotions/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/admin/promotions');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch all promotions');
    }
  }
);

export const createPromotion = createAsyncThunk(
  'promotions/create',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post('/admin/promotions', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create promotion');
    }
  }
);

export const updatePromotion = createAsyncThunk(
  'promotions/update',
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      // Use POST with _method=PUT for file upload support in Laravel
      if (formData instanceof FormData) {
        formData.append('_method', 'PUT');
      }
      const response = await axios.post(`/admin/promotions/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update promotion');
    }
  }
);

export const deletePromotion = createAsyncThunk(
  'promotions/delete',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`/admin/promotions/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete promotion');
    }
  }
);

const promotionSlice = createSlice({
  name: 'promotions',
  initialState: {
    active: [],
    all: [],
    loading: false,
    updateLoading: false,
    error: null,
    success: false
  },
  reducers: {
    resetPromotionState: (state) => {
      state.success = false;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Active
      .addCase(fetchActivePromotions.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchActivePromotions.fulfilled, (state, action) => {
        state.loading = false;
        state.active = action.payload;
      })
      .addCase(fetchActivePromotions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch All
      .addCase(fetchAllPromotions.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllPromotions.fulfilled, (state, action) => {
        state.loading = false;
        state.all = action.payload;
      })
      // Create
      .addCase(createPromotion.pending, (state) => {
        state.updateLoading = true;
      })
      .addCase(createPromotion.fulfilled, (state, action) => {
        state.updateLoading = false;
        state.success = true;
        state.all.push(action.payload.promotion);
      })
      .addCase(createPromotion.rejected, (state, action) => {
        state.updateLoading = false;
        state.error = action.payload;
      })
      // Update
      .addCase(updatePromotion.pending, (state) => {
        state.updateLoading = true;
      })
      .addCase(updatePromotion.fulfilled, (state, action) => {
        state.updateLoading = false;
        state.success = true;
        const index = state.all.findIndex(p => p.id === action.payload.promotion.id);
        if (index !== -1) state.all[index] = action.payload.promotion;
      })
      .addCase(updatePromotion.rejected, (state, action) => {
        state.updateLoading = false;
        state.error = action.payload;
      })
      // Delete
      .addCase(deletePromotion.fulfilled, (state, action) => {
        state.all = state.all.filter(p => p.id !== action.payload);
      });
  }
});

export const { resetPromotionState } = promotionSlice.actions;
export default promotionSlice.reducer;

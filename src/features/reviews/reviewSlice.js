import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import reviewService from '../../services/reviewService';

export const fetchReviews = createAsyncThunk(
  'reviews/fetchByProduct',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await reviewService.getByProductId(productId);
      const reviews = response.data?.data ?? response.data;
      return Array.isArray(reviews) ? reviews : [];
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const addReview = createAsyncThunk(
  'reviews/add',
  async (reviewData, { rejectWithValue }) => {
    try {
      const response = await reviewService.addReview(reviewData);
      const review = response.data?.data ?? response.data;
      return review && typeof review === 'object' ? review : null;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const addReply = createAsyncThunk(
  'reviews/addReply',
  async ({ reviewId, replyData }, { rejectWithValue }) => {
    try {
      const response = await reviewService.addReply(reviewId, replyData);
      const reply = response.data?.data ?? response.data;
      return { reviewId, reply: reply && typeof reply === 'object' ? reply : null };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const reviewSlice = createSlice({
  name: 'reviews',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.items = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addReview.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.items.unshift(action.payload);
        }
      })
      .addCase(addReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addReply.fulfilled, (state, action) => {
        state.loading = false;
        if (!action.payload.reply) return;

        const review = state.items.find(r => r.id === action.payload.reviewId);
        if (review) {
          if (!review.replies) review.replies = [];
          review.replies.push(action.payload.reply);
        }
      })
      .addCase(addReply.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addReply.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default reviewSlice.reducer;

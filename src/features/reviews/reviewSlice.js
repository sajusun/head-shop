import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import reviewService from '../../services/reviewService';

export const fetchReviews = createAsyncThunk(
  'reviews/fetchByProduct',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await reviewService.getByProductId(productId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addReview = createAsyncThunk(
  'reviews/add',
  async (reviewData, { rejectWithValue }) => {
    try {
      const response = await reviewService.addReview(reviewData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addReply = createAsyncThunk(
  'reviews/addReply',
  async ({ reviewId, replyData }, { rejectWithValue }) => {
    try {
      const response = await reviewService.addReply(reviewId, replyData);
      return { reviewId, reply: response.data };
    } catch (error) {
      return rejectWithValue(error.message);
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
        state.items = action.payload;
      })
      .addCase(fetchReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addReview.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      .addCase(addReply.fulfilled, (state, action) => {
        const review = state.items.find(r => r.id === action.payload.reviewId);
        if (review) {
          if (!review.replies) review.replies = [];
          review.replies.push(action.payload.reply);
        }
      });
  },
});

export default reviewSlice.reducer;

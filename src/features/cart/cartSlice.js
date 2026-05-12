import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Async Thunks for DB operations
export const fetchCart = createAsyncThunk('cart/fetchCart', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/cart');
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Failed to fetch cart');
  }
});

export const syncCartWithDB = createAsyncThunk('cart/sync', async (items, { rejectWithValue }) => {
  try {
    const response = await api.post('/cart/sync', { items });
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Failed to sync cart');
  }
});

export const addToCartDB = createAsyncThunk('cart/add', async (item, { rejectWithValue }) => {
  try {
    const response = await api.post('/cart', {
      product_id: item.id,
      product_variant_id: item.product_variant_id,
      quantity: item.quantity || 1,
      selectedColor: item.selectedColor,
      selectedSize: item.selectedSize
    });
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Failed to add to cart');
  }
});

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: (() => {
      try {
        const savedCart = localStorage.getItem('cart');
        return savedCart ? JSON.parse(savedCart) : [];
      } catch (e) {
        console.error('Failed to parse cart from localStorage:', e);
        return [];
      }
    })(),
    buyNowItem: (() => {
      try {
        const savedBuyNow = localStorage.getItem('buyNowItem');
        return savedBuyNow ? JSON.parse(savedBuyNow) : null;
      } catch (e) {
        return null;
      }
    })(),
    loading: false,
    error: null
  },
  reducers: {
    setBuyNowItem: (state, action) => {
      state.buyNowItem = action.payload;
      localStorage.setItem('buyNowItem', JSON.stringify(action.payload));
    },
    clearBuyNowItem: (state) => {
      state.buyNowItem = null;
      localStorage.removeItem('buyNowItem');
    },
    addToCart: (state, action) => {
      const { id, product_variant_id, selectedColor, selectedSize } = action.payload;
      const existingItem = state.items.find(item => 
        item.id === id && 
        item.product_variant_id === product_variant_id &&
        item.selectedColor === selectedColor && 
        item.selectedSize === selectedSize
      );

      if (existingItem) {
        existingItem.quantity += action.payload.quantity || 1;
      } else {
        state.items.push({ ...action.payload, quantity: action.payload.quantity || 1 });
      }
      localStorage.setItem('cart', JSON.stringify(state.items));
    },
    removeFromCart: (state, action) => {
      if (typeof action.payload === 'object') {
        const { id, product_variant_id, selectedColor, selectedSize } = action.payload;
        state.items = state.items.filter(item => 
          !(item.id === id && item.product_variant_id === product_variant_id && item.selectedColor === selectedColor && item.selectedSize === selectedSize)
        );
        
        // If authenticated, we should also call the delete API
        if (action.payload.cart_id) {
          api.delete(`/cart/${action.payload.cart_id}`).catch(err => console.error('DB cart delete failed', err));
        }
      } else {
        state.items = state.items.filter(item => item.id !== action.payload);
      }
      localStorage.setItem('cart', JSON.stringify(state.items));
    },
    updateQuantity: (state, action) => {
      const { id, product_variant_id, selectedColor, selectedSize, quantity, cart_id } = action.payload;
      const item = state.items.find(item => 
        item.id === id && 
        item.product_variant_id === product_variant_id &&
        item.selectedColor === selectedColor && 
        item.selectedSize === selectedSize
      );
      if (item) {
        item.quantity = quantity;
      }
      localStorage.setItem('cart', JSON.stringify(state.items));

      // If authenticated, update DB
      if (cart_id) {
        api.put(`/cart/${cart_id}`, { quantity }).catch(err => console.error('DB cart update failed', err));
      }
    },
    clearCart: (state) => {
      state.items = [];
      localStorage.removeItem('cart');
      // If authenticated, clear DB
      api.delete('/cart/clear').catch(err => console.error('DB cart clear failed', err));
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.items = action.payload;
        localStorage.setItem('cart', JSON.stringify(state.items));
        state.loading = false;
      })
      .addCase(syncCartWithDB.fulfilled, (state, action) => {
        state.items = action.payload;
        localStorage.setItem('cart', JSON.stringify(state.items));
      })
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { 
  addToCart, 
  removeFromCart, 
  updateQuantity, 
  clearCart, 
  setBuyNowItem, 
  clearBuyNowItem 
} = cartSlice.actions;

export const selectCartTotal = (state) => {
  const targetItems = state.cart.buyNowItem ? [state.cart.buyNowItem] : state.cart.items;
  return targetItems.reduce((total, item) => {
    const activePrice = Number(item.offer_price || item.offerPrice || item.effective_price || item.price || 0);
    const quantity = Number(item.quantity || 0);
    return total + (activePrice * quantity);
  }, 0);
};

export default cartSlice.reducer;

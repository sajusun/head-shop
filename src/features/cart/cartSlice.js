import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: JSON.parse(localStorage.getItem('cart')) || [],
  },
  reducers: {
    addToCart: (state, action) => {
      const { id, selectedColor, selectedSize, ...rest } = action.payload;
      const existingItem = state.items.find(item => 
        item.id === id && 
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
      // action.payload could be an object with id and variants, or just id for backward compatibility
      if (typeof action.payload === 'object') {
        const { id, selectedColor, selectedSize } = action.payload;
        state.items = state.items.filter(item => 
          !(item.id === id && item.selectedColor === selectedColor && item.selectedSize === selectedSize)
        );
      } else {
        state.items = state.items.filter(item => item.id !== action.payload);
      }
      localStorage.setItem('cart', JSON.stringify(state.items));
    },
    updateQuantity: (state, action) => {
      const { id, selectedColor, selectedSize, quantity } = action.payload;
      const item = state.items.find(item => 
        item.id === id && 
        item.selectedColor === selectedColor && 
        item.selectedSize === selectedSize
      );
      if (item) {
        item.quantity = quantity;
      }
      localStorage.setItem('cart', JSON.stringify(state.items));
    },
    clearCart: (state) => {
      state.items = [];
      localStorage.removeItem('cart');
    }
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export const selectCartTotal = (state) => 
  state.cart.items.reduce((total, item) => {
    const activePrice = item.offerPrice || item.price;
    return total + activePrice * item.quantity;
  }, 0);

export default cartSlice.reducer;

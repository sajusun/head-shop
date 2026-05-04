import { createSlice } from '@reduxjs/toolkit';

const blogFavoriteSlice = createSlice({
  name: 'blogFavorites',
  initialState: {
    items: JSON.parse(localStorage.getItem('blogFavorites')) || [],
  },
  reducers: {
    toggleBlogFavorite: (state, action) => {
      const index = state.items.findIndex(item => item.id === action.payload.id);
      if (index >= 0) {
        state.items.splice(index, 1);
      } else {
        state.items.push(action.payload);
      }
      localStorage.setItem('blogFavorites', JSON.stringify(state.items));
    }
  },
});

export const { toggleBlogFavorite } = blogFavoriteSlice.actions;
export default blogFavoriteSlice.reducer;

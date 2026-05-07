import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import productReducer from '../features/products/productSlice';
import cartReducer from '../features/cart/cartSlice';
import favoriteReducer from '../features/favorites/favoriteSlice';
import blogFavoriteReducer from '../features/favorites/blogFavoriteSlice';
import reviewReducer from '../features/reviews/reviewSlice';
import notificationReducer from '../features/notifications/notificationSlice';
import settingsReducer from '../features/settings/settingsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productReducer,
    cart: cartReducer,
    favorites: favoriteReducer,
    blogFavorites: blogFavoriteReducer,
    reviews: reviewReducer,
    notifications: notificationReducer,
    settings: settingsReducer,
  },
});

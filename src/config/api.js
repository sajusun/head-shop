const USE_API = import.meta.env.VITE_USE_API === 'true';

export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL,
  ENDPOINTS: {
    PRODUCTS: import.meta.env.VITE_API_PRODUCTS,
    CART: import.meta.env.VITE_API_CART,
    AUTH: import.meta.env.VITE_API_AUTH,
    REVIEWS: import.meta.env.VITE_API_REVIEWS,
  },
  USE_API,
};

export default API_CONFIG;

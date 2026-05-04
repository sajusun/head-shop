import api from './api';
import API_CONFIG from '../config/api';
import { mockProducts } from '../mock/products';

const productService = {
  getAll: async () => {
    if (!API_CONFIG.USE_API) {
      return new Promise((resolve) => {
        setTimeout(() => resolve({ data: mockProducts }), 500);
      });
    }
    return api.get(API_CONFIG.ENDPOINTS.PRODUCTS);
  },

  getById: async (id) => {
    if (!API_CONFIG.USE_API) {
      return new Promise((resolve, reject) => {
        const product = mockProducts.find(p => p.id === id);
        setTimeout(() => {
          if (product) resolve({ data: product });
          else reject(new Error('Product not found'));
        }, 500);
      });
    }
    return api.get(`${API_CONFIG.ENDPOINTS.PRODUCTS}/${id}`);
  },

  getBySlug: async (slug) => {
    if (!API_CONFIG.USE_API) {
      return new Promise((resolve, reject) => {
        const product = mockProducts.find(p => p.slug === slug);
        setTimeout(() => {
          if (product) resolve({ data: product });
          else reject(new Error('Product not found'));
        }, 500);
      });
    }
    return api.get(`${API_CONFIG.ENDPOINTS.PRODUCTS}/slug/${slug}`);
  }
};

export default productService;

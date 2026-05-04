import api from './api';
import API_CONFIG from '../config/api';
import { mockReviews } from '../mock/reviews';

const reviewService = {
  getByProductId: async (productId) => {
    if (!API_CONFIG.USE_API) {
      return new Promise((resolve) => {
        const reviews = mockReviews.filter(r => r.productId === productId);
        setTimeout(() => resolve({ data: reviews }), 500);
      });
    }
    return api.get(`${API_CONFIG.ENDPOINTS.REVIEWS}/${productId}`);
  },

  addReview: async (reviewData) => {
    if (!API_CONFIG.USE_API) {
      return new Promise((resolve) => {
        const newReview = {
          id: Date.now().toString(),
          ...reviewData,
          date: new Date().toISOString().split('T')[0],
          replies: []
        };
        setTimeout(() => resolve({ data: newReview }), 500);
      });
    }
    return api.post(API_CONFIG.ENDPOINTS.REVIEWS, reviewData);
  },

  deleteReview: async (id) => {
    if (!API_CONFIG.USE_API) {
      return new Promise((resolve) => {
        setTimeout(() => resolve({ success: true }), 500);
      });
    }
    return api.delete(`${API_CONFIG.ENDPOINTS.REVIEWS}/${id}`);
  },

  addReply: async (reviewId, replyData) => {
    if (!API_CONFIG.USE_API) {
      return new Promise((resolve) => {
        const newReply = {
          id: Date.now().toString(),
          ...replyData,
          date: new Date().toISOString().split('T')[0],
        };
        setTimeout(() => resolve({ data: newReply }), 500);
      });
    }
    return api.post(`${API_CONFIG.ENDPOINTS.REVIEWS}/${reviewId}/replies`, replyData);
  }
};

export default reviewService;

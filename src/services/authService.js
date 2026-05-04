import api from './api';
import API_CONFIG from '../config/api';
import { mockUser } from '../mock/users';

const authService = {
  login: async (credentials) => {
    if (!API_CONFIG.USE_API) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if (credentials.email === 'john@example.com' && credentials.password === 'password') {
            resolve({ data: mockUser });
          } else {
            reject({ response: { data: { message: 'Invalid credentials' } } });
          }
        }, 1000);
      });
    }
    return api.post(`${API_CONFIG.ENDPOINTS.AUTH}/login`, credentials);
  },

  register: async (userData) => {
    if (!API_CONFIG.USE_API) {
      return new Promise((resolve) => {
        setTimeout(() => resolve({ data: { ...mockUser, ...userData } }), 1000);
      });
    }
    return api.post(`${API_CONFIG.ENDPOINTS.AUTH}/register`, userData);
  },

  getProfile: async () => {
    if (!API_CONFIG.USE_API) {
      return new Promise((resolve) => {
        setTimeout(() => resolve({ data: mockUser }), 500);
      });
    }
    return api.get(`${API_CONFIG.ENDPOINTS.AUTH}/profile`);
  }
};

export default authService;

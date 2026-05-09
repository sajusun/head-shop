import api from './api';
import API_CONFIG from '../config/api';
import { mockUser } from '../mock/users';

const mockAdmin = {
  ...mockUser,
  id: '1',
  name: 'Admin User',
  email: 'admin@herdshop.com',
  role: 'admin',
  token: 'mock-admin-token',
};

const authService = {
  login: async (credentials) => {
    if (!API_CONFIG.USE_API) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if (credentials.email === 'john@example.com' && credentials.password === 'password') {
            resolve({ data: { ...mockUser, role: 'user' } });
          } else if (credentials.email === 'admin@herdshop.com' && credentials.password === 'admin123') {
            resolve({ data: mockAdmin });
          } else {
            reject({ response: { data: { message: 'Invalid credentials' } } });
          }
        }, 1000);
      });
    }
    return api.post(`${API_CONFIG.ENDPOINTS.AUTH}/login`, credentials);
  },

  loginWith2FA: async (credentials) => {
    if (!API_CONFIG.USE_API) {
      return authService.login(credentials); // Mock just logs in normally
    }
    return api.post(`${API_CONFIG.ENDPOINTS.AUTH}/login-2fa`, credentials);
  },

  register: async (userData) => {
    if (!API_CONFIG.USE_API) {
      return new Promise((resolve) => {
        setTimeout(() => resolve({ data: { ...mockUser, ...userData, role: 'user' } }), 1000);
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
    return api.get(`${API_CONFIG.ENDPOINTS.AUTH}/user-profile`);
  },

  logout: async () => {
    if (!API_CONFIG.USE_API) {
      return Promise.resolve();
    }
    return api.post(`${API_CONFIG.ENDPOINTS.AUTH}/logout`);
  },
  
  updateProfile: async (userData) => {
    return api.post(`${API_CONFIG.ENDPOINTS.AUTH}/profile`, userData);
  },

  changePassword: async (passwordData) => {
    return api.post(`${API_CONFIG.ENDPOINTS.AUTH}/change-password`, passwordData);
  },

  get2FAQRCode: async () => {
    return api.get(`${API_CONFIG.ENDPOINTS.AUTH}/two-factor-qr`);
  },

  confirm2FA: async (code) => {
    return api.post(`${API_CONFIG.ENDPOINTS.AUTH}/two-factor-confirm`, { code });
  },

  disable2FA: async (current_password) => {
    return api.post(`${API_CONFIG.ENDPOINTS.AUTH}/two-factor-disable`, { current_password });
  }
};

export default authService;

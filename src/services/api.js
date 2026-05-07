import axios from 'axios';
import API_CONFIG from '../config/api';

const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    const isAdminRoute = config.url.startsWith('/admin');
    const isPageAdmin = typeof window !== 'undefined' && window.location.pathname.startsWith('/admin');
    
    // Mutation requests (POST, PUT, DELETE) on products/categories often aren't prefixed
    const isMutation = ['post', 'put', 'patch', 'delete'].includes(config.method?.toLowerCase());
    
    let token = localStorage.getItem('token');

    // Prefer admin_token if we're in the admin context
    if (isAdminRoute || isPageAdmin) {
      token = localStorage.getItem('admin_token') || token;
    } 
    // Fallback for admin actions done from non-admin pages (unlikely but possible)
    else if (isMutation && !token) {
      token = localStorage.getItem('admin_token');
    }
      
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const isAdminRoute = error.config.url.startsWith('/admin');
      const isPageAdmin = typeof window !== 'undefined' && window.location.pathname.startsWith('/admin');
      
      if ((isAdminRoute || isPageAdmin) && localStorage.getItem('admin_token')) {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
        window.location.href = '/admin/login';
      } else if (localStorage.getItem('token')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;

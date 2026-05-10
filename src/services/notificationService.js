import api from './api';

const notificationService = {
  /**
   * Fetch paginated notifications for the logged-in user.
   */
  fetchAll: (page = 1) => api.get(`/notifications?page=${page}`),

  /**
   * Get unread count only (lightweight — used for polling).
   */
  fetchUnreadCount: () => api.get('/notifications/unread-count'),

  /**
   * Mark a single notification as read.
   */
  markAsRead: (id) => api.post(`/notifications/${id}/read`),

  /**
   * Mark all notifications as read.
   */
  markAllAsRead: () => api.post('/notifications/read-all'),

  /**
   * Delete a notification.
   */
  deleteNotification: (id) => api.delete(`/notifications/${id}`),

  /**
   * Get current user's notification preferences.
   */
  getPreferences: () => api.get('/auth/notification-preferences'),

  /**
   * Update the user's notification preferences.
   * @param {{ order_updates: boolean, promotions: boolean, newsletter: boolean }} prefs
   */
  updatePreferences: (prefs) => api.put('/auth/notification-preferences', prefs),
};

export default notificationService;

import { useEffect, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setAdminUnreadCount } from '../features/notifications/adminNotificationSlice';
import notificationService from '../services/notificationService';

const POLL_INTERVAL_MS = 30000; // 30 seconds

/**
 * useAdminNotificationPolling
 * Polls /api/notifications/unread-count specifically for the admin panel.
 */
const useAdminNotificationPolling = () => {
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.adminAuth);
  const intervalRef = useRef(null);

  const poll = useCallback(async () => {
    // Only poll if admin is logged in
    const currentToken = token || localStorage.getItem('admin_token');
    if (!user || !currentToken || user.role !== 'admin') return;

    try {
      const response = await notificationService.fetchUnreadCount();
      const count = response?.data?.data?.unread_count ?? 0;
      dispatch(setAdminUnreadCount(count));
    } catch (error) {
      // Silently fail to avoid disrupting admin experience
      console.warn('Admin notification polling failed:', error.message);
    }
  }, [user, token, dispatch]);

  useEffect(() => {
    const currentToken = token || localStorage.getItem('admin_token');
    if (!user || !currentToken || user.role !== 'admin') {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      dispatch(setAdminUnreadCount(0));
      return;
    }

    // Initial poll
    poll();

    // Set interval
    intervalRef.current = setInterval(poll, POLL_INTERVAL_MS);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [user, token, poll, dispatch]);
};

export default useAdminNotificationPolling;

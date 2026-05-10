import { useEffect, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setUnreadCount } from '../features/notifications/notificationSlice';
import notificationService from '../services/notificationService';

const POLL_INTERVAL_MS = 30000; // 30 seconds

/**
 * useNotificationPolling
 * Polls /api/notifications/unread-count every 30s when the user is logged in.
 * Updates the Redux unreadCount without doing a full fetch (lightweight).
 * The full notification list is only fetched when the bell is opened.
 */
const useNotificationPolling = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const intervalRef = useRef(null);

  const poll = useCallback(async () => {
    if (!user || !localStorage.getItem('token')) return;

    try {
      const response = await notificationService.fetchUnreadCount();
      const count = response?.data?.data?.unread_count ?? 0;
      dispatch(setUnreadCount(count));
    } catch {
      // Silently fail — don't disrupt UI on network issues
    }
  }, [user, dispatch]);

  useEffect(() => {
    if (!user) {
      // User logged out — clear interval and reset count
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      dispatch(setUnreadCount(0));
      return;
    }

    // Immediately poll on login/mount
    poll();

    // Set up recurring poll
    intervalRef.current = setInterval(poll, POLL_INTERVAL_MS);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [user, poll, dispatch]);
};

export default useNotificationPolling;

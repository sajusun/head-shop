import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Bell, Package, Tag, Info, AlertTriangle, Trash2, CheckCheck, RefreshCw } from 'lucide-react';
import {
  fetchNotificationsThunk,
  markAsReadThunk,
  markAllAsReadThunk,
  deleteNotificationThunk,
} from '../../features/notifications/notificationSlice';

const NotificationCenter = () => {
  const [isOpen, setIsOpen]       = useState(false);
  const [fetched, setFetched]     = useState(false);
  const dropdownRef               = useRef(null);
  const dispatch                  = useDispatch();
  const navigate                  = useNavigate();
  const { notifications, unreadCount, loading } = useSelector(state => state.notifications);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch full list when bell is opened (only once per session, or manually refreshed)
  useEffect(() => {
    if (isOpen && !fetched) {
      dispatch(fetchNotificationsThunk());
      setFetched(true);
    }
  }, [isOpen, fetched, dispatch]);

  const handleRefresh = () => {
    dispatch(fetchNotificationsThunk());
  };

  const handleMarkAsRead = (id) => {
    dispatch(markAsReadThunk(id));
  };

  const handleMarkAllAsRead = () => {
    dispatch(markAllAsReadThunk());
  };

  const handleDelete = (e, id) => {
    e.stopPropagation();
    dispatch(deleteNotificationThunk(id));
  };

  const handleNotifClick = (notif) => {
    if (!notif.read) handleMarkAsRead(notif.id);
    if (notif.link) {
      setIsOpen(false);
      navigate(notif.link);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'order': return <Package size={16} className="text-blue-500" />;
      case 'promo': return <Tag size={16} className="text-amber-500" />;
      case 'alert': return <AlertTriangle size={16} className="text-red-500" />;
      case 'info':  return <Info size={16} className="text-violet-500" />;
      default:      return <Bell size={16} className="text-gray-400" />;
    }
  };

  const getIconBg = (type) => {
    switch (type) {
      case 'order': return 'bg-blue-50';
      case 'promo': return 'bg-amber-50';
      case 'alert': return 'bg-red-50';
      case 'info':  return 'bg-violet-50';
      default:      return 'bg-gray-50';
    }
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return '';
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins  = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days  = Math.floor(diff / 86400000);
    if (mins  < 1)  return 'Just now';
    if (mins  < 60) return `${mins}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        id="notification-bell-btn"
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl hover:bg-gray-100 transition-colors group"
        aria-label="Notifications"
      >
        <Bell size={20} className="text-text group-hover:text-primary transition-colors" />
        <AnimatePresence>
          {unreadCount > 0 && (
            <motion.span
              key="badge"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute top-1 right-1 min-w-[18px] h-[18px] bg-primary text-white text-[10px] font-black rounded-full flex items-center justify-center px-1 border-2 border-white"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </motion.span>
          )}
        </AnimatePresence>
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="absolute right-0 mt-3 w-[380px] bg-white rounded-3xl border border-gray-100 shadow-2xl overflow-hidden z-50"
          >
            {/* Header */}
            <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="font-black text-text text-base">Notifications</h3>
                {unreadCount > 0 && (
                  <span className="bg-primary/10 text-primary text-[10px] font-black px-2 py-0.5 rounded-full">
                    {unreadCount} new
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleRefresh}
                  disabled={loading}
                  className="p-1.5 text-gray-400 hover:text-primary rounded-lg hover:bg-gray-50 transition-all"
                  title="Refresh"
                >
                  <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
                </button>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllAsRead}
                    className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline flex items-center gap-1"
                  >
                    <CheckCheck size={12} /> All Read
                  </button>
                )}
              </div>
            </div>

            {/* List */}
            <div className="max-h-[420px] overflow-y-auto divide-y divide-gray-50">
              {loading && notifications.length === 0 ? (
                <div className="py-12 text-center">
                  <RefreshCw className="animate-spin text-gray-300 mx-auto mb-3" size={24} />
                  <p className="text-sm text-gray-400 font-medium">Loading…</p>
                </div>
              ) : notifications.length > 0 ? (
                notifications.map((notif) => (
                  <motion.div
                    key={notif.id}
                    layout
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    onClick={() => handleNotifClick(notif)}
                    className={`flex gap-3 px-5 py-4 cursor-pointer hover:bg-gray-50 transition-colors relative group ${!notif.read ? 'bg-primary/[0.03]' : ''}`}
                  >
                    {/* Unread dot */}
                    {!notif.read && (
                      <span className="absolute top-4 left-2 w-1.5 h-1.5 bg-primary rounded-full" />
                    )}

                    {/* Icon */}
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${getIconBg(notif.type)}`}>
                      {getIcon(notif.type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm leading-snug mb-0.5 ${notif.read ? 'font-medium text-gray-600' : 'font-bold text-text'}`}>
                        {notif.title}
                      </p>
                      <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{notif.message}</p>
                      <p className="text-[10px] text-gray-400 mt-1.5 font-medium">
                        {formatTime(notif.created_at)}
                      </p>
                    </div>

                    {/* Delete button */}
                    <button
                      onClick={(e) => handleDelete(e, notif.id)}
                      className="absolute top-4 right-4 p-1 text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 rounded-lg hover:bg-red-50"
                    >
                      <Trash2 size={12} />
                    </button>
                  </motion.div>
                ))
              ) : (
                <div className="py-14 text-center">
                  <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Bell className="text-gray-200" size={22} />
                  </div>
                  <p className="text-sm font-bold text-gray-400">All caught up!</p>
                  <p className="text-xs text-gray-300 mt-1">No new notifications</p>
                </div>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="px-5 py-3 bg-gray-50/60 border-t border-gray-50 text-center">
                <button
                  className="text-xs font-black text-gray-400 hover:text-primary transition-colors tracking-wide"
                  onClick={() => { setIsOpen(false); navigate('/settings?tab=notifications'); }}
                >
                  Manage Preferences →
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationCenter;

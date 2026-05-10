import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { FiBell, FiCheck, FiTrash2, FiExternalLink, FiClock, FiAlertCircle, FiInfo, FiShoppingBag, FiStar, FiMail } from 'react-icons/fi';
import { 
  fetchAdminNotificationsThunk, 
  markAdminAsReadThunk, 
  markAllAdminAsReadThunk 
} from '../../features/notifications/adminNotificationSlice';
import { formatDistanceToNow } from 'date-fns';

const AdminNotificationCenter = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const dispatch = useDispatch();
  const { notifications, unreadCount, loading } = useSelector((state) => state.adminNotifications);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen) {
      dispatch(fetchAdminNotificationsThunk());
    }
  }, [isOpen, dispatch]);

  const handleMarkAsRead = (id, e) => {
    e.stopPropagation();
    e.preventDefault();
    dispatch(markAdminAsReadThunk(id));
  };

  const handleMarkAllRead = () => {
    dispatch(markAllAdminAsReadThunk());
  };

  const getIcon = (type) => {
    switch (type) {
      case 'order': return <FiShoppingBag className="text-blue-500" />;
      case 'alert': return <FiAlertCircle className="text-red-500" />;
      case 'promo': return <FiStar className="text-yellow-500" />;
      case 'info':  return <FiInfo className="text-indigo-500" />;
      case 'contact': return <FiMail className="text-green-500" />;
      default:      return <FiBell className="text-gray-500" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Icon */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`p-2 rounded-xl transition-all duration-200 relative group ${
          isOpen ? 'bg-gray-100 text-black' : 'text-gray-400 hover:text-black hover:bg-gray-50'
        }`}
      >
        <FiBell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white animate-in zoom-in">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      <div className={`absolute right-0 mt-3 w-80 bg-white border border-gray-100 rounded-2xl shadow-2xl z-50 transition-all duration-300 origin-top-right ${
        isOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
      }`}>
        <div className="p-4 border-b border-gray-50 flex items-center justify-between">
          <h3 className="font-bold text-gray-900">Notifications</h3>
          {unreadCount > 0 && (
            <button 
              onClick={handleMarkAllRead}
              className="text-[10px] font-black uppercase tracking-widest text-primary hover:text-primary-dark transition-colors"
            >
              Mark all as read
            </button>
          )}
        </div>

        <div className="max-h-[400px] overflow-y-auto overflow-x-hidden custom-scrollbar">
          {loading && notifications.length === 0 ? (
            <div className="p-10 flex flex-col items-center justify-center space-y-3">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
              <p className="text-xs text-gray-400 font-medium tracking-wide">Syncing alerts...</p>
            </div>
          ) : notifications.length > 0 ? (
            <div className="divide-y divide-gray-50">
              {notifications.map((notif) => (
                <Link
                  key={notif.id}
                  to={notif.link || '#'}
                  onClick={() => {
                    if (!notif.is_read) dispatch(markAdminAsReadThunk(notif.id));
                    setIsOpen(false);
                  }}
                  className={`block p-4 transition-colors group relative ${notif.is_read ? 'opacity-60 grayscale-[0.5]' : 'bg-blue-50/30 hover:bg-blue-50/50'}`}
                >
                  <div className="flex gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
                      notif.is_read ? 'bg-gray-100' : 'bg-white'
                    }`}>
                      {getIcon(notif.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <p className={`text-sm leading-tight truncate pr-4 ${notif.is_read ? 'font-medium text-gray-600' : 'font-bold text-gray-900'}`}>
                          {notif.title}
                        </p>
                        {!notif.is_read && (
                          <span className="w-2 h-2 bg-blue-500 rounded-full shrink-0 mt-1"></span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 line-clamp-2 mb-2 leading-relaxed">
                        {notif.message}
                      </p>
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] text-gray-400 flex items-center gap-1 font-medium">
                          <FiClock size={10} />
                          {formatDistanceToNow(new Date(notif.created_at), { addSuffix: true })}
                        </span>
                        {notif.link && (
                          <span className="text-[10px] text-primary flex items-center gap-1 font-bold uppercase tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity">
                            View <FiExternalLink size={10} />
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiBell className="text-gray-300" size={24} />
              </div>
              <p className="text-sm font-bold text-gray-900">All caught up!</p>
              <p className="text-xs text-gray-500 mt-1">No new notifications at the moment.</p>
            </div>
          )}
        </div>

        <div className="p-3 border-t border-gray-50 bg-gray-50/50 rounded-b-2xl">
          <Link 
            to="/admin/settings" // Or a dedicated notifications page
            onClick={() => setIsOpen(false)}
            className="block text-center text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-black transition-colors py-2"
          >
            Notification Settings
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminNotificationCenter;

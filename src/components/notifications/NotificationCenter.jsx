import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { Bell, CheckCircle2, Package, Info, Tag, X, Trash2 } from 'lucide-react';
import { markAsRead, markAllAsRead, removeNotification } from '../../features/notifications/notificationSlice';

const NotificationCenter = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const dispatch = useDispatch();
  const { notifications, unreadCount } = useSelector(state => state.notifications);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getIcon = (type) => {
    switch (type) {
      case 'order': return <Package size={16} className="text-blue-500" />;
      case 'promo': return <Tag size={16} className="text-pink-500" />;
      case 'info': return <Info size={16} className="text-amber-500" />;
      default: return <Bell size={16} className="text-gray-500" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl hover:bg-gray-100 transition-colors group"
      >
        <Bell size={20} className="text-text group-hover:text-primary transition-colors" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-primary text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white">
            {unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 mt-3 w-[360px] bg-white rounded-3xl border border-gray-100 shadow-2xl overflow-hidden z-50"
          >
            <div className="p-4 border-b border-gray-50 flex items-center justify-between">
              <h3 className="font-black text-text">Notifications</h3>
              {unreadCount > 0 && (
                <button 
                  onClick={() => dispatch(markAllAsRead())}
                  className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline"
                >
                  Mark all as read
                </button>
              )}
            </div>

            <div className="max-h-[400px] overflow-y-auto">
              {notifications.length > 0 ? (
                notifications.map((notif) => (
                  <div 
                    key={notif.id}
                    className={`p-4 flex gap-4 hover:bg-gray-50 transition-colors relative group ${!notif.read ? 'bg-primary/5' : ''}`}
                    onClick={() => dispatch(markAsRead(notif.id))}
                  >
                    <div className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center shrink-0 shadow-sm">
                      {getIcon(notif.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-text mb-0.5">{notif.title}</h4>
                      <p className="text-xs text-gray-500 line-clamp-2 mb-2">{notif.message}</p>
                      <p className="text-[10px] font-medium text-gray-400">{notif.time}</p>
                    </div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        dispatch(removeNotification(notif.id));
                      }}
                      className="absolute top-4 right-4 p-1 text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))
              ) : (
                <div className="py-12 text-center">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Bell className="text-gray-200" size={24} />
                  </div>
                  <p className="text-sm font-bold text-gray-400">All caught up!</p>
                </div>
              )}
            </div>

            {notifications.length > 0 && (
              <div className="p-3 bg-gray-50/50 border-t border-gray-50 text-center">
                <button className="text-xs font-black text-gray-400 hover:text-text transition-colors">
                  View All Activity
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

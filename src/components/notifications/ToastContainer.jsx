import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { removeToast } from '../../features/notifications/notificationSlice';
import { CheckCircle2, AlertCircle, Info, X, AlertTriangle } from 'lucide-react';

const Toast = ({ toast }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(removeToast(toast.id));
    }, toast.duration);
    return () => clearTimeout(timer);
  }, [dispatch, toast.id, toast.duration]);

  const icons = {
    success: <CheckCircle2 size={18} className="text-green-500" />,
    error: <AlertCircle size={18} className="text-red-500" />,
    warning: <AlertTriangle size={18} className="text-amber-500" />,
    info: <Info size={18} className="text-blue-500" />
  };

  const bgColors = {
    success: 'bg-green-50 border-green-100',
    error: 'bg-red-50 border-red-100',
    warning: 'bg-amber-50 border-amber-100',
    info: 'bg-blue-50 border-blue-100'
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      className={`flex items-center gap-3 px-4 py-3 rounded-2xl border shadow-lg ${bgColors[toast.type]} min-w-[300px] pointer-events-auto`}
    >
      <div className="shrink-0">{icons[toast.type]}</div>
      <p className="text-sm font-bold text-gray-800 flex-1">{toast.message}</p>
      <button 
        onClick={() => dispatch(removeToast(toast.id))}
        className="p-1 hover:bg-black/5 rounded-full transition-colors"
      >
        <X size={14} className="text-gray-400" />
      </button>
    </motion.div>
  );
};

const ToastContainer = () => {
  const toasts = useSelector(state => state.notifications.toasts);

  return (
    <div className="fixed bottom-8 right-8 z-[9999] flex flex-col-reverse gap-3 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {toasts.map(toast => (
          <Toast key={toast.id} toast={toast} />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ToastContainer;

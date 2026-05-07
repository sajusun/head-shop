import React from 'react';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { Shield, FileText, Truck, RefreshCw, AlertCircle } from 'lucide-react';

const StaticPageWrapper = ({ title, settingKey, icon: Icon, defaultContent }) => {
  const { data: settings, loading } = useSelector(state => state.settings);
  const dynamicContent = settings?.[settingKey];

  return (
    <div className="min-h-screen pt-20 pb-32">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl text-primary mb-6">
            <Icon size={32} />
          </div>
          <h1 className="text-5xl font-black text-text tracking-tighter mb-4">{title}</h1>
          <p className="text-gray-500 font-medium">Last updated: {new Date().toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</p>
        </motion.div>

        {/* Content Area */}
        <div className="space-y-16">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            </div>
          ) : dynamicContent ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="prose prose-xl prose-primary max-w-none dynamic-content bg-white p-10 md:p-16 rounded-[3rem] shadow-sm border border-gray-50"
              dangerouslySetInnerHTML={{ __html: dynamicContent }}
            />
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white p-10 md:p-16 rounded-[3rem] shadow-sm border border-gray-50"
            >
              {defaultContent || (
                <div className="text-center py-10">
                  <AlertCircle size={48} className="text-gray-200 mx-auto mb-4" />
                  <p className="text-gray-500 font-bold">Content is currently being updated.</p>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StaticPageWrapper;

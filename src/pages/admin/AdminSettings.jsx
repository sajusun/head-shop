import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Save, 
  Globe, 
  Shield, 
  Truck, 
  FileText, 
  Info, 
  Search, 
  Loader2, 
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { updateSettings, resetUpdateState, fetchSettings } from '../../features/settings/settingsSlice';
import Button from '../../components/Button';

const AdminSettings = () => {
  const dispatch = useDispatch();
  
  // Defensive selector
  const settingsState = useSelector(state => state.settings || {});
  const { 
    data: settings = {}, 
    loading = false, 
    updateLoading = false, 
    updateSuccess = false, 
    error = null 
  } = settingsState;
  
  const [activeTab, setActiveTab] = useState('general');
  const [formData, setFormData] = useState({});

  // Fetch settings if not already loaded
  useEffect(() => {
    if (!settings || Object.keys(settings).length === 0) {
      dispatch(fetchSettings());
    }
  }, [dispatch, settings]);

  useEffect(() => {
    if (settings && Object.keys(settings).length > 0) {
      setFormData(settings);
    }
  }, [settings]);

  useEffect(() => {
    if (updateSuccess) {
      const timer = setTimeout(() => {
        dispatch(resetUpdateState());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [updateSuccess, dispatch]);

  const handleInputChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateSettings(formData));
  };

  const tabs = [
    { id: 'general', label: 'General', icon: <Globe size={18} /> },
    { id: 'seo', label: 'SEO', icon: <Search size={18} /> },
    { id: 'about', label: 'About Page', icon: <Info size={18} /> },
    { id: 'privacy', label: 'Privacy Policy', icon: <Shield size={18} /> },
    { id: 'shipping', label: 'Shipping & Returns', icon: <Truck size={18} /> },
    { id: 'terms', label: 'Terms of Use', icon: <FileText size={18} /> },
  ];

  if (loading && (!settings || Object.keys(settings).length === 0)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <p className="text-gray-500 font-bold animate-pulse">Loading settings...</p>
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-widest">Site Name</label>
              <input 
                value={formData?.site_name || ''} 
                onChange={(e) => handleInputChange('site_name', e.target.value)}
                className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                placeholder="e.g. Herd Shop"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-widest">Site Title (Browser Tab)</label>
              <input 
                value={formData?.site_title || ''} 
                onChange={(e) => handleInputChange('site_title', e.target.value)}
                className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                placeholder="e.g. Herd Shop | Premium Lifestyle Goods"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-widest">Support Email</label>
                <input 
                  value={formData?.site_email || ''} 
                  onChange={(e) => handleInputChange('site_email', e.target.value)}
                  className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                  placeholder="support@herdshop.com"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-widest">Support Phone</label>
                <input 
                  value={formData?.site_phone || ''} 
                  onChange={(e) => handleInputChange('site_phone', e.target.value)}
                  className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                  placeholder="+880..."
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-widest">Store Address</label>
              <textarea 
                value={formData?.site_address || ''} 
                onChange={(e) => handleInputChange('site_address', e.target.value)}
                rows="3"
                className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 transition-all font-medium resize-none"
                placeholder="Physical store address..."
              />
            </div>
          </div>
        );
      case 'seo':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-widest">Meta Description</label>
              <textarea 
                value={formData?.seo_description || ''} 
                onChange={(e) => handleInputChange('seo_description', e.target.value)}
                rows="4"
                className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 transition-all font-medium resize-none"
                placeholder="Brief summary of your site..."
              />
              <p className="mt-2 text-xs text-gray-400">Brief summary of your site for search engine results.</p>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-widest">Keywords</label>
              <input 
                value={formData?.seo_keywords || ''} 
                onChange={(e) => handleInputChange('seo_keywords', e.target.value)}
                placeholder="keyword1, keyword2, keyword3"
                className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 transition-all font-medium"
              />
              <p className="mt-2 text-xs text-gray-400">Comma-separated keywords for SEO.</p>
            </div>
          </div>
        );
      case 'about':
        return (
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-widest">About Page Content (HTML)</label>
            <textarea 
              value={formData?.about_page_content || ''} 
              onChange={(e) => handleInputChange('about_page_content', e.target.value)}
              rows="15"
              className="w-full p-6 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 transition-all font-mono text-sm resize-none"
            />
          </div>
        );
      case 'privacy':
        return (
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-widest">Privacy Policy Content (HTML)</label>
            <textarea 
              value={formData?.privacy_policy_content || ''} 
              onChange={(e) => handleInputChange('privacy_policy_content', e.target.value)}
              rows="15"
              className="w-full p-6 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 transition-all font-mono text-sm resize-none"
            />
          </div>
        );
      case 'shipping':
        return (
          <div className="space-y-10">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-widest">Shipping Policy (HTML)</label>
              <textarea 
                value={formData?.shipping_policy_content || ''} 
                onChange={(e) => handleInputChange('shipping_policy_content', e.target.value)}
                rows="8"
                className="w-full p-6 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 transition-all font-mono text-sm resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-widest">Returns & Exchanges (HTML)</label>
              <textarea 
                value={formData?.returns_policy_content || ''} 
                onChange={(e) => handleInputChange('returns_policy_content', e.target.value)}
                rows="8"
                className="w-full p-6 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 transition-all font-mono text-sm resize-none"
              />
            </div>
          </div>
        );
      case 'terms':
        return (
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-widest">Terms of Use Content (HTML)</label>
            <textarea 
              value={formData?.terms_of_use_content || ''} 
              onChange={(e) => handleInputChange('terms_of_use_content', e.target.value)}
              rows="15"
              className="w-full p-6 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 transition-all font-mono text-sm resize-none"
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-black text-text mb-2">Site Settings</h1>
          <p className="text-gray-500">Manage your dynamic pages and store configurations.</p>
        </div>
        <div className="flex items-center gap-4">
          <AnimatePresence>
            {updateSuccess && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2 text-green-500 font-bold bg-green-50 px-4 py-2 rounded-xl"
              >
                <CheckCircle size={18} /> Changes Saved
              </motion.div>
            )}
          </AnimatePresence>
          <Button 
            onClick={handleSubmit} 
            loading={updateLoading}
            className="flex items-center gap-2 rounded-2xl h-12 px-8 shadow-lg shadow-primary/20"
          >
            {!updateLoading && <Save size={18} className="mr-2" />}
            Save Changes
          </Button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Tabs */}
        <div className="lg:w-64 shrink-0 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all ${
                activeTab === tab.id 
                ? 'bg-text text-white shadow-xl shadow-text/20 scale-[1.02]' 
                : 'text-gray-400 hover:bg-gray-100 hover:text-text'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-white p-8 md:p-12 rounded-[2.5rem] border border-gray-100 shadow-sm min-h-[600px]">
          <form onSubmit={handleSubmit}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {renderTabContent()}
              </motion.div>
            </AnimatePresence>
          </form>
        </div>
      </div>

      {error && (
        <div className="mt-8 p-4 bg-red-50 text-red-600 rounded-2xl border border-red-100 font-medium flex items-center gap-3">
          <AlertCircle size={20} />
          {typeof error === 'string' ? error : 'An error occurred while saving settings.'}
        </div>
      )}
    </div>
  );
};

export default AdminSettings;

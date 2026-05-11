import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
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
  AlertCircle,
  Share2,
  Mail,
  Phone,
  MapPin,
  ChevronRight,
  LogOut
} from 'lucide-react';
import { updateSettings, resetUpdateState, fetchSettings } from '../../features/settings/settingsSlice';
import Button from '../../components/Button';

const AdminSettings = () => {
  const dispatch = useDispatch();
  
  const settingsState = useSelector(state => state.settings || {});
  const { 
    data: settings, 
    loading = false, 
    fetched = false,
    updateLoading = false, 
    updateSuccess = false, 
    error = null 
  } = settingsState;
  
  const [activeTab, setActiveTab] = useState('general');
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();
  const { user: adminUser } = useSelector(state => state.adminAuth);

  useEffect(() => {
    if (!loading && !fetched) {
      dispatch(fetchSettings());
    }
  }, [dispatch, fetched, loading]);

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
    { id: 'general', label: 'General Info', icon: <Globe size={20} />, description: 'Basic site configuration' },
    { id: 'seo', label: 'SEO & Scripts', icon: <Search size={20} />, description: 'Search engine optimization' },
    { id: 'social', label: 'Social Media', icon: <Share2 size={20} />, description: 'Connect your platforms' },
    { id: 'about', label: 'About Page', icon: <Info size={20} />, description: 'Manage your story' },
    { id: 'privacy', label: 'Privacy Policy', icon: <Shield size={20} />, description: 'Compliance & privacy' },
    { id: 'shipping', label: 'Shipping & Returns', icon: <Truck size={20} />, description: 'Logistics & policies' },
    { id: 'terms', label: 'Terms of Use', icon: <FileText size={20} />, description: 'User agreement' },
    { id: 'other_pages', label: 'Legal Pages', icon: <AlertCircle size={20} />, description: 'Additional disclosures' },
  ];

  if (loading && !fetched) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] gap-4 bg-white">
        <Loader2 className="w-12 h-12 text-black animate-spin" />
        <p className="text-gray-500 font-bold animate-pulse uppercase tracking-widest text-xs">Synchronizing Core Settings...</p>
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return (
          <div className="max-w-4xl space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Site Name</label>
                <input 
                  value={formData?.site_name || ''} 
                  onChange={(e) => handleInputChange('site_name', e.target.value)}
                  className="w-full p-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-black focus:ring-0 transition-all font-bold text-gray-900"
                  placeholder="e.g. Herd Shop"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Site Title (Tab)</label>
                <input 
                  value={formData?.site_title || ''} 
                  onChange={(e) => handleInputChange('site_title', e.target.value)}
                  className="w-full p-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-black focus:ring-0 transition-all font-bold text-gray-900"
                  placeholder="e.g. Herd Shop | Premium Goods"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Support Email</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black transition-colors" size={18} />
                  <input 
                    value={formData?.site_email || ''} 
                    onChange={(e) => handleInputChange('site_email', e.target.value)}
                    className="w-full p-4 pl-12 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-black focus:ring-0 transition-all font-bold text-gray-900"
                    placeholder="support@herdshop.com"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Support Phone</label>
                <div className="relative group">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black transition-colors" size={18} />
                  <input 
                    value={formData?.site_phone || ''} 
                    onChange={(e) => handleInputChange('site_phone', e.target.value)}
                    className="w-full p-4 pl-12 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-black focus:ring-0 transition-all font-bold text-gray-900"
                    placeholder="+1 (555)..."
                  />
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Store Address</label>
              <div className="relative group">
                <MapPin className="absolute left-4 top-6 text-gray-400 group-focus-within:text-black transition-colors" size={18} />
                <textarea 
                  value={formData?.site_address || ''} 
                  onChange={(e) => handleInputChange('site_address', e.target.value)}
                  rows="3"
                  className="w-full p-4 pl-12 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-black focus:ring-0 transition-all font-bold text-gray-900 resize-none"
                  placeholder="Physical store location..."
                />
              </div>
            </div>
          </div>
        );
      case 'seo':
        return (
          <div className="max-w-4xl space-y-8">
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Global Meta Description</label>
              <textarea 
                value={formData?.seo_description || ''} 
                onChange={(e) => handleInputChange('seo_description', e.target.value)}
                rows="3"
                className="w-full p-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-black focus:ring-0 transition-all font-bold text-gray-900 resize-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest">SEO Keywords</label>
              <input 
                value={formData?.seo_keywords || ''} 
                onChange={(e) => handleInputChange('seo_keywords', e.target.value)}
                className="w-full p-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-black focus:ring-0 transition-all font-bold text-gray-900"
                placeholder="keyword1, keyword2..."
              />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Header Scripts (HTML)</label>
                <textarea 
                  value={formData?.seo_header_scripts || ''} 
                  onChange={(e) => handleInputChange('seo_header_scripts', e.target.value)}
                  rows="10"
                  className="w-full p-4 bg-gray-900 text-green-400 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 transition-all font-mono text-xs resize-none shadow-inner"
                  placeholder="<!-- Custom Head Content -->"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Footer Scripts (HTML)</label>
                <textarea 
                  value={formData?.seo_footer_scripts || ''} 
                  onChange={(e) => handleInputChange('seo_footer_scripts', e.target.value)}
                  rows="10"
                  className="w-full p-4 bg-gray-900 text-green-400 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 transition-all font-mono text-xs resize-none shadow-inner"
                  placeholder="<!-- Custom Body Content -->"
                />
              </div>
            </div>
          </div>
        );
      case 'social':
        return (
          <div className="max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8">
            {['facebook', 'instagram', 'twitter', 'linkedin'].map(platform => (
              <div key={platform} className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">{platform} Link</label>
                <input 
                  value={formData?.[`social_${platform}`] || ''} 
                  onChange={(e) => handleInputChange(`social_${platform}`, e.target.value)}
                  className="w-full p-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-black focus:ring-0 transition-all font-bold text-gray-900"
                  placeholder={`https://${platform}.com/yourname`}
                />
              </div>
            ))}
          </div>
        );
      case 'about':
        return (
          <div className="max-w-5xl space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest">About Page Content (Rich HTML)</label>
              <div className="text-[10px] bg-black text-white px-2 py-1 rounded uppercase font-bold">Raw Editor</div>
            </div>
            <textarea 
              value={formData?.about_page_content || ''} 
              onChange={(e) => handleInputChange('about_page_content', e.target.value)}
              rows="25"
              className="w-full p-8 bg-gray-50 border border-transparent rounded-[2rem] focus:bg-white focus:border-black focus:ring-0 transition-all font-mono text-sm leading-relaxed shadow-sm"
            />
          </div>
        );
      case 'privacy':
        return (
          <div className="max-w-5xl space-y-4">
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest block">Privacy Policy Content (Rich HTML)</label>
            <textarea 
              value={formData?.privacy_policy_content || ''} 
              onChange={(e) => handleInputChange('privacy_policy_content', e.target.value)}
              rows="25"
              className="w-full p-8 bg-gray-50 border border-transparent rounded-[2rem] focus:bg-white focus:border-black focus:ring-0 transition-all font-mono text-sm leading-relaxed shadow-sm"
            />
          </div>
        );
      case 'shipping':
        return (
          <div className="max-w-5xl space-y-12">
            <div className="space-y-4">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest block">Shipping Policy (HTML)</label>
              <textarea 
                value={formData?.shipping_policy_content || ''} 
                onChange={(e) => handleInputChange('shipping_policy_content', e.target.value)}
                rows="12"
                className="w-full p-8 bg-gray-50 border border-transparent rounded-[2rem] focus:bg-white focus:border-black focus:ring-0 transition-all font-mono text-sm leading-relaxed shadow-sm"
              />
            </div>
            <div className="space-y-4">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest block">Returns & Exchanges (HTML)</label>
              <textarea 
                value={formData?.returns_policy_content || ''} 
                onChange={(e) => handleInputChange('returns_policy_content', e.target.value)}
                rows="12"
                className="w-full p-8 bg-gray-50 border border-transparent rounded-[2rem] focus:bg-white focus:border-black focus:ring-0 transition-all font-mono text-sm leading-relaxed shadow-sm"
              />
            </div>
          </div>
        );
      case 'terms':
        return (
          <div className="max-w-5xl space-y-4">
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest block">Terms of Use Content (Rich HTML)</label>
            <textarea 
              value={formData?.terms_of_use_content || ''} 
              onChange={(e) => handleInputChange('terms_of_use_content', e.target.value)}
              rows="25"
              className="w-full p-8 bg-gray-50 border border-transparent rounded-[2rem] focus:bg-white focus:border-black focus:ring-0 transition-all font-mono text-sm leading-relaxed shadow-sm"
            />
          </div>
        );
      case 'other_pages':
        return (
          <div className="max-w-5xl space-y-12">
            <div className="space-y-4">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest block">Accessibility Content (HTML)</label>
              <textarea 
                value={formData?.accessibility_content || ''} 
                onChange={(e) => handleInputChange('accessibility_content', e.target.value)}
                rows="12"
                className="w-full p-8 bg-gray-50 border border-transparent rounded-[2rem] focus:bg-white focus:border-black focus:ring-0 transition-all font-mono text-sm leading-relaxed shadow-sm"
              />
            </div>
            <div className="space-y-4">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest block">Cookie Settings Content (HTML)</label>
              <textarea 
                value={formData?.cookie_settings_content || ''} 
                onChange={(e) => handleInputChange('cookie_settings_content', e.target.value)}
                rows="12"
                className="w-full p-8 bg-gray-50 border border-transparent rounded-[2rem] focus:bg-white focus:border-black focus:ring-0 transition-all font-mono text-sm leading-relaxed shadow-sm"
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };



  if (loading && !fetched) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 bg-white">
        <Loader2 className="w-12 h-12 text-black animate-spin" />
        <p className="text-gray-500 font-bold animate-pulse uppercase tracking-widest text-xs">Synchronizing Core Settings...</p>
      </div>
    );
  }



  return (
    <div className="flex h-screen bg-white overflow-hidden">
      {/* Settings Sidebar */}
      <aside className="w-64 bg-gray-50 border-r border-gray-100 flex flex-col shrink-0">
        <div className="p-8 border-b border-gray-100 bg-white">
          <div className="flex items-center justify-between mb-6">
            <button 
              onClick={() => navigate('/admin')}
              className="flex items-center gap-2 text-gray-400 hover:text-black transition-colors text-[10px] font-black uppercase tracking-widest"
            >
              <ChevronRight size={14} className="rotate-180" />
              Dashboard
            </button>
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          </div>
          <h1 className="text-2xl font-black text-black tracking-tighter uppercase mb-1">Settings</h1>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Global Config</p>
        </div>
        
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full group flex items-start gap-4 px-4 py-4 rounded-2xl transition-all text-left ${
                activeTab === tab.id 
                ? 'bg-black text-white shadow-xl shadow-black/10 scale-[1.02]' 
                : 'text-gray-500 hover:bg-white hover:text-black hover:shadow-sm'
              }`}
            >
              <div className={`mt-0.5 transition-colors ${activeTab === tab.id ? 'text-white' : 'text-gray-400 group-hover:text-black'}`}>
                {tab.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm leading-none mb-1">{tab.label}</p>
                <p className={`text-[10px] truncate ${activeTab === tab.id ? 'text-gray-400' : 'text-gray-400'}`}>
                  {tab.description}
                </p>
              </div>
              <ChevronRight size={14} className={`mt-1 opacity-0 group-hover:opacity-100 transition-all ${activeTab === tab.id ? 'translate-x-1 opacity-40' : ''}`} />
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100 bg-white space-y-4">
          {/* User Info & Logout in Settings Sidebar */}
          <div className="flex items-center space-x-3 px-4 py-3 rounded-2xl bg-gray-50 group">
            <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-bold text-xs">
              {adminUser?.name?.charAt(0)}
            </div>
            <div className="overflow-hidden flex-1">
              <p className="text-[10px] font-bold text-gray-900 truncate">{adminUser?.name}</p>
              <p className="text-[9px] text-gray-500 truncate">{adminUser?.email}</p>
            </div>
            <button 
              onClick={() => navigate('/admin/login')}
              className="p-2 text-gray-400 hover:text-red-500 transition-colors"
              title="Sign Out"
            >
              <LogOut size={14} />
            </button>
          </div>

          <Button 
            onClick={handleSubmit} 
            loading={updateLoading}
            className="w-full h-12 rounded-xl bg-black text-white font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 shadow-2xl shadow-black/20 hover:scale-[1.02] active:scale-95 transition-all"
          >
            {updateLoading ? (
              <Loader2 className="animate-spin" size={14} />
            ) : updateSuccess ? (
              <CheckCircle size={14} />
            ) : (
              <Save size={14} />
            )}
            {updateLoading ? 'Saving...' : updateSuccess ? 'Synced' : 'Push Changes'}
          </Button>
        </div>
      </aside>

      {/* Settings Content Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-white">
        <header className="h-20 border-b border-gray-50 flex items-center justify-between px-10 shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-black font-bold">
              {tabs.find(t => t.id === activeTab)?.icon}
            </div>
            <div>
              <h2 className="text-xl font-black text-black tracking-tight">{tabs.find(t => t.id === activeTab)?.label}</h2>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">{tabs.find(t => t.id === activeTab)?.description}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <AnimatePresence>
              {updateSuccess && (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2 text-green-500 font-bold bg-green-50 px-4 py-2 rounded-xl text-xs uppercase tracking-widest"
                >
                  <CheckCircle size={14} /> Synced
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-12">
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

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-12 p-6 bg-red-50 text-red-600 rounded-[2rem] border border-red-100 font-bold flex items-center gap-4 text-sm"
            >
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                <AlertCircle size={20} />
              </div>
              {typeof error === 'string' ? error : 'Configuration synchronization failed.'}
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminSettings;

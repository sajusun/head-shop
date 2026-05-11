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
import { adminGetProfile, adminDisable2FA } from '../../features/auth/adminAuthSlice';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Modal from '../../components/Modal';
import authService from '../../services/authService';
import { Lock, Check } from 'lucide-react';

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

  // Security & 2FA State
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [qrCode, setQrCode] = useState(null);
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [recoveryCodes, setRecoveryCodes] = useState([]);
  const [tfaStep, setTfaStep] = useState(adminUser?.two_factor_confirmed_at ? 'confirmed' : 'off');
  const [tfaLoading, setTfaLoading] = useState(false);
  const [securityError, setSecurityError] = useState(null);
  const [securitySuccess, setSecuritySuccess] = useState(false);
  const [isDisableModalOpen, setIsDisableModalOpen] = useState(false);
  const [disablePassword, setDisablePassword] = useState('');
  
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    password: '',
    password_confirmation: ''
  });

  useEffect(() => {
    setTfaStep(adminUser?.two_factor_confirmed_at ? 'confirmed' : 'off');
  }, [adminUser]);

  const handleEnable2FA = async () => {
    setTfaLoading(true);
    try {
      const response = await authService.adminGet2FAQRCode();
      setQrCode(response.data.data.qr_code);
      setTfaStep('setup');
    } catch (err) {
      setSecurityError('Failed to generate Admin 2FA QR code.');
    } finally {
      setTfaLoading(false);
    }
  };

  const handleConfirm2FA = async (e) => {
    e.preventDefault();
    setTfaLoading(true);
    try {
      const response = await authService.adminConfirm2FA(twoFactorCode);
      setRecoveryCodes(response.data.data.recovery_codes);
      setTfaStep('confirmed');
      dispatch(adminGetProfile());
    } catch (err) {
      setSecurityError('Invalid 2FA code. Please try again.');
    } finally {
      setTfaLoading(false);
    }
  };

  const handleDisable2FA = async (e) => {
    e.preventDefault();
    setTfaLoading(true);
    try {
      await dispatch(adminDisable2FA(disablePassword)).unwrap();
      setIsDisableModalOpen(false);
      setDisablePassword('');
      setSecuritySuccess(true);
      setTimeout(() => setSecuritySuccess(false), 5000);
    } catch (err) {
      setSecurityError(err || 'Failed to disable 2FA.');
    } finally {
      setTfaLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setTfaLoading(true);
    setSecurityError(null);
    try {
      await authService.changePassword(passwordData);
      setSecuritySuccess(true);
      setPasswordData({ current_password: '', password: '', password_confirmation: '' });
      setTimeout(() => setSecuritySuccess(false), 5000);
    } catch (err) {
      setSecurityError(err.response?.data?.message || 'Password update failed.');
    } finally {
      setTfaLoading(false);
    }
  };

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

  const tabGroups = [
    {
      title: 'Configuration',
      items: [
        { id: 'general', label: 'General Info', icon: <Globe size={20} />, description: 'Basic site configuration' },
        { id: 'seo', label: 'SEO & Scripts', icon: <Search size={20} />, description: 'Search engine optimization' },
        { id: 'social', label: 'Social Media', icon: <Share2 size={20} />, description: 'Connect your platforms' },
      ]
    },
    {
      title: 'Content & Legal',
      items: [
        { id: 'about', label: 'About Page', icon: <Info size={20} />, description: 'Manage your story' },
        { id: 'privacy', label: 'Privacy Policy', icon: <Shield size={20} />, description: 'Compliance & privacy' },
        { id: 'shipping', label: 'Shipping & Returns', icon: <Truck size={20} />, description: 'Logistics & policies' },
        { id: 'terms', label: 'Terms of Use', icon: <FileText size={20} />, description: 'User agreement' },
        { id: 'other_pages', label: 'Legal Pages', icon: <AlertCircle size={20} />, description: 'Additional disclosures' },
      ]
    },
    {
      title: 'Personal',
      items: [
        { id: 'security', label: 'Admin Security', icon: <Shield size={20} />, description: '2FA & Account access' },
      ]
    }
  ];

  // Flat list for easier lookup in header
  const allTabs = tabGroups.flatMap(group => group.items);

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
      case 'security':
        return (
          <div className="max-w-4xl space-y-12 pb-20">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* 2FA Section */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-black text-black uppercase tracking-tight mb-1">Two-Factor Authentication</h3>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Enhanced Admin Protection</p>
                  </div>
                  
                  <div className={`p-8 rounded-[2.5rem] border-2 transition-all ${tfaStep === 'confirmed' ? 'bg-green-50 border-green-100' : 'bg-gray-50 border-transparent'}`}>
                    <div className="flex items-center gap-4 mb-6">
                       <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm ${tfaStep === 'confirmed' ? 'bg-white text-green-500' : 'bg-white text-gray-400'}`}>
                          <Shield size={24} />
                       </div>
                       <div>
                          <p className="font-black text-sm uppercase tracking-tight">Status</p>
                          <p className={`text-[10px] font-black uppercase tracking-widest ${tfaStep === 'confirmed' ? 'text-green-600' : 'text-gray-400'}`}>
                            {tfaStep === 'confirmed' ? 'Active & Secure' : 'Disabled'}
                          </p>
                       </div>
                    </div>

                    {tfaStep === 'off' && (
                      <Button onClick={handleEnable2FA} loading={tfaLoading} className="w-full rounded-xl bg-black text-white h-12 text-xs font-black uppercase tracking-widest shadow-lg">
                        Enable 2FA
                      </Button>
                    )}
                    
                    {tfaStep === 'confirmed' && (
                      <button onClick={() => setIsDisableModalOpen(true)} className="text-[10px] font-black text-red-500 uppercase tracking-widest hover:underline">
                        Disable Protection
                      </button>
                    )}

                    {tfaStep === 'setup' && (
                      <div className="mt-8 pt-8 border-t border-gray-200/50 space-y-6">
                        <div className="bg-white p-4 rounded-2xl shadow-sm inline-block mx-auto">
                          <img src={qrCode} alt="QR Code" className="w-40 h-40" />
                        </div>
                        <p className="text-[10px] text-gray-500 font-bold leading-relaxed">Scan with Google Authenticator or Authy, then enter the code.</p>
                        <form onSubmit={handleConfirm2FA} className="flex gap-2">
                           <input 
                              placeholder="000000"
                              value={twoFactorCode}
                              onChange={(e) => setTwoFactorCode(e.target.value)}
                              className="w-24 p-3 bg-white border border-gray-200 rounded-xl focus:border-black focus:ring-0 transition-all font-mono text-center text-sm"
                              required
                           />
                           <Button type="submit" loading={tfaLoading} className="flex-1 rounded-xl bg-black text-white text-[10px] font-black uppercase tracking-widest">Verify</Button>
                        </form>
                      </div>
                    )}
                  </div>
                </div>

                {/* Password Section */}
                <div className="space-y-6">
                   <div>
                      <h3 className="text-xl font-black text-black uppercase tracking-tight mb-1">Update Password</h3>
                      <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Keep your access secure</p>
                   </div>
                   
                   <form onSubmit={handlePasswordChange} className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Current Password</label>
                        <input 
                          type="password"
                          value={passwordData.current_password}
                          onChange={(e) => setPasswordData({...passwordData, current_password: e.target.value})}
                          className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:bg-white focus:ring-2 focus:ring-black/5 transition-all font-bold text-sm"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">New Password</label>
                        <input 
                          type="password"
                          value={passwordData.password}
                          onChange={(e) => setPasswordData({...passwordData, password: e.target.value})}
                          className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:bg-white focus:ring-2 focus:ring-black/5 transition-all font-bold text-sm"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Confirm New Password</label>
                        <input 
                          type="password"
                          value={passwordData.password_confirmation}
                          onChange={(e) => setPasswordData({...passwordData, password_confirmation: e.target.value})}
                          className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:bg-white focus:ring-2 focus:ring-black/5 transition-all font-bold text-sm"
                          required
                        />
                      </div>
                      <Button type="submit" loading={tfaLoading} className="w-full h-12 rounded-xl bg-black text-white text-[10px] font-black uppercase tracking-widest shadow-lg">
                        Update Password
                      </Button>
                   </form>
                </div>
             </div>

             {/* Recovery Codes */}
             {recoveryCodes.length > 0 && (
                <div className="mt-12 p-8 bg-gray-900 text-white rounded-[2.5rem] shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-10">
                    <Shield size={120} />
                  </div>
                  <h4 className="text-lg font-black uppercase tracking-tight mb-2">Emergency Recovery Codes</h4>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-6">Store these codes securely. Each code can be used once.</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
                    {recoveryCodes.map((code, idx) => (
                      <code key={idx} className="bg-white/10 p-3 rounded-xl text-[10px] font-mono tracking-wider text-center">{code}</code>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10 rounded-xl" onClick={() => setRecoveryCodes([])}>
                    I've Saved These Codes
                  </Button>
                </div>
             )}

             {/* Modals & Feedback */}
             {securitySuccess && (
               <div className="fixed bottom-10 right-10 z-50 bg-green-500 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-bounce">
                  <CheckCircle size={20} />
                  <span className="text-xs font-black uppercase tracking-widest">Security Updated Successfully</span>
               </div>
             )}

             {securityError && (
               <div className="p-4 bg-red-50 text-red-600 rounded-2xl border border-red-100 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                  <AlertCircle size={16} /> {securityError}
               </div>
             )}

             <Modal isOpen={isDisableModalOpen} onClose={() => setIsDisableModalOpen(false)} title="Disable Admin Protection">
                <form onSubmit={handleDisable2FA} className="space-y-6">
                  <p className="text-xs text-gray-500 font-bold leading-relaxed">Enter your administrator password to confirm disabling 2FA protection.</p>
                  <Input 
                    label="Admin Password"
                    type="password"
                    value={disablePassword}
                    onChange={(e) => setDisablePassword(e.target.value)}
                    required
                  />
                  <div className="flex gap-4">
                    <Button variant="ghost" onClick={() => setIsDisableModalOpen(false)} className="flex-1 rounded-xl">Cancel</Button>
                    <Button type="submit" loading={tfaLoading} className="flex-1 rounded-xl bg-red-500 text-white">Confirm</Button>
                  </div>
                </form>
             </Modal>
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
        
        <nav className="flex-1 overflow-y-auto p-4 space-y-8">
          {tabGroups.map((group, groupIdx) => (
            <div key={groupIdx} className="space-y-2">
              <h3 className="px-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">
                {group.title}
              </h3>
              <div className="space-y-1">
                {group.items.map((tab) => (
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
              </div>
            </div>
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
              onClick={() => {
                dispatch(adminLogout());
                navigate('/admin/login');
              }}
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
              {allTabs.find(t => t.id === activeTab)?.icon}
            </div>
            <div>
              <h2 className="text-xl font-black text-black tracking-tight">{allTabs.find(t => t.id === activeTab)?.label}</h2>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">{allTabs.find(t => t.id === activeTab)?.description}</p>
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

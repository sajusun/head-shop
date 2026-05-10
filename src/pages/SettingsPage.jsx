import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { User, Lock, Bell, Shield, ArrowLeft, Camera, Check } from 'lucide-react';
import Button from '../components/Button';
import Input from '../components/Input';
import Modal from '../components/Modal';
import { motion, AnimatePresence } from 'framer-motion';
import { updateProfile } from '../features/auth/authSlice';
import authService from '../services/authService';
import notificationService from '../services/notificationService';

const SettingsPage = () => {
  const { user, loading: profileLoading, error: profileError } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fileInputRef = React.useRef(null);

  const [activeTab, setActiveTab] = useState('profile');
  const [saved, setSaved] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || null);
  const [avatarFile, setAvatarFile] = useState(null);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    bio: user?.bio || '',
  });

  // Security Form State
  const [securityData, setSecurityData] = useState({
    current_password: '',
    password: '',
    password_confirmation: '',
  });
  const [securityLoading, setSecurityLoading] = useState(false);
  const [securityError, setSecurityError] = useState(null);
  const [securitySuccess, setSecuritySuccess] = useState(false);

  // 2FA State
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [qrCode, setQrCode] = useState(null);
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [recoveryCodes, setRecoveryCodes] = useState([]);
  const [tfaStep, setTfaStep] = useState('off'); // off, setup, confirmed
  const [tfaLoading, setTfaLoading] = useState(false);
  const [isDisableModalOpen, setIsDisableModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [disablePassword, setDisablePassword] = useState('');

  // Notification preferences state
  const [notifPrefs, setNotifPrefs] = useState({
    order_updates: true,
    promotions: true,
    newsletter: true,
  });
  const [notifLoading, setNotifLoading] = useState(false);
  const [notifSaved, setNotifSaved]     = useState(false);
  const [notifError, setNotifError]     = useState(null);
  const [notifFetched, setNotifFetched] = useState(false);

  React.useEffect(() => {
    if (user?.two_factor_confirmed_at) {
      setTfaStep('confirmed');
    } else {
      setTfaStep('off');
    }
  }, [user]);

  // Load notification preferences when Notifications tab becomes active
  React.useEffect(() => {
    if (activeTab === 'notifications' && !notifFetched) {
      setNotifLoading(true);
      setNotifError(null);
      notificationService.getPreferences().then(res => {
        const prefs = res?.data?.data;
        if (prefs) {
          setNotifPrefs(prefs);
        }
        setNotifFetched(true);
      }).catch((err) => {
        setNotifError(err?.response?.data?.message || 'Failed to load notification preferences.');
        setNotifFetched(true);
      }).finally(() => setNotifLoading(false));
    }
  }, [activeTab, notifFetched]);

  const handleToggleNotifPref = async (key) => {
    if (notifLoading) return;

    const prevPrefs = notifPrefs;
    const nextPrefs = { ...notifPrefs, [key]: !notifPrefs?.[key] };

    setNotifPrefs(nextPrefs);
    setNotifSaved(false);
    setNotifError(null);
    setNotifLoading(true);

    try {
      await notificationService.updatePreferences(nextPrefs);
      setNotifSaved(true);
      setTimeout(() => setNotifSaved(false), 2000);
    } catch (err) {
      setNotifPrefs(prevPrefs);
      setNotifError(err?.response?.data?.message || 'Failed to save notification preferences.');
    } finally {
      setNotifLoading(false);
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();

    // Use FormData for file uploads
    const data = new FormData();
    data.append('name', formData.name);
    data.append('phone', formData.phone);
    data.append('bio', formData.bio);
    if (avatarFile) {
      data.append('avatar', avatarFile);
    }
    console.log(data);

    const resultAction = await dispatch(updateProfile(data));
    if (updateProfile.fulfilled.match(resultAction)) {
      setSaved(true);
      setAvatarFile(null);
      setTimeout(() => setSaved(false), 3000);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setSecurityLoading(true);
    setSecurityError(null);
    setSecuritySuccess(false);

    try {
      await authService.changePassword(securityData);
      setSecuritySuccess(true);
      setSecurityData({ current_password: '', password: '', password_confirmation: '' });
      setIsPasswordModalOpen(false);
      setTimeout(() => setSecuritySuccess(false), 5000);
    } catch (err) {
      setSecurityError(err.response?.data?.message || 'Failed to change password. Please check your current password.');
    } finally {
      setSecurityLoading(false);
    }
  };

  const handleEnable2FA = async () => {
    setTfaLoading(true);
    try {
      const response = await authService.get2FAQRCode();
      setQrCode(response.data.data.qr_code);
      setTfaStep('setup');
    } catch (err) {
      setSecurityError('Failed to generate 2FA QR code.');
    } finally {
      setTfaLoading(false);
    }
  };

  const handleConfirm2FA = async (e) => {
    e.preventDefault();
    setTfaLoading(true);
    try {
      const response = await authService.confirm2FA(twoFactorCode);
      setRecoveryCodes(response.data.data.recovery_codes);
      setTfaStep('confirmed');
      // Update local user state if needed, or just let the next profile fetch handle it
    } catch (err) {
      setSecurityError('Invalid 2FA code. Please try again.');
    } finally {
      setTfaLoading(false);
    }
  };

  const handleDisable2FA = async (e) => {
    e.preventDefault();
    if (!disablePassword) return;

    setTfaLoading(true);
    try {
      await authService.disable2FA(disablePassword);
      setTfaStep('off');
      setQrCode(null);
      setRecoveryCodes([]);
      setIsDisableModalOpen(false);
      setDisablePassword('');
      setSecuritySuccess(true);
      setTimeout(() => setSecuritySuccess(false), 5000);
    } catch (err) {
      alert('Failed to disable 2FA. Incorrect password.');
    } finally {
      setTfaLoading(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Edit Profile', icon: <User size={18} /> },
    { id: 'security', label: 'Security', icon: <Lock size={18} /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={18} /> },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-500 hover:text-primary transition-colors mb-8 group"
      >
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> Back
      </button>

      <h1 className="text-2xl md:text-3xl font-black text-text mb-8">Settings</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        {/* Sidebar Tabs */}
        <div className="lg:col-span-1">
          <nav className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden p-2 space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 p-4 rounded-2xl font-bold text-sm transition-all ${activeTab === tab.id
                    ? 'bg-primary text-white shadow-lg shadow-primary/20'
                    : 'text-gray-600 hover:bg-gray-50'
                  }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-[40px] border border-gray-100 shadow-sm p-8 sm:p-12"
          >
            {activeTab === 'profile' && (
              <form onSubmit={handleSave} className="space-y-10">
                {/* Avatar Upload */}
                <div className="flex flex-col sm:flex-row items-center gap-8 pb-10 border-b border-gray-50">
                  <div className="relative group">
                    <div className="w-32 h-32 rounded-full bg-primary/10 overflow-hidden border-4 border-white shadow-xl">
                      <img
                        src={avatarPreview || "https://i.pravatar.cc/300"}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleAvatarChange}
                      className="hidden"
                      accept="image/*"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current.click()}
                      className="absolute bottom-0 right-0 p-2.5 bg-primary text-white rounded-full shadow-lg hover:scale-110 transition-transform"
                    >
                      <Camera size={18} />
                    </button>
                  </div>
                  <div className="text-center sm:text-left">
                    <h3 className="text-xl font-bold text-text mb-1">Profile Photo</h3>
                    <p className="text-sm text-gray-500 mb-4">Update your avatar to personalize your profile.</p>
                    <div className="flex gap-3">
                      <Button
                        size="sm"
                        variant="outline"
                        className="rounded-xl"
                        type="button"
                        onClick={() => fileInputRef.current.click()}
                      >
                        Upload New
                      </Button>
                      <Button size="sm" variant="ghost" className="text-red-500 hover:bg-red-50 rounded-xl" type="button">Remove</Button>
                    </div>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <Input
                    label="Display Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                  <Input
                    label="Email Address (Read Only)"
                    type="email"
                    value={formData.email}
                    readOnly
                    className="bg-gray-50 cursor-not-allowed"
                  />
                  <Input
                    label="Phone Number"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-text mb-2">Short Bio</label>
                    <textarea
                      rows="4"
                      className="w-full rounded-xl border border-gray-200 p-4 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      placeholder="Tell us about yourself..."
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-6">
                  <div className="flex items-center gap-2">
                    {saved && (
                      <motion.span
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex items-center gap-1.5 text-green-500 text-sm font-bold"
                      >
                        <Check size={16} /> Profile Updated Successfully
                      </motion.span>
                    )}
                    {profileError && (
                      <span className="text-red-500 text-sm font-bold">{profileError}</span>
                    )}
                  </div>
                  <Button type="submit" loading={profileLoading} className="px-12 rounded-2xl h-14">
                    Save Changes
                  </Button>
                </div>
              </form>
            )}

            {activeTab === 'security' && (
              <div className="space-y-12">
                <div>
                  <h3 className="text-2xl font-black text-text mb-2">Security Settings</h3>
                  <p className="text-gray-500 text-sm">Manage your account security and authentication methods.</p>
                </div>

                <div className="space-y-4">
                  {/* Password Row */}
                  <div className="flex items-center justify-between p-6 bg-gray-50 rounded-3xl border border-transparent hover:border-gray-200 transition-all group">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-gray-400 group-hover:text-primary transition-colors">
                        <Lock size={22} />
                      </div>
                      <div>
                        <h4 className="font-bold text-text">Password</h4>
                        <p className="text-xs text-gray-500">Last updated recently</p>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="rounded-xl px-6"
                      onClick={() => setIsPasswordModalOpen(true)}
                    >
                      Change
                    </Button>
                  </div>

                  {/* 2FA Row */}
                  <div className="flex items-center justify-between p-6 bg-gray-50 rounded-3xl border border-transparent hover:border-gray-200 transition-all group">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-gray-400 group-hover:text-primary transition-colors">
                        <Shield size={22} />
                      </div>
                      <div>
                        <h4 className="font-bold text-text">Two-Factor Authentication</h4>
                        <p className="text-xs text-gray-500">
                          {tfaStep === 'confirmed' ? 'Enabled and securing your account' : 'Add an extra layer of security'}
                        </p>
                      </div>
                    </div>
                    {tfaStep === 'off' && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="rounded-xl px-6"
                        onClick={handleEnable2FA}
                        loading={tfaLoading}
                      >
                        Enable
                      </Button>
                    )}
                    {tfaStep === 'confirmed' && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="rounded-xl text-red-500 hover:bg-red-50 px-6"
                        onClick={() => setIsDisableModalOpen(true)}
                        loading={tfaLoading}
                      >
                        Disable
                      </Button>
                    )}
                  </div>

                {/* Change Password Modal */}
                <Modal
                  isOpen={isPasswordModalOpen}
                  onClose={() => setIsPasswordModalOpen(false)}
                  title="Update Password"
                >
                  <form onSubmit={handlePasswordChange} className="space-y-6">
                    <Input 
                      label="Current Password" 
                      type="password"
                      placeholder="••••••••"
                      value={securityData.current_password}
                      onChange={(e) => setSecurityData({...securityData, current_password: e.target.value})}
                      required
                    />
                    <div className="space-y-4">
                      <Input 
                        label="New Password" 
                        type="password"
                        placeholder="••••••••"
                        value={securityData.password}
                        onChange={(e) => setSecurityData({...securityData, password: e.target.value})}
                        required
                      />
                      <Input 
                        label="Confirm New Password" 
                        type="password"
                        placeholder="••••••••"
                        value={securityData.password_confirmation}
                        onChange={(e) => setSecurityData({...securityData, password_confirmation: e.target.value})}
                        required
                      />
                    </div>

                    {securityError && (
                      <div className="p-4 rounded-xl text-xs font-medium bg-red-50 text-red-600 border border-red-100">
                        {securityError}
                      </div>
                    )}

                    <Button 
                      type="submit" 
                      loading={securityLoading} 
                      className="w-full h-14 rounded-2xl bg-gray-900 hover:bg-gray-800"
                    >
                      Update Password
                    </Button>
                  </form>
                </Modal>

                {/* Global Success Message for Security Actions */}
                {securitySuccess && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-2xl bg-green-50 text-green-600 border border-green-100 text-sm font-bold flex items-center gap-2"
                  >
                    <Check size={18} /> Action completed successfully!
                  </motion.div>
                )}

                  {/* Disable 2FA Modal */}
                  <Modal
                    isOpen={isDisableModalOpen}
                    onClose={() => setIsDisableModalOpen(false)}
                    title="Disable 2FA"
                  >
                    <form onSubmit={handleDisable2FA} className="space-y-6">
                      <p className="text-sm text-gray-500">For security reasons, please enter your password to disable two-factor authentication.</p>
                      <Input 
                        label="Your Password"
                        type="password"
                        placeholder="••••••••"
                        value={disablePassword}
                        onChange={(e) => setDisablePassword(e.target.value)}
                        required
                        autoFocus
                      />
                      <div className="flex gap-3 pt-2">
                        <Button 
                          type="button" 
                          variant="outline" 
                          className="flex-1 rounded-xl"
                          onClick={() => setIsDisableModalOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button 
                          type="submit" 
                          variant="primary" 
                          className="flex-1 rounded-xl bg-red-600 hover:bg-red-700"
                          loading={tfaLoading}
                        >
                          Disable Now
                        </Button>
                      </div>
                    </form>
                  </Modal>

                  {/* 2FA Setup Flow */}
                  {tfaStep === 'setup' && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-8 p-8 border-2 border-primary/20 rounded-[32px] bg-primary/5"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                        <div className="bg-white p-4 rounded-2xl shadow-sm inline-block mx-auto md:mx-0">
                          <img src={qrCode} alt="2FA QR Code" className="w-48 h-48" />
                        </div>
                        <div className="space-y-4">
                          <h4 className="text-lg font-bold text-text">Scan this QR Code</h4>
                          <p className="text-sm text-gray-500">Use an authenticator app (like Google Authenticator) to scan the code, then enter the 6-digit verification code below.</p>
                          <form onSubmit={handleConfirm2FA} className="flex gap-2">
                            <Input 
                              placeholder="000000"
                              value={twoFactorCode}
                              onChange={(e) => setTwoFactorCode(e.target.value)}
                              className="max-w-[150px]"
                              required
                            />
                            <Button type="submit" loading={tfaLoading} className="rounded-xl">Verify & Enable</Button>
                          </form>
                          <button 
                            onClick={() => setTfaStep('off')}
                            className="text-xs text-gray-400 hover:text-gray-600 underline"
                          >
                            Cancel Setup
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Recovery Codes Display */}
                  {recoveryCodes.length > 0 && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="mt-8 p-8 bg-gray-900 text-white rounded-[32px] shadow-xl"
                    >
                      <h4 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <Shield size={20} className="text-primary" /> Recovery Codes
                      </h4>
                      <p className="text-sm text-gray-400 mb-6">Store these codes securely. They can be used to access your account if you lose your 2FA device.</p>
                      <div className="grid grid-cols-2 gap-3 mb-8">
                        {recoveryCodes.map((code, idx) => (
                          <code key={idx} className="bg-white/10 p-2 rounded-lg text-xs font-mono tracking-wider">{code}</code>
                        ))}
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full border-white/20 text-white hover:bg-white/10"
                        onClick={() => setRecoveryCodes([])}
                      >
                        I've Saved These Codes
                      </Button>
                    </motion.div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-8">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-2xl font-black text-text">Notification Preferences</h3>
                    <p className="text-sm text-gray-500 mt-1">Choose what you want to be notified about.</p>
                  </div>

                  <div className="flex items-center gap-3">
                    {notifLoading && (
                      <span className="text-sm font-semibold text-gray-500">Saving…</span>
                    )}
                    {notifSaved && !notifLoading && (
                      <span className="inline-flex items-center gap-2 text-sm font-semibold text-green-700 bg-green-50 px-3 py-2 rounded-2xl">
                        <Check size={16} /> Saved
                      </span>
                    )}
                  </div>
                </div>

                {notifError && (
                  <div className="p-4 bg-red-50 text-red-700 rounded-2xl text-sm font-semibold">
                    {notifError}
                  </div>
                )}

                {[
                  { key: 'order_updates', title: 'Order Updates', desc: 'Receive alerts about your order status and shipping.' },
                  { key: 'promotions', title: 'New Arrivals', desc: 'Be the first to know about new premium releases.' },
                  { key: 'newsletter', title: 'Newsletter', desc: 'Weekly digest of the best design and tech stories.' },
                ].map((item) => {
                  const enabled = !!notifPrefs?.[item.key];
                  return (
                    <div key={item.key} className="flex items-center justify-between p-6 bg-gray-50 rounded-3xl">
                      <div>
                        <h4 className="font-bold text-text">{item.title}</h4>
                        <p className="text-sm text-gray-500">{item.desc}</p>
                      </div>

                      <button
                        type="button"
                        role="switch"
                        aria-checked={enabled}
                        disabled={notifLoading}
                        onClick={() => handleToggleNotifPref(item.key)}
                        className={[
                          'w-12 h-6 rounded-full relative cursor-pointer shadow-inner transition-colors flex-shrink-0',
                          enabled ? 'bg-primary' : 'bg-gray-300',
                          notifLoading ? 'opacity-60 cursor-not-allowed' : '',
                        ].join(' ')}
                      >
                        <span
                          className={[
                            'absolute left-1 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-md transition-transform',
                            enabled ? 'translate-x-6' : 'translate-x-0',
                          ].join(' ')}
                        />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;

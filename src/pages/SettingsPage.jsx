import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { User, Lock, Bell, Shield, ArrowLeft, Camera, Check } from 'lucide-react';
import Button from '../components/Button';
import Input from '../components/Input';
import { motion } from 'framer-motion';
import { updateProfile } from '../features/auth/authSlice';

const SettingsPage = () => {
  const { user, loading, error } = useSelector(state => state.auth);
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

  const tabs = [
    { id: 'profile', label: 'Edit Profile', icon: <User size={18} /> },
    { id: 'security', label: 'Security', icon: <Lock size={18} /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={18} /> },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-500 hover:text-primary transition-colors mb-8 group"
      >
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> Back
      </button>

      <h1 className="text-4xl font-black text-text mb-12">Settings</h1>

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
                    {error && (
                      <span className="text-red-500 text-sm font-bold">{error}</span>
                    )}
                  </div>
                  <Button type="submit" loading={loading} className="px-12 rounded-2xl h-14">
                    Save Changes
                  </Button>
                </div>
              </form>
            )}

            {activeTab === 'security' && (
              <div className="space-y-10 text-center py-10">
                <div className="w-20 h-20 bg-primary/10 text-primary rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <Shield size={40} />
                </div>
                <h3 className="text-2xl font-black text-text">Security Settings</h3>
                <p className="text-gray-500 max-w-sm mx-auto">Manage your password and two-factor authentication to keep your account safe.</p>
                <div className="max-w-md mx-auto space-y-4">
                  <Button variant="outline" className="w-full h-14 rounded-2xl">Change Password</Button>
                  <Button variant="outline" className="w-full h-14 rounded-2xl">Enable 2FA</Button>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-8">
                <h3 className="text-2xl font-black text-text mb-8">Notification Preferences</h3>
                {[
                  { title: "Order Updates", desc: "Receive alerts about your order status and shipping." },
                  { title: "New Arrivals", desc: "Be the first to know about new premium releases." },
                  { title: "Newsletter", desc: "Weekly digest of the best design and tech stories." }
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-6 bg-gray-50 rounded-3xl">
                    <div>
                      <h4 className="font-bold text-text">{item.title}</h4>
                      <p className="text-sm text-gray-500">{item.desc}</p>
                    </div>
                    <div className="w-12 h-6 bg-primary rounded-full relative cursor-pointer shadow-inner">
                      <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-md"></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;

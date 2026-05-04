import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Cookie, Settings2, Check, Info, ShieldCheck, BarChart3 } from 'lucide-react';

const CookieSettingsPage = () => {
  const [settings, setSettings] = useState({
    essential: true,
    functional: true,
    analytics: false,
    marketing: false
  });

  const toggleSetting = (key) => {
    if (key === 'essential') return; // Cannot disable essential
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const categories = [
    {
      id: 'essential',
      title: 'Essential Cookies',
      description: 'These are necessary for the website to function and cannot be switched off. They are usually only set in response to actions made by you which amount to a request for services.',
      icon: <ShieldCheck size={20} className="text-emerald-500" />,
      required: true
    },
    {
      id: 'functional',
      title: 'Functional Cookies',
      description: 'These cookies enable the website to provide enhanced functionality and personalization. They may be set by us or by third party providers.',
      icon: <Settings2 size={20} className="text-blue-500" />,
      required: false
    },
    {
      id: 'analytics',
      title: 'Analytics Cookies',
      description: 'These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site.',
      icon: <BarChart3 size={20} className="text-purple-500" />,
      required: false
    }
  ];

  return (
    <div className="min-h-screen pt-20 pb-32">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-amber-50 rounded-full text-amber-600 mb-6 shadow-inner">
            <Cookie size={40} />
          </div>
          <h1 className="text-5xl font-black text-text tracking-tighter mb-4">Cookie Settings</h1>
          <p className="text-gray-500 max-w-xl mx-auto text-lg leading-relaxed">
            Manage your preferences for how we use cookies and similar technologies to enhance your experience.
          </p>
        </motion.div>

        {/* Content */}
        <div className="bg-white border border-gray-100 rounded-[2.5rem] shadow-2xl shadow-gray-100/50 overflow-hidden">
          <div className="p-8 md:p-12 space-y-12">
            {categories.map((cat) => (
              <div key={cat.id} className="flex flex-col md:flex-row gap-6 items-start">
                <div className="shrink-0 w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center">
                  {cat.icon}
                </div>
                <div className="flex-grow">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold text-text">{cat.title}</h3>
                    {cat.required ? (
                      <span className="text-[10px] font-black uppercase tracking-widest bg-gray-100 text-gray-500 px-3 py-1 rounded-full">Always On</span>
                    ) : (
                      <button 
                        onClick={() => toggleSetting(cat.id)}
                        className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${settings[cat.id] ? 'bg-primary' : 'bg-gray-200'}`}
                      >
                        <motion.div 
                          animate={{ x: settings[cat.id] ? 26 : 4 }}
                          className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
                        />
                      </button>
                    )}
                  </div>
                  <p className="text-gray-500 text-sm leading-relaxed max-w-2xl">
                    {cat.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-gray-50 p-8 flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-gray-100">
            <div className="flex items-center gap-3 text-gray-400">
              <Info size={16} />
              <p className="text-xs font-medium">Your preferences are saved locally.</p>
            </div>
            <div className="flex gap-4">
              <button 
                onClick={() => setSettings({ essential: true, functional: false, analytics: false, marketing: false })}
                className="px-6 py-3 text-sm font-bold text-gray-600 hover:text-text transition-colors"
              >
                Reject All Non-Essential
              </button>
              <button 
                onClick={() => alert('Settings Saved Successfully!')}
                className="px-8 py-3 bg-primary text-white text-sm font-bold rounded-2xl hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-95"
              >
                Save Preferences
              </button>
            </div>
          </div>
        </div>

        {/* Info Box */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 p-8 bg-blue-50/50 rounded-3xl border border-blue-100 flex gap-6"
        >
          <div className="shrink-0 text-blue-500 mt-1">
            <Info size={24} />
          </div>
          <div>
            <h4 className="text-blue-900 font-bold mb-2">Why do we use cookies?</h4>
            <p className="text-blue-800/70 text-sm leading-relaxed">
              Cookies help us understand how you use our site, keep you logged in, and show you products that might interest you. You can learn more in our <button className="font-bold underline">Privacy Policy</button>.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CookieSettingsPage;

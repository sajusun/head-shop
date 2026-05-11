import React from 'react';
import { Cookie } from 'lucide-react';
import StaticPageWrapper from '../components/StaticPageWrapper';

const CookieSettingsPage = () => {
  return (
    <StaticPageWrapper 
      title="Cookie Settings" 
      settingKey="cookie_settings_content" 
      icon={Cookie} 
      defaultContent={
        <div className="prose prose-lg max-w-none">
          <p className="text-xl text-gray-600 leading-relaxed italic border-l-4 border-primary pl-6 py-2 mb-10">
            We use cookies to enhance your experience, serve personalized ads or content, and analyze our traffic.
          </p>
          <h3>Manage Cookies</h3>
          <p>By using our website, you consent to our use of cookies. You can manage your preferences here.</p>
        </div>
      }
    />
  );
};

export default CookieSettingsPage;

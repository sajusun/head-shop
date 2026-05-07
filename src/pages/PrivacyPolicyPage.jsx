import React from 'react';
import { Shield } from 'lucide-react';
import StaticPageWrapper from '../components/StaticPageWrapper';

const PrivacyPolicyPage = () => {
  return (
    <StaticPageWrapper 
      title="Privacy Policy" 
      settingKey="privacy_policy_content" 
      icon={Shield} 
      defaultContent={
        <div className="prose prose-lg max-w-none">
          <p className="text-xl text-gray-600 leading-relaxed italic border-l-4 border-primary pl-6 py-2 mb-10">
            Your privacy is paramount to us at Herd Shop. We are committed to protecting your personal data and being transparent about how we collect and use it.
          </p>
          <h3>1. Data Collection</h3>
          <p>We collect information you provide directly to us, such as when you create an account, make a purchase, or communicate with us.</p>
          <h3>2. How We Use Your Data</h3>
          <p>We use the information we collect to provide, maintain, and improve our services, process transactions, and communicate with you.</p>
        </div>
      }
    />
  );
};

export default PrivacyPolicyPage;

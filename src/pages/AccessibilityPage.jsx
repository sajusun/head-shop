import React from 'react';
import { Eye } from 'lucide-react';
import StaticPageWrapper from '../components/StaticPageWrapper';

const AccessibilityPage = () => {
  return (
    <StaticPageWrapper 
      title="Accessibility" 
      settingKey="accessibility_content" 
      icon={Eye} 
      defaultContent={
        <div className="prose prose-lg max-w-none">
          <p className="text-xl text-gray-600 leading-relaxed italic border-l-4 border-primary pl-6 py-2 mb-10">
            We are committed to making our website accessible to everyone, including people with disabilities.
          </p>
          <h3>Our Commitment</h3>
          <p>We are continuously working to improve the accessibility of our web experience for everyone, and we welcome your feedback and accommodation requests.</p>
        </div>
      }
    />
  );
};

export default AccessibilityPage;

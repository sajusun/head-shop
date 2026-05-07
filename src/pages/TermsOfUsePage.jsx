import React from 'react';
import { FileText } from 'lucide-react';
import StaticPageWrapper from '../components/StaticPageWrapper';

const TermsOfUsePage = () => {
  return (
    <StaticPageWrapper 
      title="Terms of Use" 
      settingKey="terms_of_use_content" 
      icon={FileText} 
      defaultContent={
        <div className="prose prose-lg max-w-none">
          <p>By accessing the website at herdshop.com, you are agreeing to be bound by these terms of service, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws.</p>
          <h3>1. Use License</h3>
          <p>Permission is granted to temporarily download one copy of the materials on Herd Shop's website for personal, non-commercial transitory viewing only.</p>
        </div>
      }
    />
  );
};

export default TermsOfUsePage;

import React from 'react';
import { RefreshCw } from 'lucide-react';
import StaticPageWrapper from '../components/StaticPageWrapper';

const ReturnsExchangesPage = () => {
  return (
    <StaticPageWrapper 
      title="Returns & Exchanges" 
      settingKey="returns_policy_content" 
      icon={RefreshCw} 
      defaultContent={
        <div className="prose prose-lg max-w-none">
          <p>If you are not 100% satisfied with your purchase, you can return the product and get a full refund or exchange the product for another one.</p>
          <h3>Return Window</h3>
          <p>You can return a product for up to 30 days from the date you purchased it.</p>
        </div>
      }
    />
  );
};

export default ReturnsExchangesPage;

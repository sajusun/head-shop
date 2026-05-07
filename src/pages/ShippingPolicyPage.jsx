import React from 'react';
import { Truck } from 'lucide-react';
import StaticPageWrapper from '../components/StaticPageWrapper';

const ShippingPolicyPage = () => {
  return (
    <StaticPageWrapper 
      title="Shipping Policy" 
      settingKey="shipping_policy_content" 
      icon={Truck} 
      defaultContent={
        <div className="prose prose-lg max-w-none">
          <p>We offer free express shipping on all orders over $100. Most orders are processed within 24 hours and delivered within 3-5 business days.</p>
          <h3>International Shipping</h3>
          <p>We ship worldwide. Shipping costs and delivery times vary by country and will be calculated at checkout.</p>
        </div>
      }
    />
  );
};

export default ShippingPolicyPage;

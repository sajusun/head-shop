import React from 'react';
import { motion } from 'framer-motion';
import { Truck, Globe, Clock, Package, ShieldCheck, AlertCircle } from 'lucide-react';

const ShippingPolicyPage = () => {
  const sections = [
    {
      title: "Processing Time",
      icon: <Clock className="text-primary" />,
      content: "All orders are processed within 1-2 business days. Orders are not shipped or delivered on weekends or holidays. If we are experiencing a high volume of orders, shipments may be delayed by a few days."
    },
    {
      title: "Shipping Rates & Delivery",
      icon: <Truck className="text-primary" />,
      content: "Shipping charges for your order will be calculated and displayed at checkout. We offer Standard Shipping (3-5 business days) and Express Shipping (1-2 business days). Free standard shipping is available on orders over $150."
    },
    {
      title: "International Shipping",
      icon: <Globe className="text-primary" />,
      content: "We ship to over 50 countries worldwide. International orders may be subject to import duties and taxes (including VAT), which are incurred once a shipment reaches your destination country."
    },
    {
      title: "Order Tracking",
      icon: <Package className="text-primary" />,
      content: "You will receive a Shipment Confirmation email once your order has shipped containing your tracking number(s). The tracking number will be active within 24 hours."
    }
  ];

  return (
    <div className="min-h-screen pt-20 pb-32">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl text-primary mb-6">
            <Truck size={32} />
          </div>
          <h1 className="text-5xl font-black text-text tracking-tighter mb-4">Shipping Policy</h1>
          <p className="text-gray-500 font-medium">Reliable delivery to your doorstep.</p>
        </motion.div>

        {/* Content */}
        <div className="space-y-16">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="prose prose-lg max-w-none"
          >
            <p className="text-xl text-gray-600 leading-relaxed italic border-l-4 border-primary pl-6 py-2">
              At Herd Shop, we strive to deliver your premium lifestyle goods as quickly and safely as possible.
            </p>
          </motion.div>

          <div className="grid gap-12">
            {sections.map((section, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex gap-6 group"
              >
                <div className="shrink-0 w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                  {section.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-text mb-3">{section.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{section.content}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Special Notice */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-primary/5 rounded-3xl p-8 md:p-12 mt-20 border border-primary/10"
          >
            <div className="flex items-start gap-6">
              <div className="shrink-0 w-12 h-12 bg-white rounded-xl flex items-center justify-center text-primary shadow-sm">
                <ShieldCheck size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-black text-text mb-4">Shipping Protection</h2>
                <p className="text-gray-600 leading-relaxed mb-6">
                  We offer optional shipping protection at checkout to cover your package against loss, damage, or theft during transit. If your package is protected and an issue arises, we will provide a replacement or refund immediately.
                </p>
                <div className="flex items-center gap-3 p-4 bg-white/50 rounded-2xl border border-primary/5">
                  <AlertCircle size={20} className="text-primary" />
                  <p className="text-sm font-bold text-text">Questions about your shipment? <button className="text-primary hover:underline">Contact Support</button></p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ShippingPolicyPage;

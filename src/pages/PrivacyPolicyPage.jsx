import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, FileText, Bell, Globe } from 'lucide-react';

const PrivacyPolicyPage = () => {
  const sections = [
    {
      title: "Data Collection",
      icon: <Eye className="text-primary" />,
      content: "We collect information you provide directly to us, such as when you create an account, make a purchase, or communicate with us. This may include your name, email address, billing address, shipping address, and payment information."
    },
    {
      title: "How We Use Your Data",
      icon: <FileText className="text-primary" />,
      content: "We use the information we collect to provide, maintain, and improve our services, process transactions, send you technical notices, and communicate with you about products, services, and events."
    },
    {
      title: "Data Security",
      icon: <Lock className="text-primary" />,
      content: "We take reasonable measures to help protect information about you from loss, theft, misuse, and unauthorized access, disclosure, alteration, and destruction. We use industry-standard encryption for data in transit and at rest."
    },
    {
      title: "Cookies and Tracking",
      icon: <Globe className="text-primary" />,
      content: "We use various technologies to collect information, including cookies and pixel tags. These help us understand how you interact with our site and improve your browsing experience."
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
            <Shield size={32} />
          </div>
          <h1 className="text-5xl font-black text-text tracking-tighter mb-4">Privacy Policy</h1>
          <p className="text-gray-500 font-medium">Last updated: May 4, 2024</p>
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
              Your privacy is paramount to us at Herd Shop. We are committed to protecting your personal data and being transparent about how we collect and use it.
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

          {/* Detailed Text Block */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gray-50 rounded-3xl p-8 md:p-12 mt-20"
          >
            <h2 className="text-2xl font-black text-text mb-6">Your Rights & Choices</h2>
            <div className="space-y-6 text-gray-600">
              <p>
                Depending on your location, you may have certain rights regarding your personal information, including the right to access, correct, or delete the data we hold about you. 
              </p>
              <p>
                You can opt out of receiving promotional communications from us by following the instructions in those communications or by updating your account settings. If you opt out, we may still send you non-promotional communications, such as those about your account or our ongoing business relations.
              </p>
            </div>
            <div className="mt-10 flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100">
              <Bell size={20} className="text-primary" />
              <p className="text-sm font-bold text-text">Subscribe to privacy updates? <button className="text-primary hover:underline">Click here</button></p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;

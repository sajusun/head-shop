import React from 'react';
import { motion } from 'framer-motion';
import { Accessibility, Eye, Ear, MousePointer2, Type, MessageSquare, PhoneCall } from 'lucide-react';

const AccessibilityPage = () => {
  const features = [
    {
      title: "Visual Accessibility",
      description: "Our site is designed to be compatible with screen readers. We ensure high color contrast and provide alt text for all meaningful images.",
      icon: <Eye className="text-blue-500" />
    },
    {
      title: "Navigation & Interaction",
      description: "Everything on Herd Shop can be accessed via keyboard. We use clear focus indicators to help you see where you are.",
      icon: <MousePointer2 className="text-purple-500" />
    },
    {
      title: "Content Clarity",
      description: "We use clear, simple language and structured headings to make information easy to find and understand for everyone.",
      icon: <Type className="text-emerald-500" />
    }
  ];

  return (
    <div className="min-h-screen pt-20 pb-32">
      <div className="max-w-4xl mx-auto px-4">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-indigo-600 rounded-[3rem] p-12 md:p-20 text-white text-center mb-20 relative overflow-hidden"
        >
          {/* Abstract Background Shapes */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-400/20 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl" />
          
          <div className="relative z-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-lg rounded-2xl mb-8">
              <Accessibility size={32} />
            </div>
            <h1 className="text-5xl md:text-6xl font-black tracking-tighter mb-6">Accessibility for All</h1>
            <p className="text-xl text-indigo-100 max-w-2xl mx-auto font-medium leading-relaxed">
              We believe everyone should be able to shop with ease. We are committed to making Herd Shop accessible to the widest possible audience.
            </p>
          </div>
        </motion.div>

        {/* Commitment Statement */}
        <div className="grid md:grid-cols-3 gap-8 mb-32">
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="p-8 bg-white border border-gray-100 rounded-3xl hover:shadow-2xl hover:shadow-indigo-500/10 transition-all group"
            >
              <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-lg font-bold text-text mb-4">{feature.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Detailed Sections */}
        <div className="space-y-24">
          <motion.section 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row gap-12 items-center"
          >
            <div className="flex-1">
              <h2 className="text-3xl font-black text-text tracking-tight mb-6">Our Standard</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                We aim to comply with the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA. These guidelines explain how to make web content more accessible for people with a wide array of disabilities.
              </p>
              <div className="flex flex-wrap gap-3">
                {['WCAG 2.1', 'ARIA Labels', 'Alt Text', 'Keyboard Nav'].map(tag => (
                  <span key={tag} className="px-4 py-2 bg-gray-100 text-gray-600 text-xs font-bold rounded-full">{tag}</span>
                ))}
              </div>
            </div>
            <div className="flex-1 w-full aspect-square bg-gray-50 rounded-[2rem] flex items-center justify-center border-4 border-white shadow-xl">
              <Ear size={80} className="text-indigo-200" />
            </div>
          </motion.section>

          {/* Feedback Section */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-text text-white rounded-[3rem] p-12 md:p-16"
          >
            <div className="max-w-2xl">
              <h2 className="text-4xl font-black tracking-tight mb-6">Found an issue?</h2>
              <p className="text-gray-400 text-lg mb-10">
                If you experience any difficulty in accessing any part of this website, please let us know. We respond to all feedback within 48 hours.
              </p>
              <div className="grid sm:grid-cols-2 gap-6">
                <a href="mailto:access@herdshop.com" className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-colors">
                  <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center">
                    <MessageSquare size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Email Us</p>
                    <p className="font-bold">access@herdshop.com</p>
                  </div>
                </a>
                <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl">
                  <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center">
                    <PhoneCall size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Call Toll-Free</p>
                    <p className="font-bold">1-800-HERD-ACC</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AccessibilityPage;

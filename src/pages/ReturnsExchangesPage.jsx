import React from 'react';
import { motion } from 'framer-motion';
import { RefreshCcw, ShieldCheck, CreditCard, HelpCircle, ArrowRight, CheckCircle2 } from 'lucide-react';

const ReturnsExchangesPage = () => {
  const sections = [
    {
      title: "30-Day Return Window",
      icon: <RefreshCcw className="text-primary" />,
      content: "We accept returns and exchanges within 30 days of delivery. Items must be in their original condition, unworn, unwashed, and with all original tags attached."
    },
    {
      title: "Easy Exchanges",
      icon: <ArrowRight className="text-primary" />,
      content: "Found the perfect item but need a different size? We offer free exchanges for all domestic orders. Simply start an exchange through our portal and we'll ship your new item once the original is received."
    },
    {
      title: "Refund Process",
      icon: <CreditCard className="text-primary" />,
      content: "Once your return is received and inspected, we will process your refund back to your original payment method. Please allow 5-10 business days for the credit to appear on your statement."
    },
    {
      title: "Quality Guarantee",
      icon: <ShieldCheck className="text-primary" />,
      content: "If you receive a damaged or defective item, please contact us immediately. We take full responsibility for quality issues and will provide a prepaid return label and a full refund or replacement."
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
            <RefreshCcw size={32} />
          </div>
          <h1 className="text-5xl font-black text-text tracking-tighter mb-4">Returns & Exchanges</h1>
          <p className="text-gray-500 font-medium">Hassle-free returns for your peace of mind.</p>
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
              We want you to love everything you buy from Herd Shop. If something isn't right, we're here to help.
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

          {/* Quick Steps */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-text text-white rounded-3xl p-8 md:p-12 mt-20"
          >
            <h2 className="text-3xl font-black mb-8 tracking-tight">How to Return</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                "Initiate your return via our online portal with your order number.",
                "Pack the items securely in original packaging if possible.",
                "Drop off at any authorized carrier location with the provided label."
              ].map((step, i) => (
                <div key={i} className="space-y-4">
                  <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center font-black text-primary">
                    {i + 1}
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed">{step}</p>
                </div>
              ))}
            </div>
            <div className="mt-12 flex flex-wrap gap-4">
              <button className="px-8 py-4 bg-primary text-white font-black rounded-2xl hover:scale-105 transition-transform">
                Start a Return
              </button>
              <button className="px-8 py-4 bg-white/10 text-white font-black rounded-2xl hover:bg-white/20 transition-colors">
                View Policy FAQ
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ReturnsExchangesPage;

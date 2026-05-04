import React from 'react';
import { motion } from 'framer-motion';
import { Gavel, CheckCircle2, AlertCircle, Scale, ShieldAlert, BookOpen } from 'lucide-react';

const TermsOfUsePage = () => {
  const sections = [
    {
      title: "Agreement to Terms",
      icon: <CheckCircle2 className="text-primary" />,
      content: "By accessing or using Herd Shop, you agree to be bound by these Terms of Use and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site."
    },
    {
      title: "Use License",
      icon: <BookOpen className="text-primary" />,
      content: "Permission is granted to temporarily download one copy of the materials (information or software) on Herd Shop's website for personal, non-commercial transitory viewing only."
    },
    {
      title: "Disclaimer",
      icon: <AlertCircle className="text-primary" />,
      content: "The materials on Herd Shop's website are provided on an 'as is' basis. Herd Shop makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability."
    },
    {
      title: "Limitations",
      icon: <ShieldAlert className="text-primary" />,
      content: "In no event shall Herd Shop or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Herd Shop's website."
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
            <Gavel size={32} />
          </div>
          <h1 className="text-5xl font-black text-text tracking-tighter mb-4">Terms of Use</h1>
          <p className="text-gray-500 font-medium">Effective Date: May 4, 2024</p>
        </motion.div>

        {/* Introduction */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-20 p-8 border-2 border-primary/5 rounded-3xl bg-primary/5"
        >
          <p className="text-lg text-gray-700 leading-relaxed font-medium">
            Please read these terms carefully. They contain important information about your legal rights, remedies, and obligations. By using our platform, you acknowledge that you have read and understood these terms.
          </p>
        </motion.div>

        {/* Main Sections */}
        <div className="grid gap-8">
          {sections.map((section, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="p-8 bg-white border border-gray-100 rounded-3xl hover:shadow-xl hover:shadow-primary/5 transition-all duration-300"
            >
              <div className="flex items-start gap-6">
                <div className="shrink-0 mt-1">
                  {section.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-text mb-4">{section.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{section.content}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Governing Law */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 border-t border-gray-100 pt-16"
        >
          <div className="flex items-center gap-4 mb-8">
            <Scale className="text-primary" size={24} />
            <h2 className="text-2xl font-black text-text uppercase tracking-tighter">Governing Law</h2>
          </div>
          <p className="text-gray-600 leading-relaxed mb-8">
            These terms and conditions are governed by and construed in accordance with the laws of the jurisdiction in which Herd Shop operates and you irrevocably submit to the exclusive jurisdiction of the courts in that State or location.
          </p>
          <div className="p-6 bg-gray-900 rounded-2xl text-white/80 text-sm font-mono">
            // For legal inquiries, please contact legal@herdshop.com
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TermsOfUsePage;

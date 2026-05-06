import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, MessageSquare, Phone, MapPin, Send, CheckCircle } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const ContactPage = () => {
  const location = useLocation();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'General Inquiry',
    message: ''
  });

  useEffect(() => {
    if (location.state) {
      setFormData(prev => ({
        ...prev,
        subject: location.state.subject || 'General Inquiry',
        message: location.state.orderId ? `Regarding Order: ${location.state.orderId}\n\n` : ''
      }));
    }
  }, [location.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    // Simulate API call
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        name: '',
        email: '',
        subject: 'General Inquiry',
        message: ''
      });
    }, 5000);
  };

  return (
    <div className="min-h-screen pt-20 pb-32">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-20 items-start">
          
          {/* Left Side: Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-6xl font-black text-text tracking-tighter mb-8 leading-none">
              Get in <span className="text-primary">Touch</span>
            </h1>
            <p className="text-xl text-gray-500 font-medium mb-12 max-w-md">
              Have a question about an order or just want to say hi? We'd love to hear from you.
            </p>

            <div className="space-y-10">
              <div className="flex gap-6 items-start">
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shrink-0">
                  <Mail size={24} />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-text mb-1">Email Us</h4>
                  <p className="text-gray-500">support@herdshop.com</p>
                  <p className="text-xs text-primary font-bold mt-2 uppercase tracking-widest">Responds in 24h</p>
                </div>
              </div>

              <div className="flex gap-6 items-start">
                <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center text-text shrink-0">
                  <MessageSquare size={24} />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-text mb-1">Live Chat</h4>
                  <p className="text-gray-500">Available Mon-Fri, 9am - 6pm EST</p>
                  <button className="text-sm font-black text-primary mt-2 hover:underline">Start Chat Now</button>
                </div>
              </div>

              <div className="flex gap-6 items-start">
                <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center text-text shrink-0">
                  <MapPin size={24} />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-text mb-1">Office</h4>
                  <p className="text-gray-500">123 Design District, Suite 400<br/>New York, NY 10013</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Side: Form */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-[40px] p-8 md:p-12 border border-gray-100 shadow-2xl shadow-primary/5 relative overflow-hidden"
          >
            {submitted ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center text-white mb-6">
                  <CheckCircle size={40} />
                </div>
                <h2 className="text-3xl font-black text-text mb-4">Message Received!</h2>
                <p className="text-gray-500 mb-8">We've received your inquiry and will get back to you shortly.</p>
                <button 
                  onClick={() => setSubmitted(false)}
                  className="px-8 py-4 bg-gray-100 text-text font-black rounded-2xl hover:bg-gray-200 transition-colors"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-black text-text uppercase tracking-widest ml-1">Name</label>
                    <input 
                      required
                      type="text" 
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      className="w-full px-6 py-4 bg-gray-50 border-transparent rounded-2xl focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all text-text font-medium"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-black text-text uppercase tracking-widest ml-1">Email</label>
                    <input 
                      required
                      type="email" 
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      className="w-full px-6 py-4 bg-gray-50 border-transparent rounded-2xl focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all text-text font-medium"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-black text-text uppercase tracking-widest ml-1">Subject</label>
                  <select 
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-6 py-4 bg-gray-50 border-transparent rounded-2xl focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all text-text font-medium appearance-none"
                  >
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Order Support">Order Support</option>
                    <option value="Returns & Exchanges">Returns & Exchanges</option>
                    <option value="Wholesale">Wholesale</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-black text-text uppercase tracking-widest ml-1">Message</label>
                  <textarea 
                    required
                    rows="5"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us what's on your mind..."
                    className="w-full px-6 py-4 bg-gray-50 border-transparent rounded-2xl focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all text-text font-medium resize-none"
                  ></textarea>
                </div>

                <button 
                  type="submit"
                  className="w-full py-5 bg-primary text-white font-black rounded-2xl flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-100 transition-all shadow-xl shadow-primary/20"
                >
                  <Send size={20} />
                  Send Message
                </button>
              </form>
            )}
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default ContactPage;


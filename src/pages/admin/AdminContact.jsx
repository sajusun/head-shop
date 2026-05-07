import React, { useEffect, useState } from 'react';
import { FiMessageSquare, FiMail, FiTrash2, FiSend, FiCheckCircle, FiClock, FiSearch, FiX } from 'react-icons/fi';
import api from '../../services/api';
import { motion, AnimatePresence } from 'framer-motion';

const AdminContact = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [replying, setReplying] = useState(false);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await api.get('/admin/contact-messages');
      const data = response.data.data || response.data;
      setMessages(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch contact messages', error);
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    setReplying(true);
    try {
      await api.post(`/admin/contact-messages/${selectedMessage.id}/reply`, {
        reply_message: replyText
      });
      
      setMessages(messages.map(m => 
        m.id === selectedMessage.id 
          ? { ...m, status: 'replied', reply_message: replyText, replied_at: new Date().toISOString() } 
          : m
      ));
      
      setReplyText('');
      setSelectedMessage(null);
      alert('Reply sent successfully!');
    } catch (error) {
      console.error('Failed to send reply', error);
      alert('Failed to send reply: ' + (error.response?.data?.message || error.message));
    } finally {
      setReplying(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;
    try {
      await api.delete(`/admin/contact-messages/${id}`);
      setMessages(messages.filter(m => m.id !== id));
      if (selectedMessage?.id === id) setSelectedMessage(null);
    } catch (error) {
      console.error('Failed to delete message', error);
    }
  };

  const filteredMessages = messages.filter(m => {
    const name = (m.name || '').toLowerCase();
    const email = (m.email || '').toLowerCase();
    const subject = (m.subject || '').toLowerCase();
    const query = searchTerm.toLowerCase();
    return name.includes(query) || email.includes(query) || subject.includes(query);
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inquiry Management</h1>
          <p className="text-gray-500 text-sm">Handle customer inquiries and support requests.</p>
        </div>
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text"
            placeholder="Search inquiries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 bg-white border border-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-black/5 outline-none w-64 transition-all"
          />
        </div>
      </div>

      <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 text-gray-400 text-[10px] font-black uppercase tracking-widest border-b border-gray-50">
                <th className="px-8 py-5">Sender</th>
                <th className="px-8 py-5">Subject</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5">Date</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Loading Messages...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredMessages.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-8 py-20 text-center text-gray-400 font-medium italic">
                    {searchTerm ? `No messages matching "${searchTerm}"` : 'No inquiries received yet.'}
                  </td>
                </tr>
              ) : (
                filteredMessages.map((msg) => (
                  <tr key={msg.id} className="group hover:bg-gray-50/50 transition-colors">
                    <td className="px-8 py-5">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-gray-900">{msg.name || 'Anonymous'}</span>
                        <span className="text-[11px] text-gray-400 font-medium">{msg.email || 'No Email'}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className="text-sm font-medium text-gray-700">{msg.subject || 'No Subject'}</span>
                    </td>
                    <td className="px-8 py-5">
                      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        msg.status === 'replied' ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'
                      }`}>
                        {msg.status === 'replied' ? <FiCheckCircle /> : <FiClock />}
                        {msg.status || 'pending'}
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className="text-xs font-bold text-gray-400">
                        {msg.created_at ? new Date(msg.created_at).toLocaleDateString() : 'N/A'}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => setSelectedMessage(msg)}
                          className="p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-xl transition-all"
                          title="View & Reply"
                        >
                          <FiMessageSquare size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(msg.id)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                          title="Delete Message"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Message & Reply Modal */}
      <AnimatePresence>
        {selectedMessage && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedMessage(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
            >
              <div className="p-8 border-b border-gray-100 flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{selectedMessage.subject || 'Inquiry Details'}</h2>
                  <p className="text-sm text-gray-500 mt-1">From: {selectedMessage.name} ({selectedMessage.email})</p>
                </div>
                <button 
                  onClick={() => setSelectedMessage(null)}
                  className="p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-full transition-all"
                >
                  <FiX size={20} />
                </button>
              </div>

              <div className="p-8 max-h-[60vh] overflow-y-auto space-y-8">
                <div className="bg-gray-50 p-6 rounded-3xl">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 bg-black text-white rounded-lg flex items-center justify-center">
                      <FiMail size={14} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Original Message</span>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{selectedMessage.message}</p>
                  <p className="text-[10px] text-gray-400 mt-4 font-medium">
                    {selectedMessage.created_at ? new Date(selectedMessage.created_at).toLocaleString() : ''}
                  </p>
                </div>

                {selectedMessage.status === 'replied' ? (
                  <div className="bg-green-50/50 p-6 rounded-3xl border border-green-100">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 bg-green-500 text-white rounded-lg flex items-center justify-center">
                        <FiCheckCircle size={14} />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-green-600">Replied</span>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{selectedMessage.reply_message}</p>
                    <p className="text-[10px] text-gray-400 mt-4 font-medium">
                      Replied on {selectedMessage.replied_at ? new Date(selectedMessage.replied_at).toLocaleString() : 'Recently'}
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleReply} className="space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-primary text-white rounded-lg flex items-center justify-center">
                        <FiSend size={14} />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-primary">Your Reply</span>
                    </div>
                    <textarea 
                      required
                      rows="4"
                      placeholder="Type your solution/reply here..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 transition-all text-sm font-medium resize-none"
                    ></textarea>
                    <button 
                      type="submit"
                      disabled={replying}
                      className="w-full h-14 bg-primary text-white rounded-2xl font-black text-sm shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                    >
                      {replying ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <FiSend />}
                      {replying ? 'Sending Reply...' : 'Send Solution & Notify User'}
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminContact;

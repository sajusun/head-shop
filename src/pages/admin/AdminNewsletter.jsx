import React, { useEffect, useState } from 'react';
import { FiMail, FiCheck, FiX, FiDownload, FiTrash2, FiUserCheck, FiUserX, FiSearch } from 'react-icons/fi';
import api from '../../services/api';
import { motion, AnimatePresence } from 'framer-motion';

const AdminNewsletter = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      const response = await api.get('/admin/newsletter');
      setSubscriptions(response.data.data);
    } catch (error) {
      console.error('Failed to fetch newsletter subs', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this subscriber?')) return;
    
    setDeletingId(id);
    try {
      await api.delete(`/admin/newsletter/${id}`);
      setSubscriptions(subscriptions.filter(sub => sub.id !== id));
    } catch (error) {
      console.error('Failed to delete subscription', error);
      alert('Failed to delete subscriber');
    } finally {
      setDeletingId(null);
    }
  };

  const exportCSV = () => {
    const headers = ['ID', 'Email', 'Status', 'Joined Date'];
    const rows = subscriptions.map(sub => [
      sub.id,
      sub.email,
      sub.status,
      new Date(sub.created_at).toLocaleString()
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n"
      + rows.map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `newsletter_subscribers_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredSubscriptions = subscriptions.filter(sub => 
    sub.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Newsletter Management</h1>
          <p className="text-gray-500 text-sm">You have {subscriptions.length} total subscribers.</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text"
              placeholder="Search emails..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-white border border-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-black/5 outline-none w-64 transition-all"
            />
          </div>
          <button 
            onClick={exportCSV}
            className="flex items-center justify-center space-x-2 bg-white border border-gray-100 text-gray-700 px-4 py-2 rounded-xl font-bold hover:bg-gray-50 transition-colors shadow-sm"
          >
            <FiDownload size={18} />
            <span className="text-sm">Export CSV</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 text-gray-400 text-[10px] font-black uppercase tracking-widest border-b border-gray-50">
                <th className="px-8 py-5">Subscriber</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5">Joined Date</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              <AnimatePresence mode='popLayout'>
                {loading ? (
                  <tr>
                    <td colSpan="4" className="px-8 py-20 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Loading Audience...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredSubscriptions.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-8 py-20 text-center text-gray-400 font-medium italic">
                      {searchTerm ? `No subscribers matching "${searchTerm}"` : 'Your audience list is currently empty.'}
                    </td>
                  </tr>
                ) : (
                  filteredSubscriptions.map((sub) => (
                    <motion.tr 
                      key={sub.id} 
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="group hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="px-8 py-5">
                        <div className="flex items-center space-x-4">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                            sub.status === 'subscribed' ? 'bg-green-50 text-green-500' : 'bg-gray-50 text-gray-400'
                          }`}>
                            <FiMail size={18} />
                          </div>
                          <span className="text-sm font-bold text-gray-900">{sub.email}</span>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          sub.status === 'subscribed' ? 'bg-green-100/50 text-green-600' : 'bg-red-100/50 text-red-600'
                        }`}>
                          {sub.status === 'subscribed' ? <FiUserCheck /> : <FiUserX />}
                          {sub.status}
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-gray-700">{new Date(sub.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                          <span className="text-[10px] text-gray-400 font-medium">{new Date(sub.created_at).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <button 
                          onClick={() => handleDelete(sub.id)}
                          disabled={deletingId === sub.id}
                          className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                          title="Remove subscriber"
                        >
                          {deletingId === sub.id ? (
                            <div className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <FiTrash2 size={18} />
                          )}
                        </button>
                      </td>
                    </motion.tr>
                  ))
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminNewsletter;

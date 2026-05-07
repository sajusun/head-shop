import React, { useEffect, useState } from 'react';
import { FiMail, FiCheck, FiX, FiDownload } from 'react-icons/fi';
import api from '../../services/api';

const AdminNewsletter = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Newsletter Subscribers</h1>
          <p className="text-gray-500 text-sm">Manage your email marketing audience.</p>
        </div>
        <button className="flex items-center justify-center space-x-2 bg-black text-white px-4 py-2.5 rounded-xl font-bold hover:bg-gray-800 transition-colors">
          <FiDownload size={20} />
          <span>Export CSV</span>
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50 text-gray-500 text-xs font-semibold uppercase">
              <tr>
                <th className="px-6 py-4">Email Address</th>
                <th className="px-6 py-4">Joined Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan="4" className="px-6 py-10 text-center">
                    <div className="flex justify-center">
                      <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  </td>
                </tr>
              ) : subscriptions.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-10 text-center text-gray-500">No subscribers yet.</td>
                </tr>
              ) : (
                subscriptions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400">
                          <FiMail size={16} />
                        </div>
                        <span className="text-sm font-medium text-gray-900">{sub.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(sub.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                        sub.status === 'subscribed' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {sub.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-xs font-bold text-red-500 hover:underline">Remove</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminNewsletter;

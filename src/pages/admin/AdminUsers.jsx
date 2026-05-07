import React, { useEffect, useState } from 'react';
import { FiUser, FiMail, FiPhone, FiCalendar } from 'react-icons/fi';
import api from '../../services/api';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/admin/users');
      setUsers(response.data.data);
    } catch (error) {
      console.error('Failed to fetch users', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
        <p className="text-gray-500 text-sm">View and manage your registered customers.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : users.length === 0 ? (
          <div className="col-span-full text-center py-20 text-gray-500">No users found.</div>
        ) : (
          users.map((user) => (
            <div key={user.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center text-black group-hover:bg-black group-hover:text-white transition-colors">
                  <FiUser size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{user.name}</h3>
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                    {user.role}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-500 space-x-3">
                  <FiMail className="flex-shrink-0" />
                  <span className="truncate">{user.email}</span>
                </div>
                <div className="flex items-center text-sm text-gray-500 space-x-3">
                  <FiPhone className="flex-shrink-0" />
                  <span>{user.phone || 'No phone'}</span>
                </div>
                <div className="flex items-center text-sm text-gray-500 space-x-3">
                  <FiCalendar className="flex-shrink-0" />
                  <span>Joined {new Date(user.created_at).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-50 flex justify-between items-center">
                <button className="text-xs font-bold text-black hover:underline">View History</button>
                <button className="text-xs font-bold text-red-500 hover:underline">Suspend User</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminUsers;

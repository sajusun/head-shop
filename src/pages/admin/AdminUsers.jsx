import React, { useEffect, useState } from 'react';
import { FiCalendar, FiEdit2, FiMail, FiPhone, FiPlus, FiSearch, FiTrash2, FiUser, FiX } from 'react-icons/fi';
import api from '../../services/api';
import SortableHeader from '../../components/admin/SortableHeader';
import Pagination from '../../components/common/Pagination';
import { useMemo } from 'react';

const emptyForm = {
  name: '',
  email: '',
  phone: '',
  role: 'user',
  password: '',
};

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({ current_page: 1, last_page: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const sortedUsers = useMemo(() => {
    const items = [...users];
    items.sort((a, b) => {
      let aVal = a[sortConfig.key];
      let bVal = b[sortConfig.key];

      if (aVal === bVal) return 0;
      const result = aVal < bVal ? -1 : 1;
      return sortConfig.direction === 'asc' ? result : -result;
    });
    return items;
  }, [users, sortConfig]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/users', {
        params: {
          per_page: perPage,
          page,
          search: search || undefined,
          role: role || undefined,
        },
      });
      setUsers(response.data?.data ?? []);
      setPagination(response.data?.pagination ?? { current_page: 1, last_page: 1, total: 0 });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, perPage, search, role]);

  const openCreateModal = () => {
    setEditingUser(null);
    setForm(emptyForm);
    setError('');
    setModalOpen(true);
  };

  const openEditModal = (user) => {
    setEditingUser(user);
    setForm({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      role: user.role || 'user',
      password: '',
    });
    setError('');
    setModalOpen(true);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');

    try {
      const payload = { ...form };
      if (editingUser && !payload.password) {
        delete payload.password;
      }

      if (editingUser) {
        await api.put(`/admin/users/${editingUser.id}`, payload);
      } else {
        await api.post('/admin/users', payload);
      }

      setModalOpen(false);
      await fetchUsers();
    } catch (err) {
      const errors = err.response?.data?.errors;
      const firstError = errors ? Object.values(errors).flat()[0] : null;
      setError(firstError || err.response?.data?.message || 'Failed to save user');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (user) => {
    if (!window.confirm(`Delete ${user.name}?`)) return;

    try {
      await api.delete(`/admin/users/${user.id}`);
      setUsers(prev => prev.filter(item => item.id !== user.id));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete user');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-500 text-sm">Create, edit, filter, and remove registered accounts.</p>
        </div>
        <button onClick={openCreateModal} className="flex items-center justify-center gap-2 bg-black text-white px-4 py-2.5 rounded-xl font-bold hover:bg-gray-800 transition-colors">
          <FiPlus size={20} />
          Add User
        </button>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search users by name, email, or phone..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-black/5 text-sm"
            value={search}
            onChange={(event) => {
              setPage(1);
              setSearch(event.target.value);
            }}
          />
        </div>
        <select
          value={role}
          onChange={(event) => {
            setPage(1);
            setRole(event.target.value);
          }}
          className="px-4 py-2 border border-gray-100 rounded-xl text-sm font-semibold bg-white"
        >
          <option value="">All roles</option>
          <option value="admin">Admins</option>
          <option value="user">Users</option>
        </select>
      </div>

      {error && <div className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">{error}</div>}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50/50 text-gray-500 text-xs font-semibold uppercase">
              <tr>
                <SortableHeader label="User" sortKey="name" currentSort={sortConfig} onSort={handleSort} />
                <SortableHeader label="Email" sortKey="email" currentSort={sortConfig} onSort={handleSort} />
                <SortableHeader label="Role" sortKey="role" currentSort={sortConfig} onSort={handleSort} />
                <SortableHeader label="Joined Date" sortKey="created_at" currentSort={sortConfig} onSort={handleSort} />
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-10 text-center">
                    <div className="mx-auto w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-10 text-center text-gray-500">No users found.</td>
                </tr>
              ) : (
                sortedUsers.map(user => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-black group-hover:bg-black group-hover:text-white transition-colors shrink-0">
                          <FiUser size={20} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900">{user.name}</p>
                          <p className="text-xs text-gray-500">ID: #{user.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center text-sm text-gray-600 gap-2">
                          <FiMail size={14} className="text-gray-400" />
                          <span>{user.email}</span>
                        </div>
                        <div className="flex items-center text-xs text-gray-500 gap-2">
                          <FiPhone size={14} className="text-gray-400" />
                          <span>{user.phone || 'N/A'}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-sm text-gray-600 gap-2">
                        <FiCalendar size={14} className="text-gray-400" />
                        <span>{user.created_at ? new Date(user.created_at).toLocaleDateString() : 'Unknown'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openEditModal(user)} className="p-1.5 text-gray-400 hover:text-black hover:bg-gray-100 rounded-lg transition-colors">
                          <FiEdit2 size={16} />
                        </button>
                        <button onClick={() => handleDelete(user)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <Pagination 
          pagination={pagination} 
          onPageChange={setPage} 
          onPerPageChange={setPerPage}
        />
      </div>


      {modalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-xl p-8 shadow-2xl">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold">{editingUser ? 'Edit User' : 'Add User'}</h2>
              <button onClick={() => setModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
                <FiX size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
              <label className="col-span-2">
                <span className="block text-sm font-semibold mb-2">Name</span>
                <input name="name" required value={form.name} onChange={handleChange} className="w-full h-12 px-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black/5 outline-none" />
              </label>

              <label className="col-span-2">
                <span className="block text-sm font-semibold mb-2">Email</span>
                <input name="email" type="email" required value={form.email} onChange={handleChange} className="w-full h-12 px-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black/5 outline-none" />
              </label>

              <label>
                <span className="block text-sm font-semibold mb-2">Phone</span>
                <input name="phone" value={form.phone} onChange={handleChange} className="w-full h-12 px-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black/5 outline-none" />
              </label>

              <label>
                <span className="block text-sm font-semibold mb-2">Role</span>
                <select name="role" value={form.role} onChange={handleChange} className="w-full h-12 px-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black/5 outline-none bg-white">
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </label>

              <label className="col-span-2">
                <span className="block text-sm font-semibold mb-2">{editingUser ? 'New Password (optional)' : 'Password'}</span>
                <input name="password" type="password" required={!editingUser} value={form.password} onChange={handleChange} className="w-full h-12 px-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black/5 outline-none" />
              </label>

              <div className="col-span-2 pt-4">
                <button type="submit" disabled={saving} className="w-full h-14 bg-black text-white rounded-2xl font-bold hover:bg-gray-800 transition-shadow shadow-lg disabled:opacity-50">
                  {saving ? 'Saving...' : editingUser ? 'Update User' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;

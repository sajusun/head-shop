import React, { useEffect, useState } from 'react';
import { FiCalendar, FiEdit2, FiMail, FiPhone, FiPlus, FiSearch, FiTrash2, FiUser, FiX } from 'react-icons/fi';
import api from '../../services/api';

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
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/users', {
        params: {
          per_page: 12,
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
  }, [page, search, role]);

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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : users.length === 0 ? (
          <div className="col-span-full text-center py-20 text-gray-500">No users found.</div>
        ) : (
          users.map(user => (
            <div key={user.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
              <div className="flex items-start justify-between gap-4 mb-6">
                <div className="flex items-center gap-4">
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
                <div className="flex gap-1">
                  <button onClick={() => openEditModal(user)} className="p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-lg transition-colors">
                    <FiEdit2 size={16} />
                  </button>
                  <button onClick={() => handleDelete(user)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <FiTrash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-500 gap-3">
                  <FiMail className="shrink-0" />
                  <span className="truncate">{user.email}</span>
                </div>
                <div className="flex items-center text-sm text-gray-500 gap-3">
                  <FiPhone className="shrink-0" />
                  <span>{user.phone || 'No phone'}</span>
                </div>
                <div className="flex items-center text-sm text-gray-500 gap-3">
                  <FiCalendar className="shrink-0" />
                  <span>Joined {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'Unknown'}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {pagination.last_page > 1 && (
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>{pagination.total} users</span>
          <div className="flex gap-2">
            <button disabled={page <= 1} onClick={() => setPage(page - 1)} className="px-4 py-2 rounded-xl border disabled:opacity-40">Previous</button>
            <span className="px-4 py-2 font-bold text-gray-900">Page {pagination.current_page} of {pagination.last_page}</span>
            <button disabled={page >= pagination.last_page} onClick={() => setPage(page + 1)} className="px-4 py-2 rounded-xl border disabled:opacity-40">Next</button>
          </div>
        </div>
      )}

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

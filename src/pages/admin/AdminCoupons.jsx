import React, { useEffect, useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Ticket, 
  CheckCircle2, 
  XCircle, 
  Loader2, 
  Calendar,
  DollarSign,
  Users
} from 'lucide-react';
import api from '../../services/api';
import Button from '../../components/Button';
import { motion, AnimatePresence } from 'framer-motion';

const emptyCoupon = {
  code: '',
  title: '',
  description: '',
  type: 'percentage',
  value: '',
  min_order_amount: '0',
  max_discount_amount: '',
  start_date: '',
  end_date: '',
  usage_limit: '',
  usage_limit_per_user: '1',
  is_active: true,
};

const AdminCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [form, setForm] = useState(emptyCoupon);
  const [error, setError] = useState('');

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/coupons');
      setCoupons(response.data.data || []);
    } catch (err) {
      console.error('Failed to load coupons:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleOpenCreate = () => {
    setEditingCoupon(null);
    setForm(emptyCoupon);
    setError('');
    setModalOpen(true);
  };

  const handleOpenEdit = (coupon) => {
    setEditingCoupon(coupon);
    setForm({
      code: coupon.code,
      title: coupon.title || '',
      description: coupon.description || '',
      type: coupon.type,
      value: coupon.value,
      min_order_amount: coupon.min_order_amount || '0',
      max_discount_amount: coupon.max_discount_amount || '',
      start_date: coupon.start_date ? coupon.start_date.substring(0, 10) : '',
      end_date: coupon.end_date ? coupon.end_date.substring(0, 10) : '',
      usage_limit: coupon.usage_limit || '',
      usage_limit_per_user: coupon.usage_limit_per_user || '1',
      is_active: Boolean(coupon.is_active),
    });
    setError('');
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const payload = {
        ...form,
        value: Number(form.value),
        min_order_amount: Number(form.min_order_amount || 0),
        max_discount_amount: form.max_discount_amount ? Number(form.max_discount_amount) : null,
        usage_limit: form.usage_limit ? Number(form.usage_limit) : null,
        usage_limit_per_user: Number(form.usage_limit_per_user || 1),
      };

      if (editingCoupon) {
        await api.put(`/admin/coupons/${editingCoupon.id}`, payload);
      } else {
        await api.post('/admin/coupons', payload);
      }

      setModalOpen(false);
      fetchCoupons();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save coupon');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this coupon?')) return;
    try {
      await api.delete(`/admin/coupons/${id}`);
      setCoupons(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      alert('Failed to delete coupon');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center bg-white p-8 rounded-[2rem] shadow-sm border border-gray-50">
        <div>
          <h1 className="text-4xl font-black text-black tracking-tighter uppercase mb-2">Coupons & Discounts</h1>
          <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Promotional Voucher Codes & Cart Rules</p>
        </div>
        <Button 
          onClick={handleOpenCreate}
          className="rounded-2xl px-8 h-14 bg-black text-white font-black uppercase tracking-widest text-xs flex items-center gap-3 shadow-xl shadow-black/20 hover:scale-105 transition-all"
        >
          <Plus size={20} /> Create Coupon
        </Button>
      </div>

      {/* Coupon List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[3rem] border border-dashed border-gray-200">
          <Loader2 className="w-12 h-12 text-black animate-spin mb-4" />
          <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Loading Coupons...</p>
        </div>
      ) : coupons.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-[2rem] border border-gray-100">
          <Ticket className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-700 mb-2">No coupons created yet</h3>
          <p className="text-sm text-gray-400 mb-6">Create promotional discount codes for your clothing campaigns.</p>
          <Button onClick={handleOpenCreate} className="rounded-xl px-6 h-12">
            Create First Coupon
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coupons.map((coupon) => (
            <motion.div
              key={coupon.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
            >
              <div className="flex justify-between items-start mb-4">
                <span className="px-3 py-1.5 bg-black text-white font-mono font-black text-sm tracking-wider rounded-xl uppercase">
                  {coupon.code}
                </span>
                <span className={`px-3 py-1 text-xs font-bold rounded-full ${coupon.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                  {coupon.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>

              <h3 className="text-lg font-bold text-black mb-1">{coupon.title || coupon.code}</h3>
              <p className="text-xs text-gray-500 mb-4 line-clamp-2">{coupon.description || 'No description provided'}</p>

              <div className="bg-gray-50 rounded-2xl p-4 space-y-2 mb-6 text-xs text-gray-600">
                <div className="flex justify-between font-medium">
                  <span className="text-gray-400">Discount:</span>
                  <span className="font-bold text-black">
                    {coupon.type === 'percentage' ? `${coupon.value}% OFF` : coupon.type === 'fixed' ? `$${coupon.value} FLAT` : 'FREE SHIPPING'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Min Order:</span>
                  <span className="font-bold">${coupon.min_order_amount}</span>
                </div>
                {coupon.max_discount_amount && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Max Discount:</span>
                    <span className="font-bold">${coupon.max_discount_amount}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-400">Times Used:</span>
                  <span className="font-bold">{coupon.used_count || 0} {coupon.usage_limit ? `/ ${coupon.usage_limit}` : ''}</span>
                </div>
                {coupon.end_date && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Expires:</span>
                    <span className="font-bold">{new Date(coupon.end_date).toLocaleDateString()}</span>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleOpenEdit(coupon)}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2"
                >
                  <Edit3 size={14} /> Edit
                </button>
                <button
                  onClick={() => handleDelete(coupon.id)}
                  className="p-2.5 rounded-xl border border-red-100 text-red-500 hover:bg-red-50"
                  title="Delete"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Create / Edit Modal */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[2.5rem] p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto"
            >
              <h2 className="text-2xl font-black mb-6">{editingCoupon ? 'Edit Coupon' : 'Create New Coupon'}</h2>

              {error && (
                <div className="mb-4 p-4 rounded-xl bg-red-50 text-red-600 text-xs font-bold">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4 text-xs font-bold">
                <div>
                  <label className="text-gray-500 uppercase tracking-wider block mb-1">Coupon Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. SUMMER20"
                    value={form.code}
                    onChange={e => setForm({ ...form, code: e.target.value.toUpperCase() })}
                    className="w-full h-12 px-4 rounded-xl border border-gray-200 font-mono text-sm uppercase focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>

                <div>
                  <label className="text-gray-500 uppercase tracking-wider block mb-1">Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Summer Flash Sale 20%"
                    value={form.title}
                    onChange={e => setForm({ ...form, title: e.target.value })}
                    className="w-full h-12 px-4 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-gray-500 uppercase tracking-wider block mb-1">Type *</label>
                    <select
                      value={form.type}
                      onChange={e => setForm({ ...form, type: e.target.value })}
                      className="w-full h-12 px-4 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                    >
                      <option value="percentage">Percentage (%)</option>
                      <option value="fixed">Fixed Amount ($)</option>
                      <option value="free_shipping">Free Shipping</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-gray-500 uppercase tracking-wider block mb-1">Value *</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      placeholder={form.type === 'percentage' ? '15' : '100'}
                      value={form.value}
                      onChange={e => setForm({ ...form, value: e.target.value })}
                      className="w-full h-12 px-4 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-gray-500 uppercase tracking-wider block mb-1">Min Order Amount ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="0"
                      value={form.min_order_amount}
                      onChange={e => setForm({ ...form, min_order_amount: e.target.value })}
                      className="w-full h-12 px-4 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>

                  <div>
                    <label className="text-gray-500 uppercase tracking-wider block mb-1">Max Discount ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="Optional"
                      value={form.max_discount_amount}
                      onChange={e => setForm({ ...form, max_discount_amount: e.target.value })}
                      className="w-full h-12 px-4 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-gray-500 uppercase tracking-wider block mb-1">Start Date</label>
                    <input
                      type="date"
                      value={form.start_date}
                      onChange={e => setForm({ ...form, start_date: e.target.value })}
                      className="w-full h-12 px-4 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>

                  <div>
                    <label className="text-gray-500 uppercase tracking-wider block mb-1">Expiry Date</label>
                    <input
                      type="date"
                      value={form.end_date}
                      onChange={e => setForm({ ...form, end_date: e.target.value })}
                      className="w-full h-12 px-4 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <input
                    type="checkbox"
                    id="is_active"
                    checked={form.is_active}
                    onChange={e => setForm({ ...form, is_active: e.target.checked })}
                    className="w-5 h-5 rounded accent-black"
                  />
                  <label htmlFor="is_active" className="text-sm font-bold text-gray-700 cursor-pointer">
                    Enable Coupon
                  </label>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="flex-1 h-14 rounded-2xl border border-gray-200 text-sm font-bold hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <Button
                    type="submit"
                    disabled={saving}
                    className="flex-1 h-14 rounded-2xl bg-black text-white text-sm font-bold"
                  >
                    {saving ? 'Saving...' : editingCoupon ? 'Update Coupon' : 'Create Coupon'}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminCoupons;

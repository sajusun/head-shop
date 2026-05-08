import React, { useState, useEffect, useMemo } from 'react';
import { 
  FiPlus, 
  FiEdit2, 
  FiTrash2, 
  FiSearch, 
  FiX, 
  FiCheck,
  FiDroplet,
  FiMaximize,
  FiHeart,
  FiAlertCircle,
  FiTrash
} from 'react-icons/fi';
import api from '../../services/api';
import Button from '../../components/Button';
import Input from '../../components/Input';
import SortableHeader from '../../components/admin/SortableHeader';
import { motion, AnimatePresence } from 'framer-motion';

const AttributeModal = ({ isOpen, onClose, attribute = null, type = 'colors', onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    hex_code: '',
    short: '',
    status: 'active'
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (attribute) {
      setFormData({
        name: attribute.name || '',
        hex_code: attribute.hex_code || '',
        short: attribute.short || '',
        status: attribute.status || 'active'
      });
    } else {
      setFormData({
        name: '',
        hex_code: '',
        short: '',
        status: 'active'
      });
    }
  }, [attribute, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (attribute) {
        await api.put(`/admin/attributes/${type}/${attribute.id}`, formData);
      } else {
        await api.post(`/admin/attributes/${type}`, formData);
      }
      onSuccess();
      onClose();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to save attribute';
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
      >
        <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
          <h2 className="text-xl font-bold text-text">
            {attribute ? 'Edit' : 'New'} {type.slice(0, -1)}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-all">
            <FiX size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <Input 
            label="Name"
            placeholder={`e.g. ${type === 'colors' ? 'Matte Black' : type === 'sizes' ? 'Extra Large' : 'Premium Build'}`}
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />

          {type === 'colors' && (
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Hex Code</label>
              <div className="flex gap-4">
                <input 
                  type="text"
                  placeholder="#000000"
                  value={formData.hex_code}
                  onChange={(e) => setFormData({ ...formData, hex_code: e.target.value })}
                  className="flex-1 p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 transition-all font-mono"
                />
                <input 
                  type="color"
                  value={formData.hex_code.startsWith('#') ? formData.hex_code : '#000000'}
                  onChange={(e) => setFormData({ ...formData, hex_code: e.target.value })}
                  className="w-14 h-14 p-1 rounded-xl bg-gray-50 cursor-pointer"
                />
              </div>
            </div>
          )}

          {type === 'sizes' && (
            <Input 
              label="Short Name / Label"
              placeholder="e.g. XL, 42, 10.5"
              value={formData.short}
              onChange={(e) => setFormData({ ...formData, short: e.target.value })}
            />
          )}

          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Status</label>
            <div className="flex gap-4">
              {['active', 'inactive'].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setFormData({ ...formData, status: s })}
                  className={`flex-1 py-3 rounded-xl font-bold capitalize transition-all border-2 ${
                    formData.status === s 
                      ? 'bg-black text-white border-black shadow-lg' 
                      : 'bg-white text-gray-400 border-gray-100 hover:border-gray-200'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 flex gap-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 rounded-2xl h-14">
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="flex-1 rounded-2xl h-14 shadow-lg shadow-primary/20">
              {loading ? 'Saving...' : attribute ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, itemName, type, loading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-sm bg-white rounded-[2.5rem] shadow-2xl overflow-hidden p-8 text-center"
      >
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <FiTrash size={28} />
        </div>
        <h3 className="text-xl font-bold text-text mb-2">Are you sure?</h3>
        <p className="text-gray-500 text-sm font-medium mb-8">
          You are about to delete <span className="text-black font-semibold">"{itemName}"</span> from {type}. This action cannot be undone.
        </p>
        <div className="flex gap-4">
          <button 
            onClick={onClose}
            className="flex-1 h-14 rounded-2xl bg-gray-100 text-gray-500 font-bold hover:bg-gray-200 transition-all"
          >
            Cancel
          </button>
          <button 
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 h-14 rounded-2xl bg-red-500 text-white font-bold shadow-lg shadow-red-200 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {loading ? 'Deleting...' : 'Yes, Delete'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const AdminAttributes = () => {
  const [activeTab, setActiveTab] = useState('colors');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });

  const fetchItems = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/admin/attributes/${activeTab}`);
      setItems(response.data.data);
    } catch (err) {
      console.error('Failed to fetch items');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [activeTab]);

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const sortedItems = useMemo(() => {
    const data = [...items];
    data.sort((a, b) => {
      let aVal = a[sortConfig.key];
      let bVal = b[sortConfig.key];
      if (aVal === bVal) return 0;
      const result = aVal < bVal ? -1 : 1;
      return sortConfig.direction === 'asc' ? result : -result;
    });
    return data;
  }, [items, sortConfig]);

  const filteredItems = sortedItems.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const openDeleteModal = (item) => {
    setSelectedItem(item);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedItem) return;
    setDeleting(true);
    try {
      await api.delete(`/admin/attributes/${activeTab}/${selectedItem.id}`);
      setIsDeleteModalOpen(false);
      setSelectedItem(null);
      fetchItems();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to delete attribute';
      alert(msg);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-bold text-text mb-2">Attributes</h1>
          <p className="text-gray-500 font-medium text-sm">Manage product variations and special features.</p>
        </div>
        <Button onClick={() => { setSelectedItem(null); setIsModalOpen(true); }} className="rounded-xl h-11 px-6 shadow-lg shadow-primary/20 flex items-center gap-2 text-sm">
          <FiPlus size={18} />
          Add {activeTab.slice(0, -1)}
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex bg-white p-1 rounded-xl shadow-sm border border-gray-100 w-fit">
          {[
            { id: 'colors', label: 'Colors', icon: <FiDroplet /> },
            { id: 'sizes', label: 'Sizes', icon: <FiMaximize /> },
            { id: 'amenities', label: 'Amenities', icon: <FiHeart /> }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-bold text-[10px] uppercase tracking-widest transition-all ${
                activeTab === tab.id 
                  ? 'bg-black text-white shadow-sm' 
                  : 'text-gray-400 hover:text-text hover:bg-gray-50'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative flex-1 lg:max-w-md">
          <input 
            type="text"
            placeholder={`Search ${activeTab}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-11 pl-10 pr-4 bg-white border border-gray-100 rounded-xl shadow-sm focus:ring-2 focus:ring-primary/20 transition-all text-sm font-medium"
          />
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">
                <SortableHeader label="Name" sortKey="name" currentSort={sortConfig} onSort={handleSort} className="px-8" />
                {activeTab === 'colors' && <th className="px-8 py-6">Value</th>}
                {activeTab === 'sizes' && <th className="px-8 py-6">Short Label</th>}
                <SortableHeader label="Status" sortKey="status" currentSort={sortConfig} onSort={handleSort} className="px-8" />
                <th className="px-8 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              <AnimatePresence mode="popLayout">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="px-8 py-20 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Loading...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredItems.length > 0 ? (
                  filteredItems.map((item, index) => (
                    <motion.tr 
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ delay: index * 0.05 }}
                      className="group hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <span className="font-semibold text-text">{item.name}</span>
                      </td>
                      {activeTab === 'colors' && (
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-3">
                            <div 
                              className="w-6 h-6 rounded-full border border-gray-100 shadow-sm" 
                              style={{ backgroundColor: item.hex_code }}
                            />
                            <span className="text-xs font-mono text-gray-400">{item.hex_code || '#---'}</span>
                          </div>
                        </td>
                      )}
                      {activeTab === 'sizes' && (
                        <td className="px-8 py-6">
                          <span className="text-xs font-black text-gray-500 bg-gray-100 px-3 py-1 rounded-lg uppercase">
                            {item.short || 'N/A'}
                          </span>
                        </td>
                      )}
                      <td className="px-8 py-6">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          item.status === 'active' 
                            ? 'bg-green-100 text-green-600' 
                            : 'bg-gray-100 text-gray-400'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${item.status === 'active' ? 'bg-green-600 animate-pulse' : 'bg-gray-400'}`}></span>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => handleEdit(item)}
                            className="p-1.5 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
                          >
                            <FiEdit2 size={16} />
                          </button>
                          <button 
                            onClick={() => openDeleteModal(item)}
                            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                          >
                            <FiTrash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-8 py-20 text-center text-gray-400 font-bold italic">
                      No {activeTab} found matching your search.
                    </td>
                  </tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      <AttributeModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        attribute={selectedItem}
        type={activeTab}
        onSuccess={fetchItems}
      />

      <DeleteConfirmModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        itemName={selectedItem?.name}
        type={activeTab}
        loading={deleting}
      />
    </div>
  );
};

export default AdminAttributes;

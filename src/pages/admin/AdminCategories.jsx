import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiPlus, 
  FiEdit2, 
  FiTrash2, 
  FiSearch, 
  FiX, 
  FiCheck,
  FiFolder,
  FiAlertCircle
} from 'react-icons/fi';
import { 
  fetchCategories, 
  createCategory, 
  updateCategory, 
  deleteCategory, 
  resetCategoryState 
} from '../../features/categories/categorySlice';
import Button from '../../components/Button';
import Input from '../../components/Input';
import SortableHeader from '../../components/admin/SortableHeader';
import Pagination from '../../components/common/Pagination';

const CategoryModal = ({ isOpen, onClose, category = null, type = 'product' }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: '',
    department: 'unisex',
    description: '',
    type: 'product',
    status: 'active'
  });

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || '',
        department: category.department || 'unisex',
        description: category.description || '',
        type: category.type || type,
        status: category.status || 'active'
      });
    } else {
      setFormData({
        name: '',
        department: 'unisex',
        description: '',
        type: type,
        status: 'active'
      });
    }
  }, [category, type, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (category) {
      dispatch(updateCategory({ id: category.id, data: formData }));
    } else {
      dispatch(createCategory(formData));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
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
        className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
      >
        <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
          <h2 className="text-2xl font-black text-text">
            {category ? 'Edit Category' : 'New Category'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-all">
            <FiX size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <Input 
            label="Category Name"
            placeholder="e.g. Minimalist Collection"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-widest">Type</label>
            <select 
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 transition-all font-medium"
            >
              <option value="product">Product</option>
              <option value="blog">Blog</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-widest">Department</label>
            <select 
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 transition-all font-medium"
            >
              <option value="men">Men</option>
              <option value="women">Women</option>
              <option value="kids">Kids (2-14Y)</option>
              <option value="baby">Baby (0-24M)</option>
              <option value="unisex">Unisex / General</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-widest">Description</label>
            <textarea 
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 transition-all font-medium resize-none"
              rows="3"
              placeholder="Tell us about this category..."
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-widest">Status</label>
            <div className="flex gap-4">
              {['active', 'inactive'].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setFormData({ ...formData, status: s })}
                  className={`flex-1 py-3 rounded-xl font-bold capitalize transition-all border-2 ${
                    formData.status === s 
                      ? 'bg-black text-white border-black' 
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
            <Button type="submit" className="flex-1 rounded-2xl h-14 shadow-lg shadow-primary/20">
              {category ? 'Save Changes' : 'Create Category'}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

const AdminCategories = () => {
  const dispatch = useDispatch();
  const { items: categories, pagination, loading, success, error } = useSelector(state => state.categories);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [activeType, setActiveType] = useState('product');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const sortedCategories = useMemo(() => {
    const items = [...categories];
    items.sort((a, b) => {
      let aVal = a[sortConfig.key];
      let bVal = b[sortConfig.key];

      if (sortConfig.key === 'children_count') {
        aVal = a.children?.length || 0;
        bVal = b.children?.length || 0;
      }

      if (aVal === bVal) return 0;
      const result = aVal < bVal ? -1 : 1;
      return sortConfig.direction === 'asc' ? result : -result;
    });
    return items;
  }, [categories, sortConfig]);

  useEffect(() => {
    dispatch(fetchCategories({ type: activeType, page, per_page: perPage }));
  }, [dispatch, activeType, page, perPage]);

  useEffect(() => {
    if (success) {
      setIsModalOpen(false);
      dispatch(resetCategoryState());
    }
  }, [success, dispatch]);

  const handleEdit = (category) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setSelectedCategory(null);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      dispatch(deleteCategory(id));
    }
  };

  const filteredCategories = sortedCategories.filter(cat => 
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-bold text-text mb-2">Categories</h1>
          <p className="text-gray-500 font-medium text-sm">Organize your {activeType}s with beautiful taxonomy.</p>
        </div>
        <Button onClick={handleAddNew} className="rounded-xl h-11 px-6 shadow-lg shadow-primary/20 flex items-center gap-2 text-sm group">
          <FiPlus size={18} />
          Add Category
        </Button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex bg-white p-1 rounded-xl shadow-sm border border-gray-100 w-fit">
          {['product', 'blog'].map(type => (
            <button
              key={type}
              onClick={() => setActiveType(type)}
              className={`px-6 py-2 rounded-lg font-bold capitalize text-[10px] uppercase tracking-widest transition-all ${
                activeType === type 
                  ? 'bg-black text-white shadow-sm' 
                  : 'text-gray-400 hover:text-text hover:bg-gray-50'
              }`}
            >
              {type}s
            </button>
          ))}
        </div>

        <div className="relative flex-1 lg:max-w-md">
          <input 
            type="text"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-11 pl-10 pr-4 bg-white border border-gray-100 rounded-xl shadow-sm focus:ring-2 focus:ring-primary/20 transition-all text-sm font-medium"
          />
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        </div>
      </div>

      {/* Categories Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">
                <SortableHeader label="Category Info" sortKey="name" currentSort={sortConfig} onSort={handleSort} className="px-6 py-4 text-xs font-bold" />
                <SortableHeader label="Sub-categories" sortKey="children_count" currentSort={sortConfig} onSort={handleSort} className="px-6 py-4 text-center text-xs font-bold" />
                <SortableHeader label="Status" sortKey="status" currentSort={sortConfig} onSort={handleSort} className="px-6 py-4 text-xs font-bold" />
                <th className="px-6 py-4 text-right text-xs font-bold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              <AnimatePresence mode="popLayout">
                {filteredCategories.length > 0 ? (
                  filteredCategories.map((cat, index) => (
                    <motion.tr 
                      key={cat.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ delay: index * 0.05 }}
                      className="group hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                            <FiFolder size={24} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-0.5">
                              <p className="font-bold text-text">{cat.name}</p>
                              <span className="px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider bg-black text-white">
                                {cat.department || 'unisex'}
                              </span>
                            </div>
                            <p className="text-xs text-gray-400 font-medium truncate max-w-xs">{cat.description || 'No description provided.'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-center">
                        <span className="inline-flex items-center justify-center w-8 h-8 bg-gray-100 rounded-lg text-xs font-black text-gray-600">
                          {cat.children?.length || 0}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          cat.status === 'active' 
                            ? 'bg-green-100 text-green-600' 
                            : 'bg-gray-100 text-gray-400'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${cat.status === 'active' ? 'bg-green-600 animate-pulse' : 'bg-gray-400'}`}></span>
                          {cat.status}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => handleEdit(cat)}
                            className="p-1.5 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
                          >
                            <FiEdit2 size={16} />
                          </button>
                          <button 
                            onClick={() => handleDelete(cat.id)}
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
                    <td colSpan="4" className="px-8 py-20 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-200">
                          <FiFolder size={40} />
                        </div>
                        <p className="text-gray-400 font-bold">No categories found matching your search.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
        <Pagination 
          pagination={pagination} 
          onPageChange={setPage} 
          onPerPageChange={setPerPage}
        />
      </div>

      {error && (
        <div className="bg-red-50 p-4 rounded-2xl border border-red-100 text-red-600 font-bold flex items-center gap-3">
          <FiAlertCircle size={20} />
          {error}
        </div>
      )}

      <CategoryModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        category={selectedCategory}
        type={activeType}
      />
    </div>
  );
};

export default AdminCategories;

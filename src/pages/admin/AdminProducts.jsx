import React, { useEffect, useMemo, useState } from 'react';
import { 
  FiEdit2, 
  FiFilter, 
  FiPackage, 
  FiPlus, 
  FiSearch, 
  FiTrash2, 
  FiX, 
  FiImage, 
  FiLayers, 
  FiCheckCircle, 
  FiInfo, 
  FiDollarSign,
  FiBox,
  FiChevronRight,
  FiTrash
} from 'react-icons/fi';
import api from '../../services/api';
import SortableHeader from '../../components/admin/SortableHeader';
import { motion, AnimatePresence } from 'framer-motion';

const emptyForm = {
  name: '',
  category_id: '',
  price: '',
  offer_price: '',
  stock: '',
  description: '',
  status: 'published',
  is_featured: false,
};

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [attributes, setAttributes] = useState({ colors: [], sizes: [], amenities: [], categories: [] });
  const [pagination, setPagination] = useState({ current_page: 1, last_page: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [editingProduct, setEditingProduct] = useState(null);
  
  // Form States
  const [form, setForm] = useState(emptyForm);
  const [variants, setVariants] = useState([]);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);
  const [galleryPreviews, setGalleryPreviews] = useState([]);
  const [error, setError] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
  
  // Delete Modal State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const sortedProducts = useMemo(() => {
    const items = [...products];
    items.sort((a, b) => {
      let aVal = a[sortConfig.key];
      let bVal = b[sortConfig.key];

      if (sortConfig.key.includes('.')) {
        const parts = sortConfig.key.split('.');
        aVal = parts.reduce((o, i) => o?.[i], a);
        bVal = parts.reduce((o, i) => o?.[i], b);
      }

      if (aVal === bVal) return 0;
      const result = aVal < bVal ? -1 : 1;
      return sortConfig.direction === 'asc' ? result : -result;
    });
    return items;
  }, [products, sortConfig]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await api.get('/products', {
        params: {
          per_page: 10,
          current_page: page,
          search: searchTerm || undefined,
          status: statusFilter || undefined,
        },
      });
      setProducts(response.data?.data ?? []);
      setPagination(response.data?.pagination ?? { current_page: 1, last_page: 1, total: 0 });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const fetchAttributes = async () => {
    try {
      const response = await api.get('/admin/get-attributes');
      setAttributes(response.data.data);
    } catch (err) {
      console.error('Failed to fetch attributes', err);
    }
  };

  useEffect(() => {
    fetchAttributes();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [page, searchTerm, statusFilter]);

  const openCreateModal = () => {
    setEditingProduct(null);
    setForm(emptyForm);
    setVariants([]);
    setSelectedAmenities([]);
    setThumbnail(null);
    setThumbnailPreview(null);
    setGalleryImages([]);
    setGalleryPreviews([]);
    setError('');
    setActiveTab('general');
    setModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setForm({
      name: product.name || '',
      category_id: product.category?.id || '',
      price: product.price ?? '',
      offer_price: product.offer_price ?? '',
      stock: product.stock ?? '',
      description: product.description || '',
      status: product.status || 'published',
      is_featured: Boolean(product.is_featured),
    });
    
    // Set variants
    setVariants(product.variants?.map(v => ({
      id: v.id,
      color_id: v.color?.id || '',
      size_id: v.size?.id || '',
      price: v.price || '',
      offer_price: v.offer_price || '',
      stock: v.stock || 0,
      status: v.status || 'published'
    })) || []);

    // Set amenities
    setSelectedAmenities(product.amenities?.map(a => a.id) || []);
    
    // Set thumbnail preview
    setThumbnailPreview(product.thumbnail);
    
    // Set gallery previews
    setGalleryPreviews(product.images?.map(img => img.url) || []);
    setGalleryImages([]);
    setThumbnail(null);

    setError('');
    setActiveTab('general');
    setModalOpen(true);
  };

  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;
    setDeleting(true);
    try {
      await api.delete(`/products/${productToDelete.id}`);
      setDeleteModalOpen(false);
      setProductToDelete(null);
      fetchProducts();
    } catch (err) {
      setError('Failed to delete product');
    } finally {
      setDeleting(false);
    }
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnail(file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  const handleGalleryChange = (e) => {
    const files = Array.from(e.target.files);
    const currentTotal = galleryPreviews.length;
    
    if (currentTotal + files.length > 4) {
      alert("You can only upload a maximum of 4 gallery images total.");
      return;
    }

    const newFiles = [...galleryImages, ...files];
    const newPreviews = [...galleryPreviews, ...files.map(file => URL.createObjectURL(file))];
    
    setGalleryImages(newFiles);
    setGalleryPreviews(newPreviews);
  };

  const removeGalleryImage = (index) => {
    const newFiles = galleryImages.filter((_, i) => i !== index);
    const newPreviews = galleryPreviews.filter((_, i) => i !== index);
    setGalleryImages(newFiles);
    setGalleryPreviews(newPreviews);
  };

  const addVariant = () => {
    setVariants([...variants, { color_id: '', size_id: '', price: '', stock: '', status: 'published' }]);
  };

  const updateVariant = (index, field, value) => {
    const newVariants = [...variants];
    newVariants[index][field] = value;
    setVariants(newVariants);
  };

  const removeVariant = (index) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const toggleAmenity = (id) => {
    setSelectedAmenities(prev => 
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  };

  const buildFormData = () => {
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formData.append(key, key === 'is_featured' ? (value ? '1' : '0') : value);
      }
    });

    if (thumbnail) {
      formData.append('thumbnail', thumbnail);
    }

    galleryImages.forEach(image => {
      formData.append('images[]', image);
    });

    variants.forEach((v, i) => {
      if (v.id) formData.append(`variants[${i}][id]`, v.id);
      formData.append(`variants[${i}][color_id]`, v.color_id);
      formData.append(`variants[${i}][size_id]`, v.size_id);
      formData.append(`variants[${i}][price]`, v.price);
      formData.append(`variants[${i}][stock]`, v.stock);
      formData.append(`variants[${i}][status]`, v.status);
      if (v.offer_price) formData.append(`variants[${i}][offer_price]`, v.offer_price);
    });

    selectedAmenities.forEach(id => {
      formData.append('amenities[]', id);
    });

    return formData;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const payload = buildFormData();
      if (editingProduct) {
        payload.append('_method', 'PUT');
        await api.post(`/products/${editingProduct.id}`, payload, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        await api.post('/products', payload, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }

      setModalOpen(false);
      await fetchProducts();
    } catch (err) {
      const errors = err.response?.data?.errors;
      const firstError = errors ? Object.values(errors).flat()[0] : null;
      setError(firstError || err.response?.data?.message || 'Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-text mb-2">Inventory</h1>
          <p className="text-gray-500 font-medium">Manage your premium product collection.</p>
        </div>
        <button 
          onClick={openCreateModal}
          className="bg-black text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-3 shadow-xl hover:scale-[1.02] transition-all"
        >
          <FiPlus size={20} />
          Add New Product
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4 bg-white p-4 rounded-[2rem] border border-gray-100 shadow-sm">
        <div className="relative flex-1">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search by name or SKU..."
            className="w-full pl-12 pr-4 h-12 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-black/5 text-sm font-medium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <select 
            className="h-12 px-4 bg-gray-50 border-none rounded-xl text-sm font-bold outline-none"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 text-gray-400 text-[10px] font-black uppercase tracking-widest border-b border-gray-50">
                <SortableHeader label="Product" sortKey="name" currentSort={sortConfig} onSort={handleSort} className="px-8" />
                <SortableHeader label="Category" sortKey="category.name" currentSort={sortConfig} onSort={handleSort} className="px-8" />
                <SortableHeader label="Price" sortKey="price" currentSort={sortConfig} onSort={handleSort} className="px-8" />
                <SortableHeader label="Stock" sortKey="stock" currentSort={sortConfig} onSort={handleSort} className="px-8" />
                <SortableHeader label="Status" sortKey="status" currentSort={sortConfig} onSort={handleSort} className="px-8" />
                <th className="px-8 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Loading Inventory...</span>
                    </div>
                  </td>
                </tr>
              ) : sortedProducts.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-8 py-20 text-center text-gray-400 italic">No products found.</td>
                </tr>
              ) : (
                sortedProducts.map((product) => (
                  <tr key={product.id} className="group hover:bg-gray-50/50 transition-colors">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-gray-100 overflow-hidden shrink-0 border border-gray-100">
                          <img 
                            src={product.thumbnail || 'https://via.placeholder.com/100'} 
                            alt={product.name} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900 leading-tight">{product.name}</p>
                          <p className="text-[10px] text-gray-400 font-mono mt-1">{product.sku || 'NO-SKU'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className="text-xs font-bold text-gray-500 bg-gray-100 px-3 py-1 rounded-lg">
                        {product.category?.name || 'Uncategorized'}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-gray-900">${product.price}</span>
                        {product.offer_price && <span className="text-[10px] text-red-500 line-through font-bold">${product.offer_price}</span>}
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${product.stock > 10 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        <span className="text-sm font-bold text-gray-700">{product.stock || 0}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        product.status === 'published' ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'
                      }`}>
                        {product.status}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => openEditModal(product)}
                          className="p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-xl transition-all"
                        >
                          <FiEdit2 size={18} />
                        </button>
                          <button 
                            onClick={() => handleDeleteClick(product)}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
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

      {/* Product Form Modal */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-5xl bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Modal Header */}
              <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                <div>
                  <h2 className="text-2xl font-black text-text">
                    {editingProduct ? 'Update Masterpiece' : 'New Creation'}
                  </h2>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Product Studio</p>
                </div>
                <button onClick={() => setModalOpen(false)} className="p-3 hover:bg-gray-200 rounded-full transition-all">
                  <FiX size={24} />
                </button>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-gray-50 px-8 bg-gray-50/30">
                {[
                  { id: 'general', icon: <FiInfo />, label: 'General' },
                  { id: 'media', icon: <FiImage />, label: 'Media' },
                  { id: 'variants', icon: <FiLayers />, label: 'Variants' },
                  { id: 'amenities', icon: <FiCheckCircle />, label: 'Amenities' },
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-6 py-4 text-sm font-black transition-all border-b-2 ${
                      activeTab === tab.id 
                        ? 'border-black text-black' 
                        : 'border-transparent text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Form Content */}
              <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-8">
                {error && (
                  <div className="bg-red-50 text-red-600 p-4 rounded-2xl border border-red-100 text-sm font-bold">
                    {error}
                  </div>
                )}

                {/* General Tab */}
                {activeTab === 'general' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Product Name</label>
                        <input 
                          type="text" 
                          name="name"
                          required
                          value={form.name}
                          onChange={handleFormChange}
                          placeholder="e.g. Minimalist Urban Hoodie"
                          className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-black/5 transition-all text-sm font-bold"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Base Price ($)</label>
                          <input 
                            type="number" 
                            name="price"
                            required
                            value={form.price}
                            onChange={handleFormChange}
                            placeholder="0.00"
                            className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-black/5 transition-all text-sm font-bold"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Offer Price ($)</label>
                          <input 
                            type="number" 
                            name="offer_price"
                            value={form.offer_price}
                            onChange={handleFormChange}
                            placeholder="Optional"
                            className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-black/5 transition-all text-sm font-bold"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Category</label>
                          <select 
                            name="category_id"
                            required
                            value={form.category_id}
                            onChange={handleFormChange}
                            className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-black/5 transition-all text-sm font-bold outline-none"
                          >
                            <option value="">Select Category</option>
                            {attributes.categories.map(cat => (
                              <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Total Stock</label>
                          <input 
                            type="number" 
                            name="stock"
                            required
                            value={form.stock}
                            onChange={handleFormChange}
                            placeholder="Inventory count"
                            className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-black/5 transition-all text-sm font-bold"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Description</label>
                        <textarea 
                          name="description"
                          rows="6"
                          value={form.description}
                          onChange={handleFormChange}
                          placeholder="Tell the story behind this product..."
                          className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-black/5 transition-all text-sm font-bold resize-none"
                        />
                      </div>
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                        <div className="flex items-center gap-3">
                          <FiCheckCircle className={form.is_featured ? 'text-primary' : 'text-gray-300'} />
                          <span className="text-sm font-bold text-gray-700">Featured Product</span>
                        </div>
                        <input 
                          type="checkbox" 
                          name="is_featured"
                          checked={form.is_featured}
                          onChange={handleFormChange}
                          className="w-5 h-5 accent-black cursor-pointer"
                        />
                      </div>
                      <div className="flex gap-2">
                        {['published', 'draft'].map(s => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => setForm({ ...form, status: s })}
                            className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                              form.status === s ? 'bg-black text-white shadow-lg' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                            }`}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Media Tab */}
                {activeTab === 'media' && (
                  <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      {/* Thumbnail Upload */}
                      <div className="space-y-4">
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">Primary Thumbnail</label>
                        <div 
                          className="relative aspect-square bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-200 flex flex-col items-center justify-center overflow-hidden group cursor-pointer hover:border-black transition-all"
                          onClick={() => document.getElementById('thumbnail-input').click()}
                        >
                          {thumbnailPreview ? (
                            <>
                              <img src={thumbnailPreview} className="w-full h-full object-cover" alt="Preview" />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                                <span className="text-white text-xs font-bold uppercase tracking-widest">Change Photo</span>
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-gray-400 mb-3 group-hover:scale-110 transition-transform">
                                <FiPlus size={24} />
                              </div>
                              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Click to upload</span>
                            </>
                          )}
                          <input 
                            id="thumbnail-input" 
                            type="file" 
                            hidden 
                            onChange={handleThumbnailChange} 
                            accept="image/*"
                          />
                        </div>
                      </div>

                      {/* Gallery Upload */}
                      <div className="md:col-span-2 space-y-4">
                        <div className="flex justify-between items-center">
                          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">Gallery Images (Max 4)</label>
                          <span className="text-[10px] font-black text-primary uppercase">{galleryImages.length}/4</span>
                        </div>
                        <div className="grid grid-cols-4 gap-4">
                          {galleryPreviews.map((preview, i) => (
                            <div key={i} className="relative aspect-square rounded-2xl overflow-hidden border border-gray-100 group">
                              <img src={preview} className="w-full h-full object-cover" />
                              <button 
                                type="button"
                                onClick={() => removeGalleryImage(i)}
                                className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all shadow-lg"
                              >
                                <FiTrash2 size={14} />
                              </button>
                            </div>
                          ))}
                          {galleryPreviews.length < 4 && (
                            <div 
                              onClick={() => document.getElementById('gallery-input').click()}
                              className="aspect-square bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:border-black transition-all group"
                            >
                              <FiPlus className="text-gray-300 group-hover:text-black transition-colors" size={24} />
                              <input 
                                id="gallery-input" 
                                type="file" 
                                hidden 
                                multiple 
                                onChange={handleGalleryChange}
                                accept="image/*"
                              />
                            </div>
                          )}
                        </div>
                        <p className="text-[10px] text-gray-400 font-medium italic">* Best quality: 1000x1000px square images.</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Variants Tab */}
                {activeTab === 'variants' && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-lg font-black text-text">Product Customization</h3>
                        <p className="text-xs text-gray-400 font-medium">Add colors and sizes with specific pricing and stock.</p>
                      </div>
                      <button 
                        type="button" 
                        onClick={addVariant}
                        className="bg-black text-white px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2"
                      >
                        <FiPlus /> Add Variant
                      </button>
                    </div>

                    <div className="space-y-4">
                      {variants.length === 0 ? (
                        <div className="bg-gray-50 py-12 rounded-[2rem] border-2 border-dashed border-gray-100 flex flex-col items-center justify-center text-gray-400">
                          <FiLayers size={40} className="mb-4 opacity-20" />
                          <p className="text-sm font-bold">No variants added. Start by adding one!</p>
                        </div>
                      ) : (
                        variants.map((v, i) => (
                          <div key={i} className="bg-gray-50 p-6 rounded-[2rem] border border-gray-100 grid grid-cols-1 md:grid-cols-6 gap-4 items-end animate-in fade-in slide-in-from-bottom-2">
                            <div className="md:col-span-1">
                              <label className="block text-[9px] font-black text-gray-400 uppercase mb-2">Color</label>
                              <select 
                                value={v.color_id}
                                onChange={(e) => updateVariant(i, 'color_id', e.target.value)}
                                className="w-full h-12 px-4 bg-white border-none rounded-xl text-xs font-bold outline-none"
                              >
                                <option value="">None</option>
                                {attributes.colors.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                              </select>
                            </div>
                            <div className="md:col-span-1">
                              <label className="block text-[9px] font-black text-gray-400 uppercase mb-2">Size</label>
                              <select 
                                value={v.size_id}
                                onChange={(e) => updateVariant(i, 'size_id', e.target.value)}
                                className="w-full h-12 px-4 bg-white border-none rounded-xl text-xs font-bold outline-none"
                              >
                                <option value="">None</option>
                                {attributes.sizes.map(s => <option key={s.id} value={s.id}>{s.name} {s.short && `(${s.short})`}</option>)}
                              </select>
                            </div>
                            <div className="md:col-span-1">
                              <label className="block text-[9px] font-black text-gray-400 uppercase mb-2">Variant Price</label>
                              <input 
                                type="number" 
                                value={v.price}
                                onChange={(e) => updateVariant(i, 'price', e.target.value)}
                                placeholder="0.00"
                                className="w-full h-12 px-4 bg-white border-none rounded-xl text-xs font-bold outline-none"
                              />
                            </div>
                            <div className="md:col-span-1">
                              <label className="block text-[9px] font-black text-gray-400 uppercase mb-2">Offer Price</label>
                              <input 
                                type="number" 
                                value={v.offer_price}
                                onChange={(e) => updateVariant(i, 'offer_price', e.target.value)}
                                placeholder="Optional"
                                className="w-full h-12 px-4 bg-white border-none rounded-xl text-xs font-bold outline-none"
                              />
                            </div>
                            <div className="md:col-span-1">
                              <label className="block text-[9px] font-black text-gray-400 uppercase mb-2">Stock</label>
                              <input 
                                type="number" 
                                value={v.stock}
                                onChange={(e) => updateVariant(i, 'stock', e.target.value)}
                                placeholder="Qty"
                                className="w-full h-12 px-4 bg-white border-none rounded-xl text-xs font-bold outline-none"
                              />
                            </div>
                            <div className="md:col-span-1 flex gap-2">
                              <button 
                                type="button" 
                                onClick={() => removeVariant(i)}
                                className="h-12 w-full bg-red-50 text-red-500 rounded-xl flex items-center justify-center hover:bg-red-500 hover:text-white transition-all"
                              >
                                <FiTrash2 size={18} />
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}

                {/* Amenities Tab */}
                {activeTab === 'amenities' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-black text-text">Product Amenities</h3>
                      <p className="text-xs text-gray-400 font-medium">Select features or what's included with the product.</p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {attributes.amenities.map(amenity => (
                        <div 
                          key={amenity.id}
                          onClick={() => toggleAmenity(amenity.id)}
                          className={`flex items-center gap-3 p-4 rounded-2xl cursor-pointer border-2 transition-all ${
                            selectedAmenities.includes(amenity.id)
                              ? 'bg-black text-white border-black shadow-lg shadow-black/10'
                              : 'bg-white text-gray-500 border-gray-100 hover:border-gray-200'
                          }`}
                        >
                          <div className={`w-5 h-5 rounded-md flex items-center justify-center ${
                            selectedAmenities.includes(amenity.id) ? 'bg-white text-black' : 'bg-gray-100'
                          }`}>
                            {selectedAmenities.includes(amenity.id) && <FiCheckCircle size={14} />}
                          </div>
                          <span className="text-xs font-black uppercase tracking-wider">{amenity.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </form>

              {/* Modal Footer */}
              <div className="p-8 border-t border-gray-50 bg-gray-50/50 flex justify-between items-center">
                <div className="flex gap-2">
                  {['general', 'media', 'variants', 'amenities'].map((tab, i) => (
                    <div 
                      key={tab}
                      className={`w-2 h-2 rounded-full transition-all ${
                        activeTab === tab ? 'w-8 bg-black' : 'bg-gray-200'
                      }`}
                    />
                  ))}
                </div>
                <div className="flex gap-4">
                  <button 
                    type="button" 
                    onClick={() => setModalOpen(false)}
                    className="px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest text-gray-400 hover:text-text transition-colors"
                  >
                    Discard
                  </button>
                  <button 
                    onClick={handleSubmit}
                    disabled={saving}
                    className="bg-black text-white px-10 py-3 rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-black/20 hover:scale-[1.05] active:scale-[0.95] transition-all disabled:opacity-50 flex items-center gap-3"
                  >
                    {saving ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Preserving...
                      </>
                    ) : (
                      <>
                        <FiCheckCircle size={18} />
                        {editingProduct ? 'Save Changes' : 'Confirm Product'}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <DeleteConfirmModal 
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        itemName={productToDelete?.name}
        loading={deleting}
      />
    </div>
  );
};

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, itemName, loading }) => {
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
        <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <FiTrash size={36} />
        </div>
        <h3 className="text-2xl font-black text-text mb-2">Are you sure?</h3>
        <p className="text-gray-500 text-sm font-medium mb-8">
          You are about to delete <span className="text-black font-bold">"{itemName}"</span>. This action cannot be undone and will remove all variants and images.
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

export default AdminProducts;

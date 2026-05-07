import React, { useEffect, useMemo, useState } from 'react';
import { FiEdit2, FiFilter, FiPackage, FiPlus, FiSearch, FiTrash2, FiX } from 'react-icons/fi';
import api from '../../services/api';
import SortableHeader from '../../components/admin/SortableHeader';

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
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({ current_page: 1, last_page: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [images, setImages] = useState([]);
  const [error, setError] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });

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
          per_page: 12,
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

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      setCategories(response.data?.data ?? response.data ?? []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch categories');
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [page, searchTerm, statusFilter]);

  const filteredProducts = useMemo(() => products, [products]);

  const openCreateModal = () => {
    setEditingProduct(null);
    setForm(emptyForm);
    setImages([]);
    setError('');
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
    setImages([]);
    setError('');
    setModalOpen(true);
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const buildFormData = () => {
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formData.append(key, key === 'is_featured' ? (value ? '1' : '0') : value);
      }
    });
    images.forEach(image => formData.append('images[]', image));
    return formData;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
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

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;

    try {
      await api.delete(`/products/${id}`);
      setProducts(prev => prev.filter(product => product.id !== id));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete product');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-500 text-sm">Manage product inventory, pricing, status, and images.</p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center justify-center gap-2 bg-black text-white px-4 py-2.5 rounded-xl font-bold hover:bg-gray-800 transition-colors"
        >
          <FiPlus size={20} />
          Add Product
        </button>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or SKU..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-black/5 text-sm"
            value={searchTerm}
            onChange={(event) => {
              setPage(1);
              setSearchTerm(event.target.value);
            }}
          />
        </div>
        <div className="flex items-center gap-2 px-4 py-2 border border-gray-100 rounded-xl text-sm font-semibold">
          <FiFilter size={18} />
          <select
            value={statusFilter}
            onChange={(event) => {
              setPage(1);
              setStatusFilter(event.target.value);
            }}
            className="bg-transparent outline-none"
          >
            <option value="">All statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>
      </div>

      {error && <div className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">{error}</div>}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50/50 text-gray-500 text-xs font-semibold uppercase">
              <tr>
                <SortableHeader label="Product" sortKey="name" currentSort={sortConfig} onSort={handleSort} />
                <SortableHeader label="Category" sortKey="category.name" currentSort={sortConfig} onSort={handleSort} />
                <SortableHeader label="Price" sortKey="price" currentSort={sortConfig} onSort={handleSort} />
                <SortableHeader label="Stock" sortKey="stock" currentSort={sortConfig} onSort={handleSort} />
                <SortableHeader label="Status" sortKey="status" currentSort={sortConfig} onSort={handleSort} />
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-10 text-center">
                    <div className="mx-auto w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-10 text-center text-gray-500">No products found.</td>
                </tr>
              ) : (
                sortedProducts.map(product => (
                  <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden border border-gray-100">
                          {product.thumbnail || product.primary_image?.image_path ? (
                            <img src={product.thumbnail || product.primary_image.image_path} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300">
                              <FiPackage size={20} />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900">{product.name}</p>
                          <p className="text-xs text-gray-500 uppercase tracking-wider">{product.sku || 'No SKU'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{product.category?.name || 'Uncategorized'}</td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-gray-900">${Number(product.offer_price || product.price || 0).toFixed(2)}</p>
                      {product.offer_price && <p className="text-xs text-gray-400 line-through">${Number(product.price || 0).toFixed(2)}</p>}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-2 text-sm font-medium ${Number(product.stock) > 0 ? 'text-green-600' : 'text-red-500'}`}>
                        <span className={`w-2 h-2 rounded-full ${Number(product.stock) > 0 ? 'bg-green-500' : 'bg-red-500'}`}></span>
                        {product.stock ?? 0}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-bold uppercase px-2 py-1 rounded-full ${product.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                        {product.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openEditModal(product)} className="p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-lg transition-colors">
                          <FiEdit2 size={16} />
                        </button>
                        <button onClick={() => handleDelete(product.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
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
      </div>

      {pagination.last_page > 1 && (
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>{pagination.total} products</span>
          <div className="flex gap-2">
            <button disabled={page <= 1} onClick={() => setPage(page - 1)} className="px-4 py-2 rounded-xl border disabled:opacity-40">Previous</button>
            <span className="px-4 py-2 font-bold text-gray-900">Page {pagination.current_page} of {pagination.last_page}</span>
            <button disabled={page >= pagination.last_page} onClick={() => setPage(page + 1)} className="px-4 py-2 rounded-xl border disabled:opacity-40">Next</button>
          </div>
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8 shadow-2xl">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold">{editingProduct ? 'Edit Product' : 'Add Product'}</h2>
              <button onClick={() => setModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
                <FiX size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
              <label className="col-span-2">
                <span className="block text-sm font-semibold mb-2">Product Name</span>
                <input name="name" required value={form.name} onChange={handleChange} className="w-full h-12 px-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black/5 outline-none" />
              </label>

              <label>
                <span className="block text-sm font-semibold mb-2">Category</span>
                <select name="category_id" required value={form.category_id} onChange={handleChange} className="w-full h-12 px-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black/5 outline-none bg-white">
                  <option value="">Select Category</option>
                  {categories.map(category => <option key={category.id} value={category.id}>{category.name}</option>)}
                </select>
              </label>

              <label>
                <span className="block text-sm font-semibold mb-2">Status</span>
                <select name="status" value={form.status} onChange={handleChange} className="w-full h-12 px-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black/5 outline-none bg-white">
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </label>

              <label>
                <span className="block text-sm font-semibold mb-2">Price</span>
                <input name="price" type="number" step="0.01" required value={form.price} onChange={handleChange} className="w-full h-12 px-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black/5 outline-none" />
              </label>

              <label>
                <span className="block text-sm font-semibold mb-2">Offer Price</span>
                <input name="offer_price" type="number" step="0.01" value={form.offer_price} onChange={handleChange} className="w-full h-12 px-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black/5 outline-none" />
              </label>

              <label>
                <span className="block text-sm font-semibold mb-2">Stock</span>
                <input name="stock" type="number" min="0" value={form.stock} onChange={handleChange} className="w-full h-12 px-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black/5 outline-none" />
              </label>

              <label className="flex items-center gap-3 pt-8">
                <input name="is_featured" type="checkbox" checked={form.is_featured} onChange={handleChange} className="w-4 h-4 rounded border-gray-300" />
                <span className="text-sm font-semibold">Featured product</span>
              </label>

              <label className="col-span-2">
                <span className="block text-sm font-semibold mb-2">Images</span>
                <input type="file" multiple accept="image/*" onChange={(event) => setImages(Array.from(event.target.files))} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-black file:text-white hover:file:bg-gray-800" />
              </label>

              <label className="col-span-2">
                <span className="block text-sm font-semibold mb-2">Description</span>
                <textarea name="description" rows="4" value={form.description} onChange={handleChange} className="w-full p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black/5 outline-none resize-none"></textarea>
              </label>

              <div className="col-span-2 pt-4">
                <button type="submit" disabled={saving} className="w-full h-14 bg-black text-white rounded-2xl font-bold hover:bg-gray-800 transition-shadow shadow-lg disabled:opacity-50">
                  {saving ? 'Saving...' : editingProduct ? 'Update Product' : 'Save Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;

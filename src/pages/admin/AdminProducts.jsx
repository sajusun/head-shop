import React, { useEffect, useState } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiFilter } from 'react-icons/fi';
import api from '../../services/api';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const [showAddModal, setShowAddModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    category_id: '',
    price: '',
    offer_price: '',
    stock: '',
    description: '',
    status: 'active'
  });
  const [images, setImages] = useState([]);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products');
      setProducts(response.data.data);
    } catch (error) {
      console.error('Failed to fetch products', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      setCategories(response.data.data || response.data);
    } catch (error) {
      console.error('Failed to fetch categories', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setImages(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(newProduct).forEach(key => {
      formData.append(key, newProduct[key]);
    });
    images.forEach((image) => {
      formData.append('images[]', image);
    });

    try {
      await api.post('/products', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setShowAddModal(false);
      fetchProducts();
      setNewProduct({
        name: '',
        category_id: '',
        price: '',
        offer_price: '',
        stock: '',
        description: '',
        status: 'active'
      });
      setImages([]);
    } catch (error) {
      console.error('Failed to create product', error);
      alert('Failed to create product. Check console for details.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.delete(`/products/${id}`);
        setProducts(products.filter(p => p.id !== id));
      } catch (error) {
        alert('Failed to delete product');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-500 text-sm">Manage your store inventory and variations.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center justify-center space-x-2 bg-black text-white px-4 py-2.5 rounded-xl font-bold hover:bg-gray-800 transition-colors"
        >
          <FiPlus size={20} />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold">Add New Product</h2>
              <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-gray-100 rounded-full">
                <FiPlus className="rotate-45" size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
              <div className="col-span-2">
                <label className="block text-sm font-semibold mb-2">Product Name</label>
                <input name="name" required value={newProduct.name} onChange={handleInputChange} className="w-full h-12 px-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black/5 outline-none" placeholder="e.g. Vintage Leather Jacket" />
              </div>
              
              <div>
                <label className="block text-sm font-semibold mb-2">Category</label>
                <select 
                  name="category_id" 
                  required 
                  value={newProduct.category_id} 
                  onChange={handleInputChange} 
                  className="w-full h-12 px-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black/5 outline-none bg-white"
                >
                  <option value="">Select Category</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Stock</label>
                <input name="stock" type="number" required value={newProduct.stock} onChange={handleInputChange} className="w-full h-12 px-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black/5 outline-none" placeholder="0" />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Price ($)</label>
                <input name="price" type="number" step="0.01" required value={newProduct.price} onChange={handleInputChange} className="w-full h-12 px-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black/5 outline-none" placeholder="0.00" />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Offer Price ($)</label>
                <input name="offer_price" type="number" step="0.01" value={newProduct.offer_price} onChange={handleInputChange} className="w-full h-12 px-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black/5 outline-none" placeholder="0.00" />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-semibold mb-2">Images</label>
                <input type="file" multiple onChange={handleImageChange} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-black file:text-white hover:file:bg-gray-800" />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-semibold mb-2">Description</label>
                <textarea name="description" rows="4" value={newProduct.description} onChange={handleInputChange} className="w-full p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black/5 outline-none resize-none" placeholder="Product details..."></textarea>
              </div>

              <div className="col-span-2 pt-4">
                <button type="submit" className="w-full h-14 bg-black text-white rounded-2xl font-bold hover:bg-gray-800 transition-shadow shadow-lg hover:shadow-black/20">
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search by name or SKU..." 
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-black/5 text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="flex items-center justify-center space-x-2 px-4 py-2 border border-gray-100 rounded-xl text-sm font-semibold hover:bg-gray-50">
          <FiFilter size={18} />
          <span>Filters</span>
        </button>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50/50 text-gray-500 text-xs font-semibold uppercase">
              <tr>
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Stock</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-10 text-center">
                    <div className="flex justify-center">
                      <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-10 text-center text-gray-500">No products found.</td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden border border-gray-100">
                          {product.primary_image ? (
                            <img src={product.primary_image.image_path} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300">
                              <FiPackage size={20} />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900">{product.name}</p>
                          <p className="text-xs text-gray-500 uppercase tracking-wider">{product.sku}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600">{product.category?.name || 'Uncategorized'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-gray-900">${product.offer_price || product.price}</p>
                      {product.offer_price && (
                        <p className="text-xs text-gray-400 line-through">${product.price}</p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <span className={`w-2 h-2 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`}></span>
                        <span className="text-sm text-gray-600 font-medium">{product.stock} in stock</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button className="p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-lg transition-colors">
                          <FiEdit2 size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(product.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
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
    </div>
  );
};

export default AdminProducts;

import React, { useEffect, useState } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiEye, FiMessageSquare, FiX, FiSearch, FiFilter } from 'react-icons/fi';
import api from '../../services/api';
import SortableHeader from '../../components/admin/SortableHeader';
import Pagination from '../../components/admin/Pagination';

const emptyForm = {
  title: '',
  category_id: '',
  excerpt: '',
  content: '',
  status: 'published',
};

const AdminBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [pagination, setPagination] = useState({ current_page: 1, last_page: 1, total: 0 });
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  useEffect(() => {
    fetchBlogs();
    fetchCategories();
  }, [page, perPage, searchTerm, statusFilter]);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/blogs', {
        params: {
          per_page: perPage,
          page: page,
          search: searchTerm || undefined,
          status: statusFilter || undefined,
        },
      });
      setBlogs(response.data.data);
      setPagination(response.data.pagination || { current_page: 1, last_page: 1, total: 0 });
    } catch (error) {
      console.error('Failed to fetch blogs', error);
      setError('Failed to fetch blogs');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories', { params: { type: 'blog' } });
      setCategories(response.data.data);
    } catch (error) {
      console.error('Failed to fetch categories', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await api.delete(`/blogs/${id}`);
        setBlogs(blogs.filter(b => b.id !== id));
      } catch (error) {
        alert('Failed to delete blog');
      }
    }
  };

  const openCreateModal = () => {
    setEditingBlog(null);
    setForm(emptyForm);
    setImage(null);
    setError('');
    setModalOpen(true);
  };

  const openEditModal = (blog) => {
    setEditingBlog(blog);
    setForm({
      title: blog.title || '',
      category_id: blog.category_id || '',
      excerpt: blog.excerpt || '',
      content: blog.content || '',
      status: blog.status || 'published',
    });
    setImage(null);
    setError('');
    setModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      formData.append(key, value);
    });
    if (image) {
      formData.append('featured_image', image);
    }

    try {
      if (editingBlog) {
        formData.append('_method', 'PUT');
        await api.post(`/blogs/${editingBlog.id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        await api.post('/blogs', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }
      setModalOpen(false);
      fetchBlogs();
    } catch (error) {
      const errors = error.response?.data?.errors;
      const firstError = errors ? Object.values(errors).flat()[0] : null;
      setError(firstError || error.response?.data?.message || 'Failed to save blog');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Journal Management</h1>
          <p className="text-gray-500 text-sm">Create and manage your blog posts and articles.</p>
        </div>
        <button 
          onClick={openCreateModal}
          className="flex items-center justify-center space-x-2 bg-black text-white px-4 py-2.5 rounded-xl font-bold hover:bg-gray-800 transition-colors shadow-sm"
        >
          <FiPlus size={20} />
          <span>New Article</span>
        </button>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search articles..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-black/5 text-sm"
            value={searchTerm}
            onChange={(e) => {
              setPage(1);
              setSearchTerm(e.target.value);
            }}
          />
        </div>
        <div className="flex items-center gap-2 px-4 py-2 border border-gray-100 rounded-xl text-sm font-semibold">
          <FiFilter size={18} />
          <select
            value={statusFilter}
            onChange={(e) => {
              setPage(1);
              setStatusFilter(e.target.value);
            }}
            className="bg-transparent outline-none"
          >
            <option value="">All statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : blogs.length === 0 ? (
          <div className="col-span-full text-center py-20 text-gray-500 bg-white rounded-3xl border border-dashed border-gray-200">
            No articles found. Start by creating your first post!
          </div>
        ) : (
          blogs.map((blog) => (
            <div key={blog.id} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow group">
              <div className="h-48 bg-gray-100 relative overflow-hidden">
                <img 
                  src={blog.featured_image || 'https://via.placeholder.com/400x300'} 
                  alt={blog.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4 flex gap-2">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                    blog.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {blog.status}
                  </span>
                </div>
                <div className="absolute top-4 left-4">
                  <span className="bg-black/50 backdrop-blur-md text-white px-3 py-1 rounded-full text-[10px] font-bold">
                    {blog.category?.name || 'Uncategorized'}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 min-h-[3rem]">{blog.title}</h3>
                <p className="text-sm text-gray-500 mb-4 line-clamp-2">{blog.excerpt}</p>
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                  <div className="flex items-center space-x-4 text-gray-400 text-xs">
                    <div className="flex items-center space-x-1">
                      <FiEye />
                      <span>{blog.views_count || 0}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <FiMessageSquare />
                      <span>{blog.comments_count || 0}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => openEditModal(blog)}
                      className="p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <FiEdit2 size={16} />
                    </button>
                    <button 
                      onClick={() => handleDelete(blog.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <Pagination 
        pagination={pagination} 
        onPageChange={setPage} 
        onPerPageChange={setPerPage}
      />

      {modalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
            <div className="flex items-center justify-between p-8 border-b border-gray-50">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{editingBlog ? 'Edit Article' : 'Create New Article'}</h2>
                <p className="text-sm text-gray-500">Share your thoughts with your audience.</p>
              </div>
              <button onClick={() => setModalOpen(false)} className="p-3 hover:bg-gray-100 rounded-2xl transition-colors">
                <FiX size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-6">
              {error && (
                <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-medium border border-red-100">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <label className="col-span-full">
                  <span className="block text-sm font-bold text-gray-700 mb-2">Article Title</span>
                  <input 
                    name="title" 
                    required 
                    value={form.title} 
                    onChange={handleChange} 
                    placeholder="Enter a catchy title..."
                    className="w-full h-14 px-6 rounded-2xl border border-gray-200 focus:ring-4 focus:ring-black/5 focus:border-black outline-none transition-all text-lg font-medium" 
                  />
                </label>

                <label>
                  <span className="block text-sm font-bold text-gray-700 mb-2">Category</span>
                  <select 
                    name="category_id" 
                    required 
                    value={form.category_id} 
                    onChange={handleChange} 
                    className="w-full h-14 px-6 rounded-2xl border border-gray-200 focus:ring-4 focus:ring-black/5 focus:border-black outline-none bg-white transition-all"
                  >
                    <option value="">Select Category</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                  </select>
                </label>

                <label>
                  <span className="block text-sm font-bold text-gray-700 mb-2">Status</span>
                  <select 
                    name="status" 
                    value={form.status} 
                    onChange={handleChange} 
                    className="w-full h-14 px-6 rounded-2xl border border-gray-200 focus:ring-4 focus:ring-black/5 focus:border-black outline-none bg-white transition-all"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </label>

                <label className="col-span-full">
                  <span className="block text-sm font-bold text-gray-700 mb-2">Featured Image</span>
                  <div className="relative group">
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={(e) => setImage(e.target.files[0])} 
                      className="hidden" 
                      id="blog-image-upload"
                    />
                    <label 
                      htmlFor="blog-image-upload"
                      className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-200 rounded-3xl cursor-pointer group-hover:border-black group-hover:bg-gray-50 transition-all overflow-hidden"
                    >
                      {image ? (
                        <img src={URL.createObjectURL(image)} alt="Preview" className="w-full h-full object-cover" />
                      ) : editingBlog?.featured_image ? (
                        <img src={editingBlog.featured_image} alt="Current" className="w-full h-full object-cover" />
                      ) : (
                        <div className="text-center">
                          <FiPlus className="mx-auto text-gray-400 mb-2" size={24} />
                          <span className="text-sm text-gray-500 font-medium">Click to upload image</span>
                        </div>
                      )}
                    </label>
                  </div>
                </label>

                <label className="col-span-full">
                  <span className="block text-sm font-bold text-gray-700 mb-2">Excerpt</span>
                  <textarea 
                    name="excerpt" 
                    rows="2" 
                    value={form.excerpt} 
                    onChange={handleChange} 
                    placeholder="Short summary for the article list..."
                    className="w-full p-6 rounded-2xl border border-gray-200 focus:ring-4 focus:ring-black/5 focus:border-black outline-none resize-none transition-all"
                  ></textarea>
                </label>

                <label className="col-span-full">
                  <span className="block text-sm font-bold text-gray-700 mb-2">Content (HTML)</span>
                  <textarea 
                    name="content" 
                    rows="8" 
                    required 
                    value={form.content} 
                    onChange={handleChange} 
                    placeholder="Write your article content here... (HTML supported)"
                    className="w-full p-6 rounded-2xl border border-gray-200 focus:ring-4 focus:ring-black/5 focus:border-black outline-none resize-none transition-all font-mono text-sm"
                  ></textarea>
                </label>
              </div>
            </form>

            <div className="p-8 border-t border-gray-50 bg-gray-50/50">
              <button 
                type="submit" 
                onClick={handleSubmit}
                disabled={saving} 
                className="w-full h-14 bg-black text-white rounded-2xl font-bold hover:bg-gray-800 transition-all shadow-lg shadow-black/10 disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                {saving ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <span>{editingBlog ? 'Update Article' : 'Publish Article'}</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBlogs;

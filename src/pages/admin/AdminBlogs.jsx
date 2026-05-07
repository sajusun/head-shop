import React, { useEffect, useState } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiEye, FiMessageSquare } from 'react-icons/fi';
import api from '../../services/api';

const AdminBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await api.get('/blogs');
      setBlogs(response.data.data);
    } catch (error) {
      console.error('Failed to fetch blogs', error);
    } finally {
      setLoading(false);
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Journal Management</h1>
          <p className="text-gray-500 text-sm">Create and manage your blog posts.</p>
        </div>
        <button className="flex items-center justify-center space-x-2 bg-black text-white px-4 py-2.5 rounded-xl font-bold hover:bg-gray-800 transition-colors">
          <FiPlus size={20} />
          <span>New Article</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : blogs.length === 0 ? (
          <div className="col-span-full text-center py-20 text-gray-500">No articles found.</div>
        ) : (
          blogs.map((blog) => (
            <div key={blog.id} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow group">
              <div className="h-48 bg-gray-100 relative overflow-hidden">
                <img 
                  src={blog.featured_image || 'https://via.placeholder.com/400x300'} 
                  alt={blog.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                    blog.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {blog.status}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">{blog.title}</h3>
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
                    <button className="p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-lg">
                      <FiEdit2 size={16} />
                    </button>
                    <button 
                      onClick={() => handleDelete(blog.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
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
    </div>
  );
};

export default AdminBlogs;

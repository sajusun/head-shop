import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Calendar, User, Clock, ArrowRight, Tag, Loader2, CheckCircle } from 'lucide-react';
import api from '../services/api';

const BlogPage = () => {
  // All Hooks must be at the top level
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [email, setEmail] = useState('');
  const [subscribing, setSubscribing] = useState(false);
  const [subscribeStatus, setSubscribeStatus] = useState(null);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await api.get('/blogs');
      setBlogs(response.data.data || []);
    } catch (err) {
      console.error('Error fetching blogs:', err);
      setError('Failed to load stories. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;

    setSubscribing(true);
    setSubscribeStatus(null);
    try {
      await api.post('/newsletter/subscribe', { email });
      setSubscribeStatus('success');
      setEmail('');
    } catch (err) {
      setSubscribeStatus('error');
    } finally {
      setSubscribing(false);
    }
  };

  // Early returns come AFTER all hooks
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <p className="text-red-500 font-bold mb-4">{error}</p>
        <button 
          onClick={fetchBlogs}
          className="px-6 py-2 bg-primary text-white rounded-xl font-bold"
        >
          Try Again
        </button>
      </div>
    );
  }

  const featuredPost = blogs[0];
  const otherPosts = blogs.slice(1);

  return (
    <div className="min-h-screen pt-20 pb-32">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Header */}
        <div className="text-center mb-24">
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-primary font-black uppercase tracking-[0.3em] text-sm mb-4"
          >
            The Journal
          </motion.p>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-7xl font-black text-text tracking-tighter mb-8"
          >
            Stories & <span className="text-primary">Insights</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-500 text-xl max-w-2xl mx-auto font-medium"
          >
            Exploring the intersection of design, lifestyle, and sustainable craftsmanship.
          </motion.p>
        </div>

        {featuredPost ? (
          <>
            {/* Featured Post */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative rounded-[40px] overflow-hidden mb-24 aspect-[21/9] group cursor-pointer"
            >
              <img 
                src={featuredPost.featured_image || "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&q=80&w=1200"} 
                alt={featuredPost.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8 md:p-16">
                <div className="max-w-3xl">
                  <span className="px-4 py-2 bg-primary text-white text-xs font-black uppercase tracking-widest rounded-full mb-6 inline-block">
                    {featuredPost.category?.name || 'Journal'}
                  </span>
                  <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-6 group-hover:text-primary transition-colors">
                    {featuredPost.title}
                  </h2>
                  <div className="flex flex-wrap items-center gap-6 text-white/70 text-sm font-bold">
                    <span className="flex items-center gap-2"><User size={16} /> {featuredPost.author?.name || 'Admin'}</span>
                    <span className="flex items-center gap-2">
                      <Calendar size={16} /> {new Date(featuredPost.published_at || featuredPost.created_at).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-2"><Clock size={16} /> 5 min read</span>
                  </div>
                </div>
              </div>
              <Link to={`/journal/${featuredPost.slug}`} className="absolute inset-0 z-10" />
            </motion.div>

            {/* Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
              {otherPosts.map((post, index) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group"
                >
                  <Link to={`/journal/${post.slug}`}>
                    <div className="aspect-[4/3] rounded-3xl overflow-hidden mb-6 relative">
                      <img 
                        src={post.featured_image || "https://images.unsplash.com/photo-1493932484895-752d1471eab5?auto=format&fit=crop&q=80&w=800"} 
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1.5 bg-white/90 backdrop-blur text-[10px] font-black uppercase tracking-widest rounded-lg text-text">
                          {post.category?.name || 'Lifestyle'}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
                        <span>{new Date(post.published_at || post.created_at).toLocaleDateString()}</span>
                        <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                        <span>6 min read</span>
                      </div>
                      <h3 className="text-2xl font-black text-text tracking-tight group-hover:text-primary transition-colors leading-tight">
                        {post.title}
                      </h3>
                      <p className="text-gray-500 line-clamp-2 leading-relaxed">
                        {post.excerpt || 'Read the full story to discover more about this topic.'}
                      </p>
                      <div className="flex items-center gap-2 text-primary font-black text-sm pt-2">
                        Read Article <ArrowRight size={16} className="transition-transform group-hover:translate-x-2" />
                      </div>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-400 font-medium">No stories published yet. Check back soon!</p>
          </div>
        )}

        {/* Newsletter Section */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-32 bg-gray-50 rounded-[40px] p-12 md:p-20 text-center border border-gray-100"
        >
          <div className="max-w-2xl mx-auto">
            <Tag className="mx-auto text-primary mb-6" size={40} />
            <h2 className="text-4xl font-black text-text tracking-tighter mb-6">Join the Community</h2>
            <p className="text-gray-500 font-medium mb-10">Get the latest stories, product launches, and exclusive insights delivered to your inbox.</p>
            
            {subscribeStatus === 'success' ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white p-8 rounded-3xl border border-primary/20 shadow-xl shadow-primary/5"
              >
                <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle size={32} />
                </div>
                <h3 className="text-xl font-black text-text mb-2">Welcome to the Herd!</h3>
                <p className="text-gray-500 text-sm">You've successfully subscribed to our journal updates.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4">
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  disabled={subscribing}
                  className="flex-grow px-8 py-4 bg-white border-transparent rounded-2xl focus:ring-4 focus:ring-primary/10 transition-all font-medium text-text disabled:opacity-50"
                  required
                />
                <button 
                  type="submit"
                  disabled={subscribing}
                  className="px-10 py-4 bg-text text-white font-black rounded-2xl hover:bg-primary transition-colors whitespace-nowrap shadow-xl shadow-text/10 flex items-center justify-center gap-2 disabled:bg-gray-400"
                >
                  {subscribing ? <Loader2 size={18} className="animate-spin" /> : null}
                  {subscribing ? 'Joining...' : 'Subscribe Now'}
                </button>
              </form>
            )}
            {subscribeStatus === 'error' && (
              <p className="mt-4 text-sm font-bold text-red-500">Something went wrong. Please try again.</p>
            )}
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default BlogPage;

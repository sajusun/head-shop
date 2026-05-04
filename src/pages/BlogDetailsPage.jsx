import React from 'react';
import { motion } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import { Calendar, User, Clock, ArrowLeft, Share2, MessageCircle, Heart } from 'lucide-react';

const blogPosts = [
  {
    id: 1,
    title: "The Art of Minimalist Living: Quality Over Quantity",
    slug: "art-of-minimalist-living",
    excerpt: "Discover how stripping away the excess can lead to a more meaningful and aesthetically pleasing lifestyle.",
    image: "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&q=80&w=1200",
    author: "Elena Vance",
    date: "May 1, 2024",
    readTime: "5 min read",
    category: "Lifestyle",
    content: `
      <p>In a world that constantly demands our attention and urges us to consume more, the philosophy of minimalism offers a breath of fresh air. It's not just about owning fewer things; it's about making room for more of what matters.</p>
      
      <h2>Defining Quality</h2>
      <p>When we talk about quality over quantity, we're discussing the intentionality behind every purchase. Does this item serve a purpose? Does it bring joy? Is it built to last? At Herd Shop, we believe that a single, well-crafted piece is worth more than a dozen mass-produced alternatives.</p>
      
      <blockquote>
        "Minimalism is the intentional promotion of the things we most value and the removal of everything that distracts us from it."
      </blockquote>

      <h2>Steps to a Minimalist Mindset</h2>
      <ul>
        <li><strong>Audit Your Space:</strong> Take a look at your surroundings. What hasn't been used in six months?</li>
        <li><strong>Invest in Craftsmanship:</strong> Choose materials like solid wood, organic cotton, and recycled metals.</li>
        <li><strong>Create White Space:</strong> Learn to appreciate the areas in your home that are empty.</li>
      </ul>

      <p>By choosing quality, we not only improve our own lives but also contribute to a more sustainable world. Every intentional choice is a vote for the kind of future we want to build.</p>
    `
  }
  // Add other posts if needed for simulation
];

const BlogDetailsPage = () => {
  const { slug } = useParams();
  const post = blogPosts.find(p => p.slug === slug) || blogPosts[0]; // Fallback for demo

  return (
    <div className="min-h-screen pt-20 pb-32">
      <div className="max-w-4xl mx-auto px-4">
        
        {/* Back Button */}
        <Link to="/journal" className="inline-flex items-center gap-2 text-sm font-black text-gray-400 hover:text-primary mb-12 transition-colors uppercase tracking-widest">
          <ArrowLeft size={16} /> Back to Journal
        </Link>

        {/* Header */}
        <header className="mb-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4 mb-6"
          >
            <span className="px-4 py-1.5 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.2em] rounded-full">
              {post.category}
            </span>
            <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">{post.readTime}</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-6xl font-black text-text tracking-tighter mb-8 leading-[1.1]"
          >
            {post.title}
          </motion.h1>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-between py-8 border-y border-gray-100"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-100 rounded-full overflow-hidden">
                <img src={`https://ui-avatars.com/api/?name=${post.author}&background=random`} alt={post.author} />
              </div>
              <div>
                <p className="text-sm font-black text-text">{post.author}</p>
                <p className="text-xs text-gray-500 font-medium">{post.date}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="p-3 bg-gray-50 rounded-2xl text-gray-400 hover:text-primary transition-colors">
                <Share2 size={20} />
              </button>
              <button className="p-3 bg-gray-50 rounded-2xl text-gray-400 hover:text-red-500 transition-colors">
                <Heart size={20} />
              </button>
            </div>
          </motion.div>
        </header>

        {/* Featured Image */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="aspect-[16/9] rounded-[40px] overflow-hidden mb-16 shadow-2xl shadow-primary/5"
        >
          <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
        </motion.div>

        {/* Content */}
        <motion.article 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="prose prose-xl prose-primary max-w-none prose-headings:font-black prose-headings:tracking-tighter prose-blockquote:border-primary prose-blockquote:bg-gray-50 prose-blockquote:p-8 prose-blockquote:rounded-3xl prose-blockquote:not-italic prose-blockquote:text-text prose-p:text-gray-600 prose-p:leading-relaxed"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Footer Actions */}
        <div className="mt-20 pt-12 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-3">
            <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Share this story:</span>
            <div className="flex gap-2">
              {['Twitter', 'Facebook', 'LinkedIn'].map(platform => (
                <button key={platform} className="px-4 py-2 bg-gray-50 text-xs font-bold text-text hover:bg-primary hover:text-white rounded-xl transition-all">
                  {platform}
                </button>
              ))}
            </div>
          </div>
          <button className="flex items-center gap-2 px-6 py-3 bg-text text-white font-black rounded-2xl hover:bg-primary transition-colors shadow-lg shadow-text/10">
            <MessageCircle size={20} /> Join the Discussion
          </button>
        </div>

      </div>
    </div>
  );
};

export default BlogDetailsPage;

import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Calendar, User, Clock, ArrowRight, Tag } from 'lucide-react';

const blogPosts = [
  {
    id: 1,
    title: "The Art of Minimalist Living: Quality Over Quantity",
    slug: "art-of-minimalist-living",
    excerpt: "Discover how stripping away the excess can lead to a more meaningful and aesthetically pleasing lifestyle.",
    image: "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&q=80&w=800",
    author: "Elena Vance",
    date: "May 1, 2024",
    readTime: "5 min read",
    category: "Lifestyle"
  },
  {
    id: 2,
    title: "Choosing the Perfect Palette for Your Home Office",
    slug: "perfect-palette-home-office",
    excerpt: "Color psychology plays a huge role in productivity. Here's how to pick the right shades for your workspace.",
    image: "https://images.unsplash.com/photo-1493932484895-752d1471eab5?auto=format&fit=crop&q=80&w=800",
    author: "Marcus Thorne",
    date: "April 28, 2024",
    readTime: "8 min read",
    category: "Design"
  },
  {
    id: 3,
    title: "Sustainability in Modern Craftsmanship",
    slug: "sustainability-modern-craftsmanship",
    excerpt: "Why the future of luxury lies in ethical production and sustainable materials.",
    image: "https://images.unsplash.com/photo-1513519245088-0e12902e35a6?auto=format&fit=crop&q=80&w=800",
    author: "Sarah Chen",
    date: "April 22, 2024",
    readTime: "6 min read",
    category: "Philosophy"
  },
  {
    id: 4,
    title: "Morning Rituals of Successful Creatives",
    slug: "morning-rituals-creatives",
    excerpt: "A deep dive into the habits that fuel inspiration for the world's leading designers and artists.",
    image: "https://images.unsplash.com/photo-1518173946687-a4c8a98039f5?auto=format&fit=crop&q=80&w=800",
    author: "Elena Vance",
    date: "April 15, 2024",
    readTime: "10 min read",
    category: "Productivity"
  }
];

const BlogPage = () => {
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

        {/* Featured Post */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative rounded-[40px] overflow-hidden mb-24 aspect-[21/9] group cursor-pointer"
        >
          <img 
            src={blogPosts[0].image} 
            alt={blogPosts[0].title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8 md:p-16">
            <div className="max-w-3xl">
              <span className="px-4 py-2 bg-primary text-white text-xs font-black uppercase tracking-widest rounded-full mb-6 inline-block">
                {blogPosts[0].category}
              </span>
              <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-6 group-hover:text-primary transition-colors">
                {blogPosts[0].title}
              </h2>
              <div className="flex flex-wrap items-center gap-6 text-white/70 text-sm font-bold">
                <span className="flex items-center gap-2"><User size={16} /> {blogPosts[0].author}</span>
                <span className="flex items-center gap-2"><Calendar size={16} /> {blogPosts[0].date}</span>
                <span className="flex items-center gap-2"><Clock size={16} /> {blogPosts[0].readTime}</span>
              </div>
            </div>
          </div>
          <Link to={`/journal/${blogPosts[0].slug}`} className="absolute inset-0 z-10" />
        </motion.div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
          {blogPosts.slice(1).map((post, index) => (
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
                    src={post.image} 
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1.5 bg-white/90 backdrop-blur text-[10px] font-black uppercase tracking-widest rounded-lg text-text">
                      {post.category}
                    </span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
                    <span>{post.date}</span>
                    <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                    <span>{post.readTime}</span>
                  </div>
                  <h3 className="text-2xl font-black text-text tracking-tight group-hover:text-primary transition-colors leading-tight">
                    {post.title}
                  </h3>
                  <p className="text-gray-500 line-clamp-2 leading-relaxed">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center gap-2 text-primary font-black text-sm pt-2">
                    Read Article <ArrowRight size={16} className="transition-transform group-hover:translate-x-2" />
                  </div>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>

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
            <form className="flex flex-col sm:flex-row gap-4">
              <input 
                type="email" 
                placeholder="Enter your email"
                className="flex-grow px-8 py-4 bg-white border-transparent rounded-2xl focus:ring-4 focus:ring-primary/10 transition-all font-medium text-text"
              />
              <button className="px-10 py-4 bg-text text-white font-black rounded-2xl hover:bg-primary transition-colors whitespace-nowrap shadow-xl shadow-text/10">
                Subscribe Now
              </button>
            </form>
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default BlogPage;

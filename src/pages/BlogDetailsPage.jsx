import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { 
  User, Clock, ArrowLeft, Share2, MessageSquare, Heart, Check, X, Search
} from 'lucide-react';
import { toggleBlogFavorite } from '../features/favorites/blogFavoriteSlice';

const blogPosts = [
  {
    id: 'blog-1',
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
];

const mockComments = [
  { id: 1, user: "Alex Rivera", text: "This really resonates with me. I've been trying to declutter my workspace for weeks!", date: "2 hours ago", avatar: "https://ui-avatars.com/api/?name=Alex+Rivera&background=random" },
  { id: 2, user: "Sophia Chen", text: "Great points about quality. It's better to buy one thing that lasts a lifetime.", date: "5 hours ago", avatar: "https://ui-avatars.com/api/?name=Sophia+Chen&background=random" }
];

const BlogDetailsPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const auth = useSelector(state => state.auth);
  const user = auth?.user;
  const blogFavoritesState = useSelector(state => state.blogFavorites);
  const blogFavorites = blogFavoritesState?.items || [];
  
  const [showShare, setShowShare] = useState(false);
  const [copied, setCopied] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState(mockComments);

  const post = blogPosts.find(p => p.slug === slug) || blogPosts[0];
  const isFavorite = blogFavorites.some(item => item && item.id === post?.id);

  const handleFavorite = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    dispatch(toggleBlogFavorite({
      id: post.id,
      title: post.title,
      image: post.image,
      slug: post.slug,
      date: post.date
    }));
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    if (!commentText.trim()) return;

    const newComment = {
      id: Date.now(),
      user: user.name,
      text: commentText,
      date: "Just now",
      avatar: user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=random`
    };

    setComments([newComment, ...comments]);
    setCommentText("");
  };

  const handleCopyLink = () => {
    try {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  if (!post) return <div className="pt-32 text-center font-bold">Post not found</div>;

  return (
    <div className="min-h-screen pt-20 pb-32 bg-white text-text">
      <div className="max-w-4xl mx-auto px-4">
        
        {/* Back */}
        <Link to="/journal" className="inline-flex items-center gap-2 text-sm font-black text-gray-400 hover:text-primary mb-12 transition-colors uppercase tracking-widest">
          <ArrowLeft size={16} /> Back to Journal
        </Link>

        {/* Header */}
        <header className="mb-12">
          <div className="flex items-center gap-4 mb-6">
            <span className="px-4 py-1.5 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.2em] rounded-full">
              {post.category}
            </span>
            <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">{post.readTime}</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-black text-text tracking-tighter mb-8 leading-[1.1]">
            {post.title}
          </h1>

          <div className="flex items-center justify-between py-8 border-y border-gray-100">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-100 rounded-full overflow-hidden border-2 border-white shadow-sm">
                <img src={`https://ui-avatars.com/api/?name=${post.author}&background=random`} alt={post.author} />
              </div>
              <div>
                <p className="text-sm font-black text-text">{post.author}</p>
                <p className="text-xs text-gray-500 font-medium">{post.date}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 relative">
              <div className="relative">
                <button 
                  onClick={() => setShowShare(!showShare)}
                  className={`p-3 rounded-2xl transition-all ${showShare ? 'bg-primary text-white' : 'bg-gray-50 text-gray-400 hover:text-primary'}`}
                >
                  <Share2 size={20} />
                </button>
                
                {showShare && (
                  <div className="absolute right-0 top-full mt-4 w-64 bg-white border border-gray-100 rounded-3xl shadow-2xl p-6 z-50">
                    <div className="flex justify-between items-center mb-6">
                      <h4 className="text-sm font-black text-text uppercase tracking-widest">Share</h4>
                      <button onClick={() => setShowShare(false)}><X size={16} /></button>
                    </div>
                    <div className="space-y-2">
                      <button onClick={handleCopyLink} className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl transition-colors">
                        <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                          {copied ? <Check size={16} /> : <Search size={16} />}
                        </div>
                        <span className="text-sm font-bold text-gray-600">{copied ? "Copied!" : "Copy Link"}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <button 
                onClick={handleFavorite}
                className={`p-3 rounded-2xl transition-all ${isFavorite ? 'bg-red-50 text-red-500' : 'bg-gray-50 text-gray-400 hover:text-red-500'}`}
              >
                <Heart size={20} fill={isFavorite ? "currentColor" : "none"} />
              </button>
            </div>
          </div>
        </header>

        {/* Image */}
        <div className="aspect-[16/9] rounded-[40px] overflow-hidden mb-16 shadow-2xl shadow-primary/5">
          <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
        </div>

        {/* Content */}
        <article 
          className="prose prose-xl prose-primary max-w-none mb-24"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Comments Section */}
        <div className="border-t border-gray-100 pt-16">
          <div className="flex items-center gap-3 mb-10">
            <MessageSquare size={24} className="text-primary" />
            <h2 className="text-3xl font-black text-text tracking-tighter">Comments ({comments.length})</h2>
          </div>

          <div className="bg-gray-50 rounded-[32px] p-8 mb-12">
            {user ? (
              <form onSubmit={handleCommentSubmit} className="space-y-4">
                <textarea 
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Share your thoughts..."
                  className="w-full p-6 bg-white border-transparent rounded-2xl focus:ring-4 focus:ring-primary/10 transition-all text-text font-medium min-h-[120px] resize-none outline-none"
                />
                <div className="flex justify-end">
                  <button type="submit" className="px-8 py-3 bg-primary text-white font-black rounded-xl hover:scale-105 transition-transform shadow-lg shadow-primary/20">
                    Post Comment
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-center py-6">
                <p className="text-gray-500 font-bold mb-4">Please log in to join the conversation.</p>
                <Link to="/login" className="px-8 py-3 bg-text text-white font-black rounded-xl inline-block hover:bg-primary transition-colors">Login Now</Link>
              </div>
            )}
          </div>

          <div className="space-y-8">
            {comments.map((comment) => (
              <div key={comment.id} className="flex gap-6">
                <div className="w-12 h-12 rounded-2xl overflow-hidden shrink-0 shadow-sm bg-gray-200">
                  <img src={comment.avatar} alt={comment.user} />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <h4 className="font-black text-text">{comment.user}</h4>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{comment.date}</span>
                  </div>
                  <p className="text-gray-600 leading-relaxed">{comment.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default BlogDetailsPage;

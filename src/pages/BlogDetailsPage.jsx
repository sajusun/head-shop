import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { 
  ArrowLeft, Share2, MessageSquare, Heart, Check, X, Link2
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
  
  const post = blogPosts.find(p => p.slug === slug) || blogPosts[0];
  const isFavorite = blogFavorites.some(item => item && item.id === post?.id);

  const [showShare, setShowShare] = useState(false);
  const [copied, setCopied] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState(mockComments);
  const [likeCount, setLikeCount] = useState(post?.id === 'blog-1' ? 128 : 47);
  const [likeAnimating, setLikeAnimating] = useState(false);
  const shareRef = useRef(null);

  // Close share popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (shareRef.current && !shareRef.current.contains(e.target)) {
        setShowShare(false);
      }
    };
    if (showShare) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showShare]);

  const handleFavorite = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    const wasLiked = isFavorite;
    dispatch(toggleBlogFavorite({
      id: post.id,
      title: post.title,
      image: post.image,
      slug: post.slug,
      date: post.date
    }));
    setLikeCount(prev => wasLiked ? prev - 1 : prev + 1);
    setLikeAnimating(true);
    setTimeout(() => setLikeAnimating(false), 400);
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

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
  const encodedUrl = encodeURIComponent(currentUrl);
  const encodedTitle = encodeURIComponent(post?.title || '');

  const shareLinks = [
    {
      name: 'Facebook',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      color: '#1877F2',
      bg: '#EBF3FF',
      icon: (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="#1877F2">
          <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
        </svg>
      ),
    },
    {
      name: 'Twitter / X',
      url: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      color: '#000000',
      bg: '#F2F2F2',
      icon: (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="#000">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    },
    {
      name: 'WhatsApp',
      url: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
      color: '#25D366',
      bg: '#EDFBF1',
      icon: (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="#25D366">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
          <path d="M11.999 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.985-1.309A9.954 9.954 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 11.999 2zm.001 18a7.95 7.95 0 01-4.051-1.111l-.29-.173-3.003.788.8-2.924-.19-.3A7.944 7.944 0 014 12c0-4.418 3.582-8 8-8s8 3.582 8 8-3.582 8-8 8z" />
        </svg>
      ),
    },
    {
      name: 'LinkedIn',
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      color: '#0A66C2',
      bg: '#E8F1FB',
      icon: (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="#0A66C2">
          <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
          <circle cx="4" cy="4" r="2" />
        </svg>
      ),
    },
  ];

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
              <div className="relative" ref={shareRef}>
                <button 
                  onClick={() => setShowShare(!showShare)}
                  className={`p-3 rounded-2xl transition-all ${showShare ? 'bg-primary text-white' : 'bg-gray-50 text-gray-400 hover:text-primary'}`}
                >
                  <Share2 size={20} />
                </button>
                
                {showShare && (
                  <div className="absolute right-0 top-full mt-4 w-72 bg-white border border-gray-100 rounded-3xl shadow-2xl p-6 z-50">
                    <div className="flex justify-between items-center mb-5">
                      <h4 className="text-sm font-black text-text uppercase tracking-widest">Share This Post</h4>
                      <button onClick={() => setShowShare(false)} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
                        <X size={16} className="text-gray-400" />
                      </button>
                    </div>

                    {/* Social Platform Buttons */}
                    <div className="space-y-2 mb-4">
                      {shareLinks.map((item) => (
                        <a
                          key={item.name}
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => setShowShare(false)}
                          className="w-full flex items-center gap-3 p-3 rounded-xl transition-all hover:scale-[1.02] hover:shadow-sm"
                          style={{ background: item.bg }}
                        >
                          <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                            style={{ background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}
                          >
                            {item.icon}
                          </div>
                          <span className="text-sm font-bold" style={{ color: item.color }}>
                            {item.name}
                          </span>
                        </a>
                      ))}
                    </div>

                    {/* Divider */}
                    <div className="border-t border-gray-100 pt-3">
                      <button
                        onClick={handleCopyLink}
                        className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl transition-colors"
                      >
                        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                          {copied ? <Check size={16} className="text-green-500" /> : <Link2 size={16} className="text-gray-500" />}
                        </div>
                        <span className={`text-sm font-bold ${copied ? 'text-green-500' : 'text-gray-600'}`}>
                          {copied ? 'Link Copied! ✓' : 'Copy Link'}
                        </span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={handleFavorite}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl transition-all duration-200 ${
                  isFavorite
                    ? 'bg-red-50 text-red-500 shadow-sm shadow-red-100'
                    : 'bg-gray-50 text-gray-400 hover:text-red-500 hover:bg-red-50'
                }`}
              >
                <span
                  style={{
                    display: 'inline-block',
                    transform: likeAnimating ? 'scale(1.4)' : 'scale(1)',
                    transition: 'transform 0.25s cubic-bezier(0.34,1.56,0.64,1)'
                  }}
                >
                  <Heart size={20} fill={isFavorite ? 'currentColor' : 'none'} />
                </span>
                <span
                  style={{
                    fontSize: '0.8rem',
                    fontWeight: 800,
                    minWidth: '1.5rem',
                    display: 'inline-block',
                    transform: likeAnimating ? 'translateY(-2px)' : 'translateY(0)',
                    transition: 'transform 0.25s ease',
                    lineHeight: 1
                  }}
                >
                  {likeCount >= 1000
                    ? `${(likeCount / 1000).toFixed(1)}k`
                    : likeCount}
                </span>
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

        {/* ── LinkedIn-style Reaction Bar ── */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '18px 28px',
            marginBottom: '40px',
            borderRadius: '24px',
            background: 'linear-gradient(135deg, #fff5f5 0%, #fff0f3 100%)',
            border: '1px solid #fde8ec',
            boxShadow: '0 2px 16px 0 rgba(239,68,68,0.06)'
          }}
        >
          {/* Left: emoji stack + count */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Reaction emoji pills */}
            <div style={{ display: 'flex', gap: '-4px' }}>
              {['❤️', '👏', '💡'].map((emoji, i) => (
                <span
                  key={i}
                  style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    background: '#fff',
                    border: '2px solid #fde8ec',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '14px',
                    marginLeft: i === 0 ? 0 : '-8px',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
                    position: 'relative',
                    zIndex: 3 - i
                  }}
                >
                  {emoji}
                </span>
              ))}
            </div>
            <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#374151' }}>
              {likeCount.toLocaleString()}
            </span>
            <span style={{ fontSize: '0.85rem', color: '#9ca3af', fontWeight: 600 }}>
              {likeCount === 1 ? 'person loved this' : 'people loved this'}
            </span>
          </div>

          {/* Right: comment count */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <MessageSquare size={16} style={{ color: '#9ca3af' }} />
            <span style={{ fontSize: '0.85rem', color: '#9ca3af', fontWeight: 600 }}>
              {comments.length} {comments.length === 1 ? 'comment' : 'comments'}
            </span>
          </div>
        </div>

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

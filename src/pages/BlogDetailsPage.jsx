import React from 'react';
import { useParams, Link } from 'react-router-dom';

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

const BlogDetailsPage = () => {
  const { slug } = useParams();
  const post = blogPosts.find(p => p.slug === slug) || blogPosts[0];

  return (
    <div className="min-h-screen pt-20 pb-32 bg-white text-text">
      <div className="max-w-4xl mx-auto px-4">
        
        {/* Back Button */}
        <Link to="/journal" className="inline-flex items-center gap-2 text-sm font-black text-gray-400 hover:text-primary mb-12 transition-colors uppercase tracking-widest">
          ← Back to Journal
        </Link>

        <header className="mb-12">
          <div className="flex items-center gap-4 mb-6">
            <span className="px-4 py-1.5 bg-gray-100 text-gray-600 text-[10px] font-black uppercase tracking-[0.2em] rounded-full">
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
          </div>
        </header>

        <div className="aspect-[16/9] rounded-[40px] overflow-hidden mb-16">
          <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
        </div>

        <article 
          className="prose prose-xl max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </div>
    </div>
  );
};

export default BlogDetailsPage;

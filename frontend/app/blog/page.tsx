import Link from 'next/link';
import { PostCard } from '@/components/ui/PostCard';
import { getLatestPosts, getPopularPosts } from '@/lib/api';

export const revalidate = 900; // ISR 15 mins

export default async function BlogHome() {
  const [latestRes, popularPosts] = await Promise.all([
    getLatestPosts(1, 10).catch(() => ({ data: [], meta: null })),
    getPopularPosts(5).catch(() => []),
  ]);

  const latestPosts = latestRes.data || [];
  const featuredPost = latestPosts[0];
  const gridPosts = latestPosts.slice(1);

  return (
    <>
      <section className="hero">
        <div className="container">
          <div className="hero__eyebrow">The Corporate Blog</div>
          <h1 className="hero__title">Insights that <span>drive business.</span></h1>
          <p className="hero__desc">
            Deep dives, analysis, and stories from the intersection of business, tech, and culture.
            Written by practitioners for practitioners.
          </p>
        </div>
      </section>

      <div className="container">
        {featuredPost && (
           <div style={{ marginBottom: 'var(--space-12)' }}>
              <PostCard post={featuredPost} priority />
           </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 'var(--space-12)', alignItems: 'start' }} className="article-layout">
           
           <div>
              <div className="section-header">
                 <h2 className="section-title">Latest Articles</h2>
              </div>
              <div className="posts-grid">
                 {gridPosts.map(post => <PostCard key={post.id} post={post} />)}
              </div>
           </div>

           <aside style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-12)', position: 'sticky', top: 100 }}>
              {popularPosts.length > 0 && (
                 <div>
                    <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 800, marginBottom: 'var(--space-5)', borderBottom: '1px solid var(--color-border)', paddingBottom: 'var(--space-2)' }}>Trending</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                       {popularPosts.map((post, i) => (
                          <div key={post.id} style={{ display: 'flex', gap: 'var(--space-3)' }}>
                             <div style={{ fontSize: 'var(--text-xl)', fontWeight: 900, color: 'var(--color-border-soft)', lineHeight: 1 }}>
                                {String(i + 1).padStart(2, '0')}
                             </div>
                             <Link href={`/blog/${post.slug}`} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                <span style={{ fontWeight: 600, fontSize: 'var(--text-sm)', lineHeight: 1.4 }}>{post.title}</span>
                                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-subtle)' }}>{new Date(post.publishedAt || post.createdAt).toLocaleDateString()}</span>
                             </Link>
                          </div>
                       ))}
                    </div>
                 </div>
              )}

              <div className="newsletter" style={{ margin: 0, padding: 'var(--space-6)', borderRadius: 'var(--radius-xl)' }}>
                 <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 800, marginBottom: 'var(--space-2)' }}>Stay Updated</h3>
                 <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', marginBottom: 'var(--space-5)' }}>Get the latest insights delivered weekly.</p>
                 <form style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                    <input type="email" placeholder="Email address" className="form-input" style={{ borderRadius: 'var(--radius-full)' }} required />
                    <button type="button" className="btn btn--primary" style={{ width: '100%' }}>Subscribe</button>
                 </form>
              </div>
           </aside>
           
        </div>
      </div>
    </>
  );
}

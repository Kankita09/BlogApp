import { Metadata } from 'next';
import { searchPosts } from '@/lib/api';
import { PostCard } from '@/components/ui/PostCard';

export const metadata: Metadata = {
  title: 'Search Results',
  robots: { index: false, follow: false },
};

export default async function SearchPage({ searchParams }: { searchParams: { q?: string; page?: string } }) {
  const query = searchParams.q || '';
  const page = Number(searchParams.page) || 1;
  
  if (!query) {
    return (
      <div className="container" style={{ paddingTop: 'var(--space-12)', minHeight: '60vh' }}>
        <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 800 }}>Search</h1>
        <p style={{ color: 'var(--color-text-muted)', marginTop: 'var(--space-4)' }}>Enter a query to search articles.</p>
      </div>
    );
  }

  try {
    const { data: results, meta } = await searchPosts(query, page);

    return (
      <div className="container" style={{ paddingTop: 'var(--space-12)' }}>
        <div style={{ marginBottom: 'var(--space-12)' }}>
           <h1 style={{ fontSize: 'var(--text-4xl)', fontWeight: 800, marginBottom: 'var(--space-2)' }}>Search results for "{query}"</h1>
           <p style={{ color: 'var(--color-text-muted)' }}>Found {meta.total} articles</p>
        </div>

        {results.length === 0 ? (
           <div style={{ padding: 'var(--space-12) 0', color: 'var(--color-text-subtle)', textAlign: 'center' }}>
              No results found. Try different keywords.
           </div>
        ) : (
           <div className="posts-grid">
              {/* Type cast to any since search returns SearchResult without full Post relations for now, but we'll mock it for the PostCard to re-use UI */}
              {results.map((result) => (
                 <PostCard 
                   key={result.id} 
                   post={{
                     ...result,
                     author: { name: 'Editorial Team', id: '', email: '', avatar: null },
                     categories: [],
                     status: 'PUBLISHED',
                     createdAt: result.publishedAt || new Date().toISOString(),
                     updatedAt: result.publishedAt || new Date().toISOString(),
                     seoTitle: null,
                     seoDescription: null,
                     isSponsored: false,
                     bannerImage: null,
                     _count: { views: 0 }
                   } as any} 
                 />
              ))}
           </div>
        )}

        {meta && meta.totalPages > 1 && (
           <div className="pagination">
              {meta.hasPrev && <a href={`/search?q=${encodeURIComponent(query)}&page=${page - 1}`} className="btn btn--outline">← Prev</a>}
              <span className="text-muted" style={{ padding: '0 var(--space-4)' }}>Page {meta.page} of {meta.totalPages}</span>
              {meta.hasNext && <a href={`/search?q=${encodeURIComponent(query)}&page=${page + 1}`} className="btn btn--outline">Next →</a>}
         </div>
        )}
      </div>
    );
  } catch (error) {
    return (
      <div className="container" style={{ paddingTop: 'var(--space-12)' }}>
        <p className="text-error">An error occurred while searching. Please try again.</p>
      </div>
    );
  }
}

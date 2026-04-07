import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getPostsByAuthor } from '@/lib/api';
import { buildAuthorMetadata } from '@/lib/seo';
import { slugToName } from '@/utils/formatDate';
import { PostCard } from '@/components/ui/PostCard';

export const revalidate = 900;

interface PageProps {
  params: { slug: string };
  searchParams: { page?: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  return buildAuthorMetadata(slugToName(params.slug), params.slug);
}

export default async function AuthorPage({ params, searchParams }: PageProps) {
  const page = Number(searchParams.page) || 1;
  const name = slugToName(params.slug);
  
  try {
    const { data: posts, meta } = await getPostsByAuthor(params.slug, page);

    return (
      <div className="container" style={{ paddingTop: 'var(--space-12)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: 'var(--space-16)' }}>
           <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--color-primary-glow)', color: 'var(--color-primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 800, marginBottom: 'var(--space-4)' }}>
              {name.charAt(0).toUpperCase()}
           </div>
           <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--text-4xl)', fontWeight: 800 }}>{name}</h1>
           <p style={{ color: 'var(--color-text-muted)', marginTop: 'var(--space-2)' }}>Author at The Corporate Blog</p>
        </div>

        {posts.length === 0 ? (
           <div style={{ textAlign: 'center', padding: 'var(--space-12) 0', color: 'var(--color-text-subtle)' }}>No posts found for this author.</div>
        ) : (
           <div className="posts-grid">
              {posts.map(post => <PostCard key={post.id} post={post} />)}
           </div>
        )}

        {meta && meta.totalPages > 1 && (
           <div className="pagination">
              {meta.hasPrev && <a href={`/blog/author/${params.slug}?page=${page - 1}`} className="btn btn--outline">← Prev</a>}
              <span className="text-muted" style={{ padding: '0 var(--space-4)' }}>Page {meta.page} of {meta.totalPages}</span>
              {meta.hasNext && <a href={`/blog/author/${params.slug}?page=${page + 1}`} className="btn btn--outline">Next →</a>}
           </div>
        )}
      </div>
    );
  } catch (error) {
    notFound();
  }
}

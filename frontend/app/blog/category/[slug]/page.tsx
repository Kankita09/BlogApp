import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getPostsByCategory } from '@/lib/api';
import { buildCategoryMetadata } from '@/lib/seo';
import { slugToName } from '@/utils/formatDate';
import { PostCard } from '@/components/ui/PostCard';

export const revalidate = 900;

interface PageProps {
  params: { slug: string };
  searchParams: { page?: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  return buildCategoryMetadata(slugToName(params.slug), params.slug);
}

export default async function CategoryPage({ params, searchParams }: PageProps) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug ?? params?.slug;

  if (!slug || typeof slug !== 'string') {
    notFound();
  }

  const page = Number(searchParams.page) || 1;
  const name = slugToName(slug);
  
  let posts: any[] = [];
  let meta: any = null;

  try {
    const result = await getPostsByCategory(slug, page);
    posts = result.data;
    meta = result.meta;
  } catch (error) {
    // If backend throws an error, default to empty state
  }

  return (
    <div className="container" style={{ paddingTop: 'var(--space-12)' }}>
      <div style={{ textAlign: 'center', marginBottom: 'var(--space-16)' }}>
         <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--text-5xl)', fontWeight: 800, marginBottom: 'var(--space-4)' }}>{name}</h1>
         <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-lg)' }}>Browse all articles in the {name} category.</p>
      </div>

      {posts.length === 0 ? (
         <div style={{ textAlign: 'center', padding: 'var(--space-12) 0', color: 'var(--color-text-subtle)' }}>No articles yet</div>
      ) : (
         <div className="posts-grid">
            {posts.map(post => <PostCard key={post.id} post={post} />)}
         </div>
      )}

      {meta && meta.totalPages > 1 && (
         <div className="pagination">
            {/* Simple pagination logic for demonstration */}
            {meta.hasPrev && <a href={`/blog/category/${params.slug}?page=${page - 1}`} className="btn btn--outline">← Prev</a>}
            <span className="text-muted" style={{ padding: '0 var(--space-4)' }}>Page {meta.page} of {meta.totalPages}</span>
            {meta.hasNext && <a href={`/blog/category/${params.slug}?page=${page + 1}`} className="btn btn--outline">Next →</a>}
         </div>
      )}
    </div>
  );
}

import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';
import { getPostBySlug, getInternalSuggestions, recordView } from '@/lib/api';
import { buildPostMetadata, buildArticleJsonLd, buildBreadcrumbJsonLd, buildFaqJsonLd } from '@/lib/seo';
import { cloudinaryUrl } from '@/lib/cloudinary';
import { formatDate } from '@/utils/formatDate';
import { BlockRenderer } from '@/components/BlockRenderer';
import { TableOfContents } from '@/components/TableOfContents';
import { RelatedPosts } from '@/components/RelatedPosts';

export const revalidate = 900;

interface PageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const post = await getPostBySlug(params.slug);
    return buildPostMetadata(post);
  } catch {
    return { title: 'Post Not Found' };
  }
}

export default async function BlogPostPage({ params }: PageProps) {
  try {
    const post = await getPostBySlug(params.slug);
    
    // Non-blocking operations
    const suggestionsPromise = getInternalSuggestions(post.id).catch(() => []);
    // Fire and forget view recording
    recordView(params.slug);

    const relatedPosts = await suggestionsPromise;

    const breadcrumbJson = buildBreadcrumbJsonLd([
      { name: 'Home', url: process.env['NEXT_PUBLIC_SITE_URL'] || 'http://localhost:3000' },
      { name: 'Blog', url: `${process.env['NEXT_PUBLIC_SITE_URL'] || 'http://localhost:3000'}/blog` },
      { name: post.title, url: `${process.env['NEXT_PUBLIC_SITE_URL'] || 'http://localhost:3000'}/blog/${post.slug}` },
    ]);

    const faqJson = buildFaqJsonLd(post.content);

    return (
      <>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(buildArticleJsonLd(post)) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJson) }} />
        {faqJson && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJson) }} />}

        <article className="article-layout" style={{ marginTop: 'var(--space-12)' }}>
          <div className="article-body">
            <header className="article-header">
              <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                 {post.categories.map(({ category }) => (
                    <Link key={category.id} href={`/blog/category/${category.slug}`} className="badge">
                       {category.name}
                    </Link>
                 ))}
                 {post.isSponsored && <span className="badge badge--sponsored">Sponsored</span>}
              </div>
              <h1 className="article-title">{post.title}</h1>
              {post.excerpt && <p style={{ fontSize: 'var(--text-lg)', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>{post.excerpt}</p>}
              
              <div className="article-meta">
                 <Link href={`/blog/author/${post.author.name.toLowerCase().replace(/\\s+/g, '-')}`} className="article-meta__author">
                    {post.author.avatar ? (
                       <Image src={post.author.avatar} alt={post.author.name} width={32} height={32} style={{ borderRadius: '50%' }} />
                    ) : (
                       <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--color-primary-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary-light)', fontWeight: 'bold' }}>
                          {post.author.name.charAt(0).toUpperCase()}
                       </div>
                    )}
                    {post.author.name}
                 </Link>
                 <span style={{ color: 'var(--color-border)' }}>|</span>
                 <time dateTime={post.publishedAt || post.createdAt}>{formatDate(post.publishedAt || post.createdAt)}</time>
              </div>
            </header>

            {post.bannerImage && process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME && process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME !== 'REPLACE_ME' ? (
              <Image 
                src={cloudinaryUrl(post.bannerImage.cloudinaryId, { width: 1200 })} 
                alt={post.bannerImage.altText || post.title} 
                width={1200} height={630} 
                className="article-banner"
                priority
              />
            ) : (
              <div className="article-banner" style={{ background: '#4f46e520', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8b85ff', fontWeight: 700, fontSize: '1.5rem' }}>
                {post.title}
              </div>
            )}

            <div className="block-content">
               <BlockRenderer blocks={post.content} />
            </div>

            <RelatedPosts posts={relatedPosts} />
          </div>

          <aside className="article-sidebar">
             <TableOfContents blocks={post.content} />
          </aside>
        </article>
      </>
    );
  } catch (error) {
    // If API returns 404
    notFound();
  }
}

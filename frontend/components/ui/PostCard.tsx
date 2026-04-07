import Link from 'next/link';
import Image from 'next/image';
import { Post } from '@/types';
import { cloudinaryThumb } from '@/lib/cloudinary';
import { formatDateShort } from '@/utils/formatDate';

interface PostCardProps {
  post: Post;
  priority?: boolean;
}

export function PostCard({ post, priority = false }: PostCardProps) {
  const hasConfig = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME && process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME !== 'REPLACE_ME';
  const hasValidImage = post.bannerImage && post.bannerImage.cloudinaryId && hasConfig;
  
  const imageUrl = hasValidImage 
    ? cloudinaryThumb(post.bannerImage!.cloudinaryId, 800)
    : '';

  return (
    <article className="post-card">
      <Link href={`/blog/${post.slug}`} className="post-card__image" aria-label={`Read ${post.title}`}>
        {post.isSponsored && (
          <div style={{ position: 'absolute', top: 12, right: 12, zIndex: 10 }}>
            <span className="badge badge--sponsored">Sponsored</span>
          </div>
        )}
        {hasValidImage ? (
          <Image
            src={imageUrl}
            alt={post.bannerImage?.altText || post.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={priority}
            style={{ objectFit: 'cover' }}
          />
        ) : (
          <div style={{ width: '100%', height: '100%', background: '#4f46e520', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8b85ff', fontWeight: 600, fontSize: '0.875rem' }}>
            {post.categories[0]?.category?.name || 'Article'}
          </div>
        )}
      </Link>
      
      <div className="post-card__body">
        <div className="post-card__cats">
          {post.categories.slice(0, 2).map(({ category }) => (
            <Link key={category.id} href={`/blog/category/${category.slug}`} className="badge">
              {category.name}
            </Link>
          ))}
        </div>
        
        <Link href={`/blog/${post.slug}`}>
          <h2 className="post-card__title">{post.title}</h2>
        </Link>
        
        <p className="post-card__excerpt">{post.excerpt}</p>
        
        <div className="post-card__meta">
           <div className="post-card__author-info" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              {post.author.avatar ? (
                <Image src={post.author.avatar} alt={post.author.name} width={28} height={28} className="post-card__avatar" />
              ) : (
                <div className="post-card__avatar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-primary-glow)', color: 'var(--color-primary-light)', fontSize: 12, fontWeight: 'bold' }}>
                  {post.author.name.charAt(0).toUpperCase()}
                </div>
              )}
              <span className="post-card__author">{post.author.name}</span>
           </div>
           
           <time className="post-card__date" dateTime={post.publishedAt || post.createdAt}>
              {formatDateShort(post.publishedAt || post.createdAt)}
           </time>
        </div>
      </div>
    </article>
  );
}

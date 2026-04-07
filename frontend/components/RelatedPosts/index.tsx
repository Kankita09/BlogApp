import { Post } from '@/types';
import { PostCard } from '../ui/PostCard';

export function RelatedPosts({ posts }: { posts: Post[] }) {
  if (!posts || posts.length === 0) return null;

  return (
    <section className="related-posts">
      <div className="section-header">
         <h2 className="section-title">Related Posts</h2>
      </div>
      <div className="posts-grid">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  );
}

import Link from 'next/link';
import { getLatestPosts } from '@/lib/api';

export const revalidate = 0; // Don't cache admin page

export default async function AdminPosts() {
  let posts: any[] = [];
  try {
    const res = await getLatestPosts(1, 50);
    posts = res.data || [];
  } catch (err) {}

  return (
    <div>
      <div className="admin-topbar">
         <h1 className="admin-page-title">Posts</h1>
         <Link href="/admin/posts/new" className="btn btn--primary">
           + New Post
         </Link>
      </div>

      <div style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
        {posts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 'var(--space-12)' }}>
            <p style={{ color: 'var(--color-text-subtle)', marginBottom: 'var(--space-4)' }}>No posts yet.</p>
            <Link href="/admin/posts/new" className="btn btn--primary">Create your first post</Link>
          </div>
        ) : (
          <table className="block-table">
              <thead>
                <tr>
                    <th>Title</th>
                    <th>Status</th>
                    <th>Author</th>
                    <th>Date</th>
                    <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {posts.map(post => (
                  <tr key={post.id}>
                      <td><Link href={`/admin/posts/${post.id}`} style={{ fontWeight: 600 }}>{post.title}</Link></td>
                      <td><span className="badge" style={{ background: post.status === 'PUBLISHED' ? 'var(--color-success)' : 'var(--color-warning)', color: '#000' }}>{post.status}</span></td>
                      <td>{post.author.name}</td>
                      <td>{new Date(post.publishedAt || post.createdAt).toLocaleDateString()}</td>
                      <td><Link href={`/admin/posts/${post.id}`} className="btn btn--ghost" style={{ padding: 'var(--space-1) var(--space-2)', fontSize: 'var(--text-xs)' }}>Edit</Link></td>
                  </tr>
                ))}
              </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

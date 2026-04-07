import Link from 'next/link';

export default async function AdminDashboard() {
  // Hardcoded for now per requirements, or we can fetch metrics.
  // We'll just hardcode 0s if no metrics available per requirements.
  const stats = [
    { label: 'Total Posts', value: '0' },
    { label: 'Published', value: '0' },
    { label: 'Drafts', value: '0' },
    { label: 'Total Views', value: '0' },
  ];

  return (
    <div>
      <div className="admin-topbar">
         <h1 className="admin-page-title">Dashboard</h1>
         <Link href="/admin/posts/new" className="btn btn--primary">
           + New Post
         </Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-6)', marginBottom: 'var(--space-12)' }}>
         {stats.map((stat, i) => (
            <div key={i} className="admin-stat-card">
               <div className="admin-stat-label">{stat.label}</div>
               <div className="admin-stat-value">{stat.value}</div>
            </div>
         ))}
      </div>

      <div className="section-header">
         <h2 className="section-title">Recent Posts</h2>
      </div>
      
      <div style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
         <table className="block-table">
            <thead>
               <tr>
                  <th>Title</th>
                  <th>Status</th>
                  <th>Date</th>
               </tr>
            </thead>
            <tbody>
               <tr>
                 <td colSpan={3} style={{ textAlign: 'center', padding: 'var(--space-8)' }}>No posts found.</td>
               </tr>
            </tbody>
         </table>
      </div>
    </div>
  );
}

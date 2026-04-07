import Link from 'next/link';

// Dummy data for dashboard overview
const stats = [
  { label: 'Total Views', value: '142.5K', trend: '+12%' },
  { label: 'Published Posts', value: '84', trend: '+3' },
  { label: 'Subscribers', value: '12.4K', trend: '+5.2%' },
];

export default function AdminDashboard() {
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
               <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-success)', fontWeight: 600 }}>{stat.trend} this month</div>
            </div>
         ))}
      </div>

      <div className="section-header">
         <h2 className="section-title">Recent Activity</h2>
      </div>
      
      <div style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-6)' }}>
         <div style={{ color: 'var(--color-text-subtle)', textAlign: 'center', padding: 'var(--space-8) 0' }}>
            Activity graph goes here
         </div>
      </div>
    </div>
  );
}

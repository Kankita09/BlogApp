import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  // In a real app with next-auth or custom middleware, we would check the session here.
  // For this scaffold, we assume the user is authenticated since it's an admin area.

  const navItems = [
    { label: 'Dashboard', href: '/admin/dashboard', icon: '📊' },
    { label: 'Posts', href: '/admin/posts', icon: '📝' },
    { label: 'Settings', href: '/admin/settings', icon: '⚙️' },
  ];

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <Link href="/blog" className="admin-sidebar__logo" style={{ display: 'block' }}>
           TCB Admin
        </Link>
        <nav style={{ padding: 'var(--space-2) 0' }}>
           {navItems.map((item) => (
              <Link key={item.href} href={item.href as any} className="admin-nav-item">
                 <span>{item.icon}</span>
                 {item.label}
              </Link>
           ))}
        </nav>
      </aside>
      <main className="admin-main">
         {children}
      </main>
    </div>
  );
}

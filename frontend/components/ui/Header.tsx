'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';

const NAV_LINKS = [
  { href: '/blog',                 label: 'Blog' },
  { href: '/blog/category/tech',   label: 'Tech' },
  { href: '/blog/category/business', label: 'Business' },
  { href: '/blog/category/culture', label: 'Culture' },
  { href: '/subscribe',            label: 'Subscribe' },
];

export function Header() {
  const pathname = usePathname();
  const router   = useRouter();
  const [query,  setQuery]  = useState('');
  const [open,   setOpen]   = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  // Close search on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim().length < 2) return;
    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    setOpen(false);
    setQuery('');
  };

  return (
    <header className="header" role="banner">
      <div className="container header__inner">
        {/* Logo */}
        <Link href="/blog" className="header__logo" aria-label="The Corporate Blog — Home">
          TCB
        </Link>

        {/* Nav */}
        <nav className="header__nav" aria-label="Main navigation">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href as any}
              className={`header__nav-link${pathname === href ? ' header__nav-link--active' : ''}`}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Search */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          {open ? (
            <form onSubmit={handleSearch} style={{ display: 'flex' }}>
              <div className="search-bar" style={{ padding: 'var(--space-2) var(--space-4)' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--color-text-subtle)', flexShrink: 0 }}>
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
                <input
                  ref={inputRef}
                  id="header-search"
                  type="search"
                  placeholder="Search articles…"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  aria-label="Search articles"
                  style={{ width: 200 }}
                />
                <button type="button" onClick={() => setOpen(false)} aria-label="Close search"
                  style={{ color: 'var(--color-text-subtle)', lineHeight: 1 }}>✕</button>
              </div>
            </form>
          ) : (
            <button
              id="header-search-btn"
              className="header__search-btn"
              onClick={() => setOpen(true)}
              aria-label="Open search"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              Search
            </button>
          )}

          <Link href={"/admin/dashboard" as any} className="btn btn--primary" style={{ padding: 'var(--space-2) var(--space-4)', fontSize: 'var(--text-sm)' }}>
            Dashboard
          </Link>
        </div>
      </div>
    </header>
  );
}

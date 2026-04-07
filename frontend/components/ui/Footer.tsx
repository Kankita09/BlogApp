import Link from 'next/link';

const FOOTER_LINKS = {
  Blog: [
    { label: 'Latest Articles', href: '/blog' },
    { label: 'Tech',            href: '/blog/category/tech' },
    { label: 'Business',        href: '/blog/category/business' },
    { label: 'Culture',         href: '/blog/category/culture' },
  ],
  Company: [
    { label: 'About Us',    href: '/about' },
    { label: 'Write for Us', href: '/write-for-us' },
    { label: 'Advertise',   href: '/advertise' },
    { label: 'Contact',     href: '/contact' },
  ],
  Legal: [
    { label: 'Privacy Policy',    href: '/privacy' },
    { label: 'Terms of Service',  href: '/terms' },
    { label: 'Cookie Policy',     href: '/cookies' },
    { label: 'Sitemap',           href: '/sitemap.xml' },
  ],
};

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer" role="contentinfo">
      <div className="container">
        <div className="footer__grid">
          {/* Brand */}
          <div>
            <div style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'var(--text-xl)',
              fontWeight: 700,
              background: 'linear-gradient(135deg, var(--color-primary-light), var(--color-accent))',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: 'var(--space-3)',
            }}>
              The Corporate Blog
            </div>
            <p className="footer__brand-desc">
              Insights, analysis, and stories from the intersection of business, tech, and culture.
              Written by practitioners for practitioners.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([section, links]) => (
            <div key={section}>
              <p className="footer__heading">{section}</p>
              <ul className="footer__links">
                {links.map(({ label, href }) => (
                  <li key={href}>
                    <Link href={href as any} className="footer__link">{label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="footer__bottom">
          <span>© {year} The Corporate Blog. All rights reserved.</span>
          <span style={{ color: 'var(--color-text-subtle)', fontSize: 'var(--text-xs)' }}>
            Built with Next.js · Hosted on Vercel
          </span>
        </div>
      </div>
    </footer>
  );
}

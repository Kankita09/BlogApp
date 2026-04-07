import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Page Not Found',
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div style={{
      minHeight: '70vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: '2rem',
    }}>
      <p style={{ fontSize: '7rem', fontWeight: 900, lineHeight: 1, color: 'var(--color-primary)', opacity: 0.15 }}>
        404
      </p>
      <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.25rem', fontWeight: 800, marginTop: '-2rem', marginBottom: '1rem' }}>
        Page Not Found
      </h1>
      <p style={{ color: 'var(--color-text-muted)', maxWidth: 420, marginBottom: '2rem', lineHeight: 1.8 }}>
        The page you&apos;re looking for doesn&apos;t exist or has been moved. It may have been unpublished.
      </p>
      <Link href="/blog" className="btn btn--primary">
        ← Back to Blog
      </Link>
    </div>
  );
}

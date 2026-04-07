import React from 'react';

export function SkeletonText({ lines = 1, width = '100%' }: { lines?: number; width?: string | number }) {
  return (
    <div style={{ width: width === '100%' ? '100%' : width }}>
      {Array.from({ length: lines }).map((_, i) => (
        <div 
          key={i} 
          className="skeleton skeleton--text" 
          style={{ width: i === lines - 1 && lines > 1 ? '70%' : '100%' }} 
        />
      ))}
    </div>
  );
}

export function SkeletonTitle() {
  return <div className="skeleton skeleton--title" />;
}

export function SkeletonImage({ aspect = '16/9' }: { aspect?: string }) {
  return <div className="skeleton skeleton--image" style={{ aspectRatio: aspect }} />;
}

export function SkeletonAvatar() {
  return <div className="skeleton skeleton--avatar" />;
}

export function SkeletonCard() {
  return (
    <div className="skeleton--card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-xl)', overflow: 'hidden' }}>
      <SkeletonImage />
      <div style={{ padding: '0 var(--space-4) var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', flex: 1 }}>
        <div style={{ width: '30%' }}><SkeletonText /></div>
        <SkeletonTitle />
        <div style={{ flex: 1 }}><SkeletonText lines={3} /></div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginTop: 'auto', paddingTop: 'var(--space-3)', borderTop: '1px solid var(--color-border)' }}>
          <SkeletonAvatar />
          <div style={{ width: 80 }}><SkeletonText /></div>
          <div style={{ width: 60, marginLeft: 'auto' }}><SkeletonText /></div>
        </div>
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="posts-grid">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

export function SkeletonArticle() {
  return (
    <div className="article-layout">
      <div className="article-body">
        <div className="article-header" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
           <div style={{ width: 100 }}><SkeletonText /></div>
           <div className="skeleton skeleton--title" style={{ width: '100%', height: '3em' }} />
           <div className="skeleton skeleton--title" style={{ width: '60%', height: '3em' }} />
           <div style={{ width: '80%' }}><SkeletonText lines={2} /></div>
        </div>
        <SkeletonImage aspect="21/9" />
        <div style={{ marginTop: 'var(--space-8)', display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
           <SkeletonText lines={5} />
           <SkeletonText lines={4} />
           <div style={{ width: '50%' }}><SkeletonTitle /></div>
           <SkeletonText lines={6} />
        </div>
      </div>
      <aside className="article-sidebar" style={{ display: 'none' }}>
        {/* Hidden on small screens, normally ToC goes here */}
      </aside>
    </div>
  );
}

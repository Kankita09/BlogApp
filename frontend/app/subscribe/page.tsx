'use client';
import { useState } from 'react';

export default function SubscribePage() {
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubscribed(true);
  };

  return (
    <div className="container" style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingTop: 'var(--space-12)' }}>
      <div style={{ maxWidth: 440, width: '100%', background: 'var(--color-bg-card)', padding: 'var(--space-12)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', textAlign: 'center' }}>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--text-4xl)', fontWeight: 800, marginBottom: 'var(--space-4)' }}>Subscribe</h1>
        
        {subscribed ? (
          <div style={{ color: 'var(--color-success)', fontSize: 'var(--text-lg)', fontWeight: 600, padding: 'var(--space-6) 0' }}>
            Thanks for subscribing!
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--space-4)' }}>Get the latest articles directly in your inbox.</p>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <input type="text" className="form-input" placeholder="Your Name" required />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <input type="email" className="form-input" placeholder="Email Address" required />
            </div>
            <button type="submit" className="btn btn--primary" style={{ width: '100%', marginTop: 'var(--space-2)' }}>Subscribe Now</button>
          </form>
        )}
      </div>
    </div>
  );
}

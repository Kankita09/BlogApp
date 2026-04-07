'use client';
import { useState } from 'react';

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState('general');
  const [toast, setToast] = useState(false);

  const handleSave = () => {
    setToast(true);
    setTimeout(() => setToast(false), 3000);
  };

  return (
    <div>
      <div className="admin-topbar">
         <h1 className="admin-page-title">Settings</h1>
      </div>

      <div style={{ display: 'flex', gap: 'var(--space-6)' }}>
        <div style={{ width: 200, display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          <button className={`btn btn--ghost ${activeTab === 'general' ? 'admin-nav-item--active' : ''}`} style={{ textAlign: 'left' }} onClick={() => setActiveTab('general')}>General</button>
          <button className={`btn btn--ghost ${activeTab === 'seo' ? 'admin-nav-item--active' : ''}`} style={{ textAlign: 'left' }} onClick={() => setActiveTab('seo')}>SEO</button>
          <button className={`btn btn--ghost ${activeTab === 'integrations' ? 'admin-nav-item--active' : ''}`} style={{ textAlign: 'left' }} onClick={() => setActiveTab('integrations')}>Integrations</button>
        </div>
        
        <div style={{ flex: 1, background: 'var(--color-bg-card)', padding: 'var(--space-8)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
          {activeTab === 'general' && (
            <div>
              <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, marginBottom: 'var(--space-6)' }}>General Settings</h2>
              <div className="form-group">
                <label className="form-label">Site Name</label>
                <input type="text" className="form-input" defaultValue="The Corporate Blog" />
              </div>
              <div className="form-group">
                <label className="form-label">Site Description</label>
                <textarea className="form-textarea" defaultValue="Insights, guides, and stories from the world of business and technology." />
              </div>
              <button className="btn btn--primary" onClick={handleSave}>Save Settings</button>
            </div>
          )}
          {activeTab === 'seo' && (
            <div>
              <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, marginBottom: 'var(--space-6)' }}>SEO Configuration</h2>
              <div className="form-group">
                <label className="form-label">Default Title Format</label>
                <input type="text" className="form-input" defaultValue="%s | The Corporate Blog" />
              </div>
              <div className="form-group">
                <label className="form-label">Twitter Handle</label>
                <input type="text" className="form-input" defaultValue="@thecorporateblog" />
              </div>
              <button className="btn btn--primary" onClick={handleSave}>Save Settings</button>
            </div>
          )}
          {activeTab === 'integrations' && (
            <div>
              <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, marginBottom: 'var(--space-6)' }}>Integrations</h2>
              <div className="form-group">
                <label className="form-label">Google Analytics ID</label>
                <input type="text" className="form-input" placeholder="G-XXXXXXXX" />
              </div>
              <button className="btn btn--primary" onClick={handleSave}>Save Settings</button>
            </div>
          )}
        </div>
      </div>

      {toast && (
        <div style={{ position: 'fixed', bottom: 24, right: 24, background: 'var(--color-success)', color: '#000', padding: '12px 24px', borderRadius: 'var(--radius-md)', fontWeight: 600, boxShadow: 'var(--shadow-lg)' }}>
          Saved!
        </div>
      )}
    </div>
  );
}

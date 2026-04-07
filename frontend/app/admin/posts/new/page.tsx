'use client';

import { useState } from 'react';
import { Block, BlockType } from '@/types';

export default function EditorPage() {
  const [title, setTitle] = useState('');
  const [blocks, setBlocks] = useState<Block[]>([]);

  const addBlock = (type: BlockType) => {
    let data: any = {};
    if (type === 'paragraph') data = { text: '' };
    else if (type === 'heading') data = { level: 2, text: '' };
    else if (type === 'image') data = { cloudinaryId: '', altText: '', width: 1200, height: 630 };
    
    setBlocks([...blocks, { type, data } as any]);
  };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <div className="admin-topbar">
         <h1 className="admin-page-title">New Post</h1>
         <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
            <button className="btn btn--outline">Save Draft</button>
            <button className="btn btn--primary">Publish</button>
         </div>
      </div>

      <div style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-8)' }}>
         <div className="form-group">
            <input 
              type="text" 
              placeholder="Post Title..." 
              style={{ fontSize: 'var(--text-3xl)', fontWeight: 800, background: 'transparent', border: 'none', outline: 'none', color: 'var(--color-text)', width: '100%', marginBottom: 'var(--space-6)' }}
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
         </div>

         <div className="block-editor">
            {blocks.map((block, idx) => (
               <div key={idx} className="block-editor-item">
                  <div className="block-editor-handle">☰</div>
                  <div className="block-editor-content">
                     {block.type === 'paragraph' && (
                        <textarea 
                           className="form-textarea" 
                           placeholder="Paragraph text..." 
                           style={{ minHeight: 80 }}
                        />
                     )}
                     {block.type === 'heading' && (
                        <input 
                           type="text" 
                           className="form-input" 
                           placeholder="Heading text..." 
                           style={{ fontSize: 'var(--text-xl)', fontWeight: 700 }}
                        />
                     )}
                  </div>
                  <div className="block-editor-actions">
                     <button className="btn btn--ghost" style={{ padding: 'var(--space-1)' }} onClick={() => setBlocks(blocks.filter((_, i) => i !== idx))}>🗑</button>
                  </div>
               </div>
            ))}
         </div>

         <div style={{ marginTop: 'var(--space-8)', display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
            <button className="btn btn--outline" onClick={() => addBlock('paragraph')}>+ Paragraph</button>
            <button className="btn btn--outline" onClick={() => addBlock('heading')}>+ Heading</button>
            <button className="btn btn--outline" onClick={() => addBlock('image')}>+ Image</button>
            <button className="btn btn--outline" onClick={() => addBlock('code')}>+ Code</button>
         </div>
      </div>
    </div>
  );
}

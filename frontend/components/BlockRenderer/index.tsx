import React from 'react';
import Image from 'next/image';
import { Block, BlockType } from '@/types';
import { cloudinaryUrl } from '@/lib/cloudinary';

interface BlockRendererProps {
  blocks: Block[];
}

export function BlockRenderer({ blocks }: BlockRendererProps) {
  if (!blocks || !blocks.length) return null;

  return (
    <div className="block-content">
      {blocks.map((block, index) => {
        const BlockComponent = BlockMap[block.type];
        if (!BlockComponent) {
          console.warn(`Unknown block type: ${block.type}`);
          return null;
        }
        return <BlockComponent key={index} data={block.data as any} />;
      })}
    </div>
  );
}

// ─── Block Components ────────────────────────────────────────────────────────

function HeadingBlock({ data }: { data: { level: number; text: string } }) {
  const Tag = `h${data.level}` as keyof JSX.IntrinsicElements;
  const id = data.text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  return <Tag id={id} className={`block-h${data.level}`}>{data.text}</Tag>;
}

function ParagraphBlock({ data }: { data: { text: string } }) {
  // Support basic inline formatting (bold, italic) if needed, but keeping it simple and safe
  return <p className="block-paragraph">{data.text}</p>;
}

function ListBlock({ data }: { data: { style: 'ordered' | 'unordered'; items: string[] } }) {
  const Tag = data.style === 'ordered' ? 'ol' : 'ul';
  return (
    <Tag className={`block-list block-list--${data.style}`}>
      {data.items.map((item, i) => <li key={i}>{item}</li>)}
    </Tag>
  );
}

function TableBlock({ data }: { data: { headers: string[]; rows: string[][] } }) {
  return (
    <div className="block-table-wrap">
      <table className="block-table">
        <thead>
          <tr>{data.headers.map((h, i) => <th key={i}>{h}</th>)}</tr>
        </thead>
        <tbody>
          {data.rows.map((row, i) => (
            <tr key={i}>{row.map((cell, j) => <td key={j}>{cell}</td>)}</tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ImageBlock({ data }: { data: { cloudinaryId: string; altText: string; caption?: string; width: number; height: number } }) {
  const src = cloudinaryUrl(data.cloudinaryId, { width: 1200 });
  return (
    <figure className="block-image-wrap">
      <Image 
        src={src} 
        alt={data.altText} 
        width={data.width || 1200} 
        height={data.height || 630} 
        style={{ width: '100%', height: 'auto' }} 
      />
      {data.caption && <figcaption className="block-image-caption">{data.caption}</figcaption>}
    </figure>
  );
}

function BlockquoteBlock({ data }: { data: { text: string; cite?: string } }) {
  return (
    <blockquote className="block-blockquote">
      <p>{data.text}</p>
      {data.cite && <cite>— {data.cite}</cite>}
    </blockquote>
  );
}

function YoutubeBlock({ data }: { data: { videoId: string; title: string } }) {
  return (
    <div className="block-youtube">
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${data.videoId}`}
        title={data.title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        loading="lazy"
      />
    </div>
  );
}

function CalloutBlock({ data }: { data: { type: 'info' | 'warning' | 'success' | 'error'; text: string; title?: string } }) {
  const icons = { info: 'ℹ️', warning: '⚠️', success: '✅', error: '🚨' };
  return (
    <div className={`block-callout block-callout--${data.type}`}>
      <div className="block-callout__icon">{icons[data.type]}</div>
      <div className="block-callout__body">
        {data.title && <div className="block-callout__title">{data.title}</div>}
        <div className="block-callout__text">{data.text}</div>
      </div>
    </div>
  );
}

function FAQBlock({ data }: { data: { items: { question: string; answer: string }[] } }) {
  return (
    <div className="block-faq">
      {data.items.map((item, i) => (
        <details key={i} className="block-faq-item">
          <summary className="block-faq-question">
            {item.question}
            <span style={{ fontSize: '0.8em' }}>▼</span>
          </summary>
          <div className="block-faq-answer">{item.answer}</div>
        </details>
      ))}
    </div>
  );
}

function CodeBlock({ data }: { data: { language: string; code: string; filename?: string } }) {
  return (
    <div className="block-code-wrap">
      {data.filename && (
        <div className="block-code-header">
          <span className="block-code-filename">{data.filename}</span>
          <span className="block-code-lang">{data.language}</span>
        </div>
      )}
      <div className="block-code">
        <pre><code>{data.code}</code></pre>
      </div>
    </div>
  );
}

// Map block types to components
const BlockMap: Record<BlockType, React.FC<{ data: any }>> = {
  heading: HeadingBlock,
  paragraph: ParagraphBlock,
  list: ListBlock,
  table: TableBlock,
  image: ImageBlock,
  blockquote: BlockquoteBlock,
  youtube: YoutubeBlock,
  callout: CalloutBlock,
  faq: FAQBlock,
  code: CodeBlock,
};

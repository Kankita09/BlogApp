'use client';

import { useEffect, useState } from 'react';
import { Block } from '@/types';

interface ToCProps {
  blocks: Block[];
}

interface ToCItem {
  id: string;
  text: string;
  level: 2 | 3;
}

export function TableOfContents({ blocks }: ToCProps) {
  const [activeId, setActiveId] = useState<string>('');
  
  // Extract headings H2 and H3
  const headings = blocks
    .filter(b => b.type === 'heading' && (b.data.level === 2 || b.data.level === 3))
    .map(b => {
      const text = (b.data as any).text;
      return {
        id: text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        text,
        level: (b.data as any).level as 2 | 3,
      };
    });

  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Find all intersecting headers
        const intersecting = entries.filter((entry) => entry.isIntersecting);
        if (intersecting.length > 0) {
          // If multiple are visible, pick the first one (top-most)
          setActiveId(intersecting[0].target.id);
        }
      },
      { rootMargin: '-80px 0px -80% 0px' } // Trigger when crossing the top portion of screen
    );

    headings.forEach((heading) => {
      const element = document.getElementById(heading.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <nav className="toc" aria-label="Table of contents">
      <div className="toc__title">On this page</div>
      <ul className="toc__list">
        {headings.map((heading) => (
          <li key={heading.id}>
            <a
              href={`#${heading.id}`}
              onClick={(e) => {
                e.preventDefault();
                const target = document.getElementById(heading.id);
                if (target) {
                   // Offset for sticky header
                   const top = target.getBoundingClientRect().top + window.scrollY - 100;
                   window.scrollTo({ top, behavior: 'smooth' });
                   setActiveId(heading.id);
                }
              }}
              className={`toc__item toc__item--h${heading.level} ${activeId === heading.id ? 'toc__item--active' : ''}`}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

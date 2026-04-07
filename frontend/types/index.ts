// ─── API Types ────────────────────────────────────────────────────────────────

export type Role = 'ADMIN' | 'EDITOR' | 'WRITER';
export type PostStatus = 'DRAFT' | 'PUBLISHED' | 'SCHEDULED';

export interface Author {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
}

export interface BannerImage {
  id: string;
  cloudinaryId: string;
  url: string;
  altText: string;
  width: number | null;
  height: number | null;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  isSponsored: boolean;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  status: PostStatus;
  author: Author;
  bannerImage: BannerImage | null;
  categories: { category: Category }[];
  _count: { views: number };
}

export interface PostWithContent extends Post {
  content: Block[];
}

// ─── Block Types ──────────────────────────────────────────────────────────────

export type BlockType =
  | 'heading'
  | 'paragraph'
  | 'list'
  | 'table'
  | 'image'
  | 'blockquote'
  | 'youtube'
  | 'faq'
  | 'callout'
  | 'code';

export interface HeadingBlock {
  type: 'heading';
  data: { level: 1 | 2 | 3 | 4 | 5 | 6; text: string };
}

export interface ParagraphBlock {
  type: 'paragraph';
  data: { text: string };
}

export interface ListBlock {
  type: 'list';
  data: { style: 'ordered' | 'unordered'; items: string[] };
}

export interface TableBlock {
  type: 'table';
  data: { headers: string[]; rows: string[][] };
}

export interface ImageBlock {
  type: 'image';
  data: {
    cloudinaryId: string;
    url: string;
    altText: string;
    caption?: string;
    width: number;
    height: number;
  };
}

export interface BlockquoteBlock {
  type: 'blockquote';
  data: { text: string; cite?: string };
}

export interface YoutubeBlock {
  type: 'youtube';
  data: { videoId: string; title: string };
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface FAQBlock {
  type: 'faq';
  data: { items: FAQItem[] };
}

export interface CalloutBlock {
  type: 'callout';
  data: { type: 'info' | 'warning' | 'success' | 'error'; text: string; title?: string };
}

export interface CodeBlock {
  type: 'code';
  data: { language: string; code: string; filename?: string };
}

export type Block =
  | HeadingBlock
  | ParagraphBlock
  | ListBlock
  | TableBlock
  | ImageBlock
  | BlockquoteBlock
  | YoutubeBlock
  | FAQBlock
  | CalloutBlock
  | CodeBlock;

// ─── API Response Types ───────────────────────────────────────────────────────

export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface SearchResult {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  publishedAt: string | null;
  rank: number;
}

// ─── ToC Types ────────────────────────────────────────────────────────────────

export interface ToCItem {
  id: string;
  text: string;
  level: 2 | 3;
}

import { Metadata } from 'next';
import { Post, PostWithContent, FAQBlock, Block } from '@/types';

const SITE_URL = process.env['NEXT_PUBLIC_SITE_URL'] ?? 'http://localhost:3000';
const SITE_NAME = process.env['NEXT_PUBLIC_SITE_NAME'] ?? 'The Corporate Blog';

// ─── Base metadata ────────────────────────────────────────────────────────────

export function buildBaseMetadata(overrides?: Partial<Metadata>): Metadata {
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: SITE_NAME, template: `%s | ${SITE_NAME}` },
    description: 'Insights, guides, and stories from the world of business and technology.',
    robots: { index: true, follow: true },
    openGraph: {
      siteName: SITE_NAME,
      type: 'website',
      locale: 'en_US',
    },
    twitter: { card: 'summary_large_image', site: '@thecorporateblog' },
    ...overrides,
  };
}

// ─── Post metadata ────────────────────────────────────────────────────────────

export function buildPostMetadata(post: PostWithContent): Metadata {
  const title = post.seoTitle ?? post.title;
  const description = post.seoDescription ?? post.excerpt ?? '';
  const url = `${SITE_URL}/blog/${post.slug}`;
  const image = post.bannerImage?.url ?? `${SITE_URL}/og-default.jpg`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: 'article',
      publishedTime: post.publishedAt ?? undefined,
      modifiedTime: post.updatedAt,
      authors: [post.author.name],
      images: [{ url: image, width: 1200, height: 630, alt: title }],
    },
    twitter: { card: 'summary_large_image', title, description, images: [image] },
  };
}

// ─── Category metadata ────────────────────────────────────────────────────────

export function buildCategoryMetadata(
  name: string,
  slug: string,
  description?: string | null,
): Metadata {
  const title = `${name} Articles`;
  const desc = description ?? `Browse all articles in the ${name} category.`;
  const url = `${SITE_URL}/blog/category/${slug}`;
  return {
    title,
    description: desc,
    alternates: { canonical: url },
    openGraph: { title, description: desc, url },
  };
}

// ─── Author metadata ──────────────────────────────────────────────────────────

export function buildAuthorMetadata(name: string, slug: string): Metadata {
  const title = `Articles by ${name}`;
  const desc = `Read all articles written by ${name} on ${SITE_NAME}.`;
  const url = `${SITE_URL}/blog/author/${slug}`;
  return {
    title,
    description: desc,
    alternates: { canonical: url },
    openGraph: { title, description: desc, url },
  };
}

// ─── JSON-LD generators ───────────────────────────────────────────────────────

export function buildArticleJsonLd(post: PostWithContent): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    image: post.bannerImage?.url,
    author: {
      '@type': 'Person',
      name: post.author.name,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
    },
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_URL}/blog/${post.slug}` },
  };
}

export function buildBreadcrumbJsonLd(
  items: { name: string; url: string }[],
): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function buildFaqJsonLd(blocks: Block[]): object | null {
  const faqBlocks = blocks.filter((b): b is FAQBlock => b.type === 'faq');
  if (!faqBlocks.length) return null;

  const questions = faqBlocks.flatMap((b) =>
    b.data.items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  );

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: questions,
  };
}

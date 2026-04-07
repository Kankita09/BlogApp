import { prisma } from '../config/database';
import { PostStatus } from '@prisma/client';

export interface SitemapEntry {
  slug: string;
  publishedAt: Date | null;
  updatedAt: Date;
}

export async function getSitemapEntries(): Promise<SitemapEntry[]> {
  return prisma.post.findMany({
    where: { status: PostStatus.PUBLISHED },
    select: { slug: true, publishedAt: true, updatedAt: true },
    orderBy: { publishedAt: 'desc' },
  });
}

export function buildSitemapXml(entries: SitemapEntry[], baseUrl: string): string {
  const urls = entries
    .map(
      ({ slug, publishedAt, updatedAt }) => `
  <url>
    <loc>${baseUrl}/blog/${slug}</loc>
    <lastmod>${(updatedAt ?? publishedAt ?? new Date()).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`,
    )
    .join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/blog</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>${urls}
</urlset>`;
}

import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env['NEXT_PUBLIC_SITE_URL'] ?? 'http://localhost:3000';
  const apiUrl  = process.env['NEXT_PUBLIC_API_URL']  ?? 'http://localhost:4000/api';

  let postEntries: MetadataRoute.Sitemap = [];

  try {
    const res  = await fetch(`${apiUrl}/posts/latest?page=1&limit=50`, { next: { revalidate: 3600 } });
    const data = await res.json() as { data: { slug: string; updatedAt: string; publishedAt: string | null }[] };
    postEntries = (data.data ?? []).map((p) => ({
      url:            `${siteUrl}/blog/${p.slug}`,
      lastModified:   new Date(p.updatedAt ?? p.publishedAt ?? Date.now()),
      changeFrequency: 'weekly' as const,
      priority:        0.8,
    }));
  } catch {
    // Gracefully degrade — static pages still included
  }

  return [
    { url: siteUrl,         lastModified: new Date(), changeFrequency: 'daily',  priority: 1.0 },
    { url: `${siteUrl}/blog`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    ...postEntries,
  ];
}

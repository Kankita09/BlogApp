import { prisma } from '../config/database';
import { parsePagination, buildPaginatedResult } from '../utils/pagination';

interface SearchResult {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  publishedAt: Date | null;
  rank: number;
}

export async function searchPosts(
  query: string,
  page: number,
  limit: number,
  sort: 'relevance' | 'date',
) {
  // Sanitize and format query for tsvector
  const sanitized = query
    .trim()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(Boolean)
    .join(' & ');

  if (!sanitized) return buildPaginatedResult([], 0, parsePagination({ page, limit }));

  const skip = (page - 1) * limit;

  // Weighted full-text search: title (A), content (B)
  // using raw SQL for tsvector ranking
  const orderClause = sort === 'date' ? 'p."published_at" DESC' : 'rank DESC, p."published_at" DESC';

  const rows = await prisma.$queryRaw<SearchResult[]>`
    SELECT
      p.id,
      p.title,
      p.slug,
      p.excerpt,
      p.published_at AS "publishedAt",
      ts_rank(
        setweight(to_tsvector('english', coalesce(p.title, '')), 'A') ||
        setweight(to_tsvector('english', coalesce(p.excerpt, '')), 'B') ||
        setweight(to_tsvector('english', coalesce(p.content::text, '')), 'C'),
        to_tsquery('english', ${sanitized + ':*'})
      ) AS rank
    FROM posts p
    WHERE
      p.status = 'PUBLISHED'
      AND (
        setweight(to_tsvector('english', coalesce(p.title, '')), 'A') ||
        setweight(to_tsvector('english', coalesce(p.excerpt, '')), 'B') ||
        setweight(to_tsvector('english', coalesce(p.content::text, '')), 'C')
      ) @@ to_tsquery('english', ${sanitized + ':*'})
    ORDER BY ${Prisma.raw(orderClause)}
    LIMIT ${limit}
    OFFSET ${skip}
  `;

  const countRows = await prisma.$queryRaw<[{ count: bigint }]>`
    SELECT COUNT(*) as count FROM posts p
    WHERE p.status = 'PUBLISHED'
    AND (
      setweight(to_tsvector('english', coalesce(p.title, '')), 'A') ||
      setweight(to_tsvector('english', coalesce(p.excerpt, '')), 'B') ||
      setweight(to_tsvector('english', coalesce(p.content::text, '')), 'C')
    ) @@ to_tsquery('english', ${sanitized + ':*'}
  )`;

  const total = Number(countRows[0]?.count ?? 0);

  return buildPaginatedResult(rows, total, { page, limit, skip });
}

// Make Prisma raw import available
import { Prisma } from '@prisma/client';

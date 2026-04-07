import { Post, PostWithContent, PaginatedResponse, ApiResponse, SearchResult } from '@/types';

const API_URL = process.env['NEXT_PUBLIC_API_URL'] ?? 'http://localhost:4000/api';

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

async function fetcher<T>(
  path: string,
  options?: RequestInit & { tags?: string[]; revalidate?: number },
): Promise<T> {
  const { tags, revalidate, ...init } = options ?? {};

  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...(init.headers ?? {}) },
    next: { tags, revalidate: revalidate ?? 900 },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: 'Unknown error' }));
    throw new ApiError(res.status, body.error ?? res.statusText);
  }

  return res.json() as Promise<T>;
}

// ─── Posts ────────────────────────────────────────────────────────────────────

export async function getPostBySlug(slug: string): Promise<PostWithContent> {
  const res = await fetcher<ApiResponse<PostWithContent>>(`/posts/slug/${slug}`, {
    tags: [`post-${slug}`],
  });
  return res.data;
}

export async function getLatestPosts(page = 1, limit = 9): Promise<PaginatedResponse<Post>> {
  return fetcher<PaginatedResponse<Post>>(`/posts/latest?page=${page}&limit=${limit}`, {
    tags: ['posts'],
  });
}

export async function getPopularPosts(limit = 5): Promise<Post[]> {
  const res = await fetcher<ApiResponse<Post[]>>(`/posts/popular?limit=${limit}`, {
    tags: ['posts-popular'],
  });
  return res.data;
}

export async function getInternalSuggestions(postId: string): Promise<Post[]> {
  const res = await fetcher<ApiResponse<Post[]>>(`/posts/${postId}/internal-suggestions`, {
    tags: [`suggestions-${postId}`],
  });
  return res.data;
}

export async function getPostsByCategory(
  slug: string,
  page = 1,
): Promise<PaginatedResponse<Post>> {
  return fetcher<PaginatedResponse<Post>>(
    `/posts/categories/${slug}/posts?page=${page}&limit=9`,
    { tags: [`category-${slug}`] },
  );
}

export async function getPostsByAuthor(
  slug: string,
  page = 1,
): Promise<PaginatedResponse<Post>> {
  return fetcher<PaginatedResponse<Post>>(
    `/posts/authors/${slug}/posts?page=${page}&limit=9`,
    { tags: [`author-${slug}`] },
  );
}

// ─── Search (SSR — no cache) ──────────────────────────────────────────────────

export async function searchPosts(
  q: string,
  page = 1,
  sort: 'relevance' | 'date' = 'relevance',
): Promise<PaginatedResponse<SearchResult>> {
  return fetcher<PaginatedResponse<SearchResult>>(
    `/search?q=${encodeURIComponent(q)}&page=${page}&sort=${sort}`,
    { revalidate: 0 },
  );
}

// ─── View tracking (fire-and-forget) ─────────────────────────────────────────

export async function recordView(slug: string): Promise<void> {
  try {
    await fetch(`${API_URL}/posts/${slug}/view`, { method: 'POST' });
  } catch {
    // silently ignore
  }
}

export { ApiError };

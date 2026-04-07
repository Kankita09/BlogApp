import { PostStatus, Prisma } from '@prisma/client';
import { prisma } from '../config/database';
import { AppError } from '../utils/AppError';
import { generateSlug, generateUniqueSlug } from '../utils/slug';
import { parsePagination, buildPaginatedResult, PaginatedResult } from '../utils/pagination';
import { env } from '../config/env';

const POST_SELECT = {
  id: true,
  title: true,
  slug: true,
  excerpt: true,
  seoTitle: true,
  seoDescription: true,
  isSponsored: true,
  publishedAt: true,
  createdAt: true,
  updatedAt: true,
  status: true,
  author: { select: { id: true, name: true, email: true, avatar: true } },
  bannerImage: { select: { id: true, url: true, altText: true, width: true, height: true } },
  categories: { select: { category: { select: { id: true, name: true, slug: true } } } },
  _count: { select: { views: true } },
} satisfies Prisma.PostSelect;

const POST_WITH_CONTENT_SELECT = {
  ...POST_SELECT,
  content: true,
} satisfies Prisma.PostSelect;

export async function getPostBySlug(slug: string) {
  const post = await prisma.post.findFirst({
    where: { slug, status: PostStatus.PUBLISHED },
    select: POST_WITH_CONTENT_SELECT,
  });

  if (!post) throw new AppError('Post not found', 404);
  return post;
}

export async function getPostByIdInternal(id: string) {
  const post = await prisma.post.findUnique({
    where: { id },
    select: POST_WITH_CONTENT_SELECT,
  });
  if (!post) throw new AppError('Post not found', 404);
  return post;
}

export async function getPopularPosts(limit = 5) {
  // Join view count via _count for no N+1
  return prisma.post.findMany({
    where: { status: PostStatus.PUBLISHED },
    select: POST_SELECT,
    orderBy: { views: { _count: 'desc' } },
    take: limit,
  });
}

export async function getLatestPosts(query: Record<string, unknown>) {
  const { page, limit, skip } = parsePagination(query);
  const where: Prisma.PostWhereInput = { status: PostStatus.PUBLISHED };

  const [posts, total] = await prisma.$transaction([
    prisma.post.findMany({ where, select: POST_SELECT, orderBy: { publishedAt: 'desc' }, skip, take: limit }),
    prisma.post.count({ where }),
  ]);

  return buildPaginatedResult(posts, total, { page, limit, skip });
}

export async function getInternalSuggestions(postId: string, limit = 4) {
  const post = await prisma.post.findUnique({
    where: { id: postId },
    select: { categories: { select: { categoryId: true } } },
  });
  if (!post) return [];

  const categoryIds = post.categories.map((c) => c.categoryId);

  return prisma.post.findMany({
    where: {
      id: { not: postId },
      status: PostStatus.PUBLISHED,
      categories: categoryIds.length ? { some: { categoryId: { in: categoryIds } } } : undefined,
    },
    select: POST_SELECT,
    orderBy: { publishedAt: 'desc' },
    take: limit,
  });
}

export async function createPost(
  data: {
    title: string;
    slug?: string;
    content: Prisma.InputJsonValue;
    excerpt?: string;
    seoTitle?: string;
    seoDescription?: string;
    bannerImageId?: string;
    categoryIds?: string[];
    isSponsored?: boolean;
  },
  authorId: string,
) {
  const slug = data.slug ?? generateUniqueSlug(data.title);

  // Check slug uniqueness
  const existing = await prisma.post.findUnique({ where: { slug } });
  if (existing) throw new AppError('A post with this slug already exists', 409);

  const post = await prisma.post.create({
    data: {
      title: data.title,
      slug,
      content: data.content,
      excerpt: data.excerpt,
      seoTitle: data.seoTitle,
      seoDescription: data.seoDescription,
      bannerImageId: data.bannerImageId,
      isSponsored: data.isSponsored ?? false,
      authorId,
      status: PostStatus.DRAFT,
      categories: data.categoryIds?.length
        ? { create: data.categoryIds.map((id) => ({ categoryId: id })) }
        : undefined,
    },
    select: POST_WITH_CONTENT_SELECT,
  });

  return post;
}

export async function updatePost(
  id: string,
  data: Partial<{
    title: string;
    slug: string;
    content: Prisma.InputJsonValue;
    excerpt: string;
    seoTitle: string;
    seoDescription: string;
    bannerImageId: string;
    categoryIds: string[];
    isSponsored: boolean;
  }>,
) {
  const existing = await prisma.post.findUnique({ where: { id } });
  if (!existing) throw new AppError('Post not found', 404);

  if (data.slug && data.slug !== existing.slug) {
    const slugConflict = await prisma.post.findUnique({ where: { slug: data.slug } });
    if (slugConflict) throw new AppError('Slug already in use', 409);
  }

  const post = await prisma.$transaction(async (tx) => {
    if (data.categoryIds !== undefined) {
      await tx.postCategory.deleteMany({ where: { postId: id } });
    }

    return tx.post.update({
      where: { id },
      data: {
        ...(data.title && { title: data.title }),
        ...(data.slug && { slug: data.slug }),
        ...(data.content && { content: data.content }),
        ...(data.excerpt !== undefined && { excerpt: data.excerpt }),
        ...(data.seoTitle !== undefined && { seoTitle: data.seoTitle }),
        ...(data.seoDescription !== undefined && { seoDescription: data.seoDescription }),
        ...(data.bannerImageId !== undefined && { bannerImageId: data.bannerImageId }),
        ...(data.isSponsored !== undefined && { isSponsored: data.isSponsored }),
        ...(data.categoryIds?.length && {
          categories: { create: data.categoryIds.map((cid) => ({ categoryId: cid })) },
        }),
      },
      select: POST_WITH_CONTENT_SELECT,
    });
  });

  return post;
}

export async function publishPost(id: string, scheduledAt?: string) {
  const existing = await prisma.post.findUnique({ where: { id } });
  if (!existing) throw new AppError('Post not found', 404);

  const now = new Date();
  const scheduled = scheduledAt ? new Date(scheduledAt) : null;
  const isImmediate = !scheduled || scheduled <= now;

  const post = await prisma.$transaction(async (tx) => {
    const updated = await tx.post.update({
      where: { id },
      data: {
        status: isImmediate ? PostStatus.PUBLISHED : PostStatus.SCHEDULED,
        publishedAt: isImmediate ? now : null,
        scheduledAt: scheduled ?? null,
      },
      select: POST_WITH_CONTENT_SELECT,
    });

    await tx.auditLog.create({
      data: {
        postId: id,
        userId: existing.authorId,
        action: isImmediate ? 'PUBLISHED' : 'SCHEDULED',
        metadata: { scheduledAt: scheduled?.toISOString() },
      },
    });

    return updated;
  });

  // Trigger ISR revalidation on Next.js frontend
  if (isImmediate) {
    void triggerISRRevalidation(post.slug);
  }

  return post;
}

async function triggerISRRevalidation(slug: string): Promise<void> {
  try {
    const url = `${env.FRONTEND_URL}/api/revalidate?secret=${env.REVALIDATION_SECRET}&slug=${slug}`;
    const resp = await fetch(url, { method: 'POST' });
    if (!resp.ok) {
      console.warn(`ISR revalidation failed for slug="${slug}": ${resp.status}`);
    }
  } catch (err) {
    console.warn('ISR revalidation request failed:', err);
  }
}

export async function getPostsByCategory(slug: string, query: Record<string, unknown>): Promise<PaginatedResult<unknown>> {
  const category = await prisma.category.findUnique({ where: { slug } });
  if (!category) throw new AppError('Category not found', 404);

  const { page, limit, skip } = parsePagination(query);
  const where: Prisma.PostWhereInput = {
    status: PostStatus.PUBLISHED,
    categories: { some: { categoryId: category.id } },
  };

  const [posts, total] = await prisma.$transaction([
    prisma.post.findMany({ where, select: POST_SELECT, orderBy: { publishedAt: 'desc' }, skip, take: limit }),
    prisma.post.count({ where }),
  ]);

  return buildPaginatedResult(posts, total, { page, limit, skip });
}

export async function getPostsByAuthor(slug: string, query: Record<string, unknown>): Promise<PaginatedResult<unknown>> {
  // Author identified by email-based slug derived from name
  const authorSlug = generateSlug(slug);
  const users = await prisma.user.findMany({ where: {} });
  const author = users.find((u) => generateSlug(u.name) === authorSlug);
  if (!author) throw new AppError('Author not found', 404);

  const { page, limit, skip } = parsePagination(query);
  const where: Prisma.PostWhereInput = { status: PostStatus.PUBLISHED, authorId: author.id };

  const [posts, total] = await prisma.$transaction([
    prisma.post.findMany({ where, select: POST_SELECT, orderBy: { publishedAt: 'desc' }, skip, take: limit }),
    prisma.post.count({ where }),
  ]);

  return buildPaginatedResult(posts, total, { page, limit, skip });
}

export async function getAllPublishedSlugs(): Promise<string[]> {
  const posts = await prisma.post.findMany({
    where: { status: PostStatus.PUBLISHED },
    select: { slug: true },
    orderBy: { publishedAt: 'desc' },
  });
  return posts.map((p) => p.slug);
}

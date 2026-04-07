import { Request, Response, NextFunction } from 'express';
import { createPostSchema, updatePostSchema, publishPostSchema } from '../validators/post.validator';
import * as postService from '../services/post.service';
import * as viewService from '../services/view.service';
import { AuthenticatedRequest } from '../middleware/auth';
import { parsePagination } from '../utils/pagination';

export async function getPostBySlug(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const post = await postService.getPostBySlug(req.params['slug']!);
    res.json({ success: true, data: post });
  } catch (err) { next(err); }
}

export async function getPopularPosts(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const limit = Math.min(20, Number(req.query['limit']) || 5);
    const posts = await postService.getPopularPosts(limit);
    res.json({ success: true, data: posts });
  } catch (err) { next(err); }
}

export async function getLatestPosts(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await postService.getLatestPosts(req.query as Record<string, unknown>);
    res.json({ success: true, ...result });
  } catch (err) { next(err); }
}

export async function getInternalSuggestions(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const posts = await postService.getInternalSuggestions(req.params['id']!);
    res.json({ success: true, data: posts });
  } catch (err) { next(err); }
}

export async function createPost(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = createPostSchema.parse(req.body);
    const post = await postService.createPost(
      { ...data, content: data.content as unknown as import('@prisma/client').Prisma.InputJsonValue },
      req.user!.id,
    );
    res.status(201).json({ success: true, data: post });
  } catch (err) { next(err); }
}

export async function updatePost(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = updatePostSchema.parse(req.body);
    const post = await postService.updatePost(req.params['id']!, data as Parameters<typeof postService.updatePost>[1]);
    res.json({ success: true, data: post });
  } catch (err) { next(err); }
}

export async function publishPost(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { scheduledAt } = publishPostSchema.parse(req.body);
    const post = await postService.publishPost(req.params['id']!, scheduledAt);
    res.json({ success: true, data: post });
  } catch (err) { next(err); }
}

export async function getByCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await postService.getPostsByCategory(req.params['slug']!, req.query as Record<string, unknown>);
    res.json({ success: true, ...result });
  } catch (err) { next(err); }
}

export async function getByAuthor(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await postService.getPostsByAuthor(req.params['slug']!, req.query as Record<string, unknown>);
    res.json({ success: true, ...result });
  } catch (err) { next(err); }
}

export async function recordView(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ?? req.ip ?? '0.0.0.0';
    const ua = req.headers['user-agent'] ?? '';
    await viewService.recordView(req.params['slug']!, ip, ua);
    res.json({ success: true });
  } catch (err) { next(err); }
}

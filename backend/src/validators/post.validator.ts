import { z } from 'zod';

const blockSchema = z.object({
  type: z.enum([
    'heading',
    'paragraph',
    'list',
    'table',
    'image',
    'blockquote',
    'youtube',
    'faq',
    'callout',
    'code',
  ]),
  data: z.record(z.unknown()),
});

export const createPostSchema = z.object({
  title: z.string().min(3).max(500),
  slug: z.string().min(3).max(500).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens').optional(),
  content: z.array(blockSchema).min(1, 'Content must have at least one block'),
  excerpt: z.string().max(500).optional(),
  seoTitle: z.string().max(160).optional(),
  seoDescription: z.string().max(320).optional(),
  bannerImageId: z.string().uuid().optional(),
  categoryIds: z.array(z.string().uuid()).optional(),
  isSponsored: z.boolean().default(false),
});

export const updatePostSchema = createPostSchema.partial();

export const publishPostSchema = z.object({
  scheduledAt: z.string().datetime().optional(),
});

export const createCategorySchema = z.object({
  name: z.string().min(2).max(255),
  slug: z.string().min(2).max(255).regex(/^[a-z0-9-]+$/).optional(),
  description: z.string().max(1000).optional(),
});

export type CreatePostInput = z.infer<typeof createPostSchema>;
export type UpdatePostInput = z.infer<typeof updatePostSchema>;
export type PublishPostInput = z.infer<typeof publishPostSchema>;
export type CreateCategoryInput = z.infer<typeof createCategorySchema>;

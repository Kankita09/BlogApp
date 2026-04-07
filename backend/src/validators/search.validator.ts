import { z } from 'zod';

export const searchSchema = z.object({
  q: z.string().min(2, 'Search query must be at least 2 characters').max(200),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(20).default(10),
  sort: z.enum(['relevance', 'date']).default('relevance'),
});

export type SearchInput = z.infer<typeof searchSchema>;

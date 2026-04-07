import { Request, Response, NextFunction } from 'express';
import { searchSchema } from '../validators/search.validator';
import { searchPosts } from '../services/search.service';

export async function search(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { q, page, limit, sort } = searchSchema.parse(req.query);
    const result = await searchPosts(q, page, limit, sort);
    res.json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
}

import { prisma } from '../config/database';
import { hashViewIdentity } from '../utils/hash';
import { AppError } from '../utils/AppError';

export async function recordView(postId: string, ip: string, userAgent: string): Promise<void> {
  const { ipHash, uaHash } = hashViewIdentity(ip, userAgent);

  // Use upsert to silently skip duplicates (unique constraint on postId+ipHash+uaHash)
  try {
    await prisma.postView.create({ data: { postId, ipHash, uaHash } });
  } catch (err) {
    // Unique constraint violation = already counted, ignore
    if (
      typeof err === 'object' &&
      err !== null &&
      'code' in err &&
      (err as { code: string }).code === 'P2002'
    ) {
      return;
    }
    throw err;
  }
}

export async function getViewCount(postId: string): Promise<number> {
  const post = await prisma.post.findUnique({ where: { id: postId } });
  if (!post) throw new AppError('Post not found', 404);

  return prisma.postView.count({ where: { postId } });
}

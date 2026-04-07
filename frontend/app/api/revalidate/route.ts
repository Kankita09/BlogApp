import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';

export async function POST(req: NextRequest): Promise<NextResponse> {
  const secret = req.nextUrl.searchParams.get('secret');
  const slug   = req.nextUrl.searchParams.get('slug');

  if (secret !== process.env['REVALIDATION_SECRET']) {
    return NextResponse.json({ error: 'Invalid secret' }, { status: 401 });
  }

  if (slug) {
    revalidateTag(`post-${slug}`);
    revalidatePath(`/blog/${slug}`);
  }

  // Always revalidate the blog homepage and popular posts
  revalidateTag('posts');
  revalidateTag('posts-popular');
  revalidatePath('/blog');

  return NextResponse.json({ revalidated: true, slug, ts: Date.now() });
}

import { Request, Response, NextFunction } from 'express';
import { getSitemapEntries, buildSitemapXml } from '../services/sitemap.service';
import { env } from '../config/env';
import { prisma } from '../config/database';

export async function getSitemap(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const entries = await getSitemapEntries();
    const baseUrl = env.FRONTEND_URL;
    const xml = buildSitemapXml(entries, baseUrl);
    res.setHeader('Content-Type', 'application/xml');
    res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=3600');
    res.send(xml);
  } catch (err) {
    next(err);
  }
}

export function getHealth(_req: Request, res: Response): void {
  res.json({
    success: true,
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
}

export async function getMetrics(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const [postCount, userCount, viewCount] = await prisma.$transaction([
      prisma.post.count({ where: { status: 'PUBLISHED' } }),
      prisma.user.count(),
      prisma.postView.count(),
    ]);

    res.json({
      success: true,
      data: {
        publishedPosts: postCount,
        users: userCount,
        totalViews: viewCount,
        memoryMB: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        uptimeSeconds: Math.round(process.uptime()),
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function affiliateRedirect(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { slug } = req.params as { slug: string };
    const link = await prisma.affiliateLink.findUnique({ where: { slug } });
    if (!link) {
      res.status(404).json({ success: false, error: 'Affiliate link not found' });
      return;
    }
    // Increment click count async — don't await so redirect is instant
    void prisma.affiliateLink.update({
      where: { slug },
      data: { clicks: { increment: 1 } },
    });
    res.redirect(301, link.targetUrl);
  } catch (err) {
    next(err);
  }
}

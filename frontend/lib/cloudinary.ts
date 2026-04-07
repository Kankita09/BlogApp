const CLOUD_NAME = process.env['NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME'] ?? '';
const BASE = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload`;

interface CloudinaryOptions {
  width?: number;
  height?: number;
  quality?: number | 'auto';
  format?: 'auto' | 'webp' | 'avif';
  crop?: 'fill' | 'fit' | 'scale' | 'thumb';
  gravity?: string;
}

/**
 * Build an optimised Cloudinary URL.
 * Defaults: format=auto, quality=auto (serves WebP/AVIF based on Accept header)
 */
export function cloudinaryUrl(publicId: string, opts: CloudinaryOptions = {}): string {
  const {
    width,
    height,
    quality = 'auto',
    format = 'auto',
    crop = 'fill',
    gravity = 'auto',
  } = opts;

  const transforms: string[] = [
    `f_${format}`,
    `q_${quality}`,
    crop && `c_${crop}`,
    gravity && `g_${gravity}`,
    width && `w_${width}`,
    height && `h_${height}`,
  ]
    .filter(Boolean)
    .join(',');

  return `${BASE}/${transforms}/${publicId}`;
}

/**
 * Returns a srcSet string for responsive images.
 * widths: array of pixel widths to generate (e.g. [400, 800, 1200])
 */
export function cloudinarySrcSet(publicId: string, widths: number[]): string {
  return widths
    .map((w) => `${cloudinaryUrl(publicId, { width: w })} ${w}w`)
    .join(', ');
}

/**
 * Build a thumbnail URL (small preview used in post cards).
 */
export function cloudinaryThumb(publicId: string, width = 800): string {
  return cloudinaryUrl(publicId, { width, crop: 'fill', gravity: 'auto' });
}

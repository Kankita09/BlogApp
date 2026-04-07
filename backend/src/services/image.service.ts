import { cloudinary } from '../config/cloudinary';
import { prisma } from '../config/database';
import { AppError } from '../utils/AppError';

interface UploadResult {
  id: string;
  url: string;
  cloudinaryId: string;
  width: number;
  height: number;
}

export async function uploadImage(
  filePath: string,
  altText: string,
  options?: { title?: string; caption?: string },
): Promise<UploadResult> {
  const result = await cloudinary.uploader.upload(filePath, {
    folder: 'tcb',
    resource_type: 'image',
    format: 'auto',
    quality: 'auto',
    transformation: [{ fetch_format: 'auto' }, { quality: 'auto' }],
  });

  const image = await prisma.image.create({
    data: {
      cloudinaryId: result.public_id,
      url: result.secure_url,
      altText,
      title: options?.title,
      caption: options?.caption,
      width: result.width,
      height: result.height,
    },
  });

  return {
    id: image.id,
    url: image.url,
    cloudinaryId: image.cloudinaryId,
    width: image.width ?? result.width,
    height: image.height ?? result.height,
  };
}

export async function deleteImage(imageId: string): Promise<void> {
  const image = await prisma.image.findUnique({ where: { id: imageId } });
  if (!image) throw new AppError('Image not found', 404);

  await cloudinary.uploader.destroy(image.cloudinaryId);
  await prisma.image.delete({ where: { id: imageId } });
}

export async function getCloudinarySignature(folder = 'tcb'): Promise<{
  signature: string;
  timestamp: number;
  cloudName: string;
  apiKey: string;
  folder: string;
}> {
  const timestamp = Math.round(Date.now() / 1000);
  const signature = cloudinary.utils.api_sign_request(
    { timestamp, folder },
    process.env['CLOUDINARY_API_SECRET'] ?? '',
  );

  return {
    signature,
    timestamp,
    cloudName: process.env['CLOUDINARY_CLOUD_NAME'] ?? '',
    apiKey: process.env['CLOUDINARY_API_KEY'] ?? '',
    folder,
  };
}

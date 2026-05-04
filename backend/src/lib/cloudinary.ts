import cloudinary, { AccessMode } from 'cloudinary';

import { env } from '@/env';

cloudinary.v2.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

export const uploadToCloudinary = async (
  filePath: string,
  fileName?: string,
  accessMode: AccessMode = 'public',
) => {
  if (
    !env.CLOUDINARY_CLOUD_NAME ||
    !env.CLOUDINARY_API_KEY ||
    !env.CLOUDINARY_API_SECRET
  ) {
    throw new Error(
      'Cloudinary credentials are missing. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET.',
    );
  }

  try {
    const data = await cloudinary.v2.uploader.upload(filePath, {
      filename_override: fileName,
      access_mode: accessMode,
      resource_type: 'auto',
    });
    return data;
  } catch (error) {
    const cloudinaryError = error as {
      message?: string;
      http_code?: number;
      name?: string;
    };

    const errorMessage = cloudinaryError?.message ?? 'Unknown Cloudinary error';

    if (errorMessage.includes('Upload preset must be specified')) {
      throw new Error(
        'Cloudinary attempted unsigned upload. Check CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET, or configure an unsigned upload preset explicitly.',
      );
    }

    throw new Error(`Cloudinary upload failed: ${errorMessage}`);
  }
};

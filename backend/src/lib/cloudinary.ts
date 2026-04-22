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
  try {
    const data = await cloudinary.v2.uploader.upload(filePath, {
      filename_override: fileName,
      access_mode: accessMode,
    });
    return data;
  } catch (error) {
    console.log(error);
    throw new Error('Internal Server Error (cloudinary)');
  }
};

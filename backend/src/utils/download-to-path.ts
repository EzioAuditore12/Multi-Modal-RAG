import fs from 'node:fs';
import path from 'node:path';
import fetch from 'node-fetch';

import mime from 'mime-types';

export async function downloadToPublic(url: string, filename?: string) {
  const res = await fetch(url);
  if (!res.ok || !res.body)
    throw new Error(`Failed to fetch file: ${res.statusText}`);

  let ext = '';
  if (!filename || !path.extname(filename)) {
    const contentType = res.headers.get('content-type');
    ext = mime.extension(contentType ? contentType : '') || '';
    if (ext) ext = '.' + ext;
    filename = (filename || 'file') + ext;
  }

  const destDir = path.join(__dirname, '../../public');
  if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });

  const dest = path.join(destDir, filename);
  const fileStream = fs.createWriteStream(dest);
  const body = res.body;

  await new Promise((resolve, reject) => {
    body.pipe(fileStream);
    body.on('error', reject);
    fileStream.on('error', reject);
    fileStream.on('finish', resolve);
  });

  return dest;
}

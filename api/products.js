import fs from 'fs/promises';
import path from 'path';

const IMAGES_DIR = path.join(process.cwd(), 'server', 'images');
const ALLOWED = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif']);

function titleFromFileName(fileName) {
  const match = fileName.match(/(?:jerysey|jersey)[-_]?(\d+)\.[^.]+$/i);
  return match ? `Design ${match[1]}` : 'Design';
}

function toDataUrl(buffer, fileName) {
  const ext = path.extname(fileName).toLowerCase();
  const mime = ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg' : ext === '.png' ? 'image/png' : ext === '.webp' ? 'image/webp' : 'image/gif';
  return `data:${mime};base64,${buffer.toString('base64')}`;
}

export default async function handler(req, res) {
  try {
    const files = await fs.readdir(IMAGES_DIR, { withFileTypes: true });

    const items = await Promise.all(
      files
        .filter((entry) => entry.isFile() && ALLOWED.has(path.extname(entry.name).toLowerCase()))
        .map(async (entry) => {
          const filePath = path.join(IMAGES_DIR, entry.name);
          const stats = await fs.stat(filePath);
          const buffer = await fs.readFile(filePath);

          return {
            id: entry.name,
            title: titleFromFileName(entry.name),
            category: 'football',
            url: toDataUrl(buffer, entry.name),
            mtime: stats.mtimeMs,
          };
        })
    );

    const sorted = items.sort((a, b) => b.mtime - a.mtime);

    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(200).json(sorted.map(({ id, title, category, url }) => ({ id, title, category, url })));
  } catch (error) {
    console.error('products api error', error);
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(500).json({ error: 'Unable to load products' });
  }
}

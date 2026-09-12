import fs from 'fs/promises';
import path from 'path';

const IMAGES_DIR = path.join(process.cwd(), 'server', 'images');
const ALLOWED = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif']);

function normalizeCategory(folder) {
  return folder.toLowerCase() === 'ocassion' ? 'occasion' : folder.toLowerCase();
}

function titleFromFileName(fileName, index) {
  const match = fileName.match(/(?:jerysey|jersey)[-_]?(\d+)\.[^.]+$/i);
  return match ? `Design ${match[1]}` : `Design ${index + 1}`;
}

function toDataUrl(buffer, fileName) {
  const ext = path.extname(fileName).toLowerCase();
  const mime = ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg' : ext === '.png' ? 'image/png' : ext === '.webp' ? 'image/webp' : 'image/gif';
  return `data:${mime};base64,${buffer.toString('base64')}`;
}

export default async function handler(req, res) {
  try {
    const folders = (await fs.readdir(IMAGES_DIR, { withFileTypes: true }))
      .filter((entry) => entry.isDirectory())
      .sort((a, b) => a.name.localeCompare(b.name));
    const items = [];

    for (const folder of folders) {
      const files = (await fs.readdir(path.join(IMAGES_DIR, folder.name), { withFileTypes: true }))
        .filter((entry) => entry.isFile() && ALLOWED.has(path.extname(entry.name).toLowerCase()))
        .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));

      for (const [index, file] of files.entries()) {
        const filePath = path.join(IMAGES_DIR, folder.name, file.name);
        const buffer = await fs.readFile(filePath);
        items.push({
          id: `${folder.name}/${file.name}`,
          title: titleFromFileName(file.name, index),
          category: normalizeCategory(folder.name),
          url: toDataUrl(buffer, file.name),
        });
      }
    }

    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(200).json(items);
  } catch (error) {
    console.error('products api error', error);
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(500).json({ error: 'Unable to load products' });
  }
}

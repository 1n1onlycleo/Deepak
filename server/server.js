import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const imagesDir = path.join(__dirname, 'images');
const allowedExtensions = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif']);

app.use(cors());
app.use('/images', express.static(imagesDir));

const catalogPattern = /^([a-z0-9]+(?:[-_][a-z0-9]+)*)[-_ ]?(?:jerysey|jersey)[-_]?(\d+)\.(jpg|jpeg|png|webp|gif)$/i;

const normalizeCategory = (raw) => {
  if (!raw) return 'uncategorized';

  const value = raw.toLowerCase().trim();

  if (['special-occasion', 'specialoccasion', 'occasion', 'ocassion', 'special occasion'].includes(value)) {
    return 'occasion';
  }

  return value.replace(/[_\s]+/g, '-');
};

const getCategoryAndOrder = (name) => {
  const match = name.match(catalogPattern);
  if (!match) return null;

  return {
    category: normalizeCategory(match[1]),
    order: Number(match[2]),
  };
};

const titleFromName = (name) => {
  const base = name
    .replace(/\.[^/.]+$/, '')
    .replace(/[-_]+/g, ' ')
    .replace(/^(football|cricket|school|party|occasion|ocassion|events)\s+/i, '')
    .trim();

  return base ? base.replace(/\b\w/g, (c) => c.toUpperCase()) : 'Jersey';
};

const readProducts = () => {
  const files = fs.readdirSync(imagesDir, { withFileTypes: true });
  const valid = [];
  const ignored = [];

  for (const file of files) {
    if (!file.isFile()) continue;

    const ext = path.extname(file.name).toLowerCase();
    if (!allowedExtensions.has(ext)) {
      ignored.push(file.name);
      continue;
    }

    const parsed = getCategoryAndOrder(file.name);
    if (!parsed) {
      ignored.push(file.name);
      continue;
    }

    valid.push({
      name: file.name,
      mtime: fs.statSync(path.join(imagesDir, file.name)).mtimeMs,
      order: parsed.order,
      category: parsed.category,
    });
  }

  if (ignored.length) {
    console.warn(`Ignored ${ignored.length} image file(s) in ${imagesDir}. Use names like football-jersey-1.jpg, cricket-jersey-1.jpg, school-jersey-1.jpg, party-jersey-1.jpg, events-jersey-1.jpg or occasion-jersey-1.jpg.`);
    console.warn('Ignored files:', ignored.join(', '));
  }

  return valid
    .sort((a, b) => a.order - b.order || b.mtime - a.mtime)
    .map((item) => ({
      id: item.name,
      title: titleFromName(item.name),
      category: item.category,
      url: '/images/' + encodeURIComponent(item.name),
    }));
};

app.get('/api/products', (req, res) => {
  res.json(readProducts());
});

app.listen(process.env.PORT || 4000, () => console.log('API on 4000'));

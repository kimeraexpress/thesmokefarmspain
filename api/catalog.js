// Vercel Serverless Function: GET /api/catalog
import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const catalogPath = path.join(process.cwd(), 'data', 'catalog.json');
    if (fs.existsSync(catalogPath)) {
      const data = fs.readFileSync(catalogPath, 'utf-8');
      return res.status(200).json(JSON.parse(data));
    }
    return res.status(404).json({ error: 'Catalog file not found' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

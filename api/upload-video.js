// Vercel Serverless Function: POST /api/upload-video
// Receives raw video binary (application/octet-stream) or JSON { filename, base64 }
// and commits it to assets/videos/ on GitHub using GITHUB_TOKEN.

async function readVideoBuffer(req) {
  // 1. JSON payload fallback { filename, base64 }
  if (req.body && typeof req.body === 'object' && !Buffer.isBuffer(req.body) && req.body.base64) {
    return Buffer.from(req.body.base64, 'base64');
  }

  // 2. Pre-parsed Buffer by Vercel runtime
  if (Buffer.isBuffer(req.body)) {
    return req.body;
  }

  // 3. Raw Node request stream (e.g. application/octet-stream)
  const chunks = [];
  try {
    for await (const chunk of req) {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    }
  } catch (_) {}

  if (chunks.length > 0) {
    return Buffer.concat(chunks);
  }

  if (typeof req.body === 'string' && req.body.length > 0) {
    return Buffer.from(req.body, 'binary');
  }

  return Buffer.alloc(0);
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Filename');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const token =
      process.env.GITHUB_TOKEN ||
      process.env.GH_TOKEN ||
      (req.headers.authorization || '').replace('Bearer ', '').replace('token ', '').trim();

    if (!token) {
      return res.status(500).json({
        error: 'GITHUB_TOKEN non configurato sul server Vercel. Impossibile caricare il video online.'
      });
    }

    const buffer = await readVideoBuffer(req);
    if (!buffer || buffer.length === 0) {
      return res.status(400).json({ error: 'File video vuoto o non leggibile' });
    }

    // Raw file limit check (~4.3MB to stay within Vercel's 4.5MB limit)
    if (buffer.length > 4.4 * 1024 * 1024) {
      return res.status(413).json({
        error: 'Video troppo pesante per upload diretto (max 4.2 MB). Ritaglia la clip o usa un link diretto.'
      });
    }

    let rawName =
      (req.query && req.query.filename) ||
      req.headers['x-filename'] ||
      (req.body && typeof req.body === 'object' && req.body.filename) ||
      `video_${Date.now()}.mp4`;

    try {
      rawName = decodeURIComponent(String(rawName));
    } catch (_) {}

    const baseClean = String(rawName)
      .replace(/[^a-zA-Z0-9._-]/g, '_')
      .replace(/^_+/, '') || 'video.mp4';

    // Ensure safe extension
    const hasValidExt = /\.(mp4|mov|webm|m4v)$/i.test(baseClean);
    const stampedName = `${Date.now()}_${hasValidExt ? baseClean : baseClean + '.mp4'}`;
    const filePath = `assets/videos/${stampedName}`;

    const repo = 'kimeraexpress/thesmokefarmspain';
    const url = `https://api.github.com/repos/${repo}/contents/${filePath}`;
    const ghHeaders = {
      'Authorization': `token ${token}`,
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'TheSmokeFarmVercelVideoUpload',
      'Content-Type': 'application/json'
    };

    // Check if file somehow exists to pass sha
    let sha = null;
    try {
      const getRes = await fetch(url, { headers: ghHeaders });
      if (getRes.ok) {
        const getJson = await getRes.json();
        sha = getJson.sha;
      }
    } catch (_) {}

    const b64Content = buffer.toString('base64');
    const putBody = {
      message: `upload(video): ${stampedName} via admin panel`,
      content: b64Content,
      branch: 'main',
      ...(sha ? { sha } : {})
    };

    const putRes = await fetch(url, {
      method: 'PUT',
      headers: ghHeaders,
      body: JSON.stringify(putBody)
    });

    if (!putRes.ok) {
      const errJson = await putRes.json().catch(() => ({}));
      return res.status(502).json({
        error: errJson.message || `Errore GitHub durante il caricamento (${putRes.status})`
      });
    }

    const rawUrl = `https://raw.githubusercontent.com/${repo}/main/${filePath}`;
    return res.status(200).json({
      status: 'ok',
      path: filePath,
      rawUrl,
      filename: stampedName,
      size: buffer.length
    });
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Errore interno upload video' });
  }
}

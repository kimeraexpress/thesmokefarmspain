// Vercel Serverless Function: POST /api/save-catalog
// Saves updated catalog to GitHub repository when GITHUB_TOKEN is available

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const catalog = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    if (!catalog || !catalog.categories) {
      return res.status(400).json({ error: 'Formato catalogo non valido' });
    }

    const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN || (req.headers.authorization || '').replace('Bearer ', '').replace('token ', '').trim();
    const repo = 'kimeraexpress/thesmokefarmspain';
    const filePath = 'data/catalog.json';

    if (token) {
      const url = `https://api.github.com/repos/${repo}/contents/${filePath}`;
      const headers = {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'TheSmokeFarmVercelSync'
      };

      // Get current sha
      let sha = null;
      try {
        const getRes = await fetch(url, { headers });
        if (getRes.ok) {
          const getJson = await getRes.json();
          sha = getJson.sha;
        }
      } catch (_) {}

      const jsonStr = JSON.stringify(catalog, null, 2);
      const b64 = Buffer.from(jsonStr, 'utf-8').toString('base64');

      const putRes = await fetch(url, {
        method: 'PUT',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `chore(catalog): update via vercel api [${new Date().toISOString().slice(0, 16)}]`,
          content: b64,
          branch: 'main',
          ...(sha ? { sha } : {})
        })
      });

      if (putRes.ok) {
        return res.status(200).json({ status: 'ok', syncedToGitHub: true });
      } else {
        const errJson = await putRes.json().catch(() => ({}));
        return res.status(200).json({ status: 'ok', syncedToGitHub: false, githubError: errJson.message });
      }
    }

    return res.status(200).json({ status: 'ok', syncedToGitHub: false, message: 'Nessun GITHUB_TOKEN configurato' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

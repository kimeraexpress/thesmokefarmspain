/**
 * THE SMOKE FARM SPAIN - Universal Data Storage & API Sync Layer (v3)
 * Manages Products, Categories, Subcategories, Media Uploads (Cloud & GitHub), and Admin Auth.
 */

const TSF_CONFIG = {
  STORAGE_KEY_CATALOG: 'tsf_catalog_data_v3',
  STORAGE_KEY_PASSWORD: 'tsf_admin_pwd_v2',
  STORAGE_KEY_SESSION: 'tsf_admin_session_v2',
  STORAGE_KEY_GH_TOKEN: 'tsf_admin_gh_token_v1',
  STORAGE_KEY_CLOUDINARY: 'tsf_admin_cloudinary_v1',
  GITHUB_REPO: 'kimeraexpress/thesmokefarmspain',
  DEFAULT_PASSWORD: 'tsfspain2026'
};

const DEFAULT_CATEGORIES = {
  ASH: ['STATIC', 'FRESH FROZEN', 'DRY SIFT', 'MOUSSE', 'DRY WORK'],
  WEED: ['EXOTIC INDOOR', 'CALI GENETICS', 'CALI TOPS', 'ORGANIC SOIL'],
  ICE: ['FULL MELT', 'LIVE ROSIN', 'BUBBLE HASH', '1ST WASH']
};

// =======================================================================
//  INDEXEDDB MEDIA STORE (Fallback Local Video Storage)
// =======================================================================
class MediaDB {
  constructor() {
    this.dbName = 'TSF_MediaStore_v3';
    this.storeName = 'media';
    this.db = null;
    this.initPromise = this.init();
  }

  init() {
    return new Promise((resolve) => {
      if (!window.indexedDB) {
        resolve(null);
        return;
      }
      try {
        const req = indexedDB.open(this.dbName, 1);
        req.onupgradeneeded = (e) => {
          const db = e.target.result;
          if (!db.objectStoreNames.contains(this.storeName)) {
            db.createObjectStore(this.storeName, { keyPath: 'id' });
          }
        };
        req.onsuccess = (e) => {
          this.db = e.target.result;
          resolve(this.db);
        };
        req.onerror = () => resolve(null);
      } catch (_) {
        resolve(null);
      }
    });
  }

  async saveMedia(id, blob) {
    await this.initPromise;
    if (!this.db) return false;
    return new Promise((resolve, reject) => {
      try {
        const tx = this.db.transaction(this.storeName, 'readwrite');
        const store = tx.objectStore(this.storeName);
        store.put({ id, blob, createdAt: Date.now() });
        tx.oncomplete = () => resolve(true);
        tx.onerror = () => resolve(false);
      } catch (e) {
        resolve(false);
      }
    });
  }

  async getMedia(id) {
    await this.initPromise;
    if (!this.db) return null;
    return new Promise((resolve) => {
      try {
        const tx = this.db.transaction(this.storeName, 'readonly');
        const store = tx.objectStore(this.storeName);
        const req = store.get(id);
        req.onsuccess = () => {
          if (req.result && req.result.blob) {
            resolve(req.result.blob);
          } else {
            resolve(null);
          }
        };
        req.onerror = () => resolve(null);
      } catch (_) {
        resolve(null);
      }
    });
  }

  async deleteMedia(id) {
    await this.initPromise;
    if (!this.db) return;
    return new Promise((resolve) => {
      try {
        const tx = this.db.transaction(this.storeName, 'readwrite');
        const store = tx.objectStore(this.storeName);
        store.delete(id);
        tx.oncomplete = () => resolve();
        tx.onerror = () => resolve();
      } catch (_) {
        resolve();
      }
    });
  }
}

const mediaDB = new MediaDB();
const blobUrlCache = new Map();

// =======================================================================
//  TSF STORAGE CONTROLLER
// =======================================================================
const TSF_Storage = {
  
  _catalog: null,
  _isSyncing: false,

  // Initialize storage: Smart reconciliation with server and local preservation
  async init() {
    // 1. Check local catalog first
    let localData = null;
    const local = localStorage.getItem(TSF_CONFIG.STORAGE_KEY_CATALOG);
    if (local) {
      try {
        localData = JSON.parse(local);
      } catch (_) {}
    }

    // 2. Fetch live catalog from server (with cache buster)
    let serverData = null;
    try {
      const res = await fetch('data/catalog.json?_t=' + Date.now(), { cache: 'no-store' });
      if (res.ok) {
        serverData = await res.json();
      }
    } catch (e) {
      console.warn('[TSF] Fetch live catalog offline/fallito:', e);
    }

    // 3. Smart reconciliation:
    // If local catalog has products and server has 0, NEVER overwrite local!
    if (localData && Array.isArray(localData.products) && localData.products.length > 0) {
      if (!serverData || !Array.isArray(serverData.products) || serverData.products.length === 0) {
        this._catalog = localData;
        this._normalizeCatalog();
        return this._catalog;
      }
      const localTime = localData.updatedAt || 0;
      const serverTime = serverData.updatedAt || 0;
      if (localTime >= serverTime) {
        this._catalog = localData;
      } else {
        this._catalog = serverData;
        this.saveLocally(this._catalog);
      }
      this._normalizeCatalog();
      return this._catalog;
    }

    // If server has data (and local had no products), use server
    if (serverData && serverData.categories) {
      this._catalog = serverData;
      this._normalizeCatalog();
      this.saveLocally(this._catalog);
      return this._catalog;
    }

    // Fallback to local or default
    if (localData && localData.categories) {
      this._catalog = localData;
    } else {
      this._catalog = {
        updatedAt: Date.now(),
        categories: JSON.parse(JSON.stringify(DEFAULT_CATEGORIES)),
        products: []
      };
    }
    this._normalizeCatalog();
    this.saveLocally(this._catalog);
    return this._catalog;
  },

  _normalizeCatalog() {
    if (!this._catalog) this._catalog = {};
    if (!this._catalog.categories) {
      this._catalog.categories = JSON.parse(JSON.stringify(DEFAULT_CATEGORIES));
    }
    ['ASH', 'WEED', 'ICE'].forEach(cat => {
      if (!Array.isArray(this._catalog.categories[cat])) {
        this._catalog.categories[cat] = DEFAULT_CATEGORIES[cat] ? [...DEFAULT_CATEGORIES[cat]] : [];
      }
    });
    if (!Array.isArray(this._catalog.products)) {
      this._catalog.products = [];
    }
  },

  getCatalog() {
    if (!this._catalog) {
      const local = localStorage.getItem(TSF_CONFIG.STORAGE_KEY_CATALOG);
      if (local) {
        try {
          this._catalog = JSON.parse(local);
          this._normalizeCatalog();
        } catch (_) {}
      }
      if (!this._catalog) {
        this._catalog = {
          categories: JSON.parse(JSON.stringify(DEFAULT_CATEGORIES)),
          products: []
        };
      }
    }
    return this._catalog;
  },

  // Save to LocalStorage and dispatch event
  saveLocally(catalog) {
    this._catalog = catalog;
    try {
      localStorage.setItem(TSF_CONFIG.STORAGE_KEY_CATALOG, JSON.stringify(catalog));
    } catch (e) {
      console.warn('LocalStorage pieno o disabilitato:', e);
    }
    window.dispatchEvent(new CustomEvent('tsf:catalog-updated', { detail: catalog }));
  },

  // Save to LocalStorage + Sync to GitHub (via Vercel API or direct token)
  async persistCatalog(catalog) {
    catalog.updatedAt = Date.now();
    this.saveLocally(catalog);

    let ghResult = { success: false, skipped: true };
    const token = this.getGitHubToken();

    // 1. Call Vercel Serverless Function /api/save-catalog
    try {
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = 'Bearer ' + token;
      const apiRes = await fetch('/api/save-catalog', {
        method: 'POST',
        headers,
        body: JSON.stringify(catalog)
      });
      if (apiRes.ok) {
        const json = await apiRes.json();
        if (json.syncedToGitHub) {
          ghResult = { success: true, message: 'Pubblicato live su Vercel!' };
        } else if (json.githubError) {
          ghResult = { success: false, message: json.githubError };
        }
      }
    } catch (_) {}

    // 2. Direct GitHub API commit fallback (if client has token and /api/save-catalog didn't succeed)
    if (!ghResult.success && token) {
      ghResult = await this.syncToGitHub(catalog);
    }

    return {
      success: true,
      savedToGitHub: Boolean(ghResult.success),
      ghMessage: ghResult.message || ''
    };
  },

  // =====================================================================
  //  GITHUB LIVE SYNC (Updates repo on GitHub, auto-triggers Vercel deploy)
  // =====================================================================
  getGitHubToken() {
    return localStorage.getItem(TSF_CONFIG.STORAGE_KEY_GH_TOKEN) || window.TSF_CONFIG_GH_TOKEN || '';
  },

  setGitHubToken(token) {
    const clean = (token || '').trim();
    if (clean) {
      localStorage.setItem(TSF_CONFIG.STORAGE_KEY_GH_TOKEN, clean);
    } else {
      localStorage.removeItem(TSF_CONFIG.STORAGE_KEY_GH_TOKEN);
    }
  },

  async syncToGitHub(catalog = null) {
    const cat = catalog || this.getCatalog();
    cat.updatedAt = Date.now();
    const token = this.getGitHubToken();

    if (this._isSyncing) return { success: false, message: 'Sincronizzazione già in corso' };
    this._isSyncing = true;

    try {
      // 1. First attempt: call /api/save-catalog (uses Vercel env or Bearer)
      try {
        const headers = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = 'Bearer ' + token;
        const apiRes = await fetch('/api/save-catalog', {
          method: 'POST',
          headers,
          body: JSON.stringify(cat)
        });
        if (apiRes.ok) {
          const json = await apiRes.json();
          if (json.syncedToGitHub) {
            return { success: true, message: 'Sincronizzato con GitHub e Vercel!' };
          }
          if (json.githubError) {
            return { success: false, message: json.githubError };
          }
        }
      } catch (_) {}

      // 2. Fallback direct to GitHub API
      if (!token) {
        return { success: false, needToken: true, message: 'Nessun token di pubblicazione configurato' };
      }

      const repo = TSF_CONFIG.GITHUB_REPO;
      const path = 'data/catalog.json';
      const url = 'https://api.github.com/repos/' + repo + '/contents/' + path;
      const headers = {
        'Authorization': 'token ' + token,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
      };

      let sha = null;
      try {
        const getRes = await fetch(url, { headers });
        if (getRes.ok) {
          const getJson = await getRes.json();
          sha = getJson.sha;
        }
      } catch (_) {}

      const jsonStr = JSON.stringify(cat, null, 2);
      const b64 = btoa(unescape(encodeURIComponent(jsonStr)));

      const body = {
        message: 'chore(catalog): update via admin panel [' + new Date().toISOString().slice(0, 16) + ']',
        content: b64,
        branch: 'main'
      };
      if (sha) body.sha = sha;

      const putRes = await fetch(url, {
        method: 'PUT',
        headers,
        body: JSON.stringify(body)
      });

      if (putRes.ok) {
        return { success: true, message: 'Sincronizzato con GitHub e Vercel!' };
      } else {
        const errJson = await putRes.json().catch(() => ({}));
        return { success: false, message: errJson.message || 'Errore commit GitHub' };
      }
    } catch (err) {
      return { success: false, message: err.message };
    } finally {
      this._isSyncing = false;
    }
  },

  hasLiveSync() {
    return Boolean(this.getGitHubToken());
  },

  // =====================================================================
  //  CATEGORIES & SUBCATEGORIES MANAGEMENT
  // =====================================================================
  getCategories() {
    const catalog = this.getCatalog();
    return catalog.categories;
  },

  getSubcategories(mainCat) {
    const categories = this.getCategories();
    return categories[mainCat] ? [...categories[mainCat]] : [];
  },

  async addSubcategory(mainCat, subcatName) {
    const catalog = this.getCatalog();
    const name = subcatName.trim().toUpperCase();
    if (!name) throw new Error('Il nome della sottocategoria non può essere vuoto');

    if (!catalog.categories[mainCat]) {
      catalog.categories[mainCat] = [];
    }

    if (catalog.categories[mainCat].includes(name)) {
      throw new Error(`La sottocategoria "${name}" esiste già in ${mainCat}`);
    }

    catalog.categories[mainCat].push(name);
    await this.persistCatalog(catalog);
    return catalog.categories[mainCat];
  },

  async editSubcategory(mainCat, oldName, newName) {
    const catalog = this.getCatalog();
    const oName = oldName.trim().toUpperCase();
    const nName = newName.trim().toUpperCase();

    if (!nName) throw new Error('Il nuovo nome non può essere vuoto');
    if (!catalog.categories[mainCat]) return;

    const idx = catalog.categories[mainCat].indexOf(oName);
    if (idx === -1) throw new Error(`Sottocategoria "${oName}" non trovata`);

    catalog.categories[mainCat][idx] = nName;

    let updatedProducts = 0;
    catalog.products.forEach(p => {
      if (p.category === mainCat && (p.subcategory || '').toUpperCase() === oName) {
        p.subcategory = nName;
        updatedProducts++;
      }
    });

    await this.persistCatalog(catalog);
    return { success: true, updatedProducts };
  },

  async deleteSubcategory(mainCat, subcatName) {
    const catalog = this.getCatalog();
    const name = subcatName.trim().toUpperCase();

    if (!catalog.categories[mainCat]) return;

    catalog.categories[mainCat] = catalog.categories[mainCat].filter(s => s !== name);

    const fallback = catalog.categories[mainCat][0] || 'GENERAL';
    catalog.products.forEach(p => {
      if (p.category === mainCat && (p.subcategory || '').toUpperCase() === name) {
        p.subcategory = fallback;
      }
    });

    await this.persistCatalog(catalog);
    return catalog.categories[mainCat];
  },

  getProductCountBySubcategory(mainCat, subcatName) {
    const catalog = this.getCatalog();
    const name = subcatName.toUpperCase();
    return catalog.products.filter(p => p.category === mainCat && (p.subcategory || '').toUpperCase() === name).length;
  },

  // =====================================================================
  //  PRODUCTS CRUD
  // =====================================================================
  getProducts() {
    const catalog = this.getCatalog();
    return catalog.products || [];
  },

  getProductById(id) {
    const catalog = this.getCatalog();
    return catalog.products.find(p => p.id === id) || null;
  },

  async saveProduct(productData) {
    const catalog = this.getCatalog();
    const isEdit = Boolean(productData.id && this.getProductById(productData.id));

    if (!productData.title || !productData.category) {
      throw new Error('Titolo e Categoria sono campi obbligatori');
    }

    if (isEdit) {
      const idx = catalog.products.findIndex(p => p.id === productData.id);
      catalog.products[idx] = { ...catalog.products[idx], ...productData };
    } else {
      const baseSlug = productData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const uniqueId = `${productData.category.toLowerCase()}-${baseSlug}-${Date.now().toString(36)}`;
      productData.id = uniqueId;
      catalog.products.unshift(productData);
    }

    const persistRes = await this.persistCatalog(catalog);
    return { product: productData, ...persistRes };
  },

  async deleteProduct(id) {
    const catalog = this.getCatalog();
    const initialLen = catalog.products.length;
    catalog.products = catalog.products.filter(p => p.id !== id);

    if (catalog.products.length !== initialLen) {
      const res = await this.persistCatalog(catalog);
      return res;
    }
    return { success: false };
  },

  // =====================================================================
  //  MEDIA / VIDEO UPLOAD (GitHub API + Cloudinary + Local Server + IDB)
  // =====================================================================
  async uploadMediaFile(file, onProgress) {
    if (!file) throw new Error('Nessun file selezionato');

    const cleanName = file.name.replace(/[^a-zA-Z0-9_\.-]/g, '_');
    const fileSizeMB = file.size / (1024 * 1024);

    if (onProgress) onProgress(15, 'Preparazione file...');

    // 1. Try GitHub direct upload if token is present and file <= 25MB
    const token = this.getGitHubToken();
    if (token && fileSizeMB <= 25) {
      try {
        if (onProgress) onProgress(30, 'Caricamento su server GitHub & Vercel CDN...');
        const arrayBuf = await file.arrayBuffer();
        let binary = '';
        const bytes = new Uint8Array(arrayBuf);
        const len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
          binary += String.fromCharCode(bytes[i]);
        }
        const b64 = btoa(binary);

        const videoPath = `assets/videos/${cleanName}`;
        const url = `https://api.github.com/repos/${TSF_CONFIG.GITHUB_REPO}/contents/${videoPath}`;
        const headers = {
          'Authorization': `token ${token}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json'
        };

        let sha = null;
        try {
          const getRes = await fetch(url, { headers });
          if (getRes.ok) {
            const getJson = await getRes.json();
            sha = getJson.sha;
          }
        } catch (_) {}

        const putBody = {
          message: `upload(video): ${cleanName} via admin panel`,
          content: b64,
          branch: 'main'
        };
        if (sha) putBody.sha = sha;

        const res = await fetch(url, {
          method: 'PUT',
          headers,
          body: JSON.stringify(putBody)
        });

        if (res.ok) {
          if (onProgress) onProgress(100, 'Video salvato su CDN!');
          return {
            path: videoPath,
            filename: cleanName,
            isOnline: true,
            previewUrl: URL.createObjectURL(file)
          };
        }
      } catch (e) {
        console.warn('[TSF] Upload GitHub fallito, provo fallback:', e);
      }
    }

    // 2. Try local server.py upload if running
    try {
      const formData = new FormData();
      formData.append('file', file, cleanName);

      const res = await fetch('/api/upload-video', {
        method: 'POST',
        body: formData
      });

      if (res.ok) {
        const json = await res.json();
        if (json.path) {
          if (onProgress) onProgress(100, 'Caricato su server!');
          return {
            path: json.path,
            filename: json.filename,
            isOnline: true,
            previewUrl: json.path
          };
        }
      }
    } catch (_) {}

    // 3. Fallback to IndexedDB (Works in local browser)
    try {
      const mediaId = `media_${Date.now()}_${cleanName}`;
      await mediaDB.saveMedia(mediaId, file);
      const objectUrl = URL.createObjectURL(file);
      blobUrlCache.set(mediaId, objectUrl);

      if (onProgress) onProgress(100, 'Video salvato in anteprima locale!');
      return {
        path: `idb:${mediaId}`,
        filename: cleanName,
        isOnline: false,
        previewUrl: objectUrl
      };
    } catch (e) {
      throw new Error('Impossibile salvare il video in memoria: ' + e.message);
    }
  },

  async resolveMediaUrl(path) {
    if (!path) return '';

    if (path.startsWith('idb:')) {
      const mediaId = path.replace('idb:', '');
      if (blobUrlCache.has(mediaId)) {
        return blobUrlCache.get(mediaId);
      }
      const blob = await mediaDB.getMedia(mediaId);
      if (blob) {
        const url = URL.createObjectURL(blob);
        blobUrlCache.set(mediaId, url);
        return url;
      }
      return '';
    }

    return path;
  },

  // =====================================================================
  //  ADMIN AUTHENTICATION & PASSWORD
  // =====================================================================
  getAdminPassword() {
    return localStorage.getItem(TSF_CONFIG.STORAGE_KEY_PASSWORD) || TSF_CONFIG.DEFAULT_PASSWORD;
  },

  setAdminPassword(newPassword) {
    const pwd = newPassword.trim();
    if (pwd.length < 4) {
      throw new Error('La password deve contenere almeno 4 caratteri');
    }
    localStorage.setItem(TSF_CONFIG.STORAGE_KEY_PASSWORD, pwd);
    return true;
  },

  verifyPassword(entered) {
    return entered === this.getAdminPassword();
  },

  isAdminLoggedIn() {
    return sessionStorage.getItem(TSF_CONFIG.STORAGE_KEY_SESSION) === 'authenticated';
  },

  loginAdmin(password) {
    if (this.verifyPassword(password)) {
      sessionStorage.setItem(TSF_CONFIG.STORAGE_KEY_SESSION, 'authenticated');
      return true;
    }
    return false;
  },

  logoutAdmin() {
    sessionStorage.removeItem(TSF_CONFIG.STORAGE_KEY_SESSION);
  },

  // =====================================================================
  //  EXPORT, IMPORT & RESET
  // =====================================================================
  exportCatalogJson() {
    const catalog = this.getCatalog();
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(catalog, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute("href", dataStr);
    dlAnchor.setAttribute("download", `THE_SMOKE_FARM_SPAIN_CATALOG_${new Date().toISOString().slice(0,10)}.json`);
    document.body.appendChild(dlAnchor);
    dlAnchor.click();
    dlAnchor.remove();
  },

  async importCatalogJson(jsonString) {
    try {
      const data = JSON.parse(jsonString);
      if (!data.categories || !Array.isArray(data.products)) {
        throw new Error('Formato JSON non valido: mancano categories o products');
      }
      await this.persistCatalog(data);
      return true;
    } catch (e) {
      throw new Error('Errore durante l\'importazione: ' + e.message);
    }
  },

  async resetToDefaults() {
    const defaultCatalog = {
      categories: JSON.parse(JSON.stringify(DEFAULT_CATEGORIES)),
      products: []
    };
    await this.persistCatalog(defaultCatalog);
    return true;
  }
};

window.TSF_Storage = TSF_Storage;

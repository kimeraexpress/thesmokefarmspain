/**
 * THE SMOKE FARM SPAIN - Universal Data Storage & API Sync Layer
 * Manages Products, Categories, Subcategories, Media Uploads (IndexedDB & Server), and Admin Auth.
 */

const TSF_CONFIG = {
  STORAGE_KEY_CATALOG: 'tsf_catalog_data_v2',
  STORAGE_KEY_PASSWORD: 'tsf_admin_pwd_v2',
  STORAGE_KEY_SESSION: 'tsf_admin_session_v2',
  DEFAULT_PASSWORD: 'tsfspain2026'
};

const DEFAULT_CATEGORIES = {
  ASH: ['STATIC', 'FRESH FROZEN', 'DRY SIFT', 'MOUSSE', 'DRY WORK'],
  WEED: ['EXOTIC INDOOR', 'CALI GENETICS', 'CALI TOPS', 'ORGANIC SOIL'],
  ICE: ['FULL MELT', 'LIVE ROSIN', 'BUBBLE HASH', '1ST WASH']
};

// =======================================================================
//  INDEXEDDB MEDIA STORE (Large Video & Image Storage for Browsers)
// =======================================================================
class MediaDB {
  constructor() {
    this.dbName = 'TSF_MediaStore_v2';
    this.storeName = 'media';
    this.db = null;
    this.initPromise = this.init();
  }

  init() {
    return new Promise((resolve) => {
      if (!window.indexedDB) {
        console.warn('IndexedDB non supportato dal browser.');
        resolve(null);
        return;
      }
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
      req.onerror = () => {
        console.warn('Errore apertura IndexedDB');
        resolve(null);
      };
    });
  }

  async saveMedia(id, blob) {
    await this.initPromise;
    if (!this.db) return false;
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(this.storeName, 'readwrite');
      const store = tx.objectStore(this.storeName);
      store.put({ id, blob, createdAt: Date.now() });
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => reject(tx.error);
    });
  }

  async getMedia(id) {
    await this.initPromise;
    if (!this.db) return null;
    return new Promise((resolve) => {
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
    });
  }

  async deleteMedia(id) {
    await this.initPromise;
    if (!this.db) return;
    return new Promise((resolve) => {
      const tx = this.db.transaction(this.storeName, 'readwrite');
      const store = tx.objectStore(this.storeName);
      store.delete(id);
      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
    });
  }
}

const mediaDB = new MediaDB();
const blobUrlCache = new Map();

// =======================================================================
//  TSF STORAGE CONTROLLER
// =======================================================================
const TSF_Storage = {
  
  // Cache in memory
  _catalog: null,

  // Initialize storage: Loads local data or fetches from /api/catalog or catalog.json
  async init() {
    if (this._catalog) return this._catalog;

    // 1. Check LocalStorage
    const local = localStorage.getItem(TSF_CONFIG.STORAGE_KEY_CATALOG);
    if (local) {
      try {
        this._catalog = JSON.parse(local);
        this._normalizeCatalog();
        return this._catalog;
      } catch (e) {
        console.error('Errore parsing catalog da localStorage', e);
      }
    }

    // 2. Fetch from server API or static file
    try {
      const res = await fetch('data/catalog.json');
      if (res.ok) {
        const data = await res.json();
        this._catalog = data;
        this._normalizeCatalog();
        this.saveLocally(this._catalog);
        return this._catalog;
      }
    } catch (e) {
      console.warn('Impossibile caricare data/catalog.json via fetch, uso fallback predefinito', e);
    }

    // 3. Fallback to empty default
    this._catalog = {
      categories: JSON.parse(JSON.stringify(DEFAULT_CATEGORIES)),
      products: []
    };
    this._normalizeCatalog();
    this.saveLocally(this._catalog);
    return this._catalog;
  },

  _normalizeCatalog() {
    if (!this._catalog) this._catalog = {};
    if (!this._catalog.categories) {
      this._catalog.categories = JSON.parse(JSON.stringify(DEFAULT_CATEGORIES));
    }
    // Ensure all 3 main categories exist
    ['ASH', 'WEED', 'ICE'].forEach(cat => {
      if (!Array.isArray(this._catalog.categories[cat])) {
        this._catalog.categories[cat] = DEFAULT_CATEGORIES[cat] ? [...DEFAULT_CATEGORIES[cat]] : [];
      }
    });
    if (!Array.isArray(this._catalog.products)) {
      this._catalog.products = [];
    }
  },

  // Get current catalog synchronously (after init)
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

  // Save catalog locally and broadcast event
  saveLocally(catalog) {
    this._catalog = catalog;
    localStorage.setItem(TSF_CONFIG.STORAGE_KEY_CATALOG, JSON.stringify(catalog));
    window.dispatchEvent(new CustomEvent('tsf:catalog-updated', { detail: catalog }));
  },

  // Save to both LocalStorage and Server API
  async persistCatalog(catalog) {
    this.saveLocally(catalog);

    // Try saving to Server API in background
    try {
      const res = await fetch('/api/save-catalog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(catalog)
      });
      if (res.ok) {
        return { success: true, savedToServer: true };
      }
    } catch (err) {
      // Server not running, persisted in localStorage
    }
    return { success: true, savedToServer: false };
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

    // Replace in category list
    catalog.categories[mainCat][idx] = nName;

    // Update all products using this subcategory
    let updatedProducts = 0;
    catalog.products.forEach(p => {
      if (p.category === mainCat && p.subcategory === oName) {
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

    // Reassign products to first available subcategory or fallback
    const fallback = catalog.categories[mainCat][0] || 'GENERAL';
    catalog.products.forEach(p => {
      if (p.category === mainCat && p.subcategory === name) {
        p.subcategory = fallback;
      }
    });

    await this.persistCatalog(catalog);
    return catalog.categories[mainCat];
  },

  // Count products in each subcategory
  getProductCountBySubcategory(mainCat, subcatName) {
    const catalog = this.getCatalog();
    const name = subcatName.toUpperCase();
    return catalog.products.filter(p => p.category === mainCat && p.subcategory.toUpperCase() === name).length;
  },

  // =====================================================================
  //  PRODUCTS CRUD
  // =====================================================================
  getProducts() {
    const catalog = this.getCatalog();
    return catalog.products;
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
      // Generate clean unique ID
      const baseSlug = productData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const uniqueId = `${productData.category.toLowerCase()}-${baseSlug}-${Date.now().toString(36)}`;
      productData.id = uniqueId;
      catalog.products.unshift(productData);
    }

    await this.persistCatalog(catalog);
    return productData;
  },

  async deleteProduct(id) {
    const catalog = this.getCatalog();
    const initialLen = catalog.products.length;
    catalog.products = catalog.products.filter(p => p.id !== id);

    if (catalog.products.length !== initialLen) {
      await this.persistCatalog(catalog);
      return true;
    }
    return false;
  },

  // =====================================================================
  //  MEDIA / VIDEO UPLOAD (IndexedDB + Server API)
  // =====================================================================
  async uploadMediaFile(file) {
    if (!file) throw new Error('Nessun file selezionato');

    const cleanName = file.name.replace(/[^a-zA-Z0-9_\.-]/g, '_');
    const ext = cleanName.split('.').pop().toLowerCase();
    const isVideo = ['mp4', 'mov', 'webm', 'm4v'].includes(ext);

    // 1. Try server API upload
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
          return {
            path: json.path,
            filename: json.filename,
            isServer: true,
            previewUrl: json.path
          };
        }
      }
    } catch (_) {
      // Server not active, fallback to IndexedDB
    }

    // 2. Fallback to IndexedDB (Works offline, on phone, on static host)
    const mediaId = `media_${Date.now()}_${cleanName}`;
    await mediaDB.saveMedia(mediaId, file);
    const objectUrl = URL.createObjectURL(file);
    blobUrlCache.set(mediaId, objectUrl);

    return {
      path: `idb:${mediaId}`,
      filename: cleanName,
      isServer: false,
      previewUrl: objectUrl
    };
  },

  // Resolve media path to playable URL (supports relative path, http URL, and IndexedDB blob)
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
      if (!data.categories || !data.products) {
        throw new Error('Formato JSON non valido: mancano categories o products');
      }
      await this.persistCatalog(data);
      return true;
    } catch (e) {
      throw new Error('Errore durante l\'importazione: ' + e.message);
    }
  },

  async resetToDefaults() {
    try {
      const res = await fetch('data/catalog.json');
      if (res.ok) {
        const initial = await res.json();
        await this.persistCatalog(initial);
        return true;
      }
    } catch (_) {}

    const defaultCatalog = {
      categories: JSON.parse(JSON.stringify(DEFAULT_CATEGORIES)),
      products: []
    };
    await this.persistCatalog(defaultCatalog);
    return true;
  }
};

// Make available globally
window.TSF_Storage = TSF_Storage;

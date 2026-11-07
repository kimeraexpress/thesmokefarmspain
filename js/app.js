/**
 * THE SMOKE FARM SPAIN - Mobile First Luxury Web Application
 * Handles category filtering, autoplay video engine, and direct ordering.
 */

// =======================================================================
//  LINK DI ORDINAZIONE "ORDINA QUI"// Sostituisci '#'con il tuo link personalizzato (es. WhatsApp, Telegram, o modulo)
// =======================================================================
window.TSF_ORDER_LINK = "#"; // INSERISCI QUI IL LINK QUANDO LO AVRAI!

// Multilingual Dictionary
const I18N = {
  es: {
    liveDrop: "THE SMOKE FARM SPAIN",
    heroTag: "COLECCIÓN EXCLUSIVA ESPAÑA",
    heroTitle: "El Arte Del Humo • Spain Reserve",
    heroDesc: "Genética pura, calidad y disponibilidad",
    exploreMenu: "Menú y Productos",
    catAsh: "ASH",
    catAshSub: "Extractos y Hash",
    catWeed: "WEED",
    catWeedSub: "Cali y Flores Top",
    catIce: "ICE",
    catIceSub: "Ice-o-Lator y Melts",
    all: "TODOS",
    searchPlaceholder: "Buscar variedad, genética, terpenos...",
    viewDetails: "Detalles",
    addOrder: "Pedir Aquí",
    formats: "FORMATOS",
    formatsAvailable: "Formati Disponibili:",
    aromaProfile: "Perfil Aromático:",
    ageTitle: "ACCESO EXCLUSIVO PARA SOCIOS",
    ageDesc: "¿Eres mayor de edad (+18) y estás autorizado para consultar el catálogo privado de The Smoke Farm Spain?",
    ageEnter: "Sí, soy mayor de 18",
    ageExit: "Salir",
    filterHeading: "Catálogo Farm",
    soundOn: "Audio Activado",
    soundOff: "Audio Silenciado",
    noProducts: "No se encontraron productos para esta búsqueda.",
    resetFilters: "Restablecer Filtros",
    dropsCount: "drops",
    nextDropTitle: "PRÓXIMO DROP EN CAMINO",
    nextDropDesc: "Los nuevos lotes artesanales Spain Reserve se encuentran en fase de curado y selección. La disponibilidad se publicará muy pronto.",
    clubDesc: "Colectivo privado con sede en Barcelona. Ofrecemos a nuestros socios productos artesanales de primera calidad: Hash estático, Fresh Frozen, Mousse, Dry Sift, Flores Cali Indoor y extracciones Ice-o-Lator solventless de máxima excelencia.",
    navHome: "Inicio",
    navMenu: "Menú",
    navSearch: "Buscar",
    navOrder: "Pedir",
    navClub: "Club",
    footerCopy: "Barcelona, España • Exclusivo para Socios Mayores de Edad (+18)<br>© 2026 The Smoke Farm Spain. Todos los derechos reservados.",
    footerAdmin: "Área Reservada Farm"
  },
  en: {
    liveDrop: "THE SMOKE FARM SPAIN",
    heroTag: "EXCLUSIVE SPAIN COLLECTION",
    heroTitle: "The Art Of Smoke • Spain Reserve",
    heroDesc: "Pure genetics, quality and availability",
    exploreMenu: "Menu & Products",
    catAsh: "ASH",
    catAshSub: "Extracts & Hash",
    catWeed: "WEED",
    catWeedSub: "Cali & Tops",
    catIce: "ICE",
    catIceSub: "Ice-o-Lator & Melts",
    all: "ALL",
    searchPlaceholder: "Search strain, genetics, terpenes...",
    viewDetails: "Details",
    addOrder: "Order Here",
    formats: "FORMATS",
    formatsAvailable: "Available Formats:",
    aromaProfile: "Terpene Profile:",
    ageTitle: "MEMBERS ONLY ACCESS",
    ageDesc: "Are you of legal age (18+) and authorized to view the private collective menu of The Smoke Farm Spain?",
    ageEnter: "Yes, I am 18+",
    ageExit: "Exit",
    filterHeading: "Farm Catalog",
    soundOn: "Audio On",
    soundOff: "Audio Muted",
    noProducts: "No products found matching your search.",
    resetFilters: "Reset Filters",
    dropsCount: "drops",
    nextDropTitle: "NEXT DROP COMING SOON",
    nextDropDesc: "New artisanal Spain Reserve batches are currently curing and undergoing final selection. Available soon.",
    clubDesc: "Private collective based in Barcelona. We offer our members top-shelf artisanal craft: Static hash, Fresh Frozen, Mousse, Dry Sift, Cali Indoor flower, and supreme Ice-o-Lator solventless extractions.",
    navHome: "Home",
    navMenu: "Menu",
    navSearch: "Search",
    navOrder: "Order",
    navClub: "Club",
    footerCopy: "Barcelona, Spain • Strictly for Adults Only (+18)<br>© 2026 The Smoke Farm Spain. All rights reserved.",
    footerAdmin: "Farm Restricted Area"
  },
  it: {
    liveDrop: "THE SMOKE FARM SPAIN",
    heroTag: "COLLEZIONE ESCLUSIVA SPAIN",
    heroTitle: "L'Arte Del Fumo • Spain Reserve",
    heroDesc: "Genetica pura, qualità e disponibilità",
    exploreMenu: "Menu & Prodotti",
    catAsh: "ASH",
    catAshSub: "Estratti & Hash",
    catWeed: "WEED",
    catWeedSub: "Cali & Top Tops",
    catIce: "ICE",
    catIceSub: "Ice-o-Lator & Melts",
    all: "TUTTI",
    searchPlaceholder: "Cerca strain, genetica, profilo terpeni...",
    viewDetails: "Dettagli",
    addOrder: "Ordina Qui",
    formats: "FORMATI",
    formatsAvailable: "Formati Disponibili:",
    aromaProfile: "Profilo Aromatico:",
    ageTitle: "ACCESSO RISERVATO AI SOCI",
    ageDesc: "Sei maggiorenne (+18) e autorizzato ad accedere al catalogo privato del Farm & Social Club di The Smoke Farm Spain?",
    ageEnter: "Sì, ho più di 18 anni",
    ageExit: "Esci",
    filterHeading: "Catalogo Farm",
    soundOn: "Audio Attivo",
    soundOff: "Audio Disattivato",
    noProducts: "Nessun prodotto trovato per questa ricerca.",
    resetFilters: "Reset Filtri",
    dropsCount: "drops",
    nextDropTitle: "PROSSIMO DROP IN ARRIVO",
    nextDropDesc: "I nuovi lotti artigianali Spain Reserve sono in fase di concia e selezione. I prodotti saranno disponibili a breve.",
    clubDesc: "Collettivo privato con sede a Barcellona. Offriamo ai nostri membri prodotti artigianali di primissima scelta: Hash statico, Fresh Frozen, Mousse, Dry Sift, Cime Cali Indoor ed estrazioni Ice-o-Lator d'eccellenza.",
    navHome: "Home",
    navMenu: "Menu",
    navSearch: "Cerca",
    navOrder: "Ordina",
    navClub: "Club",
    footerCopy: "Barcellona, Spagna • Riservato Esclusivamente ai Membri Maggiorenni (+18)<br>© 2026 The Smoke Farm Spain. Tutti i diritti riservati.",
    footerAdmin: "Area Riservata Farm"
  },
  fr: {
    liveDrop: "THE SMOKE FARM SPAIN",
    heroTag: "COLLECTION EXCLUSIVE ESPAGNE",
    heroTitle: "L'Art De La Fumée • Spain Reserve",
    heroDesc: "Génétique pure, qualité et disponibilité",
    exploreMenu: "Menu & Produits",
    catAsh: "ASH",
    catAshSub: "Extraits & Hash",
    catWeed: "WEED",
    catWeedSub: "Cali & Fleurs Top",
    catIce: "ICE",
    catIceSub: "Ice-o-Lator & Melts",
    all: "TOUS",
    searchPlaceholder: "Rechercher variété, génétique, terpènes...",
    viewDetails: "Détails",
    addOrder: "Commander Ici",
    formats: "FORMATS",
    formatsAvailable: "Formats Disponibles :",
    aromaProfile: "Profil Aromatique :",
    ageTitle: "ACCÈS RÉSERVÉ AUX MEMBRES",
    ageDesc: "Êtes-vous majeur (+18) et autorisé à consulter le catalogue privé du Farm & Social Club de The Smoke Farm Spain ?",
    ageEnter: "Oui, j'ai plus de 18 ans",
    ageExit: "Quitter",
    filterHeading: "Catalogue Farm",
    soundOn: "Son Activé",
    soundOff: "Son Coupé",
    noProducts: "Aucun produit trouvé pour cette recherche.",
    resetFilters: "Réinitialiser les Filtres",
    dropsCount: "variétés",
    nextDropTitle: "PROCHAIN DROP BIENTÔT",
    nextDropDesc: "Les nouvelles récoltes artisanales Spain Reserve sont actuellement en phase d'affinage et de sélection. Disponibles très prochainement.",
    clubDesc: "Collectif privé basé à Barcelone. Nous proposons à nos membres des produits artisanaux de premier choix : Hash statique, Fresh Frozen, Mousse, Dry Sift, Fleurs Cali Indoor et extractions Ice-o-Lator d'excellence sans solvant.",
    navHome: "Accueil",
    navMenu: "Menu",
    navSearch: "Recherche",
    navOrder: "Commander",
    navClub: "Club",
    footerCopy: "Barcelone, Espagne • Réservé Exclusivement aux Membres Majeurs (+18)<br>© 2026 The Smoke Farm Spain. Tous droits réservés.",
    footerAdmin: "Espace Réservé Farm"
  }
};

let currentLang = localStorage.getItem('tsf_lang') || 'es';

// Comprehensive Product Catalog Database
const PRODUCTS_DATA = [];

// DOM Elements
const elements = {
  productsGrid: document.getElementById('productsGrid'),
  catTabs: document.querySelectorAll('.cat-tab-btn'),
  subcatBar: document.getElementById('subcategoriesBar') || document.getElementById('ashSubcategoriesBar'),
  subcatTrack: document.getElementById('subcategoriesTrack'),
  searchField: document.getElementById('searchField'),
  sectionHeading: document.getElementById('sectionHeading'),
  sectionCount: document.getElementById('sectionCount'),
  cartCounterPills: document.querySelectorAll('.badge-count, .cart-badge'),
  // Modal elements
  productModal: document.getElementById('productModal'),
  modalVideo: document.getElementById('modalVideo'),
  modalTitle: document.getElementById('modalTitle'),
  modalBadge: document.getElementById('modalBadge'),
  modalLineage: document.getElementById('modalLineage'),
  modalPotency: document.getElementById('modalPotency'),
  modalTerpenes: document.getElementById('modalTerpenes'),
  modalDesc: document.getElementById('modalDesc'),
  modalAromas: document.getElementById('modalAromas'),
  modalQtyOptions: document.getElementById('modalQtyOptions'),
  modalOrderBtn: document.getElementById('modalOrderBtn'),
  closeModalBtn: document.getElementById('closeModalBtn'),
  // Age Gate
  ageGateOverlay: document.getElementById('ageGateOverlay'),
  ageGateConfirmBtn: document.getElementById('ageGateConfirmBtn'),
  ageGateExitBtn: document.getElementById('ageGateExitBtn'),
  // Sound toggle
  soundToggleBtn: document.getElementById('soundToggleBtn'),
  soundStatusText: document.getElementById('soundStatusText'),
  // Lang buttons
  langBtns: document.querySelectorAll('.lang-btn'),
  // Bottom navigation
  navItemBtns: document.querySelectorAll('.nav-item-btn')
};

// Initialize App
document.addEventListener('DOMContentLoaded', async () => {
  if (window.TSF_Storage) {
    await TSF_Storage.init();
  }
  // Synchronize language buttons with currentLang
  document.querySelectorAll('.lang-btn').forEach(b => {
    b.classList.toggle('active', b.getAttribute('data-lang') === currentLang);
  });
  checkAgeVerification();
  initAutoplayVideos();
  setupEventListeners();
  renderSubcategoriesBar();
  renderProducts();
  updateI18N();

  // Listen for catalog updates from admin or storage
  window.addEventListener('tsf:catalog-updated', () => {
    renderSubcategoriesBar();
    renderProducts();
  });
});

// Age Verification Modal
function checkAgeVerification() {
  const verified = localStorage.getItem('tsf_age_verified_v1');
  if (verified === 'true') {
    elements.ageGateOverlay.style.display = 'none';
  } else {
    elements.ageGateOverlay.style.display = 'flex';
  }
}

// Global Autoplay Video Engine (Handles Mobile & Desktop Autoplay without manual click)
function initAutoplayVideos() {
  const allVideos = document.querySelectorAll('video');
  allVideos.forEach(v => {
    v.muted = true;
    v.defaultMuted = true;
    v.playsInline = true;
    v.setAttribute('playsinline', '');
    v.setAttribute('webkit-playsinline', '');
    v.setAttribute('loop', '');
    
    // Attempt play immediately
    const playPromise = v.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Autoplay policy fallback: re-trigger on first interaction
        document.body.addEventListener('touchstart', () => v.play().catch(()=>{}), { once: true });
        document.body.addEventListener('click', () => v.play().catch(()=>{}), { once: true });
      });
    }
  });

  // IntersectionObserver: automatically play videos when in viewport, pause when far off
  if ('IntersectionObserver'in window) {
    const videoObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const vid = entry.target;
        if (entry.isIntersecting) {
          vid.play().catch(() => {});
        } else {
          vid.pause();
        }
      });
    }, { threshold: 0.15 });

    allVideos.forEach(v => videoObserver.observe(v));
  }
}

// Setup Event Listeners
function setupEventListeners() {
  // Main Category Tabs
  elements.catTabs.forEach(btn => {
    btn.addEventListener('click', () => {
      const cat = btn.getAttribute('data-cat');
      setMainCategory(cat);
    });
  });



  // Instant Search Field
  elements.searchField.addEventListener('input', (e) => {
    state.searchQuery = e.target.value.toLowerCase().trim();
    renderProducts();
  });

  // Age Gate Buttons
  if (elements.ageGateConfirmBtn) {
    elements.ageGateConfirmBtn.addEventListener('click', () => {
      localStorage.setItem('tsf_age_verified_v1', 'true');
      elements.ageGateOverlay.style.opacity = '0';
      setTimeout(() => {
        elements.ageGateOverlay.style.display = 'none';
        initAutoplayVideos();
      }, 300);
    });
  }

  if (elements.ageGateExitBtn) {
    elements.ageGateExitBtn.addEventListener('click', () => {
      window.location.href = 'https://www.google.com';
    });
  }

  // Sound Toggle (Unmute / Mute)
  if (elements.soundToggleBtn) {
    elements.soundToggleBtn.addEventListener('click', toggleAudio);
  }

  // Modal Close
  if (elements.closeModalBtn) {
    elements.closeModalBtn.addEventListener('click', closeProductModal);
  }
  elements.productModal.addEventListener('click', (e) => {
    if (e.target === elements.productModal) {
      closeProductModal();
    }
  });

  // Modal Direct Order Action
  if (elements.modalOrderBtn) {
    elements.modalOrderBtn.addEventListener('click', () => {
      if (state.selectedModalProduct) {
        handleOrderClick(state.selectedModalProduct.id);
      } else {
        handleOrderClick();
      }
    });
  }



  // Language Switcher
  elements.langBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const lang = btn.getAttribute('data-lang');
      setLanguage(lang);
    });
  });

  // Bottom Navigation Items
  elements.navItemBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      elements.navItemBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const action = btn.getAttribute('data-nav');
      handleBottomNav(action);
    });
  });

  // Story Highlight items
  document.querySelectorAll('.story-item').forEach(item => {
    item.addEventListener('click', () => {
      const storyType = item.getAttribute('data-story');
      handleStoryClick(storyType);
    });
  });
}

// Universal Language Switcher
window.setLanguage = function(lang) {
  if (!I18N[lang]) return;
  currentLang = lang;
  localStorage.setItem('tsf_lang', lang);
  document.querySelectorAll('.lang-btn').forEach(b => {
    b.classList.toggle('active', b.getAttribute('data-lang') === lang);
  });
  updateI18N();
  renderSubcategoriesBar();
  renderProducts();
};

// Render Subcategories Bar dynamically for whichever category is active (ASH, WEED, ICE)
function renderSubcategoriesBar() {
  if (!elements.subcatTrack) return;
  const mainCat = state.activeCategory;
  const subcats = window.TSF_Storage ? TSF_Storage.getSubcategories(mainCat) : [];

  if (subcats.length > 0) {
    if (elements.subcatBar) elements.subcatBar.style.display = 'block';
    elements.subcatTrack.innerHTML = '';

    // 'ALL' pill
    const allPill = document.createElement('button');
    allPill.className = `subcat-pill ${state.activeSubcategory === 'ALL' ? 'active' : ''}`;
    allPill.setAttribute('data-subcat', 'ALL');
    const allLabel = (I18N[currentLang] && I18N[currentLang].all) || 'ALL';
    allPill.innerHTML = `<span>${allLabel}</span>`;
    allPill.addEventListener('click', () => {
      selectSubcategory('ALL');
    });
    elements.subcatTrack.appendChild(allPill);

    // Subcategory pills
    subcats.forEach(sub => {
      const pill = document.createElement('button');
      pill.className = `subcat-pill ${state.activeSubcategory === sub ? 'active' : ''}`;
      pill.setAttribute('data-subcat', sub);
      pill.innerHTML = `<span>${sub}</span>`;
      pill.addEventListener('click', () => {
        selectSubcategory(sub);
      });
      elements.subcatTrack.appendChild(pill);
    });
  } else {
    if (elements.subcatBar) elements.subcatBar.style.display = 'none';
    state.activeSubcategory = 'ALL';
  }
}

function selectSubcategory(subcat) {
  state.activeSubcategory = subcat;
  if (elements.subcatTrack) {
    elements.subcatTrack.querySelectorAll('.subcat-pill').forEach(p => {
      p.classList.toggle('active', p.getAttribute('data-subcat') === subcat);
    });
  }
  renderProducts();
}

// Set Main Category: ASH, WEED, ICE
function setMainCategory(cat) {
  state.activeCategory = cat;
  state.activeSubcategory = 'ALL';
  elements.catTabs.forEach(b => {
    if (b.getAttribute('data-cat') === cat) {
      b.classList.add('active');
    } else {
      b.classList.remove('active');
    }
  });

  renderSubcategoriesBar();
  renderProducts();
}

// Filter and Render Products
function renderProducts() {
  const t = I18N[currentLang];
  const allProducts = getCatalogProducts();

  let filtered = allProducts.filter(p => {
    // Category match
    if (p.category !== state.activeCategory) return false;
    
    // Subcategory match (Dynamic for ASH, WEED, and ICE!)
    if (state.activeSubcategory && state.activeSubcategory !== 'ALL') {
      if ((p.subcategory || '').toUpperCase() !== state.activeSubcategory.toUpperCase()) return false;
    }

    // Search query match
    if (state.searchQuery) {
      const q = state.searchQuery;
      const matchTitle = (p.title || '').toLowerCase().includes(q);
      const matchLineage = (p.lineage || '').toLowerCase().includes(q);
      const matchDesc = (p.desc || '').toLowerCase().includes(q);
      const matchSub = (p.subcategory || '').toLowerCase().includes(q);
      const matchAromas = (p.aromas || []).some(a => a.toLowerCase().includes(q));
      if (!matchTitle && !matchLineage && !matchDesc && !matchSub && !matchAromas) {
        return false;
      }
    }

    return true;
  });

  // Update Header Meta
  let catName = state.activeCategory;
  if (state.activeSubcategory && state.activeSubcategory !== 'ALL') {
    catName = `${state.activeCategory} • ${state.activeSubcategory}`;
  }
  elements.sectionHeading.textContent = `${t.filterHeading}: ${catName}`;
  elements.sectionCount.textContent = `${filtered.length} ${t.dropsCount || 'drops'}`;

  // Render Grid Cards
  elements.productsGrid.innerHTML = '';
  if (filtered.length === 0) {
    if (state.searchQuery) {
      elements.productsGrid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 50px 20px; color: var(--text-muted);">
          <p style="font-size: 1.1rem; font-weight: 700; margin-bottom: 8px;">${t.noProducts || 'Nessun prodotto trovato.'}</p>
          <button class="btn-primary" style="margin-top: 10px;" onclick="resetFilters()">${t.resetFilters || 'Reset Filtri'}</button>
        </div>
      `;
    } else {
      elements.productsGrid.innerHTML = `
        <div class="empty-drop-card" style="grid-column: 1/-1; text-align: center; padding: 48px 20px; background: rgba(229,169,60,0.04); border: 1px solid rgba(229,169,60,0.2); border-radius: var(--radius-lg); margin: 10px 0;">
          <img src="assets/logo-badge.png" alt="Spain Reserve" style="width: 72px; height: 72px; border-radius: 50%; border: 2px solid var(--gold-primary); margin-bottom: 14px; box-shadow: 0 0 18px rgba(229,169,60,0.35);">
          <h3 class="brand-font gold-gradient-text" style="font-size: 1.25rem; margin-bottom: 8px;">${t.nextDropTitle || 'PROSSIMO DROP IN ARRIVO'}</h3>
          <p style="font-size: 0.88rem; color: var(--text-muted); line-height: 1.5; max-width: 440px; margin: 0 auto 20px auto;">${t.nextDropDesc || 'I nuovi lotti artigianali Spain Reserve sono in fase di concia e selezione.'}</p>
          <button class="btn-primary" onclick="handleOrderClick()" style="margin: 0 auto;">
            <span>${t.addOrder || 'Ordina Qui'}</span>
          </button>
        </div>
      `;
    }
    return;
  }

  filtered.forEach(product => {
    const card = document.createElement('article');
    card.className = 'product-card';
    card.setAttribute('data-id', product.id);

    const formatsStr = (product.options || []).map(o => o.qty || o).join(' • ') || 'Formato Farm';
    const aromasStr = (product.aromas || []).join(' • ');

    card.innerHTML = `
      <div class="card-media-box" onclick="openProductModal('${product.id}')">
        <video 
          class="card-media-video" 
          src="${product.video && !product.video.startsWith('idb:') ? product.video : ''}" 
          poster="${product.image || 'assets/logo-badge.png'}" 
          autoplay 
          muted 
          loop 
          playsinline 
          webkit-playsinline
          preload="metadata"></video>
        <div class="card-media-overlay"></div>
        <div class="live-video-badge">
          <span class="live-dot"></span>
          <span>4K LOOP</span>
        </div>
        <div class="card-subcat-badge" data-cat="${product.category}">
          ${product.subcategory || product.category}
        </div>
        <button class="card-unmute-btn" onclick="event.stopPropagation(); toggleCardSound(this)" title="Toggle Sound">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
          </svg>
        </button>
      </div>

      <div class="card-body">
        <div class="card-meta-tags">
          <span class="meta-pill potency">${product.potency || 'PREMIUM'}</span>
          <span class="meta-pill terpenes">${product.terpenes || 'TERPS'}</span>
          ${product.badge ? `<span class="meta-pill">${product.badge}</span>` : ''}
        </div>

        <h3 class="card-title" onclick="openProductModal('${product.id}')">${product.title}</h3>
        <p class="card-lineage">${product.lineage || ''}</p>

        <div class="card-aroma-row">
          <span>${aromasStr}</span>
        </div>

        <div class="card-pricing-row">
          <div class="card-formats-display">
            <span class="formats-label">${t.formats}</span>
            <span class="formats-tags">${formatsStr}</span>
          </div>
          <div class="card-actions">
            <button class="card-btn-view" onclick="openProductModal('${product.id}')" title="${t.viewDetails}">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
            </button>
            <button class="card-btn-order" onclick="handleOrderClick('${product.id}')">
              <span>${t.addOrder}</span>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M5 12h14M12 5l7 7-7 7"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    `;

    // Asynchronously resolve IndexedDB video if uploaded through browser
    if (window.TSF_Storage && product.video && product.video.startsWith('idb:')) {
      TSF_Storage.resolveMediaUrl(product.video).then(blobUrl => {
        const vEl = card.querySelector('.card-media-video');
        if (vEl && blobUrl) {
          vEl.src = blobUrl;
          vEl.play().catch(() => {});
        }
      });
    }

    elements.productsGrid.appendChild(card);
  });

  // Re-run autoplay hooks for newly added cards
  initAutoplayVideos();
}

// Reset Filters
window.resetFilters = function() {
  state.searchQuery = '';
  if (elements.searchField) elements.searchField.value = '';
  state.activeSubcategory = 'ALL';
  renderSubcategoriesBar();
  renderProducts();
};

// Global & Card Audio Toggle
function toggleAudio() {
  state.isMuted = !state.isMuted;
  const t = I18N[currentLang];
  const allVideos = document.querySelectorAll('video');
  allVideos.forEach(v => {
    v.muted = state.isMuted;
  });

  if (elements.soundStatusText) {
    elements.soundStatusText.textContent = state.isMuted ? t.soundOff : t.soundOn;
  }
}

window.toggleCardSound = function(btn) {
  const card = btn.closest('.product-card');
  const vid = card.querySelector('video');
  vid.muted = !vid.muted;
  if (!vid.muted) {
    btn.style.background = 'var(--gold-primary)';
    btn.style.color = '#000';
  } else {
    btn.style.background = 'rgba(0, 0, 0, 0.65)';
    btn.style.color = '#FFF';
  }
};

// Open Product Detail Modal
window.openProductModal = function(id) {
  const allProducts = getCatalogProducts();
  const product = allProducts.find(p => p.id === id);
  if (!product) return;

  state.selectedModalProduct = product;
  state.selectedQtyIndex = 0;

  // Set Modal Data
  elements.modalTitle.textContent = product.title;
  elements.modalBadge.textContent = product.badge || 'Official Batch';
  elements.modalLineage.textContent = product.lineage || '';
  elements.modalPotency.textContent = product.potency || '';
  elements.modalTerpenes.textContent = product.terpenes || '';
  elements.modalDesc.textContent = product.desc || '';
  elements.modalAromas.innerHTML = (product.aromas || []).map(a => `<span class="meta-pill">${a}</span>`).join('');

  // Video in Modal
  elements.modalVideo.poster = product.image || 'assets/logo-badge.png';
  elements.modalVideo.muted = state.isMuted;

  if (window.TSF_Storage && product.video && product.video.startsWith('idb:')) {
    TSF_Storage.resolveMediaUrl(product.video).then(url => {
      elements.modalVideo.src = url;
      elements.modalVideo.play().catch(() => {});
    });
  } else {
    elements.modalVideo.src = product.video;
    elements.modalVideo.play().catch(() => {});
  }


  // Render Quantity Selector Buttons
  renderModalQtyOptions();

  // Show Modal
  elements.productModal.classList.add('open');
  document.body.style.overflow = 'hidden';
};

function renderModalQtyOptions() {
  const product = state.selectedModalProduct;
  elements.modalQtyOptions.innerHTML = '';
  product.options.forEach((opt, idx) => {
    const btn = document.createElement('button');
    btn.className = `qty-btn ${idx === state.selectedQtyIndex ? 'selected': ''}`;
    btn.textContent = opt.qty;
    btn.onclick = () => {
      state.selectedQtyIndex = idx;
      renderModalQtyOptions();
    };
    elements.modalQtyOptions.appendChild(btn);
  });
}

function closeProductModal() {
  elements.productModal.classList.remove('open');
  elements.modalVideo.pause();
  document.body.style.overflow = '';
}

// Direct Order Link Trigger
window.handleOrderClick = function(productId) {
  const product = productId ? PRODUCTS_DATA.find(p => p.id === productId) : state.selectedModalProduct;
  const link = window.TSF_ORDER_LINK;
  if (!link || link === '#'|| link.trim() === '') {
    const productName = product ? product.title : 'questo prodotto';
    alert(`Hai selezionato: ${productName}\n\nIl link per l'ordinazione sarà attivo a breve!`);
    return;
  }
  window.open(link, '_blank');
};



// Bottom Nav Bar Navigation Handler
function handleBottomNav(action) {
  if (action === 'home') {
    window.scrollTo({ top: 0, behavior: 'smooth'});
  } else if (action === 'menu') {
    document.getElementById('catalogSection').scrollIntoView({ behavior: 'smooth'});
  } else if (action === 'search') {
    const searchSection = document.querySelector('.search-filter-section');
    if (searchSection) {
      searchSection.scrollIntoView({ behavior: 'smooth'});
      setTimeout(() => {
        elements.searchField.focus();
      }, 350);
    }
  } else if (action === 'order') {
    handleOrderClick();
  } else if (action === 'info') {
    document.getElementById('clubInfoSection').scrollIntoView({ behavior: 'smooth'});
  }
}

// Story Highlight Click Handler
function handleStoryClick(type) {
  if (type === 'drops') {
    setMainCategory('ASH');
  } else if (type === 'static') {
    setMainCategory('ASH');
    const pill = document.querySelector('.subcat-pill[data-subcat="STATIC"]');
    if (pill) pill.click();
  } else if (type === 'ice') {
    setMainCategory('ICE');
  } else if (type === 'weed') {
    setMainCategory('WEED');
  } else {
    setMainCategory('ASH');
  }
  document.getElementById('catalogSection').scrollIntoView({ behavior: 'smooth'});
}

// Multilingual Content Update
function updateI18N() {
  const t = I18N[currentLang] || I18N.es;
  document.documentElement.lang = currentLang;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (t && t[key]) {
      el.innerHTML = t[key];
    }
  });

  if (elements.searchField && t) {
    elements.searchField.placeholder = t.searchPlaceholder || '';
  }
}

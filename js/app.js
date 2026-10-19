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
const PRODUCTS_DATA = [
  // =================== ASH : STATIC ===================
  {
    id: 'ash-static-tangie',
    title: 'Static Sift 99% - Tangie x Papaya',
    category: 'ASH',
    subcategory: 'STATIC',
    badge: '99% Heads Melt',
    lineage: 'Tangie x Papaya 90u',
    potency: '78% THC',
    terpenes: '9.2% Terps',
    aromas: ['Citrus Candy', 'Tropical Papaya', 'Sweet Gas'],
    desc: 'Static sift di pure teste ghiandolari 90u estratto a freddo. Fusione istantanea a contatto con il calore, aroma esplosivo di frutta tropicale e retrogusto gassoso persistente.',
    image: 'assets/products/ash-static-tangie.jpg',
    video: 'assets/videos/ash-static.mp4',
    options: [
      { qty: '5g', price: 60 },
      { qty: '10g', price: 110 },
      { qty: '25g', price: 250 }
    ],
    highlight: true
  },
  {
    id: 'ash-static-zkittlez',
    title: 'Static Melt - Zkittlez Diamond',
    category: 'ASH',
    subcategory: 'STATIC',
    badge: 'Full Melt 90u',
    lineage: 'Original Zkittlez Cut',
    potency: '81% THC',
    terpenes: '8.8% Terps',
    aromas: ['Rainbow Candy', 'Frutti di Bosco', 'Sour Lime'],
    desc: 'Separazione elettrostatica avanzata. Nessun solvente, solo teste di tricomi dorati che lasciano residuo zero nel banger.',
    image: 'assets/products/ash-static-zkittlez.jpg',
    video: 'assets/videos/ash-static.mp4',
    options: [
      { qty: '5g', price: 65 },
      { qty: '10g', price: 120 },
      { qty: '25g', price: 270 }
    ],
    highlight: false
  },

  // =================== ASH : FRESH FROZEN ===================
  {
    id: 'ash-ff-gmo',
    title: 'Fresh Frozen WPFF - GMO Cookies 73u',
    category: 'ASH',
    subcategory: 'FRESH FROZEN',
    badge: 'Whole Plant Frozen',
    lineage: 'Chemdog x Girl Scout Cookies',
    potency: '76% THC',
    terpenes: '10.4% Terps',
    aromas: ['Garlic & Onion', 'Earthy Fungus', 'Heavy Fuel'],
    desc: 'Tagliata e surgelata istantaneamente a -30°C appena raccolta. Profilo terpenico potentissimo e profilo aromatico unico ad altissima intensità.',
    image: 'assets/products/ash-ff-gmo.jpg',
    video: 'assets/videos/ash-freshfrozen.mp4',
    options: [
      { qty: '5g', price: 50 },
      { qty: '10g', price: 95 },
      { qty: '25g', price: 220 }
    ],
    highlight: true
  },
  {
    id: 'ash-ff-sour',
    title: 'Fresh Frozen 90u - Sour Diesel Farm Cut',
    category: 'ASH',
    subcategory: 'FRESH FROZEN',
    badge: 'Cold Cured Fresh',
    lineage: 'East Coast Sour Diesel',
    potency: '74% THC',
    terpenes: '8.6% Terps',
    aromas: ['Raw Kerosene', 'Acidic Lemon', 'Skunk'],
    desc: 'Incredibile freschezza, sapore agrumato tagliente e combustione chiarissima con cerchio d’olio denso.',
    image: 'assets/products/ash-ff-sour.jpg',
    video: 'assets/videos/ash-freshfrozen.mp4',
    options: [
      { qty: '5g', price: 55 },
      { qty: '10g', price: 100 },
      { qty: '25g', price: 230 }
    ],
    highlight: false
  },

  // =================== ASH : DRY SIFT ===================
  {
    id: 'ash-dry-beldia',
    title: 'Dry Sift 120u - Beldia Gold Reserve',
    category: 'ASH',
    subcategory: 'DRY SIFT',
    badge: '120u Connoisseur',
    lineage: 'Landrace Ketama Heirloom',
    potency: '68% THC',
    terpenes: '6.5% Terps',
    aromas: ['Honeycomb', 'Spicy Cedar', 'Moroccan Spice'],
    desc: 'Il sapore autentico dell\'hashish tradizionale rielaborato con standard moderni di filtraggio micronizzato.',
    image: 'assets/products/ash-dry-beldia.jpg',
    video: 'assets/videos/ash-drysift.mp4',
    options: [
      { qty: '5g', price: 35 },
      { qty: '10g', price: 65 },
      { qty: '50g', price: 290 }
    ],
    highlight: false
  },
  {
    id: 'ash-dry-biscotti',
    title: 'Dry Sift 90u - Biscotti Sundae',
    category: 'ASH',
    subcategory: 'DRY SIFT',
    badge: 'Double Filtered',
    lineage: 'Gelato 25 x South Florida OG',
    potency: '72% THC',
    terpenes: '7.8% Terps',
    aromas: ['Fresh Baked Cookies', 'Dark Cocoa', 'Diesel'],
    desc: 'Doppia battitura a secco 90 micron. Texture dorata e malleabile, perfetta consistenza e fumo denso e vellutato.',
    image: 'assets/products/ash-dry-biscotti.jpg',
    video: 'assets/videos/ash-drysift.mp4',
    options: [
      { qty: '5g', price: 40 },
      { qty: '10g', price: 75 },
      { qty: '50g', price: 320 }
    ],
    highlight: false
  },

  // =================== ASH : MOUSSE ===================
  {
    id: 'ash-mousse-beltz',
    title: 'Mousse Royale - Rainbow Beltz 2.0',
    category: 'ASH',
    subcategory: 'MOUSSE',
    badge: 'Whipped Butter Texture',
    lineage: 'Zkittlez x Moonbow #75',
    potency: '77% THC',
    terpenes: '9.0% Terps',
    aromas: ['Sour Candy Chew', 'Creamy Sugar', 'Gas'],
    desc: 'Consistenza spumosa e burrosa montata a freddo. Si spalma come burro, con profilo terpenico esotico e bolle dorate.',
    image: 'assets/products/ash-mousse-beltz.jpg',
    video: 'assets/videos/ash-mousse.mp4',
    options: [
      { qty: '5g', price: 45 },
      { qty: '10g', price: 85 },
      { qty: '25g', price: 195 }
    ],
    highlight: true
  },
  {
    id: 'ash-mousse-gelato',
    title: 'Mousse Terp Cured - Gelato 41 Whipped',
    category: 'ASH',
    subcategory: 'MOUSSE',
    badge: 'Terp Whipped 105u',
    lineage: 'Sunset Sherbet x Thin Mint GSC',
    potency: '75% THC',
    terpenes: '8.4% Terps',
    aromas: ['Sweet Sherbet', 'Lavender Floral', 'Gas'],
    desc: 'Curatura speciale che sviluppa una texture setosa e mousse irresistibile con bollicine ricche di essenza aromatica.',
    image: 'assets/products/ash-mousse-gelato.jpg',
    video: 'assets/videos/ash-mousse.mp4',
    options: [
      { qty: '5g', price: 40 },
      { qty: '10g', price: 75 },
      { qty: '25g', price: 175 }
    ],
    highlight: false
  },

  // =================== ASH : DRY WORK ===================
  {
    id: 'ash-work-98u',
    title: 'Dry Work 98u - Farmer Cut Spain TSF',
    category: 'ASH',
    subcategory: 'DRY WORK',
    badge: 'Official 98u Stamp',
    lineage: 'TSF Farm Selection 98u',
    potency: '66% THC',
    terpenes: '5.8% Terps',
    aromas: ['Dark Earth', 'Forest Pine', 'Black Pepper'],
    desc: 'Il leggendario panetto con timbro "98u THE SMOKE FARM SPAIN"visibile sul logo ufficiale. Resinoso, scuro all\'esterno, biondo al cuore.',
    image: 'assets/products/ash-work-98u.jpg',
    video: 'assets/videos/ash-drywork.mp4',
    options: [
      { qty: '10g', price: 50 },
      { qty: '25g', price: 110 },
      { qty: '100g', price: 380 }
    ],
    highlight: true
  },
  {
    id: 'ash-work-gold',
    title: 'Dry Work Commercial - Gold Batch Cured',
    category: 'ASH',
    subcategory: 'DRY WORK',
    badge: 'Club Daily Work',
    lineage: 'Commercial Farm Blend',
    potency: '62% THC',
    terpenes: '5.0% Terps',
    aromas: ['Earthy Pollen', 'Dry Wood', 'Subtle Sweet'],
    desc: 'Lotto da fumo quotidiano per il club, massima resa e gusto pulito e morbido.',
    image: 'assets/products/ash-work-gold.jpg',
    video: 'assets/videos/ash-drywork.mp4',
    options: [
      { qty: '10g', price: 45 },
      { qty: '25g', price: 95 },
      { qty: '100g', price: 340 }
    ],
    highlight: false
  },

  // =================== WEED : TOP SHELF FLOWERS ===================
  {
    id: 'weed-zcube',
    title: 'ZCube - Farm Reserve Exotic',
    category: 'WEED',
    subcategory: 'EXOTIC INDOOR',
    badge: 'Top Shelf Spain Cut',
    lineage: 'Zkittlez x (Zkittlez x Eddy OG)',
    potency: '29% THC',
    terpenes: '4.2% Terps',
    aromas: ['Tropical Skittles', 'OG Gas', 'Sweet Melon'],
    desc: 'Fiori densi, calici gonfi e ricoperti da uno strato fitto di tricomi cristallini. Gusto che permane a lungo sul palato con cenere bianca pura.',
    image: 'assets/products/weed-zcube.jpg',
    video: 'assets/videos/weed-showcase.mp4',
    options: [
      { qty: '3.5g', price: 45 },
      { qty: '7g', price: 80 },
      { qty: '14g', price: 150 },
      { qty: '28g', price: 280 }
    ],
    highlight: true
  },
  {
    id: 'weed-marker',
    title: 'Permanent Marker - Official Cali Cut',
    category: 'WEED',
    subcategory: 'CALI GENETICS',
    badge: 'Leafly Strain of Year',
    lineage: '(Biscotti x Jealousy) x Sherb Bx',
    potency: '32% THC',
    terpenes: '4.8% Terps',
    aromas: ['Sharpie Pungent Ink', 'Floral Gas', 'Funky Soap'],
    desc: 'Una delle genetiche più richieste e premiate nei club di Barcellona. Aroma pungente indimenticabile e cime viola/verdi smeraldo.',
    image: 'assets/products/weed-marker.jpg',
    video: 'assets/videos/weed-showcase.mp4',
    options: [
      { qty: '3.5g', price: 50 },
      { qty: '7g', price: 90 },
      { qty: '14g', price: 170 },
      { qty: '28g', price: 310 }
    ],
    highlight: true
  },
  {
    id: 'weed-superboof',
    title: 'Super Boof - Cherry Trop Pheno',
    category: 'WEED',
    subcategory: 'EXOTIC INDOOR',
    badge: 'AAAA+ Exotic',
    lineage: 'Black Cherry Punch x Tropicana Cookies',
    potency: '28% THC',
    terpenes: '4.5% Terps',
    aromas: ['Blood Orange', 'Tart Cherry', 'Damp Forest'],
    desc: 'Esplosione di agrumi rossi e ciliegia frizzante. Effetto euforico e stimolante con gemme compatte e tricomi brillanti.',
    image: 'assets/products/weed-superboof.jpg',
    video: 'assets/videos/weed-showcase.mp4',
    options: [
      { qty: '3.5g', price: 40 },
      { qty: '7g', price: 75 },
      { qty: '14g', price: 140 },
      { qty: '28g', price: 260 }
    ],
    highlight: false
  },
  {
    id: 'weed-rs11',
    title: 'RS11 (Rainbow Sherbert #11) - Connoisseur',
    category: 'WEED',
    subcategory: 'EXOTIC INDOOR',
    badge: 'Connoisseur Batch',
    lineage: 'Pink Guava x OZK',
    potency: '30% THC',
    terpenes: '4.6% Terps',
    aromas: ['Sweet Peach', 'Guava Nectar', 'Petrol'],
    desc: 'Cura meticolosa di 45 giorni a freddo. Calici croccanti, odore penetrante di pesca e benzina.',
    image: 'assets/products/weed-rs11.jpg',
    video: 'assets/videos/weed-showcase.mp4',
    options: [
      { qty: '3.5g', price: 45 },
      { qty: '7g', price: 85 },
      { qty: '14g', price: 160 },
      { qty: '28g', price: 290 }
    ],
    highlight: false
  },

  // =================== ICE : ICE-O-LATOR & MELTS ===================
  {
    id: 'ice-papaya',
    title: '6-Star Full Melt Ice-o-Lator - Papaya',
    category: 'ICE',
    subcategory: 'FULL MELT',
    badge: '6-Star 1st Wash',
    lineage: 'Papaya Cut (73u - 90u)',
    potency: '82% THC',
    terpenes: '11.2% Terps',
    aromas: ['Ripe Mango', 'Funky Papaya', 'Candy Gas'],
    desc: 'Il vertice assoluto delle estrazioni con acqua e ghiaccio. Si vaporizza al 100% senza alcuna traccia di residuo organico nel quarzo.',
    image: 'assets/products/ice-papaya.jpg',
    video: 'assets/videos/ice-showcase.mp4',
    options: [
      { qty: '2g', price: 70 },
      { qty: '5g', price: 150 },
      { qty: '10g', price: 280 }
    ],
    highlight: true
  },
  {
    id: 'ice-rosin-chem',
    title: 'Cold Cured Live Ice Rosin - Chem D x GMO',
    category: 'ICE',
    subcategory: 'LIVE ROSIN',
    badge: '1st Press Cold Cured',
    lineage: 'Chem D x GMO WPFF',
    potency: '84% THC',
    terpenes: '12.0% Terps',
    aromas: ['Heavy Kerosene', 'Roasted Garlic', 'Chemical Dank'],
    desc: 'Estratto da prima pressata di bubble hash fresh frozen senza solventi. Consistenza budder argentato con pozzanghere di terpeni lucidi.',
    image: 'assets/products/ice-rosin-chem.jpg',
    video: 'assets/videos/ice-showcase.mp4',
    options: [
      { qty: '2g', price: 75 },
      { qty: '5g', price: 160 },
      { qty: '10g', price: 300 }
    ],
    highlight: true
  },
  {
    id: 'ice-tropical',
    title: 'Ice Bubble Hash - Tropical Cookies 73u',
    category: 'ICE',
    subcategory: 'BUBBLE HASH',
    badge: 'Pure Water Hash',
    lineage: 'Tropicana Cookies x Animal Mintz',
    potency: '79% THC',
    terpenes: '9.5% Terps',
    aromas: ['Candied Tangerine', 'Sweet Mint Cookies', 'Ice Terps'],
    desc: 'Estrazione in bagno di ghiaccio controllato a 0.5°C. Cristalli di tricoma intatti e fumo morbido dal sapore inebriante.',
    image: 'assets/products/ice-tropical.jpg',
    video: 'assets/videos/ice-showcase.mp4',
    options: [
      { qty: '3g', price: 55 },
      { qty: '5g', price: 90 },
      { qty: '10g', price: 165 }
    ],
    highlight: false
  }
];

// App State
const state = {
  activeCategory: 'ASH', // 'ASH', 'WEED', 'ICE'
  activeSubcategory: 'ALL', // 'ALL' or specific subcategory name
  searchQuery: '',
  isMuted: true,
  cart: [],
  selectedModalProduct: null,
  selectedQtyIndex: 0
};

// Helper: Get live products from central storage or fallback
function getCatalogProducts() {
  if (window.TSF_Storage) {
    return TSF_Storage.getProducts();
  }
  return PRODUCTS_DATA;
}

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
    elements.productsGrid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 50px 20px; color: var(--text-muted);">
        <p style="font-size: 1.1rem; font-weight: 700; margin-bottom: 8px;">${t.noProducts || 'Nessun prodotto trovato.'}</p>
        <button class="btn-primary" style="margin-top: 10px;" onclick="resetFilters()">${t.resetFilters || 'Reset Filtri'}</button>
      </div>
    `;
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

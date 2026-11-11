/**
 * THE SMOKE FARM SPAIN - ADMIN PORTAL CONTROLLER (v3)
 * Full management of Products, Videos, and Dynamic Subcategories (ASH, WEED, ICE)
 */

let currentAdminTab = 'products';
let currentCategoryFilter = 'ALL';
let currentSearchQuery = '';
let currentEditingProductId = null;

// =======================================================================
//  INITIALIZATION & AUTHENTICATION
// =======================================================================
document.addEventListener('DOMContentLoaded', async () => {
  // Initialize storage and check server sync status
  await Promise.all([TSF_Storage.init(), TSF_Storage.checkServerSync()]);

  // Check login state
  if (TSF_Storage.isAdminLoggedIn()) {
    showDashboard();
  } else {
    showAuthGate();
  }

  // Populate GitHub token field if saved
  const tokenInput = document.getElementById('ghTokenInput');
  if (tokenInput) {
    const savedToken = TSF_Storage.getGitHubToken();
    if (savedToken) {
      tokenInput.value = savedToken;
      updateTokenStatusMsg(true);
    }
  }
});

function showAuthGate() {
  document.getElementById('adminAuthGate').style.display = 'flex';
  document.getElementById('adminApp').style.display = 'none';
  const pwdInput = document.getElementById('adminPasswordInput');
  if (pwdInput) pwdInput.focus();
}

function showDashboard() {
  document.getElementById('adminAuthGate').style.display = 'none';
  document.getElementById('adminApp').style.display = 'block';
  refreshDashboard();
}

function handleAdminLogin(e) {
  e.preventDefault();
  const pwdInput = document.getElementById('adminPasswordInput');
  const errorEl = document.getElementById('authErrorMsg');
  const entered = pwdInput.value;

  if (TSF_Storage.loginAdmin(entered)) {
    errorEl.textContent = '';
    pwdInput.value = '';
    showDashboard();
    showToast('Accesso effettuato con successo!');
  } else {
    errorEl.textContent = 'Password errata. Riprova.';
    pwdInput.select();
  }
}

function handleAdminLogout() {
  if (confirm('Sei sicuro di voler uscire dal pannello admin?')) {
    TSF_Storage.logoutAdmin();
    showAuthGate();
    showToast('Disconnessione effettuata.');
  }
}

function togglePasswordVisibility(inputId, btn) {
  const input = document.getElementById(inputId);
  if (input.type === 'password') {
    input.type = 'text';
    btn.style.color = 'var(--admin-gold)';
  } else {
    input.type = 'password';
    btn.style.color = 'var(--text-muted)';
  }
}

// Password Change Modal
function openPasswordModal() {
  document.getElementById('oldPwdInput').value = '';
  document.getElementById('newPwdInput').value = '';
  document.getElementById('pwdChangeMsg').textContent = '';
  document.getElementById('passwordModal').style.display = 'flex';
}

function closePasswordModal() {
  document.getElementById('passwordModal').style.display = 'none';
}

function handleChangePasswordSubmit(e) {
  e.preventDefault();
  const oldPwd = document.getElementById('oldPwdInput').value;
  const newPwd = document.getElementById('newPwdInput').value;
  const msgEl = document.getElementById('pwdChangeMsg');

  if (!TSF_Storage.verifyPassword(oldPwd)) {
    msgEl.textContent = 'La password attuale non è corretta.';
    return;
  }

  try {
    TSF_Storage.setAdminPassword(newPwd);
    closePasswordModal();
    showToast('Password aggiornata con successo!');
  } catch (err) {
    msgEl.textContent = err.message;
  }
}

// =======================================================================
//  DASHBOARD REFRESH & TABS
// =======================================================================
function refreshDashboard() {
  renderMetrics();
  renderProductsList();
  renderSubcategoriesManagement();
  updateLiveSyncStatusBanner();
}

function switchAdminTab(tabName) {
  currentAdminTab = tabName;
  document.querySelectorAll('.admin-tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-tab') === tabName);
  });
  document.querySelectorAll('.admin-tab-pane').forEach(pane => {
    pane.classList.remove('active');
  });

  if (tabName === 'products') {
    document.getElementById('tabProducts').classList.add('active');
    renderProductsList();
  } else if (tabName === 'subcategories') {
    document.getElementById('tabSubcategories').classList.add('active');
    renderSubcategoriesManagement();
  } else if (tabName === 'tools') {
    document.getElementById('tabTools').classList.add('active');
  }
}

function renderMetrics() {
  const products = TSF_Storage.getProducts();
  const ashCount = products.filter(p => p.category === 'ASH').length;
  const weedCount = products.filter(p => p.category === 'WEED').length;
  const iceCount = products.filter(p => p.category === 'ICE').length;

  document.getElementById('metricTotalProducts').textContent = products.length;
  document.getElementById('metricAshProducts').textContent = ashCount;
  document.getElementById('metricWeedProducts').textContent = weedCount;
  document.getElementById('metricIceProducts').textContent = iceCount;
}

// =======================================================================
//  TAB 1: PRODUCTS LIST & FILTERING
// =======================================================================
function handleAdminSearch(val) {
  currentSearchQuery = val.toLowerCase().trim();
  renderProductsList();
}

function filterAdminProducts(cat) {
  currentCategoryFilter = cat;
  document.querySelectorAll('.filter-pill').forEach(pill => {
    pill.classList.toggle('active', pill.getAttribute('data-filter-cat') === cat);
  });
  renderProductsList();
}

async function renderProductsList() {
  const container = document.getElementById('adminProductsContainer');
  let products = TSF_Storage.getProducts();

  // Category filter
  if (currentCategoryFilter !== 'ALL') {
    products = products.filter(p => p.category === currentCategoryFilter);
  }

  // Search filter
  if (currentSearchQuery) {
    const q = currentSearchQuery;
    products = products.filter(p => {
      const matchTitle = (p.title || '').toLowerCase().includes(q);
      const matchSub = (p.subcategory || '').toLowerCase().includes(q);
      const matchLin = (p.lineage || '').toLowerCase().includes(q);
      const matchDesc = (p.desc || '').toLowerCase().includes(q);
      return matchTitle || matchSub || matchLin || matchDesc;
    });
  }

  if (products.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 48px 24px; color: var(--text-muted); background: var(--admin-card); border-radius: 16px; border: 1px dashed var(--admin-card-border);">
        <div style="width: 56px; height: 56px; border-radius: 50%; background: rgba(229,169,60,0.1); border: 1px solid var(--admin-gold); display: flex; align-items: center; justify-content: center; margin: 0 auto 16px auto; color: var(--admin-gold);">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </div>
        <p style="font-size: 1.15rem; font-weight: 800; color: #FFF; margin-bottom: 6px;">Nessun prodotto presente nel catalogo</p>
        <p style="font-size: 0.85rem; color: var(--text-dim); margin-bottom: 20px; max-width: 460px; margin-left: auto; margin-right: auto;">
          I prodotti di esempio provvisori sono stati rimossi. Clicca sul pulsante qui sotto per inserire i tuoi prodotti e caricare i video reali!
        </p>
        <button class="btn-primary" style="margin: 0 auto;" onclick="openProductModal()">
          <span>+ Aggiungi il tuo Primo Prodotto</span>
        </button>
      </div>
    `;
    return;
  }

  container.innerHTML = '';

  for (const product of products) {
    const card = document.createElement('div');
    card.className = 'admin-prod-card';

    const formatsStr = (product.options || []).map(o => o.qty).join(' • ') || 'Nessun formato';
    const isLocalOnlyVideo = Boolean(product.video && product.video.startsWith('idb:'));
    const resolvedVideoUrl = await TSF_Storage.resolveMediaUrl(product.video);

    card.innerHTML = `
      <div class="admin-prod-media-box">
        <video 
          class="admin-prod-video" 
          src="${resolvedVideoUrl || ''}" 
          poster="${product.image || 'assets/logo-badge.png'}" 
          autoplay 
          muted 
          loop 
          playsinline>
        </video>
        <div class="admin-prod-badge-strip">
          <span class="prod-cat-pill" data-cat="${product.category}">${product.category}</span>
          <span class="prod-subcat-pill">${product.subcategory || 'ALL'}</span>
        </div>
      </div>

      <div class="admin-prod-body">
        <h4 class="admin-prod-title">${escapeHtml(product.title)}</h4>
        <div class="admin-prod-lineage">${escapeHtml(product.lineage || 'Genetica Reserve')}</div>

        ${isLocalOnlyVideo ? `<div style="margin: 8px 0; padding: 7px 10px; background: rgba(245,158,11,0.12); border: 1px solid rgba(245,158,11,0.35); border-radius: 8px; font-size: 0.74rem; color: #FCD34D; line-height: 1.35;">⚠️ Video salvato solo su quel dispositivo: premi <strong>Modifica</strong> e ricarica il video per pubblicarlo online per tutti.</div>` : ''}

        <div class="admin-prod-tags">
          ${product.potency ? `<span class="admin-tag-pill">${escapeHtml(product.potency)}</span>` : ''}
          ${product.terpenes ? `<span class="admin-tag-pill">${escapeHtml(product.terpenes)}</span>` : ''}
          ${product.badge ? `<span class="admin-tag-pill" style="color: var(--admin-gold);">${escapeHtml(product.badge)}</span>` : ''}
        </div>

        <p class="admin-prod-desc">${escapeHtml(product.desc || '')}</p>
        <div class="admin-prod-formats">Formati: <strong>${escapeHtml(formatsStr)}</strong></div>

        <div class="admin-prod-actions">
          <button class="btn-card-action btn-card-edit" onclick="openProductModal('${product.id}')">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
            <span>Modifica</span>
          </button>
          <button class="btn-card-action btn-card-delete" onclick="handleDeleteProduct('${product.id}')">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
            <span>Elimina</span>
          </button>
        </div>
      </div>
    `;

    const adminVid = card.querySelector('.admin-prod-video');
    if (adminVid) {
      adminVid.addEventListener('loadedmetadata', () => {
        const vw = adminVid.videoWidth;
        const vh = adminVid.videoHeight;
        const box = adminVid.closest('.admin-prod-media-box');
        if (vw && vh && box) {
          box.style.aspectRatio = vw >= vh ? `${vw} / ${vh}` : `${Math.max(vw / vh, 9 / 16)}`;
        }
      });
      if (product.video && product.video.startsWith('assets/videos/')) {
        let triedRaw = false;
        adminVid.onerror = () => {
          if (!triedRaw) {
            triedRaw = true;
            adminVid.src = 'https://raw.githubusercontent.com/kimeraexpress/thesmokefarmspain/main/' + product.video;
            adminVid.load();
            adminVid.play().catch(() => {});
          }
        };
      }
    }

    container.appendChild(card);
  }
}

async function handleDeleteProduct(id) {
  const p = TSF_Storage.getProductById(id);
  const title = p ? p.title : 'questo prodotto';

  if (confirm(`Sei sicuro di voler eliminare il prodotto "${title}"?\nQuesta operazione lo rimuoverà dal catalogo.`)) {
    const res = await TSF_Storage.deleteProduct(id);
    if (res.success) {
      if (res.savedToGitHub) {
        showToast(`Prodotto eliminato e sincronizzato sul sito live!`);
      } else {
        showToast(`Prodotto eliminato localmente. Clicca "Pubblica Live" per aggiornare il sito pubblico.`);
      }
      refreshDashboard();
      updateLiveSyncStatusBanner();
    }
  }
}

// =======================================================================
//  TAB 2: SUBCATEGORIES MANAGEMENT (ASH, WEED, ICE)
// =======================================================================
function renderSubcategoriesManagement() {
  const categories = TSF_Storage.getCategories();

  ['ASH', 'WEED', 'ICE'].forEach(cat => {
    const listEl = document.getElementById(`subcatsList_${cat}`);
    const countEl = document.getElementById(`count${cat.charAt(0) + cat.slice(1).toLowerCase()}Subcats`);
    const subcats = categories[cat] || [];

    if (countEl) countEl.textContent = `${subcats.length} sottocategorie`;
    if (!listEl) return;

    listEl.innerHTML = '';

    if (subcats.length === 0) {
      listEl.innerHTML = `<div style="text-align: center; color: var(--text-dim); padding: 16px; font-size: 0.8rem;">Nessuna sottocategoria configurata.</div>`;
      return;
    }

    subcats.forEach(subName => {
      const prodCount = TSF_Storage.getProductCountBySubcategory(cat, subName);
      const row = document.createElement('div');
      row.className = 'subcat-item-row';
      row.innerHTML = `
        <div class="subcat-item-info">
          <span class="subcat-item-name">${escapeHtml(subName)}</span>
          <span class="subcat-item-count">${prodCount} ${prodCount === 1 ? 'prodotto associato' : 'prodotti associati'}</span>
        </div>
        <div class="subcat-item-actions">
          <button class="btn-icon-subcat" onclick="handleEditSubcategory('${cat}', '${escapeHtml(subName)}')" title="Rinomina">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 20h9"></path>
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
            </svg>
          </button>
          <button class="btn-icon-subcat btn-del" onclick="handleDeleteSubcategory('${cat}', '${escapeHtml(subName)}')" title="Elimina">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      `;
      listEl.appendChild(row);
    });
  });
}

async function handleAddSubcategory(mainCat) {
  const input = document.getElementById(`newSubcatInput_${mainCat}`);
  const val = input.value.trim();
  if (!val) {
    alert('Inserisci il nome della sottocategoria');
    return;
  }

  try {
    await TSF_Storage.addSubcategory(mainCat, val);
    input.value = '';
    renderSubcategoriesManagement();
    showToast(`Sottocategoria "${val.toUpperCase()}" aggiunta a ${mainCat}!`);
  } catch (err) {
    alert(err.message);
  }
}

async function handleEditSubcategory(mainCat, oldName) {
  const newName = prompt(`Rinomina sottocategoria "${oldName}" in ${mainCat}:`, oldName);
  if (!newName || newName.trim().toUpperCase() === oldName.toUpperCase()) return;

  try {
    const res = await TSF_Storage.editSubcategory(mainCat, oldName, newName);
    renderSubcategoriesManagement();
    renderProductsList();
    showToast(`Rinominata in "${newName.trim().toUpperCase()}". ${res.updatedProducts} prodotti aggiornati.`);
  } catch (err) {
    alert(err.message);
  }
}

async function handleDeleteSubcategory(mainCat, subcatName) {
  const count = TSF_Storage.getProductCountBySubcategory(mainCat, subcatName);
  let confirmMsg = `Vuoi eliminare la sottocategoria "${subcatName}" da ${mainCat}?`;
  if (count > 0) {
    confirmMsg += `\nAttenzione: ci sono ${count} prodotti collegati che verranno spostati sulla prima sottocategoria disponibile.`;
  }

  if (confirm(confirmMsg)) {
    await TSF_Storage.deleteSubcategory(mainCat, subcatName);
    renderSubcategoriesManagement();
    renderProductsList();
    showToast(`Sottocategoria "${subcatName}" eliminata.`);
  }
}

// =======================================================================
//  PRODUCT MODAL (ADD & EDIT)
// =======================================================================
async function openProductModal(productId = null) {
  currentEditingProductId = productId;
  const modal = document.getElementById('productFormModal');
  const modalTitle = document.getElementById('productModalTitle');
  const form = document.getElementById('productForm');
  form.reset();

  document.getElementById('videoPreviewWrap').style.display = 'none';
  document.getElementById('prodVideoPath').value = '';
  const uploadProg = document.getElementById('uploadProgressWrap');
  if (uploadProg) uploadProg.style.display = 'none';

  if (productId) {
    modalTitle.textContent = 'Modifica Prodotto';
    const p = TSF_Storage.getProductById(productId);
    if (!p) return;

    document.getElementById('editProductId').value = p.id;
    document.getElementById('prodTitle').value = p.title || '';
    document.getElementById('prodCategory').value = p.category || 'ASH';
    
    populateModalSubcategories(p.category, p.subcategory);

    document.getElementById('prodLineage').value = p.lineage || '';
    document.getElementById('prodPotency').value = p.potency || '';
    document.getElementById('prodTerpenes').value = p.terpenes || '';
    document.getElementById('prodBadge').value = p.badge || '';
    document.getElementById('prodDesc').value = p.desc || '';
    document.getElementById('prodAromas').value = (p.aromas || []).join(', ');
    
    const formatsStr = (p.options || []).map(o => o.qty).join(', ');
    document.getElementById('prodFormats').value = formatsStr;
    document.getElementById('prodImage').value = p.image || '';
    document.getElementById('prodHighlight').checked = Boolean(p.highlight);

    // Video path & preview
    if (p.video) {
      document.getElementById('prodVideoPath').value = p.video;
      const resolvedUrl = await TSF_Storage.resolveMediaUrl(p.video);
      if (resolvedUrl) {
        showVideoPreview(resolvedUrl, p.video.split('/').pop());
      }
    }
  } else {
    modalTitle.textContent = 'Nuovo Prodotto';
    document.getElementById('editProductId').value = '';
    document.getElementById('prodCategory').value = currentCategoryFilter !== 'ALL' ? currentCategoryFilter : 'ASH';
    populateModalSubcategories(document.getElementById('prodCategory').value);
  }

  modal.style.display = 'flex';
}

function closeProductModal() {
  document.getElementById('productFormModal').style.display = 'none';
  const vid = document.getElementById('modalPreviewVideo');
  if (vid) {
    vid.pause();
    vid.src = '';
  }
  currentEditingProductId = null;
}

function handleModalCategoryChange(selectedCat) {
  populateModalSubcategories(selectedCat);
}

function populateModalSubcategories(mainCat, activeSubcat = null) {
  const select = document.getElementById('prodSubcategory');
  const subcats = TSF_Storage.getSubcategories(mainCat);
  select.innerHTML = '';

  if (subcats.length === 0) {
    const opt = document.createElement('option');
    opt.value = 'GENERAL';
    opt.textContent = 'GENERAL';
    select.appendChild(opt);
    return;
  }

  subcats.forEach(sub => {
    const opt = document.createElement('option');
    opt.value = sub;
    opt.textContent = sub;
    if (activeSubcat && sub.toUpperCase() === activeSubcat.toUpperCase()) {
      opt.selected = true;
    }
    select.appendChild(opt);
  });
}

async function quickAddSubcatFromModal() {
  const cat = document.getElementById('prodCategory').value;
  const name = prompt(`Inserisci il nome della nuova sottocategoria per ${cat}:`);
  if (!name || !name.trim()) return;

  try {
    await TSF_Storage.addSubcategory(cat, name.trim());
    populateModalSubcategories(cat, name.trim().toUpperCase());
    renderSubcategoriesManagement();
    showToast(`Sottocategoria "${name.trim().toUpperCase()}" creata!`);
  } catch (err) {
    alert(err.message);
  }
}

// =======================================================================
//  VIDEO HANDLING (Direct Link, Device Upload, Preset)
// =======================================================================
function handleVideoUrlInput(val) {
  const clean = (val || '').trim();
  if (clean) {
    showVideoPreview(clean, clean.split('/').pop());
  } else {
    removeSelectedVideo();
  }
}

function previewCurrentVideoUrl() {
  const val = document.getElementById('prodVideoPath').value.trim();
  if (!val) {
    alert('Inserisci prima un link video o seleziona un file');
    return;
  }
  showVideoPreview(val, val.split('/').pop());
}

async function handleVideoFileSelected(e) {
  const file = e.target.files[0];
  if (!file) return;

  const progWrap = document.getElementById('uploadProgressWrap');
  const progBar = document.getElementById('uploadProgressBar');
  const progStatus = document.getElementById('uploadProgressStatus');
  const progPct = document.getElementById('uploadProgressPercent');
  const btnLabel = document.getElementById('uploadBtnText');
  const saveBtn = document.getElementById('btnSaveProductSubmit');

  if (progWrap) progWrap.style.display = 'block';
  if (progBar) progBar.style.width = '5%';
  if (progPct) progPct.textContent = '5%';
  if (progStatus) progStatus.textContent = 'Preparazione video...';
  if (btnLabel) btnLabel.textContent = file.name;
  if (saveBtn) {
    saveBtn.disabled = true;
    saveBtn.textContent = 'Caricamento video...';
  }

  try {
    const result = await TSF_Storage.uploadMediaFile(file, (pct, status) => {
      if (progBar) progBar.style.width = pct + '%';
      if (progPct) progPct.textContent = pct + '%';
      if (progStatus) progStatus.textContent = status;
    });

    document.getElementById('prodVideoPath').value = result.path;
    showVideoPreview(result.previewUrl, result.filename);

    if (result.isOnline) {
      showToast('Video caricato online su CDN! Ora premi Salva Prodotto.');
    } else {
      showToast('Video salvato in anteprima locale.');
    }
  } catch (err) {
    alert(err.message);
    if (progWrap) progWrap.style.display = 'none';
    if (btnLabel) btnLabel.textContent = 'Seleziona Video dalla Galleria';
    e.target.value = '';
  } finally {
    if (saveBtn) {
      saveBtn.disabled = false;
      saveBtn.textContent = 'Salva Prodotto';
    }
  }
}

async function handleSelectExistingVideo(val) {
  if (!val) return;
  document.getElementById('prodVideoPath').value = val;
  const resolved = await TSF_Storage.resolveMediaUrl(val);
  showVideoPreview(resolved, val.split('/').pop());
}

function showVideoPreview(url, label) {
  const wrap = document.getElementById('videoPreviewWrap');
  const vid = document.getElementById('modalPreviewVideo');
  const nameSpan = document.getElementById('previewVideoName');

  vid.onerror = null;
  if (url && url.startsWith('assets/videos/')) {
    let triedRaw = false;
    vid.onerror = () => {
      if (!triedRaw) {
        triedRaw = true;
        vid.src = 'https://raw.githubusercontent.com/kimeraexpress/thesmokefarmspain/main/' + url;
        vid.load();
        vid.play().catch(() => {});
      }
    };
  }

  vid.src = url;
  vid.play().catch(() => {});
  nameSpan.textContent = label || 'Video selezionato';
  wrap.style.display = 'flex';
}

function removeSelectedVideo() {
  document.getElementById('prodVideoPath').value = '';
  const sel = document.getElementById('prodVideoSelect');
  if (sel) sel.value = '';
  const vid = document.getElementById('modalPreviewVideo');
  if (vid) {
    vid.pause();
    vid.src = '';
  }
  const fileInput = document.getElementById('videoFileInput');
  if (fileInput) fileInput.value = '';
  const btnLabel = document.getElementById('uploadBtnText');
  if (btnLabel) btnLabel.textContent = 'Seleziona Video dalla Galleria';
  const progWrap = document.getElementById('uploadProgressWrap');
  if (progWrap) progWrap.style.display = 'none';
  document.getElementById('videoPreviewWrap').style.display = 'none';
}

// =======================================================================
//  SAVE PRODUCT FORM
// =======================================================================
async function handleSaveProductForm(e) {
  e.preventDefault();
  const btn = document.getElementById('btnSaveProductSubmit');
  btn.disabled = true;
  btn.textContent = 'Salvataggio...';

  try {
    const id = document.getElementById('editProductId').value || null;
    const title = document.getElementById('prodTitle').value.trim();
    const category = document.getElementById('prodCategory').value;
    const subcategory = document.getElementById('prodSubcategory').value;
    const lineage = document.getElementById('prodLineage').value.trim();
    const potency = document.getElementById('prodPotency').value.trim();
    const terpenes = document.getElementById('prodTerpenes').value.trim();
    const badge = document.getElementById('prodBadge').value.trim();
    const desc = document.getElementById('prodDesc').value.trim();
    
    const aromasRaw = document.getElementById('prodAromas').value;
    const aromas = aromasRaw.split(',').map(s => s.trim()).filter(Boolean);

    const formatsRaw = document.getElementById('prodFormats').value;
    const formatQtys = formatsRaw.split(',').map(s => s.trim()).filter(Boolean);
    const options = formatQtys.length > 0 
      ? formatQtys.map(q => ({ qty: q, price: null })) 
      : [{ qty: '5g', price: null }, { qty: '10g', price: null }];

    const video = document.getElementById('prodVideoPath').value.trim() || 'assets/videos/ash-showcase.mp4';
    const image = document.getElementById('prodImage').value.trim() || 'assets/logo-badge.png';
    const highlight = document.getElementById('prodHighlight').checked;

    const productData = {
      title,
      category,
      subcategory,
      lineage,
      potency,
      terpenes,
      badge,
      desc,
      aromas,
      options,
      video,
      image,
      highlight
    };
    if (id) productData.id = id;

    const res = await TSF_Storage.saveProduct(productData);
    closeProductModal();
    refreshDashboard();

    updateLiveSyncStatusBanner();
    if (res.savedToGitHub) {
      showToast(id ? 'Prodotto aggiornato e sincronizzato sul sito live!' : 'Nuovo prodotto pubblicato sul sito live!');
    } else {
      showToast(id ? 'Prodotto salvato localmente! Clicca "Pubblica Live" per mandarlo online.' : 'Nuovo prodotto salvato localmente! Clicca "Pubblica Live" per mandarlo online.');
    }
  } catch (err) {
    alert('Errore: ' + err.message);
  } finally {
    btn.disabled = false;
    btn.textContent = 'Salva Prodotto';
  }
}

// =======================================================================
//  TAB 3: BACKUP, RESTORE & LIVE GITHUB SYNC
// =======================================================================
function handleSaveGitHubToken() {
  const input = document.getElementById('ghTokenInput');
  const token = (input.value || '').trim();
  TSF_Storage.setGitHubToken(token);
  updateTokenStatusMsg(Boolean(token));
  showToast(token ? 'Token salvato con successo!' : 'Token rimosso.');
}

function updateTokenStatusMsg(hasToken) {
  const msgEl = document.getElementById('tokenStatusMsg');
  if (!msgEl) return;
  if (hasToken) {
    msgEl.innerHTML = '<span style="color: #4EED8F;">✓ Token attivo: le modifiche al catalogo si sincronizzano automaticamente con Vercel.</span>';
  } else {
    msgEl.innerHTML = '<span>Nessun token impostato. Puoi esportare il file JSON o sincronizzare manualmente.</span>';
  }
}

async function handleManualSyncToLive() {
  if (!TSF_Storage.hasLiveSync()) {
    openLiveSyncModal();
    return;
  }

  const btn = document.getElementById('btnHeaderSync');
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = `<span style="font-size: 0.78rem;">Pubblicando...</span>`;
  }
  showToast('Sincronizzazione con il sito live in corso...', 'info');

  const res = await TSF_Storage.syncToGitHub();

  if (btn) {
    btn.disabled = false;
    btn.innerHTML = `
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
        <polyline points="23 4 23 10 17 10"></polyline>
        <polyline points="1 20 1 14 7 14"></polyline>
        <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
      </svg>
      <span class="hide-mobile">Pubblica Live</span>
    `;
  }

  if (res.success) {
    updateLiveSyncStatusBanner();
    showToast('Sincronizzazione riuscita! Vercel sta aggiornando il sito pubblico in 10-15s.');
  } else if (res.needToken) {
    openLiveSyncModal();
  } else {
    alert(`Impossibile sincronizzare automaticamente: ${res.message}\n\nVerifica che il token sia corretto e con permessi repo.`);
  }
}

function updateLiveSyncStatusBanner() {
  const banner = document.getElementById('liveSyncStatusBanner');
  if (!banner) return;
  const hasToken = TSF_Storage.hasLiveSync();
  const products = TSF_Storage.getProducts();

  banner.style.display = 'flex';
  if (hasToken) {
    banner.className = 'sync-status-banner synced';
    banner.innerHTML = `
      <div class="banner-text">
        <span style="font-size: 1.15rem;">🟢</span>
        <div>
          <strong>Connessione Live Attiva:</strong> Tutte le modifiche possono essere sincronizzate direttamente su Vercel per tutti i visitatori.
        </div>
      </div>
      <button type="button" class="banner-btn" onclick="handleManualSyncToLive()">
        <span>Pubblica Live Ora</span>
      </button>
    `;
  } else {
    banner.className = 'sync-status-banner local-only';
    banner.innerHTML = `
      <div class="banner-text">
        <span style="font-size: 1.15rem;">🟡</span>
        <div>
          <strong>Modalità Locale (${products.length} ${products.length === 1 ? 'prodotto' : 'prodotti'}):</strong> I prodotti sono memorizzati su questo dispositivo. Per renderli visibili online sul link pubblico a tutti i clienti, collega la chiave di pubblicazione.
        </div>
      </div>
      <button type="button" class="banner-btn" onclick="openLiveSyncModal()">
        <span>Collega e Pubblica Live</span>
      </button>
    `;
  }
}

function openLiveSyncModal() {
  const modal = document.getElementById('liveSyncModal');
  const input = document.getElementById('modalGhTokenInput');
  if (input) input.value = TSF_Storage.getGitHubToken() || '';
  if (modal) modal.style.display = 'flex';
}

function closeLiveSyncModal() {
  const modal = document.getElementById('liveSyncModal');
  if (modal) modal.style.display = 'none';
}

async function handleSaveAndSyncLiveModal() {
  const input = document.getElementById('modalGhTokenInput');
  const token = (input.value || '').trim();
  if (!token) {
    alert('Inserisci il Token GitHub per procedere alla sincronizzazione');
    return;
  }
  TSF_Storage.setGitHubToken(token);
  const ghInput = document.getElementById('ghTokenInput');
  if (ghInput) ghInput.value = token;
  updateTokenStatusMsg(true);
  updateLiveSyncStatusBanner();
  closeLiveSyncModal();
  showToast('Token salvato con successo! Pubblicazione in corso...', 'info');
  await handleManualSyncToLive();
}

async function handleImportCatalogFile(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = async (evt) => {
    try {
      await TSF_Storage.importCatalogJson(evt.target.result);
      refreshDashboard();
      showToast('Catalogo importato con successo!');
    } catch (err) {
      alert(err.message);
    }
  };
  reader.readAsText(file);
}

async function handleResetCatalog() {
  if (confirm('Vuoi svuotare il catalogo lasciando solo le categorie e sottocategorie pulite?')) {
    await TSF_Storage.resetToDefaults();
    refreshDashboard();
    showToast('Catalogo resettato a categorie vuote.');
  }
}

// =======================================================================
//  HELPERS
// =======================================================================
function showToast(message, type = 'success') {
  const toast = document.getElementById('adminToast');
  if (!toast) return;
  toast.textContent = message;
  toast.className = `admin-toast ${type}`;
  toast.style.display = 'flex';

  setTimeout(() => {
    toast.style.display = 'none';
  }, 4000);
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

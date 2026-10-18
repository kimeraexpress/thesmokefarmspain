# THE SMOKE FARM SPAIN

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fkimeraexpress%2Fthe-smoke-farm-spain)

Sito web e catalogo digitale mobile-first ad altissima definizione per **THE SMOKE FARM SPAIN** (Barcellona, Spagna). Include video showcase in autoplay continuo, filtri per sottocategorie dinamiche e pannello di amministrazione protetto da password.

---

## Caratteristiche Principali

- **Design Luxury & Dark Gold:** Ottimizzato specificamente per la consultazione da smartphone e tablet.
- **Sezioni Prodotti:**
  - **ASH:** Static, Fresh Frozen, Dry Sift, Mousse, Dry Work (e sottocategorie personalizzabili).
  - **WEED:** Cali Genetics, Exotic Indoor, Cali Tops, Organic Soil (e sottocategorie personalizzabili).
  - **ICE:** Full Melt, Live Rosin, Bubble Hash, 1st Wash (e sottocategorie personalizzabili).
- **Video in Autoplay:** Riproduzione automatica e fluida di tutti i video di presentazione senza dover cliccare "play".
- **Pannello Admin Riservato (`admin.html`):**
  - Accesso protetto da password (predefinita: `tsfspain2026`, modificabile dalla dashboard).
  - Aggiunta, modifica ed eliminazione prodotti.
  - Caricamento diretto di video e media associati.
  - Creazione, rinomina ed eliminazione dinamica delle sottocategorie per tutte le sezioni (ASH, WEED, ICE).
  - Esportazione ed importazione di backup completi in formato JSON.
- **Nessun prezzo pubblico:** Pulsante d'ordine diretto "Ordina Qui" configurato per l'inoltro al club.

---

## Deploy su Vercel

1. Clicca sul pulsante qui sopra **Deploy with Vercel** oppure accedi a [Vercel](https://vercel.com).
2. Seleziona la repository `kimeraexpress/the-smoke-farm-spain`.
3. Clicca su **Deploy**. In pochi secondi il sito sarà online con dominio live HTTPS gratuito (es. `the-smoke-farm-spain.vercel.app`).

---

## Avvio in Locale

Fai doppio click sul file `AVVIA_SITO.bat` oppure esegui:
```bash
python server.py 8080
```
- Sito Principale: `http://localhost:8080`
- Pannello Admin: `http://localhost:8080/admin.html`

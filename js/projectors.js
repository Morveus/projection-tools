// Projector Database — 60+ popular models with realistic throw ratios
// type: "standard" (ratio > 1.0), "short" (0.5-1.0), "ust" (< 0.5)

export const projectors = [
  // ── BenQ ──────────────────────────────────────────────
  { id: "benq-w2700",    brand: "BenQ", model: "W2700",    ratioMin: 1.13, ratioMax: 1.47, resolution: "4K",    type: "standard" },
  { id: "benq-w1800",    brand: "BenQ", model: "W1800",    ratioMin: 1.15, ratioMax: 1.50, resolution: "4K",    type: "standard" },
  { id: "benq-tk700sti", brand: "BenQ", model: "TK700STi", ratioMin: 0.90, ratioMax: 1.08, resolution: "4K",    type: "short" },
  { id: "benq-w1080st",  brand: "BenQ", model: "W1080ST",  ratioMin: 0.69, ratioMax: 0.83, resolution: "1080p", type: "short" },
  { id: "benq-th585p",   brand: "BenQ", model: "TH585P",   ratioMin: 1.15, ratioMax: 1.50, resolution: "1080p", type: "standard" },
  { id: "benq-x3100i",   brand: "BenQ", model: "X3100i",   ratioMin: 1.15, ratioMax: 1.50, resolution: "4K",    type: "standard" },
  { id: "benq-gp520",    brand: "BenQ", model: "GP520",    ratioMin: 1.20, ratioMax: 1.20, resolution: "4K",    type: "standard" },

  // ── Epson ─────────────────────────────────────────────
  { id: "epson-eh-tw7100",  brand: "Epson", model: "EH-TW7100",  ratioMin: 1.32, ratioMax: 2.15, resolution: "4K",    type: "standard" },
  { id: "epson-eh-tw9400",  brand: "Epson", model: "EH-TW9400",  ratioMin: 1.35, ratioMax: 2.84, resolution: "4K",    type: "standard" },
  { id: "epson-eh-tw5700",  brand: "Epson", model: "EH-TW5700",  ratioMin: 1.32, ratioMax: 2.15, resolution: "1080p", type: "standard" },
  { id: "epson-eh-ls800",   brand: "Epson", model: "EH-LS800",   ratioMin: 0.16, ratioMax: 0.16, resolution: "4K",    type: "ust" },
  { id: "epson-eh-ls300",   brand: "Epson", model: "EH-LS300",   ratioMin: 0.19, ratioMax: 0.19, resolution: "1080p", type: "ust" },
  { id: "epson-ef-12",      brand: "Epson", model: "EF-12",      ratioMin: 1.04, ratioMax: 1.04, resolution: "1080p", type: "standard" },

  // ── Optoma ────────────────────────────────────────────
  { id: "optoma-uhd38",   brand: "Optoma", model: "UHD38",   ratioMin: 1.21, ratioMax: 1.59, resolution: "4K",    type: "standard" },
  { id: "optoma-uhd50x",  brand: "Optoma", model: "UHD50X",  ratioMin: 1.21, ratioMax: 1.59, resolution: "4K",    type: "standard" },
  { id: "optoma-hd146x",  brand: "Optoma", model: "HD146X",  ratioMin: 1.21, ratioMax: 1.59, resolution: "1080p", type: "standard" },
  { id: "optoma-gt2100hdr", brand: "Optoma", model: "GT2100HDR", ratioMin: 0.50, ratioMax: 0.50, resolution: "1080p", type: "short" },
  { id: "optoma-uhz66",   brand: "Optoma", model: "UHZ66",   ratioMin: 1.21, ratioMax: 1.59, resolution: "4K",    type: "standard" },

  // ── Sony ──────────────────────────────────────────────
  { id: "sony-vpl-xw5000", brand: "Sony", model: "VPL-XW5000ES", ratioMin: 1.38, ratioMax: 2.21, resolution: "4K", type: "standard" },
  { id: "sony-vpl-xw7000", brand: "Sony", model: "VPL-XW7000ES", ratioMin: 1.38, ratioMax: 2.21, resolution: "4K", type: "standard" },
  { id: "sony-vpl-hw65es", brand: "Sony", model: "VPL-HW65ES",   ratioMin: 1.36, ratioMax: 2.16, resolution: "1080p", type: "standard" },
  { id: "sony-vpl-vw290es", brand: "Sony", model: "VPL-VW290ES", ratioMin: 1.36, ratioMax: 2.16, resolution: "4K", type: "standard" },

  // ── LG ────────────────────────────────────────────────
  { id: "lg-hu715q",    brand: "LG", model: "CineBeam HU715Q",  ratioMin: 0.19, ratioMax: 0.19, resolution: "4K",    type: "ust" },
  { id: "lg-hu915qb",   brand: "LG", model: "CineBeam HU915QB", ratioMin: 0.19, ratioMax: 0.19, resolution: "4K",    type: "ust" },
  { id: "lg-pf50ka",    brand: "LG", model: "PF50KA",           ratioMin: 1.20, ratioMax: 1.20, resolution: "1080p", type: "standard" },
  { id: "lg-hu810p",    brand: "LG", model: "CineBeam HU810P",  ratioMin: 1.30, ratioMax: 2.08, resolution: "4K",    type: "standard" },

  // ── Samsung ───────────────────────────────────────────
  { id: "samsung-lsp9t",   brand: "Samsung", model: "The Premiere LSP9T",  ratioMin: 0.18, ratioMax: 0.18, resolution: "4K",    type: "ust" },
  { id: "samsung-lsp7t",   brand: "Samsung", model: "The Premiere LSP7T",  ratioMin: 0.19, ratioMax: 0.19, resolution: "4K",    type: "ust" },
  { id: "samsung-freestyle", brand: "Samsung", model: "The Freestyle",     ratioMin: 1.00, ratioMax: 1.00, resolution: "1080p", type: "standard" },

  // ── Xgimi ─────────────────────────────────────────────
  { id: "xgimi-horizon-pro", brand: "Xgimi", model: "Horizon Pro",   ratioMin: 1.20, ratioMax: 1.20, resolution: "4K",    type: "standard" },
  { id: "xgimi-horizon",     brand: "Xgimi", model: "Horizon",       ratioMin: 1.20, ratioMax: 1.20, resolution: "1080p", type: "standard" },
  { id: "xgimi-halo-plus",   brand: "Xgimi", model: "Halo+",        ratioMin: 1.20, ratioMax: 1.20, resolution: "1080p", type: "standard" },
  { id: "xgimi-aura",        brand: "Xgimi", model: "Aura",         ratioMin: 0.23, ratioMax: 0.23, resolution: "4K",    type: "ust" },
  { id: "xgimi-astra",       brand: "Xgimi", model: "Astra",        ratioMin: 0.21, ratioMax: 0.21, resolution: "4K",    type: "ust" },

  // ── Xiaomi ────────────────────────────────────────────
  { id: "xiaomi-laser-cinema-2", brand: "Xiaomi", model: "Laser Cinema 2", ratioMin: 0.23, ratioMax: 0.23, resolution: "4K", type: "ust" },
  { id: "xiaomi-mi-smart-2",     brand: "Xiaomi", model: "Mi Smart Projector 2", ratioMin: 1.20, ratioMax: 1.20, resolution: "1080p", type: "standard" },
  { id: "xiaomi-laser-cinema-1", brand: "Xiaomi", model: "Laser Cinema 1",  ratioMin: 0.23, ratioMax: 0.23, resolution: "4K", type: "ust" },

  // ── JVC ───────────────────────────────────────────────
  { id: "jvc-dla-nz7",   brand: "JVC", model: "DLA-NZ7",   ratioMin: 1.40, ratioMax: 2.80, resolution: "4K", type: "standard" },
  { id: "jvc-dla-nz8",   brand: "JVC", model: "DLA-NZ8",   ratioMin: 1.40, ratioMax: 2.80, resolution: "4K", type: "standard" },
  { id: "jvc-dla-nz900", brand: "JVC", model: "DLA-NZ900", ratioMin: 1.40, ratioMax: 2.80, resolution: "4K", type: "standard" },
  { id: "jvc-dla-rs3100", brand: "JVC", model: "DLA-RS3100", ratioMin: 1.40, ratioMax: 2.80, resolution: "4K", type: "standard" },

  // ── Hisense ───────────────────────────────────────────
  { id: "hisense-px1-pro",  brand: "Hisense", model: "PX1-PRO",     ratioMin: 0.25, ratioMax: 0.25, resolution: "4K",    type: "ust" },
  { id: "hisense-l9g",      brand: "Hisense", model: "L9G",         ratioMin: 0.25, ratioMax: 0.25, resolution: "4K",    type: "ust" },
  { id: "hisense-l5g",      brand: "Hisense", model: "L5G",         ratioMin: 0.25, ratioMax: 0.25, resolution: "4K",    type: "ust" },
  { id: "hisense-c1",       brand: "Hisense", model: "C1",          ratioMin: 0.25, ratioMax: 0.25, resolution: "4K",    type: "ust" },
  { id: "hisense-px2-pro",  brand: "Hisense", model: "PX2-PRO",     ratioMin: 0.21, ratioMax: 0.21, resolution: "4K",    type: "ust" },

  // ── ViewSonic ─────────────────────────────────────────
  { id: "viewsonic-px701-4k",  brand: "ViewSonic", model: "PX701-4K",  ratioMin: 1.13, ratioMax: 1.47, resolution: "4K",    type: "standard" },
  { id: "viewsonic-px748-4k",  brand: "ViewSonic", model: "PX748-4K",  ratioMin: 1.13, ratioMax: 1.47, resolution: "4K",    type: "standard" },
  { id: "viewsonic-m2e",       brand: "ViewSonic", model: "M2e",       ratioMin: 1.07, ratioMax: 1.07, resolution: "1080p", type: "standard" },
  { id: "viewsonic-x2000b-4k", brand: "ViewSonic", model: "X2000B-4K", ratioMin: 0.22, ratioMax: 0.22, resolution: "4K",   type: "ust" },

  // ── Acer ──────────────────────────────────────────────
  { id: "acer-v7050",    brand: "Acer", model: "V7050",     ratioMin: 1.39, ratioMax: 2.09, resolution: "4K",    type: "standard" },
  { id: "acer-h6800bda", brand: "Acer", model: "H6800BDa",  ratioMin: 1.21, ratioMax: 1.59, resolution: "4K",    type: "standard" },
  { id: "acer-h5385bdi", brand: "Acer", model: "H5385BDi",  ratioMin: 1.21, ratioMax: 1.59, resolution: "1080p", type: "standard" },
  { id: "acer-h6518sti", brand: "Acer", model: "H6518STi",  ratioMin: 0.69, ratioMax: 0.76, resolution: "1080p", type: "short" },

  // ── VAVA ──────────────────────────────────────────────
  { id: "vava-4k-ust",     brand: "VAVA", model: "4K UST Laser", ratioMin: 0.25, ratioMax: 0.25, resolution: "4K", type: "ust" },
  { id: "vava-chroma-triple", brand: "VAVA", model: "Chroma Triple Laser", ratioMin: 0.25, ratioMax: 0.25, resolution: "4K", type: "ust" },

  // ── Formovie ──────────────────────────────────────────
  { id: "formovie-theater", brand: "Formovie", model: "Theater",      ratioMin: 0.23, ratioMax: 0.23, resolution: "4K", type: "ust" },
  { id: "formovie-v10",     brand: "Formovie", model: "V10 4K SE",    ratioMin: 1.27, ratioMax: 1.27, resolution: "4K", type: "standard" },

  // ── Dangbei ───────────────────────────────────────────
  { id: "dangbei-mars-pro", brand: "Dangbei", model: "Mars Pro",   ratioMin: 1.27, ratioMax: 1.27, resolution: "4K",    type: "standard" },
  { id: "dangbei-atom",     brand: "Dangbei", model: "Atom",       ratioMin: 1.20, ratioMax: 1.20, resolution: "1080p", type: "standard" },
];

// Helper: get unique brands
export function getBrands() {
  return [...new Set(projectors.map(p => p.brand))].sort();
}

// Helper: fuzzy search
export function searchProjectors(query, filters = {}) {
  let results = [...projectors];

  // Apply resolution filter
  if (filters.resolution && filters.resolution !== "all") {
    results = results.filter(p => p.resolution === filters.resolution);
  }

  // Apply type filter
  if (filters.type && filters.type !== "all") {
    results = results.filter(p => p.type === filters.type);
  }

  // Apply text search (fuzzy)
  if (query && query.trim()) {
    const q = query.toLowerCase().trim();
    const terms = q.split(/\s+/);
    results = results.filter(p => {
      const text = `${p.brand} ${p.model}`.toLowerCase();
      return terms.every(t => text.includes(t));
    });

    // Sort by relevance: exact starts first
    results.sort((a, b) => {
      const aText = `${a.brand} ${a.model}`.toLowerCase();
      const bText = `${b.brand} ${b.model}`.toLowerCase();
      const aStarts = aText.startsWith(q) ? 0 : 1;
      const bStarts = bText.startsWith(q) ? 0 : 1;
      return aStarts - bStarts;
    });
  }

  return results;
}

// Group projectors by brand
export function groupByBrand(list) {
  const groups = {};
  for (const p of list) {
    if (!groups[p.brand]) groups[p.brand] = [];
    groups[p.brand].push(p);
  }
  return groups;
}

// Find projector by ID
export function findProjector(id) {
  return projectors.find(p => p.id === id) || null;
}

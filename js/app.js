// Main application orchestrator
import { projectors, searchProjectors, groupByBrand, findProjector } from "./projectors.js";
import { distanceToScreen, screenToDistance, findRatio, findMatchingProjectors } from "./calculators.js";
import { initCanvases, updateVisualization } from "./room-preview.js";
import { pushState, getStateFromURL, shareURL } from "./state.js";

// ── Translations ───────────────────────────────────────
const translations = {
  fr: {
    title: "Projection Tools",
    subtitle: "Calculateur de videoprojection",
    searchPlaceholder: "Rechercher un videoprojecteur...",
    all: "Tous",
    ust: "UST",
    shortThrow: "Courte focale",
    standard: "Standard",
    manualRatio: "Ratio manuel",
    modeDistance: "Distance \u2192 Taille",
    modeScreen: "Diagonale \u2192 Distance",
    modeFindRatio: "Trouver le ratio",
    distance: "Distance de projection",
    screenSize: "Taille d'ecran souhaitee",
    desiredWidth: "Largeur souhaitee",
    width: "Largeur",
    height: "Hauteur",
    diagonal: "Diagonale",
    requiredDistance: "Distance requise",
    requiredRatio: "Ratio necessaire",
    equivalent: "Equivalent \u00e0 un ecran de ~{size} pouces",
    equivalentRange: "Equivalent \u00e0 un ecran de ~{min} \u00e0 ~{max} pouces",
    matchingProjectors: "Projecteurs compatibles",
    noMatch: "Aucun projecteur compatible trouve",
    copy: "Copier",
    share: "Partager",
    copied: "Copie dans le presse-papier !",
    shared: "Lien copie !",
    sideView: "Vue de cote",
    frontView: "Vue de face",
    metric: "cm/m",
    imperial: "in/ft",
    to: "\u00e0",
    min: "min",
    max: "max",
    ratioMin: "Ratio min",
    ratioMax: "Ratio max",
    noProjector: "Selectionnez un projecteur ou entrez un ratio manuel",
    zoomRange: "Plage de zoom",
    screenHeight: "Hauteur de l'ecran",
    ceilingHeight: "Hauteur du plafond",
    roomSetup: "Configuration de la piece",
  },
  en: {
    title: "Projection Tools",
    subtitle: "Projector calculator",
    searchPlaceholder: "Search for a projector...",
    all: "All",
    ust: "UST",
    shortThrow: "Short throw",
    standard: "Standard",
    manualRatio: "Manual ratio",
    modeDistance: "Distance \u2192 Size",
    modeScreen: "Diagonal \u2192 Distance",
    modeFindRatio: "Find ratio",
    distance: "Projection distance",
    screenSize: "Desired screen size",
    desiredWidth: "Desired width",
    width: "Width",
    height: "Height",
    diagonal: "Diagonal",
    requiredDistance: "Required distance",
    requiredRatio: "Required ratio",
    equivalent: "Equivalent to a ~{size}-inch screen",
    equivalentRange: "Equivalent to a ~{min} to ~{max}-inch screen",
    matchingProjectors: "Matching projectors",
    noMatch: "No matching projectors found",
    copy: "Copy",
    share: "Share",
    copied: "Copied to clipboard!",
    shared: "Link copied!",
    sideView: "Side view",
    frontView: "Front view",
    metric: "cm/m",
    imperial: "in/ft",
    to: "to",
    min: "min",
    max: "max",
    ratioMin: "Ratio min",
    ratioMax: "Ratio max",
    noProjector: "Select a projector or enter a manual ratio",
    zoomRange: "Zoom range",
    screenHeight: "Screen height",
    ceilingHeight: "Ceiling height",
    roomSetup: "Room setup",
  },
};

// ── App State ──────────────────────────────────────────
let state = {
  projectorId: null,
  mode: "distance",  // "distance" | "screen" | "ratio"
  distance: 3.0,
  diagonal: 120,
  width: 250,
  manualRatioMin: 1.2,
  manualRatioMax: 1.5,
  useManual: false,
  units: "metric",
  lang: "fr",
  theme: "dark",
  filter: "all",
  screenHeight: 0.8,
  ceilingHeight: 2.5,
};

// ── DOM refs ───────────────────────────────────────────
let els = {};

// ── Init ───────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  cacheDOMRefs();
  loadPreferences();
  loadURLState();
  setupEventListeners();
  initCanvases(els.sideCanvas, els.frontCanvas);
  applyLanguage();
  applyTheme();
  updateCalculation();

  // Remove loading class
  document.body.classList.remove("app-loading");
  document.body.classList.add("app-ready");
});

function cacheDOMRefs() {
  els = {
    // Nav
    themeToggle: document.getElementById("theme-toggle"),
    langToggle: document.getElementById("lang-toggle"),

    // Projector selector
    searchInput: document.getElementById("projector-search"),
    searchClear: document.getElementById("search-clear"),
    dropdown: document.getElementById("projector-dropdown"),
    selectedProjector: document.getElementById("selected-projector"),
    chipName: document.getElementById("chip-name"),
    chipRatio: document.getElementById("chip-ratio"),
    chipRemove: document.getElementById("chip-remove"),
    filterTags: document.querySelectorAll(".filter-tag"),
    manualToggle: document.getElementById("manual-toggle"),
    manualInputs: document.getElementById("manual-ratio-inputs"),
    ratioMinInput: document.getElementById("ratio-min"),
    ratioMaxInput: document.getElementById("ratio-max"),

    // Mode tabs
    modeTabs: document.querySelectorAll(".mode-tab"),

    // Sliders
    distanceSlider: document.getElementById("distance-slider"),
    distanceNumber: document.getElementById("distance-number"),
    distanceGroup: document.getElementById("distance-group"),
    diagonalSlider: document.getElementById("diagonal-slider"),
    diagonalNumber: document.getElementById("diagonal-number"),
    diagonalGroup: document.getElementById("diagonal-group"),
    widthSlider: document.getElementById("width-slider"),
    widthNumber: document.getElementById("width-number"),
    widthGroup: document.getElementById("width-group"),

    // Results
    resultsContainer: document.getElementById("results-container"),

    // Canvas
    sideCanvas: document.getElementById("side-canvas"),
    frontCanvas: document.getElementById("front-canvas"),

    // Actions
    copyBtn: document.getElementById("copy-btn"),
    shareBtn: document.getElementById("share-btn"),
    unitToggle: document.querySelectorAll(".unit-btn"),

    // Room setup sliders
    screenHeightSlider: document.getElementById("screen-height-slider"),
    screenHeightNumber: document.getElementById("screen-height-number"),
    screenHeightGroup: document.getElementById("screen-height-group"),
    ceilingHeightSlider: document.getElementById("ceiling-height-slider"),
    ceilingHeightNumber: document.getElementById("ceiling-height-number"),
    ceilingHeightGroup: document.getElementById("ceiling-height-group"),

    // Labels (for i18n)
    labelDistance: document.getElementById("label-distance"),
    labelDiagonal: document.getElementById("label-diagonal"),
    labelWidth: document.getElementById("label-width"),
    labelScreenHeight: document.getElementById("label-screen-height"),
    labelCeilingHeight: document.getElementById("label-ceiling-height"),
    cardTitleRoom: document.getElementById("card-title-room"),
    sideViewLabel: document.getElementById("side-view-label"),
    frontViewLabel: document.getElementById("front-view-label"),
    labelRatioMin: document.getElementById("label-ratio-min"),
    labelRatioMax: document.getElementById("label-ratio-max"),

    // Toast
    toast: document.getElementById("toast"),
  };
}

function loadPreferences() {
  const savedLang = localStorage.getItem("pt-lang");
  if (savedLang) state.lang = savedLang;
  const savedTheme = localStorage.getItem("pt-theme");
  if (savedTheme) {
    state.theme = savedTheme;
  } else if (window.matchMedia("(prefers-color-scheme: light)").matches) {
    state.theme = "light";
  }
}

function loadURLState() {
  const urlState = getStateFromURL();
  if (urlState) {
    if (urlState.projectorId) state.projectorId = urlState.projectorId;
    if (urlState.mode) state.mode = urlState.mode;
    if (urlState.distance != null) state.distance = urlState.distance;
    if (urlState.diagonal != null) state.diagonal = urlState.diagonal;
    if (urlState.width != null) state.width = urlState.width;
    if (urlState.manualRatioMin != null) state.manualRatioMin = urlState.manualRatioMin;
    if (urlState.manualRatioMax != null) state.manualRatioMax = urlState.manualRatioMax;
    if (urlState.useManual) state.useManual = urlState.useManual;
    if (urlState.units) state.units = urlState.units;
    if (urlState.screenHeight != null) state.screenHeight = urlState.screenHeight;
    if (urlState.ceilingHeight != null) state.ceilingHeight = urlState.ceilingHeight;
  }

  // Apply loaded state to DOM
  els.distanceSlider.value = state.distance;
  els.distanceNumber.value = state.distance;
  els.diagonalSlider.value = state.diagonal;
  els.diagonalNumber.value = state.diagonal;
  els.widthSlider.value = state.width;
  els.widthNumber.value = state.width;
  els.ratioMinInput.value = state.manualRatioMin;
  els.ratioMaxInput.value = state.manualRatioMax;
  els.manualToggle.checked = state.useManual;
  els.screenHeightSlider.value = state.screenHeight;
  els.screenHeightNumber.value = state.screenHeight;
  els.ceilingHeightSlider.value = state.ceilingHeight;
  els.ceilingHeightNumber.value = state.ceilingHeight;

  if (state.useManual) {
    els.manualInputs.classList.add("visible");
  }

  // Set active mode tab
  els.modeTabs.forEach(tab => {
    tab.classList.toggle("active", tab.dataset.mode === state.mode);
  });

  // Set active unit
  els.unitToggle.forEach(btn => {
    btn.classList.toggle("active", btn.dataset.unit === state.units);
  });

  // Show/hide slider groups for mode
  updateSliderVisibility();

  // Select projector if in state
  if (state.projectorId) {
    const p = findProjector(state.projectorId);
    if (p) selectProjector(p, false);
  }
}

function setupEventListeners() {
  // Theme toggle
  els.themeToggle.addEventListener("click", () => {
    state.theme = state.theme === "dark" ? "light" : "dark";
    localStorage.setItem("pt-theme", state.theme);
    applyTheme();
  });

  // Language toggle
  els.langToggle.addEventListener("click", () => {
    state.lang = state.lang === "fr" ? "en" : "fr";
    localStorage.setItem("pt-lang", state.lang);
    applyLanguage();
    updateCalculation();
  });

  // Projector search
  els.searchInput.addEventListener("input", handleSearch);
  els.searchInput.addEventListener("focus", handleSearch);
  els.searchClear.addEventListener("click", () => {
    els.searchInput.value = "";
    els.searchClear.classList.remove("visible");
    handleSearch();
  });

  // Close dropdown on outside click
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".projector-search-wrapper")) {
      els.dropdown.classList.remove("open");
    }
  });

  // Filter tags
  els.filterTags.forEach(tag => {
    tag.addEventListener("click", () => {
      state.filter = tag.dataset.filter;
      els.filterTags.forEach(t => t.classList.toggle("active", t.dataset.filter === state.filter));
      handleSearch();
    });
  });

  // Chip remove
  els.chipRemove.addEventListener("click", () => {
    state.projectorId = null;
    els.selectedProjector.classList.remove("visible");
    els.searchInput.value = "";
    updateCalculation();
  });

  // Manual ratio toggle
  els.manualToggle.addEventListener("change", () => {
    state.useManual = els.manualToggle.checked;
    els.manualInputs.classList.toggle("visible", state.useManual);
    if (state.useManual) {
      state.projectorId = null;
      els.selectedProjector.classList.remove("visible");
    }
    updateCalculation();
  });

  // Manual ratio inputs
  els.ratioMinInput.addEventListener("input", () => {
    state.manualRatioMin = parseFloat(els.ratioMinInput.value) || 0.1;
    updateCalculation();
  });
  els.ratioMaxInput.addEventListener("input", () => {
    state.manualRatioMax = parseFloat(els.ratioMaxInput.value) || 0.1;
    updateCalculation();
  });

  // Mode tabs
  els.modeTabs.forEach(tab => {
    tab.addEventListener("click", () => {
      state.mode = tab.dataset.mode;
      els.modeTabs.forEach(t => t.classList.toggle("active", t.dataset.mode === state.mode));
      updateSliderVisibility();
      updateCalculation();
    });
  });

  // Distance slider/input
  els.distanceSlider.addEventListener("input", () => {
    state.distance = parseFloat(els.distanceSlider.value);
    els.distanceNumber.value = state.distance;
    updateCalculation();
  });
  els.distanceNumber.addEventListener("input", () => {
    const val = parseFloat(els.distanceNumber.value);
    if (!isNaN(val) && val >= 0.1 && val <= 15) {
      state.distance = val;
      els.distanceSlider.value = Math.min(val, 8);
      updateCalculation();
    }
  });

  // Diagonal slider/input
  els.diagonalSlider.addEventListener("input", () => {
    state.diagonal = parseFloat(els.diagonalSlider.value);
    els.diagonalNumber.value = state.diagonal;
    updateCalculation();
  });
  els.diagonalNumber.addEventListener("input", () => {
    const val = parseFloat(els.diagonalNumber.value);
    if (!isNaN(val) && val >= 30 && val <= 300) {
      state.diagonal = val;
      els.diagonalSlider.value = Math.min(Math.max(val, 60), 200);
      updateCalculation();
    }
  });

  // Width slider/input
  els.widthSlider.addEventListener("input", () => {
    state.width = parseFloat(els.widthSlider.value);
    els.widthNumber.value = state.width;
    updateCalculation();
  });
  els.widthNumber.addEventListener("input", () => {
    const val = parseFloat(els.widthNumber.value);
    if (!isNaN(val) && val >= 50 && val <= 600) {
      state.width = val;
      els.widthSlider.value = Math.min(Math.max(val, 100), 500);
      updateCalculation();
    }
  });

  // Screen height slider/input
  els.screenHeightSlider.addEventListener("input", () => {
    state.screenHeight = parseFloat(els.screenHeightSlider.value);
    els.screenHeightNumber.value = state.screenHeight;
    updateCalculation();
  });
  els.screenHeightNumber.addEventListener("input", () => {
    const val = parseFloat(els.screenHeightNumber.value);
    if (!isNaN(val) && val >= 0.3 && val <= 2.5) {
      state.screenHeight = val;
      els.screenHeightSlider.value = val;
      updateCalculation();
    }
  });

  // Ceiling height slider/input
  els.ceilingHeightSlider.addEventListener("input", () => {
    state.ceilingHeight = parseFloat(els.ceilingHeightSlider.value);
    els.ceilingHeightNumber.value = state.ceilingHeight;
    updateCalculation();
  });
  els.ceilingHeightNumber.addEventListener("input", () => {
    const val = parseFloat(els.ceilingHeightNumber.value);
    if (!isNaN(val) && val >= 2.0 && val <= 4.0) {
      state.ceilingHeight = val;
      els.ceilingHeightSlider.value = val;
      updateCalculation();
    }
  });

  // Unit toggle
  els.unitToggle.forEach(btn => {
    btn.addEventListener("click", () => {
      state.units = btn.dataset.unit;
      els.unitToggle.forEach(b => b.classList.toggle("active", b.dataset.unit === state.units));
      updateCalculation();
    });
  });

  // Copy & share buttons
  els.copyBtn.addEventListener("click", copyResults);
  els.shareBtn.addEventListener("click", async () => {
    const success = await shareURL();
    if (success) showToast(t("shared"));
  });
}

// ── Translation helper ─────────────────────────────────
function t(key, params = {}) {
  let str = translations[state.lang]?.[key] || translations.fr[key] || key;
  for (const [k, v] of Object.entries(params)) {
    str = str.replace(`{${k}}`, v);
  }
  return str;
}

function applyLanguage() {
  const lang = state.lang;
  els.langToggle.textContent = lang === "fr" ? "EN" : "FR";
  els.searchInput.placeholder = t("searchPlaceholder");

  // Mode tabs
  const modeLabels = { distance: "modeDistance", screen: "modeScreen", ratio: "modeFindRatio" };
  els.modeTabs.forEach(tab => {
    tab.textContent = t(modeLabels[tab.dataset.mode]);
  });

  // Filter tags
  const filterLabels = { all: "all", "4K": "4K", "1080p": "1080p", ust: "ust", short: "shortThrow", standard: "standard" };
  els.filterTags.forEach(tag => {
    const key = filterLabels[tag.dataset.filter];
    if (key) tag.textContent = t(key);
  });

  // Slider labels
  if (els.labelDistance) els.labelDistance.textContent = t("distance");
  if (els.labelDiagonal) els.labelDiagonal.textContent = t("screenSize");
  if (els.labelWidth) els.labelWidth.textContent = t("desiredWidth");

  // Room setup labels
  if (els.labelScreenHeight) els.labelScreenHeight.textContent = t("screenHeight");
  if (els.labelCeilingHeight) els.labelCeilingHeight.textContent = t("ceilingHeight");
  if (els.cardTitleRoom) els.cardTitleRoom.textContent = t("roomSetup");

  // Canvas labels
  if (els.sideViewLabel) els.sideViewLabel.textContent = t("sideView");
  if (els.frontViewLabel) els.frontViewLabel.textContent = t("frontView");

  // Ratio labels
  if (els.labelRatioMin) els.labelRatioMin.textContent = t("ratioMin");
  if (els.labelRatioMax) els.labelRatioMax.textContent = t("ratioMax");

  // Manual ratio label
  const manualLabel = document.getElementById("manual-label");
  if (manualLabel) manualLabel.textContent = t("manualRatio");

  // Action buttons
  els.copyBtn.querySelector(".btn-text").textContent = t("copy");
  els.shareBtn.querySelector(".btn-text").textContent = t("share");

  // Unit buttons
  els.unitToggle.forEach(btn => {
    btn.textContent = t(btn.dataset.unit);
  });

  // Document title
  document.title = lang === "fr"
    ? "Projection Tools \u2014 Calculateur de videoprojection"
    : "Projection Tools \u2014 Projector Calculator";
}

function applyTheme() {
  document.documentElement.setAttribute("data-theme", state.theme);
  els.themeToggle.innerHTML = state.theme === "dark"
    ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>'
    : '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
}

// ── Search / Dropdown ──────────────────────────────────
function handleSearch() {
  const query = els.searchInput.value;
  els.searchClear.classList.toggle("visible", query.length > 0);

  // Determine filter
  const filters = {};
  if (state.filter === "4K") filters.resolution = "4K";
  else if (state.filter === "1080p") filters.resolution = "1080p";
  else if (state.filter === "ust") filters.type = "ust";
  else if (state.filter === "short") filters.type = "short";
  else if (state.filter === "standard") filters.type = "standard";

  const results = searchProjectors(query, filters);
  renderDropdown(results);
  els.dropdown.classList.add("open");
}

function renderDropdown(results) {
  const grouped = groupByBrand(results);
  let html = "";
  for (const [brand, items] of Object.entries(grouped)) {
    html += `<div class="dropdown-group-label">${brand}</div>`;
    for (const p of items) {
      const ratioText = p.ratioMin === p.ratioMax
        ? p.ratioMin.toFixed(2)
        : `${p.ratioMin.toFixed(2)}-${p.ratioMax.toFixed(2)}`;
      html += `<div class="dropdown-item" data-id="${p.id}">
        <span class="model-name">${p.model}</span>
        <span class="model-meta">${p.resolution} | ${ratioText}</span>
      </div>`;
    }
  }
  if (results.length === 0) {
    html = `<div class="dropdown-item" style="color:var(--text-dim);cursor:default">${t("noMatch")}</div>`;
  }
  els.dropdown.innerHTML = html;

  // Bind clicks
  els.dropdown.querySelectorAll(".dropdown-item[data-id]").forEach(item => {
    item.addEventListener("click", () => {
      const p = findProjector(item.dataset.id);
      if (p) selectProjector(p, true);
    });
  });
}

function selectProjector(p, recalc = true) {
  state.projectorId = p.id;
  state.useManual = false;
  els.manualToggle.checked = false;
  els.manualInputs.classList.remove("visible");

  els.chipName.textContent = `${p.brand} ${p.model}`;
  const ratioText = p.ratioMin === p.ratioMax
    ? p.ratioMin.toFixed(2)
    : `${p.ratioMin.toFixed(2)} - ${p.ratioMax.toFixed(2)}`;
  els.chipRatio.textContent = ratioText;
  els.selectedProjector.classList.add("visible");
  els.dropdown.classList.remove("open");
  els.searchInput.value = "";
  els.searchClear.classList.remove("visible");

  if (recalc) updateCalculation();
}

// ── Slider Visibility ──────────────────────────────────
function updateSliderVisibility() {
  els.distanceGroup.style.display = (state.mode === "distance" || state.mode === "ratio") ? "block" : "none";
  els.diagonalGroup.style.display = state.mode === "screen" ? "block" : "none";
  els.widthGroup.style.display = state.mode === "ratio" ? "block" : "none";
}

// ── Get current ratios ─────────────────────────────────
function getCurrentRatios() {
  if (state.useManual) {
    return { min: state.manualRatioMin, max: state.manualRatioMax };
  }
  if (state.projectorId) {
    const p = findProjector(state.projectorId);
    if (p) return { min: p.ratioMin, max: p.ratioMax };
  }
  return null;
}

// ── Main calculation & UI update ───────────────────────
function updateCalculation() {
  const ratios = getCurrentRatios();
  let resultsHTML = "";

  if (state.mode === "distance") {
    if (!ratios) {
      resultsHTML = `<div class="result-row"><span class="result-label" style="text-align:center;width:100%">${t("noProjector")}</span></div>`;
      updateVisualization({ distance: state.distance, screenWidthMin: 200, screenWidthMax: 250, screenHeightMin: 112, screenHeightMax: 140, isUST: false, screenHeight: state.screenHeight, ceilingHeight: state.ceilingHeight });
    } else {
      const result = distanceToScreen(state.distance, ratios.min, ratios.max);
      resultsHTML = renderDistanceResults(result);

      const isUST = ratios.min < 0.5;
      updateVisualization({
        distance: state.distance,
        screenWidthMin: result.min.widthCm,
        screenWidthMax: result.max.widthCm,
        screenHeightMin: result.min.heightCm,
        screenHeightMax: result.max.heightCm,
        isUST,
        screenHeight: state.screenHeight,
        ceilingHeight: state.ceilingHeight,
      });
    }
  } else if (state.mode === "screen") {
    if (!ratios) {
      resultsHTML = `<div class="result-row"><span class="result-label" style="text-align:center;width:100%">${t("noProjector")}</span></div>`;
      updateVisualization({ distance: 3, screenWidthMin: 200, screenWidthMax: 250, screenHeightMin: 112, screenHeightMax: 140, isUST: false });
    } else {
      const result = screenToDistance(state.diagonal, ratios.min, ratios.max);
      resultsHTML = renderScreenResults(result);

      const isUST = ratios.min < 0.5;
      updateVisualization({
        distance: (result.distMin + result.distMax) / 2,
        screenWidthMin: result.screen.widthCm,
        screenWidthMax: result.screen.widthCm,
        screenHeightMin: result.screen.heightCm,
        screenHeightMax: result.screen.heightCm,
        isUST,
        screenHeight: state.screenHeight,
        ceilingHeight: state.ceilingHeight,
      });
    }
  } else if (state.mode === "ratio") {
    const result = findRatio(state.distance, state.width);
    const matching = findMatchingProjectors(result.ratio, projectors);
    resultsHTML = renderRatioResults(result, matching);

    updateVisualization({
      distance: state.distance,
      screenWidthMin: result.screen.widthCm,
      screenWidthMax: result.screen.widthCm,
      screenHeightMin: result.screen.heightCm,
      screenHeightMax: result.screen.heightCm,
      isUST: result.ratio < 0.5,
      screenHeight: state.screenHeight,
      ceilingHeight: state.ceilingHeight,
    });
  }

  els.resultsContainer.innerHTML = resultsHTML;

  // Push state to URL
  pushState(state);
}

function renderDistanceResults(result) {
  const u = state.units;
  const s = result.hasZoom ? result.min : result.max;
  const sMax = result.max;

  let html = "";

  if (result.hasZoom) {
    // Show range
    html += renderResultRow(t("diagonal"),
      u === "metric"
        ? `${s.diagonalCm} - ${sMax.diagonalCm} cm`
        : `${s.diagonalIn} - ${sMax.diagonalIn} in`,
      true
    );
    html += `<hr class="result-divider">`;
    html += renderResultRow(t("width"),
      u === "metric"
        ? `${s.widthCm} - ${sMax.widthCm} cm`
        : `${s.widthIn} - ${sMax.widthIn} in`
    );
    html += renderResultRow(t("height"),
      u === "metric"
        ? `${s.heightCm} - ${sMax.heightCm} cm`
        : `${s.heightIn} - ${sMax.heightIn} in`
    );
    html += `<div class="result-equivalent">${t("equivalentRange", { min: s.closestStandard, max: sMax.closestStandard })}</div>`;
  } else {
    html += renderResultRow(t("diagonal"),
      u === "metric" ? `${sMax.diagonalCm} cm` : `${sMax.diagonalIn} in`,
      true
    );
    html += `<hr class="result-divider">`;
    html += renderResultRow(t("width"),
      u === "metric" ? `${sMax.widthCm} cm` : `${sMax.widthIn} in`
    );
    html += renderResultRow(t("height"),
      u === "metric" ? `${sMax.heightCm} cm` : `${sMax.heightIn} in`
    );
    html += `<div class="result-equivalent">${t("equivalent", { size: sMax.closestStandard })}</div>`;
  }

  return html;
}

function renderScreenResults(result) {
  const u = state.units;
  const s = result.screen;

  let html = "";

  if (result.hasZoom) {
    const distMinStr = u === "metric"
      ? `${result.distMin.toFixed(2)} m`
      : `${(result.distMin * 3.281).toFixed(1)} ft`;
    const distMaxStr = u === "metric"
      ? `${result.distMax.toFixed(2)} m`
      : `${(result.distMax * 3.281).toFixed(1)} ft`;

    html += renderResultRow(t("requiredDistance"), `${distMinStr} ${t("to")} ${distMaxStr}`, true);
  } else {
    const distStr = u === "metric"
      ? `${result.distMin.toFixed(2)} m`
      : `${(result.distMin * 3.281).toFixed(1)} ft`;
    html += renderResultRow(t("requiredDistance"), distStr, true);
  }

  html += `<hr class="result-divider">`;
  html += renderResultRow(t("width"),
    u === "metric" ? `${s.widthCm} cm` : `${s.widthIn} in`
  );
  html += renderResultRow(t("height"),
    u === "metric" ? `${s.heightCm} cm` : `${s.heightIn} in`
  );
  html += `<div class="result-equivalent">${t("equivalent", { size: s.closestStandard })}</div>`;

  return html;
}

function renderRatioResults(result, matching) {
  let html = "";
  html += renderResultRow(t("requiredRatio"), result.ratio.toFixed(2), true);
  html += `<hr class="result-divider">`;

  const u = state.units;
  const s = result.screen;
  html += renderResultRow(t("width"),
    u === "metric" ? `${s.widthCm} cm` : `${s.widthIn} in`
  );
  html += renderResultRow(t("height"),
    u === "metric" ? `${s.heightCm} cm` : `${s.heightIn} in`
  );
  html += renderResultRow(t("diagonal"),
    u === "metric" ? `${s.diagonalCm} cm` : `${s.diagonalIn} in`
  );
  html += `<div class="result-equivalent">${t("equivalent", { size: s.closestStandard })}</div>`;

  // Matching projectors
  html += `<hr class="result-divider">`;
  html += `<div class="card-title" style="margin-top:0.5rem">${t("matchingProjectors")}</div>`;
  if (matching.length === 0) {
    html += `<div style="font-size:0.82rem;color:var(--text-dim)">${t("noMatch")}</div>`;
  } else {
    html += `<div class="matching-list">`;
    for (const p of matching) {
      const ratioText = p.ratioMin === p.ratioMax
        ? p.ratioMin.toFixed(2)
        : `${p.ratioMin.toFixed(2)} - ${p.ratioMax.toFixed(2)}`;
      html += `<div class="matching-item">
        <span class="match-name">${p.brand} ${p.model}</span>
        <span class="match-ratio">${ratioText}</span>
      </div>`;
    }
    html += `</div>`;
  }

  return html;
}

function renderResultRow(label, value, accent = false) {
  return `<div class="result-row">
    <span class="result-label">${label}</span>
    <span class="result-value${accent ? " accent" : ""}">${value}</span>
  </div>`;
}

// ── Copy results to clipboard ──────────────────────────
function copyResults() {
  const rows = els.resultsContainer.querySelectorAll(".result-row");
  let text = "";
  rows.forEach(row => {
    const label = row.querySelector(".result-label")?.textContent || "";
    const value = row.querySelector(".result-value")?.textContent || "";
    text += `${label}: ${value}\n`;
  });
  const equiv = els.resultsContainer.querySelector(".result-equivalent");
  if (equiv) text += `\n${equiv.textContent}\n`;

  navigator.clipboard.writeText(text.trim()).then(() => {
    showToast(t("copied"));
  }).catch(() => {
    showToast(t("copied"));
  });
}

// ── Toast notification ─────────────────────────────────
function showToast(message) {
  els.toast.textContent = message;
  els.toast.classList.add("show");
  setTimeout(() => els.toast.classList.remove("show"), 2000);
}

// URL hash state management
// Encodes/decodes app state to/from URL hash for sharing

/**
 * Encode state object into URL hash string
 */
export function encodeState(state) {
  const params = new URLSearchParams();
  if (state.projectorId) params.set("p", state.projectorId);
  if (state.mode) params.set("mode", state.mode);
  if (state.distance != null) params.set("d", String(state.distance));
  if (state.diagonal != null) params.set("diag", String(state.diagonal));
  if (state.width != null) params.set("w", String(state.width));
  if (state.manualRatioMin != null) params.set("rmin", String(state.manualRatioMin));
  if (state.manualRatioMax != null) params.set("rmax", String(state.manualRatioMax));
  if (state.useManual) params.set("manual", "1");
  if (state.units) params.set("units", state.units);
  return params.toString();
}

/**
 * Decode URL hash string into state object
 */
export function decodeState(hash) {
  const str = hash.startsWith("#") ? hash.slice(1) : hash;
  if (!str) return null;

  const params = new URLSearchParams(str);
  const state = {};

  if (params.has("p")) state.projectorId = params.get("p");
  if (params.has("mode")) state.mode = params.get("mode");
  if (params.has("d")) state.distance = parseFloat(params.get("d"));
  if (params.has("diag")) state.diagonal = parseFloat(params.get("diag"));
  if (params.has("w")) state.width = parseFloat(params.get("w"));
  if (params.has("rmin")) state.manualRatioMin = parseFloat(params.get("rmin"));
  if (params.has("rmax")) state.manualRatioMax = parseFloat(params.get("rmax"));
  if (params.has("manual")) state.useManual = params.get("manual") === "1";
  if (params.has("units")) state.units = params.get("units");

  return state;
}

/**
 * Push state to URL hash without triggering hashchange
 */
export function pushState(state) {
  const hash = encodeState(state);
  if (hash) {
    history.replaceState(null, "", "#" + hash);
  }
}

/**
 * Get current state from URL
 */
export function getStateFromURL() {
  return decodeState(window.location.hash);
}

/**
 * Copy current URL to clipboard and return success
 */
export async function shareURL() {
  try {
    await navigator.clipboard.writeText(window.location.href);
    return true;
  } catch {
    // Fallback
    const input = document.createElement("input");
    input.value = window.location.href;
    document.body.appendChild(input);
    input.select();
    document.execCommand("copy");
    document.body.removeChild(input);
    return true;
  }
}

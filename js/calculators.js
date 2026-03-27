// Core projection calculation formulas
// All distances in meters, screen sizes in centimeters

const ASPECT_RATIO = 16 / 9;
const CM_PER_INCH = 2.54;

/**
 * Mode A: Distance -> Screen Size
 * Given a distance and throw ratio, calculate screen dimensions
 */
export function distanceToScreen(distanceM, ratioMin, ratioMax) {
  // Width = Distance / Ratio
  // Higher ratio = smaller screen at same distance
  // ratioMin gives largest screen, ratioMax gives smallest
  const widthMaxCm = (distanceM / ratioMin) * 100;
  const widthMinCm = (distanceM / ratioMax) * 100;

  return {
    min: computeDimensions(widthMinCm),
    max: computeDimensions(widthMaxCm),
    hasZoom: Math.abs(ratioMin - ratioMax) > 0.001,
  };
}

/**
 * Mode B: Screen Size -> Distance
 * Given desired diagonal in inches and throw ratio, calculate distance
 */
export function screenToDistance(diagonalInches, ratioMin, ratioMax) {
  const diagonalCm = diagonalInches * CM_PER_INCH;
  const widthCm = diagonalCm * Math.cos(Math.atan(9 / 16));

  const distMinM = (widthCm * ratioMin) / 100;
  const distMaxM = (widthCm * ratioMax) / 100;

  return {
    distMin: distMinM,
    distMax: distMaxM,
    hasZoom: Math.abs(ratioMin - ratioMax) > 0.001,
    screen: computeDimensions(widthCm),
  };
}

/**
 * Mode C: Find Ratio
 * Given distance and desired width, find required ratio
 */
export function findRatio(distanceM, widthCm) {
  const ratio = (distanceM * 100) / widthCm;
  return {
    ratio: Math.round(ratio * 100) / 100,
    screen: computeDimensions(widthCm),
  };
}

/**
 * Compute full screen dimensions from width in cm
 */
function computeDimensions(widthCm) {
  const heightCm = widthCm / ASPECT_RATIO;
  const diagonalCm = Math.sqrt(widthCm * widthCm + heightCm * heightCm);
  const diagonalInches = diagonalCm / CM_PER_INCH;

  return {
    widthCm: Math.round(widthCm * 10) / 10,
    heightCm: Math.round(heightCm * 10) / 10,
    diagonalCm: Math.round(diagonalCm * 10) / 10,
    widthIn: Math.round((widthCm / CM_PER_INCH) * 10) / 10,
    heightIn: Math.round((heightCm / CM_PER_INCH) * 10) / 10,
    diagonalIn: Math.round(diagonalInches * 10) / 10,
    closestStandard: findClosestStandard(diagonalInches),
  };
}

/**
 * Find the closest standard screen size in inches
 */
const STANDARD_SIZES = [60, 72, 80, 84, 92, 100, 106, 110, 120, 130, 133, 135, 140, 150, 160, 170, 180, 190, 200];

function findClosestStandard(diagonalInches) {
  let closest = STANDARD_SIZES[0];
  let minDiff = Math.abs(diagonalInches - closest);
  for (const size of STANDARD_SIZES) {
    const diff = Math.abs(diagonalInches - size);
    if (diff < minDiff) {
      minDiff = diff;
      closest = size;
    }
  }
  return closest;
}

/**
 * Find projectors matching a given ratio (within tolerance)
 */
export function findMatchingProjectors(ratio, projectorList, tolerance = 0.15) {
  return projectorList.filter(p => {
    return ratio >= (p.ratioMin - tolerance) && ratio <= (p.ratioMax + tolerance);
  });
}

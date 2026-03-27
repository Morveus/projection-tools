// Canvas-based room visualization
// Renders side view and front view of projection setup

const PERSON_HEIGHT_M = 1.70;

// Animation state
let currentAnim = {
  distance: 3.0,
  screenWidthMin: 200,
  screenWidthMax: 250,
  screenHeightMin: 112,
  screenHeightMax: 140,
  isUST: false,
};
let targetAnim = { ...currentAnim };
let animFrame = null;

/**
 * Lerp helper
 */
function lerp(a, b, t) {
  return a + (b - a) * t;
}

/**
 * Initialize canvases
 */
export function initCanvases(sideCanvasEl, frontCanvasEl) {
  resizeCanvas(sideCanvasEl);
  resizeCanvas(frontCanvasEl);

  // Handle resize
  const ro = new ResizeObserver(() => {
    resizeCanvas(sideCanvasEl);
    resizeCanvas(frontCanvasEl);
    drawSideView(sideCanvasEl, currentAnim);
    drawFrontView(frontCanvasEl, currentAnim);
  });
  ro.observe(sideCanvasEl.parentElement);

  startAnimationLoop(sideCanvasEl, frontCanvasEl);
}

function resizeCanvas(canvas) {
  const rect = canvas.parentElement.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  canvas.width = rect.width * dpr;
  canvas.height = canvas.dataset.type === "side" ? rect.width * 0.45 * dpr : rect.width * 0.55 * dpr;
  canvas.style.width = rect.width + "px";
  canvas.style.height = (canvas.dataset.type === "side" ? rect.width * 0.45 : rect.width * 0.55) + "px";
}

/**
 * Update visualization parameters
 */
export function updateVisualization(params) {
  targetAnim = {
    distance: params.distance || 3.0,
    screenWidthMin: params.screenWidthMin || 200,
    screenWidthMax: params.screenWidthMax || 250,
    screenHeightMin: params.screenHeightMin || 112,
    screenHeightMax: params.screenHeightMax || 140,
    isUST: params.isUST || false,
  };
}

/**
 * Animation loop with lerp smoothing
 */
function startAnimationLoop(sideCanvas, frontCanvas) {
  function tick() {
    const t = 0.12;
    let changed = false;
    for (const key of Object.keys(targetAnim)) {
      if (typeof targetAnim[key] === "number") {
        const before = currentAnim[key];
        currentAnim[key] = lerp(currentAnim[key], targetAnim[key], t);
        if (Math.abs(currentAnim[key] - before) > 0.01) changed = true;
      } else {
        if (currentAnim[key] !== targetAnim[key]) changed = true;
        currentAnim[key] = targetAnim[key];
      }
    }

    drawSideView(sideCanvas, currentAnim);
    drawFrontView(frontCanvas, currentAnim);
    animFrame = requestAnimationFrame(tick);
  }
  tick();
}

/**
 * Get CSS custom property value
 */
function getCSSColor(name, fallback) {
  const val = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return val || fallback;
}

/**
 * Draw a realistic standing person silhouette (3/4 view)
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} x - horizontal center of feet (canvas px)
 * @param {number} y - ground line (canvas px, y increases downward)
 * @param {number} h - total height in canvas px
 * @param {string} color - fill color
 */
function drawPersonSilhouette(ctx, x, y, h, color) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.globalAlpha = 0.55;

  // All coordinates are fractions of total height, origin at feet center.
  // We define points as [fractionX * h, fractionY * h] where Y=0 is feet, Y=1 is top of head.
  // The figure faces slightly right (3/4 view).

  const s = h; // scale factor

  ctx.beginPath();

  // Start at the top of the head and trace clockwise.
  // Head: oval, top-center roughly at (0.01, 1.0), head height ~1/7.5 of body
  const headH = 1 / 7.5;
  const headW = 0.075;
  const headCx = 0.01;
  const headCy = 1.0 - headH / 2;

  // Top of head
  const topX = x + headCx * s;
  const topY = y - 1.0 * s;

  // We trace the full outline as one closed path.
  // Start at top of head, go right (clockwise)

  ctx.moveTo(x + (headCx - 0.01) * s, y - 0.995 * s);

  // Right side of head
  ctx.bezierCurveTo(
    x + (headCx + headW * 0.7) * s, y - 1.0 * s,
    x + (headCx + headW) * s,       y - (1.0 - headH * 0.3) * s,
    x + (headCx + headW) * s,       y - headCy * s
  );
  // Lower right head into jaw
  ctx.bezierCurveTo(
    x + (headCx + headW) * s,       y - (headCy - headH * 0.35) * s,
    x + (headCx + headW * 0.6) * s, y - (1.0 - headH - 0.005) * s,
    x + (headCx + 0.02) * s,        y - (1.0 - headH - 0.01) * s
  );

  // Neck right side
  ctx.lineTo(x + 0.035 * s, y - 0.82 * s);

  // Right shoulder
  ctx.bezierCurveTo(
    x + 0.08 * s,  y - 0.815 * s,
    x + 0.14 * s,  y - 0.80 * s,
    x + 0.17 * s,  y - 0.78 * s
  );

  // Right upper arm (slightly away from body)
  ctx.bezierCurveTo(
    x + 0.19 * s,  y - 0.77 * s,
    x + 0.195 * s, y - 0.72 * s,
    x + 0.185 * s, y - 0.66 * s
  );

  // Right elbow area
  ctx.bezierCurveTo(
    x + 0.18 * s,  y - 0.62 * s,
    x + 0.165 * s, y - 0.58 * s,
    x + 0.145 * s, y - 0.53 * s
  );

  // Right forearm / hand
  ctx.bezierCurveTo(
    x + 0.13 * s,  y - 0.49 * s,
    x + 0.115 * s, y - 0.455 * s,
    x + 0.10 * s,  y - 0.44 * s
  );

  // Hand (small bump)
  ctx.bezierCurveTo(
    x + 0.095 * s, y - 0.425 * s,
    x + 0.10 * s,  y - 0.41 * s,
    x + 0.09 * s,  y - 0.40 * s
  );

  // Rejoin torso right side at hip
  ctx.bezierCurveTo(
    x + 0.085 * s, y - 0.41 * s,
    x + 0.09 * s,  y - 0.43 * s,
    x + 0.095 * s, y - 0.46 * s
  );
  ctx.bezierCurveTo(
    x + 0.10 * s,  y - 0.42 * s,
    x + 0.105 * s, y - 0.38 * s,
    x + 0.10 * s,  y - 0.35 * s
  );

  // Right hip
  ctx.bezierCurveTo(
    x + 0.10 * s,  y - 0.32 * s,
    x + 0.10 * s,  y - 0.30 * s,
    x + 0.095 * s, y - 0.28 * s
  );

  // Right leg (front leg, slightly forward)
  ctx.bezierCurveTo(
    x + 0.095 * s, y - 0.24 * s,
    x + 0.10 * s,  y - 0.18 * s,
    x + 0.10 * s,  y - 0.12 * s
  );

  // Right knee to ankle
  ctx.bezierCurveTo(
    x + 0.10 * s,  y - 0.08 * s,
    x + 0.095 * s, y - 0.04 * s,
    x + 0.09 * s,  y - 0.02 * s
  );

  // Right foot
  ctx.bezierCurveTo(
    x + 0.09 * s,  y - 0.008 * s,
    x + 0.12 * s,  y - 0.001 * s,
    x + 0.12 * s,  y - 0.0 * s
  );
  ctx.lineTo(x + 0.04 * s, y);

  // Inner right leg going up
  ctx.bezierCurveTo(
    x + 0.04 * s,  y - 0.01 * s,
    x + 0.045 * s, y - 0.08 * s,
    x + 0.05 * s,  y - 0.15 * s
  );
  ctx.bezierCurveTo(
    x + 0.055 * s, y - 0.20 * s,
    x + 0.05 * s,  y - 0.24 * s,
    x + 0.03 * s,  y - 0.27 * s
  );

  // Crotch
  ctx.lineTo(x - 0.02 * s, y - 0.27 * s);

  // Left leg (back leg, slightly behind)
  ctx.bezierCurveTo(
    x - 0.04 * s,  y - 0.24 * s,
    x - 0.055 * s, y - 0.18 * s,
    x - 0.06 * s,  y - 0.12 * s
  );

  // Left knee to ankle
  ctx.bezierCurveTo(
    x - 0.06 * s,  y - 0.08 * s,
    x - 0.055 * s, y - 0.04 * s,
    x - 0.05 * s,  y - 0.02 * s
  );

  // Left foot
  ctx.bezierCurveTo(
    x - 0.05 * s,  y - 0.008 * s,
    x - 0.02 * s,  y - 0.001 * s,
    x - 0.02 * s,  y - 0.0 * s
  );
  ctx.lineTo(x - 0.09 * s, y);

  // Inner left leg going back up
  ctx.bezierCurveTo(
    x - 0.09 * s,  y - 0.01 * s,
    x - 0.095 * s, y - 0.06 * s,
    x - 0.10 * s,  y - 0.12 * s
  );
  ctx.bezierCurveTo(
    x - 0.105 * s, y - 0.18 * s,
    x - 0.10 * s,  y - 0.24 * s,
    x - 0.095 * s, y - 0.28 * s
  );

  // Left hip
  ctx.bezierCurveTo(
    x - 0.095 * s, y - 0.32 * s,
    x - 0.10 * s,  y - 0.36 * s,
    x - 0.095 * s, y - 0.40 * s
  );

  // Left side torso going up
  ctx.bezierCurveTo(
    x - 0.09 * s,  y - 0.48 * s,
    x - 0.09 * s,  y - 0.55 * s,
    x - 0.095 * s, y - 0.60 * s
  );

  // Left arm (close to body, relaxed)
  ctx.bezierCurveTo(
    x - 0.10 * s,  y - 0.58 * s,
    x - 0.115 * s, y - 0.54 * s,
    x - 0.12 * s,  y - 0.50 * s
  );

  // Left hand
  ctx.bezierCurveTo(
    x - 0.125 * s, y - 0.47 * s,
    x - 0.13 * s,  y - 0.445 * s,
    x - 0.125 * s, y - 0.43 * s
  );

  // Left arm back up
  ctx.bezierCurveTo(
    x - 0.12 * s,  y - 0.44 * s,
    x - 0.115 * s, y - 0.47 * s,
    x - 0.11 * s,  y - 0.50 * s
  );
  ctx.bezierCurveTo(
    x - 0.105 * s, y - 0.56 * s,
    x - 0.11 * s,  y - 0.62 * s,
    x - 0.12 * s,  y - 0.66 * s
  );

  // Left upper arm to shoulder
  ctx.bezierCurveTo(
    x - 0.13 * s,  y - 0.70 * s,
    x - 0.14 * s,  y - 0.74 * s,
    x - 0.15 * s,  y - 0.77 * s
  );

  // Left shoulder
  ctx.bezierCurveTo(
    x - 0.14 * s,  y - 0.79 * s,
    x - 0.10 * s,  y - 0.81 * s,
    x - 0.05 * s,  y - 0.82 * s
  );

  // Neck left side
  ctx.lineTo(x - 0.03 * s, y - 0.82 * s);

  // Left side of head
  ctx.bezierCurveTo(
    x + (headCx - 0.04) * s,        y - (1.0 - headH - 0.01) * s,
    x + (headCx - headW * 0.8) * s, y - (headCy - headH * 0.35) * s,
    x + (headCx - headW * 0.8) * s, y - headCy * s
  );
  // Upper left head back to top
  ctx.bezierCurveTo(
    x + (headCx - headW * 0.8) * s, y - (1.0 - headH * 0.3) * s,
    x + (headCx - headW * 0.5) * s, y - 1.0 * s,
    x + (headCx - 0.01) * s,        y - 0.995 * s
  );

  ctx.closePath();
  ctx.fill();

  ctx.restore();
}

/**
 * Draw side view (room cross-section)
 */
function drawSideView(canvas, state) {
  const ctx = canvas.getContext("2d");
  const W = canvas.width;
  const H = canvas.height;
  const dpr = window.devicePixelRatio || 1;

  ctx.clearRect(0, 0, W, H);

  const accent = getCSSColor("--accent", "#6366f1");
  const textColor = getCSSColor("--text", "#e2e8f0");
  const mutedColor = getCSSColor("--text-muted", "#94a3b8");
  const cardBg = getCSSColor("--card-bg", "#14141f");
  const borderColor = getCSSColor("--border", "#1e1e2e");

  // Room dimensions in "room meters"
  const roomDepth = Math.max(state.distance + 1.5, 5);
  const roomHeight = 3.0; // 3m ceiling

  // Margins
  const mx = 50 * dpr;
  const my = 30 * dpr;
  const drawW = W - mx * 2;
  const drawH = H - my * 2;

  // Scale: pixels per meter
  const scaleX = drawW / roomDepth;
  const scaleY = drawH / roomHeight;

  function toX(m) { return mx + m * scaleX; }
  function toY(m) { return my + (roomHeight - m) * scaleY; }

  // Draw room outline
  ctx.strokeStyle = borderColor;
  ctx.lineWidth = 2 * dpr;
  ctx.beginPath();
  // Floor
  ctx.moveTo(toX(0), toY(0));
  ctx.lineTo(toX(roomDepth), toY(0));
  // Back wall
  ctx.lineTo(toX(roomDepth), toY(roomHeight));
  // Ceiling
  ctx.lineTo(toX(0), toY(roomHeight));
  // Front wall
  ctx.lineTo(toX(0), toY(0));
  ctx.stroke();

  // Fill floor
  ctx.fillStyle = cardBg;
  ctx.fillRect(toX(0), toY(0.05), drawW, 5 * dpr);

  // Screen on the far wall (right side)
  const avgScreenH = (state.screenHeightMin + state.screenHeightMax) / 2 / 100; // in meters
  const screenBottom = 0.6; // 60cm from floor
  const screenTop = screenBottom + avgScreenH;

  // Screen rectangle
  ctx.fillStyle = accent;
  ctx.globalAlpha = 0.6;
  ctx.fillRect(toX(roomDepth) - 4 * dpr, toY(screenTop), 8 * dpr, (screenTop - screenBottom) * scaleY);
  ctx.globalAlpha = 1;
  ctx.strokeStyle = accent;
  ctx.lineWidth = 2 * dpr;
  ctx.strokeRect(toX(roomDepth) - 4 * dpr, toY(screenTop), 8 * dpr, (screenTop - screenBottom) * scaleY);

  // Projector position
  const projDist = state.distance;
  const projX = roomDepth - projDist;
  const projY = state.isUST ? 0.5 : 2.2; // UST on furniture, standard ceiling-mounted

  // Projector icon
  ctx.fillStyle = textColor;
  const projW = (state.isUST ? 24 : 20) * dpr;
  const projH = (state.isUST ? 10 : 14) * dpr;
  const px = toX(projX);
  const py = toY(projY);

  ctx.fillStyle = mutedColor;
  ctx.fillRect(px - projW / 2, py - projH / 2, projW, projH);
  ctx.strokeStyle = textColor;
  ctx.lineWidth = 1.5 * dpr;
  ctx.strokeRect(px - projW / 2, py - projH / 2, projW, projH);

  // Lens dot
  ctx.beginPath();
  ctx.arc(px + (state.isUST ? 0 : projW / 2 - 3 * dpr), py, 3 * dpr, 0, Math.PI * 2);
  ctx.fillStyle = accent;
  ctx.fill();

  // Projection cone
  ctx.strokeStyle = accent;
  ctx.globalAlpha = 0.4;
  ctx.lineWidth = 1.5 * dpr;
  ctx.setLineDash([6 * dpr, 4 * dpr]);
  ctx.beginPath();
  if (state.isUST) {
    ctx.moveTo(px, py - projH / 2);
    ctx.lineTo(toX(roomDepth), toY(screenTop));
    ctx.moveTo(px, py - projH / 2);
    ctx.lineTo(toX(roomDepth), toY(screenBottom));
  } else {
    ctx.moveTo(px + projW / 2, py);
    ctx.lineTo(toX(roomDepth), toY(screenTop));
    ctx.moveTo(px + projW / 2, py);
    ctx.lineTo(toX(roomDepth), toY(screenBottom));
  }
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.globalAlpha = 1;

  // Distance label
  const labelY = toY(0) + 22 * dpr;
  ctx.strokeStyle = mutedColor;
  ctx.lineWidth = 1 * dpr;
  ctx.setLineDash([3 * dpr, 3 * dpr]);
  ctx.beginPath();
  ctx.moveTo(px, labelY - 8 * dpr);
  ctx.lineTo(toX(roomDepth), labelY - 8 * dpr);
  ctx.stroke();
  ctx.setLineDash([]);

  // Arrows
  const arrowSize = 5 * dpr;
  ctx.fillStyle = mutedColor;
  // Left arrow
  ctx.beginPath();
  ctx.moveTo(px, labelY - 8 * dpr);
  ctx.lineTo(px + arrowSize, labelY - 8 * dpr - arrowSize);
  ctx.lineTo(px + arrowSize, labelY - 8 * dpr + arrowSize);
  ctx.fill();
  // Right arrow
  ctx.beginPath();
  ctx.moveTo(toX(roomDepth), labelY - 8 * dpr);
  ctx.lineTo(toX(roomDepth) - arrowSize, labelY - 8 * dpr - arrowSize);
  ctx.lineTo(toX(roomDepth) - arrowSize, labelY - 8 * dpr + arrowSize);
  ctx.fill();

  ctx.fillStyle = textColor;
  ctx.font = `bold ${13 * dpr}px ui-monospace, monospace`;
  ctx.textAlign = "center";
  ctx.fillText(`${state.distance.toFixed(2)} m`, (px + toX(roomDepth)) / 2, labelY + 6 * dpr);

  // Labels
  ctx.font = `${11 * dpr}px system-ui, sans-serif`;
  ctx.fillStyle = mutedColor;
  ctx.textAlign = "center";
  ctx.fillText(state.isUST ? "UST" : "Projecteur", px, py + projH / 2 + 16 * dpr);
  ctx.fillText("Ecran", toX(roomDepth) + 1, toY((screenTop + screenBottom) / 2) + 4 * dpr);
}

/**
 * Draw front view (wall face-on with projected image)
 */
function drawFrontView(canvas, state) {
  const ctx = canvas.getContext("2d");
  const W = canvas.width;
  const H = canvas.height;
  const dpr = window.devicePixelRatio || 1;

  ctx.clearRect(0, 0, W, H);

  const accent = getCSSColor("--accent", "#6366f1");
  const textColor = getCSSColor("--text", "#e2e8f0");
  const mutedColor = getCSSColor("--text-muted", "#94a3b8");
  const borderColor = getCSSColor("--border", "#1e1e2e");

  // Wall dimensions
  const wallWidth = 5.0; // 5m
  const wallHeight = 3.0; // 3m

  const mx = 40 * dpr;
  const my = 25 * dpr;
  const drawW = W - mx * 2;
  const drawH = H - my * 2;

  const scaleX = drawW / wallWidth;
  const scaleY = drawH / wallHeight;
  const scale = Math.min(scaleX, scaleY);

  const offsetX = mx + (drawW - wallWidth * scale) / 2;
  const offsetY = my;

  function toX(m) { return offsetX + m * scale; }
  function toY(m) { return offsetY + (wallHeight - m) * scale; }

  // Wall
  ctx.strokeStyle = borderColor;
  ctx.lineWidth = 2 * dpr;
  ctx.strokeRect(toX(0), toY(wallHeight), wallWidth * scale, wallHeight * scale);

  // Floor line
  ctx.strokeStyle = borderColor;
  ctx.lineWidth = 1 * dpr;
  ctx.beginPath();
  ctx.moveTo(toX(0), toY(0));
  ctx.lineTo(toX(wallWidth), toY(0));
  ctx.stroke();

  // Center of wall
  const cx = wallWidth / 2;
  const screenBottom = 0.6;

  // Max projection (if zoom)
  const hasZoom = Math.abs(state.screenWidthMax - state.screenWidthMin) > 1;
  const maxW = state.screenWidthMax / 100;
  const maxH = state.screenHeightMax / 100;
  const minW = state.screenWidthMin / 100;
  const minH = state.screenHeightMin / 100;

  // Draw max rect (dashed) if zoom
  if (hasZoom) {
    ctx.strokeStyle = accent;
    ctx.globalAlpha = 0.3;
    ctx.lineWidth = 2 * dpr;
    ctx.setLineDash([8 * dpr, 5 * dpr]);
    ctx.strokeRect(
      toX(cx - maxW / 2), toY(screenBottom + maxH),
      maxW * scale, maxH * scale
    );
    ctx.setLineDash([]);
    ctx.globalAlpha = 1;

    // Label "Max"
    ctx.font = `${10 * dpr}px system-ui, sans-serif`;
    ctx.fillStyle = mutedColor;
    ctx.textAlign = "left";
    ctx.fillText("Max", toX(cx + maxW / 2) + 6 * dpr, toY(screenBottom + maxH) + 14 * dpr);
  }

  // Draw main/min projection rectangle
  const drawMainW = hasZoom ? minW : maxW;
  const drawMainH = hasZoom ? minH : maxH;
  const drawScreenW = hasZoom ? state.screenWidthMin : state.screenWidthMax;
  const drawScreenH = hasZoom ? state.screenHeightMin : state.screenHeightMax;

  // Filled rect
  ctx.fillStyle = accent;
  ctx.globalAlpha = 0.15;
  ctx.fillRect(
    toX(cx - drawMainW / 2), toY(screenBottom + drawMainH),
    drawMainW * scale, drawMainH * scale
  );
  ctx.globalAlpha = 1;

  // Border
  ctx.strokeStyle = accent;
  ctx.lineWidth = 2.5 * dpr;
  ctx.strokeRect(
    toX(cx - drawMainW / 2), toY(screenBottom + drawMainH),
    drawMainW * scale, drawMainH * scale
  );

  if (hasZoom) {
    ctx.font = `${10 * dpr}px system-ui, sans-serif`;
    ctx.fillStyle = mutedColor;
    ctx.textAlign = "left";
    ctx.fillText("Min", toX(cx + drawMainW / 2) + 6 * dpr, toY(screenBottom + drawMainH) + 14 * dpr);
  }

  // Width label (below screen)
  ctx.font = `bold ${12 * dpr}px ui-monospace, monospace`;
  ctx.fillStyle = textColor;
  ctx.textAlign = "center";
  const widthLabel = hasZoom
    ? `${state.screenWidthMin.toFixed(0)} - ${state.screenWidthMax.toFixed(0)} cm`
    : `${state.screenWidthMax.toFixed(0)} cm`;
  const widthLabelY = toY(screenBottom) + 18 * dpr;
  ctx.fillText(widthLabel, toX(cx), widthLabelY);

  // Height label (right of screen)
  ctx.save();
  ctx.translate(toX(cx + drawMainW / 2) + 22 * dpr, toY(screenBottom + drawMainH / 2));
  ctx.rotate(-Math.PI / 2);
  ctx.textAlign = "center";
  const heightLabel = hasZoom
    ? `${state.screenHeightMin.toFixed(0)} - ${state.screenHeightMax.toFixed(0)} cm`
    : `${state.screenHeightMax.toFixed(0)} cm`;
  ctx.fillText(heightLabel, 0, 0);
  ctx.restore();

  // Person silhouette for scale
  const personX = cx - drawMainW / 2 - 0.4;
  const personH = PERSON_HEIGHT_M;

  drawPersonSilhouette(ctx, toX(personX), toY(0), personH * scale, mutedColor);


  // Person height label
  ctx.font = `${10 * dpr}px system-ui, sans-serif`;
  ctx.fillStyle = mutedColor;
  ctx.textAlign = "center";
  ctx.fillText("1.70 m", toX(personX), toY(personH) - 10 * dpr);
}

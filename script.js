function createSeededRandom(seed = 1) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return function () {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

/**
 * Converts a 6-digit hex color string into an rgba(...) string
 */
function rgbaStr(hex, alpha = 1) {
  const clean = hex.replace('#', '');
  const num = parseInt(clean, 16);
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/**
 * Artisanal luxury florist hydrangea (hoa cẩm tú cầu) color palettes:
 * - Xanh dương (Hydrangea Blue)
 * - Xanh ngọc (Teal / Turquoise Jade)
 * - Trắng (Pure White / Pearl Alabaster)
 * - Hồng pastel (Pastel Pink / Soft Blush)
 */
const HYDRANGEA_PALETTES = {
  skyBlue: {
    name: 'Xanh dương',
    deepCore: '#1B3F73',
    innerShadow: '#3568A8',
    midBelly: '#689DE0',
    outerBlush: '#B2D2F7',
    lipHighlight: '#EDF5FF',
    stamen: '#DCEBFC',
    creviceShadow: 'rgba(20, 45, 80, 0.28)',
    glow: 'rgba(104, 157, 224, 0.38)'
  },
  tealJade: {
    name: 'Xanh ngọc',
    deepCore: '#13534E',
    innerShadow: '#227E77',
    midBelly: '#4EBAAF',
    outerBlush: '#9FE2D9',
    lipHighlight: '#EDFAF8',
    stamen: '#D8F5F0',
    creviceShadow: 'rgba(15, 65, 60, 0.26)',
    glow: 'rgba(78, 186, 175, 0.38)'
  },
  pureWhite: {
    name: 'Trắng',
    deepCore: '#5B7268',
    innerShadow: '#8CA598',
    midBelly: '#D4E0D9',
    outerBlush: '#F0F6F2',
    lipHighlight: '#FFFFFF',
    stamen: '#E2EBE5',
    creviceShadow: 'rgba(45, 60, 52, 0.20)',
    glow: 'rgba(235, 245, 240, 0.45)'
  },
  pastelPink: {
    name: 'Hồng pastel',
    deepCore: '#A83B5E',
    innerShadow: '#CF5C82',
    midBelly: '#F392B0',
    outerBlush: '#FCD8E4',
    lipHighlight: '#FFF5F8',
    stamen: '#FDE4ED',
    creviceShadow: 'rgba(110, 30, 55, 0.25)',
    glow: 'rgba(243, 146, 176, 0.38)'
  }
};

// Aliases for compatibility
HYDRANGEA_PALETTES.sweetBlush = HYDRANGEA_PALETTES.pastelPink;
HYDRANGEA_PALETTES.creamPeach = HYDRANGEA_PALETTES.pureWhite;
HYDRANGEA_PALETTES.pearlVintage = HYDRANGEA_PALETTES.tealJade;
HYDRANGEA_PALETTES.berryRomance = HYDRANGEA_PALETTES.skyBlue;
const ROSE_PALETTES = HYDRANGEA_PALETTES;

/**
 * Friendly, cheerful, non-cheesy 20/10 wishes displayed when hydrangeas bloom
 */
const WHISPER_NOTES = [
  'Chúc bạn một ngày 20/10 ngập tràn yêu thương và những bất ngờ nho nhỏ.',
  'Mong bạn luôn được lắng nghe, trân trọng và yêu thương theo cách mình xứng đáng.',
  'Chúc bạn đủ bình yên để nghỉ ngơi, đủ tự tin để theo đuổi điều mình thích.',
  'Một bông hoa cẩm tú cầu dành cho nụ cười của bạn. Hôm nay nhớ vui thật nhiều nhé!',
  'Chúc những dự định của bạn sớm đơm hoa, từng chút một, theo nhịp của riêng mình.',
  'Mong mỗi ngày của bạn đều có một lý do thật nhỏ để mỉm cười.',
  'Chúc bạn luôn khỏe mạnh, an yên và có thật nhiều thời gian cho chính mình.'
];

/**
 * Pre-renders a single high-DPI realistic hydrangea mophead cluster into 5 independent botanical layers
 * (Base Calyx/Sepals + 4 Concentric Floret Dome Shells) so each hydrangea can dynamically unfurl,
 * breathe, expand outward, and flare wide open in real-time ("Nở rộ mạnh").
 */
function createHydrangeaSprite(config) {
  const {
    radius = 68,
    paletteKey = 'skyBlue',
    density = 'dense', // 'dense' | 'medium' | 'loose'
    tiltX = 0,
    tiltY = 0,
    seed = 101,
    hasDewdrop = false
  } = config;

  const dpr = Math.min(window.devicePixelRatio || 2, 2.2);
  const pad = radius * 0.62;
  const logicalSize = (radius + pad) * 2;

  function createLayerCanvas() {
    const c = document.createElement('canvas');
    c.width = Math.ceil(logicalSize * dpr);
    c.height = Math.ceil(logicalSize * dpr);
    const lCtx = c.getContext('2d');
    lCtx.scale(dpr, dpr);
    return { canvas: c, ctx: lCtx };
  }

  // Layer 0: Base shadow & broad green hydrangea leaves
  const baseLayer = createLayerCanvas();
  // 4 Concentric Dome Layers:
  // [0: Outer Perimeter Florets, 1: Mid-Outer Shell, 2: Mid-Inner Shell, 3: Crown Center Cluster]
  const whorlLayers = [
    createLayerCanvas(),
    createLayerCanvas(),
    createLayerCanvas(),
    createLayerCanvas()
  ];

  const cx = logicalSize / 2;
  const cy = logicalSize / 2;
  const rand = createSeededRandom(seed);
  const pal = HYDRANGEA_PALETTES[paletteKey] || HYDRANGEA_PALETTES.skyBlue;

  // 1. Soft Ambient Occlusion Base Shadow & Base Foliage on baseLayer
  const bCtx0 = baseLayer.ctx;
  bCtx0.save();
  const baseShadow = bCtx0.createRadialGradient(
    cx + tiltX * 4, cy + radius * 0.12 + tiltY * 4, radius * 0.18,
    cx, cy + radius * 0.08, radius * 1.34
  );
  baseShadow.addColorStop(0, pal.creviceShadow || 'rgba(25, 45, 55, 0.34)');
  baseShadow.addColorStop(0.62, 'rgba(25, 45, 55, 0.12)');
  baseShadow.addColorStop(1, 'rgba(25, 45, 55, 0)');
  bCtx0.fillStyle = baseShadow;
  bCtx0.beginPath();
  bCtx0.arc(cx, cy + radius * 0.08, radius * 1.34, 0, Math.PI * 2);
  bCtx0.fill();
  bCtx0.restore();

  // Green hydrangea leaves peeking out around base of mophead dome
  const sepalCount = 4;
  for (let s = 0; s < sepalCount; s++) {
    const sAngle = Math.atan2(tiltY, tiltX) + (s / sepalCount) * Math.PI * 2 + (rand() - 0.5) * 0.35;
    const sLen = radius * 1.12;
    bCtx0.save();
    bCtx0.translate(cx, cy);
    bCtx0.rotate(sAngle);
    bCtx0.beginPath();
    bCtx0.moveTo(0, -radius * 0.16);
    bCtx0.quadraticCurveTo(sLen * 0.45, -radius * 0.34, sLen, -radius * 0.02);
    bCtx0.quadraticCurveTo(sLen * 0.45, radius * 0.32, 0, radius * 0.16);
    bCtx0.closePath();
    const sepGrad = bCtx0.createLinearGradient(0, 0, sLen, 0);
    sepGrad.addColorStop(0, '#244D2F');
    sepGrad.addColorStop(0.6, '#3A7447');
    sepGrad.addColorStop(1, '#5C9A69');
    bCtx0.fillStyle = sepGrad;
    bCtx0.fill();
    bCtx0.restore();
  }

  /**
   * Helper: Draws one realistic 4-petal hydrangea floret onto a layer context
   */
  function drawFloret(ctx, fx, fy, fRadius, baseRot) {
    ctx.save();
    ctx.translate(fx, fy);
    ctx.rotate(baseRot);

    // Subtle drop shadow for layered floret depth
    ctx.shadowColor = pal.creviceShadow;
    ctx.shadowBlur = Math.max(2, fRadius * 0.28);
    ctx.shadowOffsetX = Math.cos(baseRot) * 1.0;
    ctx.shadowOffsetY = Math.sin(baseRot) * 1.0 + 1.2;

    // 4 petals in cruciform pattern with subtle organic variation
    for (let p = 0; p < 4; p++) {
      const pa = (p / 4) * Math.PI * 2 + (rand() - 0.5) * 0.12;
      const pLen = fRadius * (0.94 + rand() * 0.14);
      const pWidth = fRadius * (0.65 + rand() * 0.12);

      ctx.save();
      ctx.rotate(pa);

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(pWidth * 0.46, -pLen * 0.32, pWidth * 0.62, -pLen * 0.78, 0, -pLen);
      ctx.bezierCurveTo(-pWidth * 0.62, -pLen * 0.78, -pWidth * 0.46, -pLen * 0.32, 0, 0);
      ctx.closePath();

      // Petal radial gradient
      const pGrad = ctx.createRadialGradient(0, -pLen * 0.15, 0, 0, -pLen * 0.55, pLen * 0.96);
      pGrad.addColorStop(0, pal.innerShadow);
      pGrad.addColorStop(0.38, pal.midBelly);
      pGrad.addColorStop(0.82, pal.outerBlush);
      pGrad.addColorStop(1, pal.lipHighlight);
      ctx.fillStyle = pGrad;
      ctx.fill();

      // Clear shadow for delicate details
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;

      // Fine central vein
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(0, -pLen * 0.5, 0, -pLen * 0.82);
      ctx.strokeStyle = rgbaStr(pal.innerShadow, 0.35);
      ctx.lineWidth = 0.7;
      ctx.stroke();

      // Silky petal rim highlight
      ctx.beginPath();
      ctx.moveTo(pWidth * 0.3, -pLen * 0.42);
      ctx.bezierCurveTo(pWidth * 0.54, -pLen * 0.76, 0, -pLen * 1.02, 0, -pLen);
      ctx.bezierCurveTo(0, -pLen * 1.02, -pWidth * 0.54, -pLen * 0.76, -pWidth * 0.3, -pLen * 0.42);
      ctx.strokeStyle = rgbaStr(pal.lipHighlight, 0.75);
      ctx.lineWidth = 0.8;
      ctx.stroke();

      ctx.restore();
    }

    // Central stamen button of floret
    ctx.shadowColor = 'transparent';
    ctx.beginPath();
    ctx.arc(0, 0, fRadius * 0.15, 0, Math.PI * 2);
    const eyeGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, fRadius * 0.15);
    eyeGrad.addColorStop(0, '#FFFCE8');
    eyeGrad.addColorStop(0.55, pal.stamen || pal.lipHighlight);
    eyeGrad.addColorStop(1, pal.deepCore);
    ctx.fillStyle = eyeGrad;
    ctx.fill();

    ctx.restore();
  }

  // 2. Sculpt 4 Concentric Dome Layers of florets
  // Layer 0: Outer perimeter (16 florets)
  // Layer 1: Mid-outer shell (13 florets)
  // Layer 2: Mid-inner shell (9 florets)
  // Layer 3: Crown center (6 florets)
  const layerConfigs = [
    { idx: 0, count: 16, rMin: 0.74, rMax: 1.00, fScale: 0.23 },
    { idx: 1, count: 13, rMin: 0.48, rMax: 0.74, fScale: 0.24 },
    { idx: 2, count: 9,  rMin: 0.24, rMax: 0.50, fScale: 0.25 },
    { idx: 3, count: 6,  rMin: 0.00, rMax: 0.26, fScale: 0.26 }
  ];

  const heartShiftX = tiltX * radius * 0.22;
  const heartShiftY = tiltY * radius * 0.22;

  layerConfigs.forEach(({ idx, count, rMin, rMax, fScale }) => {
    const wCtx = whorlLayers[idx].ctx;
    const layerNorm = 1 - idx / 3;
    const ringCx = cx + heartShiftX * (1 - layerNorm * 0.5);
    const ringCy = cy + heartShiftY * (1 - layerNorm * 0.5);

    // Warm/cool inner depth glow on inner layers (idx >= 2)
    if (idx >= 2) {
      const cupGlow = wCtx.createRadialGradient(
        ringCx, ringCy, radius * 0.04,
        ringCx, ringCy, radius * 0.65
      );
      cupGlow.addColorStop(0, rgbaStr(pal.deepCore, 0.38));
      cupGlow.addColorStop(0.55, rgbaStr(pal.innerShadow, 0.16));
      cupGlow.addColorStop(1, rgbaStr(pal.midBelly, 0));
      wCtx.fillStyle = cupGlow;
      wCtx.beginPath();
      wCtx.arc(ringCx, ringCy, radius * 0.65, 0, Math.PI * 2);
      wCtx.fill();
    }

    const baseAngleOffset = rand() * Math.PI * 2;
    for (let i = 0; i < count; i++) {
      const angle = baseAngleOffset + (i / count) * Math.PI * 2 + (rand() - 0.5) * 0.32;
      const distRatio = rMin + (rMax - rMin) * (0.35 + rand() * 0.65);
      const fx = ringCx + Math.cos(angle) * (radius * distRatio);
      const fy = ringCy + Math.sin(angle) * (radius * distRatio);
      const fRadius = radius * fScale * (0.92 + rand() * 0.16);
      const fRot = rand() * Math.PI * 2;

      drawFloret(wCtx, fx, fy, fRadius, fRot);
    }
  });

  // 3. Optional Crystal Dewdrop on outer perimeter layer
  if (hasDewdrop) {
    const dewCtx = whorlLayers[0].ctx;
    const dewAngle = rand() * Math.PI * 2;
    const dewDist = radius * (0.62 + rand() * 0.24);
    const dx = cx + Math.cos(dewAngle) * dewDist;
    const dy = cy + Math.sin(dewAngle) * dewDist;
    const dr = 3.4 + rand() * 1.8;

    dewCtx.save();
    dewCtx.fillStyle = pal.creviceShadow || 'rgba(25, 45, 60, 0.28)';
    dewCtx.beginPath();
    dewCtx.ellipse(dx + 1, dy + 1.6, dr, dr * 0.82, 0.2, 0, Math.PI * 2);
    dewCtx.fill();

    const dewGrad = dewCtx.createRadialGradient(dx - dr * 0.3, dy - dr * 0.3, 0.5, dx, dy, dr);
    dewGrad.addColorStop(0, 'rgba(255, 255, 255, 0.96)');
    dewGrad.addColorStop(0.45, 'rgba(240, 250, 255, 0.55)');
    dewGrad.addColorStop(0.85, 'rgba(200, 230, 245, 0.35)');
    dewGrad.addColorStop(1, 'rgba(255, 255, 255, 0.78)');
    dewCtx.fillStyle = dewGrad;
    dewCtx.beginPath();
    dewCtx.ellipse(dx, dy, dr, dr * 0.85, -0.2, 0, Math.PI * 2);
    dewCtx.fill();

    dewCtx.fillStyle = '#FFFFFF';
    dewCtx.beginPath();
    dewCtx.arc(dx - dr * 0.35, dy - dr * 0.35, dr * 0.28, 0, Math.PI * 2);
    dewCtx.fill();
    dewCtx.restore();
  }

  return {
    baseCanvas: baseLayer.canvas,
    whorlCanvases: whorlLayers.map(l => l.canvas),
    logicalSize,
    radius,
    palette: pal
  };
}

const createRealisticRoseSprite = createHydrangeaSprite;

/**
 * Draws a realistic broad hydrangea leaf or silvery eucalyptus sprig
 */
function drawBotanicalLeaf(ctx, x, y, angle, length, width, type = 'hydrangeaLeaf') {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);

  // Soft shadow beneath leaf
  ctx.shadowColor = 'rgba(25, 40, 32, 0.22)';
  ctx.shadowBlur = 10;
  ctx.shadowOffsetY = 4;

  ctx.beginPath();
  ctx.moveTo(0, 0);
  if (type === 'eucalyptus') {
    ctx.bezierCurveTo(length * 0.28, -width, length * 0.72, -width * 0.85, length, 0);
    ctx.bezierCurveTo(length * 0.72, width * 0.85, length * 0.28, width, 0, 0);
  } else {
    // Broad ovate hydrangea leaf with gentle tapering tip
    ctx.bezierCurveTo(length * 0.22, -width * 1.05, length * 0.68, -width * 0.95, length, 0);
    ctx.bezierCurveTo(length * 0.68, width * 0.95, length * 0.22, width * 1.05, 0, 0);
  }
  ctx.closePath();

  const grad = ctx.createLinearGradient(0, -width * 0.6, length, width * 0.6);
  if (type === 'eucalyptus') {
    grad.addColorStop(0, '#426354');
    grad.addColorStop(0.5, '#628574');
    grad.addColorStop(1, '#8BAE9D');
  } else {
    grad.addColorStop(0, '#1E4627');
    grad.addColorStop(0.55, '#356D40');
    grad.addColorStop(1, '#5B9668');
  }
  ctx.fillStyle = grad;
  ctx.fill();

  // Central and lateral veins
  ctx.shadowColor = 'transparent';
  ctx.beginPath();
  ctx.moveTo(2, 0);
  ctx.quadraticCurveTo(length * 0.5, -1, length * 0.94, 0);
  ctx.strokeStyle = type === 'eucalyptus' ? 'rgba(215, 235, 224, 0.45)' : 'rgba(195, 235, 195, 0.42)';
  ctx.lineWidth = 1.2;
  ctx.stroke();

  const veinCount = type === 'eucalyptus' ? 4 : 6;
  for (let v = 1; v <= veinCount; v++) {
    const vx = length * (v * (1 / (veinCount + 1)));
    const vw = width * (1 - Math.abs(v / (veinCount + 1) - 0.42)) * 0.72;
    ctx.beginPath();
    ctx.moveTo(vx, 0);
    ctx.quadraticCurveTo(vx + 6, -vw * 0.5, vx + 12, -vw * 0.85);
    ctx.moveTo(vx, 0);
    ctx.quadraticCurveTo(vx + 6, vw * 0.5, vx + 12, vw * 0.85);
    ctx.lineWidth = 0.75;
    ctx.stroke();
  }

  ctx.restore();
}

/**
 * Dựng chùm hoa bi trắng (Gypsophila) nhỏ li ti điểm xuyết trong bó hoa
 */
function createBabyBreathClusterSprite(seed = 1) {
  const dpr = Math.min(window.devicePixelRatio || 2, 2.5);
  const size = 150;
  const canvas = document.createElement('canvas');
  canvas.width = size * dpr;
  canvas.height = size * dpr;
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);

  const rand = createSeededRandom(seed);
  const cx = size * 0.5;
  const cy = size * 0.82;

  // Delicate airy branching stems
  const branches = 7;
  const blossomPoints = [];

  for (let b = 0; b < branches; b++) {
    const bAngle = -Math.PI * 0.5 + (b - (branches - 1) / 2) * 0.26 + (rand() - 0.5) * 0.12;
    const bLen = 48 + rand() * 46;
    const ex = cx + Math.cos(bAngle) * bLen;
    const ey = cy + Math.sin(bAngle) * bLen;

    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.quadraticCurveTo(
      (cx + ex) * 0.5 + (rand() - 0.5) * 14,
      (cy + ey) * 0.5,
      ex, ey
    );
    ctx.strokeStyle = 'rgba(110, 145, 120, 0.55)';
    ctx.lineWidth = 1.1;
    ctx.stroke();

    blossomPoints.push({ x: ex, y: ey, r: 5.2 + rand() * 2.5, isTinted: rand() > 0.75 });

    // Sub-twigs
    for (let t = 0; t < 2; t++) {
      const tAngle = bAngle + (t === 0 ? -0.35 : 0.35) + (rand() - 0.5) * 0.15;
      const tLen = 16 + rand() * 18;
      const tx = (cx + ex) * 0.55 + Math.cos(tAngle) * tLen;
      const ty = (cy + ey) * 0.55 + Math.sin(tAngle) * tLen;

      ctx.beginPath();
      ctx.moveTo((cx + ex) * 0.55, (cy + ey) * 0.55);
      ctx.lineTo(tx, ty);
      ctx.lineWidth = 0.75;
      ctx.stroke();

      blossomPoints.push({ x: tx, y: ty, r: 4.0 + rand() * 2.2, isTinted: rand() > 0.78 });
    }
  }

  // Draw tiny multi-petal gypsophila blossoms
  blossomPoints.forEach(pt => {
    ctx.save();
    ctx.translate(pt.x, pt.y);
    ctx.shadowColor = 'rgba(40, 65, 75, 0.18)';
    ctx.shadowBlur = 4;

    const petals = 5;
    for (let p = 0; p < petals; p++) {
      const pa = (p / petals) * Math.PI * 2 + rand() * 0.3;
      const px = Math.cos(pa) * (pt.r * 0.58);
      const py = Math.sin(pa) * (pt.r * 0.58);
      ctx.beginPath();
      ctx.arc(px, py, pt.r * 0.52, 0, Math.PI * 2);
      ctx.fillStyle = pt.isTinted ? '#EBF4FC' : '#FFFDFB';
      ctx.fill();
    }

    // Tiny warm center
    ctx.beginPath();
    ctx.arc(0, 0, pt.r * 0.28, 0, Math.PI * 2);
    ctx.fillStyle = pt.isTinted ? '#99C7EB' : '#F3E5BE';
    ctx.fill();
    ctx.restore();
  });

  return { canvas, size };
}

/**
 * Vẽ các lớp giấy gói phong cách Hàn Quốc xếp lớp phía sau bó hoa kèm bóng mờ
 */
function drawWrappingPaperBack(ctx, cx, cy, scale) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(scale, scale);

  // Soft ambient drop shadow behind the entire wrapped bouquet
  const bgShadow = ctx.createRadialGradient(0, 20, 40, 0, 45, 295);
  bgShadow.addColorStop(0, 'rgba(45, 65, 75, 0.20)');
  bgShadow.addColorStop(0.65, 'rgba(55, 75, 85, 0.08)');
  bgShadow.addColorStop(1, 'rgba(55, 75, 85, 0)');
  ctx.fillStyle = bgShadow;
  ctx.beginPath();
  ctx.arc(0, 40, 295, 0, Math.PI * 2);
  ctx.fill();

  // Helper for folded florist paper sheet
  function drawPaperSheet(points, gradColors, trimColor) {
    ctx.save();
    ctx.shadowColor = 'rgba(40, 60, 70, 0.14)';
    ctx.shadowBlur = 18;
    ctx.shadowOffsetY = 6;

    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      const pt = points[i];
      ctx.bezierCurveTo(pt.cp1x, pt.cp1y, pt.cp2x, pt.cp2y, pt.x, pt.y);
    }
    ctx.closePath();

    const g = ctx.createLinearGradient(0, -260, 0, 220);
    g.addColorStop(0, gradColors[0]);
    g.addColorStop(0.55, gradColors[1]);
    g.addColorStop(1, gradColors[2]);
    ctx.fillStyle = g;
    ctx.fill();

    if (trimColor) {
      ctx.shadowColor = 'transparent';
      ctx.strokeStyle = trimColor;
      ctx.lineWidth = 1.4;
      ctx.stroke();
    }
    ctx.restore();
  }

  // 1. Center-Back Tall Crown Sheet (Pearl Alabaster Cream)
  drawPaperSheet(
    [
      { x: 0, y: 150 },
      { cp1x: -140, cp1y: 40, cp2x: -185, cp2y: -175, x: -115, y: -245 },
      { cp1x: -60, cp1y: -278, cp2x: -20, cp2y: -252, x: 0, y: -260 },
      { cp1x: 20, cp1y: -252, cp2x: 60, cp2y: -278, x: 115, y: -245 },
      { cp1x: 185, cp1y: -175, cp2x: 140, cp2y: 40, x: 0, y: 150 }
    ],
    ['#FFFDFB', '#F7F6F2', '#EDE8E0'],
    'rgba(180, 195, 190, 0.55)'
  );

  // 2. Left Wide Wing Sheet (Soft Korean Frosted Celadon Paper)
  drawPaperSheet(
    [
      { x: -10, y: 165 },
      { cp1x: -150, cp1y: 80, cp2x: -258, cp2y: -60, x: -232, y: -155 },
      { cp1x: -212, cp1y: -215, cp2x: -145, cp2y: -220, x: -85, y: -195 },
      { cp1x: -30, cp1y: -165, cp2x: -10, cp2y: 40, x: -10, y: 165 }
    ],
    ['#F5FAF9', '#E4F0EE', '#D0E3E0'],
    'rgba(160, 195, 190, 0.6)'
  );

  // 3. Right Wide Wing Sheet (Soft Korean Frosted Celadon Paper)
  drawPaperSheet(
    [
      { x: 10, y: 165 },
      { cp1x: 150, cp1y: 80, cp2x: 258, cp2y: -60, x: 232, y: -155 },
      { cp1x: 212, cp1y: -215, cp2x: 145, cp2y: -220, x: 85, y: -195 },
      { cp1x: 30, cp1y: -165, cp2x: 10, cp2y: 40, x: 10, y: 165 }
    ],
    ['#F5FAF9', '#E4F0EE', '#D0E3E0'],
    'rgba(160, 195, 190, 0.6)'
  );

  // 4. Inner Crinkled Frosted Silk Tissue Collar
  drawPaperSheet(
    [
      { x: 0, y: 130 },
      { cp1x: -180, cp1y: 30, cp2x: -225, cp2y: -120, x: -165, y: -182 },
      { cp1x: -115, cp1y: -225, cp2x: -55, cp2y: -205, x: 0, y: -218 },
      { cp1x: 55, cp1y: -205, cp2x: 115, cp2y: -225, x: 165, y: -182 },
      { cp1x: 225, cp1y: -120, cp2x: 180, cp2y: 30, x: 0, y: 130 }
    ],
    ['rgba(255, 255, 255, 0.95)', 'rgba(248, 252, 252, 0.90)', 'rgba(235, 245, 244, 0.85)'],
    'rgba(255, 255, 255, 0.92)'
  );

  // 5. Deep Botanical Shadow Bed inside the paper cone
  const bedGrad = ctx.createRadialGradient(0, -35, 30, 0, -35, 195);
  bedGrad.addColorStop(0, '#1E3228');
  bedGrad.addColorStop(0.65, '#243A36');
  bedGrad.addColorStop(1, 'rgba(36, 58, 54, 0)');
  ctx.fillStyle = bedGrad;
  ctx.beginPath();
  ctx.ellipse(0, -35, 190, 170, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

/**
 * Vẽ vạt giấy gói trước, cuống hoa xanh, thẻ tag 20/10 và nơ lụa satin bay nhấp nhô theo thời gian
 */
function drawWrappingPaperFrontAndRibbon(ctx, cx, cy, scale, time) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(scale, scale);

  const waistX = 0;
  const waistY = 148;

  // 1. Fresh Green Hydrangea Stems peeking out at the bottom
  const stemOffsets = [-22, -11, -2, 8, 19, 27];
  stemOffsets.forEach((ox, idx) => {
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(ox * 0.4, waistY + 40);
    ctx.quadraticCurveTo(ox * 0.8, waistY + 95, ox * 1.35, waistY + 148 + (idx % 2) * 8);
    ctx.strokeStyle = idx % 2 === 0 ? '#34573B' : '#476F4E';
    ctx.lineWidth = 6.2;
    ctx.lineCap = 'round';
    ctx.stroke();
    ctx.restore();
  });

  // 2. Lower Back Skirt Flare of the Wrapping Paper
  ctx.save();
  ctx.shadowColor = 'rgba(40, 60, 70, 0.16)';
  ctx.shadowBlur = 16;
  ctx.shadowOffsetY = 8;

  ctx.beginPath();
  ctx.moveTo(-48, waistY - 5);
  ctx.bezierCurveTo(-82, waistY + 45, -112, waistY + 95, -88, waistY + 132);
  ctx.bezierCurveTo(-40, waistY + 142, 40, waistY + 142, 88, waistY + 132);
  ctx.bezierCurveTo(112, waistY + 95, 82, waistY + 45, 48, waistY - 5);
  ctx.closePath();

  const skirtGrad = ctx.createLinearGradient(0, waistY, 0, waistY + 138);
  skirtGrad.addColorStop(0, '#D0E3E0');
  skirtGrad.addColorStop(0.45, '#E4F0EE');
  skirtGrad.addColorStop(1, '#F7FAF9');
  ctx.fillStyle = skirtGrad;
  ctx.fill();
  ctx.restore();

  // 3. Left Front Embracing Paper Fold
  ctx.save();
  ctx.shadowColor = 'rgba(40, 60, 70, 0.15)';
  ctx.shadowBlur = 15;
  ctx.shadowOffsetY = 4;

  ctx.beginPath();
  ctx.moveTo(-195, -18);
  ctx.bezierCurveTo(-215, 55, -135, 118, -42, waistY + 2);
  ctx.bezierCurveTo(-65, waistY + 52, -78, waistY + 98, -55, waistY + 125);
  ctx.bezierCurveTo(-15, waistY + 128, 12, waistY + 115, 22, waistY + 98);
  ctx.bezierCurveTo(15, waistY + 48, 8, waistY + 12, 18, waistY - 8);
  ctx.bezierCurveTo(-45, 92, -125, 62, -195, -18);
  ctx.closePath();

  const leftFoldGrad = ctx.createLinearGradient(-195, 0, 30, waistY + 110);
  leftFoldGrad.addColorStop(0, '#FFFFFF');
  leftFoldGrad.addColorStop(0.5, '#F2F8F7');
  leftFoldGrad.addColorStop(1, '#DCEBE8');
  ctx.fillStyle = leftFoldGrad;
  ctx.fill();

  ctx.strokeStyle = 'rgba(165, 195, 190, 0.65)';
  ctx.lineWidth = 1.3;
  ctx.stroke();
  ctx.restore();

  // 4. Right Front Embracing Paper Fold
  ctx.save();
  ctx.shadowColor = 'rgba(40, 60, 70, 0.18)';
  ctx.shadowBlur = 16;
  ctx.shadowOffsetX = -3;
  ctx.shadowOffsetY = 5;

  ctx.beginPath();
  ctx.moveTo(195, -18);
  ctx.bezierCurveTo(215, 55, 135, 118, 42, waistY + 2);
  ctx.bezierCurveTo(68, waistY + 54, 84, waistY + 102, 58, waistY + 128);
  ctx.bezierCurveTo(10, waistY + 135, -24, waistY + 120, -34, waistY + 102);
  ctx.bezierCurveTo(-18, waistY + 50, -12, waistY + 12, -22, waistY - 12);
  ctx.bezierCurveTo(45, 88, 128, 60, 195, -18);
  ctx.closePath();

  const rightFoldGrad = ctx.createLinearGradient(195, 0, -40, waistY + 120);
  rightFoldGrad.addColorStop(0, '#FFFFFF');
  rightFoldGrad.addColorStop(0.45, '#F2F8F7');
  rightFoldGrad.addColorStop(1, '#DCEBE8');
  ctx.fillStyle = rightFoldGrad;
  ctx.fill();

  ctx.strokeStyle = 'rgba(165, 195, 190, 0.72)';
  ctx.lineWidth = 1.4;
  ctx.stroke();
  ctx.restore();

  // 5. LUXURY DOUBLE-LOOP SILK SATIN RIBBON & FLOWING TAILS
  const breeze = Math.sin(time * 1.8) * 6;
  const breeze2 = Math.cos(time * 1.4) * 5;

  ctx.save();
  ctx.translate(waistX, waistY + 4);

  // Ribbon waist band
  ctx.shadowColor = 'rgba(30, 60, 58, 0.28)';
  ctx.shadowBlur = 10;
  ctx.shadowOffsetY = 4;

  const ribbonBandGrad = ctx.createLinearGradient(-46, 0, 46, 0);
  ribbonBandGrad.addColorStop(0, '#2D6663');
  ribbonBandGrad.addColorStop(0.3, '#3F8783');
  ribbonBandGrad.addColorStop(0.5, '#72BDB8'); // satin sheen
  ribbonBandGrad.addColorStop(0.75, '#3F8783');
  ribbonBandGrad.addColorStop(1, '#23524F');

  ctx.fillStyle = ribbonBandGrad;
  ctx.beginPath();
  ctx.roundRect(-45, -11, 90, 22, 8);
  ctx.fill();

  // Left Flowing Satin Ribbon Tail
  ctx.beginPath();
  ctx.moveTo(-10, 8);
  ctx.bezierCurveTo(-38, 45, -68 + breeze, 92, -52 + breeze * 1.3, 142);
  ctx.lineTo(-34 + breeze * 1.3, 134);
  ctx.bezierCurveTo(-46 + breeze, 88, -20, 44, 4, 8);
  ctx.closePath();
  const tailGradL = ctx.createLinearGradient(-10, 8, -50, 140);
  tailGradL.addColorStop(0, '#2D6663');
  tailGradL.addColorStop(0.45, '#5CB2AD');
  tailGradL.addColorStop(1, '#357773');
  ctx.fillStyle = tailGradL;
  ctx.fill();

  // Right Flowing Satin Ribbon Tail
  ctx.beginPath();
  ctx.moveTo(10, 8);
  ctx.bezierCurveTo(40, 48, 72 + breeze2, 95, 58 + breeze2 * 1.3, 146);
  ctx.lineTo(38 + breeze2 * 1.3, 138);
  ctx.bezierCurveTo(50 + breeze2, 92, 22, 46, -4, 8);
  ctx.closePath();
  const tailGradR = ctx.createLinearGradient(10, 8, 55, 145);
  tailGradR.addColorStop(0, '#2D6663');
  tailGradR.addColorStop(0.5, '#5CB2AD');
  tailGradR.addColorStop(1, '#357773');
  ctx.fillStyle = tailGradR;
  ctx.fill();

  // Upper Left Bow Loop
  ctx.beginPath();
  ctx.moveTo(-6, -2);
  ctx.bezierCurveTo(-55, -36, -92, -12, -78, 14);
  ctx.bezierCurveTo(-65, 34, -28, 18, -4, 4);
  ctx.closePath();
  const loopGradL = ctx.createLinearGradient(-85, -15, -5, 10);
  loopGradL.addColorStop(0, '#2A615E');
  loopGradL.addColorStop(0.45, '#72BDB8');
  loopGradL.addColorStop(1, '#23524F');
  ctx.fillStyle = loopGradL;
  ctx.fill();

  // Upper Right Bow Loop
  ctx.beginPath();
  ctx.moveTo(6, -2);
  ctx.bezierCurveTo(55, -36, 92, -12, 78, 14);
  ctx.bezierCurveTo(65, 34, 28, 18, 4, 4);
  ctx.closePath();
  const loopGradR = ctx.createLinearGradient(85, -15, 5, 10);
  loopGradR.addColorStop(0, '#2A615E');
  loopGradR.addColorStop(0.45, '#72BDB8');
  loopGradR.addColorStop(1, '#23524F');
  ctx.fillStyle = loopGradR;
  ctx.fill();

  // Secondary Lower Bow Loops for fullness
  ctx.beginPath();
  ctx.moveTo(-6, 2);
  ctx.bezierCurveTo(-48, 8, -72, 28, -54, 42);
  ctx.bezierCurveTo(-38, 52, -15, 25, -3, 6);
  ctx.closePath();
  ctx.fillStyle = '#397B77';
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(6, 2);
  ctx.bezierCurveTo(48, 8, 72, 28, 54, 42);
  ctx.bezierCurveTo(38, 52, 15, 25, 3, 6);
  ctx.closePath();
  ctx.fillStyle = '#397B77';
  ctx.fill();

  // Center Satin Ribbon Knot
  const knotGrad = ctx.createRadialGradient(-3, -3, 2, 0, 0, 16);
  knotGrad.addColorStop(0, '#BFE6E3');
  knotGrad.addColorStop(0.45, '#4E9B97');
  knotGrad.addColorStop(1, '#1E4E4B');
  ctx.fillStyle = knotGrad;
  ctx.beginPath();
  ctx.roundRect(-13, -12, 26, 24, 9);
  ctx.fill();

  // 6. Cute Swinging Keepsake Tag ("20 • 10")
  const tagAngle = Math.sin(time * 2.1) * 0.08 + 0.12;
  ctx.save();
  ctx.rotate(tagAngle);

  // Gold thread
  ctx.beginPath();
  ctx.moveTo(4, 10);
  ctx.lineTo(18, 34);
  ctx.strokeStyle = '#D4AF37';
  ctx.lineWidth = 1.2;
  ctx.stroke();

  // Tag card
  ctx.translate(18, 34);
  ctx.fillStyle = '#FFFDFB';
  ctx.strokeStyle = '#B8D5D2';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(-22, 0, 44, 26, 6);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#265D59';
  ctx.font = 'italic 600 10px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.fillText('20 • 10', 0, 16);
  ctx.restore();

  ctx.restore(); // end ribbon waist
  ctx.restore(); // end scale/translate
}

// Complete arrangement of 22 lush hydrangea mopheads in the 4 requested colors:
// Xanh dương ('skyBlue'), Xanh ngọc ('tealJade'), Trắng ('pureWhite'), Hồng pastel ('pastelPink')
const BOUQUET_LAYOUT = [
  // TIER 1: Upper & Outer Halo (Back Depth)
  { x: -128, y: -165, r: 46, paletteKey: 'skyBlue', variety: 'loose', tiltX: -0.35, tiltY: -0.35, z: 1, seed: 11 },
  { x: -62,  y: -192, r: 49, paletteKey: 'pureWhite', variety: 'medium', tiltX: -0.18, tiltY: -0.4, z: 1, seed: 12 },
  { x: 8,    y: -202, r: 52, paletteKey: 'tealJade', variety: 'dense', tiltX: 0.02, tiltY: -0.42, z: 1, seed: 13 },
  { x: 76,   y: -188, r: 49, paletteKey: 'pastelPink', variety: 'medium', tiltX: 0.22, tiltY: -0.38, z: 1, seed: 14 },
  { x: 134,  y: -158, r: 46, paletteKey: 'skyBlue', variety: 'loose', tiltX: 0.38, tiltY: -0.32, z: 1, seed: 15 },
  { x: -172, y: -98,  r: 47, paletteKey: 'tealJade', variety: 'loose', tiltX: -0.45, tiltY: -0.15, z: 1, seed: 16 },
  { x: 174,  y: -92,  r: 47, paletteKey: 'pastelPink', variety: 'loose', tiltX: 0.45, tiltY: -0.15, z: 1, seed: 17 },

  // TIER 2: Lush Mid-Dome Hydrangeas (Full volume & soft layered depth)
  { x: -115, y: -112, r: 58, paletteKey: 'pureWhite', variety: 'medium', tiltX: -0.26, tiltY: -0.22, z: 2, seed: 21, hasDewdrop: true },
  { x: -38,  y: -138, r: 62, paletteKey: 'skyBlue', variety: 'dense', tiltX: -0.1, tiltY: -0.24, z: 2, seed: 22 },
  { x: 44,   y: -135, r: 60, paletteKey: 'tealJade', variety: 'dense', tiltX: 0.12, tiltY: -0.24, z: 2, seed: 23, hasDewdrop: true },
  { x: 118,  y: -108, r: 58, paletteKey: 'pastelPink', variety: 'medium', tiltX: 0.28, tiltY: -0.2, z: 2, seed: 24 },
  { x: -150, y: -32,  r: 57, paletteKey: 'tealJade', variety: 'medium', tiltX: -0.35, tiltY: 0.02, z: 2, seed: 25 },
  { x: 152,  y: -28,  r: 57, paletteKey: 'skyBlue', variety: 'medium', tiltX: 0.35, tiltY: 0.02, z: 2, seed: 26 },
  { x: -118, y: 38,   r: 56, paletteKey: 'pastelPink', variety: 'medium', tiltX: -0.28, tiltY: 0.24, z: 2, seed: 27 },
  { x: 120,  y: 42,   r: 56, paletteKey: 'pureWhite', variety: 'medium', tiltX: 0.28, tiltY: 0.24, z: 2, seed: 28 },

  // TIER 3: Grand Hero Centerpiece Hydrangeas (Large, gorgeous focal mopheads)
  { x: -78,  y: -58,  r: 66, paletteKey: 'skyBlue', variety: 'dense', tiltX: -0.14, tiltY: -0.08, z: 3, seed: 31, hasDewdrop: true },
  { x: 78,   y: -55,  r: 65, paletteKey: 'tealJade', variety: 'dense', tiltX: 0.15, tiltY: -0.08, z: 3, seed: 32 },
  { x: -58,  y: 25,   r: 64, paletteKey: 'pastelPink', variety: 'dense', tiltX: -0.12, tiltY: 0.16, z: 3, seed: 33, hasDewdrop: true },
  { x: 60,   y: 28,   r: 64, paletteKey: 'pureWhite', variety: 'dense', tiltX: 0.12, tiltY: 0.16, z: 3, seed: 34, hasDewdrop: true },
  { x: 0,    y: 48,   r: 62, paletteKey: 'skyBlue', variety: 'dense', tiltX: 0.0, tiltY: 0.22, z: 3, seed: 35 },

  // TIER 4: Crown Jewel Center Hydrangeas
  { x: 0,    y: -78,  r: 68, paletteKey: 'pureWhite', variety: 'dense', tiltX: 0.0, tiltY: -0.12, z: 4, seed: 41, hasDewdrop: true },
  { x: -2,   y: -10,  r: 74, paletteKey: 'tealJade', variety: 'dense', tiltX: 0.0, tiltY: 0.02, z: 4, seed: 42, hasDewdrop: true }
];

// Foliage & Eucalyptus Sprigs around the hydrangea dome
const FOLIAGE_LAYOUT = [
  // Back & Upper Eucalyptus / Hydrangea Leaves
  { x: -145, y: -145, angle: -2.35, len: 88, w: 32, type: 'eucalyptus',    layer: 'back' },
  { x: -85,  y: -185, angle: -1.85, len: 94, w: 34, type: 'hydrangeaLeaf', layer: 'back' },
  { x: -10,  y: -200, angle: -1.55, len: 98, w: 32, type: 'eucalyptus',    layer: 'back' },
  { x: 75,   y: -185, angle: -1.25, len: 92, w: 34, type: 'hydrangeaLeaf', layer: 'back' },
  { x: 145,  y: -140, angle: -0.75, len: 88, w: 32, type: 'eucalyptus',    layer: 'back' },
  { x: -175, y: -65,  angle: -2.75, len: 88, w: 35, type: 'hydrangeaLeaf', layer: 'back' },
  { x: 175,  y: -60,  angle: -0.35, len: 88, w: 35, type: 'hydrangeaLeaf', layer: 'back' },

  // Foreground Collar Leaves cascading over the wrapping paper edge
  { x: -140, y: 45,   angle: 2.55,  len: 78, w: 30, type: 'hydrangeaLeaf', layer: 'front' },
  { x: -85,  y: 72,   angle: 2.15,  len: 84, w: 30, type: 'eucalyptus',    layer: 'front' },
  { x: -28,  y: 82,   angle: 1.78,  len: 76, w: 28, type: 'hydrangeaLeaf', layer: 'front' },
  { x: 32,   y: 82,   angle: 1.35,  len: 76, w: 28, type: 'hydrangeaLeaf', layer: 'front' },
  { x: 88,   y: 70,   angle: 0.95,  len: 84, w: 30, type: 'eucalyptus',    layer: 'front' },
  { x: 142,  y: 42,   angle: 0.55,  len: 78, w: 30, type: 'hydrangeaLeaf', layer: 'front' }
];

// Gypsophila (Hoa Baby Trắng) Clusters tucked around and inside the bouquet
const BABY_BREATH_LAYOUT = [
  { x: -158, y: -142, angle: -0.65, scale: 0.92, layer: 'back', seed: 101 },
  { x: -35,  y: -208, angle: -0.12, scale: 0.96, layer: 'back', seed: 102 },
  { x: 48,   y: -204, angle: 0.18,  scale: 0.94, layer: 'back', seed: 103 },
  { x: 162,  y: -135, angle: 0.68,  scale: 0.92, layer: 'back', seed: 104 },
  { x: -188, y: -42,  angle: -1.05, scale: 0.88, layer: 'back', seed: 105 },
  { x: 190,  y: -38,  angle: 1.05,  scale: 0.88, layer: 'back', seed: 106 },

  // Foreground airy baby's breath tucked between hydrangeas
  { x: -102, y: -82,  angle: -0.45, scale: 0.72, layer: 'front', seed: 201 },
  { x: 104,  y: -78,  angle: 0.45,  scale: 0.72, layer: 'front', seed: 202 },
  { x: -125, y: 18,   angle: -0.85, scale: 0.78, layer: 'front', seed: 203 },
  { x: 128,  y: 22,   angle: 0.85,  scale: 0.78, layer: 'front', seed: 204 },
  { x: -45,  y: 68,   angle: -0.25, scale: 0.75, layer: 'front', seed: 205 },
  { x: 48,   y: 68,   angle: 0.25,  scale: 0.75, layer: 'front', seed: 206 }
];

const bouquetCanvas = document.getElementById('bouquetCanvas');
const bCtx = bouquetCanvas.getContext('2d');
const bouquetWrapper = document.getElementById('bouquetStageWrapper');
const ambientCanvas = document.getElementById('ambientPetalsCanvas');
const aCtx = ambientCanvas.getContext('2d');

const roseNodes = [];
const babySprites = [];
let pointerX = -9999;
let pointerY = -9999;
let parallaxTargetX = 0;
let parallaxTargetY = 0;
let parallaxX = 0;
let parallaxY = 0;
let nextAutoShowcaseTime = performance.now() + 11000;
let stageW = 640;
let stageH = 640;
let winW = window.innerWidth;
let winH = window.innerHeight;
const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
let reducedMotion = motionPreference.matches;
let sceneAnimationFrame = null;
let keyboardRoseIndex = 0;
const bloomTimers = new Set();

function requestSceneRender() {
  if (sceneAnimationFrame === null && !document.hidden) {
    sceneAnimationFrame = requestAnimationFrame(renderBouquetScene);
  }
}

function clearBloomTimers() {
  bloomTimers.forEach(clearTimeout);
  bloomTimers.clear();
}

function scheduleBloom(callback, delay) {
  const timer = setTimeout(() => {
    bloomTimers.delete(timer);
    if (!reducedMotion && !document.hidden) callback();
  }, delay);
  bloomTimers.add(timer);
}

function settleBouquet() {
  clearBloomTimers();
  roseNodes.forEach(rose => {
    rose.bloom = rose.targetBloom = 1.04;
    rose.vBloom = rose.vScale = rose.flareGlow = 0;
    rose.scaleOffset = 1;
    rose.vx = rose.vy = rose.offsetX = rose.offsetY = 0;
  });
  fallingPetals.length = 0;
  burstSparkles.length = 0;
  pointerX = pointerY = -9999;
  parallaxX = parallaxY = parallaxTargetX = parallaxTargetY = 0;
}

/**
 * Khởi tạo và render trước toàn bộ sprite cẩm tú cầu, hoa bi, lá cây vào các canvas đệm
 */
function initBotanicalAssets() {
  BOUQUET_LAYOUT.forEach((item, index) => {
    const sprite = createHydrangeaSprite({ ...item, radius: item.r });
    roseNodes.push({
      ...item,
      index,
      sprite,
      offsetX: 0,
      offsetY: 0,
      vx: 0,
      vy: 0,
      scaleOffset: 1,
      vScale: 0,
      // Multi-layer unfurling bloom state: 0.05 = compact bud, 1.0 = full bloom, 1.32 = dramatic wide over-bloom
      bloom: 0.05,
      targetBloom: 1.04,
      vBloom: 0,
      flareGlow: 0,
      spinDir: index % 2 === 0 ? 1 : -1,
      whisper: WHISPER_NOTES[index % WHISPER_NOTES.length]
    });
  });

  // Sort by depth z so back hydrangeas render first and hero center ones render on top
  roseNodes.sort((a, b) => a.z - b.z);

  BABY_BREATH_LAYOUT.forEach(item => {
    babySprites.push({
      ...item,
      sprite: createBabyBreathClusterSprite(item.seed)
    });
  });
}

/**
 * Kích hoạt làn sóng bung nở lan tỏa từ điểm chạm ra toàn bộ bó hoa
 */
function triggerBouquetBloomWave(originX = 0, originY = -30, mode = 'grand') {
  clearBloomTimers();
  nextAutoShowcaseTime = performance.now() + 11000;
  if (reducedMotion) {
    settleBouquet();
    requestSceneRender();
    return;
  }
  roseNodes.forEach(rose => {
    const distance = Math.hypot(rose.x - originX, rose.y - originY);
    const delay = mode === 'grand' ? distance * 2.1 + (4 - rose.z) * 65 : distance * 1.4;
    if (mode === 'grand') {
      rose.bloom = rose.targetBloom = 0.04;
      rose.vBloom = 0;
      rose.scaleOffset = 0.78;
    } else {
      scheduleBloom(() => {
        rose.targetBloom = 0.48;
        rose.vBloom = -0.06;
      }, Math.max(0, delay - 110));
    }
    scheduleBloom(() => {
      rose.targetBloom = 1.32;
      rose.vBloom = mode === 'grand' ? 0.145 : 0.165;
      rose.vScale += 0.11;
      rose.flareGlow = 1;
      if (mode === 'grand' ? rose.z >= 3 : Math.random() > 0.78) {
        const rect = bouquetCanvas.getBoundingClientRect();
        spawnPetalBurst(rect.left + rose.screenX, rect.top + rose.screenY, mode === 'grand' ? 2 : 1);
      }
      scheduleBloom(() => {
        rose.targetBloom = 1.04 + (rose.z >= 3 ? 0.04 : 0);
      }, 520);
    }, delay + (mode === 'ripple' ? 90 : 0));
  });
  requestSceneRender();
}

function resizeCanvases() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2.5);
  stageW = bouquetWrapper.clientWidth || 560;
  stageH = bouquetWrapper.clientHeight || 560;
  bouquetCanvas.width = Math.round(stageW * dpr);
  bouquetCanvas.height = Math.round(stageH * dpr);
  bCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
  winW = window.innerWidth;
  winH = window.innerHeight;
  ambientCanvas.width = Math.round(winW * dpr);
  ambientCanvas.height = Math.round(winH * dpr);
  aCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
  requestSceneRender();
}

const fallingPetals = [];
const burstSparkles = [];

function createPetalParticle(customX, customY, isBurst = false) {
  // 4 Hydrangea flower petal color themes: Blue, Teal, White, Pastel Pink
  const colors = [
    ['#EDF5FF', '#689DE0'], // Blue
    ['#EDFAF8', '#4EBAAF'], // Teal
    ['#FFFFFF', '#C8DBD2'], // White
    ['#FFF5F8', '#F392B0']  // Pastel Pink
  ];
  const pair = colors[Math.floor(Math.random() * colors.length)];
  const depth = 0.35 + Math.random() * 0.95; // 0.35 = background, 1.3 = foreground
  const baseSize = 4.5 + Math.random() * 6.5;
  const isFloret = Math.random() < 0.12; // 12% chance for an entire 4-petal floret floating down!
  return {
    x: customX !== undefined ? customX : Math.random() * winW,
    y: customY !== undefined ? customY : -30 - Math.random() * winH * 1.1,
    vx: isBurst ? (Math.random() - 0.5) * 5.2 : (Math.random() - 0.25) * 0.9 * depth,
    vy: isBurst ? -1.8 - Math.random() * 3.5 : (0.75 + Math.random() * 1.1) * depth,
    size: baseSize * depth * (isFloret ? 0.9 : 1.0),
    depth,
    rot: Math.random() * Math.PI * 2,
    vRot: (Math.random() - 0.5) * 0.035,
    flipPhase: Math.random() * Math.PI * 2,
    vFlip: 0.018 + Math.random() * 0.028,
    swayPhase: Math.random() * Math.PI * 2,
    swayFreq: 0.015 + Math.random() * 0.018,
    swayAmp: 0.8 + Math.random() * 1.4,
    colorInner: pair[0],
    colorOuter: pair[1],
    opacity: (isBurst ? 1 : 0.40 + Math.random() * 0.52) * Math.min(1, depth * 0.85 + 0.25),
    isBurst,
    isFloret
  };
}

function initAmbientPetals() {
  if (reducedMotion) return;
  // Mưa cánh hoa lãng mạn bay ngợp màn hình (Romantic Petal Shower)
  const count = window.innerWidth < 768 ? 55 : 85;
  for (let i = 0; i < count; i++) {
    const p = createPetalParticle(Math.random() * winW, Math.random() * winH, false);
    fallingPetals.push(p);
  }
}

/**
 * Bắn chùm cánh hoa và bụi sáng lấp lánh (sparkles) khi chạm vào bông hoa hoặc mở thiệp
 */
function spawnPetalBurst(screenX, screenY, count = 22) {
  if (reducedMotion || document.hidden) return;
  count = Math.min(count, Math.max(0, 160 - fallingPetals.length), Math.max(0, 120 - burstSparkles.length - 4));
  if (count <= 0) return;
  for (let i = 0; i < count; i++) {
    fallingPetals.push(createPetalParticle(screenX, screenY, true));
  }
  for (let i = 0; i < count + 8; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 0.8 + Math.random() * 3.2;
    burstSparkles.push({
      x: screenX,
      y: screenY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 0.7,
      r: 1.8 + Math.random() * 2.8,
      alpha: 1,
      color: i % 3 === 0 ? '#E8F6FA' : (i % 3 === 1 ? '#72C4BB' : '#A3CEF7')
    });
  }
}

function renderAmbientPetals(time) {
  aCtx.clearRect(0, 0, winW, winH);

  // Soft atmospheric breeze swaying the petal rain
  const breezeX = Math.sin(time * 0.6) * 0.5 + 0.35;

  for (let i = fallingPetals.length - 1; i >= 0; i--) {
    const p = fallingPetals[i];
    p.swayPhase += p.swayFreq;
    p.flipPhase += p.vFlip;
    p.rot += p.vRot;

    if (p.isBurst) {
      p.vy += 0.055;
      p.vx *= 0.985;
    }

    p.x += p.vx + Math.sin(p.swayPhase) * p.swayAmp + breezeX * p.depth;
    p.y += p.vy;

    // Wrap horizontally if carried by the breeze
    if (p.x > winW + 40) {
      p.x = -30;
    } else if (p.x < -40) {
      p.x = winW + 30;
    }

    if (p.y > winH + 45) {
      if (p.isBurst) {
        fallingPetals.splice(i, 1);
        continue;
      } else {
        p.y = -30 - Math.random() * 40;
        p.x = Math.random() * winW;
        p.vy = (0.75 + Math.random() * 1.1) * p.depth;
        p.isBurst = false;
      }
    }

    const flipScale = 0.25 + 0.75 * Math.abs(Math.cos(p.flipPhase));
    aCtx.save();
    aCtx.translate(p.x, p.y);
    aCtx.rotate(p.rot);
    aCtx.scale(1, flipScale);
    aCtx.globalAlpha = p.opacity;

    if (p.isFloret) {
      // Small 4-petal floating floret
      for (let f = 0; f < 4; f++) {
        const fa = (f / 4) * Math.PI * 2;
        const fl = p.size * 0.9;
        const fw = p.size * 0.6;
        aCtx.save();
        aCtx.rotate(fa);
        aCtx.beginPath();
        aCtx.moveTo(0, 0);
        aCtx.bezierCurveTo(fw * 0.45, -fl * 0.35, fw * 0.6, -fl * 0.8, 0, -fl);
        aCtx.bezierCurveTo(-fw * 0.6, -fl * 0.8, -fw * 0.45, -fl * 0.35, 0, 0);
        aCtx.closePath();
        const g = aCtx.createRadialGradient(0, -fl * 0.2, 0, 0, -fl * 0.6, fl);
        g.addColorStop(0, p.colorInner);
        g.addColorStop(1, p.colorOuter);
        aCtx.fillStyle = g;
        aCtx.fill();
        aCtx.restore();
      }
      aCtx.beginPath();
      aCtx.arc(0, 0, p.size * 0.16, 0, Math.PI * 2);
      aCtx.fillStyle = '#FFF8D6';
      aCtx.fill();
    } else {
      // Single realistic cupped falling petal with delicate centerline
      aCtx.beginPath();
      aCtx.moveTo(0, -p.size);
      aCtx.bezierCurveTo(p.size * 0.92, -p.size * 0.72, p.size * 0.82, p.size * 0.6, 0, p.size);
      aCtx.bezierCurveTo(-p.size * 0.82, p.size * 0.6, -p.size * 0.92, -p.size * 0.72, 0, -p.size);
      aCtx.closePath();

      const g = aCtx.createLinearGradient(0, -p.size, 0, p.size);
      g.addColorStop(0, p.colorInner);
      g.addColorStop(1, p.colorOuter);
      aCtx.fillStyle = g;
      aCtx.fill();

      aCtx.beginPath();
      aCtx.moveTo(0, -p.size * 0.85);
      aCtx.lineTo(0, p.size * 0.8);
      aCtx.strokeStyle = 'rgba(255, 255, 255, 0.42)';
      aCtx.lineWidth = 0.6;
      aCtx.stroke();
    }

    aCtx.restore();
  }

  // Update & draw delicate light sparkles
  for (let i = burstSparkles.length - 1; i >= 0; i--) {
    const s = burstSparkles[i];
    s.x += s.vx;
    s.y += s.vy;
    s.alpha -= 0.022;
    if (s.alpha <= 0) {
      burstSparkles.splice(i, 1);
      continue;
    }
    aCtx.save();
    aCtx.globalAlpha = s.alpha;
    aCtx.fillStyle = s.color;
    aCtx.shadowColor = '#72C4BB';
    aCtx.shadowBlur = 8;
    aCtx.beginPath();
    aCtx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    aCtx.fill();
    aCtx.restore();
  }
}

/**
 * Vòng lặp vẽ chính của bó hoa: Parallax 3D, vật lý lò xo, bóng đổ, Z-index và ánh sáng tỏa ngát
 */
function renderBouquetScene(timestamp) {
  sceneAnimationFrame = null;
  if (document.hidden) return;
  const time = reducedMotion ? 0 : timestamp * 0.001;
  bCtx.clearRect(0, 0, stageW, stageH);

  // Smoothly interpolate parallax
  parallaxX += (parallaxTargetX - parallaxX) * 0.06;
  parallaxY += (parallaxTargetY - parallaxY) * 0.06;

  // Responsive scale relative to canonical coordinate frame
  const baseScale = Math.min(stageW, stageH) / 650;
  const centerX = stageW * 0.5 + parallaxX * 8;
  const centerY = stageH * 0.51 + Math.sin(time * 1.25) * 4.5 + parallaxY * 6;
  const globalSwayRot = Math.sin(time * 0.95) * 0.018 + parallaxX * 0.015;

  bCtx.save();
  bCtx.translate(centerX, centerY);
  bCtx.rotate(globalSwayRot);

  // 1. Back Wrapping Paper & Soft Tissue Lining
  drawWrappingPaperBack(bCtx, 0, 0, baseScale);

  // 2. Back Eucalyptus & Hydrangea Foliage
  FOLIAGE_LAYOUT.filter(f => f.layer === 'back').forEach((leaf, idx) => {
    const leafSway = Math.sin(time * 1.6 + idx) * 0.035;
    drawBotanicalLeaf(
      bCtx,
      leaf.x * baseScale,
      leaf.y * baseScale,
      leaf.angle + leafSway,
      leaf.len * baseScale,
      leaf.w * baseScale,
      leaf.type
    );
  });

  // 3. Back Gypsophila (Hoa Baby Trắng) Clouds
  babySprites.filter(b => b.layer === 'back').forEach((b, idx) => {
    const bSway = Math.cos(time * 1.5 + idx) * 0.04;
    bCtx.save();
    bCtx.translate(b.x * baseScale, b.y * baseScale);
    bCtx.rotate(b.angle + bSway);
    const drawSz = b.sprite.size * b.scale * baseScale;
    bCtx.drawImage(b.sprite.canvas, -drawSz * 0.5, -drawSz * 0.82, drawSz, drawSz);
    bCtx.restore();
  });

  // 4. Individual Interactive Hydrangeas (Sorted Back-to-Front)
  if (!reducedMotion && !document.body.classList.contains('card-open') && pointerX < -1000 && timestamp > nextAutoShowcaseTime && roseNodes.length > 0) {
    const candidateIndices = roseNodes
      .map((r, i) => ({ r, i }))
      .filter(item => item.r.z >= 2);
    const pick = candidateIndices[Math.floor(Math.random() * candidateIndices.length)];
    if (pick) {
      const targetHydrangea = pick.r;
      roseNodes.forEach((r) => {
        const d = Math.hypot(r.x - targetHydrangea.x, r.y - targetHydrangea.y);
        if (d < 145) {
          const waveDelay = d * 1.5;
          scheduleBloom(() => {
            r.bloom = Math.min(r.bloom, 0.45);
            r.targetBloom = 1.32;
            r.vBloom = 0.155;
            r.vScale += 0.095 * (1 - d / 160);
            r.flareGlow = 0.95;
            scheduleBloom(() => {
              r.targetBloom = 1.04;
            }, 540);
          }, waveDelay);
        }
      });
    }
    nextAutoShowcaseTime = timestamp + 11000;
  }

  roseNodes.forEach(rose => {
    // Organic rhythmic breathing per flower
    const breath = reducedMotion ? 1 : 1 + Math.sin(time * 2.1 + rose.seed) * 0.022;

    const localX = (rose.x + rose.offsetX) * baseScale;
    const localY = (rose.y + rose.offsetY) * baseScale;
    const worldX = centerX + localX * Math.cos(globalSwayRot) - localY * Math.sin(globalSwayRot);
    const worldY = centerY + localX * Math.sin(globalSwayRot) + localY * Math.cos(globalSwayRot);
    rose.screenX = worldX;
    rose.screenY = worldY;
    rose.hitRadius = rose.r * baseScale * rose.scaleOffset * 1.08;

    const dx = pointerX - worldX;
    const dy = pointerY - worldY;
    const dist = Math.hypot(dx, dy);
    const hitRadius = rose.r * baseScale * 1.08;

    // Interactive spring physics when pointer approaches this flower
    let targetOx = (rose.z - 2) * parallaxX * 4.5;
    let targetOy = (rose.z - 2) * parallaxY * 4.5;
    let targetScale = 1.0;

    if (!reducedMotion && dist < hitRadius * 1.55) {
      const factor = 1 - dist / (hitRadius * 1.55);
      targetOx -= (dx / (dist || 1)) * factor * 8;
      targetOy -= (dy / (dist || 1)) * factor * 8;
      targetScale = 1 + factor * 0.14;
      rose.targetBloom = Math.max(rose.targetBloom, 1.06 + factor * 0.26);
      rose.flareGlow = Math.max(rose.flareGlow, factor * 0.75);
    }

    rose.vx = (rose.vx + (targetOx - rose.offsetX) * 0.12) * 0.78;
    rose.vy = (rose.vy + (targetOy - rose.offsetY) * 0.12) * 0.78;
    rose.offsetX += rose.vx;
    rose.offsetY += rose.vy;

    rose.vScale = (rose.vScale + (targetScale - rose.scaleOffset) * 0.14) * 0.76;
    rose.scaleOffset += rose.vScale;

    rose.vBloom = (rose.vBloom + (rose.targetBloom - rose.bloom) * 0.095) * 0.79;
    rose.bloom += rose.vBloom;
    rose.flareGlow *= 0.94;

    const rx = (rose.x + rose.offsetX) * baseScale;
    const ry = (rose.y + rose.offsetY) * baseScale;
    const totalScale = baseScale * breath * rose.scaleOffset;
    const drawSize = rose.sprite.logicalSize * totalScale;
    const baseSwayRot = reducedMotion ? 0 : Math.sin(time * 1.3 + rose.seed) * 0.025;

    bCtx.save();
    bCtx.translate(rx, ry);
    bCtx.rotate(baseSwayRot);

    // 4A. Draw Base Shadow & Green Leaves
    bCtx.drawImage(
      rose.sprite.baseCanvas,
      -drawSize * 0.5,
      -drawSize * 0.5,
      drawSize,
      drawSize
    );

    // 4B. Draw each of the 4 Concentric Floret Dome Shells with staggered unfurling
    const whorlDelays = [0.0, 0.12, 0.24, 0.34];
    const closedScales = [0.44, 0.36, 0.28, 0.38];
    const overBloomBoost = [0.32, 0.24, 0.16, 0.10];
    const twistAngles = [0.52, -0.78, 1.05, -1.35];

    for (let wIdx = 0; wIdx < 4; wIdx++) {
      const wCanvas = rose.sprite.whorlCanvases[wIdx];
      const rawOpen = (rose.bloom - whorlDelays[wIdx]) / (1 - whorlDelays[wIdx]);
      const clampedOpen = Math.max(0, Math.min(1, rawOpen));
      const overOpen = Math.max(0, rose.bloom - 1.0);

      const easeOpen = 1 - Math.pow(1 - clampedOpen, 3);
      const whorlScale = closedScales[wIdx]
        + (1.0 - closedScales[wIdx]) * easeOpen
        + overOpen * overBloomBoost[wIdx];

      const unrollRot = (1 - easeOpen) * twistAngles[wIdx] * rose.spinDir
        + overOpen * (wIdx % 2 === 0 ? 0.22 : -0.20) * rose.spinDir;

      const shiftFactor = (easeOpen - 0.5) * 2 * overOpen * 4.5 * baseScale;

      bCtx.save();
      bCtx.translate(rose.tiltX * shiftFactor, rose.tiltY * shiftFactor);
      bCtx.rotate(unrollRot);
      bCtx.scale(whorlScale, whorlScale);
      bCtx.drawImage(
        wCanvas,
        -drawSize * 0.5,
        -drawSize * 0.5,
        drawSize,
        drawSize
      );
      bCtx.restore();
    }

    // 4C. Luminous Subsurface Bloom Glow when the hydrangea surges open ("Nở rộ rực rỡ")
    const activeGlow = Math.max(rose.flareGlow, Math.max(0, (rose.bloom - 1.05) * 2.2));
    if (activeGlow > 0.03) {
      const glowR = rose.r * totalScale * 1.15;
      const sunGlow = bCtx.createRadialGradient(0, 0, glowR * 0.05, 0, 0, glowR);
      sunGlow.addColorStop(0, `rgba(240, 252, 255, ${Math.min(0.55, activeGlow * 0.52)})`);
      sunGlow.addColorStop(0.45, `rgba(140, 215, 230, ${Math.min(0.35, activeGlow * 0.34)})`);
      sunGlow.addColorStop(1, 'rgba(140, 215, 230, 0)');
      bCtx.save();
      bCtx.globalCompositeOperation = 'screen';
      bCtx.fillStyle = sunGlow;
      bCtx.beginPath();
      bCtx.arc(0, 0, glowR, 0, Math.PI * 2);
      bCtx.fill();
      bCtx.restore();
    }

    bCtx.restore();
  });

  // 5. Foreground Cascading Leaves & Airy Gypsophila Tucked Between Hydrangeas
  FOLIAGE_LAYOUT.filter(f => f.layer === 'front').forEach((leaf, idx) => {
    const leafSway = Math.sin(time * 1.8 + idx * 2) * 0.03;
    drawBotanicalLeaf(
      bCtx,
      leaf.x * baseScale,
      leaf.y * baseScale,
      leaf.angle + leafSway,
      leaf.len * baseScale,
      leaf.w * baseScale,
      leaf.type
    );
  });

  babySprites.filter(b => b.layer === 'front').forEach((b, idx) => {
    const bSway = Math.sin(time * 1.6 + idx) * 0.035;
    bCtx.save();
    bCtx.translate(b.x * baseScale, b.y * baseScale);
    bCtx.rotate(b.angle + bSway);
    const drawSz = b.sprite.size * b.scale * baseScale;
    bCtx.drawImage(b.sprite.canvas, -drawSz * 0.5, -drawSz * 0.82, drawSz, drawSz);
    bCtx.restore();
  });

  // 6. Front Wrapping Paper Cone, Satin Ribbon Bow & Swinging Keepsake Tag
  drawWrappingPaperFrontAndRibbon(bCtx, 0, 0, baseScale, time);

  bCtx.restore();

  // Falling petals & bursts
  renderAmbientPetals(time);
  if (!reducedMotion) requestSceneRender();
}

function announceRose(rose) {
  document.dispatchEvent(new CustomEvent('bouquet:rose', { detail: { message: rose.whisper } }));
}

function setupInteractions() {
  bouquetWrapper.addEventListener('pointermove', event => {
    if (reducedMotion || event.pointerType === 'touch') return;
    const rect = bouquetCanvas.getBoundingClientRect();
    pointerX = (event.clientX - rect.left) * stageW / rect.width;
    pointerY = (event.clientY - rect.top) * stageH / rect.height;
    parallaxTargetX = (pointerX / stageW - 0.5) * 2;
    parallaxTargetY = (pointerY / stageH - 0.5) * 2;
  });
  bouquetWrapper.addEventListener('pointerleave', () => {
    pointerX = pointerY = -9999;
    parallaxTargetX = parallaxTargetY = 0;
    roseNodes.forEach(rose => { rose.targetBloom = 1.04; });
  });
  bouquetWrapper.addEventListener('click', event => {
    const rect = bouquetCanvas.getBoundingClientRect();
    const x = (event.clientX - rect.left) * stageW / rect.width;
    const y = (event.clientY - rect.top) * stageH / rect.height;
    const baseScale = Math.min(stageW, stageH) / 650;
    let rose = [...roseNodes].reverse().find(node => Math.hypot(x - node.screenX, y - node.screenY) < node.hitRadius * 1.35);
    if (!rose) {
      let minDist = Infinity;
      roseNodes.forEach(node => {
        const d = Math.hypot(x - node.screenX, y - node.screenY);
        if (d < minDist) { minDist = d; rose = node; }
      });
      if (minDist > 180) rose = null;
    }
    if (rose) announceRose(rose);
    triggerBouquetBloomWave((x - stageW * 0.5) / baseScale, (y - stageH * 0.51) / baseScale, 'ripple');
    spawnPetalBurst(event.clientX, event.clientY, 10);
  });
  document.addEventListener('bouquet:replay', () => triggerBouquetBloomWave(0, -30, 'grand'));
  document.addEventListener('bouquet:celebrate', () => {
    triggerBouquetBloomWave(0, -30, 'grand');
    setTimeout(() => document.dispatchEvent(new Event('bouquet:ready')), reducedMotion ? 0 : 1900);
    const rect = bouquetCanvas.getBoundingClientRect();
    spawnPetalBurst(rect.left + stageW * 0.5, rect.top + stageH * 0.5, 20);
  });
}

window.addEventListener('load', () => {
  initBotanicalAssets();
  resizeCanvases();
  initAmbientPetals();
  setupInteractions();
  const isUnlocked = sessionStorage.getItem('gift_unlocked') === 'true';
  if (isUnlocked) {
    triggerBouquetBloomWave(0, -30, 'grand');
    setTimeout(() => document.dispatchEvent(new Event('bouquet:ready')), reducedMotion ? 0 : 1900);
  }
  new ResizeObserver(resizeCanvases).observe(bouquetWrapper);
  window.addEventListener('resize', resizeCanvases);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(sceneAnimationFrame);
      sceneAnimationFrame = null;
      settleBouquet();
    } else {
      nextAutoShowcaseTime = performance.now() + 11000;
      if (!fallingPetals.length) initAmbientPetals();
      requestSceneRender();
    }
  });
  motionPreference.addEventListener('change', event => {
    reducedMotion = event.matches;
    settleBouquet();
    initAmbientPetals();
    requestSceneRender();
  });
  requestSceneRender();
});

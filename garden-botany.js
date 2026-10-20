// Botanical drawing primitives from script.js, used by the garden scene.
// Hydrangea (hoa cẩm tú cầu) geometry, floret shading and leaf veins consistent with index.html.
(() => {
'use strict';

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
 * Artisanal luxury florist hydrangea color palettes (Xanh dương, Xanh ngọc, Trắng, Hồng pastel)
 */
const HYDRANGEA_PALETTES = {
  skyBlue: {
    deepCore: '#1B3F73',
    innerShadow: '#3568A8',
    midBelly: '#689DE0',
    outerBlush: '#B2D2F7',
    lipHighlight: '#EDF5FF',
    stamen: '#DCEBFC',
    creviceShadow: 'rgba(20, 45, 80, 0.28)',
    shadowTone: '#233F60'
  },
  tealJade: {
    deepCore: '#13534E',
    innerShadow: '#227E77',
    midBelly: '#4EBAAF',
    outerBlush: '#9FE2D9',
    lipHighlight: '#EDFAF8',
    stamen: '#D8F5F0',
    creviceShadow: 'rgba(15, 65, 60, 0.26)',
    shadowTone: '#1F4743'
  },
  pureWhite: {
    deepCore: '#5B7268',
    innerShadow: '#8CA598',
    midBelly: '#D4E0D9',
    outerBlush: '#F0F6F2',
    lipHighlight: '#FFFFFF',
    stamen: '#E2EBE5',
    creviceShadow: 'rgba(45, 60, 52, 0.20)',
    shadowTone: '#43574E'
  },
  pastelPink: {
    deepCore: '#A83B5E',
    innerShadow: '#CF5C82',
    midBelly: '#F392B0',
    outerBlush: '#FCD8E4',
    lipHighlight: '#FFF5F8',
    stamen: '#FDE4ED',
    creviceShadow: 'rgba(110, 30, 55, 0.25)',
    shadowTone: '#5E2837'
  }
};

const ROSE_PALETTES = {
  sweetBlush: {
    deepCore: '#B8335A',
    innerShadow: '#DC5B80',
    midBelly: '#F49AB3',
    outerBlush: '#FCD5E0',
    lipHighlight: '#FFF6F8',
    creviceShadow: 'rgba(122, 28, 56, 0.28)'
  },
  pastelPink: {
    deepCore: '#C44569',
    innerShadow: '#E37393',
    midBelly: '#F8B1C5',
    outerBlush: '#FDE4EC',
    lipHighlight: '#FFF9FB',
    creviceShadow: 'rgba(135, 38, 66, 0.25)'
  },
  creamPeach: {
    deepCore: '#C85A52',
    innerShadow: '#E5857B',
    midBelly: '#F7BBA9',
    outerBlush: '#FDE9DF',
    lipHighlight: '#FFFDFB',
    creviceShadow: 'rgba(138, 52, 45, 0.24)'
  },
  pearlVintage: {
    deepCore: '#9E3B56',
    innerShadow: '#C7637D',
    midBelly: '#E8A3B5',
    outerBlush: '#F9DCE4',
    lipHighlight: '#FFF8FA',
    creviceShadow: 'rgba(105, 30, 52, 0.26)'
  },
  berryRomance: {
    deepCore: '#8E1E42',
    innerShadow: '#BA3860',
    midBelly: '#E27496',
    outerBlush: '#F8BDCE',
    lipHighlight: '#FFF0F5',
    creviceShadow: 'rgba(92, 16, 40, 0.32)'
  },
  paleGreen: {
    deepCore: '#6B9062',
    innerShadow: '#99B984',
    midBelly: '#C9DFB8',
    outerBlush: '#E9F4DF',
    lipHighlight: '#FBFFF6',
    creviceShadow: 'rgba(58, 89, 49, 0.24)',
    shadowTone: '#344A31'
  },
  skyBlue: {
    deepCore: '#416EAA',
    innerShadow: '#729FD0',
    midBelly: '#B3D3EF',
    outerBlush: '#DFEEFB',
    lipHighlight: '#F8FCFF',
    creviceShadow: 'rgba(42, 76, 119, 0.25)',
    shadowTone: '#314867'
  },
  pearlWhite: {
    deepCore: '#889D9F',
    innerShadow: '#BECDCC',
    midBelly: '#E5EDE9',
    outerBlush: '#F6FAF4',
    lipHighlight: '#FFFFFF',
    creviceShadow: 'rgba(73, 95, 96, 0.2)',
    shadowTone: '#43595B'
  }
};

/**
 * Dựng cụm hoa Cẩm tú cầu (Hydrangea) dạng đầu tròn thành 5 lớp canvas phục vụ hiệu ứng nở
 */
function createHydrangeaSprite(config) {
  const {
    radius = 68,
    paletteKey = 'skyBlue',
    density = 'dense',
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

  const baseLayer = createLayerCanvas();
  const whorlLayers = [
    createLayerCanvas(),
    createLayerCanvas(),
    createLayerCanvas(),
    createLayerCanvas()
  ];

  const cx = logicalSize / 2;
  const cy = logicalSize / 2;
  const rand = createSeededRandom(seed);
  const pal = ROSE_PALETTES[paletteKey] || HYDRANGEA_PALETTES.skyBlue;

  // Base shadow
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

  // Green leaves peeking out around base
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

  function drawFloret(ctx, fx, fy, fRadius, baseRot) {
    ctx.save();
    ctx.translate(fx, fy);
    ctx.rotate(baseRot);

    ctx.shadowColor = pal.creviceShadow;
    ctx.shadowBlur = Math.max(2, fRadius * 0.28);
    ctx.shadowOffsetX = Math.cos(baseRot) * 1.0;
    ctx.shadowOffsetY = Math.sin(baseRot) * 1.0 + 1.2;

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

      const pGrad = ctx.createRadialGradient(0, -pLen * 0.15, 0, 0, -pLen * 0.55, pLen * 0.96);
      pGrad.addColorStop(0, pal.innerShadow);
      pGrad.addColorStop(0.38, pal.midBelly);
      pGrad.addColorStop(0.82, pal.outerBlush);
      pGrad.addColorStop(1, pal.lipHighlight);
      ctx.fillStyle = pGrad;
      ctx.fill();

      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(0, -pLen * 0.5, 0, -pLen * 0.82);
      ctx.strokeStyle = rgbaStr(pal.innerShadow, 0.35);
      ctx.lineWidth = 0.7;
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(pWidth * 0.3, -pLen * 0.42);
      ctx.bezierCurveTo(pWidth * 0.54, -pLen * 0.76, 0, -pLen * 1.02, 0, -pLen);
      ctx.bezierCurveTo(0, -pLen * 1.02, -pWidth * 0.54, -pLen * 0.76, -pWidth * 0.3, -pLen * 0.42);
      ctx.strokeStyle = rgbaStr(pal.lipHighlight, 0.75);
      ctx.lineWidth = 0.8;
      ctx.stroke();

      ctx.restore();
    }

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

/**
 * Dựng hoa hồng thực tế botanical chất lượng cao với 4 tầng cánh xoắn ốc Fibonacci
 */
function createRealisticRoseSprite(config) {
  const {
    radius = 68,
    paletteKey = 'sweetBlush',
    variety = 'garden', // 'garden' | 'classic' | 'peony' | 'bud'
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

  // Layer 0: Base shadow & green calyx sepals
  const baseLayer = createLayerCanvas();
  // 4 Concentric Whorl Layers: [0: Outer Guard, 1: Mid-Outer, 2: Inner Velvet, 3: Heart Spiral]
  const whorlLayers = [
    createLayerCanvas(),
    createLayerCanvas(),
    createLayerCanvas(),
    createLayerCanvas()
  ];

  const cx = logicalSize / 2;
  const cy = logicalSize / 2;
  const rand = createSeededRandom(seed);
  const pal = ROSE_PALETTES[paletteKey] || ROSE_PALETTES.sweetBlush;

  // 1. Soft Ambient Occlusion Base Shadow & Sepals on baseLayer
  const bCtx0 = baseLayer.ctx;
  bCtx0.save();
  const baseShadow = bCtx0.createRadialGradient(
    cx + tiltX * 4, cy + radius * 0.14 + tiltY * 4, radius * 0.18,
    cx, cy + radius * 0.1, radius * 1.32
  );
  const shadowTone = pal.shadowTone || '#3E1220';
  baseShadow.addColorStop(0, rgbaStr(shadowTone, 0.36));
  baseShadow.addColorStop(0.65, rgbaStr(shadowTone, 0.13));
  baseShadow.addColorStop(1, rgbaStr(shadowTone, 0));
  bCtx0.fillStyle = baseShadow;
  bCtx0.beginPath();
  bCtx0.arc(cx, cy + radius * 0.1, radius * 1.32, 0, Math.PI * 2);
  bCtx0.fill();
  bCtx0.restore();

  // Green calyx sepals peeking out (visible especially when rose is in bud state or tilted)
  const sepalCount = variety === 'bud' ? 5 : 4;
  for (let s = 0; s < sepalCount; s++) {
    const sAngle = Math.atan2(tiltY, tiltX) + (s / sepalCount) * Math.PI * 2 + (rand() - 0.5) * 0.35;
    const sLen = radius * (variety === 'bud' ? 1.16 : 1.04);
    bCtx0.save();
    bCtx0.translate(cx, cy);
    bCtx0.rotate(sAngle);
    bCtx0.beginPath();
    bCtx0.moveTo(0, -radius * 0.14);
    bCtx0.quadraticCurveTo(sLen * 0.55, -radius * 0.26, sLen, -radius * 0.02);
    bCtx0.quadraticCurveTo(sLen * 0.55, radius * 0.22, 0, radius * 0.14);
    bCtx0.closePath();
    const sepGrad = bCtx0.createLinearGradient(0, 0, sLen, 0);
    sepGrad.addColorStop(0, '#36563E');
    sepGrad.addColorStop(0.7, '#52785A');
    sepGrad.addColorStop(1, '#789E7D');
    bCtx0.fillStyle = sepGrad;
    bCtx0.fill();
    bCtx0.restore();
  }

  /**
   * Helper: Draws one tangential cupped rose petal onto a target layer context
   */
  function drawCuppedPetal(ctx, opts) {
    const {
      pCenterX,
      pCenterY,
      angle,          // polar angle around rose core
      dist,           // radial distance of petal outer lip
      innerDist,      // radial distance of petal base attachment
      arcSpan,        // angular width in radians (roses have wide wrapping petals!)
      ruffleAmp,      // wave amplitude along outer edge
      reflexPoint,    // subtle pointed curl in center of lip
      layerNorm       // 1.0 = outermost guard petal, 0.0 = innermost tight scroll
    } = opts;

    const aStart = angle - arcSpan * 0.5;
    const aEnd = angle + arcSpan * 0.5;
    const aMid = angle;

    // Key control points in polar coordinates around (pCenterX, pCenterY)
    const baseLeftX = pCenterX + Math.cos(aStart + 0.18) * innerDist;
    const baseLeftY = pCenterY + Math.sin(aStart + 0.18) * innerDist;

    const baseRightX = pCenterX + Math.cos(aEnd - 0.18) * innerDist;
    const baseRightY = pCenterY + Math.sin(aEnd - 0.18) * innerDist;

    const shoulderLeftAngle = angle - arcSpan * 0.36;
    const shoulderRightAngle = angle + arcSpan * 0.36;
    const shoulderLeftR = dist * (0.92 + (rand() - 0.5) * ruffleAmp);
    const shoulderRightR = dist * (0.92 + (rand() - 0.5) * ruffleAmp);

    const sLeftX = pCenterX + Math.cos(shoulderLeftAngle) * shoulderLeftR;
    const sLeftY = pCenterY + Math.sin(shoulderLeftAngle) * shoulderLeftR;

    const sRightX = pCenterX + Math.cos(shoulderRightAngle) * shoulderRightR;
    const sRightY = pCenterY + Math.sin(shoulderRightAngle) * shoulderRightR;

    const tipR = dist * (1.0 + reflexPoint + (rand() - 0.5) * ruffleAmp * 0.7);
    const tipX = pCenterX + Math.cos(aMid) * tipR;
    const tipY = pCenterY + Math.sin(aMid) * tipR;

    // Intermediate ruffle lobes between shoulder and tip
    const lobeLeftAngle = angle - arcSpan * 0.17;
    const lobeRightAngle = angle + arcSpan * 0.17;
    const lobeLeftR = dist * (0.98 + (rand() - 0.4) * ruffleAmp);
    const lobeRightR = dist * (0.98 + (rand() - 0.4) * ruffleAmp);

    const lLeftX = pCenterX + Math.cos(lobeLeftAngle) * lobeLeftR;
    const lLeftY = pCenterY + Math.sin(lobeLeftAngle) * lobeLeftR;

    const lRightX = pCenterX + Math.cos(lobeRightAngle) * lobeRightR;
    const lRightY = pCenterY + Math.sin(lobeRightAngle) * lobeRightR;

    ctx.save();

    // Construct organic ruffled petal silhouette
    ctx.beginPath();
    ctx.moveTo(baseLeftX, baseLeftY);

    // Left side curve sweeping out to left shoulder
    const ctrlOutLeftAngle = aStart - 0.04;
    const ctrlOutLeftR = (innerDist + shoulderLeftR) * 0.56;
    ctx.quadraticCurveTo(
      pCenterX + Math.cos(ctrlOutLeftAngle) * ctrlOutLeftR,
      pCenterY + Math.sin(ctrlOutLeftAngle) * ctrlOutLeftR,
      sLeftX, sLeftY
    );

    // Ruffled outer lip from left shoulder -> left lobe -> center tip -> right lobe -> right shoulder
    ctx.bezierCurveTo(
      (sLeftX + lLeftX) * 0.5 + Math.cos(lobeLeftAngle) * 3,
      (sLeftY + lLeftY) * 0.5 + Math.sin(lobeLeftAngle) * 3,
      lLeftX, lLeftY,
      tipX, tipY
    );

    ctx.bezierCurveTo(
      lRightX, lRightY,
      (sRightX + lRightX) * 0.5 + Math.cos(lobeRightAngle) * 3,
      (sRightY + lRightY) * 0.5 + Math.sin(lobeRightAngle) * 3,
      sRightX, sRightY
    );

    // Right side curve sweeping back to right base
    const ctrlOutRightAngle = aEnd + 0.04;
    const ctrlOutRightR = (innerDist + shoulderRightR) * 0.56;
    ctx.quadraticCurveTo(
      pCenterX + Math.cos(ctrlOutRightAngle) * ctrlOutRightR,
      pCenterY + Math.sin(ctrlOutRightAngle) * ctrlOutRightR,
      baseRightX, baseRightY
    );

    // Inner base curve
    ctx.quadraticCurveTo(pCenterX, pCenterY, baseLeftX, baseLeftY);
    ctx.closePath();

    // Ambient occlusion drop shadow cast by this petal onto outer petals
    ctx.shadowColor = pal.creviceShadow;
    ctx.shadowBlur = Math.max(3, dist * 0.16);
    ctx.shadowOffsetX = Math.cos(aMid) * 1.5;
    ctx.shadowOffsetY = Math.sin(aMid) * 1.5 + 1.5;

    // Subsurface scattering radial gradient across the petal belly
    const grad = ctx.createRadialGradient(
      pCenterX, pCenterY, innerDist * 0.5,
      pCenterX + Math.cos(aMid) * (dist * 0.12),
      pCenterY + Math.sin(aMid) * (dist * 0.12),
      dist * 1.06
    );

    if (layerNorm > 0.68) {
      grad.addColorStop(0, pal.innerShadow);
      grad.addColorStop(0.42, pal.midBelly);
      grad.addColorStop(0.84, pal.outerBlush);
      grad.addColorStop(1, pal.lipHighlight);
    } else if (layerNorm > 0.34) {
      grad.addColorStop(0, pal.deepCore);
      grad.addColorStop(0.38, pal.innerShadow);
      grad.addColorStop(0.78, pal.midBelly);
      grad.addColorStop(0.95, pal.outerBlush);
      grad.addColorStop(1, pal.lipHighlight);
    } else {
      grad.addColorStop(0, pal.deepCore);
      grad.addColorStop(0.52, pal.innerShadow);
      grad.addColorStop(0.86, pal.midBelly);
      grad.addColorStop(1, pal.lipHighlight);
    }

    ctx.fillStyle = grad;
    ctx.fill();

    // Reset shadow before drawing rolled lip highlight
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;

    // Subtle silky petal edge highlight (simulating rolled petal thickness catching light)
    ctx.beginPath();
    ctx.moveTo(sLeftX, sLeftY);
    ctx.bezierCurveTo(
      (sLeftX + lLeftX) * 0.5,
      (sLeftY + lLeftY) * 0.5,
      lLeftX, lLeftY,
      tipX, tipY
    );
    ctx.bezierCurveTo(
      lRightX, lRightY,
      (sRightX + lRightX) * 0.5,
      (sRightY + lRightY) * 0.5,
      sRightX, sRightY
    );
    ctx.strokeStyle = rgbaStr(pal.lipHighlight, layerNorm < 0.4 ? 0.82 : 0.65);
    ctx.lineWidth = layerNorm < 0.35 ? 1.4 : 1.1;
    ctx.lineCap = 'round';
    ctx.stroke();

    ctx.restore();
  }

  // 2. Sculpt concentric & spiral whorls distributed across whorlLayers[0..2]
  const totalWhorls = variety === 'bud' ? 7 : (variety === 'peony' ? 10 : 9);
  const heartShiftX = tiltX * radius * 0.26;
  const heartShiftY = tiltY * radius * 0.26;

  for (let w = 0; w < totalWhorls; w++) {
    const layerNorm = 1 - w / (totalWhorls - 1); // 1.0 (outer) -> 0.0 (innermost)
    const easeR = Math.pow(layerNorm, 0.82);

    // Route this whorl to one of the 3 outer/mid/inner layer canvases
    let targetWhorlIdx = 0;
    if (layerNorm <= 0.36) targetWhorlIdx = 2;
    else if (layerNorm <= 0.68) targetWhorlIdx = 1;
    const wCtx = whorlLayers[targetWhorlIdx].ctx;

    // Perspective shift increases toward the center of the rose
    const whorlCx = cx + heartShiftX * (1 - layerNorm);
    const whorlCy = cy + heartShiftY * (1 - layerNorm);

    let petalCount = 6;
    if (layerNorm > 0.75) petalCount = 6;
    else if (layerNorm > 0.4) petalCount = variety === 'peony' ? 7 : 6;
    else petalCount = 5;

    const whorlBaseAngle = w * 0.68 + rand() * 0.25;

    // Warm inner-cup glow on the mid-inner transition
    if (w === 3) {
      const cupGlow = wCtx.createRadialGradient(
        whorlCx, whorlCy, radius * 0.05,
        whorlCx, whorlCy, radius * 0.72
      );
      cupGlow.addColorStop(0, rgbaStr(pal.deepCore, 0.58));
      cupGlow.addColorStop(0.55, rgbaStr(pal.innerShadow, 0.26));
      cupGlow.addColorStop(1, rgbaStr(pal.midBelly, 0));
      wCtx.fillStyle = cupGlow;
      wCtx.beginPath();
      wCtx.arc(whorlCx, whorlCy, radius * 0.72, 0, Math.PI * 2);
      wCtx.fill();
    }

    for (let p = 0; p < petalCount; p++) {
      const pAngle = whorlBaseAngle + (p / petalCount) * Math.PI * 2 + (rand() - 0.5) * 0.18;
      const pDist = radius * (0.16 + 0.84 * easeR) * (0.94 + rand() * 0.1);
      const pInnerDist = Math.max(2, pDist * (layerNorm > 0.5 ? 0.32 : 0.22));

      const arcSpan = layerNorm > 0.7
        ? (1.32 + rand() * 0.22)
        : (layerNorm > 0.35 ? (1.48 + rand() * 0.25) : (1.65 + rand() * 0.3));

      const ruffleAmp = variety === 'peony' ? 0.11 : 0.075;
      const reflexPoint = (variety === 'classic' && layerNorm > 0.45) ? 0.065 : 0.025;

      drawCuppedPetal(wCtx, {
        pCenterX: whorlCx,
        pCenterY: whorlCy,
        angle: pAngle,
        dist: pDist,
        innerDist: pInnerDist,
        arcSpan,
        ruffleAmp,
        reflexPoint,
        layerNorm
      });
    }
  }

  // 3. Sculpt the tightly furled Center Spiral Bullion onto whorlLayers[3]
  const coreCtx = whorlLayers[3].ctx;
  const coreCx = cx + heartShiftX;
  const coreCy = cy + heartShiftY;

  const scrollCount = variety === 'bud' ? 5 : 7;
  for (let c = 0; c < scrollCount; c++) {
    const cAngle = c * 2.39996 + rand() * 0.2;
    const cRadius = radius * (0.22 * (1 - c / (scrollCount + 1.5)));
    const span = 1.9 + (c / scrollCount) * 0.5;

    coreCtx.save();
    coreCtx.beginPath();
    const a1 = cAngle - span * 0.5;
    const a2 = cAngle + span * 0.5;
    coreCtx.arc(coreCx, coreCy, cRadius, a1, a2);
    coreCtx.quadraticCurveTo(
      coreCx + Math.cos(cAngle + 0.4) * cRadius * 0.3,
      coreCy + Math.sin(cAngle + 0.4) * cRadius * 0.3,
      coreCx + Math.cos(a1) * cRadius,
      coreCy + Math.sin(a1) * cRadius
    );
    coreCtx.closePath();

    const cGrad = coreCtx.createRadialGradient(
      coreCx, coreCy, 1,
      coreCx, coreCy, cRadius * 1.15
    );
    cGrad.addColorStop(0, pal.deepCore);
    cGrad.addColorStop(0.65, pal.innerShadow);
    cGrad.addColorStop(1, pal.lipHighlight);
    coreCtx.fillStyle = cGrad;
    coreCtx.fill();

    coreCtx.beginPath();
    coreCtx.arc(coreCx, coreCy, cRadius, a1 + 0.15, a2 - 0.15);
    coreCtx.strokeStyle = rgbaStr(pal.lipHighlight, 0.85);
    coreCtx.lineWidth = 1.25;
    coreCtx.stroke();
    coreCtx.restore();
  }

  // 4. Optional Crystal Dewdrop (Giọt sương mai) on outer petal layer
  if (hasDewdrop) {
    const dewCtx = whorlLayers[0].ctx;
    const dewAngle = rand() * Math.PI * 2;
    const dewDist = radius * (0.52 + rand() * 0.25);
    const dx = cx + Math.cos(dewAngle) * dewDist;
    const dy = cy + Math.sin(dewAngle) * dewDist;
    const dr = 3.4 + rand() * 2.0;

    dewCtx.save();
    dewCtx.fillStyle = 'rgba(110, 25, 50, 0.28)';
    dewCtx.beginPath();
    dewCtx.ellipse(dx + 1, dy + 1.6, dr, dr * 0.82, 0.2, 0, Math.PI * 2);
    dewCtx.fill();

    const dewGrad = dewCtx.createRadialGradient(dx - dr * 0.3, dy - dr * 0.3, 0.5, dx, dy, dr);
    dewGrad.addColorStop(0, 'rgba(255, 255, 255, 0.96)');
    dewGrad.addColorStop(0.45, 'rgba(255, 235, 242, 0.55)');
    dewGrad.addColorStop(0.85, 'rgba(245, 180, 200, 0.35)');
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

/**
 * Vẽ lá cây tự nhiên (lá cẩm tú cầu bản rộng hoặc lá khuynh diệp) kèm cuống và gân lá
 */
function drawBotanicalLeaf(ctx, x, y, angle, length, width, type = 'hydrangeaLeaf') {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);

  ctx.shadowColor = 'rgba(25, 40, 32, 0.22)';
  ctx.shadowBlur = 10;
  ctx.shadowOffsetY = 4;

  ctx.beginPath();
  ctx.moveTo(0, 0);
  if (type === 'eucalyptus') {
    ctx.bezierCurveTo(length * 0.28, -width, length * 0.72, -width * 0.85, length, 0);
    ctx.bezierCurveTo(length * 0.72, width * 0.85, length * 0.28, width, 0, 0);
  } else {
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
 * Dựng búp nụ hoa hồng e ấp với các lá đài xanh bao bọc
 */
function createRoseBudSprite({ radius = 28, paletteKey = 'sweetBlush' } = {}) {
  const palette = ROSE_PALETTES[paletteKey] || ROSE_PALETTES.sweetBlush;
  const logicalSize = radius * 5;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = Math.ceil(logicalSize * dpr);
  const c = canvas.getContext('2d');
  c.scale(dpr, dpr);
  c.translate(logicalSize / 2, logicalSize / 2);
  c.scale(radius, radius);

  // A cupped silhouette, narrower at the tip and where the sepals meet the stalk.
  const belly = c.createLinearGradient(-.65, -1.3, .75, -.6);
  belly.addColorStop(0, palette.outerBlush);
  belly.addColorStop(.3, palette.midBelly);
  belly.addColorStop(.72, palette.innerShadow);
  belly.addColorStop(1, palette.deepCore);
  c.fillStyle = belly;
  c.shadowColor = palette.creviceShadow; c.shadowBlur = radius * .16;
  c.shadowOffsetX = 1; c.shadowOffsetY = 2;
  c.beginPath(); c.moveTo(0, .05);
  c.bezierCurveTo(-.8, -.1, -.87, -1.23, -.32, -1.8);
  c.quadraticCurveTo(-.1, -1.95, .08, -2.04);
  c.bezierCurveTo(.15, -1.83, .69, -1.6, .7, -.95);
  c.bezierCurveTo(.73, -.35, .44, .02, 0, .05);
  c.fill();
  c.shadowColor = 'transparent';

  // One petal rolls across the front, revealing a thin lit edge and a shaded seam.
  const fold = c.createLinearGradient(-.65, -1.2, .4, -.7);
  fold.addColorStop(0, palette.lipHighlight);
  fold.addColorStop(.22, palette.outerBlush);
  fold.addColorStop(.7, palette.midBelly);
  fold.addColorStop(1, palette.innerShadow);
  c.fillStyle = fold;
  c.beginPath(); c.moveTo(-.28, -1.8);
  c.bezierCurveTo(-.08, -1.34, .35, -1.17, .38, -.65);
  c.bezierCurveTo(.42, -.27, .18, -.03, 0, .05);
  c.bezierCurveTo(-.72, -.12, -.78, -1.14, -.28, -1.8);
  c.fill();
  c.beginPath(); c.moveTo(-.27, -1.77);
  c.bezierCurveTo(-.05, -1.34, .33, -1.13, .36, -.66);
  c.strokeStyle = rgbaStr(palette.lipHighlight, .85); c.lineWidth = .035; c.stroke();
  c.beginPath(); c.moveTo(.12, -1.91);
  c.bezierCurveTo(.03, -1.52, .47, -1.3, .51, -1.01);
  c.strokeStyle = rgbaStr(palette.deepCore, .48); c.lineWidth = .025; c.stroke();

  const green = c.createLinearGradient(-.55, -.5, .45, .2);
  green.addColorStop(0, '#91AF76'); green.addColorStop(.45, '#60804D'); green.addColorStop(1, '#365C3E');
  c.fillStyle = green;
  // Pointed sepals hug the closed flower rather than radiating around an open face.
  [
    [0, .12, -.48, -.23, -.65, -1.03, -.25, -.55, .03, -.12],
    [0, .12, .5, -.15, .69, -.96, .2, -.53, -.03, -.1],
    [-.12, .1, -.25, -.15, -.12, -.65, .2, -.27, .12, .1]
  ].forEach(([x, y, x1, y1, tipX, tipY, x2, y2, endX, endY]) => {
    c.beginPath(); c.moveTo(x, y);
    c.quadraticCurveTo(x1, y1, tipX, tipY);
    c.quadraticCurveTo(x2, y2, endX, endY); c.closePath(); c.fill();
  });
  c.beginPath(); c.ellipse(0, .05, .18, .22, 0, 0, Math.PI * 2); c.fill();
  return { canvas, logicalSize, radius };
}

/**
 * Dựng Hoa Bỉ Ngạn (Lycoris radiata / Red Spider Lily) màu đỏ rực rỡ
 * Cánh hoa uốn lượn gợn sóng, chùm nhị hoa vươn cao cong vút kiêu sa và bao phấn óng ánh
 * Phân chia thành 5 lớp canvas đệm hỗ trợ hoạt ảnh bung nở và chiều sâu hội họa
 */
function createSpiderLilySprite(config = {}) {
  const {
    radius = 86,
    seed = 2010,
    hasDewdrop = true
  } = config;

  const dpr = Math.min(window.devicePixelRatio || 2, 2.2);
  const pad = radius * 1.05;
  const logicalSize = Math.ceil((radius + pad) * 2);

  function createLayerCanvas() {
    const c = document.createElement('canvas');
    c.width = Math.ceil(logicalSize * dpr);
    c.height = Math.ceil(logicalSize * dpr);
    const lCtx = c.getContext('2d');
    lCtx.scale(dpr, dpr);
    return { canvas: c, ctx: lCtx };
  }

  const baseLayer = createLayerCanvas();
  const whorlLayers = [
    createLayerCanvas(), // Layer 0: Rear & outer lateral reflexed petals
    createLayerCanvas(), // Layer 1: Middle wavy reflexed petals
    createLayerCanvas(), // Layer 2: Inner front reflexed petals + floret throats
    createLayerCanvas()  // Layer 3: Crown of majestic arching filaments & golden anthers
  ];

  const cx = logicalSize / 2;
  const cy = logicalSize * 0.54;
  const rand = createSeededRandom(seed);

  const pal = {
    deepCore: '#46000C',        // Họng hoa sâu thẳm
    innerWine: '#78081E',       // Đỏ thẫm nhung
    rubyRed: '#C41230',         // Đỏ ruby rực rỡ
    scarlet: '#E61C3D',         // Đỏ son tươi
    coralGlow: '#FF4D6D',       // Đỏ san hô sáng
    rimHighlight: '#FFA4B4',    // Ánh lụa viền cánh
    stamenDark: '#8C0820',      // Chân nhị
    stamenBright: '#FF2A4D',    // Thân nhị
    stamenTip: '#FF6B8B',       // Ngọn nhị
    antherGold: '#F59E0B',      // Bao phấn vàng hổ phách
    antherBright: '#FEF08A',    // Phấn hoa vàng tươi
    pedicelGreen: '#3D5C3E',    // Cuống hoa xanh rêu
    pedicelWine: '#6B1724',     // Cuống hoa tía
    spatheBract: '#8A1C2C',     // Lá bắc đỏ thẫm
    ambientGlow: 'rgba(230, 28, 61, 0.18)'
  };

  // 1. BASE LAYER: Soft crimson halo, Receptacle, Pedicels, and Bracts
  const bCtx = baseLayer.ctx;
  bCtx.save();

  // Subtle crimson bloom glow
  const halo = bCtx.createRadialGradient(cx, cy - radius * 0.1, radius * 0.18, cx, cy, radius * 1.45);
  halo.addColorStop(0, pal.ambientGlow);
  halo.addColorStop(0.5, 'rgba(230, 28, 61, 0.06)');
  halo.addColorStop(1, 'rgba(230, 28, 61, 0)');
  bCtx.fillStyle = halo;
  bCtx.beginPath();
  bCtx.arc(cx, cy, radius * 1.45, 0, Math.PI * 2);
  bCtx.fill();

  // Receptacle knob
  const recepGrad = bCtx.createRadialGradient(cx, cy, 2, cx, cy, radius * 0.14);
  recepGrad.addColorStop(0, pal.pedicelWine);
  recepGrad.addColorStop(0.6, pal.pedicelGreen);
  recepGrad.addColorStop(1, '#274028');
  bCtx.fillStyle = recepGrad;
  bCtx.beginPath();
  bCtx.ellipse(cx, cy, radius * 0.12, radius * 0.08, 0, 0, Math.PI * 2);
  bCtx.fill();

  // Crimson spathe bracts
  for (let b = 0; b < 4; b++) {
    const bAngle = Math.PI * 0.5 + (b - 1.5) * 0.45;
    const bLen = radius * (0.28 + rand() * 0.12);
    bCtx.save();
    bCtx.translate(cx, cy);
    bCtx.rotate(bAngle);
    bCtx.beginPath();
    bCtx.moveTo(0, 0);
    bCtx.quadraticCurveTo(radius * 0.05, bLen * 0.5, 0, bLen);
    bCtx.quadraticCurveTo(-radius * 0.05, bLen * 0.5, 0, 0);
    bCtx.fillStyle = pal.spatheBract;
    bCtx.globalAlpha = 0.85;
    bCtx.fill();
    bCtx.restore();
  }

  // 6 radiating florets around the umbel
  const floretConfigs = [
    { angle: -Math.PI * 0.82, dist: radius * 0.32, layerIndex: 0 },
    { angle: -Math.PI * 0.50, dist: radius * 0.28, layerIndex: 0 },
    { angle: -Math.PI * 0.18, dist: radius * 0.32, layerIndex: 0 },
    { angle:  Math.PI * 0.15, dist: radius * 0.36, layerIndex: 1 },
    { angle:  Math.PI * 0.50, dist: radius * 0.30, layerIndex: 2 },
    { angle:  Math.PI * 0.85, dist: radius * 0.36, layerIndex: 1 }
  ];

  // Draw pedicels branching out from center
  floretConfigs.forEach(fc => {
    const fx = cx + Math.cos(fc.angle) * fc.dist;
    const fy = cy + Math.sin(fc.angle) * fc.dist * 0.78;
    bCtx.beginPath();
    bCtx.moveTo(cx, cy);
    const midX = cx + Math.cos(fc.angle) * fc.dist * 0.5;
    const midY = cy + Math.sin(fc.angle) * fc.dist * 0.45 - 2;
    bCtx.quadraticCurveTo(midX, midY, fx, fy);
    const pedGrad = bCtx.createLinearGradient(cx, cy, fx, fy);
    pedGrad.addColorStop(0, pal.pedicelGreen);
    pedGrad.addColorStop(0.6, pal.pedicelWine);
    pedGrad.addColorStop(1, pal.deepCore);
    bCtx.strokeStyle = pedGrad;
    bCtx.lineWidth = 2.4;
    bCtx.stroke();
  });
  bCtx.restore();

  // Helper: Draw an undulating, wavy reflexed Spider Lily Petal (Tepal)
  function drawWavyPetal(ctx, originX, originY, angle, length, width, curlDirection = 1, seedVal = 1) {
    const pRand = createSeededRandom(seedVal);
    ctx.save();
    ctx.translate(originX, originY);
    ctx.rotate(angle);

    ctx.shadowColor = 'rgba(40, 0, 8, 0.32)';
    ctx.shadowBlur = length * 0.14;
    ctx.shadowOffsetX = 1.2;
    ctx.shadowOffsetY = 1.8;

    const steps = 10;
    const spinePoints = [];
    const leftPoints = [];
    const rightPoints = [];

    for (let s = 0; s <= steps; s++) {
      const t = s / steps;
      const x = t * length;
      const arch = Math.sin(t * Math.PI) * (length * 0.16);
      const recurve = (t ** 2.2) * (length * 0.28) * curlDirection;
      const y = arch + recurve;
      spinePoints.push({ x, y });

      const wProfile = Math.sin(t * Math.PI * 0.95) * (t < 0.2 ? t * 4 : 1);
      const ripple = Math.sin(t * Math.PI * 5 + seedVal) * (width * 0.22);
      const currentWidth = Math.max(0.8, wProfile * width * 0.5);

      leftPoints.push({ x, y: y - currentWidth - ripple });
      rightPoints.push({ x, y: y + currentWidth + ripple });
    }

    ctx.beginPath();
    ctx.moveTo(0, 0);
    for (let i = 0; i <= steps; i++) {
      ctx.lineTo(leftPoints[i].x, leftPoints[i].y);
    }
    const tip = spinePoints[steps];
    ctx.lineTo(tip.x + 2, tip.y);
    for (let i = steps; i >= 0; i--) {
      ctx.lineTo(rightPoints[i].x, rightPoints[i].y);
    }
    ctx.closePath();

    const petalGrad = ctx.createLinearGradient(0, 0, length, 0);
    petalGrad.addColorStop(0, pal.deepCore);
    petalGrad.addColorStop(0.2, pal.innerWine);
    petalGrad.addColorStop(0.55, pal.rubyRed);
    petalGrad.addColorStop(0.85, pal.scarlet);
    petalGrad.addColorStop(1, pal.coralGlow);
    ctx.fillStyle = petalGrad;
    ctx.fill();

    ctx.shadowColor = 'transparent';

    // Central spine vein
    ctx.beginPath();
    ctx.moveTo(0, 0);
    for (let i = 1; i <= steps; i++) {
      ctx.lineTo(spinePoints[i].x, spinePoints[i].y);
    }
    ctx.strokeStyle = 'rgba(110, 5, 20, 0.48)';
    ctx.lineWidth = 1.1;
    ctx.stroke();

    // Silky crystalline rim highlight
    ctx.beginPath();
    for (let i = 2; i <= steps; i++) {
      ctx.lineTo(leftPoints[i].x, leftPoints[i].y);
    }
    ctx.strokeStyle = 'rgba(255, 175, 195, 0.72)';
    ctx.lineWidth = 0.85;
    ctx.stroke();

    // Dewdrops
    if (hasDewdrop && pRand() > 0.65) {
      const dropT = 0.5 + pRand() * 0.35;
      const dropIdx = Math.floor(dropT * steps);
      const pt = spinePoints[dropIdx];
      const dRad = 1.8 + pRand() * 1.5;
      ctx.save();
      ctx.translate(pt.x, pt.y);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.beginPath();
      ctx.arc(0, 0, dRad, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = 'rgba(255, 180, 200, 0.6)';
      ctx.beginPath();
      ctx.arc(dRad * 0.3, -dRad * 0.3, dRad * 0.45, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    ctx.restore();
  }

  // 2. PETALS DISTRIBUTION ACROSS FLORETS & LAYERS
  floretConfigs.forEach((fc, fIdx) => {
    const fx = cx + Math.cos(fc.angle) * fc.dist;
    const fy = cy + Math.sin(fc.angle) * fc.dist * 0.78;
    const layer = whorlLayers[fc.layerIndex].ctx;

    // Throat
    layer.save();
    const throatGrad = layer.createRadialGradient(fx, fy, 1, fx, fy, radius * 0.12);
    throatGrad.addColorStop(0, pal.deepCore);
    throatGrad.addColorStop(0.7, pal.innerWine);
    throatGrad.addColorStop(1, 'rgba(120, 8, 30, 0)');
    layer.fillStyle = throatGrad;
    layer.beginPath();
    layer.arc(fx, fy, radius * 0.12, 0, Math.PI * 2);
    layer.fill();
    layer.restore();

    const petalCount = 6;
    for (let p = 0; p < petalCount; p++) {
      const pOffset = (p - 2.5) * 0.34 + (rand() - 0.5) * 0.12;
      const pAngle = fc.angle + pOffset;
      const pLen = radius * (0.62 + rand() * 0.28);
      const pWidth = radius * (0.11 + rand() * 0.035);
      const curlDir = (p % 2 === 0 ? 1 : -1) * (0.8 + rand() * 0.4);

      let targetCtx = layer;
      if (Math.sin(pAngle) < -0.3) {
        targetCtx = whorlLayers[0].ctx;
      } else if (p === 2 || p === 3) {
        targetCtx = whorlLayers[2].ctx;
      }

      drawWavyPetal(targetCtx, fx, fy, pAngle, pLen, pWidth, curlDir, seed + fIdx * 31 + p * 13);
    }
  });

  // 3. LAYER 3: THE CROWNING FILAMENTS (NHỊ HOA) & GOLDEN ANTHERS (BAO PHẤN)
  const stCtx = whorlLayers[3].ctx;
  stCtx.save();

  floretConfigs.forEach((fc, fIdx) => {
    const fx = cx + Math.cos(fc.angle) * fc.dist;
    const fy = cy + Math.sin(fc.angle) * fc.dist * 0.78;

    const stamenCount = 6;
    for (let k = 0; k < stamenCount; k++) {
      const kRand = createSeededRandom(seed + fIdx * 67 + k * 19);
      const spread = (k - 2.5) * 0.22 + (kRand() - 0.5) * 0.1;
      const baseAngle = fc.angle + spread;

      const reachOut = radius * (0.68 + (k % 3) * 0.18 + kRand() * 0.15);
      const archHeight = radius * (0.95 + (k % 2) * 0.35 + kRand() * 0.2);

      const cp1x = fx + Math.cos(baseAngle) * reachOut * 0.55;
      const cp1y = fy + Math.sin(baseAngle) * reachOut * 0.45 + radius * 0.06;

      const cp2x = fx + Math.cos(baseAngle) * reachOut * 1.1;
      const cp2y = fy - archHeight * 0.55;

      const tipX = cp2x + Math.cos(baseAngle) * radius * 0.18 + (kRand() - 0.5) * 6;
      const tipY = fy - archHeight;

      stCtx.save();
      stCtx.beginPath();
      stCtx.moveTo(fx, fy);
      stCtx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, tipX, tipY);

      const stamenGrad = stCtx.createLinearGradient(fx, fy, tipX, tipY);
      stamenGrad.addColorStop(0, pal.stamenDark);
      stamenGrad.addColorStop(0.35, pal.rubyRed);
      stamenGrad.addColorStop(0.75, pal.stamenBright);
      stamenGrad.addColorStop(1, pal.stamenTip);

      stCtx.strokeStyle = stamenGrad;
      stCtx.lineWidth = 1.45;
      stCtx.lineCap = 'round';
      stCtx.shadowColor = 'rgba(230, 28, 61, 0.25)';
      stCtx.shadowBlur = 4;
      stCtx.stroke();
      stCtx.shadowColor = 'transparent';

      const tangent = Math.atan2(tipY - cp2y, tipX - cp2x);
      const antherAngle = tangent + Math.PI * 0.5 + (kRand() - 0.5) * 0.35;

      stCtx.translate(tipX, tipY);
      stCtx.rotate(antherAngle);

      const antherLen = radius * 0.082;
      const antherWid = radius * 0.038;

      const aGrad = stCtx.createLinearGradient(-antherLen * 0.5, 0, antherLen * 0.5, 0);
      aGrad.addColorStop(0, '#B45309');
      aGrad.addColorStop(0.3, pal.antherGold);
      aGrad.addColorStop(0.7, pal.antherBright);
      aGrad.addColorStop(1, '#D97706');

      stCtx.fillStyle = aGrad;
      stCtx.beginPath();
      stCtx.ellipse(0, 0, antherLen * 0.5, antherWid * 0.5, 0, 0, Math.PI * 2);
      stCtx.fill();

      stCtx.fillStyle = pal.rubyRed;
      stCtx.beginPath();
      stCtx.arc(0, 0, antherWid * 0.35, 0, Math.PI * 2);
      stCtx.fill();

      if (kRand() > 0.4) {
        stCtx.fillStyle = 'rgba(254, 240, 138, 0.75)';
        stCtx.beginPath();
        stCtx.arc(antherLen * 0.38, -antherWid * 0.4, 0.9, 0, Math.PI * 2);
        stCtx.fill();
      }

      stCtx.restore();
    }

    // Pistil
    const pistilAngle = fc.angle + (rand() - 0.5) * 0.08;
    const pReach = radius * 0.95;
    const pHeight = radius * 1.32;
    const pcp1x = fx + Math.cos(pistilAngle) * pReach * 0.5;
    const pcp1y = fy + Math.sin(pistilAngle) * pReach * 0.4;
    const pcp2x = fx + Math.cos(pistilAngle) * pReach * 1.05;
    const pcp2y = fy - pHeight * 0.6;
    const pTipX = pcp2x + Math.cos(pistilAngle) * radius * 0.12;
    const pTipY = fy - pHeight;

    stCtx.save();
    stCtx.beginPath();
    stCtx.moveTo(fx, fy);
    stCtx.bezierCurveTo(pcp1x, pcp1y, pcp2x, pcp2y, pTipX, pTipY);
    stCtx.strokeStyle = pal.stamenBright;
    stCtx.lineWidth = 1.6;
    stCtx.stroke();

    stCtx.fillStyle = '#FFA4B4';
    stCtx.beginPath();
    stCtx.arc(pTipX, pTipY, 2.0, 0, Math.PI * 2);
    stCtx.fill();
    stCtx.restore();
  });

  stCtx.restore();

  return {
    baseCanvas: baseLayer.canvas,
    whorlCanvases: whorlLayers.map(l => l.canvas),
    logicalSize,
    radius
  };
}

const createRoseSprite = createRoseBudSprite;
const createTulipSprite = createRoseBudSprite;

window.GardenBotany = Object.freeze({
  createRealisticRoseSprite,
  createHydrangeaSprite,
  createRoseBudSprite,
  createRoseSprite,
  createTulipSprite,
  createSpiderLilySprite,
  drawBotanicalLeaf,
  HYDRANGEA_PALETTES,
  ROSE_PALETTES
});
})();

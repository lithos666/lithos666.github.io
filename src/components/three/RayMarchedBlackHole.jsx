import { useRef, useMemo, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

/* ═══════════════════════════════════════════════════════
   "Event Horizon" — Ray-Marched Black Hole
   基于物理的光线步进黑洞渲染系统
   
   技术路线:
   ── 光线步进法 (Ray Marching) 而非粒子系统
   ── 史瓦西几何引力透镜: 光线在事件视界附近被弯曲
   ── 薄盘模型吸积盘: 平面求交 + 黑体温度着色
   ── 相对论多普勒增亮: D³ 因子
   ── FBM 湍流结构: 各向异性分形布朗运动
   ── 背景星空: 引力透镜扭曲
   
   物理参数:
   ── 史瓦西半径 rs = 2M (几何单位)
   ── ISCO (最内稳定圆轨道) = 3rs
   ── 吸积盘: r ∈ [2.4rs, 12rs]
   ── 温度分布: T ∝ r^(-3/4) (Shakura-Sunyaev 薄盘模型)
   
   参考文献:
   James, O., et al. (2015). "Gravitational lensing by spinning black holes"
   Shakura & Sunyaev (1973). "Black holes in binary systems"
   ═══════════════════════════════════════════════════════ */

/* ═══════════════════════════════════════════════════════
   Vertex Shader — Pass world position for ray setup
   ═══════════════════════════════════════════════════════ */
const vertexShader = /* glsl */ `
  varying vec3 vWorldPos;
  varying vec3 vNormal;

  void main() {
    vWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

/* ═══════════════════════════════════════════════════════
   Fragment Shader — Ray Marched Black Hole
   
   光线步进: 从相机出发，每步向黑洞方向弯曲，
   检测是否穿过吸积盘(Y=0平面)，应用温度着色和多普勒增亮。
   ═══════════════════════════════════════════════════════ */
const fragmentShader = /* glsl */ `
  precision highp float;

  uniform float uTime;
  uniform vec2 uResolution;
  uniform vec3 uCameraPos;
  uniform float uMouseX;           // Mouse X: horizontal orbit
  uniform float uMouseY;           // Mouse Y: camera tilt
  uniform float uBlackHoleMass;     // BH mass (controls event horizon size)
  uniform float uGravLensing;      // Lensing strength
  uniform float uDiskBrightness;   // Accretion disk brightness
  uniform float uCameraOffset;    // Continuous animation offset

  varying vec3 vWorldPos;
  varying vec3 vNormal;

  // ═══════════════════════════════════════════════════
  // CONSTANTS
  // ═══════════════════════════════════════════════════
  #define PI 3.14159265359
  #define MAX_STEPS 96          // Increased for better precision
  #define EVENT_HORIZON 2.0    // rs = 2M in geometric units
  #define PHOTON_SPHERE 2.6    // 1.5 × rs — photon sphere
  #define DISK_INNER 2.4       // Inner edge of accretion disk
  #define DISK_OUTER 11.0        // Outer edge (reduced for tighter ring)
  #define FAR_DISTANCE 120.0    // Escape radius

  // ═══════════════════════════════════════════════════
  // HASH / NOISE FUNCTIONS
  // ═══════════════════════════════════════════════════
  float hash11(float p) {
    p = fract(p * 0.1031);
    p *= p + 33.33;
    p *= p + p;
    return fract(p);
  }

  float hash21(vec2 p) {
    vec3 p3 = fract(vec3(p.xyx) * 0.1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
  }

  vec2 hash22(vec2 p) {
    vec3 p3 = fract(vec3(p.xyx) * vec3(0.1031, 0.1030, 0.0973));
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.xx + p3.yz) * p3.zy);
  }

  float hash31(vec3 p3) {
    p3 = fract(p3 * 0.1031);
    p3 += dot(p3, p3.zyx + 31.32);
    return fract((p3.x + p3.y) * p3.z);
  }

  // ══ Value noise 3D ══
  float noise3D(vec3 p) {
    vec3 i = floor(p);
    vec3 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    
    return mix(
      mix(mix(hash31(i),               hash31(i + vec3(1,0,0)), f.x),
          mix(hash31(i + vec3(0,1,0)), hash31(i + vec3(1,1,0)), f.x), f.y),
      mix(mix(hash31(i + vec3(0,0,1)), hash31(i + vec3(1,0,1)), f.x),
          mix(hash31(i + vec3(0,1,1)), hash31(i + vec3(1,1,1)), f.x), f.y),
      f.z
    );
  }

  // ══ Fractional Brownian Motion (4 octaves) ══
  float fbm(vec3 p, float lacunarity, float persistence) {
    float value = 0.0;
    float amplitude = 0.5;
    for (int i = 0; i < 4; i++) {
      value += amplitude * noise3D(p);
      p *= lacunarity;
      amplitude *= persistence;
    }
    return value;
  }

  // ═══════════════════════════════════════════════════
  // BLACKBODY COLOR (Mitchell Charity's blackbody LUT)
  // Temperature in Kelvin: 1000K–40000K
  // Maps to visible color spectrum
  // ═══════════════════════════════════════════════════
  vec3 blackbodyColor(float temp) {
    // temp: 0.0 (cool outer) → 1.0 (hot inner)
    float T = 1000.0 + temp * 39000.0; // Kelvin
    
    vec3 col = vec3(0.0);
    
    // Red
    if (T <= 6600.0) {
      col.r = 1.0;
    } else {
      col.r = 329.698727446 * pow(T / 100.0 - 60.0, -0.1332047592);
      col.r = clamp(col.r, 0.0, 1.0);
    }
    
    // Green
    if (T <= 6600.0) {
      col.g = 99.4708025861 * log(T / 100.0) - 161.1195681661;
      col.g = clamp(col.g, 0.0, 1.0);
    } else {
      col.g = 288.1221695283 * pow(T / 100.0 - 60.0, -0.0755148492);
      col.g = clamp(col.g, 0.0, 1.0);
    }
    
    // Blue
    if (T >= 6600.0) {
      col.b = 1.0;
    } else if (T <= 2000.0) {
      col.b = 0.0;
    } else {
      col.b = 138.5177312231 * log(T / 100.0 - 10.0) - 305.0447927307;
      col.b = clamp(col.b, 0.0, 1.0);
    }
    
    return col;
  }

  // ═══════════════════════════════════════════════════
  // ENHANCED STAR FIELD (procedural background)
  // Multi-scale realistic stars with temperature-based colors
  // ═══════════════════════════════════════════════════
  vec3 starField(vec3 dir) {
    // Spherical coordinates
    float theta = atan(dir.z, dir.x);
    float phi = asin(clamp(dir.y, -1.0, 1.0));
    
    // Multi-scale star grid
    vec3 col = vec3(0.0);
    
    // ── Bright massive stars (blue/white giants) ──
    vec2 cell1 = floor(vec2(theta, phi) * 25.0);
    float star1 = hash21(cell1);
    if (star1 > 0.982) {
      vec2 starPos1 = hash22(cell1 + 42.0) * 0.85 + 0.075;
      vec2 cellUV1 = fract(vec2(theta, phi) * 25.0) - starPos1;
      float dist1 = length(cellUV1);
      float starSize = 0.018 + hash21(cell1 + 100.0) * 0.025;
      
      // Gaussian glow for more realistic appearance
      float glow1 = exp(-dist1 * dist1 / (starSize * starSize * 8.0)) * 0.8;
      float core1 = exp(-dist1 * dist1 / (starSize * starSize * 0.8)) * 1.2;
      
      // Star temperature variation (blue to yellow)
      float tempVar = hash21(cell1 + 200.0);
      vec3 starColor = mix(
        vec3(0.8, 0.9, 1.0),      // Cool blue-white
        vec3(1.0, 0.98, 0.85),    // Hot yellow-white
        tempVar * 0.6
      );
      col += starColor * (glow1 * 0.5 + core1 * 1.8);
    }
    
    // ── Medium stars (normal main sequence) ──
    vec2 cell2 = floor(vec2(theta, phi) * 85.0);
    float star2 = hash21(cell2 + 500.0);
    if (star2 > 0.990) {
      vec2 starPos2 = hash22(cell2 + 542.0) * 0.8 + 0.1;
      vec2 cellUV2 = fract(vec2(theta, phi) * 85.0) - starPos2;
      float dist2 = length(cellUV2);
      float starSize2 = 0.009 + hash21(cell2 + 600.0) * 0.012;
      
      float glow2 = exp(-dist2 * dist2 / (starSize2 * starSize2 * 6.0)) * 0.5;
      float core2 = exp(-dist2 * dist2 / (starSize2 * starSize2)) * 0.9;
      
      float tempVar2 = hash21(cell2 + 300.0);
      vec3 color2 = mix(
        vec3(0.9, 0.95, 1.0),
        vec3(1.0, 0.96, 0.8),
        tempVar2
      );
      col += color2 * (glow2 * 0.3 + core2 * 0.7);
    }
    
    // ── Small faint stars (red dwarfs) ──
    vec2 cell3 = floor(vec2(theta, phi) * 220.0);
    float star3 = hash21(cell3 + 1000.0);
    if (star3 > 0.994) {
      vec3 redDwarfColor = vec3(1.0, 0.85, 0.7) * 0.6;
      col += redDwarfColor * 0.12;
    }
    
    // ── Very faint background stars ──
    vec2 cell4 = floor(vec2(theta, phi) * 500.0);
    float star4 = hash21(cell4 + 2000.0);
    if (star4 > 0.996) {
      col += vec3(0.85, 0.90, 0.98) * 0.04;
    }
    
    return col;
  }

  // ═══════════════════════════════════════════════════
  // COSMIC NEBULA (purple/blue cosmic dust)
  // ═══════════════════════════════════════════════════
  vec3 nebulaField(vec3 dir) {
    float n1 = fbm(dir * 3.0 + vec3(50.0), 2.0, 0.5);
    float n2 = fbm(dir * 6.5 + vec3(80.0), 2.0, 0.5);
    
    // Purple-blue nebula colors
    vec3 nebColor1 = vec3(0.04, 0.01, 0.08) * smoothstep(0.3, 0.8, n1) * 0.5;
    vec3 nebColor2 = vec3(0.02, 0.01, 0.06) * smoothstep(0.4, 0.85, n2) * 0.3;
    
    return nebColor1 + nebColor2;
  }

  // ═══════════════════════════════════════════════════
  // ACCRETION DISK COLOR — Cosmic dust / nebula cloud style
  // Volumetric, soft-edged, misty like interstellar medium
  // ═══════════════════════════════════════════════════
  vec4 accretionDiskColor(vec3 hitPos, float time) {
    float r = length(hitPos.xz);
    float hitAngle = atan(hitPos.z, hitPos.x);
    
    // Check if within disk bounds
    if (r < DISK_INNER || r > DISK_OUTER) return vec4(0.0);
    
    // ══ Shakura-Sunyaev temperature profile
    float normR = (r - DISK_INNER) / (DISK_OUTER - DISK_INNER);
    float temperature = pow(1.0 - normR * 0.9, 0.75);
    float kelvin = 2000.0 + temperature * 33000.0;
    float tempNorm = (kelvin - 1000.0) / 39000.0;
    
    // ══ Cloud / Nebula-style turbulence — soft and volumetric
    float keplerPhase = time * 0.5 / pow(r, 1.5);       // Keplerian rotation (slower base)
    float rotatedAngle = hitAngle + keplerPhase;
    
    // Large slow-moving cloud structures — drifts with time for visible flow
    vec3 cloudCoord1 = vec3(
      r * 0.35 + time * 0.12,                           // radial inflow drift
      cos(rotatedAngle * 0.6 + time * 0.18) * 2.5,      // angular sweep
      sin(rotatedAngle * 0.6 + time * 0.18) * 2.5
    );
    float clouds1 = fbm(cloudCoord1 * 0.45, 1.8, 0.55);

    // Medium wispy filaments — faster angular flow
    vec3 cloudCoord2 = vec3(
      r * 0.8 + time * 0.20,
      cos(rotatedAngle * 1.3 + time * 0.32) * 4.0,
      sin(rotatedAngle * 1.3 + time * 0.32) * 4.0
    );
    float clouds2 = fbm(cloudCoord2 * 0.9, 2.0, 0.5);

    // Fine dust haze — fastest flow, creates shimmering drift
    vec3 cloudCoord3 = vec3(
      r * 1.5 + time * 0.28,
      cos(rotatedAngle * 2.8 + time * 0.50) * 6.0,
      sin(rotatedAngle * 2.8 + time * 0.50) * 6.0
    );
    float clouds3 = fbm(cloudCoord3 * 1.6, 2.2, 0.45);

    // Combine with smooth weighting — no sharp spiral patterns
    float cloudDensity = clouds1 * 0.50 + clouds2 * 0.32 + clouds3 * 0.18;
    
    // Soft radial flow modulation (dust spiraling inward gently)
    float radialFlow = sin(time * 0.35 - r * 0.7) * 0.5 + 0.5;   // faster flow
    cloudDensity = mix(cloudDensity, cloudDensity * (0.55 + radialFlow * 0.9), 0.30);
    
    // Smooth out extremes — keep it misty, not blotchy
    cloudDensity = smoothstep(0.15, 0.75, cloudDensity);
    
    // ══ Base color from blackbody radiation
    vec3 baseColor = blackbodyColor(tempNorm);
    
    // Gentle color variation within clouds — warmer in denser regions
    float warmShift = cloudDensity * 0.4;
    vec3 cloudTint = blackbodyColor(clamp(tempNorm + warmShift, 0.0, 1.0));
    baseColor = mix(baseColor, cloudTint, cloudDensity * 0.55);
    
    // Soft brightness from density — volumetric glow feel
    baseColor *= (0.35 + cloudDensity * 0.85);
    
    // ══ Subtle slow pulsation — cosmic "breathing"
    float pulse = sin(time * 0.8 + r * 0.3) * 0.06 + 1.0;
    baseColor *= pulse;
    
    // ══ Relativistic Doppler beaming (kept but softened)
    vec3 velocityDir = normalize(vec3(-sin(hitAngle), 0.0, cos(hitAngle)));
    vec3 toCamera = normalize(hitPos - uCameraPos);
    float orbitalBeta = 0.30 / sqrt(r);
    float cosTheta = dot(velocityDir, toCamera);
    float dopplerFactor = 1.0 / (1.0 - orbitalBeta * cosTheta);
    float dopplerBoost = pow(max(dopplerFactor, 0.05), 2.8);
    dopplerBoost = clamp(dopplerBoost, 0.1, 5.0);
    
    // Apply gentle asymmetric brightening
    baseColor *= mix(1.0, dopplerBoost, 0.5);
    
    // ══ Very soft edge falloff — cloud-like diffusion at boundaries
    float innerEdge = smoothstep(-0.03, 0.12, normR);     // softer inner fade-in
    float outerEdge = smoothstep(1.08, 0.60, normR);       // gradual outer dissolve
    float diskAlpha = innerEdge * outerEdge;
    
    // Transparency gradient — more transparent toward outer edge (volumetric depth)
    diskAlpha *= mix(0.88, 0.35, pow(normR, 0.7));         // exponential transparency
    
    // Modulate alpha by cloud density — thinner in empty regions
    diskAlpha *= (0.25 + cloudDensity * 0.75);
    
    // ══ ISCO inner glow — soft, not harsh
    float iscoRange = 0.20;                                  // wider range
    float iscoDist = smoothstep(0.0, iscoRange, normR);
    float iscoGlow = pow(1.0 - iscoDist, 2.5) * 2.5;        // gentler peak
    
    vec3 iscoColor = blackbodyColor(1.0);
    float iscoPulse = sin(time * 1.4) * 0.12 + 1.0;
    baseColor = mix(baseColor, iscoColor * iscoPulse, iscoGlow * 0.55);
    baseColor += iscoColor * iscoGlow * 0.3;
    
    // ══ Subtle warm wisps instead of sharp hot spots
    float wispAngle = rotatedAngle * 4.0 + time * 0.9;
    float wisp = fbm(vec3(wispAngle * 0.5, r * 1.5, time * 0.3), 1.6, 0.52);
    wisp = smoothstep(0.4, 0.75, wisp) * (1.0 - normR) * 0.25;
    baseColor += vec3(1.0, 0.92, 0.80) * wisp;
    
    // ══ Overall brightness control — boosted for bloom glow
    baseColor *= uDiskBrightness * 1.45;
    
    return vec4(baseColor * diskAlpha, diskAlpha);
  }

  // ═══════════════════════════════════════════════════
  // MAIN RAY MARCHING
  // ═══════════════════════════════════════════════════
  void main() {
    // ── Ray setup ──
    vec3 rayOrigin = uCameraPos;
    vec3 rayDir = normalize(vWorldPos - uCameraPos);
    
    // ── Continuous gentle camera drift for endless animation ──
    // Subtle orbital movement so the view never feels static
    float drift = uTime * 0.08 + uCameraOffset;
    rayOrigin.x += sin(drift) * 0.8;
    rayOrigin.z += cos(drift * 0.7) * 0.5;
    rayOrigin.y += sin(drift * 0.5) * 0.3;
    
    // Recalculate ray direction from new origin
    rayDir = normalize(vWorldPos - rayOrigin);
    
    // ── Ray march variables ──
    vec3 rayPos = rayOrigin;
    vec3 prevPos = rayOrigin;
    
    // Schwarzschild radius (event horizon boundary)
    float rs = EVENT_HORIZON * uBlackHoleMass;
    float photonR = PHOTON_SPHERE * uBlackHoleMass;
    
    // Accumulated color (background + disk)
    vec3 finalColor = vec3(0.0);
    float diskAccumAlpha = 0.0;
    float diskAccumulated = 0.0;
    
    // Disk intersection info
    bool hitDisk = false;
    vec3 diskHitPos = vec3(0.0);
    float diskHitAlpha = 0.0;
    vec3 diskHitColor = vec3(0.0);
    
    bool captured = false;
    bool escaped = false;
    
    // ── Ray march loop ──
    for (int i = 0; i < MAX_STEPS; i++) {
      prevPos = rayPos;
      
      float r = length(rayPos);
      
      // ── Event horizon: captured ──
      if (r < rs * 0.98) {
        captured = true;
        // Inside event horizon: pure black
        finalColor = vec3(0.0);
        break;
      }
      
      // ── Escape to infinity ──
      if (r > FAR_DISTANCE) {
        escaped = true;
        break;
      }
      
      // ── Gravitational lensing bending ──
      // Physics: a = -rs/r² × û (light accelerates toward BH)
      vec3 toCenter = -normalize(rayPos);
      float bendStrength = rs / (r * r);
      bendStrength *= uGravLensing * 0.6;  // Tunable strength
      
      // Step size decreases near horizon (adaptive)
      float stepSize = 0.4 + r * 0.08;
      stepSize = min(stepSize, 2.5);
      
      rayDir = normalize(rayDir + toCenter * bendStrength * stepSize);
      rayPos += rayDir * stepSize;
      
      // ── Disk plane intersection (Y = 0) ──
      // Detect crossing: prev.y and curr.y on opposite sides of Y=0
      if (prevPos.y * rayPos.y <= 0.0 && abs(prevPos.y - rayPos.y) > 0.001) {
        // Linear interpolation to find exact crossing point
        float t = prevPos.y / (prevPos.y - rayPos.y);
        vec3 hitPos = mix(prevPos, rayPos, t);
        float hitR = length(hitPos.xz);
        
        // Only count if within disk radial bounds
        if (hitR >= DISK_INNER * uBlackHoleMass && hitR <= DISK_OUTER * uBlackHoleMass) {
          hitDisk = true;
          diskHitPos = hitPos;
          
          vec4 diskColor = accretionDiskColor(hitPos, uTime);
          diskHitColor = diskColor.rgb;
          diskHitAlpha = diskColor.a;
        }
      }
    }
    
    // ── Background (stars + nebula) with lensing ──
    if (escaped) {
      vec3 bgColor = starField(rayDir) * 2.8;        // Enhanced for richer starfield
      bgColor += nebulaField(rayDir) * 1.5;
      finalColor = bgColor;
      
      // Enhanced lens flare near photon sphere
      float closestApproach = length(rayOrigin);
      if (closestApproach < photonR * 3.5 && closestApproach > rs) {
        float lensFactor = 1.0 - smoothstep(rs, photonR * 2.5, closestApproach);
        // Multi-color lens flare (blue-purple)
        vec3 lensFlare = mix(
          vec3(0.1, 0.08, 0.2),
          vec3(0.15, 0.12, 0.25),
          lensFactor
        );
        finalColor += lensFlare * lensFactor * 1.5;
      }
    }
    
    // ── Accretion disk overlay ──
    if (hitDisk && diskHitAlpha > 0.001) {
      // Alpha blend: disk over background with enhanced glow
      finalColor = mix(finalColor, diskHitColor, diskHitAlpha * 0.96);
      // Add disk bloom/glow effect
      finalColor += diskHitColor * diskHitAlpha * 0.3;
    }
    
    // ── Event horizon shadow (enhanced) ──
    // Soft edge near photon sphere with gradual darkening
    float closestR = length(rayOrigin);
    if (closestR < photonR * 2.2 && closestR > rs) {
      float shadowEdge = smoothstep(rs * 0.95, photonR * 1.6, closestR);
      float darkening = mix(0.08, 1.0, shadowEdge);
      finalColor *= darkening;
      
      // Add subtle blue shadow tint near horizon
      float shadowTint = 1.0 - shadowEdge;
      finalColor = mix(finalColor, finalColor * vec3(0.8, 0.9, 1.0), shadowTint * 0.3);
    }
    
    // ── Photon ring glow (enhanced) ──
    if (closestR > rs && closestR < photonR * 2.3) {
      // Outer glow
      float photonGlow = smoothstep(photonR * 2.3, photonR * 1.2, closestR);
      // Inner bright ring
      float photonGlow2 = smoothstep(photonR * 1.08, photonR * 0.95, closestR);
      // Core intensity
      float photonCore = smoothstep(photonR * 1.02, photonR * 0.98, closestR);
      
      // Bright blue-white ring at photon sphere
      vec3 photonColor = vec3(0.88, 0.94, 1.0);
      finalColor += photonColor * photonGlow * 2.2;
      
      // Hot white inner ring
      vec3 photonInner = vec3(1.0, 0.99, 0.96);
      finalColor += photonInner * photonGlow2 * 3.2;
      
      // Ultra-hot core
      finalColor += vec3(1.0, 1.0, 1.0) * photonCore * 1.8;
    }
    
    // ── Enhanced bloom/glow for extreme brightness ──
    // Clamp and boost bright areas
    if (length(finalColor) > 2.0) {
      finalColor += finalColor * 0.2;
    }
    
    // ── Output ──
    // Advanced tone mapping (ACES-like filmic curve)
    // Handles bright areas from disk and photon ring better
    vec3 toneMapped = finalColor / (finalColor + vec3(1.15));
    
    // Enhanced saturation for more vibrant colors
    vec3 lum = vec3(0.299, 0.587, 0.114);
    float luminance = dot(toneMapped, lum);
    vec3 desaturated = vec3(luminance);
    toneMapped = mix(desaturated, toneMapped, 1.15); // Boost saturation
    
    // Improved gamma correction
    toneMapped = pow(toneMapped, vec3(1.0 / 2.2));
    
    // Slight color correction for more natural appearance
    toneMapped.b *= 1.05; // Enhance blues
    
    gl_FragColor = vec4(toneMapped, 1.0);
  }
`;

/* ═══════════════════════════════════════════════════════
   RayMarchedBlackHole Component
   ═══════════════════════════════════════════════════════ */
export default function RayMarchedBlackHole() {
  const meshRef = useRef();
  const { camera, size } = useThree();

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uResolution: { value: new THREE.Vector2(1920, 1080) },
    uCameraPos: { value: new THREE.Vector3(0, 2, 14) },
    uMouseX: { value: 0 },
    uMouseY: { value: 0 },
    uBlackHoleMass: { value: 1.0 },
    uGravLensing: { value: 0.75 },
    uDiskBrightness: { value: 1.25 },
    uCameraOffset: { value: 0 },
  }), []);

  // Update resolution on resize
  useEffect(() => {
    if (uniforms.uResolution) {
      uniforms.uResolution.value.set(size.width * Math.min(window.devicePixelRatio, 2), 
                                    size.height * Math.min(window.devicePixelRatio, 2));
    }
  }, [size, uniforms]);

  useFrame((state) => {
    uniforms.uTime.value = state.clock.elapsedTime;
    
    // Update camera position for ray marching
    uniforms.uCameraPos.value.copy(camera.position);
    
    // Mouse interaction for camera orbit
    uniforms.uMouseX.value = state.pointer.x;
    uniforms.uMouseY.value = state.pointer.y;
    
    // Smooth camera orbit based on mouse + continuous movement
    const targetX = state.pointer.x * 3.0 + Math.sin(state.clock.elapsedTime * 0.3) * 2.0;
    const targetY = 1.5 + state.pointer.y * 4.0 + Math.cos(state.clock.elapsedTime * 0.2) * 1.0;
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX, 0.02);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, 0.02);
    
    // Continuous camera drift offset (faster for more visible animation)
    uniforms.uCameraOffset.value += 0.003;
  });

  return (
    <mesh ref={meshRef}>
      {/* Inverted sphere — camera is INSIDE looking out */}
      <sphereGeometry args={[500, 64, 64]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        side={THREE.BackSide}
        depthWrite={false}
        transparent={false}
      />
    </mesh>
  );
}

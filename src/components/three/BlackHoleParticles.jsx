import { useRef, useMemo, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

/* ═══════════════════════════════════════════════════════
   "Event Horizon" — Black Hole Accretion Disk Particle System
   
   Visual Architecture:
   ── Event Horizon Shadow: ~3K  — Pure black core, the singularity
   ── Photon Ring:           ~20K — Blinding blue-white, hottest material
   ── Inner Accretion Disk:  ~25K — Deep crimson / scarlet plasma
   ── Mid Accretion Disk:    ~28K — Fiery orange-red turbulent currents  
   ── Outer Halo:            ~16K — Gold / amber / pale yellow cooling edges
   ── Relativistic Jets:      ~8K — Vertical polar plasma streams
   
   Physics in Shader:
   ── Gravitational lensing distortion (light bending near event horizon)
   ── Kepler orbital velocity (ω ∝ r^-0.5, faster near center)
   ── Turbulent plasma motion (multi-octave Simplex noise)
   ── Radial temperature gradient coloring
   ── Scroll-driven dissipation (fade out for HTML transition)
   
   Color Temperature Map (by radius):
   r=0        → #000000  (event horizon, absolute black)
   r≈0.8      → #D0E8FF  (photon ring, blinding blue-white)
   r≈1.2–2.0  → #CC1144→#8B0015  (inner disk, crimson/scarlet)
   r≈2.0–3.5  → #FF3322→#DD5500  (mid disk, fiery orange-red)
   r≈3.5–6.0  → #EEAA22→#DD8833  (outer disk, gold/amber)
   r>6.0      → #F0C860          (cooling halo, pale yellow)
   
   Total: ~100K particles @ 60fps
   ═══════════════════════════════════════════════════════ */

const TOTAL = 100000;

/* ═══════════════════════════════════════════════════════
   Vertex Shader — Gravitational Lensing + Plasma Dynamics
   ═══════════════════════════════════════════════════════ */
const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uScroll;         // 0→1 scroll timeline
  uniform float uPixelRatio;
  uniform vec2 uMouse;           // Mouse position
  uniform float uScale;          // Zoom level
  uniform float uRotationX;      // Pitch angle
  uniform float uChaos;          // Proximity turbulence

  attribute float aType;          // 0=horizon, 1=photon, 2=inner, 3=mid, 4=outer, 5=jets
  attribute float aRadius;        // Orbital distance from center
  attribute float aAngle;         // Initial angle in orbit
  attribute float aPhase;         // Random phase for noise variation
  attribute float aSize;          // Base particle size
  attribute float aBrightness;    // Base brightness factor
  attribute float aRandomId;      // For LOD culling

  varying float vRadius;          // Distance from center (for color gradient)
  varying float vAlpha;
  varying float vBrightness;
  varying float vType;
  varying float vScroll;
  varying float vDistToCamera;

  // ══ Simplex 3D Noise (Ashima Arts) ══
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i);
    vec4 p = permute(permute(permute(
              i.z + vec4(0.0, i1.z, i2.z, 1.0))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0) * 2.0 + 1.0;
    vec4 s1 = floor(b1) * 2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }

  // ══ Hash for random variations ══
  float hash(float n) { return fract(sin(n) * 43758.5453123); }
  float hash2(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

  // ══ 2D rotation ══
  mat2 rotate2d(float a) {
    return mat2(cos(a), -sin(a), sin(a), cos(a));
  }

  // ══ Kepler speed: faster near event horizon ══
  float getKeplerSpeed(float r) {
    return 0.6 / sqrt(max(r, 0.15)) * 0.45;
  }

  // ══ Easing functions for cinematic scroll timeline ══
  float easeInCubic(float t) { return t * t * t; }

  void main() {
    vType = aType;
    vScroll = uScroll;
    
    // ══ LOD Culling ══
    float lodThreshold = 0.82 + clamp((uScale - 0.3) / 2.0, 0.0, 1.0) * 0.18;
    if (aRandomId > lodThreshold) {
      gl_Position = vec4(0.0);
      gl_PointSize = 0.0;
      return;
    }

    float t = uTime;
    vec3 pos;
    float orbitRadius = aRadius;

    if (aType < 0.5) {
      // ══ EVENT HORIZON SHADOW — The dark singularity ══
      // Tiny black points forming the shadow silhouette
      pos = vec3(
        orbitRadius * cos(aAngle) * (0.85 + hash(aAngle) * 0.15),
        orbitRadius * sin(aAngle) * (0.7 + hash(aPhase) * 0.3),
        hash(aPhase + aAngle) * 0.08
      );
      // Extremely slow rotation (frame dragging effect)
      pos.xz = rotate2d(t * 0.008) * pos.xz;
      
    } else if (aType < 1.5) {
      // ══ PHOTON RING — Blinding blue-white ring ══
      // Slightly tilted, very fast rotation
      float tilt = 0.12 + sin(t * 0.03) * 0.02;
      float angle = aAngle + t * getKeplerSpeed(orbitRadius) * 2.5;
      
      pos = vec3(
        cos(angle) * orbitRadius,
        sin(angle) * orbitRadius * sin(tilt) + (aPhase - 0.5) * 0.04,
        sin(angle) * orbitRadius * cos(tilt)
      );
      // Subtle precession wobble
      pos.xz = rotate2d(sin(t * 0.15) * 0.03) * pos.xz;

    } else if (aType < 2.5) {
      // ══ INNER ACCRETION DISK — Crimson/scarlet plasma ══
      float tilt = 0.18;
      float baseSpeed = getKeplerSpeed(orbitRadius) * 1.8;
      // Add turbulent velocity variation
      float turbSpeed = snoise(vec3(aAngle * 3.0, aPhase * 2.0, t * 0.3)) * 0.4;
      float angle = aAngle + t * (baseSpeed + turbSpeed);
      
      pos = vec3(
        cos(angle) * orbitRadius,
        sin(angle) * orbitRadius * sin(tilt) + (aPhase - 0.5) * 0.12,
        sin(angle) * orbitRadius * cos(tilt)
      );
      // Vertical oscillation (plasma waves)
      pos.y += sin(t * 2.0 + aAngle * 5.0) * 0.05 * (1.0 - orbitRadius / 3.0);

    } else if (aType < 3.5) {
      // ══ MID DISK — Fiery orange/red turbulent currents ══
      float tilt = 0.22;
      float angle = aAngle + t * getKeplerSpeed(orbitRadius) * 1.3;
      
      // Multi-octave turbulence for swirling filaments
      float n1 = snoise(vec3(pos.xy * 1.5 + t * 0.4, t * 0.2)) * 0.6;
      float n2 = snoise(vec3(pos.yz * 3.0 + t * 0.7, t * 0.3)) * 0.25;
      
      pos = vec3(
        cos(angle) * (orbitRadius + n1 * 0.15),
        sin(angle) * (orbitRadius + n2 * 0.10) * sin(tilt) + (aPhase - 0.5) * 0.18,
        sin(angle) * (orbitRadius + n1 * 0.12) * cos(tilt)
      );
      // Strong vertical turbulence
      pos.y += n2 * 0.2;

    } else if (aType < 4.5) {
      // ══ OUTER HALO — Gold/amber cooling edges ══
      float tilt = 0.28;
      float angle = aAngle + t * getKeplerSpeed(orbitRadius) * 0.8;
      
      // Gentle spiral wave pattern
      float spiralOffset = sin(aAngle * 2.0 - t * 0.5) * 0.1;
      
      pos = vec3(
        cos(angle) * (orbitRadius + spiralOffset),
        sin(angle) * (orbitRadius + spiralOffset * 0.5) * sin(tilt) + (aPhase - 0.5) * 0.25,
        sin(angle) * orbitRadius * cos(tilt)
      );

    } else {
      // ══ RELATIVISTIC JETS — Vertical polar plasma streams ══
      float jetAngle = aAngle + t * 0.5;
      float jetHeight = orbitRadius;
      float jetWobble = sin(t * 1.5 + aPhase * 6.28) * 0.15;
      
      // Jets emerge from poles (top and bottom)
      float polarity = hash(aAngle + 0.5) > 0.5 ? 1.0 : -1.0;
      float spreadRadius = 0.1 + abs(orbitRadius) * 0.08;
      
      pos = vec3(
        cos(jetAngle) * spreadRadius + jetWobble * 0.05,
        polarity * jetHeight,
        sin(jetAngle) * spreadRadius + jetWobble * 0.03
      );
    }

    // ══ GRAVITATIONAL LENSING DISTORTION ══
    // Light bends more strongly near the event horizon
    float distFromCenter = length(pos.xz);
    if (distFromCenter < 6.0 && distFromCenter > 0.01) {
      float lensStrength = 0.8 / (distFromCenter * distFromCenter + 0.3);
      lensStrength = min(lensStrength, 2.0);
      
      // Bend positions toward center (simulating light curvature)
      vec2 toCenter = normalize(-pos.xz);
      pos.xz += toCenter * lensStrength * 0.15;
      
      // Azimuthal shear — inner parts rotate faster than outer
      float shearAngle = lensStrength * 0.1 * sin(t * 0.5);
      pos.xz = rotate2d(shearAngle * smoothstep(6.0, 0.5, distFromCenter)) * pos.xz;
    }

    // ══ GLOBAL ROTATION (pitch via mouse Y) ══
    float cx = cos(uRotationX);
    float sx = sin(uRotationX);
    float ry = pos.y * cx - pos.z * sx;
    float rz = pos.y * sx + pos.z * cx;
    pos.y = ry;
    pos.z = rz;

    // ══ SCROLL TIMELINE: Three-phase narrative ══
    if (uScroll > 0.001) {
      float phase1End = 0.4;
      float phase2End = 0.7;
      
      // Phase 2: Chaos explosion (matter being consumed)
      if (uScroll > phase1End) {
        float phase2Progress = smoothstep(phase1End, phase2End, uScroll);
        float explodeStrength = easeInCubic(phase2Progress);
        
        // Spiral inward then outward (accretion dynamics)
        vec3 dir = normalize(pos + vec3(0.001));
        
        // Multi-octave chaos noise
        float n1 = snoise(pos * 2.0 + t * 0.8) * pow(phase2Progress, 1.5) * 8.0;
        float n2 = snoise(pos * 5.0 + t * 1.4) * pow(phase2Progress, 1.5) * 3.0;
        
        // First pull inward (like matter falling into BH), then explode outward
        float pullPhase = smoothstep(0.0, 0.5, phase2Progress);
        pos -= dir * pullPhase * 2.0;              // Infall
        pos += dir * (1.0 - pullPhase) * explodeStrength * (3.0 + abs(n1)); // Outburst
        pos += vec3(n1, n2, n1 * 0.5) * 0.4;
      }
      
      // Phase 1+all: Push toward camera
      pos.z += easeInCubic(uScroll) * 10.0;
      
      // Pre-expansion in phase 1
      if (uScroll <= phase1End) {
        float preExpand = smoothstep(0.0, phase1End, uScroll) * 0.3;
        pos *= (1.0 + preExpand);
      }
    }

    // ══ MOUSE CHAOS TURBULENCE ══
    if (uChaos > 0.01) {
      float highFreqTime = t * 50.0;
      pos.x += sin(highFreqTime + pos.y * 12.0) * hash(pos.x) * uChaos * 1.5;
      pos.y += cos(highFreqTime + pos.z * 12.0) * hash(pos.y) * uChaos * 1.5;
      pos.z += sin(highFreqTime * 0.7) * hash(pos.z) * uChaos * 0.8;
    }

    // ══ SUBTLE MOUSE GRAVITY ══
    vec2 toMouse = uMouse * 4.0 - pos.xy;
    float mousePull = exp(-length(toMouse) * 0.06) * 0.15 * (1.0 - uScroll);
    mousePull = max(mousePull, 0.0);
    pos.xy += normalize(toMouse + vec2(0.001)) * mousePull;

    // ══ Final output ══
    vRadius = length(pos);  // Pass radius to fragment for temperature-based coloring
    
    vec4 mvPosition = modelViewMatrix * vec4(pos * uScale, 1.0);
    vDistToCamera = max(-mvPosition.z, 0.1);

    // Perspective point size
    float baseSize = aSize * uPixelRatio;
    float perspectiveSize = baseSize * (350.0 / vDistToCamera);
    perspectiveSize *= 0.55;
    
    // Smaller for body-like elements at close range
    if (aType < 1.5 && vDistToCamera < 50.0) perspectiveSize *= 0.85;
    
    // Slight growth during explosion
    perspectiveSize *= (1.0 + uScroll * 0.35);

    gl_PointSize = clamp(perspectiveSize, 0.5, 180.0);
    gl_Position = projectionMatrix * mvPosition;

    // Brightness: inverse-square with layer adjustment
    float invSquare = 1.0 / (vDistToCamera * vDistToCamera * 0.12 + 0.6);
    vBrightness = aBrightness * clamp(invSquare, 0.15, 2.5);
    vBrightness *= (1.0 + uScroll * 1.0);

    // Alpha system
    float depthFade = smoothstep(80.0, 5.0, -pos.z);
    float farFade = smoothstep(70.0, 20.0, vDistToCamera);
    
    // Phase 3 dissipate (scroll 0.7 → 1.0)
    float scrollFade = 1.0;
    if (uScroll > 0.7) {
      float dissipate = smoothstep(0.7, 1.0, uScroll);
      scrollFade = 1.0 - pow(dissipate, 4.0);
      scrollFade = max(scrollFade, 0.0);
    }
    
    // Near clipping fade
    float clipFade = vDistToCamera < 5.0 ? smoothstep(0.0, 5.0, vDistToCamera) : 1.0;
    
    vAlpha = depthFade * farFade * scrollFade * clipFade * (0.4 + 0.6 * aBrightness);
  }
`;

/* ═══════════════════════════════════════════════════════
   Fragment Shader — Temperature Gradient Coloring
   
   Color map by radial temperature:
   r ≈ 0       → #000000 (event horizon, pitch black)
   r ≈ 0.5–1.0 → #C0E8FF→#FFFFFF (photon ring, blinding blue-white)
   r ≈ 1.0–2.2 → #EE0033→#AA0022 (inner disk, crimson/scarlet)
   r ≈ 2.2–4.0 → #FF2200→#DD5500 (mid disk, fiery orange-red)
   r ≈ 4.0–6.0 → #EEBB22→#DD9933 (outer disk, gold/amber)
   r > 6.0     → #F0D060 (halo, pale yellow cooling)
   ═══════════════════════════════════════════════════════ */
const fragmentShader = /* glsl */ `
  varying float vRadius;
  varying float vAlpha;
  varying float vBrightness;
  varying float vType;
  varying float vScroll;
  varying float vDistToCamera;

  // ══ TEMPERATURE COLOR PALETTE ══
  const vec3 HORIZON_BLACK    = vec3(0.00, 0.00, 0.00);  // Absolute void
  const vec3 PHOTON_BLUE      = vec3(0.75, 0.91, 1.00);  // #C0E8FF
  const vec3 PHOTON_WHITE     = vec3(0.95, 0.97, 1.00);  // Near-white hot
  const vec3 CRIMSON_HOT       = vec3(0.93, 0.00, 0.20);  // #EE0033
  const vec3 SCARLET           = vec3(0.67, 0.00, 0.13);  // #AA0022
  const vec3 FIERY_ORANGE      = vec3(1.00, 0.13, 0.00);  // #FF2200
  const vec3 BURNT_ORANGE      = vec3(0.87, 0.33, 0.00);  // #DD5500
  const vec3 DEEP_GOLD         = vec3(0.93, 0.73, 0.13);  // #EEBB22
  const vec3 AMBER             = vec3(0.87, 0.60, 0.20);  // #DD9933
  const vec3 PALE_YELLOW       = vec3(0.94, 0.81, 0.38);  // #F0D060
  
  // Jet colors
  const vec3 JET_BLUE          = vec3(0.30, 0.50, 0.90);
  const vec3 JET_CYAN          = vec3(0.20, 0.80, 0.85);

  void main() {
    // Circular particle shape
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c);
    if (d > 0.5) discard;

    // Soft glow falloff
    float glow = exp(-d * d * 14.0) * 0.72;
    float core = smoothstep(0.10, 0.0, d) * 0.38;

    // ══ TEMPERATURE-BASED COLOR BY TYPE & RADIUS ══
    vec3 col;
    float r = vRadius;

    if (vType < 0.5) {
      // ══ EVENT HORIZON — Pure black shadow ══
      col = HORIZON_BLACK;
      // Tiny amount of ambient "glow" around horizon edge
      col = mix(col, vec3(0.02, 0.00, 0.03), smoothstep(0.3, 0.9, r) * 0.15);
      
    } else if (vType < 1.5) {
      // ══ PHOTON RING — Blinding blue-white ══
      float ringPulse = 0.92 + sin(vScroll * 15.0 + r * 8.0) * 0.08;
      col = mix(PHOTON_BLUE, PHOTON_WHITE, smoothstep(0.5, 1.0, r));
      col *= ringPulse;
      // Extra brightness boost
      col *= 1.8;
      
    } else if (vType < 2.5) {
      // ══ INNER DISK — Deep crimson / scarlet plasma ══
      float t = smoothstep(1.0, 2.2, r);
      col = mix(CRIMSON_HOT, SCARLET, t);
      // Hot spots (turbulence brightening)
      float hotspot = pow(sin(r * 12.0 + vScroll * 5.0) * 0.5 + 0.5, 3.0);
      col = mix(col, CRIMSON_HOT, hotspot * 0.4);
      
    } else if (vType < 3.5) {
      // ══ MID DISK — Fiery orange-red turbulent currents ══
      float t = smoothstep(2.2, 4.0, r);
      col = mix(FIERY_ORANGE, BURNT_ORANGE, t);
      // Swirling filament highlights
      float filament = sin(r * 8.0 - vScroll * 3.0) * 0.5 + 0.5;
      col = mix(col, vec3(1.0, 0.4, 0.1), pow(filament, 2.0) * 0.3);
      
    } else if (vType < 4.5) {
      // ══ OUTER HALO — Gold → amber → pale yellow ══
      float t = smoothstep(4.0, 6.5, r);
      col = mix(DEEP_GOLD, AMBER, smoothstep(0.0, 0.5, t));
      col = mix(col, PALE_YELLOW, smoothstep(0.5, 1.0, t));
      // Soft, diffused appearance
      col *= 0.85;
      
    } else {
      // ══ RELATIVISTIC JETS — Blue-cyan polar streams ══
      col = mix(JET_CYAN, JET_BLUE, sin(vScroll * 8.0 + r * 3.0) * 0.5 + 0.5);
      // Pulsating brightness along jets
      float jetPulse = 0.7 + sin(vScroll * 12.0 + r * 6.0) * 0.3;
      col *= jetPulse;
    }

    // ══ BRIGHTNESS WITH CAPS ══
    float finalBright = (glow + core * 1.4) * vBrightness;
    finalBright = min(finalBright, 2.2);  // Cap to prevent overexposure
    
    // Photon ring gets extra boost
    if (vType > 0.5 && vType < 1.5) {
      finalBright *= 1.4;
    }
    
    col *= finalBright;

    // ══ ALPHA OUTPUT ══
    float alpha = (glow + core * 1.3) * vAlpha;
    
    // Horizon is nearly opaque black
    if (vType < 0.5) {
      alpha = 0.98;  // Almost fully opaque
    }
    
    // Photon ring is intensely bright but slightly transparent
    if (vType >= 0.5 && vType < 1.5) {
      alpha = min(alpha * 1.3, 0.96);
    }
    
    alpha = clamp(alpha, 0.0, 0.97);

    gl_FragColor = vec4(col, alpha);
  }
`;

/* ═══════════════════════════════════════════════════════
   Particle Distribution:
   
   Type 0 (Horizon):  0..2999     — Event horizon shadow, r ∈ [0, 0.5]
   Type 1 (Photon):   3000..22999 — Blue-white photon ring, r ∈ [0.5, 1.0]
   Type 2 (Inner):    23000..47999— Crimson accretion, r ∈ [1.0, 2.2]
   Type 3 (Mid):      48000..75999— Orange-red disk, r ∈ [2.2, 4.0]
   Type 4 (Outer):    76000..91999— Gold/amber halo, r ∈ [4.0, 6.5]
   Type 5 (Jets):     92000..99999— Polar plasma jets, r ∈ [0.5, 5.0] vertical
   
   Total: 100K particles
   ═══════════════════════════════════════════════════════ */

export default function BlackHoleParticles() {
  const ref = useRef();
  const { viewport } = useThree();

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uScroll: { value: 0 },
    uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
    uMouse: { value: new THREE.Vector2(0, 0) },
    uScale: { value: 1.0 },
    uRotationX: { value: 0.35 },
    uChaos: { value: 0.0 },
  }), []);

  const geometryData = useMemo(() => {
    const positions = new Float32Array(TOTAL * 3);
    const types = new Float32Array(TOTAL);
    const radii = new Float32Array(TOTAL);
    const angles = new Float32Array(TOTAL);
    const phases = new Float32Array(TOTAL);
    const sizes = new Float32Array(TOTAL);
    const brightnesses = new Float32Array(TOTAL);
    const randomIds = new Float32Array(TOTAL);

    for (let i = 0; i < TOTAL; i++) {
      let type, radius, angle, phase, size, brightness;

      if (i < 3000) {
        // ══ EVENT HORIZON — Dark shadow core ══
        type = 0;
        radius = Math.pow(Math.random(), 2.0) * 0.5;  // Concentrate at very center
        angle = Math.random() * Math.PI * 2;
        phase = Math.random();
        size = 0.3 + Math.random() * 0.3;
        brightness = 0.02;  // Nearly invisible

      } else if (i < 23000) {
        // ══ PHOTON RING — Blinding blue-white ══
        type = 1;
        radius = 0.5 + Math.pow(Math.random(), 3.0) * 0.5;  // Tight ring
        angle = Math.random() * Math.PI * 2;
        phase = Math.random();
        size = 1.2 + Math.random() * 1.0;
        brightness = 1.0 + Math.random() * 0.5;  // Very bright!

      } else if (i < 48000) {
        // ══ INNER ACCRETION DISK — Crimson plasma ══
        type = 2;
        radius = 1.0 + Math.pow(Math.random(), 0.6) * 1.2;  // r ∈ [1.0, 2.2]
        angle = Math.random() * Math.PI * 2;
        phase = Math.random();
        size = 0.7 + Math.random() * 0.6;
        brightness = 0.8 + Math.random() * 0.35;

      } else if (i < 76000) {
        // ══ MID DISK — Fiery orange-red ══
        type = 3;
        radius = 2.2 + Math.pow(Math.random(), 0.5) * 1.8;  // r ∈ [2.2, 4.0]
        angle = Math.random() * Math.PI * 2;
        phase = Math.random();
        size = 0.6 + Math.random() * 0.7;
        brightness = 0.65 + Math.random() * 0.3;

      } else if (i < 92000) {
        // ══ OUTER HALO — Gold/amber cooling ══
        type = 4;
        radius = 4.0 + Math.pow(Math.random(), 0.4) * 2.5;  // r ∈ [4.0, 6.5]
        angle = Math.random() * Math.PI * 2;
        phase = Math.random();
        size = 0.4 + Math.random() * 0.5;
        brightness = 0.4 + Math.random() * 0.25;

      } else {
        // ══ RELATIVISTIC JETS — Polar streams ══
        type = 5;
        radius = 0.5 + Math.pow(Math.random(), 0.7) * 4.5;  // Height from pole
        angle = Math.random() * Math.PI * 2;
        phase = Math.random();
        size = 0.3 + Math.random() * 0.5;
        brightness = 0.5 + Math.random() * 0.4;
      }

      positions[i * 3] = 0;
      positions[i * 3 + 1] = 0;
      positions[i * 3 + 2] = 0;

      types[i] = type;
      radii[i] = radius;
      angles[i] = angle;
      phases[i] = phase;
      sizes[i] = size;
      brightnesses[i] = brightness;
      randomIds[i] = Math.random();
    }

    return { positions, types, radii, angles, phases, sizes, brightnesses, randomIds };
  }, []);

  // Per-frame update
  useFrame((state) => {
    uniforms.uTime.value = state.clock.elapsedTime;

    // Smooth mouse tracking
    const target = new THREE.Vector2(state.pointer.x, state.pointer.y);
    uniforms.uMouse.value.lerp(target, 0.05);

    // Mouse Y → pitch
    const targetRotY = state.pointer.y * 0.5 + 0.5;
    const targetPitch = -0.4 + targetRotY * 1.2;
    uniforms.uRotationX.value = THREE.MathUtils.lerp(uniforms.uRotationX.value, targetPitch, 0.03);

    // Proximity chaos
    const mouseDist = Math.sqrt(state.pointer.x ** 2 + state.pointer.y ** 2);
    const targetChaos = mouseDist < 0.35 ? (0.35 - mouseDist) * 2.5 : 0.0;
    uniforms.uChaos.value = THREE.MathUtils.lerp(uniforms.uChaos.value, targetChaos, 0.04);
  });

  // Scroll setter
  useEffect(() => {
    window.__saturnSetScroll = (val) => {
      if (uniforms.uScroll) uniforms.uScroll.value = val;
    };
    return () => { delete window.__saturnSetScroll; };
  }, [uniforms]);

  const { positions, types, radii, angles, phases, sizes, brightnesses, randomIds } = geometryData;

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={TOTAL} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-aType" count={TOTAL} array={types} itemSize={1} />
        <bufferAttribute attach="attributes-aRadius" count={TOTAL} array={radii} itemSize={1} />
        <bufferAttribute attach="attributes-aAngle" count={TOTAL} array={angles} itemSize={1} />
        <bufferAttribute attach="attributes-aPhase" count={TOTAL} array={phases} itemSize={1} />
        <bufferAttribute attach="attributes-aSize" count={TOTAL} array={sizes} itemSize={1} />
        <bufferAttribute attach="attributes-aBrightness" count={TOTAL} array={brightnesses} itemSize={1} />
        <bufferAttribute attach="attributes-aRandomId" count={TOTAL} array={randomIds} itemSize={1} />
      </bufferGeometry>
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

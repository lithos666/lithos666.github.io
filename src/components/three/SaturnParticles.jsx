import { useRef, useMemo, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

/* ═══════════════════════════════════════════════════════
   "The Intelligent Saturn" v3 — Gold Edition
   
   Inspired by Mr.lun's 1.2M particle Saturn reference:
   ── Realistic multi-ring structure (C / B / Cassini / A / F)
   ── Deep gold & warm amber color palette (#c5a059 family)
   ── Oblate spheroid body (Y-axis 0.9 compression)
   ── LOD culling for performance
   ── Chaos turbulence on close approach
   ── Mouse-driven interaction (replaces MediaPipe hand tracking)
   ── Scale-based color mixing (deep gold ↔ original color)

   Total: ~100K particles @ 60fps
   ═══════════════════════════════════════════════════════ */

const TOTAL = 100000;
const R_PLANET = 2.0; // Planet base radius (reference used 18 at camera z=100)

/* ── Vertex Shader v3 — Gold Saturn with chaos turbulence + LOD ── */
const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uScroll;        // 0 → 1 (scroll-driven timeline)
  uniform float uPixelRatio;
  uniform vec2 uMouse;          // Normalized mouse position [-1, 1]
  uniform float uScale;         // Zoom level (mouse wheel / pinch)
  uniform float uRotationX;     // Pitch angle (mouse Y position)
  uniform float uChaos;         // Chaos intensity (0–1, triggered by proximity)

  attribute float aType;        // 0=body, 1=ringC, 2=ringB, 3=ringCassini, 4=ringA, 5=ringF
  attribute float aRadius;      // orbital radius / distance from center
  attribute float aAngle;       // initial angle in orbit
  attribute float aPhase;       // random phase for variation
  attribute float aSize;        // base size of each particle
  attribute float aBrightness;  // base brightness factor
  attribute float aRandomId;    // random ID for LOD culling

  varying vec3 vColor;
  varying float vDist;
  varying float vOpacity;
  varying float vScaleFactor;
  varying float vIsRing;
  varying float vType;
  varying float vScroll;

  // Simple hash for noise
  float hash(float n) { return fract(sin(n) * 43758.5453123); }
  
  // 2D rotation matrix
  mat2 rotate2d(float _angle){
    return mat2(cos(_angle),-sin(_angle), sin(_angle),cos(_angle));
  }

  void main() {
    vType = aType;
    vScroll = uScroll;
    
    // ── LOD Culling — skip particles when zoomed out ──
    float normScaleLOD = clamp((uScale - 0.15) / 2.35, 0.0, 1.0);
    float visibilityThreshold = 0.85 + pow(normScaleLOD, 1.2) * 0.15;
    if (aRandomId > visibilityThreshold) {
      gl_Position = vec4(0.0);
      gl_PointSize = 0.0;
      return;
    }

    float t = uTime;
    vec3 pos;
    float orbitRadius = aRadius;
    vIsRing = step(0.5, aType);  // 0 for body, 1 for all rings

    if (aType < 0.5) {
      // ══ BODY: Oblate spheroid (Saturn is flattened) ══
      float theta = aAngle;
      float phi = aPhase * 3.14159;
      float r = orbitRadius;
      
      pos = vec3(
        r * sin(phi) * cos(theta),
        r * cos(phi) * 0.9,        // ← Y-axis compression (oblate!)
        r * sin(phi) * sin(theta)
      );
      
      // Slow body rotation
      float bodyAngle = t * 0.03;
      pos.xz = rotate2d(bodyAngle) * pos.xz;

    } else {
      // ══ RINGS: Multi-zone structure with Kepler speeds ══
      float tilt = 26.73 * 3.14159 / 180.0;  // Real Saturn axial tilt!
      float orbitSpeed;
      
      // Different rings have different base speeds
      if (aType < 1.5) orbitSpeed = 6.0;           // Ring C: slow inner
      else if (aType < 2.5) orbitSpeed = 8.0;      // Ring B: bright main
      else if (aType < 3.5) orbitSpeed = 7.5;      // Cassini: gap
      else if (aType < 4.5) orbitSpeed = 7.0;      // Ring A: outer
      else orbitSpeed = 5.5;                         // Ring F: thin outer
      
      // Kepler's 3rd Law: ω ∝ R^(-0.5)
      float keplerSpeed = orbitSpeed / sqrt(max(orbitRadius, 0.3)) * 0.35;
      float angle = aAngle + t * keplerSpeed;
      
      pos = vec3(
        cos(angle) * orbitRadius,
        sin(angle) * orbitRadius * sin(tilt) + (aPhase - 0.5) * aSize * 0.08,
        sin(angle) * orbitRadius * cos(tilt)
      );
    }

    // ══ GLOBAL X-AXIS ROTATION (pitch control via mouse Y) ══
    float cx = cos(uRotationX);
    float sx = sin(uRotationX);
    float ry = pos.y * cx - pos.z * sx;
    float rz = pos.y * sx + pos.z * cx;
    pos.y = ry;
    pos.z = rz;

    // ══ SCROLL TIMELINE: Three-phase narrative ══
    // Phase 1 (0–0.4): Camera rush-in
    // Phase 2 (0.4–0.7): Chaos explosion
    // Phase 3 (0.7–1.0): Dissipate & fade out
    
    if (uScroll > 0.001) {
      float phase1End = 0.4;
      float phase2End = 0.7;
      
      // Phase 2: Chaos explosion
      if (uScroll > phase1End) {
        float phase2Progress = smoothstep(phase1End, phase2End, uScroll);
        float explodeStrength = smoothstep(0.0, 1.0, phase2Progress);
        
        vec3 dir = normalize(pos + vec3(0.001));
        
        // High-frequency noise displacement
        float n1 = hash(pos.x * 10.0 + t) * 2.0 - 1.0;
        float n2 = hash(pos.y * 10.0 + t * 1.3) * 2.0 - 1.0;
        float n3 = hash(pos.z * 10.0 + t * 0.7) * 2.0 - 1.0;
        
        float chaosAmount = pow(phase2Progress, 1.8) * 6.0;
        pos += dir * explodeStrength * (3.0 + abs(n1) * 0.5);
        pos += vec3(n1, n2, n3) * chaosAmount * 0.3;
      }
      
      // Push toward viewer
      pos.z += uScroll * 8.0;
      
      // Subtle pre-expansion in phase 1
      if (uScroll <= phase1End) {
        float preExpand = smoothstep(0.0, phase1End, uScroll) * 0.4;
        pos *= (1.0 + preExpand);
      }
    }

    // ══ MOUSE CHAOS TURBULENCE (from reference code) ══
    // When user interacts closely, simulate gas turbulence
    if (uChaos > 0.01) {
      float highFreqTime = t * 40.0;
      float noiseX = sin(highFreqTime + pos.x * 10.0) * hash(pos.y);
      float noiseY = cos(highFreqTime + pos.y * 10.0) * hash(pos.x);
      float noiseZ = sin(highFreqTime * 0.5) * hash(pos.z);
      
      vec3 noiseVec = vec3(noiseX, noiseY, noiseZ) * uChaos * 2.5;
      pos += noiseVec;
    }

    // ══ SUBTLE MOUSE GRAVITY PULL ══
    vec2 toMouse = uMouse * 4.0 - pos.xy;
    float mouseDist = length(toMouse);
    float mousePull = exp(-mouseDist * 0.06) * 0.2 * (1.0 - uScroll * 1.2);
    mousePull = max(mousePull, 0.0);
    pos.xy += normalize(toMouse + vec2(0.001)) * mousePull;

    // Final position → clip space
    vec4 mvPosition = modelViewMatrix * vec4(pos * uScale, 1.0);
    float dist = -mvPosition.z;
    vDist = dist;
    vScaleFactor = uScale;

    // Point size with perspective
    float baseSize = aSize * uPixelRatio;
    float pointSize = baseSize * (350.0 / dist);
    pointSize *= 0.55;
    
    // Smaller points for body at close range
    if (aType < 0.5 && dist < 50.0) {
      pointSize *= 0.8;
    }
    
    // Slight growth during scroll explosion
    pointSize *= (1.0 + uScroll * 0.4);

    gl_PointSize = clamp(pointSize, 0.5, 200.0);
    gl_Position = projectionMatrix * mvPosition;

    // Pass color data (computed from type in fragment shader)
    vOpacity = aBrightness;
  }
`;

/* ── Fragment Shader v3 — Gold palette + scale-based color mix + close-range enhancement ── */
const fragmentShader = /* glsl */ `
  varying vec3 vColor;
  varying float vDist;
  varying float vOpacity;
  varying float vScaleFactor;
  varying float vIsRing;
  varying float vType;
  varying float vScroll;

  // ══ SATURN GOLD PALETTE (from reference #c5a059 family) ══
  const vec3 DEEP_GOLD      = vec3(0.77, 0.63, 0.35);  // #C5A059
  const vec3 WARM_CREAM     = vec3(0.89, 0.86, 0.77);  // #E3DAC5
  const vec3 AMBER          = vec3(0.79, 0.63, 0.44);  // #C9A070
  const vec3 DARK_GOLD      = vec3(0.69, 0.55, 0.33);  // #B08D55
  const vec3 RING_DARK      = vec3(0.16, 0.15, 0.13);  // #2A2520 — C ring
  const vec3 RING_BRIGHT_INNER = vec3(0.80, 0.75, 0.63); // #CDBFA0 — B ring inner
  const vec3 RING_BRIGHT_OUTER= vec3(0.86, 0.80, 0.73); // #DCCBBA — B ring outer
  const vec3 CASSINI_BLACK  = vec3(0.02, 0.02, 0.02);  // #050505
  const vec3 RING_A_GRAY    = vec3(0.60, 0.56, 0.52);  // #989085 — A ring
  const vec3 RING_F_PALE    = vec3(0.69, 0.69, 0.63);  // #AFAFA0 — F ring
  
  // Hash function for subtle randomness
  float hash(float n) { return fract(sin(n) * 43758.5453123); }

  void main() {
    // Circular point shape
    vec2 cxy = 2.0 * gl_PointCoord - 1.0;
    float r = dot(cxy, cxy);
    if (r > 1.0) discard;

    // Soft glow falloff
    float glow = smoothstep(1.0, 0.3, r);
    float core = smoothstep(0.12, 0.0, r) * 0.4;

    // ══ COLOR BY TYPE: Realistic multi-ring palette ══
    vec3 baseColor;
    float brightnessMult;

    if (vType < 0.5) {
      // ══ PLANET BODY: Warm gold with latitude bands ══
      // Simulate banded texture via vIsRing (abused as lat proxy here) and hash
      float bandNoise = hash(vDist * 0.5) * 0.15;
      float latBand = sin(vDist * 2.0 + hash(vDist) * 6.28) * 0.5 + 0.5;
      
      baseColor = mix(WARM_CREAM, AMBER, latBand);
      baseColor = mix(baseColor, DARK_GOLD, bandNoise);
      baseColor = mix(baseColor, DEEP_GOLD, smoothstep(0.0, 1.2, vDist / 3.0) * 0.3);
      brightnessMult = 0.9;

    } else if (vType < 1.5) {
      // ══ RING C: Dark inner ring ══
      baseColor = RING_DARK;
      brightnessMult = 0.35;

    } else if (vType < 2.5) {
      // ══ RING B: Brightest, widest — gradient inner→outer ══
      float t = smoothstep(0.0, 1.0, hash(vDist * 0.3));
      baseColor = mix(RING_BRIGHT_INNER, RING_BRIGHT_OUTER, t);
      // Some density variations
      if (sin(vDist * 3.0) > 0.7) brightnessMult = 1.15;
      else brightnessMult = 0.95;

    } else if (vType < 3.5) {
      // ══ CASSINI DIVISION: Nearly empty gap ══
      baseColor = CASSINI_BLACK;
      brightnessMult = 0.12;

    } else if (vType < 4.5) {
      // ══ RING A: Outer grayish ring ══
      baseColor = RING_A_GRAY;
      brightnessMult = 0.65;
      // Encke gap hint
      if (hash(vDist) > 0.96) brightnessMult = 0.15;

    } else {
      // ══ RING F: Thin outermost ring ══
      baseColor = RING_F_PALE;
      brightnessMult = 0.75;
    }

    // ══ SCALE-BASED COLOR MIXING (from reference) ══
    // Zoomed out → deep gold tint. Zoomed in → original colors visible
    float t = clamp((vScaleFactor - 0.15) / 2.35, 0.0, 1.0);
    float colorMix = smoothstep(0.1, 0.9, t);
    vec3 finalColor = mix(vec3(0.35, 0.22, 0.05), baseColor, colorMix); // deep gold → original

    float brightness = 0.25 + 0.85 * t;
    
    // Density alpha adjustment
    float densityAlpha = 0.30 + 0.45 * smoothstep(0.0, 0.5, t);
    
    finalColor *= brightness * brightnessMult;

    // ══ CLOSE-RANGE TEXTURE ENHANCEMENT ══
    if (vDist < 40.0) {
      float closeMix = 1.0 - (vDist / 40.0);
      if (vType < 0.5) {
        // Body: increase contrast, deeper textures
        vec3 deepTexture = pow(baseColor, vec3(1.4)) * 1.5;
        finalColor = mix(finalColor, deepTexture, closeMix * 0.7);
      } else {
        // Rings: add dust feel
        finalColor += vec3(0.12, 0.10, 0.07) * closeMix;
      }
    }

    // ══ SCROLL FADE: Phase 3 dissipation (0.7 → 1.0) ══
    float scrollAlpha = 1.0;
    if (vScroll > 0.7) {
      float dissipatePhase = smoothstep(0.7, 1.0, vScroll);
      scrollAlpha = 1.0 - pow(dissipatePhase, 4.0); // ease-out quartic
      scrollAlpha = max(scrollAlpha, 0.0);
    }

    // Depth fade near clipping plane
    float depthAlpha = 1.0;
    if (vDist < 8.0) depthAlpha = smoothstep(0.0, 8.0, vDist);
    
    // Far fade
    float farFade = smoothstep(80.0, 25.0, vDist);

    // Combine all alpha factors
    float alpha = (glow + core * 1.4) * vOpacity * densityAlpha * depthAlpha * farFade * scrollAlpha;
    alpha = clamp(alpha, 0.0, 0.92);

    gl_FragColor = vec4(finalColor, alpha);
  }
`;

/* ═══════════════════════════════════════════════════════
   Particle Distribution:
   
   Type 0 (Body):    0..24999     — oblate spheroid, r ∈ [0, R_PLANET]
   Type 1 (Ring C):  25000..34999 — dark inner, r ∈ [R*1.235, R*1.525]
   Type 2 (Ring B):  35000..64999 — bright widest, r ∈ [R*1.525, R*1.95]
   Type 3 (Cassini):65000..68999 — gap/near-empty, r ∈ [R*1.95, R*2.025]
   Type 4 (Ring A):  69000..94999 — gray outer, r ∈ [R*2.025, R*2.27]
   Type 5 (Ring F):  95000..99999 — thin outermost, r ∈ [R*2.32, R*2.34]
   
   Based on real Cassini mission ring data ratios
   ═══════════════════════════════════════════════════════ */

export default function SaturnParticles() {
  const ref = useRef();
  const { viewport } = useThree();

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uScroll: { value: 0 },
    uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
    uMouse: { value: new THREE.Vector2(0, 0) },
    uScale: { value: 1.0 },
    uRotationX: { value: 0.4 },    // Default tilt (like reference)
    uChaos: { value: 0.0 },         // Mouse-proximity chaos
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

    // Body colors (for CPU-side reference — actual coloring done in shader)
    const bodyColors = [
      new THREE.Color('#E3DAC9'),
      new THREE.Color('#D4B878'),
      new THREE.Color('#E3DACC'),
      new THREE.Color('#C4A055'),
    ];

    for (let i = 0; i < TOTAL; i++) {
      let type, radius, angle, phase, size, brightness;

      if (i < 25000) {
        // ══ BODY: 25% of particles — oblate spheroid ══
        type = 0;
        const u = Math.random();
        const v = Math.random();
        const theta = Math.PI * 2 * u;
        const phi = Math.acos(2 * v - 1);
        radius = R_PLANET * Math.pow(Math.random(), 0.33); // Bias toward surface
        
        angle = theta;
        phase = phi;
        size = 0.8 + Math.random() * 0.7;
        brightness = 0.75 + Math.random() * 0.25;

      } else if (i < 35000) {
        // ══ RING C: Dark inner (10%) ══
        type = 1;
        radius = R_PLANET * (1.235 + Math.pow(Math.random(), 0.7) * (1.525 - 1.235));
        angle = Math.PI * 2 * Math.random();
        phase = Math.random();
        size = 0.4 + Math.random() * 0.3;
        brightness = 0.25 + Math.random() * 0.15;

      } else if (i < 65000) {
        // ══ RING B: Brightest, widest (30%) ══
        type = 2;
        const t = Math.random();
        radius = R_PLANET * (1.525 + t * (1.95 - 1.525));
        angle = Math.PI * 2 * Math.random();
        phase = Math.random();
        size = 0.7 + Math.random() * 0.6;
        brightness = 0.75 + Math.random() * 0.25;
        // High-density regions
        if (Math.sin(radius * 3.0) > 0.75) brightness *= 1.2;

      } else if (i < 69000) {
        // ══ CASSINI DIVISION: Near-empty gap (4%) ══
        type = 3;
        radius = R_PLANET * (1.95 + Math.random() * (2.025 - 1.95));
        angle = Math.PI * 2 * Math.random();
        phase = Math.random();
        size = 0.2 + Math.random() * 0.2;
        brightness = 0.06 + Math.random() * 0.08;

      } else if (i < 95000) {
        // ══ RING A: Gray outer (26%) ══
        type = 4;
        radius = R_PLANET * (2.025 + Math.pow(Math.random(), 0.6) * (2.27 - 2.025));
        angle = Math.PI * 2 * Math.random();
        phase = Math.random();
        size = 0.5 + Math.random() * 0.4;
        brightness = 0.5 + Math.random() * 0.2;
        // Encke gap hint
        if (radius > R_PLANET * 2.18 && radius < R_PLANET * 2.21) brightness *= 0.15;

      } else {
        // ══ RING F: Thin outermost (5%) ══
        type = 5;
        radius = R_PLANET * (2.32 + Math.random() * 0.04);
        angle = Math.PI * 2 * Math.random();
        phase = Math.random();
        size = 0.6 + Math.random() * 0.5;
        brightness = 0.6 + Math.random() * 0.2;
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
      randomIds[i] = Math.random(); // For LOD culling
    }

    return { positions, types, radii, angles, phases, sizes, brightnesses, randomIds };
  }, []);

  // Per-frame update
  useFrame((state) => {
    uniforms.uTime.value = state.clock.elapsedTime;

    // Smooth mouse tracking
    const target = new THREE.Vector2(
      state.pointer.x,
      state.pointer.y
    );
    uniforms.uMouse.value.lerp(target, 0.05);

    // Mouse Y position → rotation X (pitch)
    const targetRotY = (state.pointer.y * 0.5 + 0.5); // 0→1 normalized
    const targetPitch = -0.5 + targetRotY * 1.3;      // -0.5 to 0.8 range
    uniforms.uRotationX.value = THREE.MathUtils.lerp(
      uniforms.uRotationX.value, targetPitch, 0.03
    );

    // Mouse distance from center → chaos intensity
    // When mouse is near center of screen (looking closely at planet), trigger turbulence
    const mouseDistFromCenter = Math.sqrt(
      state.pointer.x * state.pointer.x + state.pointer.y * state.pointer.y
    );
    const targetChaos = mouseDistFromCenter < 0.3 
      ? (0.3 - mouseDistFromCenter) * 2.0  // Max chaos when centered
      : 0.0;
    uniforms.uChaos.value = THREE.MathUtils.lerp(uniforms.uChaos.value, targetChaos, 0.04);
  });

  // Expose scroll setter
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

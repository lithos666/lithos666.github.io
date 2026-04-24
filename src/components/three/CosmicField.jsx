import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const STAR_COUNT = 6000;
const DUST_COUNT = 1200;

/* ═══════════════════════════════════════════════════════
   GLSL Vertex Shader — Cosmic Star Field
   Multi-frequency twinkle + mouse gravitational pull
   Gemini color system (deep blue, purple, magenta)
   ═══════════════════════════════════════════════════════ */
const starVertexShader = /* glsl */ `
  attribute float aSize;
  attribute float aPhase;
  attribute float aDepth;
  attribute vec3 aColor;
  attribute float aTwinkleSpeed;

  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uPixelRatio;

  varying float vAlpha;
  varying vec3 vColor;
  varying float vDepth;

  void main() {
    vColor = aColor;
    vDepth = aDepth;

    vec3 pos = position;

    /* ── Mouse gravitational pull (smooth field) ── */
    vec2 toMouse = uMouse - pos.xy;
    float mouseDist = length(toMouse);
    float pull = smoothstep(12.0, 0.0, mouseDist) * 0.18;
    vec2 pullDir = toMouse / (mouseDist + 0.001);
    pos.xy += pullDir * pull;

    /* ── Organic drift (sine-based per-particle) ── */
    float driftScale = 0.04 * (1.0 + aDepth * 0.5);
    pos.x += sin(uTime * 0.1 + aPhase * 12.0) * driftScale;
    pos.y += cos(uTime * 0.08 + aPhase * 9.0) * driftScale * 0.7;
    pos.z += sin(uTime * 0.06 + aPhase * 7.0) * driftScale * 0.4;

    /* ── Multi-frequency twinkle ── */
    float t1 = sin(uTime * aTwinkleSpeed + aPhase * 6.283);
    float t2 = sin(uTime * aTwinkleSpeed * 2.3 + aPhase * 12.566);
    float t3 = sin(uTime * aTwinkleSpeed * 0.5 + aPhase * 3.1415);
    float twinkle = 0.45 + 0.3 * t1 + 0.15 * t2 + 0.1 * t3;

    /* ── Depth-based fade (far = dim) ── */
    float depthFade = smoothstep(55.0, 3.0, -pos.z);

    vAlpha = mix(0.08, 0.9, twinkle) * depthFade;

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    float perspective = 100.0 / max(-mv.z, 0.1);
    float size = aSize * uPixelRatio * perspective * (0.5 + 0.5 * twinkle);
    gl_PointSize = clamp(size, 0.5, 32.0);
    gl_Position = projectionMatrix * mv;
  }
`;

/* ═══════════════════════════════════════════════════════
   GLSL Fragment Shader — Enhanced soft glow star with color
   Improved circular shape with better anti-aliasing
   ═══════════════════════════════════════════════════════ */
const starFragmentShader = /* glsl */ `
  varying float vAlpha;
  varying vec3 vColor;
  varying float vDepth;

  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c);
    
    // Smooth circular falloff with anti-aliasing
    if (d > 0.52) discard;

    /* Multi-layer glow for smooth circular appearance */
    // Outer glow (soft)
    float outerGlow = exp(-d * d * 5.0) * 0.4;
    
    // Mid glow
    float midGlow = exp(-d * d * 12.0) * 0.6;
    
    // Bright core
    float core = smoothstep(0.15, 0.0, d) * 0.8;
    
    /* Combined glow effect */
    float glow = outerGlow + midGlow + core;

    /* Color with intensity variation */
    vec3 col = vColor * (1.0 + core * 0.5);
    float alpha = glow * vAlpha * 0.65;

    gl_FragColor = vec4(col, alpha);
  }
`;

/* ── Gemini-inspired cosmic palette ── */
function geminiPalette() {
  return [
    new THREE.Color('#5E5CE6'), // Deep indigo (Apple)
    new THREE.Color('#7B68EE'), // Medium slate blue
    new THREE.Color('#64D2FF'), // Bright cyan (Apple)
    new THREE.Color('#BF5AF2'), // Magenta (Apple)
    new THREE.Color('#9B59B6'), // Amethyst
    new THREE.Color('#FFFFFF'), // Pure white (most stars)
    new THREE.Color('#D1D5F0'), // Silver-lavender
    new THREE.Color('#A8D8FF'), // Ice blue
  ];
}

/* ═══════════════════════════════════════════════════════
   CosmicField — 6000 stars + 1200 dust particles
   All rendered via single GLSL PointsMaterial
   ═══════════════════════════════════════════════════════ */
export default function CosmicField() {
  const pointsRef = useRef();
  const { viewport } = useThree();

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2(0, 0) },
    uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
  }), []);

  /* Generate star + dust data */
  const { positions, sizes, phases, depths, colors, twinkleSpeeds } = useMemo(() => {
    const totalCount = STAR_COUNT + DUST_COUNT;
    const pos = new Float32Array(totalCount * 3);
    const sz = new Float32Array(totalCount);
    const ph = new Float32Array(totalCount);
    const dp = new Float32Array(totalCount);
    const col = new Float32Array(totalCount * 3);
    const ts = new Float32Array(totalCount);
    const palette = geminiPalette();

    for (let i = 0; i < totalCount; i++) {
      const isDust = i >= STAR_COUNT;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      // Stars: far field spherical. Dust: near field planar
      let r, x, y, z;
      if (!isDust) {
        r = 6 + Math.random() * 40;
        x = r * Math.sin(phi) * Math.cos(theta);
        y = r * Math.sin(phi) * Math.sin(theta);
        z = -Math.random() * 50 - 2;
      } else {
        // Dust: close to camera, gentle spread
        x = (Math.random() - 0.5) * 25;
        y = (Math.random() - 0.5) * 15;
        z = -Math.random() * 10 - 0.5;
      }

      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;

      // Size
      if (!isDust) {
        const isBright = Math.random() > 0.93;
        sz[i] = isBright ? (Math.random() * 3.0 + 1.5) : (Math.random() * 1.5 + 0.2);
      } else {
        sz[i] = Math.random() * 0.8 + 0.1;
      }

      ph[i] = Math.random();
      dp[i] = 1.0 / (1.0 + Math.abs(z) * 0.015);
      ts[i] = 0.8 + Math.random() * 2.5; // Individual twinkle speed

      // Color — weighted toward Gemini palette
      const rnd = Math.random();
      let c;
      if (rnd < 0.35) {
        // White/silver (most common)
        c = palette[5 + Math.floor(Math.random() * 3)];
      } else if (rnd < 0.55) {
        // Indigo / slate blue
        c = palette[Math.floor(Math.random() * 2)];
      } else if (rnd < 0.75) {
        // Cyan / ice blue
        c = palette[2 + Math.floor(Math.random() * 2)];
      } else if (rnd < 0.9) {
        // Magenta / amethyst
        c = palette[3 + Math.floor(Math.random() * 2)];
      } else {
        // Random
        c = palette[Math.floor(Math.random() * palette.length)];
      }

      const bright = isDust ? (0.2 + Math.random() * 0.3) : (0.4 + Math.random() * 0.6);
      col[i * 3] = c.r * bright;
      col[i * 3 + 1] = c.g * bright;
      col[i * 3 + 2] = c.b * bright;
    }

    return { positions: pos, sizes: sz, phases: ph, depths: dp, colors: col, twinkleSpeeds: ts };
  }, []);

  /* Per-frame update */
  useFrame((state) => {
    uniforms.uTime.value = state.clock.elapsedTime;

    // Smooth mouse tracking with easing
    const target = new THREE.Vector2(
      state.pointer.x * (viewport.width * 0.5),
      state.pointer.y * (viewport.height * 0.5)
    );
    uniforms.uMouse.value.lerp(target, 0.025);
  });

  const totalCount = STAR_COUNT + DUST_COUNT;

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={totalCount} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-aSize" count={totalCount} array={sizes} itemSize={1} />
        <bufferAttribute attach="attributes-aPhase" count={totalCount} array={phases} itemSize={1} />
        <bufferAttribute attach="attributes-aDepth" count={totalCount} array={depths} itemSize={1} />
        <bufferAttribute attach="attributes-aColor" count={totalCount} array={colors} itemSize={3} />
        <bufferAttribute attach="attributes-aTwinkleSpeed" count={totalCount} array={twinkleSpeeds} itemSize={1} />
      </bufferGeometry>
      <shaderMaterial
        vertexShader={starVertexShader}
        fragmentShader={starFragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

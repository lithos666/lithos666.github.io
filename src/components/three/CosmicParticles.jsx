import React, { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// 宇宙尘埃粒子系统 —— 初始散布 → 凝聚成文字形态
const PARTICLE_COUNT = 800;
const STAR_COUNT = 300; // 背景星尘

const cosmicVertexShader = `
  attribute float aSize;
  attribute float aAlpha;
  attribute vec3 aColor;
  attribute float aPhase;

  uniform float uPixelRatio;
  uniform float uConvergence;

  varying float vAlpha;
  varying vec3 vColor;

  void main() {
    vAlpha = aAlpha;
    vColor = aColor;

    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);

    // Size pulsation
    float pulse = 1.0 + sin(aPhase * 3.14159 + uConvergence * 6.28) * 0.3;
    float size = aSize * uPixelRatio * pulse * (80.0 / -mvPosition.z);
    size = max(size, 1.0);

    gl_PointSize = size;
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const cosmicFragmentShader = `
  varying float vAlpha;
  varying vec3 vColor;

  void main() {
    vec2 center = gl_PointCoord - 0.5;
    float dist = length(center);
    if (dist > 0.5) discard;

    // Soft circular glow
    float alpha = smoothstep(0.5, 0.05, dist);
    alpha = pow(alpha, 1.6);

    // Inner bright core
    vec3 finalColor = vColor * (1.0 + smoothstep(0.25, 0.0, dist) * 0.6);

    gl_FragColor = vec4(finalColor, alpha * vAlpha * 0.55);
  }
`;

function sampleTextPositions(count, bounds) {
  // Pre-generate positions distributed on/around where text would be
  const positions = [];
  const textWidth = 8.5;
  const textHeight = 1.8;

  for (let i = 0; i < count; i++) {
    // Distribute roughly in text area with some randomness
    const tx = (Math.random() - 0.5) * textWidth;
    const ty = (Math.random() - 0.5) * textHeight + 0.15; // offset Y slightly up
    const tz = (Math.random() - 0.5) * 0.6;

    positions.push(new THREE.Vector3(tx, ty, tz));
  }
  return positions;
}

export default function CosmicParticles({ convergence = 0 }) {
  const pointsRef = useRef();
  const { viewport } = useThree();

  // Initialize scattered (cosmic dust) and target (text form) positions
  const data = useMemo(() => {
    const pos = new Float32Array(PARTICLE_COUNT * 3);     // current
    const scatter = new Float32Array(PARTICLE_COUNT * 3);  // initial scattered
    const target = new Float32Array(PARTICLE_COUNT * 3);   // converged target
    const sz = new Float32Array(PARTICLE_COUNT);
    const al = new Float32Array(PARTICLE_COUNT);
    const col = new Float32Array(PARTICLE_COUNT * 3);
    const phase = new Float32Array(PARTICLE_COUNT);

    // Color palette — cosmic nebula
    const palette = [
      new THREE.Color('#6e3aff'),  // deep purple
      new THREE.Color('#00bfff'),  // cyan
      new THREE.Color('#c840e9'),  // magenta
      new THREE.Color('#aabbff'),  // pale blue-white
      new THREE.Color('#ff6eb4'),  // pink
    ];

    // Target positions (roughly text-shaped area)
    const textTargets = sampleTextPositions(PARTICLE_COUNT);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      // Scattered: wide cosmic distribution
      const sx = (Math.random() - 0.5) * 24;
      const sy = (Math.random() - 0.5) * 18;
      const zRand = (Math.random() - 0.5) * 14;

      scatter[i * 3] = sx;
      scatter[i * 3 + 1] = sy;
      scatter[i * 3 + 2] = zRand;

      // Current starts at scattered
      pos[i * 3] = sx;
      pos[i * 3 + 1] = sy;
      pos[i * 3 + 2] = sz;

      // Target: text area
      const t = textTargets[i];
      target[i * 3] = t.x;
      target[i * 3 + 1] = t.y;
      target[i * 3 + 2] = t.z;

      // Size variation
      sz[i] = Math.random() * 3.5 + 1.0;
      al[i] = Math.random() * 0.55 + 0.25;
      phase[i] = Math.random(); // random phase for pulsing

      // Color
      const c = palette[Math.floor(Math.random() * palette.length)];
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }

    return { positions: pos, scatter, target, sizes: sz, alphas: al, colors: col, phase };
  }, []);

  const uniforms = useMemo(() => ({
    uPixelRatio: { value: Math.min(window.devicePixelRatio, 1.5) },
    uConvergence: { value: 0 },
  }), []);

  let frameCount = 0;

  useFrame((state) => {
    if (!pointsRef.current) return;
    frameCount++;

    const time = state.clock.elapsedTime;
    const mouse = state.pointer;
    const posArr = pointsRef.current.geometry.attributes.position.array;

    // Smooth convergence value
    const targetConv = Math.min(convergence, 1);
    uniforms.uConvergence.value += (targetConv - uniforms.uConvergence.value) * 0.025;

    const conv = uniforms.uConvergence.value;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const ix = i * 3;
      const iy = ix + 1;
      const iz = ix + 2;

      // Lerp between scatter and target based on convergence
      const easeConv = conv * conv * (3 - 2 * conv); // smoothstep

      // Base position interpolation
      const targetX = data.scatter[ix] + (data.target[ix] - data.scatter[ix]) * easeConv;
      const targetY = data.scatter[iy] + (data.target[iy] - data.scatter[iy]) * easeConv;
      const targetZ = data.scatter[iz] + (data.target[iz] - data.scatter[iz]) * easeConv;

      // Add organic motion
      const noiseX = Math.sin(time * 0.18 + i * 0.07) * (0.06 * (1 - conv));
      const noiseY = Math.cos(time * 0.22 + i * 0.09) * (0.06 * (1 - conv));

      // Mouse influence when scattered
      const mx = mouse.x * 4 * (1 - conv);
      const my = mouse.y * 3 * (1 - conv);
      const dx = mx - posArr[ix];
      const dy = my - posArr[iy];
      const distSq = dx * dx + dy * dy;
      const force = distSq > 0.01 ? (0.0008 / distSq) : 0;

      // Spring toward target
      posArr[ix] += (targetX - posArr[ix] + noiseX) * 0.045 + dx * force;
      posArr[iy] += (targetY - posArr[iy] + noiseY) * 0.045 + dy * force;
      posArr[iz] += (targetZ - posArr[iz]) * 0.045;
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={PARTICLE_COUNT} array={data.positions} itemSize={3} />
        <bufferAttribute attach="attributes-aSize" count={PARTICLE_COUNT} array={data.sizes} itemSize={1} />
        <bufferAttribute attach="attributes-aAlpha" count={PARTICLE_COUNT} array={data.alphas} itemSize={1} />
        <bufferAttribute attach="attributes-aColor" count={PARTICLE_COUNT} array={data.colors} itemSize={3} />
        <bufferAttribute attach="attributes-aPhase" count={PARTICLE_COUNT} array={data.phase} itemSize={1} />
      </bufferGeometry>
      <shaderMaterial
        vertexShader={cosmicVertexShader}
        fragmentShader={cosmicFragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// Background star field (static distant stars)
export function StarField() {
  const starsRef = useRef();
  const { positions, sizes, colors } = useMemo(() => {
    const pos = new Float32Array(STAR_COUNT * 3);
    const sz = new Float32Array(STAR_COUNT);
    const col = new Float32Array(STAR_COUNT * 3);

    const white = new THREE.Color('#ffffff');
    const blueWhite = new THREE.Color('#cce0ff');

    for (let i = 0; i < STAR_COUNT; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 40;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 30;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20 - 8;

      sz[i] = Math.random() * 1.5 + 0.3;

      const c = Math.random() > 0.7 ? blueWhite : white;
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }

    return { positions: pos, sizes: sz, colors: col };
  }, []);

  useFrame((state) => {
    if (!starsRef.current) return;
    // Subtle twinkle
    const arr = starsRef.current.geometry.attributes.aAlpha.array;
    const t = state.clock.elapsedTime;
    for (let i = 0; i < STAR_COUNT; i++) {
      arr[i] = 0.3 + Math.sin(t * 1.5 + i * 0.17) * 0.25 + Math.sin(t * 3.7 + i * 0.31) * 0.15;
    }
    starsRef.current.geometry.attributes.aAlpha.needsUpdate = true;
  });

  return (
    <points ref={starsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={STAR_COUNT} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-aSize" count={STAR_COUNT} array={sizes} itemSize={1} />
        <bufferAttribute
          attach="attributes-aAlpha"
          count={STAR_COUNT}
          array={useMemo(() => new Float32Array(Array.from({ length: STAR_COUNT }, () => Math.random() * 0.5 + 0.3)), [])}
          itemSize={1}
        />
        <bufferAttribute attach="attributes-aColor" count={STAR_COUNT} array={colors} itemSize={3} />
      </bufferGeometry>
      <shaderMaterial
        vertexShader={`
          attribute float aSize;
          attribute float aAlpha;
          attribute vec3 aColor;
          uniform float uPR;
          varying float vA;
          varying vec3 vC;
          void main() {
            vA = aAlpha;
            vC = aColor;
            vec4 mv = modelViewMatrix * vec4(position,1.);
            gl_PointSize = aSize * uPR * (60./-mv.z);
            gl_PointSize = max(gl_PointSize, 0.8);
            gl_Position = projectionMatrix * mv;
          }
        `}
        fragmentShader={`
          varying float vA;
          varying vec3 vC;
          void main() {
            float d = length(gl_PointCoord-0.5);
            if(d>0.5) discard;
            float a = smoothstep(0.5,0.1,d)*vA;
            gl_FragColor = vec4(vC,a);
          }
        `}
        uniforms={{ uPR: { value: Math.min(window.devicePixelRatio, 1.5) } }}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

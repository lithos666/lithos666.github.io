import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Reduced counts for performance
const PARTICLE_COUNT = 500;
const CONNECTION_COUNT = 80;
const MAX_LINES = CONNECTION_COUNT * 20;

const particleVertexShader = `
  attribute float aSize;
  attribute float aAlpha;
  attribute vec3 aColor;
  uniform float uPixelRatio;
  varying float vAlpha;
  varying vec3 vColor;

  void main() {
    vAlpha = aAlpha;
    vColor = aColor;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = aSize * uPixelRatio * (90.0 / -mvPosition.z);
    gl_PointSize = max(gl_PointSize, 1.0);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const particleFragmentShader = `
  varying float vAlpha;
  varying vec3 vColor;

  void main() {
    vec2 center = gl_PointCoord - vec2(0.5);
    float dist = length(center);
    if (dist > 0.5) discard;
    float alpha = smoothstep(0.5, 0.05, dist);
    gl_FragColor = vec4(vColor, alpha * vAlpha * 0.60);
  }
`;

const lineFragmentShader = `
  varying float vLineAlpha;
  void main() {
    gl_FragColor = vec4(0.45, 0.3, 0.95, vLineAlpha * 0.12);
  }
`;

export default function ParticleHero() {
  const pointsRef = useRef();
  const linesRef = useRef();

  const data = useMemo(() => {
    const pos = new Float32Array(PARTICLE_COUNT * 3);
    const vel = new Float32Array(PARTICLE_COUNT * 3);
    const sz = new Float32Array(PARTICLE_COUNT);
    const al = new Float32Array(PARTICLE_COUNT);
    const col = new Float32Array(PARTICLE_COUNT * 3);

    const palette = [
      new THREE.Color(0x6e3aff),
      new THREE.Color(0x00bfff),
      new THREE.Color(0xc840e9),
      new THREE.Color(0xaabbff),
    ];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 14;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 6 - 2;

      vel[i * 3] = (Math.random() - 0.5) * 0.006;
      vel[i * 3 + 1] = (Math.random() - 0.5) * 0.006;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.003;

      sz[i] = Math.random() * 3.5 + 1.5;
      al[i] = Math.random() * 0.45 + 0.28;

      const c = palette[Math.floor(Math.random() * palette.length)];
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }

    return {
      positions: pos,
      velocities: vel,
      sizes: sz,
      alphas: al,
      colors: col,
      linePositions: new Float32Array(MAX_LINES * 6),
      lineAlphas: new Float32Array(MAX_LINES * 2),
    };
  }, []);

  const uniforms = useMemo(() => ({
    uPixelRatio: { value: Math.min(window.devicePixelRatio, 1.5) },
  }), []);

  let frameCount = 0;

  useFrame((state) => {
    if (!pointsRef.current) return;

    frameCount++;
    const time = state.clock.elapsedTime;
    const posArr = pointsRef.current.geometry.attributes.position.array;
    const mouse = state.pointer;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const ix = i * 3;
      const iy = ix + 1;
      const iz = ix + 2;

      const px = posArr[ix];
      const py = posArr[iy];

      // Mouse attraction
      const mwx = mouse.x * 5;
      const mwy = mouse.y * 3.5;
      const dx = mwx - px;
      const dy = mwy - py;
      const dz = 0 - posArr[iz];
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

      if (dist < 3.5 && dist > 0.15) {
        const force = ((3.5 - dist) / 3.5) * 0.0025;
        data.velocities[ix] += (dx / dist) * force;
        data.velocities[iy] += (dy / dist) * force;
        data.velocities[iz] += (dz / dist) * force * 0.25;
      }

      // Ambient drift
      data.velocities[ix] += Math.sin(time * 0.25 + py * 0.35) * 0.0003;
      data.velocities[iy] += Math.cos(time * 0.22 + px * 0.28) * 0.0003;

      // Center gravity
      data.velocities[ix] -= px * 0.000025;
      data.velocities[iy] -= py * 0.000025;

      // Damping
      data.velocities[ix] *= 0.986;
      data.velocities[iy] *= 0.986;
      data.velocities[iz] *= 0.986;

      posArr[ix] += data.velocities[ix];
      posArr[iy] += data.velocities[iy];
      posArr[iz] += data.velocities[iz];

      if (Math.abs(posArr[ix]) > 8) { posArr[ix] *= -0.94; data.velocities[ix] *= -0.45; }
      if (Math.abs(posArr[iy]) > 6.5) { posArr[iy] *= -0.94; data.velocities[iy] *= -0.45; }
      if (Math.abs(posArr[iz] + 2) > 4.5) {
        posArr[iz] = -2 - Math.sign(posArr[iz] + 2) * 4.4;
        data.velocities[iz] *= -0.45;
      }
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true;

    // Update lines every other frame for performance
    if (linesRef.current && frameCount % 2 === 0) {
      const lp = linesRef.current.geometry.attributes.position.array;
      const la = linesRef.current.geometry.attributes.aLineAlpha.array;
      let lineIdx = 0;

      for (let i = 0; i < CONNECTION_COUNT && lineIdx < MAX_LINES; i++) {
        for (let j = i + 1; j < CONNECTION_COUNT && lineIdx < MAX_LINES; j++) {
          const ax = posArr[i * 3], ay = posArr[i * 3 + 1], az = posArr[i * 3 + 2];
          const bx = posArr[j * 3], by = posArr[j * 3 + 1], bz = posArr[j * 3 + 2];
          const dSq = (ax - bx) ** 2 + (ay - by) ** 2 + (az - bz) ** 2;
          const threshold = 6.25; // 2.5^2

          if (dSq < threshold) {
            const d = Math.sqrt(dSq);
            const li = lineIdx * 6;
            lp[li] = ax; lp[li + 1] = ay; lp[li + 2] = az;
            lp[li + 3] = bx; lp[li + 4] = by; lp[li + 5] = bz;
            la[lineIdx * 2] = 1.0 - d / 2.5;
            la[lineIdx * 2 + 1] = 1.0 - d / 2.5;
            lineIdx++;
          }
        }
      }

      linesRef.current.geometry.setDrawRange(0, lineIdx * 2);
      linesRef.current.geometry.attributes.position.needsUpdate = true;
      linesRef.current.geometry.attributes.aLineAlpha.needsUpdate = true;
    }
  });

  return (
    <>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={PARTICLE_COUNT} array={data.positions} itemSize={3} />
          <bufferAttribute attach="attributes-aSize" count={PARTICLE_COUNT} array={data.sizes} itemSize={1} />
          <bufferAttribute attach="attributes-aAlpha" count={PARTICLE_COUNT} array={data.alphas} itemSize={1} />
          <bufferAttribute attach="attributes-aColor" count={PARTICLE_COUNT} array={data.colors} itemSize={3} />
        </bufferGeometry>
        <shaderMaterial
          vertexShader={particleVertexShader}
          fragmentShader={particleFragmentShader}
          uniforms={uniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={MAX_LINES * 2} array={data.linePositions} itemSize={3} />
          <bufferAttribute attach="attributes-aLineAlpha" count={MAX_LINES * 2} array={data.lineAlphas} itemSize={1} />
        </bufferGeometry>
        <shaderMaterial
          vertexShader={`attribute float aLineAlpha; varying float vLineAlpha; void main() { vLineAlpha = aLineAlpha; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`}
          fragmentShader={lineFragmentShader}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>
    </>
  );
}

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/* ═══════════════════════════════════════════════════════
   ShootingStars — GLSL 流星轨迹系统
   12 meteors with stochastic spawning, gemini gradient
   ═══════════════════════════════════════════════════════ */

const METEOR_COUNT = 12;
const TRAIL_POINTS = 20; // Points per meteor trail

/* ── GLSL: Trail vertex ── */
const meteorVertexShader = /* glsl */ `
  attribute float aOpacity;
  attribute float aProgress;
  attribute float aTrailIndex;
  attribute float aTrailLength;

  uniform float uPixelRatio;

  varying float vOpacity;
  varying float vProgress;
  varying float vTrailT;

  void main() {
    vOpacity = aOpacity;
    vProgress = aProgress;
    vTrailT = aTrailIndex / max(aTrailLength, 1.0);

    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = max((3.0 - vTrailT * 2.5) * aOpacity * uPixelRatio * (50.0 / max(-mv.z, 0.1)), 0.5);
    gl_Position = projectionMatrix * mv;
  }
`;

/* ── GLSL: Trail fragment — Gemini gradient with soft glow ── */
const meteorFragmentShader = /* glsl */ `
  varying float vOpacity;
  varying float vProgress;
  varying float vTrailT;

  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c);
    if (d > 0.5) discard;

    /* Soft glow */
    float glow = exp(-d * d * 6.0);
    float alpha = glow * vOpacity * (1.0 - vTrailT * 0.7);

    /* Head is brighter, tail fades */
    float headBright = 1.0 - vTrailT * 0.6;

    /* Gemini color gradient: purple → cyan → magenta */
    vec3 colA = vec3(0.37, 0.36, 0.90); // #5E5CE6
    vec3 colB = vec3(0.39, 0.82, 1.00); // #64D2FF
    vec3 colC = vec3(0.75, 0.35, 0.95); // #BF5AF2

    float t = vProgress + vTrailT * 0.3;
    vec3 col;
    if (t < 0.5) {
      col = mix(colA, colB, t * 2.0);
    } else {
      col = mix(colB, colC, (t - 0.5) * 2.0);
    }

    col *= headBright;

    gl_FragColor = vec4(col, alpha * 0.7);
  }
`;

/* ── Meteor data ── */
function createMeteor() {
  return {
    active: false,
    cooldown: 2 + Math.random() * 10,
    pos: new THREE.Vector3(),
    vel: new THREE.Vector3(),
    life: 0,
    maxLife: 0,
    trailPositions: [], // array of Vector3
  };
}

export default function ShootingStars() {
  const ref = useRef();

  const meteors = useMemo(() => Array.from({ length: METEOR_COUNT }, createMeteor), []);

  const totalPoints = METEOR_COUNT * TRAIL_POINTS;
  const { positions, opacities, progresses, trailIndices, trailLengths } = useMemo(() => ({
    positions: new Float32Array(totalPoints * 3),
    opacities: new Float32Array(totalPoints),
    progresses: new Float32Array(totalPoints),
    trailIndices: new Float32Array(totalPoints),
    trailLengths: new Float32Array(totalPoints),
  }), []);

  const uniforms = useMemo(() => ({
    uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
  }), []);

  useFrame((_, delta) => {
    if (!ref.current) return;
    const dt = Math.min(delta, 0.05); // Cap to prevent jumps

    for (let i = 0; i < METEOR_COUNT; i++) {
      const m = meteors[i];
      const base = i * TRAIL_POINTS;

      if (!m.active) {
        m.cooldown -= dt;
        if (m.cooldown <= 0) {
          // Spawn
          m.active = true;
          m.maxLife = 0.5 + Math.random() * 1.5;
          m.life = m.maxLife;
          m.trailPositions = [];

          // Start from screen edge / top area
          const side = Math.random();
          if (side < 0.4) {
            // From top
            m.pos.set(
              (Math.random() - 0.5) * 30,
              10 + Math.random() * 5,
              -8 - Math.random() * 25
            );
          } else if (side < 0.7) {
            // From right
            m.pos.set(
              12 + Math.random() * 8,
              3 + Math.random() * 10,
              -5 - Math.random() * 20
            );
          } else {
            // From left
            m.pos.set(
              -(12 + Math.random() * 8),
              3 + Math.random() * 10,
              -5 - Math.random() * 20
            );
          }

          // Direction: generally downward with horizontal component
          const angle = -Math.PI * 0.3 + (Math.random() - 0.5) * 0.5;
          const speed = 10 + Math.random() * 15;
          const hDir = m.pos.x > 0 ? -1 : 1;
          m.vel.set(
            hDir * Math.abs(Math.cos(angle)) * speed * 0.6,
            Math.sin(angle) * speed,
            -Math.random() * 3
          );
        }

        // Hide all trail points
        for (let j = 0; j < TRAIL_POINTS; j++) {
          opacities[base + j] = 0;
        }
      } else {
        m.life -= dt;

        if (m.life <= 0) {
          m.active = false;
          m.cooldown = 3 + Math.random() * 18;
          // Fade out all trail
          for (let j = 0; j < TRAIL_POINTS; j++) {
            opacities[base + j] = 0;
          }
        } else {
          // Update position
          m.pos.x += m.vel.x * dt;
          m.pos.y += m.vel.y * dt;
          m.pos.z += m.vel.z * dt;

          // Add to trail
          m.trailPositions.unshift(m.pos.clone());
          if (m.trailPositions.length > TRAIL_POINTS) {
            m.trailPositions.length = TRAIL_POINTS;
          }

          // Life ratio for fade
          const lifeRatio = m.life / m.maxLife;
          const fadeIn = Math.min(1, (1 - lifeRatio) * 6);
          const fadeOut = Math.pow(lifeRatio, 0.4);

          // Write trail to buffers
          const trailLen = m.trailPositions.length;
          for (let j = 0; j < TRAIL_POINTS; j++) {
            const idx = base + j;
            if (j < trailLen) {
              const tp = m.trailPositions[j];
              positions[idx * 3] = tp.x;
              positions[idx * 3 + 1] = tp.y;
              positions[idx * 3 + 2] = tp.z;
              opacities[idx] = fadeIn * fadeOut * (1 - j / TRAIL_POINTS);
              progresses[idx] = lifeRatio;
              trailIndices[idx] = j;
              trailLengths[idx] = TRAIL_POINTS;
            } else {
              opacities[idx] = 0;
              trailIndices[idx] = 0;
              trailLengths[idx] = 1;
            }
          }
        }
      }
    }

    // Upload
    const geo = ref.current.geometry;
    geo.attributes.position.needsUpdate = true;
    geo.attributes.aOpacity.needsUpdate = true;
    geo.attributes.aProgress.needsUpdate = true;
    geo.attributes.aTrailIndex.needsUpdate = true;
    geo.attributes.aTrailLength.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={totalPoints} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-aOpacity" count={totalPoints} array={opacities} itemSize={1} />
        <bufferAttribute attach="attributes-aProgress" count={totalPoints} array={progresses} itemSize={1} />
        <bufferAttribute attach="attributes-aTrailIndex" count={totalPoints} array={trailIndices} itemSize={1} />
        <bufferAttribute attach="attributes-aTrailLength" count={totalPoints} array={trailLengths} itemSize={1} />
      </bufferGeometry>
      <shaderMaterial
        vertexShader={meteorVertexShader}
        fragmentShader={meteorFragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

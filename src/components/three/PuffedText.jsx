import { useMemo, useRef, useState, useCallback } from 'react';
import { Text3D, Center, Float } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const FONT_URL = '/helvetiker_bold.typeface.json';
const TEXT = 'PORTFOLIO';
const LETTERS = TEXT.split('');

/* ═══════════════════════════════════════════════════════
   Apple-style clean white material — no terrazzo
   Pure #FFFFFF with subtle cool shadow
   ═══════════════════════════════════════════════════════ */
function createWhiteTexture() {
  const S = 512;
  const canvas = document.createElement('canvas');
  canvas.width = S;
  canvas.height = S;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, S, S);

  // Ultra-subtle grain for realism (Apple matte feel)
  for (let i = 0; i < 3000; i++) {
    const x = Math.random() * S;
    const y = Math.random() * S;
    const v = 245 + Math.random() * 10;
    ctx.fillStyle = `rgba(${v}, ${v}, ${v}, 0.04)`;
    ctx.fillRect(x, y, 1, 1);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  return tex;
}

/* ═══════════════════════════════════════════════════════
   Single Letter — independent hover, float, rotation
   Apple aesthetic: clean, minimal, precise
   ═══════════════════════════════════════════════════════ */
function PuffedLetter({ char, index, total, whiteMap, xOffset }) {
  const meshRef = useRef();
  const matRef = useRef();
  const [hovered, setHovered] = useState(false);

  const anim = useRef({
    scale: 1, targetScale: 1,
    emissive: 0, targetEmissive: 0,
    offsetY: 0, targetOffsetY: 0,
    roughness: 0.85, targetRoughness: 0.85,
    clearcoat: 0.1, targetClearcoat: 0.1,
    envMap: 0.35, targetEnvMap: 0.35,
  });

  const onOver = useCallback((e) => {
    e.stopPropagation();
    document.body.style.cursor = 'pointer';
    setHovered(true);
  }, []);

  const onOut = useCallback(() => {
    document.body.style.cursor = '';
    setHovered(false);
  }, []);

  useFrame((state, delta) => {
    if (!meshRef.current || !matRef.current) return;
    const t = state.clock.elapsedTime;
    const a = anim.current;
    const dt = Math.min(delta, 0.05);
    const speed = 4.0;

    if (hovered) {
      a.targetScale = 1.15;
      a.targetEmissive = 0.18;
      a.targetOffsetY = 0.18;
      a.targetRoughness = 0.45;
      a.targetClearcoat = 0.55;
      a.targetEnvMap = 0.9;
    } else {
      a.targetScale = 1.0;
      a.targetEmissive = 0;
      a.targetOffsetY = 0;
      a.targetRoughness = 0.85;
      a.targetClearcoat = 0.1;
      a.targetEnvMap = 0.35;
    }

    a.scale += (a.targetScale - a.scale) * dt * speed;
    a.emissive += (a.targetEmissive - a.emissive) * dt * speed;
    a.offsetY += (a.targetOffsetY - a.offsetY) * dt * speed;
    a.roughness += (a.targetRoughness - a.roughness) * dt * speed;
    a.clearcoat += (a.targetClearcoat - a.clearcoat) * dt * speed;
    a.envMap += (a.targetEnvMap - a.envMap) * dt * speed;

    // Breathing — staggered per letter
    const breathe = 1 + Math.sin(t * 0.35 + index * 0.6) * 0.003;
    meshRef.current.scale.setScalar(a.scale * breathe);
    meshRef.current.position.y = a.offsetY;

    // Mouse parallax — each letter responds independently
    const px = state.pointer.x * 0.012 * (index - total / 2) * 0.18;
    const py = state.pointer.y * 0.008;
    meshRef.current.rotation.y += (px - meshRef.current.rotation.y) * 0.025;
    meshRef.current.rotation.x += (py - meshRef.current.rotation.x) * 0.025;

    // Material transitions
    matRef.current.roughness = a.roughness;
    matRef.current.clearcoat = a.clearcoat;
    matRef.current.clearcoatRoughness = hovered ? 0.25 : 0.7;
    matRef.current.envMapIntensity = a.envMap;

    const em = a.emissive;
    matRef.current.emissive.setRGB(em * 0.55, em * 0.5, em * 1.0);
    matRef.current.emissiveIntensity = em * 3.5;
  });

  return (
    <group position={[xOffset, 0, 0]}>
      <Text3D
        ref={meshRef}
        font={FONT_URL}
        size={0.82}
        height={0.3}
        curveSegments={24}
        bevelEnabled={true}
        bevelThickness={0.06}
        bevelSize={0.04}
        bevelOffset={0}
        bevelSegments={8}
        castShadow
        receiveShadow
        onPointerOver={onOver}
        onPointerOut={onOut}
      >
        {char}
        <meshPhysicalMaterial
          ref={matRef}
          map={whiteMap}
          roughness={0.85}
          metalness={0.0}
          clearcoat={0.1}
          clearcoatRoughness={0.7}
          envMapIntensity={0.35}
          color="#FFFFFF"
          emissive={new THREE.Color('#000000')}
          emissiveIntensity={0}
        />
      </Text3D>
    </group>
  );
}

/* ═══════════════════════════════════════════════════════
   PuffedText — Letter-by-letter Apple aesthetic
   ═══════════════════════════════════════════════════════ */
export default function PuffedText() {
  const groupRef = useRef();
  const whiteMap = useMemo(() => createWhiteTexture(), []);

  // Helvetica Bold letter widths at size 0.72 (with generous tracking)
  // Each letter gets its own advance + gap to avoid overlap
  const letterWidths = {
    'P': 0.62, 'O': 0.70, 'R': 0.65, 'T': 0.58,
    'F': 0.52, 'L': 0.50, 'I': 0.28,
  };
  const letterSpacing = 0.18; // Extra space between each letter

  // Compute cumulative X offsets (centered)
  const offsets = useMemo(() => {
    const widths = LETTERS.map((ch) => (letterWidths[ch] || 0.6) + letterSpacing);
    const totalWidth = widths.reduce((s, w) => s + w, 0) - letterSpacing; // No trailing gap
    let x = -totalWidth / 2;
    return LETTERS.map((ch, i) => {
      const offset = x + widths[i] / 2 - letterSpacing / 2;
      x += widths[i];
      return offset;
    });
  }, []);

  return (
    <Float speed={0.4} rotationIntensity={0.01} floatIntensity={0.1} floatingRange={[-0.05, 0.05]}>
      <group ref={groupRef}>
        <group>
          {LETTERS.map((char, i) => (
            <PuffedLetter
              key={i}
              char={char}
              index={i}
              total={LETTERS.length}
              whiteMap={whiteMap}
              xOffset={offsets[i]}
            />
          ))}
        </group>
      </group>
    </Float>
  );
}

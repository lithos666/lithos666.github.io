import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

// 程序化水磨石/水泥斑点材质 Shader（精简版，内联避免循环依赖）
const terrazzoVert = `
  varying vec2 vUv;
  varying vec3 vPos;
  void main() {
    vUv = uv;
    vPos = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const terrazzoFrag = `
  precision highp float;
  uniform vec3 uBaseColor;
  uniform vec3 uSpeckleColor;
  varying vec2 vUv;

  float hash21(vec2 p) {
    p = fract(p * vec2(234.34, 85.43));
    p += dot(p, p + 34.23);
    return fract(p.x * p.y);
  }

  float snoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash21(i), hash21(i+vec2(1,0)), f.x),
      mix(hash21(i+vec2(0,1)), hash21(i+vec2(1,1)), f.x),
      f.y
    );
  }

  void main() {
    vec2 uv = vUv;
    vec3 color = uBaseColor;

    // Large speckles
    for (int i=0; i<6; i++) {
      float fi = float(i);
      vec2 seed = vec2(fi*17.13+0.5, fi*7.97+3.3);
      vec2 c = vec2(hash21(seed), hash21(seed+10.0));
      float r = 0.008 + hash21(seed+5.0)*0.025;
      vec2 duv = uv + vec2(snoise(uv*15.+seed.x)*0.03, snoise(uv*15.+seed.y)*0.03);
      float d = length(duv - c);
      float s = smoothstep(r, r*0.65, d);
      color = mix(color, uSpeckleColor*(0.35+hash21(seed+20.)*0.65), s*0.9);
    }
    // Medium speckles
    for (int i=0; i<14; i++) {
      float fi = float(i);
      vec2 seed = vec2(fi*41.77+8.5, fi*23.11+1.7);
      vec2 c = vec2(hash21(seed), hash21(seed+30.0));
      float r = 0.002 + hash21(seed+50.0)*0.01;
      vec2 duv = uv + vec2(snoise(uv*25.+fi)*0.015, snoise(uv*25.+fi+10.)*0.015);
      float d = length(duv-c);
      float s = smoothstep(r, r*0.5, d);
      color = mix(color, mix(uSpeckleColor*.7,uBaseColor*.75,hash21(seed)), s*.7);
    }
    // Fine grain
    color += vec3(snoise(uv*200.)*0.02 + snoise(uv*80.)*0.015);

    // Edge darkening for depth
    float edge = min(min(uv.x,1.-uv.x), min(uv.y,1.-uv.y));
    color -= smoothstep(0.06,0.,edge)*0.08;

    gl_FragColor = vec4(color, 1.0);
  }
`;

export default function PortfolioText3D({ progress = 1 }) {
  const groupRef = useRef();
  const materialRef = useRef();

  // Terrazzo shader uniforms
  const uniforms = useMemo(() => ({
    uBaseColor: { value: new THREE.Color('#EDEAE5') },
    uSpeckleColor: { value: new THREE.Color('#252220') },
  }), []);

  // Gentle floating animation
  useFrame((state) => {
    if (groupRef.current) {
      const t = state.clock.elapsedTime;
      groupRef.current.rotation.y = Math.sin(t * 0.15) * 0.02;
      groupRef.current.position.y = Math.sin(t * 0.12) * 0.06;
    }
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  // Scale animation based on progress (emerge effect)
  const scale = 0.001 + progress * 0.999; // start near-zero, grow to full

  return (
    <group ref={groupRef} position={[0, 0.15, 0]} scale={scale}>
      {/* Main "Portfolio" 3D text with terrazzo material */}
      <Text
        font="https://fonts.gstatic.com/s/quicksand/v7/6xK-dSZaM9iEejBhjBMnZHwEsDBS.woff"
        fontSize={1.15}
        letterSpacing={0.04}
        anchorX="center"
        anchorY="middle"
        maxWidth={10}
        material={
          <shaderMaterial
            ref={materialRef}
            vertexShader={terrazzoVert}
            fragmentShader={terrazzoFrag}
            uniforms={uniforms}
          />
        }
        castShadow
        receiveShadow
      >
        Portfolio
      </Text>
    </group>
  );
}

// Alternative: MeshPhysicalMaterial version for comparison/fallback
export function PortfolioTextPhysical() {
  const groupRef = useRef();

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    groupRef.current.rotation.y = Math.sin(t * 0.15) * 0.02;
    groupRef.current.position.y = Math.sin(t * 0.12) * 0.06;
  });

  return (
    <group ref={groupRef} position={[0, 0.15, 0]}>
      <Text
        font="https://fonts.gstatic.com/s/quicksand/v7/6xK-dSZaM9iEejBhjBMnZHwEsDBS.woff"
        fontSize={1.15}
        letterSpacing={0.04}
        anchorX="center"
        anchorY="middle"
        maxWidth={10}
        material={
          <meshPhysicalMaterial
            color="#EDEAE5"
            roughness={0.88}
            metalness={0.04}
            clearcoat={0.08}
            clearcoatRoughness={0.6}
          />
        }
        castShadow
      >
        Portfolio
      </Text>
    </group>
  );
}

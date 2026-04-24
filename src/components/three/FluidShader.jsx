import React, { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// Subtle Gemini fluid glow — designed to work on both light & dark backgrounds
// Very faint, acts as a "cosmic undercurrent" beneath the main scene

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  precision highp float;

  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uOpacity;

  varying vec2 vUv;

  float hash21(vec2 p) {
    p = fract(p * vec2(127.1, 311.7));
    return fract(sin(dot(p, vec2(269.5, 183.3))) * 43758.5453);
  }

  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash21(i), hash21(i+vec2(1,0)), f.x),
      mix(hash21(i+vec2(0,1)), hash21(i+vec2(1,1)), f.x),
      f.y
    );
  }

  float fbm(vec2 p) {
    float v = 0.0, a = 0.5;
    mat2 rot = mat2(0.877, -0.479, 0.479, 0.877);
    for (int i=0; i<3; i++) {
      v += a * noise(p); p = rot*p*2. + vec2(100.); a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 uv = vUv;
    float t = uTime * 0.06;
    float aspect = 16./9.;
    vec2 uvA = vec2(uv.x*aspect, uv.y);

    // 3 soft blobs — very low opacity
    vec2 c1 = vec2(0.32 + 0.08*sin(t*0.6), 0.42 + 0.06*cos(t*0.45));
    vec2 c2 = vec2(0.68 + 0.06*cos(t*0.55 + 1.), 0.56 + 0.08*sin(t*0.7));
    vec2 c3 = vec2(0.50 + 0.10*sin(t*0.38 + 2.), 0.32 + 0.04*cos(t*0.33));

    c1 += (uMouse-0.5)*0.08;
    c2 += (uMouse-0.5)*0.05;

    c1 *= aspect; c2 *= aspect; c3 *= aspect;
    uvA.x *= aspect;

    float n1 = fbm(uvA*1.5 + t*0.5);
    float n2 = fbm(uvA*1.5 + t*0.5 + 8.);
    float n3 = fbm(uvA*1.8 + t*0.4 + 16.);

    float d1 = length(uvA-c1) + n1*0.10;
    float d2 = length(uvA-c2) + n2*0.08;
    float d3 = length(uvA-c3) + n3*0.07;

    float r1=0.44+0.03*sin(t*1.2), r2=0.37+0.02*cos(t*1.0), r3=0.32+0.02*sin(t*1.4);

    float b1 = smoothstep(r1, r1*0.10, d1);
    float b2 = smoothstep(r2, r2*0.10, d2);
    float b3 = smoothstep(r3, r3*0.10, d3);

    // Deep purple / cyan / magenta — extremely subtle
    vec3 col1 = vec3(0.08, 0.04, 0.28); // deep purple
    vec3 col2 = vec3(0.00, 0.22, 0.36); // deep cyan
    vec3 col3 = vec3(0.34, 0.04, 0.26); // deep magenta

    vec3 color = vec3(0.0);
    color = mix(color, col1, b1 * 0.06);
    color = mix(color, col2, b2 * 0.05);
    color = mix(color, col3, b3 * 0.04);

    // Mouse glow
    vec2 mA = vec2(uMouse.x*aspect, uMouse.y);
    float mGlow = smoothstep(0.28, 0., length(uvA-mA));
    color += vec3(0.10, 0.05, 0.22) * mGlow * 0.15;

    gl_FragColor = vec4(color, uOpacity * 1.0);
  }
`;

export default function FluidShader({ scrollProgress }) {
  const meshRef = useRef();
  const { viewport } = useThree();
  const mouseRef = useRef({ x: 0.5, y: 0.5 });

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2(0.5, 0.5) },
    uOpacity: { value: 1.0 },
  }), []);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.material.uniforms.uTime.value = state.clock.elapsedTime;

    const mx = (state.pointer.x + 1) / 2;
    const my = (state.pointer.y + 1) / 2;
    mouseRef.current.x += (mx - mouseRef.current.x) * 0.04;
    mouseRef.current.y += (my - mouseRef.current.y) * 0.04;
    meshRef.current.material.uniforms.uMouse.value.set(mouseRef.current.x, mouseRef.current.y);
  });

  return (
    <mesh ref={meshRef} position={[0, 0, -4]}>
      <planeGeometry args={[viewport.width, viewport.height]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.NormalBlending}
      />
    </mesh>
  );
}

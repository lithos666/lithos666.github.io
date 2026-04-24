import React, { useMemo } from 'react';

// 程序化 Terrazzo（水磨石/水泥斑点）材质 Shader
// 用于复刻参考图中的灰白色水泥斑点质感

const terrazzoVertexShader = `
  varying vec2 vUv;
  varying vec3 vPosition;
  varying vec3 vNormal;

  void main() {
    vUv = uv;
    vPosition = position;
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const terrazzoFragmentShader = `
  precision highp float;

  uniform float uTime;
  uniform vec3 uBaseColor;
  uniform vec3 uSpeckleColor;

  varying vec2 vUv;
  varying vec3 vPosition;
  varying vec3 vNormal;

  // Hash functions
  float hash21(vec2 p) {
    p = fract(p * vec2(234.34, 85.43));
    p += dot(p, p + 34.23);
    return fract(p.x * p.y);
  }

  float hash31(vec3 p) {
    p = fract(p * 0.1031);
    p *= dot(p, p.z + 33.33);
    return fract((p.x + p.y) * p.z);
  }

  // Smooth noise
  float snoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);

    float a = hash21(i);
    float b = hash21(i + vec2(1.0, 0.0));
    float c = hash21(i + vec2(0.0, 1.0));
    float d = hash21(i + vec2(1.0, 1.0));

    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }

  void main() {
    vec2 uv = vUv;
    vec3 pos = vPosition;

    // Base cement color (warm off-white like the reference)
    vec3 baseCement = uBaseColor;

    // Generate terrazzo speckles at multiple scales
    vec3 color = baseCement;
    float totalSpeckle = 0.0;

    // Large aggregate chunks (dark grey)
    for (int i = 0; i < 6; i++) {
      float fi = float(i);
      vec2 seed = vec2(fi * 17.13 + 0.5, fi * 7.97 + 3.3);

      vec2 center = vec2(
        hash21(seed),
        hash21(seed + 10.0)
      );

      float dist = length(uv - center);
      float radius = 0.008 + hash21(seed + 5.0) * 0.025;

      // Irregular shape via noise distortion
      vec2 distortedUV = uv + vec2(
        snoise(uv * 15.0 + seed.x) * 0.03,
        snoise(uv * 15.0 + seed.y) * 0.03
      );

      float d = length(distortedUV - center);
      float speckle = smoothstep(radius, radius * 0.65, d);
      speckle *= smoothstep(0.08, radius * 0.7, d); // soft edge falloff

      // Varying speckle darkness
      vec3 speckleColor = mix(uSpeckleColor, uSpeckleColor * 0.35, hash21(seed + 20.0));
      color = mix(color, speckleColor, speckle * 0.9);
      totalSpeckle += speckle;
    }

    // Medium speckles (mid-grey)
    for (int i = 0; i < 18; i++) {
      float fi = float(i);
      vec2 seed = vec2(fi * 41.77 + 8.5, fi * 23.11 + 1.7);

      vec2 center = vec2(hash21(seed), hash21(seed + 30.0));
      float radius = 0.002 + hash21(seed + 50.0) * 0.01;

      vec2 distortedUV = uv + vec2(snoise(uv * 25.0 + fi) * 0.015, snoise(uv * 25.0 + fi + 10.0) * 0.015);
      float d = length(distortedUV - center);
      float speckle = smoothstep(radius, radius * 0.5, d);

      vec3 sc = mix(uSpeckleColor * 0.7, baseCement * 0.75, hash21(seed));
      color = mix(color, sc, speckle * 0.7);
      totalSpeckle += speckle * 0.5;
    }

    // Fine grain (tiny dots)
    float fineGrain = snoise(uv * 200.0) * 0.02;
    color += vec3(fineGrain);

    // Subtle surface variation (cement micro-texture)
    float surfaceNoise = snoise(uv * 80.0) * 0.015;
    color += vec3(surfaceNoise);

    // Soft shadowing based on position for depth illusion
    float depthFactor = smoothstep(-1.5, 1.5, pos.z) * 0.04;
    color -= vec3(depthFactor);

    // Edge darkening (bevel simulation)
    float edgeDist = min(min(uv.x, 1.0 - uv.x), min(uv.y, 1.0 - uv.y));
    float edgeDark = smoothstep(0.06, 0.0, edgeDist) * 0.08;
    color -= vec3(edgeDark);

    gl_FragColor = vec4(color, 1.0);
  }
`;

export { terrazzoVertexShader, terrazzoFragmentShader };

export function getTerrazzoUniforms(baseColor, speckleColor) {
  return {
    uTime: { value: 0 },
    uBaseColor: { value: baseColor || new THREE.Color('#F0EDE8') },
    uSpeckleColor: { value: speckleColor || new THREE.Color('#2A2825') },
  };
}

import * as THREE from 'three';

// 预配置的材质工厂
export function createTerrazzoMaterial(options = {}) {
  const baseColor = options.baseColor || '#F0EDE8';   // 温暖米白底色
  const speckleColor = options.speckleColor || '#2A2825'; // 深灰斑点
  const roughness = options.roughness ?? 0.88;         // 高粗糙度（水泥质感）
  const metalness = options.metalness ?? 0.05;          // 低金属度

  return new THREE.ShaderMaterial({
    vertexShader: terrazzoVertexShader,
    fragmentShader: terrazzoFragmentShader,
    uniforms: {
      uTime: { value: 0 },
      uBaseColor: { value: new THREE.Color(baseColor) },
      uSpeckleColor: { value: new THREE.Color(speckleColor) },
    },
  });
}

export default function TerrazzoMaterial({ baseColor = '#F0EDE8', speckleColor = '#2A2825' }) {
  const material = useMemo(() => createTerrazzoMaterial({ baseColor, speckleColor }), [baseColor, speckleColor]);
  return <primitive object={material} attach="material" />;
}

import React, { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * GalaxyCluster - Advanced distant galaxy clusters with procedural generation
 * Renders multiple galaxy groups with realistic spiral structures
 * Uses instanced rendering for performance
 */

const GALAXY_COUNT = 250;
const CLUSTER_COUNT = 8;

const galaxyVertexShader = /* glsl */ `
  attribute float aSize;
  attribute float aGlowIntensity;
  attribute float aRotation;
  attribute vec3 aGalaxyColor;
  
  uniform float uPixelRatio;
  uniform float uTime;

  varying float vAlpha;
  varying vec3 vColor;
  varying float vSize;
  varying float vGlowIntensity;

  void main() {
    vColor = aGalaxyColor;
    vGlowIntensity = aGlowIntensity;

    vec3 pos = position;
    
    // Subtle oscillation for distant galaxies
    pos.y += sin(uTime * 0.1 + aRotation * 3.14159) * 0.05;
    pos.x += cos(uTime * 0.08 + aRotation * 6.28) * 0.05;

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    float perspective = 50.0 / max(-mv.z, 0.1);
    vSize = aSize * uPixelRatio * perspective;
    vAlpha = 1.0;

    gl_PointSize = clamp(vSize, 0.5, 64.0);
    gl_Position = projectionMatrix * mv;
  }
`;

const galaxyFragmentShader = /* glsl */ `
  varying float vAlpha;
  varying vec3 vColor;
  varying float vSize;
  varying float vGlowIntensity;

  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c);
    
    if (d > 0.5) discard;

    // Multi-layer galaxy nebula effect
    // Outer halo - very faint
    float outerHalo = exp(-d * d * 3.0) * 0.3 * vGlowIntensity;
    
    // Mid nebula
    float midNebula = exp(-d * d * 8.0) * 0.5 * vGlowIntensity;
    
    // Core bright region
    float core = smoothstep(0.25, 0.0, d) * vGlowIntensity;
    
    float combinedGlow = outerHalo + midNebula + core;
    
    // Add slight spiral texture
    float spiralEffect = sin(atan(c.y, c.x) * 3.0 - d * 2.0) * 0.15 + 0.85;
    
    vec3 finalColor = vColor * spiralEffect * (1.0 + core * 0.3);
    float alpha = combinedGlow * 0.4;

    gl_FragColor = vec4(finalColor, alpha);
  }
`;

export default function GalaxyCluster() {
  const pointsRef = useRef();
  const { viewport } = useThree();

  const uniforms = useMemo(() => ({
    uPixelRatio: { value: Math.min(window.devicePixelRatio, 1.5) },
    uTime: { value: 0 },
  }), []);

  // Generate galaxy cluster data
  const { positions, sizes, glowIntensities, rotations, colors } = useMemo(() => {
    const pos = new Float32Array(GALAXY_COUNT * 3);
    const sz = new Float32Array(GALAXY_COUNT);
    const glow = new Float32Array(GALAXY_COUNT);
    const rot = new Float32Array(GALAXY_COUNT);
    const col = new Float32Array(GALAXY_COUNT * 3);

    // Galaxy color palette
    const galaxyColors = [
      new THREE.Color('#6a5aff'), // Purple spiral
      new THREE.Color('#4da6ff'), // Blue spiral
      new THREE.Color('#ff8c42'), // Orange spiral
      new THREE.Color('#a855f7'), // Violet spiral
      new THREE.Color('#64b5f6'), // Light blue spiral
      new THREE.Color('#ff6b9d'), // Pink spiral
    ];

    // Create galaxy clusters
    let galaxyIndex = 0;
    for (let c = 0; c < CLUSTER_COUNT; c++) {
      // Random cluster center
      const clusterAngle = (c / CLUSTER_COUNT) * Math.PI * 2;
      const clusterDist = 35 + Math.random() * 65;
      const centerX = Math.cos(clusterAngle) * clusterDist;
      const centerY = Math.sin(clusterAngle) * clusterDist;
      const centerZ = -50 - Math.random() * 80;

      // Number of galaxies in this cluster
      const galaxiesInCluster = 25 + Math.floor(Math.random() * 40);

      for (let g = 0; g < galaxiesInCluster && galaxyIndex < GALAXY_COUNT; g++) {
        // Position within cluster
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * (15 + Math.random() * 25);
        
        pos[galaxyIndex * 3] = centerX + Math.cos(angle) * distance;
        pos[galaxyIndex * 3 + 1] = centerY + Math.sin(angle) * distance;
        pos[galaxyIndex * 3 + 2] = centerZ + (Math.random() - 0.5) * 20;

        // Size variation
        sz[galaxyIndex] = 0.8 + Math.random() * 3.2;
        
        // Glow intensity (distant galaxies are dimmer)
        glow[galaxyIndex] = 0.3 + Math.random() * 0.7;
        
        // Rotation for spiral effect
        rot[galaxyIndex] = Math.random() * Math.PI * 2;

        // Color selection
        const color = galaxyColors[Math.floor(Math.random() * galaxyColors.length)];
        col[galaxyIndex * 3] = color.r;
        col[galaxyIndex * 3 + 1] = color.g;
        col[galaxyIndex * 3 + 2] = color.b;

        galaxyIndex++;
      }
    }

    return {
      positions: pos,
      sizes: sz,
      glowIntensities: glow,
      rotations: rot,
      colors: col,
    };
  }, []);

  useFrame((state) => {
    if (!pointsRef.current) return;
    uniforms.uTime.value = state.clock.elapsedTime;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute 
          attach="attributes-position" 
          count={GALAXY_COUNT} 
          array={positions} 
          itemSize={3} 
        />
        <bufferAttribute 
          attach="attributes-aSize" 
          count={GALAXY_COUNT} 
          array={sizes} 
          itemSize={1} 
        />
        <bufferAttribute 
          attach="attributes-aGlowIntensity" 
          count={GALAXY_COUNT} 
          array={glowIntensities} 
          itemSize={1} 
        />
        <bufferAttribute 
          attach="attributes-aRotation" 
          count={GALAXY_COUNT} 
          array={rotations} 
          itemSize={1} 
        />
        <bufferAttribute 
          attach="attributes-aGalaxyColor" 
          count={GALAXY_COUNT} 
          array={colors} 
          itemSize={3} 
        />
      </bufferGeometry>
      <shaderMaterial
        vertexShader={galaxyVertexShader}
        fragmentShader={galaxyFragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        fog={false}
      />
    </points>
  );
}

import { useEffect, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * PostProcessing Component
 * Implements Bloom + HDR effects for enhanced visual appearance
 */
export default function PostProcessing({ bloomStrength = 1.4, bloomThreshold = 0.9 }) {
  const { gl, scene, camera, size } = useThree();
  const composerRef = useRef(null);

  useEffect(() => {
    // High-pass filter material
    const highPassMaterial = new THREE.ShaderMaterial({
      uniforms: {
        tDiffuse: { value: null },
        uThreshold: { value: bloomThreshold },
        uSmoothing: { value: 0.2 },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D tDiffuse;
        uniform float uThreshold;
        uniform float uSmoothing;
        varying vec2 vUv;
        
        void main() {
          vec4 texel = texture2D(tDiffuse, vUv);
          float lum = dot(texel.rgb, vec3(0.299, 0.587, 0.114));
          float bloom = smoothstep(uThreshold - uSmoothing, uThreshold + uSmoothing, lum);
          gl_FragColor = vec4(texel.rgb * bloom, texel.a);
        }
      `,
    });

    // Blur material
    const blurMaterial = new THREE.ShaderMaterial({
      uniforms: {
        tDiffuse: { value: null },
        uTexelSize: { value: new THREE.Vector2(0.001, 0.001) },
        uDirection: { value: new THREE.Vector2(1.0, 0.0) },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D tDiffuse;
        uniform vec2 uTexelSize;
        uniform vec2 uDirection;
        varying vec2 vUv;
        
        void main() {
          vec4 color = vec4(0.0);
          float total = 0.0;
          
          for(int i = -6; i <= 6; i++) {
            float weight = exp(-float(i * i) / 18.0);
            vec2 offset = uDirection * uTexelSize * float(i);
            color += texture2D(tDiffuse, vUv + offset) * weight;
            total += weight;
          }
          
          gl_FragColor = color / total;
        }
      `,
    });

    // Composite material
    const compositeMaterial = new THREE.ShaderMaterial({
      uniforms: {
        tBase: { value: null },
        tBloom: { value: null },
        uBloomStrength: { value: bloomStrength },
        uExposure: { value: 1.0 },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D tBase;
        uniform sampler2D tBloom;
        uniform float uBloomStrength;
        uniform float uExposure;
        varying vec2 vUv;
        
        vec3 filmic(vec3 x) {
          float a = 0.15, b = 0.50, c = 0.10, d = 0.20, e = 0.02, f = 0.30;
          return ((x * (a * x + c * b) + d * e) / (x * (a * x + b) + d * f)) - e / f;
        }
        
        void main() {
          vec4 base = texture2D(tBase, vUv);
          vec4 bloom = texture2D(tBloom, vUv);
          
          vec3 color = base.rgb + bloom.rgb * uBloomStrength;
          color *= uExposure;
          
          vec3 whiteLevel = vec3(5.3);
          color = filmic(color) / filmic(whiteLevel);
          color = pow(color, vec3(1.0 / 2.2));
          
          gl_FragColor = vec4(color, base.a);
        }
      `,
    });

    // Render targets
    const renderTarget = new THREE.WebGLRenderTarget(size.width, size.height, {
      format: THREE.RGBAFormat,
      type: THREE.HalfFloatType,
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
    });

    const bloomTarget = new THREE.WebGLRenderTarget(256, 256, {
      format: THREE.RGBAFormat,
      type: THREE.FloatType,
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
    });

    const blurTargetA = new THREE.WebGLRenderTarget(256, 256, {
      format: THREE.RGBAFormat,
      type: THREE.FloatType,
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
    });

    const blurTargetB = new THREE.WebGLRenderTarget(256, 256, {
      format: THREE.RGBAFormat,
      type: THREE.FloatType,
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
    });

    // Create quad
    const quad = new THREE.PlaneGeometry(2, 2);
    const quadMesh = new THREE.Mesh(quad);
    const orthoCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const quadScene = new THREE.Scene();
    quadScene.add(quadMesh);

    composerRef.current = {
      renderTarget,
      bloomTarget,
      blurTargetA,
      blurTargetB,
      highPassMaterial,
      blurMaterial,
      compositeMaterial,
      quadMesh,
      quadScene,
      orthoCamera,
    };

    return () => {
      renderTarget.dispose();
      bloomTarget.dispose();
      blurTargetA.dispose();
      blurTargetB.dispose();
      quad.dispose();
      highPassMaterial.dispose();
      blurMaterial.dispose();
      compositeMaterial.dispose();
    };
  }, [size, bloomStrength, bloomThreshold]);

  useFrame(() => {
    if (!composerRef.current) return;

    const {
      renderTarget,
      bloomTarget,
      blurTargetA,
      blurTargetB,
      highPassMaterial,
      blurMaterial,
      compositeMaterial,
      quadMesh,
      quadScene,
      orthoCamera,
    } = composerRef.current;

    const prevRenderTarget = gl.getRenderTarget();

    // Step 1: Render scene
    gl.setRenderTarget(renderTarget);
    gl.clear();
    gl.render(scene, camera);

    // Step 2: Extract bright areas
    highPassMaterial.uniforms.tDiffuse.value = renderTarget.texture;
    quadMesh.material = highPassMaterial;
    gl.setRenderTarget(bloomTarget);
    gl.clearColor(0, 0, 0, 1);
    gl.clear();
    gl.render(quadScene, orthoCamera);

    // Step 3: Blur horizontally
    blurMaterial.uniforms.tDiffuse.value = bloomTarget.texture;
    blurMaterial.uniforms.uDirection.value.set(1.0, 0.0);
    blurMaterial.uniforms.uTexelSize.value.set(1.0 / 256, 1.0 / 256);
    quadMesh.material = blurMaterial;
    gl.setRenderTarget(blurTargetA);
    gl.clear();
    gl.render(quadScene, orthoCamera);

    // Step 4: Blur vertically
    blurMaterial.uniforms.tDiffuse.value = blurTargetA.texture;
    blurMaterial.uniforms.uDirection.value.set(0.0, 1.0);
    gl.setRenderTarget(blurTargetB);
    gl.clear();
    gl.render(quadScene, orthoCamera);

    // Step 5: Composite with tone mapping
    compositeMaterial.uniforms.tBase.value = renderTarget.texture;
    compositeMaterial.uniforms.tBloom.value = blurTargetB.texture;
    quadMesh.material = compositeMaterial;
    gl.setRenderTarget(null);
    gl.clear();
    gl.render(quadScene, orthoCamera);

    gl.setRenderTarget(prevRenderTarget);
  });

  return null;
}

import { useEffect, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * SkyBox - Procedural star field environment map
 * Creates a rich starfield background for consistent visual appearance
 * Follows camera to ensure proper depth
 */
export default function SkyBox() {
  const { scene, camera } = useThree();
  const skyboxRef = useRef(null);

  useEffect(() => {
    // Create procedural star field texture
    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');

    // Deep space background gradient
    const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    grad.addColorStop(0, '#000814');
    grad.addColorStop(0.5, '#001033');
    grad.addColorStop(1, '#0a0e27');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add nebula clouds with noise
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    const noise = (x, y, z) => {
      const n = Math.sin(x * 12.9898 + y * 78.233 + z * 45.164) * 43758.5453;
      return n - Math.floor(n);
    };

    for (let i = 0; i < canvas.width; i += 4) {
      for (let j = 0; j < canvas.height; j += 4) {
        const n1 = noise(i / 200, j / 200, 1);
        const n2 = noise(i / 400, j / 400, 2);
        const combined = (n1 * 0.6 + n2 * 0.4) * 0.15;

        const idx = (j * canvas.width + i) * 4;
        data[idx] = Math.min(data[idx] + combined * 30, 255);
        data[idx + 1] = Math.min(data[idx + 1] + combined * 35, 255);
        data[idx + 2] = Math.min(data[idx + 2] + combined * 50, 255);
      }
    }
    ctx.putImageData(imageData, 0, 0);

    // Add rich starfield with improved rendering
    const addStars = (count, size, brightness, color) => {
      for (let i = 0; i < count; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const r = Math.random();

        if (r < 0.05) continue;

        const starSize = Math.max(0.1, size * (1 - Math.abs(Math.random() - 0.5)));
        
        // Draw multi-layer glow for better quality
        ctx.fillStyle = color;
        
        // Outer glow layer (semi-transparent)
        ctx.globalAlpha = brightness * Math.random() * 0.3;
        ctx.beginPath();
        ctx.arc(x, y, starSize * 1.8, 0, Math.PI * 2);
        ctx.fill();
        
        // Middle glow layer
        ctx.globalAlpha = brightness * Math.random() * 0.6;
        ctx.beginPath();
        ctx.arc(x, y, starSize * 1.2, 0, Math.PI * 2);
        ctx.fill();
        
        // Core (bright center)
        ctx.globalAlpha = brightness * Math.random();
        ctx.beginPath();
        ctx.arc(x, y, starSize, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    ctx.globalAlpha = 1;

    // Add more stars with better distribution
    addStars(300, 1.5, 0.95, '#ffffff');      // Bright white
    addStars(400, 1.2, 0.85, '#e6f0ff');      // Cool white
    addStars(500, 1.0, 0.75, '#aae7ff');      // Cyan-blue
    addStars(400, 0.9, 0.65, '#ffebcd');      // Warm yellow
    addStars(300, 1.1, 0.55, '#ff9999');      // Red giants
    addStars(600, 0.6, 0.4, '#d1d5f0');       // Faint lavender
    addStars(1000, 0.35, 0.25, '#ffffff');    // Very faint stars

    // Add galaxy clusters as distant spiral nebulae
    ctx.globalAlpha = 0.08;
    for (let i = 0; i < 8; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      
      // Spiral galaxy rendering
      const spiralSize = 120 + Math.random() * 200;
      const spiralColor1 = ['rgba(100, 180, 255, 0.2)', 'rgba(150, 100, 200, 0.2)', 'rgba(200, 150, 255, 0.2)'][Math.floor(Math.random() * 3)];
      
      // Outer halo
      let gradient = ctx.createRadialGradient(x, y, 0, x, y, spiralSize);
      gradient.addColorStop(0, spiralColor1);
      gradient.addColorStop(0.6, 'rgba(100, 100, 150, 0.05)');
      gradient.addColorStop(1, 'rgba(50, 50, 100, 0)');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, spiralSize, 0, Math.PI * 2);
      ctx.fill();
      
      // Core bright center
      ctx.globalAlpha = 0.15;
      let coreGradient = ctx.createRadialGradient(x, y, 0, x, y, spiralSize * 0.3);
      coreGradient.addColorStop(0, 'rgba(200, 200, 255, 0.4)');
      coreGradient.addColorStop(1, 'rgba(100, 100, 200, 0)');
      ctx.fillStyle = coreGradient;
      ctx.beginPath();
      ctx.arc(x, y, spiralSize * 0.3, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 0.08;
    }
    
    // Add distant galaxy clusters
    ctx.globalAlpha = 0.05;
    for (let i = 0; i < 12; i++) {
      const centerX = Math.random() * canvas.width;
      const centerY = Math.random() * canvas.height;
      const clusterRadius = 150 + Math.random() * 250;
      const galaxyCount = 5 + Math.floor(Math.random() * 8);
      
      // Draw multiple small galaxies in cluster
      for (let j = 0; j < galaxyCount; j++) {
        const angle = (j / galaxyCount) * Math.PI * 2 + Math.random() * 0.5;
        const distance = Math.random() * clusterRadius;
        const gx = centerX + Math.cos(angle) * distance;
        const gy = centerY + Math.sin(angle) * distance;
        
        const galaxySize = 40 + Math.random() * 80;
        const galaxyGradient = ctx.createRadialGradient(gx, gy, 0, gx, gy, galaxySize);
        galaxyGradient.addColorStop(0, 'rgba(150, 120, 200, 0.2)');
        galaxyGradient.addColorStop(1, 'rgba(80, 60, 120, 0)');
        
        ctx.fillStyle = galaxyGradient;
        ctx.beginPath();
        ctx.arc(gx, gy, galaxySize, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Add nebula glow clusters
    ctx.globalAlpha = 0.15;
    for (let i = 0; i < 15; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const size = 80 + Math.random() * 150;
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, size);
      gradient.addColorStop(0, 'rgba(100, 150, 255, 0.3)');
      gradient.addColorStop(1, 'rgba(50, 70, 150, 0)');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }

    // Create texture from canvas
    const texture = new THREE.CanvasTexture(canvas);
    texture.magFilter = THREE.LinearFilter;
    texture.minFilter = THREE.LinearMipmapLinearFilter;

    // Create skybox using cube faces
    const materials = [];
    for (let i = 0; i < 6; i++) {
      const material = new THREE.MeshBasicMaterial({
        map: texture,
        side: THREE.BackSide,
        depthWrite: false,
      });
      materials.push(material);
    }

    // Create cube geometry
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const skybox = new THREE.Mesh(geometry, materials);
    
    // Scale far away from camera
    skybox.scale.set(1000, 1000, 1000);
    skybox.renderOrder = -1000;

    skyboxRef.current = skybox;
    scene.add(skybox);

    return () => {
      geometry.dispose();
      materials.forEach(m => m.dispose());
      texture.dispose();
      scene.remove(skybox);
    };
  }, [scene]);

  // Make skybox follow camera
  useFrame(() => {
    if (skyboxRef.current) {
      skyboxRef.current.position.copy(camera.position);
    }
  });

  return null;
}

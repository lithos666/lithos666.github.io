import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, extend } from '@react-three/fiber';
import * as THREE from 'three';
import { OrbitControls, Float } from '@react-three/drei';

// 黑洞核心组件 - 完美的黑暗球体
const BlackHoleCore = () => {
  const meshRef = useRef();
  
  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <sphereGeometry args={[1, 64, 64]} />
      <meshBasicMaterial color="#000000" />
    </mesh>
  );
};

// 光子环组件 - 围绕黑洞的明亮扭曲光环
const PhotonRing = () => {
  const ringRef = useRef();
  const materialRef = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (materialRef.current) {
      materialRef.current.opacity = 0.8 + Math.sin(t * 3) * 0.2;
      materialRef.current.time = t;
    }
  });

  return (
    <group rotation={[Math.PI * 0.1, 0, 0]}>
      {/* 内层光子环 - 极亮的白蓝色 */}
      <mesh ref={ringRef}>
        <torusGeometry args={[2.8, 0.15, 32, 128]} />
        <shaderMaterial
          ref={materialRef}
          transparent
          uniforms={{
            time: { value: 0 },
            color1: { value: new THREE.Color('#e0f7ff') },
            color2: { value: new THREE.Color('#b8e4f9') }
          }}
          vertexShader={`
            varying vec2 vUv;
            varying vec3 vPosition;
            void main() {
              vUv = uv;
              vPosition = position;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `}
          fragmentShader={`
            uniform float time;
            uniform vec3 color1;
            uniform vec3 color2;
            varying vec2 vUv;
            varying vec3 vPosition;
            
            void main() {
              float intensity = sin(vUv.x * 100.0 + time * 5.0) * 0.5 + 0.5;
              float glow = pow(1.0 - abs(vUv.y - 0.5) * 2.0, 3.0);
              vec3 finalColor = mix(color1, color2, intensity);
              gl_FragColor = vec4(finalColor, glow * 1.5);
            }
          `}
        />
      </mesh>

      {/* 外层光晕 */}
      <mesh>
        <torusGeometry args={[3.0, 0.4, 32, 128]} />
        <shaderMaterial
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          uniforms={{
            time: { value: 0 }
          }}
          vertexShader={`
            varying vec2 vUv;
            void main() {
              vUv = uv;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `}
          fragmentShader={`
            uniform float time;
            varying vec2 vUv;
            
            void main() {
              float dist = length(vUv - 0.5) * 2.0;
              float alpha = smoothstep(1.0, 0.0, dist);
              alpha *= 0.6 + sin(time * 2.0 + vUv.x * 50.0) * 0.2;
              vec3 color = mix(vec3(0.88, 0.97, 1.0), vec3(0.72, 0.89, 0.98), dist);
              gl_FragColor = vec4(color, alpha * 0.4);
            }
          `}
        />
      </mesh>
    </group>
  );
};

// 吸积盘粒子系统
const AccretionDisk = ({ count = 15000 }) => {
  const pointsRef = useRef();
  const materialRef = useRef();

  // 生成吸积盘粒子位置和属性
  const { positions, colors, sizes, velocities } = useMemo(() => {
    const positions = [];
    const colors = [];
    const sizes = [];
    const velocities = [];

    for (let i = 0; i < count; i++) {
      // 距离中心的距离（对数分布，更多粒子在中间区域）
      const radius = 3.2 + Math.pow(Math.random(), 0.7) * 12;
      
      // 角度（带螺旋扰动）
      const angle = Math.random() * Math.PI * 2 + (radius - 3.2) * 0.3;
      const spiralOffset = Math.sin(radius * 0.5) * 0.15;

      // 位置（扁平椭圆盘，带垂直波动）
      const x = Math.cos(angle + spiralOffset) * radius;
      const y = (Math.random() - 0.5) * (0.08 / (radius * 0.3)) + Math.sin(angle * 3 + radius) * 0.02;
      const z = Math.sin(angle + spiralOffset) * radius;

      positions.push(x, y, z);

      // 根据距离计算颜色（核心白蓝 → 中间红橙 → 外层金黄）
      const normalizedRadius = (radius - 3.2) / 12;
      
      let color = new THREE.Color();
      if (normalizedRadius < 0.15) {
        // 最内层：极亮白蓝色（最热区域）
        color.setRGB(0.95, 0.98, 1.0);
      } else if (normalizedRadius < 0.35) {
        // 白蓝到浅蓝过渡
        color.lerpColors(new THREE.Color('#ffffff'), new THREE.Color('#87ceeb'), (normalizedRadius - 0.15) / 0.2);
      } else if (normalizedRadius < 0.55) {
        // 浅蓝到红色过渡
        color.lerpColors(new THREE.Color('#87ceeb'), new THREE.Color('#dc143c'), (normalizedRadius - 0.35) / 0.2);
      } else if (normalizedRadius < 0.75) {
        // 红色到橙色过渡（深红、猩红）
        color.lerpColors(new THREE.Color('#dc143c'), new THREE.Color('#ff4500'), (normalizedRadius - 0.55) / 0.2);
      } else if (normalizedRadius < 0.9) {
        // 橙色到金色过渡
        color.lerpColors(new THREE.Color('#ff4500'), new THREE.Color('#ffd700'), (normalizedRadius - 0.75) / 0.15);
      } else {
        // 最外层：淡黄色/琥珀色
        color.lerpColors(new THREE.Color('#ffd700'), new THREE.Color('#ffb347'), (normalizedRadius - 0.9) / 0.1);
      }

      colors.push(color.r, color.g, color.b);

      // 粒子大小（内层更小但更亮）
      const size = (0.03 + (1 - normalizedRadius) * 0.06) * (0.5 + Math.random());
      sizes.push(size);

      // 轨道速度（内层更快 - 开普勒运动）
      velocities.push(1.0 / Math.sqrt(radius));
    }

    return { 
      positions: new Float32Array(positions),
      colors: new Float32Array(colors),
      sizes: new Float32Array(sizes),
      velocities: new Float32Array(velocities)
    };
  }, [count]);

  useFrame(({ clock }) => {
    if (!pointsRef.current || !materialRef.current) return;
    
    const positions = pointsRef.current.geometry.attributes.position.array;
    const t = clock.getElapsedTime();
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      let x = positions[i3];
      let y = positions[i3 + 1];
      let z = positions[i3 + 2];
      
      const radius = Math.sqrt(x * x + z * z);
      const velocity = velocities[i] * 0.02;
      
      // 绕中心旋转
      const cosA = Math.cos(velocity);
      const sinA = Math.sin(velocity);
      const newX = x * cosA - z * sinA;
      const newZ = x * sinA + z * cosA;
      
      // 添加湍流扰动
      const turbulenceX = Math.sin(t * 2 + radius * 0.5 + y * 10) * 0.003;
      const turbulenceZ = Math.cos(t * 2.5 + radius * 0.3 + y * 10) * 0.003;
      
      // 垂直波动
      const verticalWave = Math.sin(t * 3 + radius * 0.8 + Math.atan2(z, x) * 5) * 0.001;
      
      positions[i3] = newX + turbulenceX;
      positions[i3 + 2] = newZ + turbulenceZ;
      positions[i3 + 1] += verticalWave * (1 - normalizedRadius(i));
    }
    
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
    
    // 更新shader时间
    materialRef.current.uniforms.time.value = t;
  });

  function normalizedRadius(index) {
    const i3 = index * 3;
    const x = pointsRef.current.geometry.attributes.position.array[i3];
    const z = pointsRef.current.geometry.attributes.position.array[i3 + 2];
    return (Math.sqrt(x*x + z*z) - 3.2) / 12;
  }

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={count} array={colors} itemSize={3} />
        <bufferAttribute attach="attributes-size" count={count} array={sizes} itemSize={1} />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        uniforms={{ time: { value: 0 } }}
        vertexShader={`
          attribute float size;
          attribute vec3 color;
          varying vec3 vColor;
          uniform float time;
          
          void main() {
            vColor = color;
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            
            // 大小随时间微微变化
            float pulse = 1.0 + sin(time * 2.0 + position.x * 5.0) * 0.15;
            gl_PointSize = size * 300.0 * pulse * (300.0 / -mvPosition.z);
            gl_Position = projectionMatrix * mvPosition;
          }
        `}
        fragmentShader={`
          varying vec3 vColor;
          uniform float time;
          
          void main() {
            // 圆形粒子
            float dist = length(gl_PointCoord - vec2(0.5));
            if (dist > 0.5) discard;
            
            // 发光边缘
            float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
            alpha = pow(alpha, 1.5); // 更柔和的衰减
            
            // 闪烁效果
            float flicker = 0.85 + sin(time * 10.0 + gl_PointCoord.x * 20.0) * 0.15;
            
            // 增强亮度（尤其是内部粒子）
            vec3 brightColor = vColor * 1.8 * flicker;
            
            gl_FragColor = vec4(brightColor, alpha * 0.9);
          }
        `}
      />
    </points>
  );
};

// 等离子体流线
const PlasmaStreams = () => {
  const groupRef = useRef();
  const streamCount = 80;

  const streams = useMemo(() => {
    const result = [];
    for (let i = 0; i < streamCount; i++) {
      const startRadius = 3.5 + Math.random() * 10;
      const angle = (i / streamCount) * Math.PI * 2;
      result.push({
        startAngle: angle,
        radius: startRadius,
        speed: 0.3 + Math.random() * 0.5,
        thickness: 0.01 + Math.random() * 0.03
      });
    }
    return result;
  }, []);

  return (
    <group ref={groupRef}>
      {streams.map((stream, idx) => (
        <PlasmaLine key={idx} {...stream} />
      ))}
    </group>
  );
};

const PlasmaLine = ({ startAngle, radius, speed, thickness }) => {
  const lineRef = useRef();
  const segments = 60;

  const { positions, alphas } = useMemo(() => {
    const pos = [];
    const alp = [];
    
    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const r = radius + t * 2;
      const a = startAngle + t * 0.5;
      
      pos.push(
        Math.cos(a) * r,
        (Math.random() - 0.5) * 0.05,
        Math.sin(a) * r
      );
      
      // 两端渐变透明度
      const alpha = Math.sin(t * Math.PI);
      alp.push(alpha);
    }
    
    return {
      positions: new Float32Array(pos),
      alphas: new Float32Array(alp)
    };
  }, []);

  // 根据半径确定颜色
  const lineColor = useMemo(() => {
    const normR = (radius - 3.5) / 10;
    if (normR < 0.25) return '#c8e6ff';
    if (normR < 0.45) return '#ff6b6b';
    if (normR < 0.65) return '#ff4500';
    if (normR < 0.85) return '#ffd700';
    return '#ffe4a0';
  }, [radius]);

  useFrame(({ clock }) => {
    if (!lineRef.current) return;
    const t = clock.getElapsedTime();
    
    const posArr = lineRef.current.geometry.attributes.position.array;
    for (let i = 0; i <= segments; i++) {
      const i3 = i * 3;
      const segmentT = i / segments;
      const r = radius + segmentT * 2;
      const currentAngle = startAngle + t * speed / Math.sqrt(r) + segmentT * 0.5;
      
      // 添加波动
      const waveY = Math.sin(t * 3 + segmentT * 10) * 0.03;
      
      posArr[i3] = Math.cos(currentAngle) * r;
      posArr[i3 + 1] = waveY;
      posArr[i3 + 2] = Math.sin(currentAngle) * r;
    }
    lineRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <line ref={lineRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={segments + 1} array={positions} itemSize={3} />
      </bufferGeometry>
      <lineBasicMaterial 
        color={lineColor} 
        transparent 
        opacity={0.4} 
        linewidth={1}
        blending={THREE.AdditiveBlending}
      />
    </line>
  );
};

// 尘埃丝/细颗粒
const DustFilaments = () => {
  const filamentsRef = useRef();
  const count = 5000;

  const { positions, colors } = useMemo(() => {
    const pos = [];
    const col = [];

    for (let i = 0; i < count; i++) {
      const radius = 4 + Math.random() * 11;
      const angle = Math.random() * Math.PI * 2;
      const height = (Math.random() - 0.5) * 0.3;

      pos.push(
        Math.cos(angle) * radius,
        height,
        Math.sin(angle) * radius
      );

      // 随机颜色（红橙色调为主）
      const colorChoice = Math.random();
      const c = new THREE.Color();
      if (colorChoice < 0.3) {
        c.setRGB(0.86, 0.27, 0.21); // 深红
      } else if (colorChoice < 0.6) {
        c.setRGB(1.0, 0.37, 0.18); // 橙色
      } else if (colorChoice < 0.85) {
        c.setRGB(1.0, 0.75, 0.0); // 金黄
      } else {
        c.setRGB(0.72, 0.89, 0.97); // 淡蓝
      }
      col.push(c.r, c.g, c.b);
    }

    return {
      positions: new Float32Array(pos),
      colors: new Float32Array(col)
    };
  }, []);

  useFrame(({ clock }) => {
    if (!filamentsRef.current) return;
    
    const pos = filamentsRef.current.geometry.attributes.position.array;
    const t = clock.getElapsedTime();

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      let x = pos[i3];
      let z = pos[i3 + 2];
      
      const r = Math.sqrt(x * x + z * z);
      const vel = 0.008 / Math.sqrt(r);
      
      const cosV = Math.cos(vel);
      const sinV = Math.sin(vel);
      
      pos[i3] = x * cosV - z * sinV;
      pos[i3 + 2] = x * sinV + z * cosV;
      
      // 缓慢上下飘动
      pos[i3 + 1] += Math.sin(t + r) * 0.0005;
    }

    filamentsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={filamentsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={count} array={colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={0.015}
        vertexColors
        transparent
        opacity={0.5}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};

// 引力透镜背景效果
const GravitationalLensing = () => {
  const meshRef = useRef();
  const materialRef = useRef();

  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.uniforms.time.value = clock.getElapsedTime();
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, -5]}>
      <planeGeometry args={[30, 30]} />
      <shaderMaterial
        ref={materialRef}
        transparent
        depthWrite={false}
        uniforms={{
          time: { value: 0 },
          blackHolePos: { value: new THREE.Vector2(0, 0) }
        }}
        vertexShader={`
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          uniform float time;
          uniform vec2 blackHolePos;
          varying vec2 vUv;
          
          void main() {
            vec2 center = vUv - blackHolePos;
            center.x *= 16.0 / 9.0; // 宽高比修正
            
            float dist = length(center);
            
            // 引力透镜扭曲效果
            float lensingStrength = 0.08 / (dist + 0.1);
            vec2 distortedUV = vUv - normalize(center) * lensingStrength * smoothstep(0.5, 0.0, dist);
            
            // 星空背景
            float stars = 0.0;
            vec2 starUV = distortedUV * 200.0;
            stars += step(0.998, fract(sin(dot(floor(starUV), vec2(12.9898, 78.233))) * 43758.5453));
            stars *= smoothstep(0.5, 0.1, dist); // 黑洞附近星星被遮挡
            
            // 微弱的宇宙背景辉光
            float cosmicGlow = exp(-dist * 3.0) * 0.05;
            
            // 光环周围的散射光
            float ringDist = abs(dist - 0.22);
            float ringGlow = exp(-ringDist * 40.0) * 0.15;
            ringGlow *= 0.8 + sin(time + atan(center.y, center.x) * 20.0) * 0.2;
            
            vec3 starColor = vec3(stars);
            vec3 glowColor = vec3(cos(dist * 5.0 + time) * 0.5 + 0.5, 
                                  sin(dist * 3.0 + time * 0.7) * 0.3 + 0.4,
                                  cos(dist * 4.0 + time * 1.3) * 0.4 + 0.6);
            
            vec3 finalColor = starColor * 1.5 + glowColor * (cosmicGlow + ringGlow);
            
            gl_FragColor = vec4(finalColor, stars * 0.8 + cosmicGlow + ringGlow);
          }
        `}
      />
    </mesh>
  );
};

// 外层光晕
const OuterGlow = () => {
  const meshRef = useRef();
  const materialRef = useRef();

  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.uniforms.time.value = clock.getElapsedTime();
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <sphereGeometry args={[14, 32, 32]} />
      <shaderMaterial
        ref={materialRef}
        transparent
        side={THREE.BackSide}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        uniforms={{ time: { value: 0 } }}
        vertexShader={`
          varying vec3 vNormal;
          varying vec3 vPosition;
          void main() {
            vNormal = normalize(normalMatrix * normal);
            vPosition = position;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          uniform float time;
          varying vec3 vNormal;
          varying vec3 vPosition;
          
          void main() {
            // 边缘发光
            float rimLight = 1.0 - max(0.0, dot(vNormal, vec3(0.0, 0.0, 1.0)));
            rimLight = pow(rimLight, 3.0);
            
            // 颜色：外层偏琥珀色
            vec3 color1 = vec3(1.0, 0.84, 0.28);   // 金色
            vec3 color2 = vec3(1.0, 0.70, 0.26);   // 琥珀色
            vec3 finalColor = mix(color1, color2, sin(time * 0.5) * 0.5 + 0.5);
            
            float alpha = rimLight * 0.15;
            
            gl_FragColor = vec4(finalColor, alpha);
          }
        `}
      />
    </mesh>
  );
};

// 场景内容
const SceneContent = () => {
  return (
    <>
      {/* 相机控制 */}
      <OrbitControls 
        enableZoom={true}
        enablePan={false}
        minDistance={6}
        maxDistance={25}
        autoRotate
        autoRotateSpeed={0.3}
        maxPolarAngle={Math.PI * 0.7}
        minPolarAngle={Math.PI * 0.3}
      />

      {/* 引力透镜背景 */}
      <GravitationalLensing />

      {/* 黑洞核心 */}
      <BlackHoleCore />

      {/* 光子环 */}
      <PhotonRing />

      {/* 吸积盘粒子系统 */}
      <AccretionDisk count={18000} />

      {/* 等离子体流线 */}
      <PlasmaStreams />

      {/* 尘埃丝 */}
      <DustFilaments />

      {/* 外层光晕 */}
      <OuterGlow />

      {/* 环境光 */}
      <ambientLight intensity={0.05} />
      
      {/* 点光源 - 来自吸积盘 */}
      <pointLight position={[0, 0, 0]} intensity={0.5} color="#ffffff" distance={20} decay={2} />
      <pointLight position={[3, 0, 0]} intensity={0.3} color="#ff4500" distance={15} />
      <pointLight position={[-3, 0, 0]} intensity={0.3} color="#4da6ff" distance={15} />
    </>
  );
};

// 主页组件
const Home = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
    
    const handleMouseMove = (e) => {
      setMousePos({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: '100vh',
      background: '#000000',
      overflow: 'hidden'
    }}>
      {/* 3D Canvas 背景 */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1
      }}>
        <Canvas
          camera={{ position: [0, 5, 12], fov: 60 }}
          gl={{ 
            antialias: true,
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.2
          }}
          dpr={[1, 2]}
        >
          <SceneContent />
        </Canvas>
      </div>

      {/* 前景 UI 内容 */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        pointerEvents: 'none'
      }}>
        {/* 主标题区域 */}
        <div style={{
          textAlign: 'center',
          padding: '40px',
          transform: `translate(${mousePos.x * 10}px, ${mousePos.y * 10}px)`,
          transition: 'transform 0.15s ease-out',
          opacity: isLoaded ? 1 : 0,
          transitionProperty: 'opacity, transform'
        }}>
          <h1 style={{
            fontSize: 'clamp(2.5rem, 8vw, 5rem)',
            fontWeight: 700,
            color: '#ffffff',
            textShadow: `
              0 0 20px rgba(255, 255, 255, 0.8),
              0 0 40px rgba(135, 206, 235, 0.6),
              0 0 60px rgba(220, 20, 60, 0.4)
            `,
            marginBottom: '20px',
            fontFamily: '"Segoe UI", "Helvetica Neue", Arial, sans-serif',
            letterSpacing: '0.1em',
            animation: 'titlePulse 4s ease-in-out infinite'
          }}>
            PORTFOLIA
          </h1>

          <div style={{
            width: '120px',
            height: '2px',
            background: 'linear-gradient(90deg, transparent, #ffd700, #ff4500, #4da6ff, transparent)',
            margin: '20px auto',
            boxShadow: '0 0 10px rgba(255, 215, 0, 0.5)'
          }} />

          <p style={{
            fontSize: 'clamp(1rem, 2.5vw, 1.4rem)',
            color: 'rgba(255, 255, 255, 0.85)',
            maxWidth: '600px',
            margin: '0 auto',
            lineHeight: 1.8,
            textShadow: '0 0 10px rgba(0, 0, 0, 0.8)',
            fontFamily: '"Segoe UI", "Helvetica Neue", Arial, sans-serif'
          }}>
            Creative Developer & Designer<br/>
            <span style={{ fontSize: '0.9em', opacity: 0.7 }}>
              Exploring the universe of digital possibilities
            </span>
          </p>
        </div>

        {/* 底部信息栏 */}
        <div style={{
          position: 'absolute',
          bottom: '40px',
          display: 'flex',
          gap: '30px',
          alignItems: 'center',
          pointerEvents: 'auto'
        }}>
          {['About', 'Projects', 'Contact'].map((item, idx) => (
            <button
              key={item}
              onClick={() => document.getElementById(item.toLowerCase())?.scrollIntoView({ behavior: 'smooth' })}
              style={{
                background: 'rgba(0, 0, 0, 0.4)',
                border: '1px solid rgba(255, 215, 0, 0.3)',
                borderRadius: '25px',
                padding: '12px 28px',
                color: 'rgba(255, 255, 255, 0.9)',
                fontSize: '0.95rem',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                backdropFilter: 'blur(10px)',
                fontFamily: '"Segoe UI", sans-serif',
                letterSpacing: '0.05em'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 69, 0, 0.2)';
                e.currentTarget.style.borderColor = 'rgba(255, 69, 0, 0.6)';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 5px 20px rgba(255, 69, 0, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(0, 0, 0, 0.4)';
                e.currentTarget.style.borderColor = 'rgba(255, 215, 0, 0.3)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* 右侧信息面板 */}
      <div style={{
        position: 'absolute',
        right: '30px',
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        pointerEvents: 'auto'
      }}>
        {[{ label: 'Home', icon: '●' }, { label: 'About', icon: '◆' }, { label: 'Work', icon: '■' }, { label: 'Contact', icon: '✦' }].map((item, idx) => (
          <div
            key={item.label}
            title={item.label}
            style={{
              width: '14px',
              height: '14px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(255,255,255,0.9), rgba(255,215,0,0.4))',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 0 10px rgba(255, 215, 0, 0.4)',
              animation: `navPulse ${2 + idx * 0.3}s ease-in-out infinite ${idx * 0.2}s`
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.5)';
              e.currentTarget.style.boxShadow = '0 0 20px rgba(255, 69, 0, 0.8)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 0 10px rgba(255, 215, 0, 0.4)';
            }}
          />
        ))}
      </div>

      {/* 左上角装饰文字 */}
      <div style={{
        position: 'absolute',
        top: '30px',
        left: '30px',
        zIndex: 10,
        fontFamily: '"Courier New", monospace',
        fontSize: '0.75rem',
        color: 'rgba(255, 255, 255, 0.4)',
        letterSpacing: '0.15em',
        pointerEvents: 'none'
      }}>
        <div>SINGULARITY VISUALIZATION</div>
        <div style={{ marginTop: '5px', opacity: 0.6 }}>EVENT HORIZON: ACTIVE</div>
      </div>

      {/* CSS 动画样式 */}
      <style>{`
        @keyframes titlePulse {
          0%, 100% {
            text-shadow: 
              0 0 20px rgba(255, 255, 255, 0.8),
              0 0 40px rgba(135, 206, 235, 0.6),
              0 0 60px rgba(220, 20, 60, 0.4);
          }
          50% {
            text-shadow: 
              0 0 30px rgba(255, 255, 255, 1),
              0 0 60px rgba(77, 166, 255, 0.8),
              0 0 90px rgba(255, 69, 0, 0.6),
              0 0 120px rgba(255, 215, 0, 0.3);
          }
        }
        
        @keyframes navPulse {
          0%, 100% {
            opacity: 0.6;
          }
          50% {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default Home;

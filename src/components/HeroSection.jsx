import { Suspense, useState, useEffect, Component } from 'react';
import { Canvas } from '@react-three/fiber';
import { AdaptiveDpr, AdaptiveEvents } from '@react-three/drei';
import * as THREE from 'three';
import RayMarchedBlackHole from './three/RayMarchedBlackHole';
import SkyBox from './three/SkyBox';
import GalaxyCluster from './three/GalaxyCluster';
import PostProcessing from './three/PostProcessing';
import './HeroSection.css';

/* ═══════════════════════════════════════════════════════
   Error Boundary — 捕获子组件运行时错误防止白屏
   ═══════════════════════════════════════════════════════ */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: '#000814',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'rgba(255,255,255,0.6)',
          fontFamily: 'var(--font-main)',
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.2rem', marginBottom: '8px', color: 'rgba(255,255,255,0.9)' }}>
              Goodent Portfolio
            </div>
            <div style={{ fontSize: '0.85rem', opacity: 0.6 }}>Loading...</div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

/* ═══════════════════════════════════════════════════════
   Hero Section — Ray-Marched Event Horizon with HDR+Bloom
   
   Uses full-screen ray marching black hole as fixed backdrop.
   Canvas: position:fixed, z-index:-1, global background.
   Post-processing: HDR Bloom + ACES Tone Mapping
   Animation: Continuous orbital drift (always moving)
   
   优化：立即显示内容层，3D 背景异步加载
   ═══════════════════════════════════════════════════════ */
export default function HeroSection() {
  const [show3D, setShow3D] = useState(true);

  // 立即启动 3D 渐染（不再延迟），让背景尽快出现
  useEffect(() => {
    // 使用 requestIdleCallback 在浏览器空闲时初始化 3D
    const init3D = () => setShow3D(true);
    
    if ('requestIdleCallback' in window) {
      requestIdleCallback(init3D, { timeout: 200 });
    } else {
      setTimeout(init3D, 50);
    }
  }, []);

  return (
    <ErrorBoundary>
      {/* ═══ FIXED CANVAS — Ray-Marched Black Hole Background ═══ */}
      {show3D && (
        <div className="blackhole-backdrop">
          <Canvas
            camera={{ position: [0, 2, 14], fov: 50 }}
            dpr={[1, 1.5]}
            gl={{
              antialias: false,
              alpha: false,
              toneMapping: THREE.NoToneMapping,
              powerPreference: 'high-performance',
              preserveDrawingBuffer: false,
              stencil: false,
              depth: true,
            }}
            style={{ background: '#000000' }}
          >
            <color attach="background" args={['#000814']} />
            
            <Suspense fallback={null}>
              <SkyBox />
              <GalaxyCluster />
              <RayMarchedBlackHole />
              <PostProcessing bloomStrength={2.2} bloomThreshold={0.75} />
            </Suspense>

            <AdaptiveDpr pixelated />
            <AdaptiveEvents />
          </Canvas>
        </div>
      )}

      {/* ═══ HERO CONTENT LAYER — 始终可见，不依赖 3D ═══ */}
      <section id="hero" className="hero-section">
        <div className="hero-overlay">
          <div className="glass-chip hero-top-chip">
            <span className="chip-label">Portfolio 肖楚煜</span>
            <span className="chip-divider" />
            <span className="chip-year">2022 – 2025</span>
          </div>

          <div className="hero-bottom-row">
            <div className="glass-chip hero-contact-chip">
              <span className="contact-item">Jeon Ji Hyun</span>
              <span className="contact-item contact-sub">zzeagi@naver.com</span>
            </div>

            <a href="#works" className="glass-chip hero-scroll-chip">
              <span className="scroll-label">Scroll</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M7 10l5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>
        </div>
      </section>
    </ErrorBoundary>
  );
}

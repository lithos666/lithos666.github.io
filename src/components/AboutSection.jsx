import { motion } from 'framer-motion';
import MetallicPaint from './ui/MetallicPaint';
import './AboutSection.css';

/* ═══════════════════════════════════════════════════════════
   About Section — 左右双栏布局
   
   左侧：个人介绍（I → M = I'M 藏头设计）
   右侧：技能展示
   ═══════════════════════════════════════════════════════════ */

const SKILLS = [
  { name: 'SolidWorks', level: 90 },
  { name: 'MATLAB', level: 82 },
  { name: 'Python', level: 70 },
  { name: 'COMSOL', level: 75 },
  { name: 'STM32 / ESP32', level: 78 },
  { name: 'COMSOL Multiphysics', level: 72 },
  { name: 'Unity / C#', level: 68 },
  { name: 'C / C++', level: 80 },
];

const TOOLS = [
  'SolidWorks', 'COMSOL', 'MATLAB', 'Altium/Eagle',
  'Arduino', 'STM32', 'KeyShot', 'Unity',
  'MediaPipe', 'ADAMS', 'PSIM', 'Blender',
];

export default function AboutSection() {
  return (
    <section className="about-section" id="about">
      {/* Ambient glows */}
      <div className="about-glow about-glow--1" />
      <div className="about-glow about-glow--2" />

      {/* Header */}
      <motion.div className="about-header"
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}>
        <span className="about-tag">ABOUT ME</span>
        <h2 className="about-title"><MetallicPaint>Hi, I'm Xiaochuyu</MetallicPaint></h2>
      </motion.div>

      {/* ── Two-column layout: text left + skills right ── */}
      <div className="about-grid">
        
        {/* LEFT: Text Introduction */}
        <motion.div className="about-left"
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}>

          <p className="about-para">
            <span className="para-dropcap">I</span>'m a Mechanical Engineering student at Chongqing University's Mingchuang Class.
            Over three years, I've turned classroom theory into 20+ hands-on projects —
            from bionic robotic arms driven by steel tendons to Stirling engines validated by multi-physics simulation,
            from ECG signal pipelines processing MIT-BIH data to PCB boards carrying voice-controlled smart cars.
            I don't just study engineering; I build it.
          </p>

          <p className="about-para">
            <span className="para-dropcap">M</span>y journey spans product design, robotics, physical simulation,
            DSP signal processing, embedded systems, and AI-powered interaction.
            Each project is a deliverable outcome — STEP models, Gerber files, C libraries,
            business plans, and defense presentations.
            Currently leading a national-level innovation project and exploring the frontier where
            hardware meets software meets human-centered design.
          </p>
        </motion.div>

        {/* RIGHT: Skills & Tools */}
        <motion.div className="about-right"
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.25 }}>

          {/* Skill bars */}
          <div className="skills-group">
            <h3 className="skills-label">Core Skills</h3>
            {SKILLS.map((skill) => (
              <div key={skill.name} className="skill-row">
                <span className="skill-name">{skill.name}</span>
                <div className="skill-track">
                  <motion.div
                    className="skill-fill"
                    initial={{ width: 0 }}
                    whileInView={{ width: `${skill.level}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.4 }}
                  />
                </div>
                <span className="skill-pct">{skill.level}%</span>
              </div>
            ))}
          </div>

          {/* Tool tags */}
          <div className="tools-group">
            <h3 className="tools-label">Toolbox</h3>
            <div className="tools-tags">
              {TOOLS.map((tool) => (
                <span key={tool} className="tool-tag">{tool}</span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

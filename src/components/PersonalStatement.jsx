import { motion } from 'framer-motion';
import { useI18n } from '../i18n-context';
import BorderGlow from './ui/BorderGlow';
import './PersonalStatement.css';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, delay: i * 0.1, ease: [0.23, 1, 0.32, 1] },
  }),
};

const COPY = {
  zh: {
    label: '关于我',
    heading: '我怎样把想法，\n做成可验证的产品。',
    intro: '重庆大学机器人工程专业大三 · Goodent 联合创始人',
    focus: 'Capability Map',
    buildTitle: '我的工作方式',
    buildBody: '我通常先确认真实场景和核心问题，再完成机械、电子、控制与软件的集成，最后用测试结果和用户反馈决定下一次迭代。',
    buildPath: '理解场景 → 定义问题 → 完成原型 → 测试验证 → 继续迭代',
    currentTitle: '目前在做',
    bioTitle: '我的经历',
    bio: '过去三年，我在项目制学习中完成了 20 余个工程项目，逐步建立机械设计、嵌入式控制、机器人和产品验证能力。实习与创业经历也让我开始学习用户研究、竞品分析与市场验证。目前，我正以 Goodent 联合创始人的身份推进智能牙科微动力系统，并持续开展牙科机器人实践。',
  },
  en: {
    label: 'About',
    heading: 'How I turn an idea into a product that can be tested.',
    intro: 'Robotics Engineering Junior at Chongqing University · Co-founder of Goodent',
    focus: 'Capability Map',
    buildTitle: 'How I Work',
    buildBody: 'I begin by confirming the real context and core problem, integrate mechanics, electronics, control and software, then use test results and user feedback to decide the next iteration.',
    buildPath: 'Understand → Define → Prototype → Validate → Iterate',
    currentTitle: 'Current Work',
    bioTitle: 'My Background',
    bio: 'Over three years of project-based study, I have completed more than 20 engineering projects and developed practical skills in mechanical design, embedded control, robotics and product validation. Internships and venture work have also introduced me to user research, competitive analysis and market validation. I now co-lead Goodent while continuing my work in dental robotics.',
  },
};

const FOCUS_AREAS = [
  { index: '01', title: 'Mechanical', body: 'SolidWorks · Fusion 360 · CAD · DFM · 3D Printing', color: '#64D2FF', glow: '190 100 70' },
  { index: '02', title: 'Simulation', body: 'COMSOL · ADAMS · PSIM · MATLAB', color: '#BF5AF2', glow: '282 87 65' },
  { index: '03', title: 'Embedded', body: 'STM32 · ESP32-S3 · PCB · C/C++ · Sensor Integration', color: '#0A84FF', glow: '210 100 52' },
  { index: '04', title: 'Robotics', body: 'LeRobot · MediaPipe · ArUco · ACT', color: '#FF7657', glow: '12 100 67' },
  { index: '05', title: 'Product', body: 'Prototype Development · User Research · Medical Device Development', color: '#30D158', glow: '135 64 50' },
  { index: '06', title: 'Strategy', body: 'Market Research · Competitive Analysis · Pitching · Fundraising', color: '#FF9F0A', glow: '35 100 52' },
];

const CURRENT_WORK = [
  {
    type: { zh: '创业项目 · 项目负责人', en: 'Startup · Project Lead' },
    title: { zh: 'Goodent · 智能牙科微动力系统', en: 'Goodent · Intelligent Dental Power System' },
    description: {
      zh: 'Goodent 是我参与创立的牙科医疗器械项目，面向临床操作开发智能牙科微动力系统。我担任项目负责人（Leader），负责产品定义、系统架构、电机控制与团队推进；项目已获得 50 万元种子轮投资，现处于原型验证与合规准备阶段。',
      en: 'Goodent is a dental medical-device startup I co-founded to develop an intelligent dental power system. As Project Lead, I own product definition, system architecture, motor control and team delivery. The project has secured RMB 500k in seed funding and is now in prototype validation and regulatory preparation.',
    },
    tags: ['BLDC Control', 'Torque Estimation', 'STM32', 'Medical Devices'],
  },
  {
    type: { zh: '机器人研究', en: 'Robotics Research' },
    title: 'LeRobot Dental Robotics',
    description: {
      zh: '围绕牙科操作的视觉定位、示教数据采集与模仿学习实践，探索不同位姿下的操作泛化。',
      en: 'Exploring visual positioning, demonstration-data capture and imitation learning for dental manipulation across varied poses.',
    },
    tags: ['LeRobot', 'ACT', 'ArUco', 'Vision-based Control'],
  },
];

function localized(value, lang) {
  if (typeof value === 'string') return value;
  return value?.[lang] || value?.zh || '';
}

export default function PersonalStatement() {
  const { lang } = useI18n();
  const copy = COPY[lang];

  return (
    <section className="ps-section" id="about">
      <div className="ps-glow ps-glow--1" />
      <div className="ps-glow ps-glow--2" />

      <div className="ps-container">
        <motion.div
          className="ps-header"
          variants={fadeUp}
          custom={0}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
        >
          <span className="section-label">{copy.label}</span>
          <h2 className="section-heading">{copy.heading}</h2>
          <p className="ps-intro">{copy.intro}</p>

          <div className="ps-stats-row">
            {[
              ['3.68', 'GPA'],
              ['9/58', lang === 'en' ? 'Major Rank' : '专业排名'],
              ['20+', lang === 'en' ? 'Built Projects' : '工程项目'],
              ['¥500K', lang === 'en' ? 'Seed Funding' : '种子轮融资'],
            ].map(([value, label], index) => (
              <div className="ps-stat-fragment" key={label}>
                {index > 0 && <div className="ps-stat-divider" />}
                <div className="ps-stat-item">
                  <span className="ps-stat-value">{value}</span>
                  <span className="ps-stat-label">{label}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="ps-focus-cards"
          variants={fadeUp}
          custom={1}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          <h3 className="ps-group-label">{copy.focus}</h3>
          <div className="ps-card-group">
            {FOCUS_AREAS.map((area) => (
              <BorderGlow
                className="ps-focus-card"
                key={area.index}
                backgroundColor="#111113"
                borderRadius={24}
                glowColor={area.glow}
                colors={[area.color, '#f5f5f7', area.color]}
                fillOpacity={0.22}
              >
                <span className="ps-focus-index">{area.index}</span>
                <h3 className="ps-card-title">{area.title}</h3>
                <p className="ps-card-copy">{area.body}</p>
              </BorderGlow>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="ps-overview-panel section-block"
          variants={fadeUp}
          custom={2}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          <div className="ps-overview-top">
            <div className="ps-overview-segment ps-what-build">
              <h3 className="ps-block-title">{copy.buildTitle}</h3>
              <p className="ps-block-desc">{copy.buildBody}</p>
              <p className="ps-build-path">{copy.buildPath}</p>
            </div>

            <div className="ps-overview-segment ps-bio-section">
              <h3 className="ps-block-title">{copy.bioTitle}</h3>
              <p className="ps-bio-text">{copy.bio}</p>
            </div>
          </div>

          <div className="ps-overview-divider" />

          <div className="ps-overview-segment ps-current-work">
            <h3 className="ps-block-title">{copy.currentTitle}</h3>
            <div className="ps-project-highlights">
              {CURRENT_WORK.map((project) => (
                <article className="ps-highlight-card" key={localized(project.title, lang)}>
                  <div className="ps-highlight-badge">{localized(project.type, lang)}</div>
                  <h4 className="ps-highlight-title">{localized(project.title, lang)}</h4>
                  <p className="ps-highlight-desc">{localized(project.description, lang)}</p>
                  <div className="ps-highlight-tech">
                    {project.tags.map((tag) => <span key={tag}>{tag}</span>)}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}

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
    heading: '从想法到原型',
    intro: '重庆大学机器人工程专业大四 · 已通过推免获硕士录取 · Goodent 联合创始人',
    focus: '能力与实践',
    evidenceLabel: '项目实践',
    buildTitle: '我的工作方式',
    buildBody: '我会先把使用场景和需求问清楚，再动手做原型，把结构、电路和控制程序接起来。测试中发现的问题和用户反馈，会成为下一次修改的依据。',
    buildPath: '理解场景 → 定义问题 → 完成原型 → 测试验证 → 继续迭代',
    currentTitle: '目前在做',
    bioTitle: '我的经历',
    bio: '三年来，我在项目制学习中完成了 20 余个工程项目，从机械结构、电路到控制程序，一边做一边补齐知识。实习和创业也让我开始走出实验室，学习如何了解用户、分析竞品和验证需求。现在，我作为 Goodent 联合创始人推进智能牙科微动力系统，也继续开展牙科机器人实验。',
  },
  en: {
    label: 'About',
    heading: 'From Idea to Prototype',
    intro: 'Fourth-year Robotics Engineering Student at Chongqing University · Master’s Admission Secured by Recommendation · Goodent Co-founder',
    focus: 'Capability Map',
    evidenceLabel: 'In practice',
    buildTitle: 'How I Work',
    buildBody: 'I start by asking how a product will be used and what it needs to do. Then I build a prototype and connect the structure, electronics and control software. Test findings and user feedback guide what I change next.',
    buildPath: 'Understand → Define → Prototype → Validate → Iterate',
    currentTitle: 'Current Work',
    bioTitle: 'My Background',
    bio: 'Over three years of project-based study, I have completed more than 20 engineering projects, learning through mechanical structures, circuits and control software. Internships and startup work have also taken me beyond the lab to learn about users, competitors and demand. I now develop an intelligent dental power system as a Goodent co-founder while continuing my dental robotics experiments.',
  },
};

const FOCUS_AREAS = [
  {
    index: '01',
    title: { zh: '机械设计', en: 'Mechanical Design' },
    description: {
      zh: '我从零件建模到整机装配，设计能制造、能运行的机械结构。',
      en: 'I design parts and assemblies that can be manufactured and put into motion.',
    },
    tools: ['SolidWorks', 'Fusion 360', { zh: '3D 打印', en: '3D Printing' }, 'DFM'],
    evidence: { zh: '气动小车、Robocon 底盘', en: 'Pneumatic vehicle · Robocon chassis' },
    color: '#64D2FF',
    glow: '190 100 70',
  },
  {
    index: '02',
    title: { zh: '仿真分析', en: 'Simulation' },
    description: {
      zh: '我用仿真检查热流体、机构运动和电路响应，为设计修改提供依据。',
      en: 'I use thermal, motion and circuit simulations to guide design changes.',
    },
    tools: ['COMSOL', 'ADAMS', 'PSIM', 'MATLAB'],
    evidence: { zh: '斯特林发动机', en: 'Stirling engine' },
    color: '#BF5AF2',
    glow: '282 87 65',
  },
  {
    index: '03',
    title: { zh: '嵌入式控制', en: 'Embedded Control' },
    description: {
      zh: '我把传感器、电路和控制程序接起来，并在实物上调试系统响应。',
      en: 'I integrate sensors, circuits and firmware, then tune the hardware response.',
    },
    tools: ['STM32', 'ESP32-S3', 'C/C++', 'PCB'],
    evidence: { zh: 'Goodent、Buck 调光系统', en: 'Goodent · Buck dimming system' },
    color: '#0A84FF',
    glow: '210 100 52',
  },
  {
    index: '04',
    title: { zh: '机器人', en: 'Robotics' },
    description: {
      zh: '我搭建视觉定位和示教采集流程，用模仿学习探索机械臂操作。',
      en: 'I connect vision, demonstration data and imitation learning in robot experiments.',
    },
    tools: ['LeRobot', 'ACT', 'ArUco', 'MediaPipe'],
    evidence: { zh: 'LeRobot 牙科机器人', en: 'LeRobot dental robot' },
    color: '#FF7657',
    glow: '12 100 67',
  },
  {
    index: '05',
    title: { zh: '产品开发', en: 'Product Development' },
    description: {
      zh: '我把使用需求转成产品原型，通过测试和用户反馈继续改进。',
      en: 'I turn user needs into prototypes and refine them through testing and feedback.',
    },
    tools: [
      { zh: '原型制作', en: 'Prototyping' },
      { zh: '用户研究', en: 'User Research' },
      { zh: '传感器集成', en: 'Sensor Integration' },
    ],
    evidence: { zh: '兰精灵、Goodent', en: 'Lanjingling · Goodent' },
    color: '#30D158',
    glow: '135 64 50',
  },
  {
    index: '06',
    title: { zh: '市场与创业', en: 'Market & Ventures' },
    description: {
      zh: '我通过用户调研和竞品分析梳理产品定位，参与商业计划与融资沟通。',
      en: 'I use market and competitor research to shape products, plans and funding pitches.',
    },
    tools: [
      { zh: '市场调研', en: 'Market Research' },
      { zh: '竞品分析', en: 'Competitor Analysis' },
      { zh: '路演', en: 'Pitching' },
    ],
    evidence: { zh: '致行科技、Goodent', en: 'Zhixing Technology · Goodent' },
    color: '#FF9F0A',
    glow: '35 100 52',
  },
];

const CURRENT_WORK = [
  {
    type: { zh: '创业项目 · 项目负责人', en: 'Startup · Project Lead' },
    title: { zh: 'Goodent · 智能牙科微动力系统', en: 'Goodent · Intelligent Dental Power System' },
    description: {
      zh: '我参与创立 Goodent，面向临床操作开发智能牙科微动力系统。作为项目负责人，我负责确定产品需求、设计系统架构、调试电机控制，并协调团队推进。项目已获得 50 万元种子轮投资，目前正在验证原型、准备合规材料。',
      en: 'I co-founded Goodent to develop an intelligent dental power system for clinical use. As Project Lead, I define product needs, design the system architecture, tune motor control and coordinate the team. The project has secured RMB 500k in seed funding and is now validating prototypes and preparing regulatory materials.',
    },
    tags: [
      { zh: '无刷电机控制', en: 'BLDC Control' },
      { zh: '扭矩估算', en: 'Torque Estimation' },
      'STM32',
      { zh: '医疗器械', en: 'Medical Devices' },
    ],
  },
  {
    type: { zh: '机器人研究', en: 'Robotics Research' },
    title: { zh: 'LeRobot · 牙科机器人', en: 'LeRobot · Dental Robotics' },
    description: {
      zh: '我在搭建牙科操作的视觉定位与示教数据采集流程，结合 ACT 模仿学习，测试机械臂在不同位姿下能否复现操作动作。',
      en: 'I am building visual positioning and demonstration-data workflows for dental manipulation, using ACT imitation learning to test whether the arm can reproduce motions across different poses.',
    },
    tags: ['LeRobot', 'ACT', 'ArUco', { zh: '视觉控制', en: 'Vision-based Control' }],
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
              ['9/58', lang === 'en' ? 'Rank in Major' : '专业排名'],
              ['20+', lang === 'en' ? 'Engineering Projects' : '工程项目'],
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
                style={{ '--focus-color': area.color }}
              >
                <div className="ps-focus-heading">
                  <span className="ps-focus-index">{area.index}</span>
                  <h4 className="ps-card-title">{localized(area.title, lang)}</h4>
                </div>
                <p className="ps-card-copy">{localized(area.description, lang)}</p>
                <div className="ps-focus-tools">
                  {area.tools.map((tool) => (
                    <span key={localized(tool, lang)}>{localized(tool, lang)}</span>
                  ))}
                </div>
                <p className="ps-focus-evidence">
                  <span>{copy.evidenceLabel}</span>
                  {localized(area.evidence, lang)}
                </p>
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
                    {project.tags.map((tag) => (
                      <span key={localized(tag, lang)}>{localized(tag, lang)}</span>
                    ))}
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

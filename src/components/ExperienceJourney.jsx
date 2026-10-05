import { motion } from 'framer-motion';
import { useI18n } from '../i18n-context';
import './ExperienceJourney.css';

const text = (zh, en) => ({ zh, en });

const JOURNEY = [
  {
    year: '2026',
    chapter: text('Goodent、牙科机器人与 SUTD 交换', 'Goodent, dental robotics and an exchange semester at SUTD'),
    milestones: [
      {
        type: text('创业 · 医疗器械', 'Venture · Medical Device'),
        role: text('Goodent 联合创始人 / 系统负责人', 'Goodent Co-founder / System Lead'),
        organization: 'Goodent',
        description: text(
          '我负责产品定义、系统架构与电机控制，和团队完成了三代牙科微动力系统原型，目前正在推进工程验证与合规准备。',
          'I lead product definition, system architecture and motor control. Our team has completed three dental power system prototypes and is moving into engineering validation and compliance preparation.'
        ),
        outcome: text('50 万元种子轮融资', 'RMB 500k seed funding'),
      },
      {
        type: text('研究实践 · 具身智能', 'Research Practice · Embodied AI'),
        role: text('牙科机器人系统实践', 'Dental Robotics System Practice'),
        organization: 'Xbotics Community',
        description: text(
          '我用 LeRobot、ArUco、主从遥操作与 ACT 搭建实验流程，连接示教采集、视觉标定和数据分析，探索牙科操作中的机器人应用。',
          'I use LeRobot, ArUco, teleoperation and ACT to connect demonstration capture, visual calibration and data analysis in dental robotics experiments.'
        ),
        outcome: text('研究原型与数据管线', 'Research prototype and data pipeline'),
      },
      {
        type: text('国际学习', 'International Study'),
        role: text('SUTD 秋季交换学习', 'SUTD Fall Exchange'),
        organization: text('新加坡科技设计大学', 'Singapore University of Technology and Design'),
        description: text(
          '我通过了学校交换项目选拔，获得 2026 年秋季赴新加坡科技设计大学学习的资格与资助。',
          'I was selected through the university exchange programme for a funded Fall 2026 semester at the Singapore University of Technology and Design.'
        ),
        outcome: text('交换资格与资助', 'Funded exchange placement'),
      },
    ],
  },
  {
    year: '2025',
    chapter: text('开始负责完整项目与团队协作', 'Taking responsibility for complete projects and team collaboration'),
    milestones: [
      {
        type: text('项目负责', 'Project Leadership'),
        role: text('国家级大创项目负责人', 'National Innovation Project Lead'),
        organization: text('兰精灵 · 智能养护花盆', 'Lanjingling · Smart Planter'),
        description: text(
          '我从用户需求出发，组织结构设计、传感与控制开发，和团队完成两代原型，再整理结项材料并参加答辩。',
          'I led requirements, enclosure design, sensing and control development. With the team, I completed two prototype iterations, final documentation and the project presentation.'
        ),
        outcome: text('国家级大创优秀结项', 'Excellent completion rating · National innovation programme'),
      },
      {
        type: text('课程与团队', 'Coursework · Team'),
        role: text('课程助教 / Robocon 队员', 'Teaching Assistant / Robocon Member'),
        organization: text('重庆大学', 'Chongqing University'),
        description: text(
          '我在课程助教工作与机器人团队中练习系统分析和机械设计，也学习如何与不同分工的队友一起完成任务。',
          'Through teaching assistance and the robotics team, I practiced system analysis and mechanical design, and learned to work with teammates across disciplines.'
        ),
        outcome: text('底盘、悬架与课程实践', 'Chassis, suspension and course practice'),
      },
    ],
  },
  {
    year: '2024',
    chapter: text('进入产品设计与创业实践', 'Entering product design and venture practice'),
    milestones: [
      {
        type: text('产品 · 创业', 'Product · Venture'),
        role: text('产品设计实习生 / 联合创始人', 'Product Design Intern / Co-founder'),
        organization: text('致行科技', 'Zhixing Technology'),
        description: text(
          '我参与越野车辆参数化建模、零件库整理、工业设计与竞品研究，并以联合创始人的身份推进产品和项目。',
          'I worked on parametric off-road vehicle modelling, part libraries, industrial design and competitor research, while helping develop the product and venture as a co-founder.'
        ),
        outcome: text('项目获得百万级天使轮融资', 'Venture secured seven-figure RMB angel funding'),
      },
    ],
  },
  {
    year: '2023',
    chapter: text('从项目制学习建立工程基础', 'Building an engineering foundation through project-based learning'),
    milestones: [
      {
        type: text('教育', 'Education'),
        role: text('机器人工程本科生', 'B.Eng. Student, Robotics Engineering'),
        organization: text('重庆大学 · 国家卓越工程师学院', 'Chongqing University · National School of Excellent Engineers'),
        description: text(
          '我进入明月科创实验班，通过真实项目学习机械、电子、控制与软件，也开始练习清楚地表达自己的设计。',
          'I joined the Mingyue Innovation Class and learned mechanics, electronics, control and software through real projects, while practicing how to explain my designs clearly.'
        ),
        outcome: text('项目制工程学习起点', 'Starting point of project-based engineering'),
      },
    ],
  },
];

function localize(value, lang) {
  if (typeof value === 'string') return value;
  return value?.[lang] || value?.zh || '';
}

export default function ExperienceJourney() {
  const { lang } = useI18n();
  const copy = lang === 'en'
    ? {
        label: 'Journey',
        title: 'My journey',
        subtitle: 'How I moved from course projects to product development, team leadership and medical-device work.',
        index: 'Selected milestones · 2023—2026',
      }
    : {
        label: '一路走来',
        title: '成长历程',
        subtitle: '从课程项目到产品研发、团队协作和医疗器械实践，我逐步承担了更多责任。',
        index: '关键节点 · 2023—2026',
      };

  return (
    <section className="journey-section" id="experience">
      <div className="journey-container">
        <motion.header
          className="journey-header"
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.75, ease: [0.23, 1, 0.32, 1] }}
        >
          <span className="section-label">{copy.label}</span>
          <p className="journey-index">{copy.index}</p>
          <h2 className="section-heading">{copy.title}</h2>
          <p className="section-subheading">{copy.subtitle}</p>
        </motion.header>

        <div className="journey-list">
          {JOURNEY.map((stage, stageIndex) => (
            <motion.article
              className="journey-stage"
              key={stage.year}
              initial={{ opacity: 0, y: 48 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.75, delay: stageIndex * 0.04, ease: [0.23, 1, 0.32, 1] }}
            >
              <div className="journey-year-column">
                <span className="journey-year">{stage.year}</span>
                <p>{localize(stage.chapter, lang)}</p>
              </div>

              <div className="journey-milestones">
                {stage.milestones.map((milestone, index) => (
                  <div className="journey-milestone" key={`${stage.year}-${index}`}>
                    <div className="journey-marker" aria-hidden="true" />
                    <span className="journey-type">{localize(milestone.type, lang)}</span>
                    <h3>{localize(milestone.role, lang)}</h3>
                    <p className="journey-organization">{localize(milestone.organization, lang)}</p>
                    <p className="journey-description">{localize(milestone.description, lang)}</p>
                    <p className="journey-outcome">{localize(milestone.outcome, lang)}</p>
                  </div>
                ))}
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

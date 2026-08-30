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
          '负责产品定义、系统架构与电机控制，推动智能牙科微动力系统完成三代原型，并进入工程验证与合规准备。',
          'Leading product definition, system architecture and motor control for an intelligent dental power system through three prototype generations and into engineering validation.'
        ),
        outcome: text('50 万元种子轮融资', 'RMB 500k seed funding'),
      },
      {
        type: text('研究实践 · 具身智能', 'Research Practice · Embodied AI'),
        role: text('牙科机器人系统实践', 'Dental Robotics System Practice'),
        organization: 'Xbotics Community',
        description: text(
          '围绕 LeRobot、ArUco、主从遥操作与 ACT，建立从示教采集、视觉标定到数据分析的实验链路。',
          'Building an experimental pipeline from demonstration capture and visual calibration to data analysis with LeRobot, ArUco, teleoperation and ACT.'
        ),
        outcome: text('研究原型与数据管线', 'Research prototype and data pipeline'),
      },
      {
        type: text('国际学习', 'International Study'),
        role: text('SUTD 秋季交换学习', 'SUTD Fall Exchange'),
        organization: 'Singapore University of Technology and Design',
        description: text(
          '通过学校交换项目选拔，获得 2026 年秋季赴新加坡科技设计大学学习的资格与资助。',
          'Selected through the university exchange programme for a funded Fall 2026 semester at the Singapore University of Technology and Design.'
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
          '从用户需求出发，组织结构、传感、控制与两代原型迭代，并完成结项材料与答辩。',
          'Led requirements, enclosure, sensing, control and two prototype iterations through final documentation and defense.'
        ),
        outcome: text('国家级大创优秀结项', 'Excellent national-project completion'),
      },
      {
        type: text('课程与团队', 'Coursework · Team'),
        role: text('课程助教 / Robocon 队员', 'Teaching Assistant / Robocon Member'),
        organization: text('重庆大学', 'Chongqing University'),
        description: text(
          '在课程支持与机器人团队中持续训练系统拆解、机械设计和跨角色协作。',
          'Strengthened system decomposition, mechanical design and cross-functional collaboration through course support and the robotics team.'
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
          '参与越野车辆参数化建模、零件库、工业设计与竞品研究，并以联合创始人身份参与产品与项目推进。',
          'Worked on parametric off-road vehicle modelling, part libraries, industrial design and competitor research while helping advance the product and venture as a co-founder.'
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
          '进入明月科创实验班，以真实项目连接机械、电子、控制、软件与产品表达。',
          'Joined the Mingyue Innovation Class, using real projects to connect mechanics, electronics, control, software and product communication.'
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
        title: 'From project-based study to product, venture and medical-device practice.',
        subtitle: 'This timeline records the main problems I worked on each year and how my responsibilities changed along the way.',
        index: 'Selected milestones · 2023—2026',
      }
    : {
        label: '成长历程',
        title: '从项目制学习，到产品、创业与医疗器械实践。',
        subtitle: '这条时间线记录了每一年我主要在解决什么问题，也记录了我承担的责任如何变化。',
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

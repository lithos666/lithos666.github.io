import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BorderGlow from './ui/BorderGlow';
import './KnowledgeBase.css';

/* ═════════════════════════════════════════════════════
   KnowledgeBase — 知识库导航组件 v3
   
   Layout:
   - Featured row: first 4 items as large BorderGlow cards
   - Flat compact list below (no grouping)
   - No search or filter toolbar
   
   ═════════════════════════════════════════════════════ */

const FALLBACK_COLOR = '#7C4DFF';

const knowledgeData = [
  {
    id: 'user-debug', label: '用户调试（小而精）', category: 'hardware', icon: '🔧',
    desc: '轻量级用户调试工具链，专注于高效排查问题。',
    content: "## 用户调试方法论\n\n### 核心原则：小而精\n\n**\"小而精\"调试哲学** — 不要用大炮打蚊子。好的调试工具应该像手术刀一样精准。\n\n### 调试三步法\n\n1. **可复现性优先**\n   - 问题能否稳定复现？\n   - 记录触发条件、时间戳、环境参数\n   - 使用最小化测试用例隔离变量\n\n2. **二分定位法**\n   - 将系统拆分为已知正常 / 已知异常两个区域\n   - 用二分思想逐步缩小范围\n   - 每次排除 50% 的可能性\n\n3. **假设验证循环**\n   - 提出假设 → 设计验证实验 → 收集证据 → 确认/推翻\n   - 每个周期控制在 15 分钟内\n\n### 嵌入式常用工具链\n\n| 工具 | 适用场景 | 特点 |\n|------|---------|------|\n| J-Link RTT | 无 UART 时的日志 | 零延迟，不占用引脚 |\n| SWO | Cortex-M 跟踪 | 实时 PC 采样 |\n| Logic Analyzer | I2C/SPI/UART 协议 | 非侵入式，看时序最直观 |\n| OpenOCD + GDB | 断点调试 | 看寄存器/内存/调用栈 |\n\n### 经验法则\n\n> \"90% 的 bug 都在接口层.\" — 检查模块间的数据流和协议匹配度，比深入模块内部更有效。\n\n### 延伸阅读\n- 《Debugging: The 9 Indispensable Rules》\n- ARM Debug Interface v5/v6 规范",
  },
  {
    id: 'comsol', label: 'COMSOL 物理仿真软件', category: 'simulation', icon: '🌊',
    desc: '多物理场耦合仿真，电磁-热-结构联合分析。',
    content: "## COMSOL Multiphysics 实践指南\n\n### 多物理场耦合核心思路\n\nCOMSOL 的强大在于**物理场之间的耦合**。单一物理场求解是基础，真正有价值的工程问题几乎都是多场耦合的。",
  },
  {
    id: 'emotion', label: '情感密码', category: 'ai', icon: '💭',
    desc: '情感计算与多模态情感识别技术研究。',
    content: "## 情感密码 — 情感计算研究笔记\n\n### 什么是情感计算?\n\n情感计算 (Affective Computing) 是研究如何识别、解释、处理和模拟人类情感的交叉学科。",
  },
  {
    id: 'user-research', label: '用户调研（完成）', category: 'research', icon: '📋',
    desc: '完整的用户研究方法论与实践案例总结。',
    content: "## 用户调研方法论（已完成项目）\n\n### 调研框架概览\n\n本项目采用**双钻模型 (Double Diamond)** 作为整体调研框架。",
  },
  {
    id: 'tesla-biography', label: '史蒂夫·乔布斯传', category: 'history', icon: '📖',
    desc: '硅谷传奇人物的创业历程与技术哲学。',
    content: "## 史蒂夫·乔布斯传 — 读书笔记\n\n### 核心摘录\n\n#### 关于产品设计\n> \"Design is not just what it looks like and feels like. Design is how it works.\"",
  },
  {
    id: 'selenium', label: 'Selenium（完成）', category: 'testing', icon: '🤖',
    desc: '自动化测试框架的深度实践与最佳实践。',
    content: "## Selenium 自动化测试实践（已完成）\n\n### 项目概述\n基于 Selenium WebDriver + Pytest 构建 UI 自动化测试体系。",
  },
  {
    id: 'arduino', label: 'Arduino', category: 'hardware', icon: '⚙',
    desc: '开源硬件平台原型开发与物联网应用。',
    content: "## Arduino 开发笔记\n\n### 为什么选 Arduino?\n快速原型验证的首选平台。",
  },
  {
    id: 'mediapipe', label: 'MediaPipe（完成）', category: 'ml', icon: '✋',
    desc: 'Google 跨平台机器学习感知管线实战。',
    content: "## MediaPipe 实战项目（已完成）\n\n### 项目概述\n基于 Google MediaPipe 实现实时手势识别与人机交互系统。",
  },
  {
    id: 'sports-exercise', label: '机臀臂运动（完成）', category: 'fitness', icon: '💪',
    desc: '科学训练方法与运动康复指南。',
    content: "## 机臀臂科学训练体系（已完成）\n\n### 训练理念\n以**生物力学**为基础，结合**渐进超负荷**原则。",
  },
  {
    id: 'keyshot-rendering', label: 'Keyshot渲染进阶', category: 'design', icon: '🎨',
    desc: '产品渲染的高级材质与灯光技巧。',
    content: "## Keyshot 渲染进阶技巧\n\n### 材质系统深度解析",
  },
  {
    id: 'blender-sim', label: 'Blender Simulation', category: 'design', icon: '🌀',
    desc: 'Blender 物理模拟：流体、布料、刚体动力学。',
    content: "## Blender Physics Simulation 实践\n\n### MantaFlow 流体模拟",
  },
  {
    id: 'poster', label: '海报设计方法论', category: 'design', icon: '🎞',
    desc: '海报设计排版与视觉叙事方法论。',
    content: "## 海报设计方法论\n\n### 视觉层次原则 (Visual Hierarchy)",
  },
  {
    id: 'detection', label: '综合测试体系建设', category: 'testing', icon: '📊',
    desc: '综合测试策略与自动化测试体系建设。',
    content: "## 综合测试体系建设\n\n### 测试金字塔",
  },
  {
    id: 'bluetooth-module', label: '蓝牙精建模', category: 'hardware', icon: '📡',
    desc: '蓝牙低功耗模块设计与通信协议优化。',
    content: "## 蓝牙 BLE 精建模设计\n\n### BLE 协议栈架构",
  },
  {
    id: 'traveling', label: '骑行旅行经验', category: 'life', icon: '🚲',
    desc: '骑行路线规划与长途旅行经验分享。',
    content: "## 骑行旅行经验\n\n### 装备清单",
  },
  {
    id: 'startup-details', label: '创业实操细节', category: 'business', icon: '🚀',
    desc: '从 0 到 1 的创业实操细节与避坑指南。',
    content: "## 创业实操细节\n\n### 从想法到 MVP 的 90 天计划",
  },
  {
    id: 'sensor-collection', label: '传感器合集', category: 'hardware', icon: '📏',
    desc: '各类传感器选型、接口与应用场景整理。',
    content: "## 传感器选型手册\n\n### 分类索引",
  },
  {
    id: 'yolo', label: 'YOLO 目标检测', category: 'ml', icon: '👁',
    desc: '目标检测算法原理、调优与部署实践。',
    content: "## YOLO 目标检测实战\n\n### YOLO 版本演进",
  },
  {
    id: 'machine-learning', label: '机器学习全链路', category: 'ml', icon: '🧮',
    desc: '机器学习基础理论到工业级应用的全链路。',
    content: "## 机器学习全链路笔记\n\n### 学习路线图",
  },
  {
    id: 'kali', label: 'Kali Linux 安全测试', category: 'security', icon: '🔒',
    desc: '渗透测试工具集与安全审计方法论。',
    content: "## Kali Linux 安全测试笔记\n\n### 重要声明",
  },
  {
    id: 'industrial-design', label: '工业设计知识体系', category: 'design', icon: '🏗',
    desc: '产品设计思维与制造工艺知识体系。',
    content: "## 工业设计知识体系\n\n### 设计流程",
  },
  {
    id: 'unity', label: 'Unity 开发实践', category: 'dev', icon: '🎮',
    desc: '游戏引擎开发、交互体验与 XR 应用。',
    content: "## Unity 开发实践\n\n### 核心概念: GameObject + Component 架构",
  },
  {
    id: 'ros-robotics', label: 'ROS 机器人操作系统', category: 'robotics', icon: '🤖',
    desc: '机器人操作系统架构与运动控制实践。',
    content: "## ROS 机器人操作系统\n\n### ROS 核心架构",
  },
  {
    id: 'matlab-simulink', label: 'Matlab-Simulink', category: 'engineering', icon: '📈',
    desc: '控制系统仿真与信号处理工具链。',
    content: "## MATLAB/Simulink 工程实践\n\n### Simulink 建模基础",
  },
  {
    id: 'ppt-design', label: 'PPT 设计方法论', category: 'design', icon: '📇',
    desc: '演示文稿的信息架构与视觉呈现艺术。',
    content: "## PPT 设计方法论\n\n### 核心理念: 少即是多",
  },
];

const CATEGORY_COLORS = {
  hardware: '#448AFF', ai: '#FF4081', ml: '#7C4DFF',
  engineering: '#448AFF', design: '#FF6E40', research: '#69F0AE',
  business: '#FFD740', simulation: '#00BCD4', testing: '#FF5722',
  fitness: '#4CAF50', life: '#8BC34A', security: '#9C27B0',
  dev: '#607D8B', robotics: '#009688', philosophy: '#B388FF',
  history: '#FF9800',
};

export default function KnowledgeBase() {
  const [selectedItem, setSelectedItem] = useState(null);

  // Split into featured (first 4) and rest
  const featuredItems = knowledgeData.slice(0, 4);
  const listItems = knowledgeData.slice(4);

  const handleCloseModal = useCallback(() => setSelectedItem(null), []);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (selectedItem) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [selectedItem]);

  return (
    <section id="knowledge" className="knowledge-section">
      <div className="knowledge-glow knowledge-glow-1" />
      <div className="knowledge-glow knowledge-glow-2" />

      <div className="knowledge-container">
        {/* Header */}
        <motion.div
          className="knowledge-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <span className="section-label">知识库导航</span>
          <h2 className="section-heading">
            我的文库
            <br />
            <span className="heading-accent">全部文档索引</span>
          </h2>
          <p className="section-subheading">
            涵盖硬件设计、算法研究、AI/ML、创业思考等多个领域的知识积累。
            点击任意条目查看详情。
          </p>
        </motion.div>

        {/* ═══ Featured Row ═══ */}
        {featuredItems.length > 0 && (
          <motion.div
            className="knowledge-featured"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="knowledge-featured-grid">
              {featuredItems.map((item) => (
                <BorderGlow
                  key={item.id}
                  className="knowledge-card knowledge-card-featured"
                  glowColor={CATEGORY_COLORS[item.category] || FALLBACK_COLOR}
                  backgroundColor="#0a0814"
                  borderRadius={18}
                  intensity={0.8}
                  colors={['#c084fc', '#f472b6', '#38bdf8']}
                  fillOpacity={0.3}
                  onClick={() => setSelectedItem(item)}
                >
                  <span className="k-card-icon">{item.icon}</span>
                  <h3 className="k-card-title">{item.label}</h3>
                  <p className="k-card-desc">{item.desc}</p>
                </BorderGlow>
              ))}
            </div>
          </motion.div>
        )}

        {/* ═══ Flat List ═══ */}
        {listItems.length > 0 && (
          <motion.div
            className="knowledge-list-section"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="group-items">
              {listItems.map((item) => (
                <div
                  key={item.id}
                  className="knowledge-list-item"
                  onClick={() => setSelectedItem(item)}
                >
                  <span className="list-item-icon">{item.icon}</span>
                  <div className="list-item-content">
                    <span className="list-item-title">{item.label}</span>
                    <span className="list-item-desc">{item.desc}</span>
                  </div>
                  <svg className="list-item-arrow" width="14" height="14" viewBox="0 0 16 16" fill="none">
                    <path d="M4 12L12 4M12 4H6M12 4v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        <p className="result-count">共 {knowledgeData.length} 条记录</p>
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            className="knowledge-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCloseModal}
          >
            <motion.div
              className="knowledge-modal glass-card modal-with-content"
              initial={{ opacity: 0, y: 40, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.96 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header-row">
                <div className="modal-header-left">
                  <span className="modal-icon">{selectedItem.icon}</span>
                  <div>
                    <h2 className="modal-title">{selectedItem.label}</h2>
                  </div>
                </div>
                <button className="modal-close" onClick={handleCloseModal} data-hover>&times;</button>
              </div>

              <p className="modal-desc">{selectedItem.desc}</p>

              <div className="modal-document-content">
                <pre>{selectedItem.content ?? '暂无内容'}</pre>
              </div>

              <div className="modal-meta">
                <span>ID: {selectedItem.id}</span>
                <span>分类: {selectedItem.category}</span>
                <span>字符数: {(selectedItem.content ?? '').length.toLocaleString()}</span>
              </div>
              <div className="modal-actions">
                <button className="modal-btn modal-btn-primary" data-hover>
                  打开完整文档
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                    <path d="M6 12l6-4-6-4v8z" fill="currentColor"/>
                  </svg>
                </button>
                <button className="modal-btn modal-btn-secondary" onClick={handleCloseModal} data-hover>
                  关闭
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

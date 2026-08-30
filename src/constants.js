/**
 * 全局共享常量定义
 * 集中管理魔法数字和配置参数，提升可维护性
 */

// ── Cover Flow 轮播配置 ──
export const COVER_FLOW = {
  /** 两侧卡片 X 轴偏移基数 (px) */
  CARD_X_OFFSET: 380,
  /** 中心卡片宽度 (px) */
  ACTIVE_CARD_WIDTH: 600,
  /** 侧边卡片宽度 (px) */
  INACTIVE_CARD_WIDTH: 500,
  /** 中心卡片高度 (px) */
  ACTIVE_CARD_HEIGHT: 640,
  /** 侧边卡片高度 (px) */
  INACTIVE_CARD_HEIGHT: 540,
  /** 3D 倾斜角度 (deg) */
  ROTATE_Y_DEG: 9,
  /** 拖拽触发速度阈值 */
  DRAG_VELOCITY_THRESHOLD: 100,
  /** 拖拽约束范围 */
  DRAG_CONSTRAINT: { left: -100, right: 100 },
  /** 弹性阻力系数 */
  DRAG_ELASTICITY: 0.08,
  /** 动画弹簧刚度 */
  SPRING_STIFFNESS: 300,
  /** 动画阻尼系数 */
  SPRING_DAMPING: 32,
  /** 动画质量 */
  SPRING_MASS: 0.8,
};

// ── 卡片样式计算参数 ──
export const CARD_STYLE = {
  /** 中心位置缩放值 */
  SCALE_CENTER: 1,
  /** 相邻位置(±1)缩放值 */
  SCALE_ADJACENT: 0.68,
  /** 远端最小缩放值 */
  SCALE_MIN: 0.45,
  /** 缩放衰减系数 */
  SCALE_DECAY: 0.2,
  /** 中心位置透明度 */
  OPACITY_CENTER: 1,
  /** 远端最小透明度 */
  OPACITY_MIN: 0.25,
  /** 透明度衰减系数 */
  OPACITY_DECAY: 0.35,
  /** 中心模糊 (px) */
  BLUR_CENTER: 0,
  /** 最大模糊 (px) */
  BLUR_MAX: 20,
};

// ── 导航栏动画 ──
export const NAVBAR = {
  /** 入场延迟时间 (s) */
  ANIMATION_DELAY: 2.8,
  /** 触发滚动的距离阈值 (px) */
  SCROLL_THRESHOLD: 60,
};

// ── 自定义光标 ──
export const CURSOR = {
  /** 节流间隔 (ms) — 约等于 60fps */
  THROTTLE_MS: 16,
  /** 弹簧配置 - 光标点 */
  SPRING_CURSOR: { damping: 26, stiffness: 280, mass: 0.45 },
  /** 弹簧配置 - 拖尾 */
  SPRING_TRAIL: { damping: 38, stiffness: 160, mass: 0.72 },
};

// ── 表单验证 ──
export const VALIDATION = {
  /** 邮箱正则 */
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  /** 最短消息长度 */
  MIN_MESSAGE_LENGTH: 10,
};

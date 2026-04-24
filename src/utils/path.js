/**
 * 处理静态资源的基础路径
 * 开发环境返回原路径，生产环境（GitHub Pages）自动添加 base 前缀
 */
const BASE = import.meta.env.BASE_URL || '/'

export function asset(path) {
  // 如果已经是完整 URL 或以 base 开头，直接返回
  if (path.startsWith('http') || path.startsWith(BASE)) {
    return path
  }
  // 确保去掉开头的 /，避免双斜杠
  return `${BASE}${path.replace(/^\//, '')}`
}

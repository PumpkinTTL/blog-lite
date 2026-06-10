import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

// ═══ 主题色 — 与 v2.css 中 --v2-primary 保持同步 ═══
// light: hsl(0 0% 9%)  → 近黑色
// dark:  hsl(210 20% 96%) → 浅灰色
const LIGHT_COLOR = 'hsl(0, 0%, 9%)'
const DARK_COLOR  = 'hsl(210, 20%, 96%)'
const THEME_KEY = 'app-theme'

/** 用 localStorage + matchMedia 判断深浅色 — 不依赖 DOM，首次加载也能正确判断 */
function resolveTheme(): 'light' | 'dark' {
  const saved = localStorage.getItem(THEME_KEY)
  if (saved === 'light') return 'light'
  if (saved === 'dark')  return 'dark'
  // auto 或其他情况：跟随系统
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function getColor(): string {
  return resolveTheme() === 'dark' ? DARK_COLOR : LIGHT_COLOR
}

function applyColor() {
  const color = getColor()
  NProgress.configure({ color })
  document.documentElement.style.setProperty('--np-color', color)
}

// 基础配置
NProgress.configure({
  showSpinner: false,
  speed:         400,
  trickleSpeed:  200,
  minimum:       0.08,
  easing:        'ease',
})

// 初始化颜色（此时 Vue 可能未挂载，走 localStorage + matchMedia 逻辑）
applyColor()

// 监听主题切换（class 或 data-theme 变化 → 同步颜色）
const observer = new MutationObserver(applyColor)
observer.observe(document.documentElement, {
  attributes: true,
  attributeFilter: ['class', 'data-theme'],
})

export const progressStart = () => {
  applyColor()
  NProgress.start()
}
export const progressDone = () => NProgress.done()

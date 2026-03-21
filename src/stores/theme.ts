import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import type { ThemeMode } from '@/utils/theme'
import { setTheme, applyTheme, getCurrentTheme, isDarkMode } from '@/utils/theme'

export const useThemeStore = defineStore('theme', () => {
  // 响应式状态
  const mode = ref<ThemeMode>(getCurrentTheme())

  // 先应用主题到 DOM，再获取 isDark 状态
  applyTheme(mode.value)
  const isDark = ref(isDarkMode())

  // 切换主题（在 light 和 dark 之间切换）
  const toggle = () => {
    const newMode: ThemeMode = isDark.value ? 'light' : 'dark'
    setMode(newMode)
  }

  // 设置主题模式
  const setMode = (newMode: ThemeMode) => {
    mode.value = newMode
    setTheme(newMode)
    isDark.value = isDarkMode()
  }

  // 监听 isDark 变化，同步 HTML class（给 CSS 选择器用）
  watch(isDark, (val) => {
    const html = document.documentElement
    if (val) {
      html.classList.add('dark')
      html.setAttribute('data-theme', 'dark')
    } else {
      html.classList.remove('dark')
      html.setAttribute('data-theme', 'light')
    }
  }, { immediate: true })

  return {
    mode,
    isDark,
    toggle,
    setMode
  }
})

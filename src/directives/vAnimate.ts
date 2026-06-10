import type { Directive } from 'vue'

/**
 * v-animate 指令
 * 元素进入视口时添加 v2-animated class 触发 CSS 动画
 * 
 * 用法: v-animate (自动检测动画 class)
 * 带延迟: v-animate:300 (延迟 300ms 后再触发)
 */
export const vAnimate: Directive<HTMLElement> = {
  mounted(el, binding) {
    // 获取延迟参数 (ms)
    const delay = binding.arg ? parseInt(binding.arg) : 0

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (delay > 0) {
            setTimeout(() => {
              el.classList.add('v2-animated')
            }, delay)
          } else {
            el.classList.add('v2-animated')
          }
          observer.disconnect()
        }
      },
      { threshold: 0.08 }
    )
    observer.observe(el)
  },
}

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { HeadList } from 'md-editor-v3'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

interface TocItem {
  id: string
  level: number
  text: string
}

type MdHeadingIdFn = (opts: { text: string; level: number; index: number }) => string

const props = withDefaults(defineProps<{
  editorId: string
  /** 直接接收 MdPreview onGetCatalog 抛上来的目录数据,免去 DOM 轮询 */
  headingsList: HeadList[]
  /** 与 MdPreview 共享的 id 生成函数,保证 TOC 和 DOM 的 heading id 完全一致 */
  mdHeadingId?: MdHeadingIdFn
  /** 父组件 catalog 就绪后自增,触发 IntersectionObserver 重建 */
  catalogVersion?: number
  scrollElement?: string
  mobile?: boolean
}>(), {
  mdHeadingId: ({ text, index }: { text: string; level: number; index: number }) => `h-${index}-${text}`,
  catalogVersion: 0,
  scrollElement: 'html',
  mobile: false,
})

const activeId = ref<string>('')
const readingProgress = ref(0)

let headingEls: HTMLElement[] = []
let observer: IntersectionObserver | null = null
let rafId = 0
let lastUpdate = 0

// 1. 直接用 HeadList[] + 共享 mdHeadingId 计算 TOC 项 → id 与 DOM 完全一致
const tocItems = computed<TocItem[]>(() => {
  return props.headingsList.map((h, i) => ({
    id: props.mdHeadingId({ text: h.text, level: h.level, index: i + 1 }),
    level: h.level,
    text: h.text,
  }))
})

// 2. catalogVersion 变化时,按 id 查 DOM 元素并建立 IntersectionObserver
async function setupObserver(): Promise<void> {
  if (observer) {
    observer.disconnect()
    observer = null
  }
  await nextTick()
  await new Promise((r) => setTimeout(r, 50))

  if (tocItems.value.length === 0) return

  // 通过共享 id 直接定位 DOM,不再 querySelectorAll 猜测
  headingEls = tocItems.value
    .map((item) => document.getElementById(item.id))
    .filter((el): el is HTMLElement => el !== null)

  if (headingEls.length === 0) return

  observer = new IntersectionObserver(
    (entries) => {
      const intersecting = entries.filter((e) => e.isIntersecting)
      if (intersecting.length > 0) {
        intersecting.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        const target = intersecting[0].target as HTMLElement
        if (target.id && target.id !== activeId.value) {
          activeId.value = target.id
        }
      }
    },
    {
      // 顶部 80px 留 sticky header,底部 65% 视为已通过
      rootMargin: '-80px 0px -65% 0px',
      threshold: 0,
    },
  )
  headingEls.forEach((el) => observer!.observe(el))
}

// 3. 点击跳转:smooth 滚动,顶部偏移由 ArticleContent 的 scroll-margin-top: 6rem 兜底
function scrollToHeading(h: TocItem) {
  const el = document.getElementById(h.id)
  if (!el) return
  el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  if (props.mobile) {
    window.dispatchEvent(new CustomEvent('v2-toc-jump'))
  }
}

// 4. 阅读进度
function handleScroll() {
  if (props.mobile) return
  const now = Date.now()
  if (now - lastUpdate < 66) return
  lastUpdate = now
  if (rafId) cancelAnimationFrame(rafId)
  rafId = requestAnimationFrame(() => {
    const html = document.documentElement
    const st = html.scrollTop || document.body.scrollTop
    const sh = html.scrollHeight || document.body.scrollHeight
    const ch = html.clientHeight
    const total = sh - ch
    readingProgress.value = total > 0 ? Math.min((st / total) * 100, 100) : 0
  })
}

const headingCount = computed(() => tocItems.value.length)

// catalogVersion 自增 → DOM 一定就绪 → 重建 observer
watch(() => props.catalogVersion, (v) => {
  if (v > 0) setupObserver()
})

// 切文章:清状态
watch(() => props.headingsList, () => {
  activeId.value = ''
  if (observer) {
    observer.disconnect()
    observer = null
  }
})

onMounted(() => {
  if (!props.mobile) {
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
  }
})

onBeforeUnmount(() => {
  if (observer) {
    observer.disconnect()
    observer = null
  }
  if (!props.mobile) {
    window.removeEventListener('scroll', handleScroll)
  }
  if (rafId) cancelAnimationFrame(rafId)
})

// 缩进:level 越深 pl 越大,indicator 在 pl-3 处保留 8px(gap-2)与文本间隔
function containerClass(level: number): string {
  if (level === 1) return 'pl-3'
  if (level === 2) return 'pl-7'
  return 'pl-11'
}
</script>

<template>
  <!-- 桌面端:Card 包裹 -->
  <Card v-if="!mobile" class="gap-0">
    <CardHeader class="px-4 pb-3 pt-4">
      <div class="flex items-center justify-between">
        <span class="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          目录
        </span>
        <span class="text-xs tabular-nums text-muted-foreground">
          {{ Math.round(readingProgress) }}%
        </span>
      </div>
      <Progress :model-value="readingProgress" class="h-1" />
    </CardHeader>
    <CardContent class="px-2 pb-3">
      <!-- 桌面端无内部 ScrollArea:由父级 aside 的 ScrollArea 统一管理滚动 -->
      <nav v-if="headingCount > 0" class="flex flex-col gap-0.5 px-1 py-1">
        <button
          v-for="h in tocItems"
          :key="h.id"
          type="button"
          class="group flex w-full items-start gap-2 rounded-md py-2 pr-3 text-left text-[13px] leading-[1.55] text-muted-foreground transition-colors duration-150 hover:bg-accent hover:text-foreground"
          :class="[
            containerClass(h.level),
            activeId === h.id
              ? 'font-medium text-primary'
              : 'font-normal',
          ]"
          @click="scrollToHeading(h)"
        >
          <!--
            左侧 indicator:v1 验证过的对齐方案
            · items-start 让 indicator 与 text 同起点(y=padding-top)
            · height 等于 text 首行行高(13px × 1.55 ≈ 20px → h-5)
            · 无需 mt- 偏移,首行完美对齐
          -->
          <span
            class="mt-0 h-5 w-[2px] shrink-0 rounded-r transition-colors duration-150"
            :class="activeId === h.id ? 'bg-primary' : 'bg-transparent'"
          />
          <span class="block flex-1 truncate">{{ h.text }}</span>
        </button>
      </nav>
      <div v-else class="py-8 text-center text-xs text-muted-foreground">
        暂无目录
      </div>
    </CardContent>
  </Card>

  <!-- 移动端:Sheet 内简单列表,无 Card 包裹 -->
  <div v-else class="flex flex-col gap-3">
    <ScrollArea v-if="headingCount > 0" class="max-h-[70vh]">
      <nav class="flex flex-col gap-0.5 px-1 py-1">
        <button
          v-for="h in tocItems"
          :key="h.id"
          type="button"
          class="group flex w-full items-start gap-2 rounded-md py-2.5 pr-3 text-left text-sm leading-[1.55] text-muted-foreground transition-colors duration-150 hover:bg-accent hover:text-foreground"
          :class="[
            containerClass(h.level),
            activeId === h.id
              ? 'font-medium text-primary'
              : 'font-normal',
          ]"
          @click="scrollToHeading(h)"
        >
          <!-- 移动端 text-sm/14px × 1.55 ≈ 22px 行高 -->
          <span
            class="mt-0 h-[22px] w-[2px] shrink-0 rounded-r transition-colors duration-150"
            :class="activeId === h.id ? 'bg-primary' : 'bg-transparent'"
          />
          <span class="block flex-1 truncate">{{ h.text }}</span>
        </button>
      </nav>
    </ScrollArea>
    <div v-else class="py-8 text-center text-xs text-muted-foreground">
      暂无目录
    </div>
  </div>
</template>

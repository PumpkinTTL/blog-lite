<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { Mail, ArrowRight, Megaphone, Github, Twitter, Rss, Users, ChevronLeft, ChevronRight } from 'lucide-vue-next'
import type { Resource } from '@/data/mockData'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import AdCard from '@/components/v2/common/AdCard.vue'

const props = defineProps<{
  posts: Resource[]
}>()

const socialLinks = [
  { label: 'GitHub', icon: Github, href: 'https://github.com' },
  { label: 'Twitter', icon: Twitter, href: 'https://twitter.com' },
  { label: 'RSS', icon: Rss, href: '/rss.xml' },
]

// 公告跑马灯
const announcements = [
  { title: 'v2.0 上线公告', text: '全新设计已发布，支持暗色模式和响应式布局，欢迎体验并反馈。' },
  { title: '社区征稿活动', text: '分享你的技术实践，优秀文章将获得首页推荐和专属徽章奖励。' },
  { title: '每周精选 #42', text: '本周热门：Vue 3.5 新特性解析、Rust 入门指南、AI 辅助编码实践。' },
]

const currentIndex = ref(0)
let timer: ReturnType<typeof setInterval> | null = null

function prev() {
  currentIndex.value = (currentIndex.value - 1 + announcements.length) % announcements.length
  resetTimer()
}

function next() {
  currentIndex.value = (currentIndex.value + 1) % announcements.length
  resetTimer()
}

function resetTimer() {
  if (timer) clearInterval(timer)
  timer = setInterval(() => {
    currentIndex.value = (currentIndex.value + 1) % announcements.length
  }, 5000)
}

onMounted(() => {
  resetTimer()
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<template>
  <aside class="space-y-5">
    <!-- 公告栏：跑马灯 -->
    <Card class="shadow-none rounded-xl p-4">
      <div class="flex items-start gap-3">
        <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/30">
          <Megaphone class="h-4 w-4 text-amber-700 dark:text-amber-400" />
        </div>
        <div class="min-w-0 flex-1">
          <div class="text-xs font-semibold text-amber-700 dark:text-amber-400">
            {{ announcements[currentIndex].title }}
          </div>
          <p class="mt-0.5 text-[11px] leading-relaxed text-muted-foreground">
            {{ announcements[currentIndex].text }}
          </p>
        </div>
        <div class="flex shrink-0 items-center gap-0.5">
          <Button variant="ghost" size="icon" class="h-6 w-6 cursor-pointer" @click="prev">
            <ChevronLeft class="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="icon" class="h-6 w-6 cursor-pointer" @click="next">
            <ChevronRight class="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
      <!-- 指示点 -->
      <div class="mt-2 flex items-center justify-center gap-1">
        <span
          v-for="(_, i) in announcements"
          :key="i"
          class="block h-1 rounded-full transition-all duration-300"
          :class="i === currentIndex ? 'w-3 bg-amber-700 dark:bg-amber-400' : 'w-1 bg-muted-foreground/25'"
        />
      </div>
    </Card>

    <!-- 社交媒体 -->
    <Card class="shadow-none rounded-xl p-5">
      <h3 class="flex items-center gap-2 text-sm font-semibold">
        <Users class="h-4 w-4 text-muted-foreground" />
        关注我们
      </h3>
      <p class="mt-1 text-xs text-muted-foreground">获取最新动态和开源项目</p>
      <Separator class="my-3" />
      <div class="flex items-center gap-2">
        <Button
          v-for="link in socialLinks"
          :key="link.label"
          variant="outline"
          size="icon"
          class="h-9 w-9 cursor-pointer"
          as="a"
          :href="link.href"
          target="_blank"
          :aria-label="link.label"
        >
          <component :is="link.icon" class="h-4 w-4" />
        </Button>
      </div>
    </Card>

    <!-- 广告位 -->
    <AdCard
      title="Vue 3 企业级实战"
      description="从零搭建完整项目，涵盖 TypeScript、Pinia、Router 等核心技术栈。"
      image="https://picsum.photos/seed/vue3-ad/600/300"
      button-text="立即学习"
      href="https://vuejs.org"
    />

    <!-- 订阅卡片 -->
    <Card class="shadow-none rounded-xl bg-gradient-to-br from-card to-muted/40 p-5">
      <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
        <Mail class="h-5 w-5 text-primary" />
      </div>
      <h3 class="mt-3 text-sm font-semibold">订阅每周精选</h3>
      <p class="mt-1 text-xs text-muted-foreground leading-relaxed">
        每周一上午发送,精选本周最受欢迎的技术文章,可随时取消。
      </p>
      <div class="mt-3 space-y-2">
        <Input placeholder="your@email.com" class="h-9 text-sm" />
        <Button class="w-full cursor-pointer">
          立即订阅
          <ArrowRight class="ml-1 h-3.5 w-3.5" />
        </Button>
      </div>
    </Card>
  </aside>
</template>

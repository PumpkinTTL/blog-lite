<script setup lang="ts">
import { Mail, ArrowRight, Megaphone, Github, Twitter, Rss } from 'lucide-vue-next'
import type { Resource } from '@/data/mockData'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription } from '@/components/ui/alert'
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
</script>

<template>
  <aside class="space-y-5">
    <!-- 公告栏 -->
    <Alert class="rounded-xl border-amber-500/30 bg-amber-500/5">
      <Megaphone class="h-4 w-4 text-amber-600" />
      <AlertDescription class="text-xs leading-relaxed">
        <span class="font-medium text-amber-700 dark:text-amber-400">v2.0 上线公告</span>
        <span class="text-muted-foreground"> — 全新设计已发布，支持暗色模式和响应式布局，欢迎体验并反馈。</span>
      </AlertDescription>
    </Alert>

    <!-- 社交媒体 -->
    <Card class="shadow-none rounded-xl p-5">
      <h3 class="text-sm font-semibold">关注我们</h3>
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

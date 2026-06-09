<script setup lang="ts">
import { Github, Mail, Rss, Heart } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

const currentYear = new Date().getFullYear()

const navGroups = [
  {
    title: '产品',
    links: [
      { label: '首页', to: '/v2' },
      { label: '商城', to: '/v2/shop' },
      { label: '赞助', to: '/v2/donation' },
    ],
  },
  {
    title: '社区',
    links: [
      { label: '关于', to: '/v2/about' },
      { label: 'GitHub', href: 'https://github.com', external: true },
      { label: '反馈', href: 'mailto:contact@bloglite.dev', external: true },
    ],
  },
]
</script>

<template>
  <footer class="border-t bg-muted/30">
    <div class="mx-auto max-w-6xl px-6 py-10">
      <div class="grid gap-8 sm:grid-cols-3">
        <!-- 品牌 -->
        <div class="flex flex-col gap-3">
          <router-link to="/v2" class="flex items-center gap-2.5">
            <img src="/logo.png" alt="Blog Lite" class="h-7 w-auto" />
          </router-link>
          <p class="text-xs leading-relaxed text-muted-foreground">
            轻量、简洁、专注于内容的博客平台。<br />为创作者和开发者打造。
          </p>
          <!-- 社交 -->
          <div class="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              class="h-8 w-8 cursor-pointer text-muted-foreground hover:text-foreground"
              as="a"
              href="https://github.com"
              target="_blank"
              aria-label="GitHub"
            >
              <Github class="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              class="h-8 w-8 cursor-pointer text-muted-foreground hover:text-foreground"
              as="a"
              href="mailto:contact@bloglite.dev"
              aria-label="邮箱"
            >
              <Mail class="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              class="h-8 w-8 cursor-pointer text-muted-foreground hover:text-foreground"
              as="a"
              href="/rss"
              aria-label="RSS"
            >
              <Rss class="h-4 w-4" />
            </Button>
          </div>
        </div>

        <!-- 导航分组 -->
        <div
          v-for="group in navGroups"
          :key="group.title"
          class="flex flex-col gap-2.5"
        >
          <span class="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {{ group.title }}
          </span>
          <div class="flex flex-col gap-1.5">
            <router-link
              v-for="link in group.links"
              :key="link.label"
              :to="link.to ?? '#'"
              class="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {{ link.label }}
              <span v-if="link.external" class="text-[10px] opacity-50">↗</span>
            </router-link>
          </div>
        </div>
      </div>

      <Separator class="my-6" />

      <!-- 底部版权 -->
      <div class="flex flex-col items-center gap-1 text-[11px] text-muted-foreground/60 sm:flex-row sm:justify-between">
        <span>&copy; {{ currentYear }} Blog Lite. All rights reserved.</span>
        <span class="inline-flex items-center gap-1">
          Made with <Heart class="h-3 w-3 fill-red-500 text-red-500" /> Vue 3 + shadcn-vue
        </span>
      </div>
    </div>
  </footer>
</template>

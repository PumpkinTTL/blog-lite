<script setup lang="ts">
import { Github, Mail, Rss } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

const currentYear = new Date().getFullYear()
</script>

<template>
  <footer class="border-t bg-background">
    <div class="mx-auto max-w-6xl px-6">
      <!-- 主区域: 品牌 + 导航 + 社交 -->
      <div class="flex flex-col items-center gap-6 py-8 sm:flex-row sm:justify-between">
        <!-- 品牌 -->
        <div class="flex flex-col items-center gap-2 sm:items-start">
          <router-link to="/v2" class="flex items-center gap-2">
            <img src="/logo.png" alt="Blog Lite" class="h-7 w-auto" />
          </router-link>
          <p class="text-xs text-muted-foreground">
            轻量、简洁、专注于内容的博客平台
          </p>
        </div>

        <!-- 导航 -->
        <nav class="flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-sm">
          <router-link to="/v2" class="text-muted-foreground transition-colors hover:text-foreground">首页</router-link>
          <router-link to="/v2/shop" class="text-muted-foreground transition-colors hover:text-foreground">商城</router-link>
          <router-link to="/v2/donation" class="text-muted-foreground transition-colors hover:text-foreground">赞助</router-link>
          <router-link to="/v2/about" class="text-muted-foreground transition-colors hover:text-foreground">关于</router-link>
        </nav>

        <!-- 社交 -->
        <div class="flex items-center gap-1.5">
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

      <Separator />

      <!-- 底部版权 -->
      <div class="flex flex-col items-center gap-1 py-5 text-xs text-muted-foreground sm:flex-row sm:justify-between">
        <span>&copy; {{ currentYear }} Blog Lite. All rights reserved.</span>
        <span>Powered by Vue 3 + shadcn-vue</span>
      </div>
    </div>
  </footer>
</template>

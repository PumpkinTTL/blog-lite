<script setup lang="ts">
import { Calendar, Clock, Eye } from 'lucide-vue-next'
import type { ArticleFull } from '@/data/articleMock'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'

defineProps<{
  article: ArticleFull
}>()

function formatCount(n: number): string {
  return n >= 1000 ? (n / 1000).toFixed(1) + 'k' : String(n)
}

function authorInitial(name: string): string {
  return name.slice(0, 1)
}
</script>

<template>
  <header class="group relative overflow-hidden rounded-2xl bg-muted">
    <!-- 封面图:全宽背景,hover时微放大 -->
    <div class="absolute inset-0 transition-transform duration-500 group-hover:scale-105">
      <img
        :src="article.cover"
        :alt="article.title"
        class="h-full w-full object-cover"
        loading="lazy"
      />
    </div>

    <!-- 遮罩:多层渐变,更精致 -->
    <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/10" />
    <div class="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />

    <!-- 内容:底部对齐,白色文字 -->
    <div class="relative flex min-h-[280px] flex-col justify-end p-5 sm:min-h-[320px] sm:p-7 lg:min-h-[380px] lg:p-9">
      <!-- 分类 + 难度 -->
      <div class="mb-2 flex items-center gap-2 v2-animate-left v2-delay-1">
        <Badge class="bg-white/20 text-xs text-white backdrop-blur-md">
          {{ article.category }}
        </Badge>
        <span class="text-xs text-white/60">/</span>
        <span class="text-xs text-white/60">{{ article.difficulty }}</span>
      </div>

      <!-- 标题:大字号白色,tracking-tight -->
      <h1 class="mb-2 max-w-3xl text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-5xl v2-animate-up v2-delay-2">
        {{ article.title }}
      </h1>

      <!-- 描述:适中字号,白色/80 -->
      <p class="mb-3 max-w-2xl text-sm leading-relaxed text-white/80 sm:text-base v2-animate-up v2-delay-3">
        {{ article.description }}
      </p>

      <!-- 元信息:单行排列,backdrop-blur -->
      <div class="flex flex-wrap items-center gap-3 rounded-lg bg-black/20 px-3 py-2 text-xs text-white/70 backdrop-blur-sm v2-animate-up v2-delay-4">
        <div class="flex items-center gap-1.5">
          <Avatar class="h-5 w-5 border border-white/30">
            <AvatarImage :src="article.author.avatar" :alt="article.author.name" />
            <AvatarFallback>{{ authorInitial(article.author.name) }}</AvatarFallback>
          </Avatar>
          <span class="font-medium text-white">{{ article.author.name }}</span>
        </div>
        <span>·</span>
        <span class="inline-flex items-center gap-1">
          <Calendar class="h-3 w-3" />
          {{ article.createdAt }}
        </span>
        <span class="inline-flex items-center gap-1">
          <Clock class="h-3 w-3" />
          {{ article.readMinutes }} 分钟
        </span>
        <span class="inline-flex items-center gap-1">
          <Eye class="h-3 w-3" />
          {{ formatCount(article.views) }}
        </span>
      </div>

      <!-- 标签:底部 -->
      <div v-if="article.tags.length" class="mt-3 flex flex-wrap gap-1.5 v2-animate-up v2-delay-5">
        <Badge
          v-for="tag in article.tags"
          :key="tag"
          variant="outline"
          class="border-white/20 bg-white/10 text-xs text-white/90 backdrop-blur-sm"
        >
          {{ tag }}
        </Badge>
      </div>
    </div>
  </header>
</template>

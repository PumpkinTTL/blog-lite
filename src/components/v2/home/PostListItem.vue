<script setup lang="ts">
import { Heart, Eye, Clock, BookOpen, Star } from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import type { Resource } from '@/data/mockData'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Card } from '@/components/ui/card'

const props = defineProps<{
  post: Resource
}>()

const router = useRouter()

function goToArticle() {
  router.push(`/v2/article/${props.post.id}`)
}

function formatCount(n: number): string {
  return n >= 1000 ? (n / 1000).toFixed(1) + 'k' : String(n)
}

function relativeTime(iso: string): string {
  const date = new Date(iso)
  const diff = Date.now() - date.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  if (days <= 0) return '今天'
  if (days === 1) return '昨天'
  if (days < 7) return `${days} 天前`
  if (days < 30) return `${Math.floor(days / 7)} 周前`
  return `${Math.floor(days / 30)} 个月前`
}

function estimateReadTime(post: Resource): number {
  const wordCount = (post.title + post.description).length
  return Math.max(2, Math.ceil(wordCount / 300))
}
</script>

<template>
  <Card
    class="group flex cursor-pointer shadow-none gap-4 overflow-hidden rounded-xl p-3 transition-all duration-200 hover:shadow-sm sm:gap-5 sm:p-4"
    @click="goToArticle"
  >
    <!-- 封面 -->
    <div class="relative aspect-[16/10] w-32 shrink-0 overflow-hidden rounded-lg sm:w-44 lg:w-48">
      <img
        :src="post.image"
        :alt="post.title"
        class="h-full w-full object-cover"
        loading="lazy"
      />
      <Badge
        class="absolute left-1.5 top-1.5 border-none text-[10px] text-white shadow-sm"
        :style="{ backgroundColor: post.categoryColor }"
      >
        {{ post.category }}
      </Badge>
    </div>

    <!-- 内容 -->
    <div class="flex min-w-0 flex-1 flex-col">
      <!-- 标题 -->
      <h3 class="line-clamp-2 text-sm font-semibold leading-snug transition-colors group-hover:text-primary sm:text-[15px]">
        {{ post.title }}
      </h3>

      <!-- 描述 -->
      <p class="mt-1.5 hidden line-clamp-2 text-xs leading-relaxed text-muted-foreground sm:block">
        {{ post.description }}
      </p>

      <!-- 标签 -->
      <div v-if="post.tags.length" class="mt-2 hidden flex-wrap gap-1 sm:flex">
        <Badge
          v-for="tag in post.tags.slice(0, 3)"
          :key="tag"
          variant="secondary"
          class="text-[10px] font-medium"
        >
          {{ tag }}
        </Badge>
      </div>

      <!-- 元信息(底部) -->
      <div class="mt-auto flex flex-wrap items-center gap-x-3 gap-y-1 pt-2 text-[11px] text-muted-foreground">
        <!-- 作者 -->
        <div class="flex items-center gap-1.5">
          <Avatar class="h-5 w-5">
            <AvatarImage :src="post.author.avatar" :alt="post.author.name" />
            <AvatarFallback>{{ post.author.name.slice(0, 1) }}</AvatarFallback>
          </Avatar>
          <span class="font-medium">{{ post.author.name }}</span>
        </div>
        <span class="hidden h-3 w-px bg-border sm:inline-block" />
        <!-- 时间 -->
        <span class="inline-flex items-center gap-1">
          <Clock class="h-3 w-3" />
          {{ relativeTime(post.createdAt) }}
        </span>
        <!-- 阅读时长 -->
        <span class="hidden items-center gap-1 sm:inline-flex">
          <BookOpen class="h-3 w-3" />
          {{ estimateReadTime(post) }} 分钟
        </span>
        <span class="hidden h-3 w-px bg-border sm:inline-block" />
        <!-- 互动 -->
        <span class="inline-flex items-center gap-1 transition-colors group-hover:text-red-500 dark:group-hover:text-red-400">
          <Heart class="h-3 w-3" />
          {{ formatCount(post.likes) }}
        </span>
        <span class="inline-flex items-center gap-1">
          <Eye class="h-3 w-3" />
          {{ formatCount(post.views) }}
        </span>
        <!-- 精选标记 -->
        <Badge
          v-if="post.featured"
          class="ml-auto border-none bg-amber-500/90 text-[10px] font-semibold text-white shadow-sm dark:bg-amber-600/85"
        >
          <Star class="mr-0.5 h-3 w-3 fill-current" />
          精选
        </Badge>
      </div>
    </div>
  </Card>
</template>

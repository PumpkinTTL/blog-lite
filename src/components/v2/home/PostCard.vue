<script setup lang="ts">
import { Heart, Eye, Clock, BookOpen, Star } from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import type { Resource } from '@/data/mockData'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Card } from '@/components/ui/card'

const props = defineProps<{
  post: Resource
  index?: number
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

// 阅读时长估算:标题 + 描述按 300 字/分钟
function estimateReadTime(post: Resource): number {
  const wordCount = (post.title + post.description).length
  return Math.max(2, Math.ceil(wordCount / 300))
}
</script>

<template>
  <Card
    v-animate
    class="group cursor-pointer shadow-none overflow-hidden rounded-xl v2-card-hover hover:-translate-y-1 hover:shadow-md hover:border-primary/20 animate__animated animate__fadeInUp"
    :style="index != null ? { animationDelay: `${0.15 + index * 0.08}s` } : {}"
    @click="goToArticle"
  >
    <!-- 封面 -->
    <div class="relative aspect-video overflow-hidden rounded-t-xl bg-muted">
      <img
        :src="post.image"
        :alt="post.title"
        class="h-full w-full object-cover v2-img-zoom group-hover:scale-105"
        loading="lazy"
      />
      <Badge
        class="absolute left-2.5 top-2.5 border-none shadow-sm backdrop-blur-sm v2-child-left v2-cd-1"
        :style="{ backgroundColor: post.categoryColor + '20', color: post.categoryColor }"
      >
        {{ post.category }}
      </Badge>
      <Badge
        v-if="post.featured"
        class="absolute right-2.5 top-2.5 border-none bg-amber-500/95 text-[10px] font-semibold text-white shadow-sm dark:bg-amber-600/90 v2-child-scale v2-cd-2"
      >
        <Star class="mr-0.5 h-3 w-3 fill-current" />
        精选
      </Badge>
    </div>

    <!-- 内容 -->
    <div class="p-4">
      <h3 class="line-clamp-2 text-sm font-semibold leading-snug transition-all duration-300 group-hover:text-primary group-hover:translate-x-0.5 v2-child-up v2-cd-2">
        {{ post.title }}
      </h3>
      <p class="mt-1.5 line-clamp-2 text-xs text-muted-foreground leading-relaxed transition-colors duration-300 group-hover:text-muted-foreground/70 v2-child-up v2-cd-3">
        {{ post.description }}
      </p>

      <!-- 标签 -->
      <div v-if="post.tags.length" class="mt-2.5 flex flex-wrap gap-1 v2-child-up v2-cd-4">
        <Badge
          v-for="tag in post.tags.slice(0, 3)"
          :key="tag"
          variant="secondary"
          class="text-[10px] font-medium v2-lift hover:-translate-y-px hover:shadow-sm"
        >
          {{ tag }}
        </Badge>
      </div>

      <!-- 元信息 -->
      <div class="mt-3 flex items-center justify-between border-t pt-2.5 v2-child-up v2-cd-5">
        <div class="flex items-center gap-1.5">
          <Avatar class="h-5 w-5">
            <AvatarImage :src="post.author.avatar" :alt="post.author.name" />
            <AvatarFallback>{{ post.author.name.slice(0, 1) }}</AvatarFallback>
          </Avatar>
          <span class="text-xs font-medium">{{ post.author.name }}</span>
        </div>
        <div class="flex items-center gap-2 text-[11px] text-muted-foreground">
          <!-- 点赞：弹性弹簧 + 独立 hover 红色 -->
          <span class="inline-flex items-center gap-0.5 v2-spring group-hover:text-red-500 dark:group-hover:text-red-400">
            <Heart class="h-3 w-3 group-hover:scale-125" />
            {{ formatCount(post.likes) }}
          </span>
          <!-- 浏览：独立 hover 蓝色 -->
          <span class="inline-flex items-center gap-0.5 v2-lift hover:text-blue-500 dark:hover:text-blue-400">
            <Eye class="h-3 w-3 hover:scale-110" />
            {{ formatCount(post.views) }}
          </span>
        </div>
      </div>

      <!-- 时间 + 阅读时长 -->
      <div class="mt-2 flex items-center gap-3 text-[11px] text-muted-foreground/80 v2-child-fade v2-cd-6">
        <span class="inline-flex items-center gap-1">
          <Clock class="h-3 w-3" />
          {{ relativeTime(post.createdAt) }}
        </span>
        <span class="inline-flex items-center gap-1">
          <BookOpen class="h-3 w-3" />
          {{ estimateReadTime(post) }} 分钟阅读
        </span>
      </div>
    </div>
  </Card>
</template>

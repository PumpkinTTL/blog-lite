<script setup lang="ts">
import { Download, Eye, Star } from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import type { Resource } from '@/data/mockData'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Card } from '@/components/ui/card'

const props = defineProps<{
  resource: Resource
}>()

const router = useRouter()

function goToResource() {
  router.push(`/v2/article/${props.resource.id}`)
}

function formatCount(n: number): string {
  return n >= 1000 ? (n / 1000).toFixed(1) + 'k' : String(n)
}

function shortDate(iso: string): string {
  const d = new Date(iso)
  return `${d.getMonth() + 1}-${d.getDate()}`
}

// 高分资源(>=800 likes)显示星标
function isHighRated(likes: number): boolean {
  return likes >= 800
}
</script>

<template>
  <Card
    class="group relative flex cursor-pointer shadow-none flex-col overflow-hidden rounded-xl v2-card-hover hover:-translate-y-2 hover:shadow-md hover:border-primary/20"
    @click="goToResource"
  >
    <!-- 封面 -->
    <div class="relative aspect-video overflow-hidden rounded-t-xl bg-muted">
      <img
        :src="resource.image"
        :alt="resource.title"
        class="h-full w-full object-cover v2-img-zoom group-hover:scale-105"
        loading="lazy"
      />
      <Badge
        class="absolute left-2.5 top-2.5 border-none shadow-sm backdrop-blur-sm v2-child-left v2-cd-1"
        :style="{ backgroundColor: resource.categoryColor + '20', color: resource.categoryColor }"
      >
        {{ resource.category }}
      </Badge>
      <!-- 下载按钮(始终可见,但 hover 强化) -->
      <Button
        variant="secondary"
        size="icon"
        class="absolute right-2 top-2 h-7 w-7 cursor-pointer rounded-full opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground"
        aria-label="获取资源"
        @click.stop
      >
        <Download class="h-3.5 w-3.5" />
      </Button>
    </div>

    <!-- 内容 -->
    <div class="flex flex-1 flex-col p-3">
      <h3 class="line-clamp-2 text-sm font-semibold leading-snug transition-all duration-300 group-hover:text-primary v2-child-up v2-cd-2">
        {{ resource.title }}
      </h3>
      <p class="mt-1.5 line-clamp-2 shrink-0 text-xs leading-relaxed text-muted-foreground v2-child-up v2-cd-3">
        {{ resource.description }}
      </p>

      <!-- 标签 -->
      <div v-if="resource.tags.length" class="mt-2 flex min-h-[1.375rem] shrink-0 flex-wrap gap-1 pb-3 v2-child-up v2-cd-4">
        <Badge
          v-for="tag in resource.tags.slice(0, 3)"
          :key="tag"
          variant="secondary"
          class="text-[10px] font-medium v2-lift hover:-translate-y-px hover:shadow-sm"
        >
          {{ tag }}
        </Badge>
      </div>

      <!-- 底部元信息 -->
      <div class="mt-auto flex items-center justify-between gap-2 border-t pt-2.5 text-[11px] text-muted-foreground v2-child-up v2-cd-5">
        <!-- 作者 + 日期 -->
        <div class="flex min-w-0 items-center gap-1.5">
          <Avatar class="h-5 w-5">
            <AvatarImage :src="resource.author.avatar" :alt="resource.author.name" />
            <AvatarFallback>{{ resource.author.name.slice(0, 1) }}</AvatarFallback>
          </Avatar>
          <span class="truncate font-medium">{{ resource.author.name }}</span>
          <span class="hidden shrink-0 text-muted-foreground/60 sm:inline">·</span>
          <span class="hidden shrink-0 text-muted-foreground/60 sm:inline">{{ shortDate(resource.createdAt) }}</span>
        </div>
        <!-- 统计 -->
        <div class="flex shrink-0 items-center gap-2">
          <span
            class="inline-flex items-center gap-0.5"
            :class="isHighRated(resource.likes) ? 'text-amber-500 dark:text-amber-400' : ''"
          >
            <component :is="isHighRated(resource.likes) ? Star : Eye" class="h-3 w-3" />
            {{ formatCount(resource.likes) }}
          </span>
          <span class="inline-flex items-center gap-0.5">
            <Download class="h-3 w-3" />
            {{ formatCount(Math.floor(resource.views / 8)) }}
          </span>
        </div>
      </div>
    </div>
  </Card>
</template>

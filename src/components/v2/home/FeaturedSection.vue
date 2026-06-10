<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowUpRight, Clock, Eye, Star } from 'lucide-vue-next'
import type { Resource } from '@/data/mockData'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Card } from '@/components/ui/card'
import SectionHeading from '@/components/v2/common/SectionHeading.vue'

const props = defineProps<{
  posts: Resource[]
}>()

const router = useRouter()

function goToArticle(id: string) {
  router.push(`/v2/article/${id}`)
}

// 主推 + 副推 2 篇(若不够则按顺序取)
const featured = computed(() => {
  const featuredAll = props.posts.filter(p => p.featured)
  const list = featuredAll.length >= 3 ? featuredAll : props.posts.slice(0, 3)
  return {
    primary: list[0],
    secondary: list.slice(1, 3),
  }
})

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
</script>

<template>
  <section v-if="featured.primary" v-animate class="mx-auto max-w-7xl px-4 pt-10 sm:px-6 lg:px-8 animate__animated animate__fadeIn">
    <div class="mb-5">
      <SectionHeading
        eyebrow="Featured"
        title="精选推荐"
        description="编辑团队精心挑选的优质内容"
      />
    </div>

    <div class="grid gap-5 lg:grid-cols-5">
      <!-- 主推 -->
      <Card
        class="group relative col-span-1 cursor-pointer shadow-none overflow-hidden rounded-xl v2-card-hover hover:-translate-y-1 hover:shadow-lg hover:border-primary/20 v2-child-up v2-cd-1 lg:col-span-3"
        @click="goToArticle(featured.primary.id)"
      >
        <div class="grid h-full sm:grid-cols-2">
          <div class="relative aspect-[16/10] overflow-hidden rounded-t-xl sm:aspect-auto sm:rounded-l-xl sm:rounded-tr-none">
            <img
              :src="featured.primary.image"
              :alt="featured.primary.title"
              class="h-full w-full object-cover v2-img-zoom group-hover:scale-105"
              loading="lazy"
            />
            <Badge
              class="absolute left-3 top-3 border-none shadow-sm backdrop-blur-sm v2-child-left v2-cd-1"
              :style="{ backgroundColor: featured.primary.categoryColor + '20', color: featured.primary.categoryColor }"
            >
              {{ featured.primary.category }}
            </Badge>
          </div>
          <div class="flex flex-col justify-between p-5 sm:p-6">
            <div>
              <span class="inline-flex items-center gap-1 text-xs font-medium" :style="{ color: featured.primary.categoryColor }">
                <Star class="h-3.5 w-3.5" :style="{ fill: featured.primary.categoryColor + '30' }" />
                主编推荐
              </span>
              <h3 class="mt-2 line-clamp-2 text-lg font-bold leading-snug transition-all duration-300 group-hover:text-primary sm:text-xl v2-child-up v2-cd-2">
                {{ featured.primary.title }}
              </h3>
              <p class="mt-2 line-clamp-2 text-sm text-muted-foreground leading-relaxed v2-child-up v2-cd-3">
                {{ featured.primary.description }}
              </p>
            </div>
            <div class="mt-4 flex items-center justify-between v2-child-up v2-cd-4">
              <div class="flex items-center gap-2">
                <Avatar class="h-7 w-7">
                  <AvatarImage :src="featured.primary.author.avatar" :alt="featured.primary.author.name" />
                  <AvatarFallback>{{ featured.primary.author.name.slice(0, 1) }}</AvatarFallback>
                </Avatar>
                <div class="text-xs">
                  <div class="font-medium">{{ featured.primary.author.name }}</div>
                  <div class="text-muted-foreground">{{ relativeTime(featured.primary.createdAt) }}</div>
                </div>
              </div>
              <div class="flex items-center gap-3 text-xs text-muted-foreground">
                <span class="inline-flex items-center gap-1">
                  <Eye class="h-3 w-3" />
                  {{ formatCount(featured.primary.views) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <!-- 副推 -->
      <div class="col-span-1 grid gap-5 lg:col-span-2">
          <Card
            v-for="(post, idx) in featured.secondary"
            :key="post.id"
            class="group relative cursor-pointer shadow-none overflow-hidden rounded-xl v2-card-hover hover:-translate-y-0.5 hover:shadow-md hover:border-primary/20 v2-child-up"
            :class="idx === 0 ? 'v2-cd-2' : 'v2-cd-3'"
            @click="goToArticle(post.id)"
          >
          <div class="flex h-full gap-3 p-3">
            <div class="relative aspect-[4/3] w-32 shrink-0 overflow-hidden rounded-lg sm:w-36">
              <img
                :src="post.image"
                :alt="post.title"
                class="h-full w-full object-cover v2-img-zoom group-hover:scale-105"
                loading="lazy"
              />
            </div>
            <div class="flex flex-1 flex-col justify-between py-0.5">
              <div>
                <Badge
                  class="border-none v2-child-left v2-cd-1"
                  :style="{ backgroundColor: post.categoryColor + '18', color: post.categoryColor }"
                >
                  {{ post.category }}
                </Badge>
                <h3 class="mt-1.5 line-clamp-2 text-sm font-semibold leading-snug transition-all duration-300 group-hover:text-primary v2-child-up v2-cd-2">
                  {{ post.title }}
                </h3>
                <p class="mt-1 line-clamp-2 text-xs text-muted-foreground leading-relaxed v2-child-up v2-cd-3">
                  {{ post.description }}
                </p>
              </div>
              <div class="flex items-center gap-2 text-[11px] text-muted-foreground v2-child-fade v2-cd-4">
                <Clock class="h-3 w-3" />
                {{ relativeTime(post.createdAt) }}
                <span class="mx-0.5">·</span>
                <span class="inline-flex items-center gap-0.5">
                  <Eye class="h-3 w-3" />
                  {{ formatCount(post.views) }}
                </span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  </section>
</template>

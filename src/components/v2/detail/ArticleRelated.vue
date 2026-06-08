<script setup lang="ts">
import { Badge } from '@/components/ui/badge'
import { Card, CardHeader, CardContent } from '@/components/ui/card'

interface RelatedArticle {
  id: string
  title: string
  cover: string
  category: string
}

withDefaults(defineProps<{
  articles: RelatedArticle[]
  mobile?: boolean
}>(), {
  mobile: false,
})
</script>

<template>
  <!-- 桌面端:Card 包裹紧凑列表 -->
  <Card v-if="!mobile" class="gap-0">
    <CardHeader class="flex-row items-center justify-between pb-3">
      <h3 class="text-sm font-medium">相关推荐</h3>
      <span class="text-xs tabular-nums text-muted-foreground">{{ articles.length }}</span>
    </CardHeader>
    <CardContent class="space-y-1">
      <router-link
        v-for="item in articles"
        :key="item.id"
        :to="`/v2/article/${item.id}`"
        class="group flex items-center gap-3 rounded-md p-2 transition-colors hover:bg-accent"
      >
        <div class="relative h-12 w-12 shrink-0 overflow-hidden rounded-md bg-muted">
          <img
            :src="item.cover"
            :alt="item.title"
            class="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
            loading="lazy"
          />
        </div>
        <div class="min-w-0 flex-1">
          <Badge variant="outline" class="mb-1 px-1.5 py-0 text-[10px] font-normal">
            {{ item.category }}
          </Badge>
          <h4 class="line-clamp-2 text-xs font-medium leading-snug transition-colors group-hover:text-primary">
            {{ item.title }}
          </h4>
        </div>
      </router-link>
    </CardContent>
  </Card>

  <!-- 移动端:水平滑动卡片 -->
  <section v-else class="mt-8">
    <header class="mb-3 flex items-center justify-between">
      <h3 class="text-sm font-semibold">相关推荐</h3>
      <span class="text-xs text-muted-foreground">{{ articles.length }} 篇</span>
    </header>

    <div class="-mx-4 flex gap-3 overflow-x-auto px-4 pb-2 scrollbar-none">
      <router-link
        v-for="item in articles"
        :key="item.id"
        :to="`/v2/article/${item.id}`"
        class="group w-40 shrink-0 cursor-pointer"
      >
        <div class="relative aspect-[16/10] w-full overflow-hidden rounded-md bg-muted">
          <img
            :src="item.cover"
            :alt="item.title"
            class="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
            loading="lazy"
          />
          <Badge
            variant="secondary"
            class="absolute left-1.5 top-1.5 text-[10px] backdrop-blur"
          >
            {{ item.category }}
          </Badge>
        </div>
        <h4 class="mt-2 line-clamp-2 text-xs font-medium leading-snug transition-colors group-hover:text-primary">
          {{ item.title }}
        </h4>
      </router-link>
    </div>
  </section>
</template>

<style scoped>
.scrollbar-none {
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.scrollbar-none::-webkit-scrollbar {
  display: none;
}
</style>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { FileText, Plus } from 'lucide-vue-next'
import type { Resource } from '@/data/mockData'
import { Button } from '@/components/ui/button'
import PostCard from './PostCard.vue'
import PostListItem from './PostListItem.vue'

const props = defineProps<{
  posts: Resource[]
  viewMode?: 'grid' | 'list'
}>()

// 增量加载:每次显示 8 篇
const PAGE_SIZE = 8
const visibleCount = ref(PAGE_SIZE)

// 当列表内容变化时(筛选/排序),重置可见数
watch(() => props.posts, () => {
  visibleCount.value = PAGE_SIZE
})

const visiblePosts = computed(() => props.posts.slice(0, visibleCount.value))
const hasMore = computed(() => visibleCount.value < props.posts.length)

function loadMore() {
  visibleCount.value = Math.min(visibleCount.value + PAGE_SIZE, props.posts.length)
}
</script>

<template>
  <div>
    <!-- 网格视图 -->
    <div
      v-if="posts.length > 0 && (viewMode ?? 'grid') === 'grid'"
      class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
    >
      <PostCard v-for="(post, idx) in visiblePosts" :key="post.id" :post="post" :index="idx" />
    </div>

    <!-- 列表视图 -->
    <div
      v-else-if="posts.length > 0 && viewMode === 'list'"
      class="flex flex-col gap-3"
    >
      <PostListItem v-for="(post, idx) in visiblePosts" :key="post.id" :post="post" :index="idx" />
    </div>

    <!-- 空状态 -->
    <div
      v-else
      class="flex flex-col items-center justify-center rounded-xl border border-dashed py-16"
    >
      <div class="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
        <FileText class="h-6 w-6 text-muted-foreground" />
      </div>
      <p class="mt-4 text-sm font-medium text-muted-foreground">没有找到匹配的文章</p>
      <p class="mt-1 text-xs text-muted-foreground/70">试试其他分类、标签或关键词</p>
    </div>

    <!-- 加载更多 -->
    <div v-if="hasMore" class="mt-8 flex justify-center">
      <Button variant="outline" class="cursor-pointer" @click="loadMore">
        <Plus class="mr-1 h-4 w-4" />
        加载更多
        <span class="ml-1 text-xs text-muted-foreground">
          ({{ visibleCount }}/{{ posts.length }})
        </span>
      </Button>
    </div>
  </div>
</template>

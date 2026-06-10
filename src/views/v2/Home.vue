<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { generateMockResources, type Resource } from '@/data/mockData'

import FeaturedSection from '@/components/v2/home/FeaturedSection.vue'
import FilterBar from '@/components/v2/home/FilterBar.vue'
import PostList from '@/components/v2/home/PostList.vue'
import Sidebar from '@/components/v2/home/Sidebar.vue'
import ResourceSection from '@/components/v2/home/ResourceSection.vue'
import SectionHeading from '@/components/v2/common/SectionHeading.vue'

// 骨架屏
import FeaturedSectionSkeleton from '@/components/v2/skeleton/FeaturedSectionSkeleton.vue'
import FilterBarSkeleton from '@/components/v2/skeleton/FilterBarSkeleton.vue'
import PostCardSkeleton from '@/components/v2/skeleton/PostCardSkeleton.vue'
import PostListItemSkeleton from '@/components/v2/skeleton/PostListItemSkeleton.vue'
import SidebarSkeleton from '@/components/v2/skeleton/SidebarSkeleton.vue'
import ResourceSectionSkeleton from '@/components/v2/skeleton/ResourceSectionSkeleton.vue'
import { Skeleton } from '@/components/ui/skeleton'

const allPosts = ref<Resource[]>([])
const loading = ref(true)

const activeCategory = ref('全部')
const activeTag = ref('')
const activeSort = ref('latest')
const activeView = ref<'grid' | 'list'>('grid')
const searchQuery = ref('')

const filteredPosts = computed(() => {
  let result = allPosts.value

  if (activeCategory.value !== '全部') {
    result = result.filter(p => p.category === activeCategory.value)
  }
  if (activeTag.value) {
    result = result.filter(p => p.tags.includes(activeTag.value))
  }
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.trim().toLowerCase()
    result = result.filter(p =>
      p.title.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.tags.some(t => t.toLowerCase().includes(q))
    )
  }

  // 排序
  if (activeSort.value === 'popular') {
    result = [...result].sort((a, b) => b.views - a.views)
  } else {
    result = [...result].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }

  return result
})

// 精选区使用:只按分类筛,不过滤 tag/search
// 切换分类时精选也跟着筛选,但选标签/搜索时精选区整体隐藏
const featuredSourcePosts = computed(() => {
  if (activeCategory.value === '全部') return allPosts.value
  return allPosts.value.filter(p => p.category === activeCategory.value)
})

onMounted(async () => {
  // TODO: 替换为真实 API 调用
  await new Promise(r => setTimeout(r, 600))
  allPosts.value = generateMockResources(24)
  loading.value = false
})
</script>

<template>
  <div v-if="loading">
    <!-- 骨架屏 -->
    <FeaturedSectionSkeleton />

    <section class="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
      <div class="grid gap-8 lg:grid-cols-[1fr_300px]">
        <div class="min-w-0 space-y-5">
          <div class="mb-5 space-y-1">
            <Skeleton class="h-6 w-24" />
            <Skeleton class="h-3.5 w-36" />
          </div>
          <FilterBarSkeleton />
          <!-- 网格骨架 -->
          <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <PostCardSkeleton v-for="i in 6" :key="i" />
          </div>
        </div>
        <div class="hidden lg:block">
          <div class="sticky top-20">
            <SidebarSkeleton />
          </div>
        </div>
      </div>
    </section>

    <ResourceSectionSkeleton />
  </div>

  <div v-else>
    <!-- 精选(只在未选标签/未搜索时显示;按当前分类筛选;分类下文章 < 3 时隐藏避免尴尬) -->
    <FeaturedSection
      v-if="!activeTag && !searchQuery && featuredSourcePosts.length >= 3"
      :posts="featuredSourcePosts"
    />

    <!-- 内容主体:主栏 + 侧栏 -->
    <section id="posts" class="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
      <div class="grid gap-8 lg:grid-cols-[1fr_300px]">
        <!-- 主栏 -->
        <div class="min-w-0 space-y-5">
          <SectionHeading
            :title="activeCategory === '全部' ? '最新文章' : activeCategory"
            :description="activeSort === 'popular' ? '按浏览量排序' : '按发布时间排序'"
          />

          <FilterBar
            :active-category="activeCategory"
            :active-tag="activeTag"
            :active-sort="activeSort"
            :search-query="searchQuery"
            :view-mode="activeView"
            :total="filteredPosts.length"
            @update:active-category="activeCategory = $event"
            @update:active-tag="activeTag = $event"
            @update:active-sort="activeSort = $event"
            @update:search-query="searchQuery = $event"
            @update:view-mode="activeView = $event"
          />

          <PostList :posts="filteredPosts" :view-mode="activeView" />
        </div>

        <!-- 侧栏 -->
        <div v-animate class="hidden lg:block animate__animated animate__fadeInRight" style="animation-delay: 0.4s">
          <div class="sticky top-20">
            <Sidebar :posts="allPosts" />
          </div>
        </div>
      </div>
    </section>

    <!-- 资源区(全宽,与主区共享 max-w-7xl) -->
    <ResourceSection />

    <!-- 移动端侧栏(简化) -->
    <section class="mx-auto max-w-7xl px-4 pt-8 pb-12 lg:hidden sm:px-6">
      <Sidebar :posts="allPosts" />
    </section>

    <!-- 锚点占位 -->
    <div id="tags" class="sr-only">标签云</div>
  </div>
</template>

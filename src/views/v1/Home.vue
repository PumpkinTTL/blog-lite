<template>
  <div class="home">
    <BlogHeader />
    <main class="main-content">
      <div class="container">



        <FilterBar
          :categories="categories"
          :active-category="activeCategory"
          :active-sort="activeSort"
          @update:active-category="activeCategory = $event"
          @update:active-sort="activeSort = $event"
        />

        <section class="home-grid">
          <PostFeed :posts="visiblePosts" />
          <HomeSidebar :tags="hotTags" />
        </section>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import BlogHeader from '@/components/v1/layout/BlogHeader.vue'
import FilterBar from '@/components/v1/home/FilterBar.vue'
import PostFeed from '@/components/v1/home/PostFeed.vue'
import HomeSidebar from '@/components/v1/home/HomeSidebar.vue'
import { generateMockResources } from '@/data/mockData'

const categories = ['全部', '前端', '后端', '设计', 'AI', '工具']
const activeCategory = ref('全部')
const activeSort = ref<'latest' | 'popular'>('latest')
const hotTags = ['Vue 3', 'TypeScript', '组件化', '性能优化', '设计系统', '工程化']

const posts = ref(generateMockResources(12))
const visiblePosts = computed(() => {
  const source =
    activeCategory.value === '全部'
      ? posts.value
      : posts.value.filter((item) => item.category === activeCategory.value)
  return activeSort.value === 'popular'
    ? [...source].sort((a, b) => b.views - a.views)
    : [...source].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
})
</script>

<style scoped lang="scss">

.home {
  min-height: 100vh;
  background: #F3F4F6;
}

.main-content {
  padding-top: 64px;
}

.container {
  max-width: 1320px;
  margin: 0 auto;
  padding: 20px 20px 80px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* ── Main Grid ── */
.home-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 280px;
  gap: 12px;
  align-items: start;
}

@media (max-width: 1100px) {
  .home-grid {
    grid-template-columns: 1fr;
  }
}
</style>

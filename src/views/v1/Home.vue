<template>
  <div class="home">
    <BlogHeader />
    <main class="main-content">
      <div class="container">

        <!-- Hero Banner -->
        <section class="intro-panel">
          <div class="intro-left">
            <p class="intro-kicker">EDITOR PICKS</p>
            <h1 class="intro-title">开发者内容中枢</h1>
            <p class="intro-subtitle">高质量教程、工程实践、设计思路，在清晰的阅读界面里高效获取。</p>
          </div>
          <div class="intro-metrics">
            <div class="metric-item">
              <font-awesome-icon icon="bolt" class="metric-icon" />
              <div class="metric-body">
                <strong>46</strong>
                <span>本周上新</span>
              </div>
            </div>
            <div class="metric-divider"></div>
            <div class="metric-item">
              <font-awesome-icon icon="pen-nib" class="metric-icon" />
              <div class="metric-body">
                <strong>132</strong>
                <span>活跃作者</span>
              </div>
            </div>
            <div class="metric-divider"></div>
            <div class="metric-item">
              <font-awesome-icon icon="layer-group" class="metric-icon" />
              <div class="metric-body">
                <strong>12</strong>
                <span>推荐专题</span>
              </div>
            </div>
          </div>
        </section>

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

/* ── Intro Panel ── */
.intro-panel {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding: 24px 28px;
  border-radius: 12px;
  background: #fff;
  border: 1px solid #E5E7EB;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
}

.intro-left {
  flex: 1;
  min-width: 0;
}

.intro-kicker {
  margin: 0 0 8px;
  font-size: 10.5px;
  font-weight: 700;
  letter-spacing: 0.12em;
  color: #6B7280;
  text-transform: uppercase;
}

.intro-title {
  margin: 0 0 8px;
  font-size: clamp(22px, 2.4vw, 32px);
  line-height: 1.15;
  color: #111827;
  font-weight: 700;
  letter-spacing: -0.025em;
}

.intro-subtitle {
  margin: 0;
  color: #6B7280;
  font-size: 13px;
  line-height: 1.6;
}

/* ── Metrics row ── */
.intro-metrics {
  display: flex;
  align-items: center;
  gap: 0;
  flex-shrink: 0;
  border: 1px solid #E5E7EB;
  border-radius: 10px;
  overflow: hidden;
  background: #F9FAFB;
}

.metric-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 20px;
}

.metric-icon {
  font-size: 14px;
  color: #9CA3AF;
}

.metric-body {
  display: flex;
  flex-direction: column;

  strong {
    font-size: 18px;
    font-weight: 700;
    color: #111827;
    line-height: 1;
    letter-spacing: -0.02em;
  }

  span {
    font-size: 11px;
    color: #9CA3AF;
    margin-top: 2px;
    font-weight: 500;
  }
}

.metric-divider {
  width: 1px;
  height: 32px;
  background: #E5E7EB;
  flex-shrink: 0;
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

@media (max-width: 768px) {
  .main-content { padding-top: 56px; }

  .container {
    padding: 12px 12px calc(56px + 20px);
    gap: 10px;
  }

  .intro-panel {
    flex-direction: column;
    align-items: flex-start;
    padding: 18px;
    gap: 16px;
  }

  .intro-metrics {
    width: 100%;
  }

  .metric-item {
    flex: 1;
    padding: 12px 14px;
    gap: 8px;
  }
}
</style>

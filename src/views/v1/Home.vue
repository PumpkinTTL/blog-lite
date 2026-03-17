<template>
  <div class="home">
    <BlogHeader />
    <main class="main-content">
      <div class="container">

        <!-- ── Refined Workspace Station ── -->
        <section class="workspace-station">
          <div class="ws-main">
            <div class="ws-content">
              <div class="ws-badge">
                <span class="pulsing-dot"></span>
                SYSTEM ENGINE READY
              </div>
              <h1 class="ws-title">
                开发者内容<span class="text-gradient">中枢站</span>
              </h1>
              <p class="ws-desc">汇聚全球顶尖开发者的工程实践与设计哲学，为你的技术成长提供持续动力。</p>
              
              <!-- Quick Actions -->
              <div class="ws-actions">
                <button class="action-btn primary">
                  <font-awesome-icon icon="plus" />
                  <span>投递内容</span>
                </button>
                <button class="action-btn secondary">
                  <font-awesome-icon icon="book-open" />
                  <span>技术指南</span>
                </button>
                <div class="action-sep"></div>
                <div class="ws-presence">
                  <div class="avatar-stack">
                    <img v-for="i in 3" :key="i" :src="`https://i.pravatar.cc/100?img=${i+10}`" alt="user" />
                    <div class="more-count">+8</div>
                  </div>
                  <span class="presence-text">正在共同学习</span>
                </div>
              </div>
            </div>

            <!-- Stats Dashboard -->
            <div class="ws-dashboard">
              <div class="dash-tile gold">
                <div class="tile-header">
                  <font-awesome-icon icon="bolt" />
                  <span class="trend">↑ 12%</span>
                </div>
                <div class="tile-body">
                  <span class="val">46</span>
                  <span class="lab">本周新增</span>
                </div>
              </div>
              <div class="dash-tile blue">
                <div class="tile-header">
                  <font-awesome-icon icon="users" />
                  <span class="trend">↑ 4%</span>
                </div>
                <div class="tile-body">
                  <span class="val">132</span>
                  <span class="lab">活跃作者</span>
                </div>
              </div>
              <div class="dash-tile purple">
                <div class="tile-header">
                  <font-awesome-icon icon="layer-group" />
                  <span class="trend">stable</span>
                </div>
                <div class="tile-body">
                  <span class="val">12</span>
                  <span class="lab">专题系列</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Background Elements -->
          <div class="ws-bg-grid"></div>
          <div class="ws-glow"></div>
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

/* ── Workspace Station (Completely Refreshed) ── */
.workspace-station {
  position: relative;
  background: #fff;
  border: 1px solid #E5E7EB;
  border-radius: 20px;
  padding: 40px;
  overflow: hidden;
  box-shadow: 
    0 4px 20px rgba(0, 0, 0, 0.02),
    inset 0 0 40px rgba(243, 244, 246, 0.5);
}

.ws-main {
  position: relative;
  z-index: 5;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 60px;
}

.ws-content {
  flex: 1;
  max-width: 600px;
}

.ws-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  background: #F3F4F6;
  border-radius: 100px;
  font-size: 10px;
  font-weight: 800;
  color: #6B7280;
  letter-spacing: 0.1em;
  margin-bottom: 20px;

  .pulsing-dot {
    width: 6px;
    height: 6px;
    background: #3B82F6;
    border-radius: 50%;
    box-shadow: 0 0 0 rgba(59, 130, 246, 0.4);
    animation: ws-pulse 2s infinite;
  }
}

@keyframes ws-pulse {
  0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4); }
  70% { transform: scale(1.2); box-shadow: 0 0 0 8px rgba(59, 130, 246, 0); }
  100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
}

.ws-title {
  margin: 0 0 16px;
  font-size: clamp(28px, 3.2vw, 40px);
  font-weight: 900;
  color: #111827;
  line-height: 1.1;
  letter-spacing: -0.04em;

  .text-gradient {
    background: linear-gradient(135deg, #2563EB, #7C3AED);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
}

.ws-desc {
  margin: 0 0 32px;
  font-size: 15px;
  color: #6B7280;
  line-height: 1.6;
  font-weight: 500;
}

/* Actions */
.ws-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 10px 24px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: none;

  &.primary {
    background: #111827;
    color: #fff;
    &:hover { background: #374151; transform: translateY(-2px); box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); }
  }

  &.secondary {
    background: #fff;
    color: #374151;
    border: 1.5px solid #E5E7EB;
    &:hover { border-color: #3B82F6; color: #3B82F6; transform: translateY(-2px); }
  }
}

.action-sep {
  width: 1px;
  height: 24px;
  background: #E5E7EB;
  margin: 0 12px;
}

.ws-presence {
  display: flex;
  align-items: center;
  gap: 12px;
}

.avatar-stack {
  display: flex;
  align-items: center;

  img, .more-count {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: 2px solid #fff;
    margin-left: -10px;
    &:first-child { margin-left: 0; }
  }

  .more-count {
    background: #F3F4F6;
    color: #6B7280;
    font-size: 10px;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.presence-text {
  font-size: 12px;
  font-weight: 600;
  color: #94A3B8;
}

/* Dashboard Tiles */
.ws-dashboard {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  flex-shrink: 0;
}

.dash-tile {
  padding: 24px;
  background: #F9FAFB;
  border: 1px solid #F3F4F6;
  border-radius: 16px;
  width: 140px;
  transition: all 0.3s;

  &:hover {
    transform: scale(1.05);
    background: #fff;
    border-color: #E5E7EB;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.05);
  }

  .tile-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    color: #9CA3AF;
    font-size: 14px;

    .trend { font-size: 9px; font-weight: 800; color: #10B981; }
  }

  .val { font-size: 24px; font-weight: 900; color: #111827; display: block; line-height: 1; margin-bottom: 4px; }
  .lab { font-size: 10px; font-weight: 700; color: #94A3B8; letter-spacing: 0.02em; }

  &.gold:hover { border-color: #FCD34D; .tile-header { color: #D97706; } }
  &.blue:hover { border-color: #93C5FD; .tile-header { color: #2563EB; } }
  &.purple:hover { border-color: #D8B4FE; .tile-header { color: #7E22CE; } .trend { color: #94A3B8; } }
}

/* Background Decorations */
.ws-bg-grid {
  position: absolute;
  inset: 0;
  background-image: 
    linear-gradient(#F3F4F6 1px, transparent 1px),
    linear-gradient(90deg, #F3F4F6 1px, transparent 1px);
  background-size: 40px 40px;
  opacity: 0.4;
  mask-image: radial-gradient(circle at center, black, transparent 80%);
}

.ws-glow {
  position: absolute;
  top: -20%; right: -10%;
  width: 400px; height: 400px;
  background: radial-gradient(circle, rgba(59, 130, 246, 0.05) 0%, transparent 70%);
  filter: blur(40px);
}

/* ── Main Grid ── */
.home-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 280px;
  gap: 12px;
  align-items: start;
}

@media (max-width: 1200px) {
  .ws-main { flex-direction: column; align-items: stretch; gap: 40px; }
  .ws-content { max-width: 100%; text-align: center; }
  .ws-actions { justify-content: center; }
  .ws-dashboard { justify-content: center; }
}

@media (max-width: 1100px) { .home-grid { grid-template-columns: 1fr; } }

@media (max-width: 768px) {
  .workspace-station { padding: 32px 24px; }
  .ws-actions { flex-direction: column; .action-sep { display: none; } }
  .ws-dashboard { grid-template-columns: repeat(2, 1fr); .dash-tile { width: 100%; } }
}
</style>

<template>
  <div class="home">
    <main class="main-content">
      <div class="container">
        <div
          :class="[
            'home-announce',
            { 'animate__animated animate__fadeInDown': animated }
          ]"
        >
          <Announcement 
            title="系统更新" 
            message="我们刚刚升级了博客内核，现在支持更快的页面加载和更精美的暗色模式体验。"
            tag="NEW"
            date="2024-03-21"
            type="primary"
            persist-key="v1_update_v3"
          />
        </div>

        <!-- PC端：原有的 grid 布局 + 容器 -->
        <section v-if="!isMobile" class="home-grid">
          <div class="feed-column">
            <div
              :class="[
                'home-filterbar',
                { 'animate__animated animate__fadeInUp': animated }
              ]"
              style="animation-delay: 0.1s"
            >
              <FilterBar
                v-model="searchQuery"
                :categories="categories"
                :active-category="activeCategory"
                :active-sort="activeSort"
                @update:active-category="activeCategory = $event"
                @update:active-sort="activeSort = $event"
              />
            </div>

            <div class="post-feed-wrapper" ref="feedWrapperRef">
              <PostFeed :posts="displayPosts" :animated="animated" :animateIndex="initialCount" />
            </div>

            <Pagination
              v-model:current="currentPage"
              v-model:pageSize="pageSize"
              :total="totalItems"
              :pageSizeOptions="[5, 10, 20]"
            />
          </div>
          <HomeSidebar :animated="animated" />
        </section>

        <!-- 移动端：文章列表全宽，不受容器限制 -->
        <section v-else class="mobile-feed">
          <PostFeed :posts="displayPosts" :animated="animated" :animateIndex="initialCount" />

          <!-- 加载更多按钮 -->
          <div v-if="hasMorePosts" class="load-more-wrapper">
            <button
              class="load-more-btn"
              :class="{ loading: isLoadingMore }"
              :disabled="isLoadingMore"
              @click="loadMore"
            >
              <font-awesome-icon v-if="isLoadingMore" icon="spinner" spin class="btn-icon" />
              <font-awesome-icon v-else icon="chevron-down" class="btn-icon" />
              <span>{{ isLoadingMore ? '加载中...' : '加载更多' }}</span>
            </button>
          </div>
          <div v-else-if="displayedPosts.length > 0" class="no-more">
            — 到底啦 —
          </div>
        </section>

        <!-- 移动端：FilterBar 渲染为 FAB + 抽屉（fixed 定位，不影响布局） -->
        <FilterBar
          v-if="isMobile"
          v-model="searchQuery"
          :categories="categories"
          :active-category="activeCategory"
          :active-sort="activeSort"
          @update:active-category="activeCategory = $event"
          @update:active-sort="activeSort = $event"
        />

        <ResourceSection :animated="animated" />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted, onUnmounted, nextTick } from "vue";
import Announcement from "@/components/v1/common/Announcement.vue";
import FilterBar from "@/components/v1/common/FilterBar.vue";
import PostFeed from "@/components/v1/home/PostFeed.vue";
import HomeSidebar from "@/components/v1/home/HomeSidebar.vue";
import Pagination from "@/components/v1/common/Pagination.vue";
import ResourceSection from "@/components/v1/home/ResourceSection.vue";
import { generateMockResources } from "@/data/mockData";

// 入场动画控制
const animated = ref(false);
onMounted(() => {
  requestAnimationFrame(() => {
    animated.value = true;
  });
});

// ── 移动端检测 ──
const isMobile = ref(false);
const checkMobile = () => {
  isMobile.value = window.innerWidth <= 768;
};
onMounted(() => {
  checkMobile();
  window.addEventListener("resize", checkMobile);
});
onUnmounted(() => {
  window.removeEventListener("resize", checkMobile);
});

const categories = ["全部", "前端", "后端", "设计", "AI", "工具"];
const activeCategory = ref("全部");
const activeSort = ref<"latest" | "popular">("latest");
const searchQuery = ref("");

// ── 数据源 ──
const posts = ref(generateMockResources(24));

const filteredPosts = computed(() => {
  let source =
    activeCategory.value === "全部"
      ? posts.value
      : posts.value.filter((item) => item.category === activeCategory.value);
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    source = source.filter(item => 
      item.title.toLowerCase().includes(query) || 
      item.description.toLowerCase().includes(query)
    );
  }
  
  const sorted = activeSort.value === "popular"
    ? [...source].sort((a, b) => b.views - a.views)
    : [...source].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  
  return sorted;
});

// ── PC端分页 ──
const currentPage = ref(1);
const pageSize = ref(5);
const totalItems = computed(() => filteredPosts.value.length);

const visiblePosts = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return filteredPosts.value.slice(start, end);
});

// ── 移动端手动加载更多 ──
const mobilePageSize = 5;
const displayedCount = ref(mobilePageSize);
const initialCount = ref(mobilePageSize);
const isLoadingMore = ref(false);
const feedWrapperRef = ref<HTMLElement | null>(null);

const displayedPosts = computed(() => {
  return filteredPosts.value.slice(0, displayedCount.value);
});

const hasMorePosts = computed(() => {
  return displayedCount.value < filteredPosts.value.length;
});

const loadMore = () => {
  if (isLoadingMore.value || !hasMorePosts.value) return;
  isLoadingMore.value = true;
  setTimeout(() => {
    displayedCount.value += mobilePageSize;
    isLoadingMore.value = false;
  }, 400);
};

// ── 统一展示数据 ──
const displayPosts = computed(() => {
  return isMobile.value ? displayedPosts.value : visiblePosts.value;
});

// ── 筛选变化时重置 ──
watch([activeCategory, activeSort, searchQuery], () => {
  // PC端重置分页
  currentPage.value = 1;
  // 移动端重置加载更多
  displayedCount.value = mobilePageSize;
  initialCount.value = mobilePageSize;
});
</script>

<style scoped lang="scss">
.home {
  min-height: 100vh;
  background: var(--bg);
}

.container {
  max-width: 1320px;
  margin: 0 auto;
  padding: 20px 20px 80px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* ── PC端 Main Grid ── */
.home-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 280px;
  gap: 24px;
  align-items: start;
}

/* ── Feed Column (PC端内容卡片容器) ── */
.feed-column {
  display: flex;
  flex-direction: column;
  background: var(--bg-secondary);
  border: 1px solid var(--border);
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.04);
  overflow: hidden;
  position: relative;

  &:deep(.dark-mode) {
    background: var(--bg-tertiary);
    border-color: var(--border-dark);
  }
}

/* ── PostFeed Scroll Container (PC端) ── */
.post-feed-wrapper {
  height: calc(100vh - 280px);
  overflow-y: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
  padding-top: 8px;

  &::-webkit-scrollbar {
    display: none;
  }
}

/* ── 移动端文章列表（全宽，无容器限制） ── */
.mobile-feed {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-bottom: 20px;
}

@media (max-width: 1100px) {
  .home-grid {
    grid-template-columns: 1fr;
  }
}

/* animate.css 延迟支持 */
.home-announce,
.home-filterbar {
  opacity: 0;
}

.home-announce.animate__animated,
.home-filterbar.animate__animated {
  opacity: 1;
}

/* ── 加载更多按钮 ── */
.load-more-wrapper {
  display: flex;
  justify-content: center;
  padding: 8px 0 12px;
}

.load-more-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-width: 160px;
  padding: 10px 24px;
  border: 1px solid var(--border);
  border-radius: 999px;
  background: var(--bg-secondary);
  color: var(--text-secondary);
  font-size: 13.5px;
  cursor: pointer;
  transition: all 0.25s ease;

  &:hover:not(:disabled) {
    background: var(--bg-tertiary);
    color: var(--primary);
    border-color: var(--primary);
    box-shadow: 0 2px 12px rgba(59, 130, 246, 0.1);
  }

  &:active:not(:disabled) {
    transform: scale(0.97);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .dark-mode & {
    background: rgba(30, 41, 59, 0.5);
    border-color: rgba(255, 255, 255, 0.06);
    color: #94a3b8;

    &:hover:not(:disabled) {
      background: rgba(30, 41, 59, 0.8);
      color: #60a5fa;
      border-color: rgba(59, 130, 246, 0.3);
      box-shadow: 0 2px 12px rgba(59, 130, 246, 0.15);
    }
  }
}

.btn-icon {
  font-size: 12px;
}

.no-more {
  text-align: center;
  padding: 16px 0 24px;
  font-size: 12.5px;
  color: var(--text-tertiary, #94a3b8);
  opacity: 0.6;
}
</style>

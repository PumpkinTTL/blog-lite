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

        <section class="home-grid">
          <div class="feed-column">
            <div
              v-if="!isMobile"
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
              <PostFeed :posts="displayPosts" :animated="animated" />

              <!-- 无限滚动：移动端加载状态 -->
              <div v-if="isMobile" class="infinite-scroll-sentinel" ref="sentinelRef"></div>
              <div v-if="isMobile && isLoadingMore" class="loading-more">
                <div class="loading-spinner"></div>
                <span>加载中...</span>
              </div>
              <div v-if="isMobile && !hasMorePosts && displayedPosts.length > 0" class="no-more">
                — 到底啦 —
              </div>
            </div>

            <!-- PC端分页 -->
            <Pagination
              v-if="!isMobile"
              v-model:current="currentPage"
              v-model:pageSize="pageSize"
              :total="totalItems"
              :pageSizeOptions="[5, 10, 20]"
            />
          </div>
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
          <HomeSidebar :animated="animated" />
        </section>

        <!-- New Resource Section -->
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

// ── 移动端无限滚动 ──
const mobilePageSize = 5;
const displayedCount = ref(mobilePageSize);
const isLoadingMore = ref(false);
const feedWrapperRef = ref<HTMLElement | null>(null);
const sentinelRef = ref<HTMLElement | null>(null);
let observer: IntersectionObserver | null = null;

const displayedPosts = computed(() => {
  return filteredPosts.value.slice(0, displayedCount.value);
});

const hasMorePosts = computed(() => {
  return displayedCount.value < filteredPosts.value.length;
});

const loadMore = () => {
  if (isLoadingMore.value || !hasMorePosts.value) return;
  isLoadingMore.value = true;
  // 模拟加载延迟
  setTimeout(() => {
    displayedCount.value += mobilePageSize;
    isLoadingMore.value = false;
  }, 400);
};

// 设置 IntersectionObserver
onMounted(() => {
  nextTick(() => {
    setupObserver();
  });
});

const setupObserver = () => {
  if (observer) {
    observer.disconnect();
  }
  observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting && hasMorePosts.value && !isLoadingMore.value) {
        loadMore();
      }
    },
    {
      root: feedWrapperRef.value,
      rootMargin: "200px",
      threshold: 0,
    }
  );
  if (sentinelRef.value) {
    observer.observe(sentinelRef.value);
  }
};

onUnmounted(() => {
  if (observer) {
    observer.disconnect();
    observer = null;
  }
});

// ── 统一展示数据 ──
const displayPosts = computed(() => {
  return isMobile.value ? displayedPosts.value : visiblePosts.value;
});

// ── 筛选变化时重置 ──
watch([activeCategory, activeSort, searchQuery], () => {
  // PC端重置分页
  currentPage.value = 1;
  // 移动端重置无限滚动
  displayedCount.value = mobilePageSize;
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

/* ── Main Grid ── */
.home-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 280px;
  gap: 24px;
  align-items: start;
}

/* ── Feed Column (Content Card Container) ── */
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

/* ── PostFeed Scroll Container ── */
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

@media (max-width: 768px) {
  .post-feed-wrapper {
    height: calc(100dvh - 120px);
  }
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

/* ── 无限滚动样式 ── */
.infinite-scroll-sentinel {
  height: 1px;
  width: 100%;
}

.loading-more {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 20px 0 16px;
  font-size: 13px;
  color: var(--text-tertiary, #94a3b8);
}

.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(0, 0, 0, 0.08);
  border-top-color: var(--primary, #3b82f6);
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.no-more {
  text-align: center;
  padding: 20px 0 24px;
  font-size: 12.5px;
  color: var(--text-tertiary, #94a3b8);
  opacity: 0.6;
}
</style>

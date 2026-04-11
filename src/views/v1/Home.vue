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
            <div class="post-feed-wrapper">
              <PostFeed :posts="visiblePosts" :animated="animated" />
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

        <!-- New Resource Section -->
        <ResourceSection :animated="animated" />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted } from "vue";
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
  // 下一帧触发动画，确保初始渲染不带动画
  requestAnimationFrame(() => {
    animated.value = true;
  });
});

const categories = ["全部", "前端", "后端", "设计", "AI", "工具"];
const activeCategory = ref("全部");
const activeSort = ref<"latest" | "popular">("latest");
const searchQuery = ref("");
const hotTags = [];

// Pagination State
const currentPage = ref(1);
const pageSize = ref(5);

const posts = ref(generateMockResources(24)); // Increase mock data to demonstrate pagination

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

const visiblePosts = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return filteredPosts.value.slice(start, end);
});

const totalItems = computed(() => filteredPosts.value.length);

// Reset page when category, sort or search changes
watch([activeCategory, activeSort, searchQuery], () => {
  currentPage.value = 1;
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

  /* Dark mode support */
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
    height: calc(100dvh - 240px);
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
</style>

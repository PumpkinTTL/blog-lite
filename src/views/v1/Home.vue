<template>
  <div class="home">
    <BlogHeader />
    <main class="main-content">
      <div class="container">
        <Announcement 
          title="系统更新" 
          message="我们刚刚升级了博客内核，现在支持更快的页面加载和更精美的暗色模式体验。"
          tag="NEW"
          date="2024-03-21"
          type="primary"
          persist-key="v1_update_v3"
        />

        <FilterBar
          v-model="searchQuery"
          :categories="categories"
          :active-category="activeCategory"
          :active-sort="activeSort"
          @update:active-category="activeCategory = $event"
          @update:active-sort="activeSort = $event"
        />

        <section class="home-grid">
          <div class="feed-column">
            <PostFeed :posts="visiblePosts" />
            <Pagination
              v-model:current="currentPage"
              :total="totalItems"
              :pageSize="pageSize"
            />
          </div>
          <HomeSidebar />
        </section>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import BlogHeader from "@/components/v1/layout/BlogHeader.vue";
import Announcement from "@/components/v1/common/Announcement.vue";
import FilterBar from "@/components/v1/common/FilterBar.vue";
import PostFeed from "@/components/v1/home/PostFeed.vue";
import HomeSidebar from "@/components/v1/home/HomeSidebar.vue";
import Pagination from "@/components/v1/common/Pagination.vue";
import { generateMockResources } from "@/data/mockData";

const categories = ["全部", "前端", "后端", "设计", "AI", "工具"];
const activeCategory = ref("全部");
const activeSort = ref<"latest" | "popular">("latest");
const searchQuery = ref("");
const hotTags = [];

// Pagination State
const currentPage = ref(1);
const pageSize = 5;

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
  const start = (currentPage.value - 1) * pageSize;
  const end = start + pageSize;
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

.feed-column {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

@media (max-width: 1100px) {
  .home-grid {
    grid-template-columns: 1fr;
  }
}
</style>

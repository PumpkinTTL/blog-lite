<template>
  <div class="shop-page" :class="{ 'dark-mode': isDark }">
    <!-- 头部容器 -->
    <header
      class="shop-header"
      :class="{ 'animate__animated animate__fadeInUp': animated }"
      style="animation-delay: 0s"
    >
      <div class="header-glass-wrapper">
        <!-- 第一行：标题 + 搜索/购物车 + 筛选切换按钮 -->
        <div class="header-row">
          <div class="header-left">
            <div class="brand-badge">
              <font-awesome-icon icon="store" />
            </div>
            <div class="brand-text">
              <h1 class="page-title">资源商城</h1>
              <p class="page-subtitle">Premium Digital Assets</p>
            </div>
          </div>

          <div class="header-actions">
            <div
              class="search-box-v2"
              :class="{ focused: isSearchFocused }"
            >
              <font-awesome-icon icon="magnifying-glass" class="search-icon" />
              <input
                type="text"
                v-model="searchKeyword"
                placeholder="搜索资源..."
                class="search-input"
                @focus="isSearchFocused = true"
                @blur="isSearchFocused = false"
              />
              <div
                v-if="searchKeyword"
                class="search-clear-v2"
                @click="searchKeyword = ''"
              >
                <font-awesome-icon icon="xmark" />
              </div>
            </div>

            <button class="cart-btn-v2">
              <div class="cart-icon-wrapper">
                <font-awesome-icon icon="bag-shopping" />
                <span v-if="cartCount > 0" class="cart-badge">{{
                  cartCount
                }}</span>
              </div>
            </button>

            <button
              class="filter-toggle-btn"
              :class="[{ active: isFilterOpen }, { 'animate__animated animate__fadeInUp': animated }]"
              style="animation-delay: 0.22s"
              @click="isFilterOpen = !isFilterOpen"
            >
              <font-awesome-icon icon="sliders" />
              <span class="filter-label">筛选</span>
              <span
                v-if="activeCategory !== 'all' || activeSort !== 'hot'"
                class="filter-dot"
              ></span>
            </button>
          </div>
        </div>

        <!-- 筛选状态提示（收缩时显示） -->
        <div
          v-if="!isFilterOpen && (activeCategory !== 'all' || searchKeyword || activeSort !== 'hot')"
          class="active-filters-bar"
        >
          <div class="active-tags">
            <span v-if="activeCategory !== 'all'" class="active-tag">
              <font-awesome-icon :icon="getActiveCategoryIcon()" class="tag-icon" />
              {{ getActiveCategoryLabel() }}
              <font-awesome-icon icon="xmark" class="tag-remove" @click="activeCategory = 'all'" />
            </span>
            <span v-if="activeSort !== 'hot'" class="active-tag">
              <font-awesome-icon icon="arrow-up-wide-short" class="tag-icon" />
              {{ getActiveSortLabel() }}
              <font-awesome-icon icon="xmark" class="tag-remove" @click="activeSort = 'hot'" />
            </span>
            <span v-if="searchKeyword" class="active-tag">
              <font-awesome-icon icon="magnifying-glass" class="tag-icon" />
              {{ searchKeyword }}
              <font-awesome-icon icon="xmark" class="tag-remove" @click="searchKeyword = ''" />
            </span>
          </div>
          <button class="clear-all-btn" @click="resetFilters">
            <font-awesome-icon icon="rotate-left" />
            重置
          </button>
        </div>

        <!-- 可收缩的筛选面板 -->
        <transition name="filter-slide">
          <div v-if="isFilterOpen" class="filter-panel">
            <div class="filter-panel-header">
              <span class="filter-title">分类筛选</span>
              <button class="filter-close-btn" @click="isFilterOpen = false">
                <font-awesome-icon icon="chevron-up" />
              </button>
            </div>
            <div class="cat-chips-row">
              <button
                v-for="cat in categories"
                :key="cat.value"
                class="cat-chip-v2"
                :class="{ active: activeCategory === cat.value }"
                @click="activeCategory = cat.value"
              >
                <font-awesome-icon
                  v-if="cat.icon"
                  :icon="cat.icon"
                  class="chip-icon"
                />
                <span>{{ cat.label }}</span>
                <span v-if="cat.value !== 'all'" class="chip-count">
                  {{ getCategoryCount(cat.value) }}
                </span>
              </button>
            </div>
            <div class="filter-divider"></div>
            <div class="sort-row">
              <span class="sort-label">排序</span>
              <div class="sort-group-v2">
                <button
                  v-for="s in sortOptions"
                  :key="s.value"
                  class="sort-pill"
                  :class="{ active: activeSort === s.value }"
                  @click="activeSort = s.value"
                >
                  <font-awesome-icon
                    v-if="s.value === 'hot'"
                    icon="fire"
                    class="s-icon"
                  />
                  <font-awesome-icon
                    v-if="s.value === 'new'"
                    icon="clock"
                    class="s-icon"
                  />
                  <font-awesome-icon
                    v-if="s.value === 'price'"
                    icon="tag"
                    class="s-icon"
                  />
                  {{ s.label }}
                </button>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </header>

    <!-- 移动端浮动筛选按钮 -->
    <button
      class="mobile-filter-fab"
      :class="{ 'has-filter': activeCategory !== 'all' || activeSort !== 'hot' || searchKeyword }"
      @click="isMobileFilterOpen = true"
    >
      <font-awesome-icon icon="sliders" />
      <span v-if="activeCategory !== 'all' || activeSort !== 'hot'" class="fab-dot"></span>
    </button>

    <!-- 移动端底部筛选抽屉 -->
    <transition name="drawer-overlay">
      <div
        v-if="isMobileFilterOpen"
        class="mobile-drawer-overlay"
        @click="isMobileFilterOpen = false"
      ></div>
    </transition>
    <transition name="drawer-slide">
      <div v-if="isMobileFilterOpen" class="mobile-filter-drawer">
        <div class="drawer-header">
          <span class="drawer-title">筛选</span>
          <button class="drawer-close" @click="isMobileFilterOpen = false">
            <font-awesome-icon icon="xmark" />
          </button>
        </div>
        <div class="drawer-body">
          <!-- 搜索 -->
          <div class="drawer-section">
            <div class="drawer-section-title">搜索</div>
            <div class="drawer-search">
              <font-awesome-icon icon="magnifying-glass" class="search-icon" />
              <input
                type="text"
                v-model="searchKeyword"
                placeholder="搜索资源..."
                class="drawer-search-input"
              />
              <div
                v-if="searchKeyword"
                class="drawer-search-clear"
                @click="searchKeyword = ''"
              >
                <font-awesome-icon icon="xmark" />
              </div>
            </div>
          </div>
          <!-- 分类 -->
          <div class="drawer-section">
            <div class="drawer-section-title">分类</div>
            <div class="drawer-chips">
              <button
                v-for="cat in categories"
                :key="cat.value"
                class="drawer-chip"
                :class="{ active: activeCategory === cat.value }"
                @click="activeCategory = cat.value"
              >
                <font-awesome-icon v-if="cat.icon" :icon="cat.icon" class="chip-icon" />
                <span>{{ cat.label }}</span>
                <span v-if="cat.value !== 'all'" class="chip-count">{{ getCategoryCount(cat.value) }}</span>
              </button>
            </div>
          </div>
          <!-- 排序 -->
          <div class="drawer-section">
            <div class="drawer-section-title">排序</div>
            <div class="drawer-sorts">
              <button
                v-for="s in sortOptions"
                :key="s.value"
                class="drawer-sort-btn"
                :class="{ active: activeSort === s.value }"
                @click="activeSort = s.value"
              >
                <font-awesome-icon
                  v-if="s.value === 'hot'" icon="fire" class="s-icon"
                />
                <font-awesome-icon
                  v-if="s.value === 'new'" icon="clock" class="s-icon"
                />
                <font-awesome-icon
                  v-if="s.value === 'price'" icon="tag" class="s-icon"
                />
                {{ s.label }}
              </button>
            </div>
          </div>
        </div>
        <div class="drawer-footer">
          <button class="drawer-reset-btn" @click="resetFilters">
            <font-awesome-icon icon="rotate-left" />
            重置
          </button>
          <button class="drawer-apply-btn" @click="isMobileFilterOpen = false">
            确定
          </button>
        </div>
      </div>
    </transition>

    <!-- 精选推荐 -->
    <section
      v-if="activeCategory === 'all' && !searchKeyword"
      class="featured-section"
      :class="{ 'animate__animated animate__fadeInUp': animated }"
      style="animation-delay: 0.3s"
    >
      <div class="section-label">
        <font-awesome-icon icon="bolt" class="label-icon" />
        <span>精选推荐</span>
      </div>
      <div class="featured-grid">
        <div class="featured-main" @click="handleCardClick(featuredMain)">
          <div class="fm-cover">
            <img
              :src="featuredMain.cover"
              :alt="featuredMain.title"
              loading="lazy"
            />
            <div class="fm-overlay"></div>
            <div class="fm-badge">主推</div>
          </div>
          <div class="fm-info">
            <div class="fm-meta">
              <span
                class="fm-cat-badge"
                :style="{
                  '--badge-color': getCategoryColor(featuredMain.category),
                }"
              >
                <font-awesome-icon
                  :icon="getCategoryIcon(featuredMain.category)"
                  class="cat-icon"
                />
                {{ getCategoryLabel(featuredMain.category) }}
              </span>
              <div class="fm-price-tag">
                <span class="yen">¥</span>
                <span class="val">{{ featuredMain.price }}</span>
              </div>
            </div>
            <h2 class="fm-title">{{ featuredMain.title }}</h2>
            <p class="fm-desc">{{ featuredMain.description }}</p>
            <div class="fm-stats">
              <span class="fm-sales">
                <font-awesome-icon icon="bag-shopping" class="sales-icon" />
                已售 {{ featuredMain.sales }}
              </span>
              <button
                class="fm-action-btn"
                @click.stop="handleCardClick(featuredMain)"
              >
                立即获取
              </button>
            </div>
          </div>
        </div>
        <div class="featured-side">
          <div
            v-for="(item, i) in featuredSide"
            :key="item.id"
            class="featured-sm"
            @click="handleCardClick(item)"
          >
            <div class="fs-cover">
              <img :src="item.cover" :alt="item.title" loading="lazy" />
              <div class="fs-price-tag">¥{{ item.price }}</div>
            </div>
            <div class="fs-info">
              <span
                class="fs-cat-badge"
                :style="{ '--badge-color': getCategoryColor(item.category) }"
              >
                <font-awesome-icon
                  :icon="getCategoryIcon(item.category)"
                  class="cat-icon"
                />
                {{ getCategoryLabel(item.category) }}
              </span>
              <h3 class="fs-title">{{ item.title }}</h3>
              <div class="fs-stats">
                <font-awesome-icon icon="bag-shopping" class="sales-icon" />
                已售 {{ item.sales }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 商品网格 -->
    <section class="grid-section">
      <div v-if="filteredResources.length > 0" class="product-grid">
        <div
          v-for="(item, index) in filteredResources"
          :key="item.id"
          class="grid-item"
          :class="{ 'animate__animated animate__fadeInUp': animated }"
          :style="{ animationDelay: `${0.45 + Math.min(index, 11) * 0.06}s` }"
        >
          <ResourceCard :resource="item" @click="handleCardClick(item)" />
        </div>
      </div>

      <!-- 空状态 -->
      <div v-else class="empty-state">
        <div class="empty-icon">
          <font-awesome-icon icon="box-open" />
        </div>
        <p class="empty-text">没有找到匹配的资源</p>
        <button class="empty-btn" @click="resetFilters">重置筛选条件</button>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useThemeStore } from "@/stores/theme";
import ResourceCard, { type Resource } from "./ResourceCard.vue";

const themeStore = useThemeStore();
const isDark = computed(() => themeStore.isDark);

defineProps<{ animated?: boolean }>();

// 互联网数字资源分类
const categories = [
  { label: "全部", value: "all", icon: "border-all" },
  { label: "AI 账号", value: "ai_account", icon: "robot" },
  { label: "开发工具", value: "dev_tool", icon: "code" },
  { label: "会员订阅", value: "subscription", icon: "crown" },
  { label: "学习资源", value: "course", icon: "graduation-cap" },
  { label: "设计素材", value: "design", icon: "palette" },
];

const sortOptions = [
  { label: "热门", value: "hot" },
  { label: "最新", value: "new" },
  { label: "价格", value: "price" },
];

const activeCategory = ref("all");
const activeSort = ref("hot");
const searchKeyword = ref("");
const cartCount = ref(0);
const isFilterOpen = ref(true);
const isMobileFilterOpen = ref(false);
const isSearchFocused = ref(false);

// 筛选辅助方法
const getActiveCategoryLabel = () => {
  const cat = categories.find((c) => c.value === activeCategory.value);
  return cat?.label || "全部";
};

const getActiveCategoryIcon = () => {
  const cat = categories.find((c) => c.value === activeCategory.value);
  return cat?.icon || "folder";
};

const getActiveSortLabel = () => {
  const s = sortOptions.find((o) => o.value === activeSort.value);
  return s?.label || "热门";
};

// 互联网数字资源数据
const resources = ref<Resource[]>([
  {
    id: 1,
    title: "ChatGPT Team 共享账号",
    description:
      "OpenAI 官方 Team 计划，GPT-4o 无限使用，支持 DALL-E 和高级数据分析",
    cover:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=380&fit=crop",
    price: 49,
    sales: 3842,
    rating: 4.9,
    isHot: true,
    category: "ai_account",
    author: "AI 精选",
    authorAvatar: "https://i.pravatar.cc/150?u=ai1",
  },
  {
    id: 2,
    title: "Claude Code Pro 账号",
    description:
      "Anthropic Claude 旗舰模型，长文本理解能力超强，支持 200K 上下文窗口",
    cover:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=380&fit=crop",
    price: 59,
    sales: 2156,
    rating: 4.8,
    isHot: true,
    category: "ai_account",
    author: "极客工坊",
    authorAvatar: "https://i.pravatar.cc/150?u=ai2",
  },
  {
    id: 3,
    title: "GitHub Copilot 年度订阅",
    description:
      "AI 结对编程助手，支持 VS Code / JetBrains，智能代码补全与生成",
    cover:
      "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=600&h=380&fit=crop",
    price: 89,
    sales: 5670,
    rating: 4.9,
    isHot: true,
    category: "dev_tool",
    author: "Dev Tools",
    authorAvatar: "https://i.pravatar.cc/150?u=dev1",
  },
  {
    id: 4,
    title: "Cursor Pro 共享席位",
    description:
      "AI 原生代码编辑器，内置 GPT-4 / Claude 3.5，智能重构与对话式编程",
    cover:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=380&fit=crop",
    price: 39,
    sales: 4230,
    rating: 4.8,
    category: "dev_tool",
    author: "码上飞",
    authorAvatar: "https://i.pravatar.cc/150?u=dev2",
  },
  {
    id: 5,
    title: "JetBrains 全家桶年度授权",
    description: "IntelliJ IDEA / WebStorm / GoLand 等全系列 IDE 一站式授权",
    cover:
      "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&h=380&fit=crop",
    price: 199,
    sales: 1890,
    rating: 4.9,
    isHot: true,
    category: "subscription",
    author: "工具箱",
    authorAvatar: "https://i.pravatar.cc/150?u=sub1",
  },
  {
    id: 6,
    title: "Midjourney 标准会员",
    description: "AI 绘画利器，15h 快速模式 + 无限放松模式，创意设计必备",
    cover:
      "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=600&h=380&fit=crop",
    price: 69,
    sales: 3120,
    rating: 4.7,
    category: "ai_account",
    author: "创意社",
    authorAvatar: "https://i.pravatar.cc/150?u=ai3",
  },
  {
    id: 7,
    title: "Notion AI 团队版",
    description: "All-in-One 协作平台 + AI 写作助手，团队知识库最佳选择",
    cover:
      "https://images.unsplash.com/photo-1517842645767-c639042777db?w=600&h=380&fit=crop",
    price: 35,
    sales: 6540,
    rating: 4.8,
    category: "subscription",
    author: "效率达人",
    authorAvatar: "https://i.pravatar.cc/150?u=sub2",
  },
  {
    id: 8,
    title: "Figma 企业版席位",
    description: "专业 UI 设计工具，Dev Mode + 变量系统 + 高级原型交互",
    cover:
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=380&fit=crop",
    price: 79,
    sales: 2870,
    rating: 4.8,
    category: "design",
    author: "Design Lab",
    authorAvatar: "https://i.pravatar.cc/150?u=des1",
  },
  {
    id: 9,
    title: "Windsurf Pro 编辑器",
    description: "Codeium 出品 AI 编辑器，Cascade 智能流式编程，下一代开发体验",
    cover:
      "https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=600&h=380&fit=crop",
    price: 45,
    sales: 1560,
    rating: 4.7,
    category: "dev_tool",
    author: "新工具速递",
    authorAvatar: "https://i.pravatar.cc/150?u=dev3",
  },
  {
    id: 10,
    title: "全栈开发进阶课程",
    description:
      "从零到一构建 SaaS 产品，Vue3 + Node.js + 云部署，实战项目驱动",
    cover:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=380&fit=crop",
    price: 129,
    sales: 8900,
    rating: 4.9,
    isHot: true,
    category: "course",
    author: "架构之道",
    authorAvatar: "https://i.pravatar.cc/150?u=edu1",
  },
  {
    id: 11,
    title: "Perplexity Pro 账号",
    description: "AI 搜索引擎 Pro 版，GPT-4 / Claude 3 双引擎，学术研究利器",
    cover:
      "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&h=380&fit=crop",
    price: 39,
    sales: 2340,
    rating: 4.7,
    category: "ai_account",
    author: "AI 精选",
    authorAvatar: "https://i.pravatar.cc/150?u=ai4",
  },
  {
    id: 12,
    title: "Figma UI 组件库大合集",
    description: "5000+ 精选组件，涵盖 Dashboard / 电商 / 社交等 12 个行业模板",
    cover:
      "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=600&h=380&fit=crop",
    price: 59,
    sales: 4120,
    rating: 4.8,
    category: "design",
    author: "Design Lab",
    authorAvatar: "https://i.pravatar.cc/150?u=des2",
  },
]);

const filteredResources = computed(() => {
  let result = resources.value;
  if (activeCategory.value !== "all") {
    result = result.filter((r) => r.category === activeCategory.value);
  }
  if (searchKeyword.value) {
    const kw = searchKeyword.value.toLowerCase();
    result = result.filter(
      (r) =>
        r.title.toLowerCase().includes(kw) ||
        r.description.toLowerCase().includes(kw)
    );
  }
  if (activeSort.value === "hot")
    result = [...result].sort((a, b) => b.sales - a.sales);
  else if (activeSort.value === "price")
    result = [...result].sort((a, b) => a.price - b.price);
  else if (activeSort.value === "new")
    result = [...result].sort((a, b) => b.id - a.id);
  return result;
});

const featuredMain = computed(
  () => resources.value.find((r) => r.isHot) || resources.value[0]
);
const featuredSide = computed(() =>
  resources.value
    .filter((r) => r.isHot && r.id !== featuredMain.value.id)
    .slice(0, 2)
);

const getCategoryIcon = (cat: string) => {
  const m: Record<string, string> = {
    ai_account: "robot",
    dev_tool: "code",
    subscription: "crown",
    course: "graduation-cap",
    design: "palette",
  };
  return m[cat] || "tag";
};

const getCategoryLabel = (cat: string) => {
  const m: Record<string, string> = {
    ai_account: "AI 账号",
    dev_tool: "开发工具",
    subscription: "会员订阅",
    course: "学习资源",
    design: "设计素材",
  };
  return m[cat] || cat;
};

const getCategoryColor = (cat: string) => {
  const m: Record<string, string> = {
    ai_account: "#8b5cf6",
    dev_tool: "#3b82f6",
    subscription: "#f59e0b",
    course: "#10b981",
    design: "#ec4899",
  };
  return m[cat] || "#3b82f6";
};

const getCategoryCount = (cat: string) =>
  resources.value.filter((r) => r.category === cat).length;

const handleCardClick = (item: Resource) => {
  console.log("Detail:", item.id);
};

const resetFilters = () => {
  activeCategory.value = "all";
  searchKeyword.value = "";
};
</script>

<style scoped lang="scss">
.shop-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 8px 24px 60px;
}

/* === 头部容器 === */
.shop-header {
  margin-bottom: 20px;
  opacity: 0;

  &.animate__animated {
    opacity: 1;
  }
}

/* 动画初始隐藏 — animate.css fadeInUp + fill-mode:both 在 delay 期间保持 opacity:0 */
.featured-section,
.grid-item {
  opacity: 0;

  &.animate__animated {
    opacity: 1;
  }
}

.header-glass-wrapper {
  background: var(--surface, #ffffff);
  border: 1px solid var(--border-light, #f1f5f9);
  border-radius: 16px;
  padding: 20px 24px;
  transition: all 0.3s ease;

  .dark-mode & {
    background: var(--surface, #1e293b);
    border-color: rgba(255, 255, 255, 0.06);
  }
}

.header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-shrink: 0;
}

.brand-badge {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: #fff;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.25);
}

.brand-text {
  display: flex;
  flex-direction: column;
}

.page-title {
  margin: 0;
  font-size: 24px;
  font-weight: 800;
  color: var(--text, #0f172a);
  letter-spacing: -0.5px;
  line-height: 1.1;

  .dark-mode & {
    color: #f1f5f9;
  }
}

.page-subtitle {
  margin: 2px 0 0;
  font-size: 13px;
  color: #64748b;
  font-weight: 600;
  letter-spacing: 0.2px;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  justify-content: flex-end;
}

.search-box-v2 {
  position: relative;
  width: 100%;
  max-width: 320px;
  transition: box-shadow 0.3s cubic-bezier(0.2, 1, 0.3, 1), border-color 0.3s ease;

  .search-icon {
    position: absolute;
    left: 14px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 14px;
    color: #94a3b8;
    pointer-events: none;
    transition: color 0.3s;
  }

  .search-input {
    width: 100%;
    height: 42px;
    padding: 0 40px 0 42px;
    border: 1px solid var(--border-light, #f1f5f9);
    border-radius: 12px;
    font-size: 14px;
    font-weight: 500;
    color: var(--text, #1e293b);
    background: #f8fafc;
    outline: none;
    transition: all 0.3s;

    &::placeholder {
      color: #94a3b8;
    }

    .dark-mode & {
      background: rgba(30, 41, 59, 0.5);
      border-color: rgba(255, 255, 255, 0.05);
      color: #f1f5f9;
    }
  }

  &.focused {
    max-width: 400px;
    .search-input {
      background: #fff;
      border-color: #3b82f6;
      box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
    }
    .search-icon {
      color: #3b82f6;
    }

    .dark-mode & .search-input {
      background: #0f172a;
    }
  }

  .search-clear-v2 {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #94a3b8;
    cursor: pointer;
    border-radius: 50%;
    font-size: 12px;
    &:hover {
      background: #e2e8f0;
      color: #1e293b;
    }
  }
}

.cart-btn-v2 {
  width: 42px;
  height: 42px;
  border: 1px solid var(--border-light, #f1f5f9);
  background: #fff;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
  cursor: pointer;
  transition: background 0.2s, border-color 0.2s, color 0.2s;
  flex-shrink: 0;

  &:hover {
    color: #3b82f6;
    border-color: #3b82f6;
    background: rgba(59, 130, 246, 0.04);
    transform: scale(1.05);
  }

  .dark-mode & {
    background: rgba(30, 41, 59, 0.5);
    border-color: rgba(255, 255, 255, 0.05);
    color: #94a3b8;
  }
}

/* === 分类筛选 V2 === */
/* === 筛选切换按钮 === */
.filter-toggle-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  height: 42px;
  padding: 0 16px;
  border: 1px solid var(--border-light, #f1f5f9);
  border-radius: 12px;
  background: #f8fafc;
  color: var(--text-secondary, #64748b);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s, border-color 0.2s, color 0.2s;
  position: relative;
  white-space: nowrap;

  &:hover {
    border-color: #3b82f6;
    color: #3b82f6;
  }

  &.active {
    background: #3b82f6;
    border-color: #3b82f6;
    color: #fff;
  }

  .dark-mode & {
    background: rgba(30, 41, 59, 0.5);
    border-color: rgba(255, 255, 255, 0.06);
    color: #94a3b8;

    &:hover {
      border-color: #60a5fa;
      color: #60a5fa;
    }
    &.active {
      background: #3b82f6;
      border-color: #3b82f6;
      color: #fff;
    }
  }
}

.filter-dot {
  width: 6px;
  height: 6px;
  background: #ef4444;
  border-radius: 50%;
  position: absolute;
  top: 8px;
  right: 8px;
}

.filter-label {
  .dark-mode & {
    color: inherit;
  }
}

/* === 活跃筛选标签 === */
.active-filters-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 10px 0 0;
  animation: fadeIn 0.2s ease;
}

.active-tags {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
  min-width: 0;
}

.active-tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 10px;
  background: rgba(59, 130, 246, 0.08);
  border: 1px solid rgba(59, 130, 246, 0.15);
  border-radius: 6px;
  font-size: 11px;
  font-weight: 600;
  color: #3b82f6;
  white-space: nowrap;
  max-width: 160px;
  overflow: hidden;
  text-overflow: ellipsis;

  .tag-icon {
    font-size: 10px;
    flex-shrink: 0;
  }

  .tag-remove {
    font-size: 9px;
    cursor: pointer;
    opacity: 0.6;
    flex-shrink: 0;
    margin-left: 2px;
    &:hover { opacity: 1; }
  }

  .dark-mode & {
    background: rgba(59, 130, 246, 0.15);
    border-color: rgba(59, 130, 246, 0.25);
    color: #60a5fa;
  }
}

.clear-all-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 3px 10px;
  border: none;
  border-radius: 6px;
  background: transparent;
  font-size: 11px;
  font-weight: 600;
  color: var(--text-tertiary, #94a3b8);
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
  flex-shrink: 0;

  &:hover {
    color: #ef4444;
  }
}

/* === 可收缩筛选面板 === */
.filter-panel {
  padding-top: 16px;
  margin-top: 14px;
  border-top: 1px solid var(--border-light, #f1f5f9);

  .dark-mode & {
    border-top-color: rgba(255, 255, 255, 0.05);
  }
}

.filter-panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.filter-title {
  font-size: 13px;
  font-weight: 700;
  color: var(--text-secondary, #64748b);
  letter-spacing: 0.3px;
}

.filter-close-btn {
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.04);
  color: var(--text-tertiary, #94a3b8);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: rgba(0, 0, 0, 0.08);
    color: var(--text-secondary, #64748b);
  }

  .dark-mode & {
    background: rgba(255, 255, 255, 0.05);
    &:hover {
      background: rgba(255, 255, 255, 0.1);
      color: #94a3b8;
    }
  }
}

.cat-chips-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.cat-chip-v2 {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border: 1px solid var(--border-light, #f1f5f9);
  border-radius: 10px;
  background: transparent;
  font-size: 13px;
  font-weight: 600;
  color: var(--text-secondary, #64748b);
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;

  .chip-icon {
    font-size: 12px;
    opacity: 0.6;
  }

  .chip-count {
    font-size: 10px;
    background: rgba(0, 0, 0, 0.04);
    padding: 1px 6px;
    border-radius: 6px;
    color: #94a3b8;
  }

  &:hover {
    border-color: #3b82f6;
    color: #3b82f6;
  }

  &.active {
    background: #3b82f6;
    border-color: #3b82f6;
    color: #fff;
    .chip-icon { opacity: 1; }
    .chip-count {
      background: rgba(255, 255, 255, 0.2);
      color: #fff;
    }
  }

  .dark-mode & {
    border-color: rgba(255, 255, 255, 0.06);
    color: #94a3b8;
    &:hover {
      border-color: #60a5fa;
      color: #60a5fa;
    }
    &.active {
      background: #3b82f6;
      border-color: #3b82f6;
      color: #fff;
      .chip-count {
        background: rgba(255, 255, 255, 0.2);
        color: #fff;
      }
    }
  }
}

.filter-divider {
  height: 1px;
  background: var(--border-light, #f1f5f9);
  margin: 12px 0;

  .dark-mode & {
    background: rgba(255, 255, 255, 0.05);
  }
}

.sort-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.sort-label {
  font-size: 13px;
  font-weight: 700;
  color: var(--text-tertiary, #94a3b8);
  flex-shrink: 0;
}

.sort-group-v2 {
  display: flex;
  gap: 6px;
}

.sort-pill {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 5px 12px;
  height: 32px;
  font-size: 12px;
  font-weight: 700;
  color: var(--text-tertiary, #94a3b8);
  background: transparent;
  border: 1px solid transparent;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;

  .s-icon {
    font-size: 10px;
    opacity: 0.5;
  }

  &:hover {
    color: #3b82f6;
    background: rgba(59, 130, 246, 0.05);
  }

  &.active {
    background: rgba(59, 130, 246, 0.08);
    border-color: rgba(59, 130, 246, 0.15);
    color: #3b82f6;
    .s-icon { opacity: 1; }

    .dark-mode & {
      background: rgba(59, 130, 246, 0.15);
      border-color: rgba(59, 130, 246, 0.25);
      color: #60a5fa;
    }
  }

  .dark-mode & {
    color: #64748b;
    &:hover {
      color: #60a5fa;
      background: rgba(59, 130, 246, 0.08);
    }
  }
}

/* 筛选面板过渡动画 */
.filter-slide-enter-active,
.filter-slide-leave-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  overflow: hidden;
}

.filter-slide-enter-from,
.filter-slide-leave-to {
  opacity: 0;
  max-height: 0;
  padding-top: 0;
  margin-top: 0;
}

.filter-slide-enter-to,
.filter-slide-leave-from {
  opacity: 1;
  max-height: 300px;
}

/* === 筛选提示 (Premium Style) === */
/* === 精选推荐 === */
.featured-section {
  margin-bottom: 32px;
}

.section-label {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;
  font-size: 15px;
  font-weight: 700;
  color: var(--text);

  .label-icon {
    color: #f59e0b;
  }
}

.featured-grid {
  display: grid;
  grid-template-columns: 1.6fr 1fr;
  gap: 20px;
  margin-bottom: 32px;
}

.featured-main {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  background: var(--surface, #ffffff);
  border: 1px solid var(--border-light, #f1f5f9);
  border-radius: 20px;
  overflow: hidden;
  cursor: pointer;
  box-shadow: 0 4px 20px -5px rgba(0, 0, 0, 0.05);
  transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.1);
    border-color: var(--primary-light);

    .fm-cover img {
      transform: scale(1.05);
    }
  }

  .dark-mode & {
    background: #1e293b;
    border-color: rgba(255, 255, 255, 0.06);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  }
}

.fm-cover {
  position: relative;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.6s cubic-bezier(0.23, 1, 0.32, 1);
  }

  .fm-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to right, transparent, rgba(0, 0, 0, 0.05));
  }

  .fm-badge {
    position: absolute;
    top: 16px;
    left: 16px;
    padding: 5px 12px;
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    border-radius: 10px;
    font-size: 11px;
    font-weight: 800;
    color: var(--primary);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);

    .dark-mode & {
      background: rgba(15, 23, 42, 0.8);
    }
  }
}

.fm-info {
  padding: 28px;
  display: flex;
  flex-direction: column;
}

.fm-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}

.fm-cat-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  width: fit-content;
  font-size: 11px;
  font-weight: 800;
  color: var(--badge-color);
  background: color-mix(in srgb, var(--badge-color) 10%, transparent);
  padding: 3px 12px;
  border-radius: 8px;
  letter-spacing: 0.5px;
  white-space: nowrap;

  .cat-icon {
    font-size: 10px;
    opacity: 0.8;
  }
}

.fm-price-tag {
  display: flex;
  align-items: baseline;
  gap: 2px;
  color: #ef4444;
  background: var(--bg-secondary);
  padding: 4px 12px;
  border-radius: 10px;
  font-weight: 900;

  .yen {
    font-size: 18px;
    font-weight: 700;
  }
  .val {
    font-size: 18px;
    font-weight: 700;
    letter-spacing: -0.3px;
  }

  .dark-mode & {
    background: rgba(255, 255, 255, 0.05);
  }
}

.fm-title {
  font-size: 22px;
  font-weight: 800;
  margin-bottom: 10px;
  line-height: 1.25;
}

.fm-desc {
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 24px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.fm-stats {
  margin-top: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.fm-sales {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--text-tertiary, #94a3b8);
  font-weight: 600;
  white-space: nowrap;

  .sales-icon {
    font-size: 11px;
    opacity: 0.6;
  }
}

.fm-action-btn {
  padding: 8px 20px;
  background: var(--primary);
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;
  flex-shrink: 0;
  transition: all 0.2s ease;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  }
}

.featured-side {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.featured-sm {
  display: grid;
  grid-template-columns: 120px 1fr;
  flex: 1;
  border-radius: 16px;
  overflow: hidden;
  background: var(--surface);
  border: 1px solid var(--border-light, #f1f5f9);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);

  &:hover {
    transform: translateX(6px);
    box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.08);
    border-color: var(--primary-light);

    .fs-cover img {
      transform: scale(1.1);
    }
  }

  .dark-mode & {
    background: #1e293b;
    border-color: rgba(255, 255, 255, 0.06);
  }
}

.fs-cover {
  position: relative;
  overflow: hidden;
  aspect-ratio: 1;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.6s cubic-bezier(0.23, 1, 0.32, 1);
  }

  .fs-price-tag {
    position: absolute;
    bottom: 8px;
    left: 8px;
    padding: 2px 8px;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(4px);
    border-radius: 6px;
    font-size: 12px;
    font-weight: 900;
    color: #ef4444;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);

    .dark-mode & {
      background: rgba(15, 23, 42, 0.9);
      color: #f87171;
    }
  }
}

.fs-info {
  padding: 16px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
}

.fs-title {
  margin: 0 0 6px;
  font-size: 14px;
  font-weight: 700;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;

  .dark-mode & {
    color: #f1f5f9;
  }
}

.fs-cat-badge {
  display: flex;
  align-items: center;
  gap: 5px;
  width: fit-content;
  font-size: 10px;
  font-weight: 800;
  color: var(--badge-color);
  background: color-mix(in srgb, var(--badge-color) 10%, transparent);
  padding: 2px 10px;
  border-radius: 8px;
  margin-bottom: 6px;
  white-space: nowrap;

  .cat-icon {
    font-size: 9px;
    opacity: 0.8;
  }
}

.fs-stats {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-weight: 600;
  color: var(--text-tertiary, #94a3b8);
  white-space: nowrap;

  .sales-icon {
    font-size: 11px;
    opacity: 0.6;
  }
}

/* === 商品网格 === */
.grid-section {
  padding: 0;
}

/* === 商品网格 === */
.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 28px;
}

/* === 空状态 === */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  background: #f8fafc;
  border: 2px dashed #e2e8f0;
  border-radius: 32px;
  text-align: center;

  .empty-icon {
    width: 80px;
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #fff;
    border-radius: 24px;
    font-size: 32px;
    color: #94a3b8;
    margin-bottom: 20px;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.04);
  }

  .empty-text {
    font-size: 18px;
    font-weight: 800;
    color: #1e293b;
    margin: 0 0 12px;
  }

  .empty-btn {
    padding: 12px 32px;
    background: #3b82f6;
    color: #fff;
    border: none;
    border-radius: 14px;
    font-weight: 700;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.2, 1, 0.3, 1);

    &:hover {
      background: #2563eb;
      transform: translateY(-2px);
      box-shadow: 0 12px 24px rgba(37, 99, 235, 0.3);
    }
  }

  .dark-mode & {
    background: rgba(30, 41, 59, 0.3);
    border-color: rgba(255, 255, 255, 0.05);

    .empty-icon {
      background: #1e293b;
      color: #475569;
    }
    .empty-text {
      color: #f1f5f9;
    }
  }
}

/* === 响应式 (Premium Refinement) === */
@media (max-width: 1024px) {
  .product-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
  }
  .featured-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .shop-page {
    padding: 6px 16px 40px;
  }

  .header-glass-wrapper {
    padding: 16px;
  }

  .header-row {
    flex-wrap: wrap;
  }

  .header-actions {
    width: 100%;
    justify-content: space-between;
  }

  .search-box-v2 {
    max-width: none;
    flex: 1;
  }

  .filter-label {
    display: none;
  }

  .cat-chips-row {
    overflow-x: auto;
    flex-wrap: nowrap;
    scrollbar-width: none;
    &::-webkit-scrollbar {
      display: none;
    }
  }

  .sort-row {
    overflow-x: auto;
    scrollbar-width: none;
    &::-webkit-scrollbar {
      display: none;
    }
  }

  .featured-grid {
    grid-template-columns: 1fr;
  }

  .featured-main {
    grid-template-columns: 1fr;
  }

  .fm-cover {
    min-height: 160px;
  }

  .fm-info {
    padding: 16px;
  }

  .featured-sm {
    grid-template-columns: 1.1fr 1fr;
  }

  .fs-cover {
    min-height: 100px;
  }

  .fs-info {
    padding: 10px 12px;
  }

  .fs-cat-badge {
    padding: 1px 6px;
    font-size: 9px;
    margin-bottom: 4px;
    gap: 3px;
    .cat-icon { font-size: 8px; }
  }

  .fs-title {
    font-size: 13px;
    margin-bottom: 4px;
  }

  .fs-stats {
    font-size: 11px;
    gap: 3px;
    .sales-icon { font-size: 10px; }
  }

  .product-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }
}

@media (max-width: 480px) {
  .shop-page {
    padding: 4px 16px 40px;
  }

  .product-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px;
    width: 100%;
  }

  .page-title {
    font-size: 20px;
  }

  .brand-badge {
    width: 40px;
    height: 40px;
    font-size: 16px;
  }

  .fm-cover {
    min-height: 160px;
  }

  .fm-title {
    font-size: 16px;
  }

  .featured-sm {
    grid-template-columns: 1fr;
  }

  .fs-cover {
    min-height: 140px;
  }

  .fs-info {
    padding: 12px;
  }

  .fs-cat-badge {
    padding: 2px 8px;
    font-size: 10px;
    white-space: nowrap;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

/* 移动端浮动筛选按钮 — PC端隐藏 */
.mobile-filter-fab {
  display: none;
}

/* 移动端底部筛选抽屉 — PC端隐藏 */
.mobile-drawer-overlay,
.mobile-filter-drawer {
  display: none;
}

@media (max-width: 768px) {
  /* 隐藏PC端头部筛选按钮、搜索框和筛选面板 */
  .search-box-v2 {
    display: none;
  }

  .filter-toggle-btn {
    display: none;
  }

  .filter-panel {
    display: none;
  }

  .active-filters-bar {
    display: none;
  }

  /* 浮动筛选按钮 */
  .mobile-filter-fab {
    display: flex;
    position: fixed;
    right: auto;
    left: 16px;
    bottom: 24px;
    width: 52px;
    height: 52px;
    border-radius: 16px;
    border: none;
    background: var(--primary, #3b82f6);
    color: #fff;
    font-size: 20px;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 4px 16px rgba(59, 130, 246, 0.35);
    z-index: 100;
    transition: transform 0.2s, box-shadow 0.2s;

    &:active {
      transform: scale(0.92);
    }

    &.has-filter {
      background: var(--primary, #3b82f6);
    }

    .fab-dot {
      position: absolute;
      top: 10px;
      right: 10px;
      width: 8px;
      height: 8px;
      background: #ef4444;
      border-radius: 50%;
      border: 2px solid var(--primary, #3b82f6);
    }
  }

  /* 遮罩 */
  .mobile-drawer-overlay {
    display: block;
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.4);
    z-index: 200;
  }

  /* 抽屉 */
  .mobile-filter-drawer {
    display: flex;
    flex-direction: column;
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    max-height: 75vh;
    background: var(--surface, #ffffff);
    border-radius: 20px 20px 0 0;
    z-index: 201;
    overflow: hidden;

    .dark-mode & {
      background: #1e293b;
    }
  }

  .drawer-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 20px;
    border-bottom: 1px solid var(--border-light, #f1f5f9);

    .dark-mode & {
      border-bottom-color: rgba(51, 65, 85, 0.4);
    }
  }

  .drawer-title {
    font-size: 16px;
    font-weight: 700;
    color: var(--text, #1f2937);

    .dark-mode & { color: #f1f5f9; }
  }

  .drawer-close {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: none;
    background: var(--bg-secondary, #f1f5f9);
    color: var(--text-secondary, #64748b);
    font-size: 14px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;

    .dark-mode & {
      background: rgba(51, 65, 85, 0.5);
      color: #94a3b8;
    }
  }

  .drawer-body {
    flex: 1;
    overflow-y: auto;
    padding: 12px 20px 16px;
  }

  .drawer-section {
    margin-bottom: 20px;

    &:last-child {
      margin-bottom: 0;
    }
  }

  .drawer-section-title {
    font-size: 12px;
    font-weight: 600;
    color: var(--text-tertiary, #94a3b8);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 10px;
  }

  .drawer-search {
    display: flex;
    align-items: center;
    gap: 8px;
    background: var(--bg-secondary, #f8fafc);
    border: 1px solid var(--border-light, #f1f5f9);
    border-radius: 10px;
    padding: 0 12px;
    height: 40px;

    .dark-mode & {
      background: rgba(30, 41, 59, 0.6);
      border-color: rgba(51, 65, 85, 0.4);
    }

    .search-icon {
      font-size: 13px;
      color: var(--text-tertiary, #94a3b8);
      flex-shrink: 0;
    }

    .drawer-search-input {
      flex: 1;
      border: none;
      outline: none;
      background: transparent;
      font-size: 14px;
      color: var(--text, #1f2937);

      .dark-mode & { color: #f1f5f9; }

      &::placeholder {
        color: var(--text-tertiary, #94a3b8);
      }
    }

    .drawer-search-clear {
      cursor: pointer;
      color: var(--text-tertiary, #94a3b8);
      font-size: 12px;
      flex-shrink: 0;
    }
  }

  .drawer-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .drawer-chip {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 7px 14px;
    border-radius: 20px;
    border: 1px solid var(--border-light, #f1f5f9);
    background: var(--surface, #ffffff);
    color: var(--text-secondary, #64748b);
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.2s, color 0.2s, border-color 0.2s;

    .dark-mode & {
      background: rgba(30, 41, 59, 0.6);
      border-color: rgba(51, 65, 85, 0.4);
    }

    .chip-icon {
      font-size: 12px;
    }

    .chip-count {
      font-size: 11px;
      color: var(--text-tertiary, #94a3b8);
    }

    &.active {
      background: var(--primary, #3b82f6);
      color: #fff;
      border-color: var(--primary, #3b82f6);

      .chip-count {
        color: rgba(255, 255, 255, 0.8);
      }
    }
  }

  .drawer-sorts {
    display: flex;
    gap: 8px;
  }

  .drawer-sort-btn {
    flex: 1;
    padding: 8px 0;
    border-radius: 10px;
    border: 1px solid var(--border-light, #f1f5f9);
    background: var(--surface, #ffffff);
    color: var(--text-secondary, #64748b);
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.2s, color 0.2s, border-color 0.2s;

    .dark-mode & {
      background: rgba(30, 41, 59, 0.6);
      border-color: rgba(51, 65, 85, 0.4);
    }

    .s-icon {
      margin-right: 3px;
      font-size: 12px;
    }

    &.active {
      background: var(--primary, #3b82f6);
      color: #fff;
      border-color: var(--primary, #3b82f6);
    }
  }

  .drawer-footer {
    display: flex;
    gap: 10px;
    padding: 12px 20px 20px;
    border-top: 1px solid var(--border-light, #f1f5f9);

    .dark-mode & {
      border-top-color: rgba(51, 65, 85, 0.4);
    }
  }

  .drawer-reset-btn {
    flex: 1;
    height: 42px;
    border-radius: 10px;
    border: 1px solid var(--border-light, #f1f5f9);
    background: var(--surface, #ffffff);
    color: var(--text-secondary, #64748b);
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;

    .dark-mode & {
      background: rgba(30, 41, 59, 0.6);
      border-color: rgba(51, 65, 85, 0.4);
      color: #94a3b8;
    }
  }

  .drawer-apply-btn {
    flex: 2;
    height: 42px;
    border-radius: 10px;
    border: none;
    background: var(--primary, #3b82f6);
    color: #fff;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
  }
}

/* 抽屉过渡动画 */
.drawer-overlay-enter-active,
.drawer-overlay-leave-active {
  transition: opacity 0.25s ease;
}
.drawer-overlay-enter-from,
.drawer-overlay-leave-to {
  opacity: 0;
}

.drawer-slide-enter-active,
.drawer-slide-leave-active {
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.drawer-slide-enter-from,
.drawer-slide-leave-to {
  transform: translateY(100%);
}

/* 减弱动画偏好 */
@media (prefers-reduced-motion: reduce) {
  .featured-section,
  .grid-item,
  .shop-header {
    animation: none !important;
    transition: none !important;
    opacity: 1 !important;
  }
}
</style>

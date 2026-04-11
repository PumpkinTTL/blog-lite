<template>
  <div class="shop-page" :class="{ 'dark-mode': isDark }">
    <!-- 吸顶容器：标题 + 搜索 + 分类 + 排序 -->
    <header
      class="shop-header"
      :class="{
        'is-stuck': isHeaderStuck,
        'animate__animated animate__fadeIn': animated,
      }"
      ref="headerRef"
    >
      <div class="header-glass-wrapper">
        <div class="header-main">
          <div class="header-left">
            <div class="brand-badge">
              <font-awesome-icon icon="store" />
            </div>
            <div class="brand-text">
              <h1 class="page-title">资源商城</h1>
              <p class="page-subtitle">Premium Digital Assets & Resources</p>
            </div>
          </div>

          <div class="header-actions">
            <div class="search-box-v2" :class="{ focused: isSearchFocused }">
              <font-awesome-icon icon="magnifying-glass" class="search-icon" />
              <input
                type="text"
                v-model="searchKeyword"
                placeholder="搜索资源、软件、账号..."
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
          </div>
        </div>

        <!-- 分类筛选 + 排序 (Premium Tab Style) -->
        <div class="filter-row-v2">
          <div class="cat-segment-container">
            <div class="active-pill" :style="pillStyle"></div>
            <div class="cat-chips-v2">
              <button
                v-for="(cat, index) in categories"
                :key="cat.value"
                :ref="(el) => setCatRef(el, index)"
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
          </div>

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
    </header>

    <!-- 筛选提示 -->
    <div
      v-if="activeCategory !== 'all' || searchKeyword"
      class="filter-status"
      :class="{ 'animate__animated animate__fadeIn': animated }"
    >
      <span class="status-text">
        找到 <strong>{{ filteredResources.length }}</strong> 个资源
      </span>
      <button class="status-clear" @click="resetFilters">
        <font-awesome-icon icon="rotate-left" />
        清除筛选
      </button>
    </div>

    <!-- 精选推荐 -->
    <section
      v-if="activeCategory === 'all' && !searchKeyword"
      class="featured-section"
      :class="{ 'animate__animated animate__fadeInUp': animated }"
      style="animation-delay: 0.2s"
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
          :style="{ animationDelay: `${0.3 + Math.min(index, 11) * 0.05}s` }"
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
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from "vue";
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

// 吸顶检测
const headerRef = ref<HTMLElement | null>(null);
const isHeaderStuck = ref(false);
const isSearchFocused = ref(false);
let observer: IntersectionObserver | null = null;

// 分类 Pill 动画逻辑
const catRefs = ref<HTMLElement[]>([]);
const pillStyle = ref({ transform: "translateX(0)", width: "0", opacity: 0 });

const setCatRef = (el: any, index: number) => {
  if (el) catRefs.value[index] = el;
};

const updatePill = () => {
  nextTick(() => {
    const index = categories.findIndex((c) => c.value === activeCategory.value);
    const el = catRefs.value[index];
    if (el) {
      pillStyle.value = {
        opacity: 1,
        transform: `translateX(${el.offsetLeft}px)`,
        width: `${el.offsetWidth}px`,
      };
    }
  });
};

onMounted(() => {
  updatePill();
  window.addEventListener("resize", updatePill);

  if (!headerRef.value) return;
  const sentinel = document.createElement("div");
  sentinel.className = "sticky-sentinel";
  headerRef.value.parentNode?.insertBefore(sentinel, headerRef.value);

  observer = new IntersectionObserver(
    ([entry]) => {
      isHeaderStuck.value = !entry.isIntersecting;
    },
    { rootMargin: "-65px 0px 0px 0px" } // 65px = 顶部导航高度
  );
  observer.observe(sentinel);
});

onUnmounted(() => {
  observer?.disconnect();
  window.removeEventListener("resize", updatePill);
});

watch(activeCategory, updatePill);

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
  padding: 24px 24px 60px;
}

/* === 吸顶头部 (Premium Rebuild) === */
.shop-header {
  position: sticky;
  top: 64px;
  z-index: 100;
  margin-bottom: 24px;
  transition: all 0.4s cubic-bezier(0.2, 1, 0.3, 1);
  opacity: 0;

  &.animate__animated {
    opacity: 1;
  }

  &.is-stuck {
    .header-glass-wrapper {
      border-radius: 0 0 24px 24px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08), 0 1px 1px rgba(0, 0, 0, 0.02);
      padding: 14px 28px 12px;
      margin: 0 -12px;
      background: rgba(255, 255, 255, 0.85);
      backdrop-filter: blur(20px) saturate(180%);
      -webkit-backdrop-filter: blur(20px) saturate(180%);
      border-top-color: transparent;
    }
  }

  .dark-mode & {
    &.is-stuck .header-glass-wrapper {
      background: rgba(15, 23, 42, 0.8);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    }
  }
}

.header-glass-wrapper {
  background: var(--surface, #ffffff);
  border: 1px solid var(--border-light, #f1f5f9);
  border-radius: 20px;
  padding: 20px 28px 16px;
  transition: all 0.4s ease;

  .dark-mode & {
    background: var(--surface, #1e293b);
    border-color: rgba(255, 255, 255, 0.06);
  }
}

.header-main {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
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
  transition: all 0.3s cubic-bezier(0.2, 1, 0.3, 1);

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
  transition: all 0.3s;
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
.filter-row-v2 {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  margin-top: 18px;
  padding-top: 16px;
  border-top: 1px solid var(--border-light, #f1f5f9);

  .dark-mode & {
    border-top-color: rgba(255, 255, 255, 0.05);
  }
}

.cat-segment-container {
  display: flex;
  position: relative;
  background: #f1f5f9;
  padding: 4px;
  border-radius: 12px;
  height: 42px;
  min-width: 0;
  overflow: hidden;

  .dark-mode & {
    background: rgba(15, 23, 42, 0.5);
  }
}

.active-pill {
  position: absolute;
  top: 4px;
  bottom: 4px;
  left: 0;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  transition: all 0.4s cubic-bezier(0.18, 0.89, 0.32, 1.28);
  z-index: 1;

  .dark-mode & {
    background: #334155;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }
}

.cat-chips-v2 {
  display: flex;
  position: relative;
  z-index: 2;
  overflow-x: auto;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
}

.cat-chip-v2 {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 0 16px;
  border: none;
  background: transparent;
  font-size: 13px;
  font-weight: 600;
  color: #64748b;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.3s;
  height: 100%;

  .chip-icon {
    font-size: 12px;
    opacity: 0.6;
  }

  .chip-count {
    font-size: 10px;
    background: rgba(0, 0, 0, 0.05);
    padding: 1px 6px;
    border-radius: 6px;
    color: #94a3b8;
  }

  &.active {
    color: #3b82f6;
    .chip-icon {
      opacity: 1;
    }
    .chip-count {
      background: rgba(59, 130, 246, 0.1);
      color: #3b82f6;
    }
  }

  .dark-mode & {
    color: #94a3b8;
    &.active {
      color: #60a5fa;
      .chip-count {
        background: rgba(96, 165, 250, 0.1);
        color: #60a5fa;
      }
    }
  }
}

.sort-group-v2 {
  display: flex;
  gap: 8px;
  background: #f1f5f9;
  padding: 4px;
  border-radius: 12px;

  .dark-mode & {
    background: rgba(15, 23, 42, 0.5);
  }
}

.sort-pill {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 0 14px;
  height: 34px;
  font-size: 13px;
  font-weight: 700;
  color: #64748b;
  background: transparent;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;

  .s-icon {
    font-size: 11px;
    opacity: 0.5;
  }

  &:hover {
    color: #3b82f6;
  }

  &.active {
    background: #fff;
    color: #3b82f6;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
    .s-icon {
      opacity: 1;
    }

    .dark-mode & {
      background: #334155;
      color: #60a5fa;
    }
  }
}

/* === 筛选提示 (Premium Style) === */
.filter-status {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
  padding: 12px 20px;
  background: var(--primary-light, #eff6ff);
  border-radius: 16px;
  border: 1px solid var(--primary-light, #dbeafe);

  .status-text {
    font-size: 14px;
    font-weight: 600;
    color: var(--primary, #3b82f6);

    strong {
      font-size: 16px;
      font-weight: 800;
      margin: 0 4px;
    }
  }

  .status-clear {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 16px;
    background: #fff;
    border: 1px solid #dbeafe;
    border-radius: 10px;
    color: #3b82f6;
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.2, 1, 0.3, 1);

    &:hover {
      background: #3b82f6;
      color: #fff;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.25);
    }
  }

  .dark-mode & {
    background: rgba(59, 130, 246, 0.1);
    border-color: rgba(59, 130, 246, 0.2);

    .status-clear {
      background: #1e293b;
      border-color: rgba(255, 255, 255, 0.1);
      color: #60a5fa;

      &:hover {
        background: #3b82f6;
        color: #fff;
      }
    }
  }
}

/* === 精选推荐 === */
.featured-section {
  margin-bottom: 32px;
  opacity: 0;
  &.animate__animated {
    opacity: 1;
  }
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
    padding: 16px 16px 40px;
  }

  .shop-header {
    margin-bottom: 16px;
    &.is-stuck .header-glass-wrapper {
      padding: 12px 16px;
      margin: 0 -4px;
    }
  }

  .header-glass-wrapper {
    padding: 16px;
  }

  .header-main {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .header-actions {
    width: 100%;
    justify-content: space-between;
  }

  .search-box-v2 {
    max-width: none;
    flex: 1;
  }

  .filter-row-v2 {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }

  .cat-segment-container {
    height: 38px;
  }

  .sort-group-v2 {
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

  .product-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }
}

@media (max-width: 480px) {
  .product-grid {
    grid-template-columns: 1fr 1fr;
    gap: 10px;
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
}

/* 减弱动画偏好 */
@media (prefers-reduced-motion: reduce) {
  .featured-section,
  .grid-item,
  .shop-header,
  .filter-status {
    animation: none !important;
    transition: none !important;
    opacity: 1 !important;
  }
}
</style>

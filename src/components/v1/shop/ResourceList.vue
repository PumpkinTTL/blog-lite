<template>
  <div class="shop-page" :class="{ 'dark-mode': isDark }">
    <!-- 顶部栏 -->
    <header class="shop-header" :class="{ 'animate__animated animate__fadeIn': animated }">
      <div class="header-main">
        <div class="header-left">
          <div class="brand-badge">
            <font-awesome-icon icon="store" />
          </div>
          <div class="brand-text">
            <h1 class="page-title">资源商城</h1>
            <p class="page-subtitle">精选互联网数字资源，一键获取</p>
          </div>
        </div>
        <div class="header-actions">
          <div class="search-box">
            <font-awesome-icon icon="magnifying-glass" class="search-icon" />
            <input
              type="text"
              v-model="searchKeyword"
              placeholder="搜索资源..."
              class="search-input"
            />
            <button v-if="searchKeyword" class="search-clear" @click="searchKeyword = ''">
              <font-awesome-icon icon="xmark" />
            </button>
          </div>
          <button class="cart-btn">
            <font-awesome-icon icon="bag-shopping" />
            <span v-if="cartCount > 0" class="cart-badge">{{ cartCount }}</span>
          </button>
        </div>
      </div>
    </header>

    <!-- 分类筛选 + 排序 -->
    <nav class="filter-nav" :class="{ 'animate__animated animate__fadeInUp': animated }" style="animation-delay: 0.1s">
      <div class="filter-row">
        <div class="cat-chips">
          <button
            v-for="cat in categories"
            :key="cat.value"
            class="cat-chip"
            :class="{ active: activeCategory === cat.value }"
            @click="activeCategory = cat.value"
          >
            <font-awesome-icon v-if="cat.icon" :icon="cat.icon" class="chip-icon" />
            <span>{{ cat.label }}</span>
            <span v-if="cat.value !== 'all'" class="chip-count">{{ getCategoryCount(cat.value) }}</span>
          </button>
        </div>
        <div class="sort-group">
          <button
            v-for="s in sortOptions"
            :key="s.value"
            class="sort-btn"
            :class="{ active: activeSort === s.value }"
            @click="activeSort = s.value"
          >
            {{ s.label }}
          </button>
        </div>
      </div>
    </nav>

    <!-- 筛选提示 -->
    <div v-if="activeCategory !== 'all' || searchKeyword" class="filter-status" :class="{ 'animate__animated animate__fadeIn': animated }">
      <span class="status-text">
        找到 <strong>{{ filteredResources.length }}</strong> 个资源
      </span>
      <button class="status-clear" @click="resetFilters">
        <font-awesome-icon icon="rotate-left" />
        清除筛选
      </button>
    </div>

    <!-- 精选推荐 -->
    <section v-if="activeCategory === 'all' && !searchKeyword" class="featured-section" :class="{ 'animate__animated animate__fadeInUp': animated }" style="animation-delay: 0.2s">
      <div class="featured-label">
        <font-awesome-icon icon="bolt" class="label-icon" />
        精选推荐
      </div>
      <div class="featured-grid">
        <div class="featured-main" @click="handleCardClick(featuredMain)">
          <div class="fm-cover">
            <img :src="featuredMain.cover" :alt="featuredMain.title" loading="lazy" />
          </div>
          <div class="fm-info">
            <span class="fm-cat" :style="{ color: getCategoryColor(featuredMain.category) }">
              {{ getCategoryLabel(featuredMain.category) }}
            </span>
            <h2 class="fm-title">{{ featuredMain.title }}</h2>
            <p class="fm-desc">{{ featuredMain.description }}</p>
            <div class="fm-bottom">
              <span class="fm-price"><span class="yen">¥</span>{{ featuredMain.price }}</span>
              <span class="fm-sales">{{ featuredMain.sales }} 人已购</span>
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
            </div>
            <div class="fs-info">
              <h3 class="fs-title">{{ item.title }}</h3>
              <div class="fs-bottom">
                <span class="fs-price"><span class="yen">¥</span>{{ item.price }}</span>
                <span class="fs-cat" :style="{ color: getCategoryColor(item.category) }">
                  {{ getCategoryLabel(item.category) }}
                </span>
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
import { ref, computed } from 'vue'
import { useThemeStore } from '@/stores/theme'
import ResourceCard, { type Resource } from './ResourceCard.vue'

const themeStore = useThemeStore()
const isDark = computed(() => themeStore.isDark)

defineProps<{ animated?: boolean }>()

// 互联网数字资源分类
const categories = [
  { label: '全部', value: 'all', icon: 'border-all' },
  { label: 'AI 账号', value: 'ai_account', icon: 'robot' },
  { label: '开发工具', value: 'dev_tool', icon: 'code' },
  { label: '会员订阅', value: 'subscription', icon: 'crown' },
  { label: '学习资源', value: 'course', icon: 'graduation-cap' },
  { label: '设计素材', value: 'design', icon: 'palette' },
]

const sortOptions = [
  { label: '热门', value: 'hot' },
  { label: '最新', value: 'new' },
  { label: '价格', value: 'price' },
]

const activeCategory = ref('all')
const activeSort = ref('hot')
const searchKeyword = ref('')
const cartCount = ref(0)

// 互联网数字资源数据
const resources = ref<Resource[]>([
  {
    id: 1,
    title: 'ChatGPT Team 共享账号',
    description: 'OpenAI 官方 Team 计划，GPT-4o 无限使用，支持 DALL-E 和高级数据分析',
    cover: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=380&fit=crop',
    price: 49,
    sales: 3842,
    rating: 4.9,
    isHot: true,
    category: 'ai_account',
    author: 'AI 精选',
    authorAvatar: 'https://i.pravatar.cc/150?u=ai1',
  },
  {
    id: 2,
    title: 'Claude Code Pro 账号',
    description: 'Anthropic Claude 旗舰模型，长文本理解能力超强，支持 200K 上下文窗口',
    cover: 'https://images.unsplash.com/photo-1684163761883-8a2e1d86f7e5?w=600&h=380&fit=crop',
    price: 59,
    sales: 2156,
    rating: 4.8,
    isHot: true,
    category: 'ai_account',
    author: '极客工坊',
    authorAvatar: 'https://i.pravatar.cc/150?u=ai2',
  },
  {
    id: 3,
    title: 'GitHub Copilot 年度订阅',
    description: 'AI 结对编程助手，支持 VS Code / JetBrains，智能代码补全与生成',
    cover: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=600&h=380&fit=crop',
    price: 89,
    sales: 5670,
    rating: 4.9,
    isHot: true,
    category: 'dev_tool',
    author: 'Dev Tools',
    authorAvatar: 'https://i.pravatar.cc/150?u=dev1',
  },
  {
    id: 4,
    title: 'Cursor Pro 共享席位',
    description: 'AI 原生代码编辑器，内置 GPT-4 / Claude 3.5，智能重构与对话式编程',
    cover: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=380&fit=crop',
    price: 39,
    sales: 4230,
    rating: 4.8,
    category: 'dev_tool',
    author: '码上飞',
    authorAvatar: 'https://i.pravatar.cc/150?u=dev2',
  },
  {
    id: 5,
    title: 'JetBrains 全家桶年度授权',
    description: 'IntelliJ IDEA / WebStorm / GoLand 等全系列 IDE 一站式授权',
    cover: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&h=380&fit=crop',
    price: 199,
    sales: 1890,
    rating: 4.9,
    isHot: true,
    category: 'subscription',
    author: '工具箱',
    authorAvatar: 'https://i.pravatar.cc/150?u=sub1',
  },
  {
    id: 6,
    title: 'Midjourney 标准会员',
    description: 'AI 绘画利器，15h 快速模式 + 无限放松模式，创意设计必备',
    cover: 'https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=600&h=380&fit=crop',
    price: 69,
    sales: 3120,
    rating: 4.7,
    category: 'ai_account',
    author: '创意社',
    authorAvatar: 'https://i.pravatar.cc/150?u=ai3',
  },
  {
    id: 7,
    title: 'Notion AI 团队版',
    description: 'All-in-One 协作平台 + AI 写作助手，团队知识库最佳选择',
    cover: 'https://images.unsplash.com/photo-1517842645767-c639042777db?w=600&h=380&fit=crop',
    price: 35,
    sales: 6540,
    rating: 4.8,
    category: 'subscription',
    author: '效率达人',
    authorAvatar: 'https://i.pravatar.cc/150?u=sub2',
  },
  {
    id: 8,
    title: 'Figma 企业版席位',
    description: '专业 UI 设计工具，Dev Mode + 变量系统 + 高级原型交互',
    cover: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=380&fit=crop',
    price: 79,
    sales: 2870,
    rating: 4.8,
    category: 'design',
    author: 'Design Lab',
    authorAvatar: 'https://i.pravatar.cc/150?u=des1',
  },
  {
    id: 9,
    title: 'Windsurf Pro 编辑器',
    description: 'Codeium 出品 AI 编辑器，Cascade 智能流式编程，下一代开发体验',
    cover: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=600&h=380&fit=crop',
    price: 45,
    sales: 1560,
    rating: 4.7,
    category: 'dev_tool',
    author: '新工具速递',
    authorAvatar: 'https://i.pravatar.cc/150?u=dev3',
  },
  {
    id: 10,
    title: '全栈开发进阶课程',
    description: '从零到一构建 SaaS 产品，Vue3 + Node.js + 云部署，实战项目驱动',
    cover: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=380&fit=crop',
    price: 129,
    sales: 8900,
    rating: 4.9,
    isHot: true,
    category: 'course',
    author: '架构之道',
    authorAvatar: 'https://i.pravatar.cc/150?u=edu1',
  },
  {
    id: 11,
    title: 'Perplexity Pro 账号',
    description: 'AI 搜索引擎 Pro 版，GPT-4 / Claude 3 双引擎，学术研究利器',
    cover: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&h=380&fit=crop',
    price: 39,
    sales: 2340,
    rating: 4.7,
    category: 'ai_account',
    author: 'AI 精选',
    authorAvatar: 'https://i.pravatar.cc/150?u=ai4',
  },
  {
    id: 12,
    title: 'Figma UI 组件库大合集',
    description: '5000+ 精选组件，涵盖 Dashboard / 电商 / 社交等 12 个行业模板',
    cover: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=600&h=380&fit=crop',
    price: 59,
    sales: 4120,
    rating: 4.8,
    category: 'design',
    author: 'Design Lab',
    authorAvatar: 'https://i.pravatar.cc/150?u=des2',
  },
])

const filteredResources = computed(() => {
  let result = resources.value
  if (activeCategory.value !== 'all') {
    result = result.filter(r => r.category === activeCategory.value)
  }
  if (searchKeyword.value) {
    const kw = searchKeyword.value.toLowerCase()
    result = result.filter(r => r.title.toLowerCase().includes(kw) || r.description.toLowerCase().includes(kw))
  }
  if (activeSort.value === 'hot') result = [...result].sort((a, b) => b.sales - a.sales)
  else if (activeSort.value === 'price') result = [...result].sort((a, b) => a.price - b.price)
  else if (activeSort.value === 'new') result = [...result].sort((a, b) => b.id - a.id)
  return result
})

const featuredMain = computed(() => resources.value.find(r => r.isHot) || resources.value[0])
const featuredSide = computed(() => resources.value.filter(r => r.isHot && r.id !== featuredMain.value.id).slice(0, 2))

const getCategoryLabel = (cat: string) => {
  const m: Record<string, string> = {
    ai_account: 'AI 账号',
    dev_tool: '开发工具',
    subscription: '会员订阅',
    course: '学习资源',
    design: '设计素材',
  }
  return m[cat] || cat
}

const getCategoryColor = (cat: string) => {
  const m: Record<string, string> = {
    ai_account: '#8b5cf6',
    dev_tool: '#3b82f6',
    subscription: '#f59e0b',
    course: '#10b981',
    design: '#ec4899',
  }
  return m[cat] || '#3b82f6'
}

const getCategoryCount = (cat: string) => resources.value.filter(r => r.category === cat).length

const handleCardClick = (item: Resource) => {
  console.log('Detail:', item.id)
}

const resetFilters = () => {
  activeCategory.value = 'all'
  searchKeyword.value = ''
}
</script>

<style scoped lang="scss">
.shop-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px 24px 60px;
}

/* === 顶部栏 === */
.shop-header {
  padding: 28px 32px 24px;
  margin-bottom: 20px;
  background: var(--surface, #ffffff);
  border: 1px solid var(--border-light, #f3f4f6);
  border-radius: 16px;
  opacity: 0;
  &.animate__animated { opacity: 1; }

  .dark-mode & {
    background: var(--surface, #1e293b);
    border-color: rgba(51, 65, 85, 0.3);
  }
}

.header-main {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 14px;
  flex-shrink: 0;
}

.brand-badge {
  width: 42px;
  height: 42px;
  background: var(--primary-light, #dbeafe);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  color: var(--primary, #3b82f6);
  flex-shrink: 0;

  .dark-mode & {
    background: rgba(59, 130, 246, 0.15);
  }
}

.brand-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.page-title {
  margin: 0;
  font-size: 22px;
  font-weight: 800;
  color: var(--text, #1f2937);
  letter-spacing: -0.3px;
  line-height: 1.2;

  .dark-mode & { color: var(--text, #f1f5f9); }
}

.page-subtitle {
  margin: 0;
  font-size: 13px;
  color: var(--text-tertiary, #9ca3af);
  font-weight: 500;

  .dark-mode & { color: #64748b; }
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}

.search-box {
  position: relative;
  width: 260px;

  .search-icon {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 13px;
    color: var(--text-tertiary, #9ca3af);
    pointer-events: none;
  }

  .search-input {
    width: 100%;
    height: 38px;
    padding: 0 34px 0 36px;
    border: 1px solid var(--border, #e5e7eb);
    border-radius: 8px;
    font-size: 13px;
    color: var(--text, #1f2937);
    background: var(--bg-secondary, #fff);
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;

    &::placeholder { color: var(--text-tertiary, #9ca3af); }

    &:focus {
      border-color: var(--primary, #3b82f6);
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    .dark-mode & {
      background: rgba(30, 41, 59, 0.6);
      border-color: rgba(51, 65, 85, 0.5);
      color: #e2e8f0;
    }
  }

  .search-clear {
    position: absolute;
    right: 8px;
    top: 50%;
    transform: translateY(-50%);
    width: 22px;
    height: 22px;
    border: none;
    background: var(--bg-secondary, #f9fafb);
    border-radius: 50%;
    color: var(--text-tertiary, #9ca3af);
    font-size: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.15s;

    &:hover { background: var(--border, #e5e7eb); color: var(--text-secondary, #6b7280); }
    .dark-mode & { background: rgba(51, 65, 85, 0.5); }
  }
}

.cart-btn {
  position: relative;
  width: 38px;
  height: 38px;
  border: 1px solid var(--border, #e5e7eb);
  background: var(--bg-secondary, #fff);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary, #64748b);
  font-size: 15px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    color: #3b82f6;
    border-color: #3b82f6;
    background: rgba(59, 130, 246, 0.04);
  }

  .dark-mode & {
    background: rgba(30, 41, 59, 0.6);
    border-color: rgba(71, 85, 105, 0.3);
    color: #94a3b8;
  }
}

.cart-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  min-width: 16px;
  height: 16px;
  background: #f97316;
  color: #fff;
  border-radius: 8px;
  font-size: 9px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
  border: 2px solid var(--bg);
}

/* === 分类筛选 === */
.filter-nav {
  padding: 16px 24px;
  background: var(--surface, #ffffff);
  border: 1px solid var(--border-light, #e2e8f0);
  border-radius: 12px;
  margin-bottom: 24px;
  opacity: 0;
  &.animate__animated { opacity: 1; }

  .dark-mode & {
    background: var(--surface, #1e293b);
    border-color: rgba(51, 65, 85, 0.3);
  }
}

.filter-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.cat-chips {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  scrollbar-width: none;
  -webkit-overflow-scrolling: touch;
  &::-webkit-scrollbar { display: none; }
}

.cat-chip {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 7px 14px;
  border: 1px solid var(--border-light, #e2e8f0);
  background: var(--surface, #ffffff);
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
  color: var(--text-secondary, #64748b);
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s ease;

  .chip-icon { font-size: 11px; opacity: 0.6; }

  .chip-count {
    font-size: 10px;
    font-weight: 600;
    background: var(--bg-secondary, #f1f5f9);
    padding: 1px 6px;
    border-radius: 8px;
    color: var(--text-tertiary, #94a3b8);
  }

  &:hover {
    border-color: var(--border-hover, #cbd5e1);
    color: var(--text, #0f172a);
  }

  &.active {
    background: #3b82f6;
    border-color: #3b82f6;
    color: #fff;

    .chip-icon { opacity: 1; }
    .chip-count { background: rgba(255, 255, 255, 0.2); color: #fff; }
  }

  .dark-mode & {
    background: rgba(30, 41, 59, 0.6);
    border-color: rgba(71, 85, 105, 0.25);
    color: #94a3b8;

    .chip-count { background: rgba(51, 65, 85, 0.5); }
    &:hover { border-color: rgba(100, 116, 139, 0.4); color: #e2e8f0; }

    &.active { background: #3b82f6; border-color: #3b82f6; color: #fff; }
  }
}

.sort-group {
  display: flex;
  gap: 4px;
  flex-shrink: 0;
}

.sort-btn {
  padding: 5px 12px;
  font-size: 12px;
  font-weight: 500;
  color: var(--text-tertiary, #94a3b8);
  background: none;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s;

  &:hover { color: var(--text-secondary, #475569); }

  &.active {
    color: var(--text, #0f172a);
    background: var(--bg-secondary, #f1f5f9);
    font-weight: 600;

    .dark-mode & { color: #e2e8f0; background: rgba(51, 65, 85, 0.4); }
  }
}

/* === 筛选提示 === */
.filter-status {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;

  .status-text {
    font-size: 14px;
    color: var(--text-secondary, #64748b);

    strong { color: var(--text, #0f172a); font-weight: 700; }
    .dark-mode & strong { color: #f1f5f9; }
  }
}

.status-clear {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 5px 12px;
  background: none;
  border: 1px solid var(--border-light, #e2e8f0);
  border-radius: 8px;
  font-size: 12px;
  font-weight: 500;
  color: var(--text-secondary, #64748b);
  cursor: pointer;
  transition: all 0.15s;

  &:hover { border-color: #3b82f6; color: #3b82f6; }
  .dark-mode & { border-color: rgba(71, 85, 105, 0.3); }
}

/* === 精选推荐 === */
.featured-section {
  margin-bottom: 32px;
  opacity: 0;
  &.animate__animated { opacity: 1; }
}

.featured-label {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 700;
  color: var(--text, #0f172a);
  margin-bottom: 14px;

  .label-icon { color: #f97316; font-size: 13px; }
  .dark-mode & { color: #f1f5f9; }
}

.featured-grid {
  display: grid;
  grid-template-columns: 1.3fr 1fr;
  gap: 14px;
}

.featured-main {
  display: grid;
  grid-template-columns: 1fr 1fr;
  border-radius: 14px;
  overflow: hidden;
  background: var(--surface, #ffffff);
  border: 1px solid var(--border-light, #e2e8f0);
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 32px -8px rgba(15, 23, 42, 0.1);
    border-color: var(--border-hover, #cbd5e1);
    .fm-cover img { transform: scale(1.04); }
  }

  .dark-mode & {
    background: rgba(30, 41, 59, 0.6);
    border-color: rgba(71, 85, 105, 0.25);
    &:hover { border-color: rgba(100, 116, 139, 0.4); box-shadow: 0 12px 32px -8px rgba(0, 0, 0, 0.3); }
  }
}

.fm-cover {
  overflow: hidden;
  min-height: 200px;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  }
}

.fm-info {
  padding: 24px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.fm-cat {
  font-size: 11px;
  font-weight: 700;
  margin-bottom: 8px;
}

.fm-title {
  margin: 0 0 8px;
  font-size: 18px;
  font-weight: 700;
  color: var(--text, #0f172a);
  line-height: 1.35;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;

  .dark-mode & { color: #f1f5f9; }
}

.fm-desc {
  margin: 0 0 16px;
  font-size: 13px;
  color: var(--text-secondary, #64748b);
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;

  .dark-mode & { color: #94a3b8; }
}

.fm-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
}

.fm-price {
  font-size: 22px;
  font-weight: 800;
  color: var(--text, #0f172a);
  letter-spacing: -0.5px;

  .yen { font-size: 13px; font-weight: 700; opacity: 0.5; }
  .dark-mode & { color: #f1f5f9; }
}

.fm-sales {
  font-size: 11px;
  color: var(--text-tertiary, #94a3b8);
  font-weight: 500;
}

/* 精选侧边小卡 */
.featured-side {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.featured-sm {
  display: grid;
  grid-template-columns: 1.1fr 1fr;
  flex: 1;
  border-radius: 14px;
  overflow: hidden;
  background: var(--surface, #ffffff);
  border: 1px solid var(--border-light, #e2e8f0);
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 32px -8px rgba(15, 23, 42, 0.1);
    border-color: var(--border-hover, #cbd5e1);
    .fs-cover img { transform: scale(1.04); }
  }

  .dark-mode & {
    background: rgba(30, 41, 59, 0.6);
    border-color: rgba(71, 85, 105, 0.25);
    &:hover { border-color: rgba(100, 116, 139, 0.4); box-shadow: 0 12px 32px -8px rgba(0, 0, 0, 0.3); }
  }
}

.fs-cover {
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  }
}

.fs-info {
  padding: 16px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.fs-title {
  margin: 0 0 10px;
  font-size: 14px;
  font-weight: 700;
  color: var(--text, #0f172a);
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;

  .dark-mode & { color: #f1f5f9; }
}

.fs-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.fs-price {
  font-size: 17px;
  font-weight: 800;
  color: var(--text, #0f172a);
  letter-spacing: -0.3px;

  .yen { font-size: 11px; font-weight: 700; opacity: 0.5; }
  .dark-mode & { color: #f1f5f9; }
}

.fs-cat {
  font-size: 11px;
  font-weight: 600;
}

/* === 商品网格 === */
.grid-section {
  padding: 0;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.grid-item {
  opacity: 0;
  &.animate__animated { opacity: 1; }
}

/* === 空状态 === */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 60px 0;
}

.empty-icon {
  width: 56px;
  height: 56px;
  background: var(--bg-secondary, #f1f5f9);
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  color: var(--text-tertiary, #94a3b8);
  margin-bottom: 14px;

  .dark-mode & { background: rgba(51, 65, 85, 0.4); }
}

.empty-text {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-secondary, #64748b);
  margin: 0 0 16px;
}

.empty-btn {
  padding: 8px 20px;
  background: #3b82f6;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;

  &:hover { background: #2563eb; }
}

/* === 响应式 === */
@media (max-width: 1024px) {
  .product-grid { grid-template-columns: repeat(3, 1fr); }
  .featured-grid { grid-template-columns: 1fr; }
}

@media (max-width: 768px) {
  .shop-page { padding: 0 16px 40px; }

  .shop-header {
    padding: 20px 16px 16px;
    border-radius: 12px;
  }

  .header-main {
    flex-wrap: wrap;
    gap: 12px;
  }

  .header-actions {
    width: 100%;
    order: 3;
  }

  .search-box {
    flex: 1;
    width: auto;
    min-width: 0;
  }

  .filter-row {
    flex-wrap: wrap;
    gap: 10px;
  }

  .cat-chips {
    padding-bottom: 4px;
  }

  .featured-grid { grid-template-columns: 1fr; }
  .featured-main { grid-template-columns: 1fr; }
  .fm-cover { min-height: 160px; }
  .fm-info { padding: 16px; }
  .fm-title { font-size: 16px; }
  .fm-price { font-size: 18px; }

  .featured-sm { grid-template-columns: 1.1fr 1fr; }
  .fs-cover { min-height: 100px; }

  .product-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
  .page-title { font-size: 19px; }
}

@media (max-width: 480px) {
  .shop-page { padding: 0 12px 32px; }

  .shop-header {
    padding: 16px 12px 12px;
    border-radius: 10px;
  }

  .header-left { gap: 10px; }
  .brand-badge { width: 36px; height: 36px; font-size: 15px; border-radius: 10px; }
  .page-title { font-size: 17px; }
  .page-subtitle { font-size: 12px; }

  .cat-chip {
    padding: 6px 10px;
    font-size: 12px;
  }

  .featured-sm { grid-template-columns: 1fr; }
  .fs-cover { min-height: 120px; }
  .fs-info { padding: 12px; }

  .product-grid { grid-template-columns: 1fr 1fr; gap: 10px; }
  .sort-group { display: none; }

  .empty-state { padding: 40px 0; }
}

/* 减弱动画偏好 */
@media (prefers-reduced-motion: reduce) {
  .featured-section, .grid-item, .filter-nav,
  .shop-header, .filter-status {
    animation: none !important;
    transition: none !important;
    opacity: 1 !important;
  }
}
</style>

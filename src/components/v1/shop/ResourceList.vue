<template>
  <div class="shop-wrapper">
    <!-- Integrated Control Center - Flattened Dashboard Style -->
    <div class="shop-ctrl-center">
      <div class="ctrl-inner">
        <!-- Top Row: Navigation & Info -->
        <div class="info-row">
          <div class="left-box">
            <div class="breadcrumb-mini">
              <span class="c">首页</span>
              <font-awesome-icon icon="chevron-right" class="s" />
              <span class="c a">资源商城</span>
            </div>
            <h1 class="shop-title">精品资源库</h1>
          </div>
          
          <div class="right-box">
            <div class="live-pill">
              <span class="glow-dot"></span>
              <span class="count">2,481 件资源在线</span>
            </div>
          </div>
        </div>

        <!-- Bottom Row: Integrated Filter System -->
        <div class="filter-row">
          <nav class="cat-list">
            <button
              v-for="cat in categories"
              :key="cat.value"
              class="cat-item"
              :class="{ active: activeCategory === cat.value }"
              @click="activeCategory = cat.value"
            >
              {{ cat.label }}
            </button>
          </nav>
          
          <div class="actions-group">
            <div class="search-refined">
              <font-awesome-icon icon="magnifying-glass" class="si" />
              <input 
                v-model="searchKeyword" 
                type="text" 
                placeholder="搜索资源..." 
              />
            </div>
            <div class="tool-sep"></div>
            <div class="mini-ops">
              <button class="op-btn" title="筛选">
                <font-awesome-icon icon="sliders" />
              </button>
              <button class="op-btn cart-trigger" title="购物车">
                <font-awesome-icon icon="basket-shopping" />
                <span v-if="cartCount > 0" class="dot-count">{{ cartCount }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- High-Density Grid Area -->
    <main class="grid-container">
      <div v-if="filteredResources.length > 0" class="dense-grid">
        <ResourceCard
          v-for="item in filteredResources"
          :key="item.id"
          :resource="item"
          @click="handleCardClick(item)"
        />
      </div>
      
      <!-- Refined Empty State -->
      <div v-else class="empty-state">
        <div class="empty-visual">
          <div class="circle-box">
            <font-awesome-icon icon="magnifying-glass" />
          </div>
        </div>
        <p class="empty-text">未匹配到相关资源</p>
        <button class="reset-btn" @click="resetFilters">重置筛选</button>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import ResourceCard from './ResourceCard.vue'

interface Resource {
  id: number
  title: string
  description: string
  cover: string
  price: number
  sales: number
  rating: number
  isHot?: boolean
  category: string
  author: string
  authorAvatar: string
}

const categories = [
  { label: '全部', value: 'all' },
  { label: '网站模板', value: 'template' },
  { label: 'UI 组件库', value: 'component' },
  { label: '开发插件', value: 'tool' },
  { label: '视频教程', value: 'tutorial' }
]

const activeCategory = ref('all')
const searchKeyword = ref('')
const cartCount = ref(3)

const resources = ref<Resource[]>([
  {
    id: 1, title: 'Vue3 Admin Pro', description: '企业级中后台管理系统模板，内置完整权限管理、多主题切换、国际化支持及丰富的常用组件。', cover: 'https://picsum.photos/600/400?random=1',
    price: 129, sales: 2340, rating: 4.9, isHot: true, category: 'template',
    author: '前端小王子', authorAvatar: 'https://i.pravatar.cc/150?u=1'
  },
  {
    id: 2, title: 'React Dashboard', description: '现代化数据仪表盘，基于 Tailwind CSS 构建，支持暗黑模式和响应式布局，内置可视化图表。', cover: 'https://picsum.photos/600/400?random=2',
    price: 159, sales: 1890, rating: 4.8, category: 'template',
    author: 'React达人', authorAvatar: 'https://i.pravatar.cc/150?u=2'
  },
  {
    id: 3, title: 'Mini Program UI', description: '微信小程序高性能组件库，包含 50+ 个基础及业务组件，极致的用户体验与流畅度。', cover: 'https://picsum.photos/600/400?random=3',
    price: 89, sales: 5670, rating: 4.9, isHot: true, category: 'component',
    author: '小程序专家', authorAvatar: 'https://i.pravatar.cc/150?u=3'
  },
  {
    id: 4, title: 'API Mock Server', description: '零配置 Mock 服务工具，支持 RESTful 设计哲学与 WebSocket 协议，前端解耦开发的利器。', cover: 'https://picsum.photos/600/400?random=4',
    price: 49, sales: 890, rating: 4.7, category: 'tool',
    author: '后端大佬', authorAvatar: 'https://i.pravatar.cc/150?u=4'
  },
  {
    id: 5, title: '前端面试通关指南', description: '涵盖 800+ 核心面试真题详解，结合大厂面试官视角，助你快速斩获心仪 Offer。', cover: 'https://picsum.photos/600/400?random=5',
    price: 69, sales: 12500, rating: 4.9, isHot: true, category: 'tutorial',
    author: '面经收割机', authorAvatar: 'https://i.pravatar.cc/150?u=5'
  },
  {
    id: 6, title: 'Figma Design System', description: '完整的 UI 设计系统，包含 300+ 响应式组件、风格指南、图标库及移动端适配规范。', cover: 'https://picsum.photos/600/400?random=6',
    price: 99, sales: 2150, rating: 4.8, category: 'template',
    author: '设计师阿明', authorAvatar: 'https://i.pravatar.cc/150?u=6'
  }
])

const filteredResources = computed(() => {
  let result = resources.value
  if (activeCategory.value !== 'all') {
    result = result.filter(r => r.category === activeCategory.value)
  }
  if (searchKeyword.value) {
    const kw = searchKeyword.value.toLowerCase()
    result = result.filter(r => 
      r.title.toLowerCase().includes(kw) || 
      r.description.toLowerCase().includes(kw)
    )
  }
  return result
})

const handleCardClick = (item: Resource) => {
  console.log('Detail:', item.id)
}

const resetFilters = () => {
  activeCategory.value = 'all'
  searchKeyword.value = ''
}
</script>

<style scoped lang="scss">
.shop-wrapper {
  max-width: 1400px;
  margin: 0 auto;
  padding: 40px 20px 80px;
}

/* Integrated Control Center - Flat Theme Unified */
.shop-ctrl-center {
  position: sticky;
  top: 10px;
  z-index: 1000;
  margin: 0 0 40px;
  padding: 24px 28px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-md);
}

.breadcrumb-mini {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  color: var(--text-tertiary);
  font-weight: 700;
  margin-bottom: 8px;

  .s { font-size: 8px; opacity: 0.5; }
  .a { color: var(--primary); }
}

.shop-title {
  font-size: 26px;
  font-weight: 950;
  color: var(--text);
  margin: 0;
  letter-spacing: -0.04em;
}

/* Row Styling */
.info-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 24px;
}

.live-pill {
  font-size: 11px;
  font-weight: 700;
  color: var(--text-secondary);
  background: var(--bg);
  padding: 6px 14px;
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  gap: 8px;
  border: 1px solid var(--border-light);

  .glow-dot {
    width: 6px;
    height: 6px;
    background: var(--success);
    border-radius: 50%;
    box-shadow: 0 0 10px var(--success-light);
  }
}

.filter-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

.cat-list {
  display: flex;
  gap: 8px;
  background: var(--bg);
  padding: 4px;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-light);
}

.cat-item {
  padding: 7px 16px;
  font-size: 12px;
  font-weight: 800;
  color: var(--text-secondary);
  background: transparent;
  border: none;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all var(--transition);

  &:hover { color: var(--primary); }
  &.active {
    background: var(--surface);
    color: var(--primary);
    box-shadow: var(--shadow-sm);
  }
}

.actions-group {
  display: flex;
  align-items: center;
  gap: 12px;
}

.search-refined {
  position: relative;
  .si {
    position: absolute;
    left: 14px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 13px;
    color: var(--text-tertiary);
  }
  input {
    width: 200px;
    height: 40px;
    padding-left: 38px;
    font-size: 12px;
    font-weight: 600;
    color: var(--text);
    background: var(--bg);
    border: 1px solid var(--border-light);
    border-radius: var(--radius-md);
    transition: all var(--transition);
    &:focus {
      outline: none;
      width: 280px;
      background: var(--surface);
      border-color: var(--primary);
      box-shadow: 0 0 0 3px var(--primary-light);
    }
  }
}

.tool-sep { width: 1px; height: 24px; background: var(--border-light); }

.mini-ops { display: flex; gap: 8px; }

.op-btn {
  position: relative;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg);
  border: 1px solid var(--border-light);
  color: var(--text-secondary);
  font-size: 16px;
  cursor: pointer;
  border-radius: var(--radius-md);
  transition: all var(--transition);
  &:hover {
    background: var(--surface);
    color: var(--primary);
    border-color: var(--primary);
  }

  .dot-count {
    position: absolute;
    top: -4px;
    right: -4px;
    min-width: 18px;
    height: 18px;
    background: var(--error);
    color: white;
    border-radius: 50%;
    font-size: 10px;
    font-weight: 900;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px solid var(--surface);
  }
}

/* Grid Area */
.dense-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 32px;
}

/* Empty State */
.empty-state {
  padding: 120px 0;
  text-align: center;
  .circle-box {
    width: 64px;
    height: 64px;
    background: var(--bg);
    border-radius: 50%;
    margin: 0 auto 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-tertiary);
    font-size: 24px;
  }
  .empty-text { font-size: 16px; color: var(--text-secondary); margin-bottom: 24px; font-weight: 600; }
  .reset-btn {
    background: var(--primary);
    border: none;
    color: white;
    padding: 10px 24px;
    border-radius: var(--radius-md);
    font-size: 13px;
    font-weight: 800;
    cursor: pointer;
    &:hover { background: var(--primary-hover); transform: translateY(-1px); }
  }
}

@media (max-width: 850px) {
  .shop-ctrl-center { padding: 18px 20px; margin-bottom: 25px; top: 0; border-radius: 0; margin: 0 -20px 25px; border-left: none; border-right: none; }
  .info-row { flex-direction: column; align-items: flex-start; gap: 12px; margin-bottom: 16px; }
  .filter-row { flex-direction: column; align-items: stretch; gap: 16px; }
  .cat-list { overflow-x: auto; padding: 4px; &::-webkit-scrollbar { display: none; } }
  .actions-group { justify-content: space-between; }
  .search-refined { flex: 1; }
  .search-refined input { width: 100%; &:focus { width: 100%; } }
  .dense-grid { grid-template-columns: repeat(2, 1fr); gap: 16px; }
}
</style>
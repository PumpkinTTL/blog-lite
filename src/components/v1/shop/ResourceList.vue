<template>
  <div class="shop-wrapper">
    <!-- Sophisticated Mini Header -->
    <header class="mini-header">
      <div class="breadcrumb">
        <span class="crumb">首页</span>
        <font-awesome-icon icon="chevron-right" class="sep" />
        <span class="crumb active">资源商城</span>
      </div>
      <div class="main-info">
        <h1 class="title">精品资源库</h1>
        <div class="live-stats">
          <span class="dot"></span>
          2,481 件优质资源已上线
        </div>
      </div>
    </header>

    <!-- Ultra-Thin Sticky Filter Bar -->
    <div class="filter-container">
      <div class="filter-inner">
        <nav class="cat-nav">
          <button
            v-for="cat in categories"
            :key="cat.value"
            class="cat-link"
            :class="{ active: activeCategory === cat.value }"
            @click="activeCategory = cat.value"
          >
            {{ cat.label }}
          </button>
        </nav>
        
        <div class="util-box">
          <div class="mini-search">
            <font-awesome-icon icon="magnifying-glass" class="s-icon" />
            <input 
              v-model="searchKeyword" 
              type="text" 
              placeholder="搜索精密资源..." 
            />
          </div>
          <div class="v-divider"></div>
          <div class="mini-tools">
            <button class="icon-btn" title="筛选器">
              <font-awesome-icon icon="sliders" />
            </button>
            <button class="icon-btn cart-trigger" title="购物车">
              <font-awesome-icon icon="basket-shopping" />
              <span v-if="cartCount > 0" class="badge-dot">{{ cartCount }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- High-Density Grid -->
    <main class="grid-main">
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
        <p class="empty-text">未匹配到相关精密资源</p>
        <button class="text-btn" @click="resetFilters">重置所有筛选器</button>
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
  max-width: 1280px;
  margin: 0 auto;
  padding: 30px 20px 60px;
}

/* Mini Header */
.mini-header {
  margin-bottom: 30px;

  .breadcrumb {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 11px;
    color: #94a3b8;
    font-weight: 500;
    margin-bottom: 12px;

    .sep { font-size: 8px; color: #cbd5e1; }
    .active { color: #64748b; }
  }

  .main-info {
    display: flex;
    align-items: baseline;
    gap: 16px;

    .title {
      font-size: 20px;
      font-weight: 800;
      color: #1e293b;
      margin: 0;
    }

    .live-stats {
      font-size: 11px;
      color: #94a3b8;
      display: flex;
      align-items: center;
      gap: 6px;
      font-weight: 600;

      .dot {
        width: 6px;
        height: 6px;
        background: #10b981;
        border-radius: 50%;
        box-shadow: 0 0 10px rgba(16, 185, 129, 0.4);
      }
    }
  }
}

/* Filter Bar */
.filter-container {
  position: sticky;
  top: 15px;
  z-index: 100;
  margin-bottom: 30px;
}

.filter-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 10px 8px 16px;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(25px);
  border: 1px solid rgba(0, 0, 0, 0.04);
  border-radius: 12px;
  box-shadow: 0 4px 15px -2px rgba(0, 0, 0, 0.03);
}

.cat-nav {
  display: flex;
  gap: 6px;
}

.cat-link {
  padding: 6px 12px;
  font-size: 12px;
  font-weight: 600;
  color: #64748b;
  background: transparent;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover { background: #f8fafc; color: #1e293b; }
  &.active {
    background: #1e293b;
    color: white;
    box-shadow: 0 4px 10px rgba(0,0,0,0.1);
  }
}

.util-box {
  display: flex;
  align-items: center;
  gap: 12px;
}

.mini-search {
  position: relative;
  
  .s-icon {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 12px;
    color: #94a3b8;
  }
  
  input {
    width: 180px;
    height: 32px;
    padding: 0 12px 0 32px;
    font-size: 12px;
    font-weight: 500;
    color: #1e293b;
    background: #f1f5f9;
    border: 1px solid transparent;
    border-radius: 10px;
    transition: all 0.3s;
    
    &:focus {
      outline: none;
      background: #fff;
      border-color: #e2e8f0;
      width: 220px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.03);
    }
  }
}

.v-divider { width: 1px; height: 20px; background: #e2e8f0; }

.mini-tools {
  display: flex;
  gap: 6px;
}

.icon-btn {
  position: relative;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  color: #64748b;
  font-size: 14px;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.2s;

  &:hover { background: #f1f5f9; color: #1e293b; }

  .badge-dot {
    position: absolute;
    top: 2px;
    right: 2px;
    min-width: 14px;
    height: 14px;
    padding: 0 4px;
    background: #ef4444;
    color: white;
    border-radius: 7px;
    font-size: 8px;
    font-weight: 800;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1.5px solid white;
  }
}

/* Grid Layout */
.dense-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 20px;
}

/* Empty State */
.empty-state {
  padding: 80px 0;
  text-align: center;
  
  .empty-visual {
    margin-bottom: 20px;
    .circle-box {
      width: 50px;
      height: 50px;
      background: #f8fafc;
      border-radius: 50%;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #cbd5e1;
      font-size: 20px;
    }
  }

  .empty-text { font-size: 14px; color: #94a3b8; margin-bottom: 16px; }
  .text-btn {
    background: none;
    border: none;
    color: #3b82f6;
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
    text-decoration: underline;
    text-underline-offset: 4px;
  }
}

/* Mobile Adaptation (2 Columns High Density) */
@media (max-width: 768px) {
  .shop-wrapper { padding: 20px 15px; }
  
  .mini-header .main-info {
    flex-direction: column;
    gap: 4px;
    .title { font-size: 18px; }
  }

  .filter-inner {
    flex-direction: column;
    gap: 12px;
    padding: 12px;
    align-items: stretch;
  }

  .cat-nav {
    overflow-x: auto;
    padding-bottom: 4px;
    &::-webkit-scrollbar { display: none; }
  }

  .util-box { justify-content: space-between; }
  .mini-search input { width: 100%; &:focus { width: 100%; } }

  .dense-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }
}
</style>
<template>
  <div class="shop-subpage">
    <!-- Compact Command Dock -->
    <div class="toolbar-dock">
      <div class="dock-inner">
        
        <!-- Left: Titles and Nav -->
        <div class="left-col">
          <div class="breadcrumb">
            首页 <span class="sep">/</span> <span class="active">资源商城</span>
          </div>
          <div class="title-group">
            <font-awesome-icon icon="layer-group" class="title-icon"/>
            <h1 class="page-title">开发组件库</h1>
            <div class="status-dot"></div>
          </div>
        </div>

        <!-- Center/Right: Filters and Actions -->
        <div class="right-col">
          <div class="filter-tabs">
            <button
              v-for="cat in categories"
              :key="cat.value"
              class="tab-btn"
              :class="{ active: activeCategory === cat.value }"
              @click="activeCategory = cat.value"
            >
              {{ cat.label }}
            </button>
          </div>

          <div class="search-box">
            <font-awesome-icon icon="search" class="s-icon" />
            <input 
              type="text" 
              v-model="searchKeyword" 
              placeholder="搜索资源..." 
            />
          </div>

          <div class="action-icons">
            <button class="icon-btn tool">
              <font-awesome-icon icon="sliders" />
            </button>
            <button class="icon-btn cart">
              <font-awesome-icon icon="basket-shopping" />
              <span v-if="cartCount > 0" class="badge-num">{{ cartCount }}</span>
            </button>
          </div>
        </div>

      </div>
    </div>

    <!-- Delicate Grid -->
    <main class="grid-area">
      <div v-if="filteredResources.length > 0" class="dense-grid">
        <ResourceCard
          v-for="item in filteredResources"
          :key="item.id"
          :resource="item"
          @click="handleCardClick(item)"
        />
      </div>

      <!-- Compact Empty State -->
      <div v-else class="compact-empty">
        <div class="empty-icon-wrap">
          <font-awesome-icon icon="inbox" />
        </div>
        <p class="empty-text">未找到匹配的资源内容</p>
        <button class="reset-link" @click="resetFilters">清除过滤条件</button>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import ResourceCard, { type Resource } from './ResourceCard.vue'

const categories = [
  { label: '全部项目', value: 'all' },
  { label: '页面模板', value: 'template' },
  { label: 'UI组件', value: 'component' },
  { label: '开发包', value: 'tool' },
  { label: '文档教程', value: 'tutorial' }
]

const activeCategory = ref('all')
const searchKeyword = ref('')
const cartCount = ref(3)

const resources = ref<Resource[]>([
  {
    id: 1, title: 'Vue3 Admin Pro', description: '高品质的中后台界面模板，含详细图表与表格页', cover: 'https://picsum.photos/600/380?random=1',
    price: 129, sales: 2340, rating: 4.9, isHot: true, category: 'template',
    author: '前端精选', authorAvatar: 'https://i.pravatar.cc/150?u=1'
  },
  {
    id: 2, title: 'React SaaS Dashboard', description: '为现代SaaS设计的深色模式仪表盘系统', cover: 'https://picsum.photos/600/380?random=2',
    price: 159, sales: 1890, rating: 4.8, category: 'template',
    author: 'Design Lab', authorAvatar: 'https://i.pravatar.cc/150?u=2'
  },
  {
    id: 3, title: 'MP UI Library', description: '一套极简风格的小程序组件生态集合', cover: 'https://picsum.photos/600/380?random=3',
    price: 89, sales: 5670, rating: 4.9, isHot: true, category: 'component',
    author: 'MP Maker', authorAvatar: 'https://i.pravatar.cc/150?u=3'
  },
  {
    id: 4, title: 'FastMock Core', description: '针对前端本地联调打造的快速Mock CLI工具', cover: 'https://picsum.photos/600/380?random=4',
    price: 49, sales: 890, rating: 4.7, category: 'tool',
    author: 'Dev Tools', authorAvatar: 'https://i.pravatar.cc/150?u=4'
  },
  {
    id: 5, title: '架构师图解指南', description: '深入图解全栈架构模式与实际工程痛点', cover: 'https://picsum.photos/600/380?random=5',
    price: 69, sales: 12500, rating: 4.9, isHot: true, category: 'tutorial',
    author: '架构之道', authorAvatar: 'https://i.pravatar.cc/150?u=5'
  },
  {
    id: 6, title: 'Figma UI Kits', description: '全面对应开发组件的Figma源文件库', cover: 'https://picsum.photos/600/380?random=6',
    price: 99, sales: 2150, rating: 4.8, category: 'template',
    author: 'Design Lab', authorAvatar: 'https://i.pravatar.cc/150?u=6'
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
.shop-subpage {
  max-width: 1280px;
  margin: 0 auto;
  padding: 24px;
}

/* Compact Control Dock */
.toolbar-dock {
  background: var(--surface, #ffffff);
  border: 1px solid var(--border-light, #e2e8f0);
  border-radius: 12px;
  padding: 12px 16px;
  margin-bottom: 24px;
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.02);
  position: sticky;
  top: 16px;
  z-index: 100;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  background: rgba(255, 255, 255, 0.96);
}

.dock-inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
}

.left-col {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.breadcrumb {
  font-size: 11px;
  color: var(--text-tertiary, #94a3b8);
  font-weight: 500;
  .sep { margin: 0 4px; opacity: 0.5; }
  .active { color: var(--text-secondary, #64748b); font-weight: 600; }
}

.title-group {
  display: flex;
  align-items: center;
  gap: 8px;
  
  .title-icon {
    font-size: 14px;
    color: var(--primary, #3b82f6);
  }
  
  .page-title {
    margin: 0;
    font-size: 18px;
    font-weight: 800;
    color: var(--text, #0f172a);
    letter-spacing: -0.5px;
  }
  
  .status-dot {
    width: 6px;
    height: 6px;
    background: var(--success, #10b981);
    border-radius: 50%;
    margin-left: 2px;
    box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.2);
  }
}

.right-col {
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1;
  justify-content: flex-end;
}

/* Tab Filters */
.filter-tabs {
  display: flex;
  gap: 4px;
  background: var(--bg-secondary, #f1f5f9);
  padding: 3px;
  border-radius: 8px;
  border: 1px solid var(--border-light, #e2e8f0);
}

.tab-btn {
  padding: 6px 14px;
  font-size: 12px;
  font-weight: 600;
  color: var(--text-secondary, #64748b);
  background: transparent;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover { color: var(--text, #0f172a); }
  
  &.active {
    background: var(--surface, #ffffff);
    color: var(--text, #0f172a);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  }
}

/* Compact Search Box */
.search-box {
  position: relative;
  width: 200px;
  
  .s-icon {
    position: absolute;
    left: 10px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 12px;
    color: var(--text-tertiary, #94a3b8);
  }
  
  input {
    width: 100%;
    height: 32px;
    padding: 0 12px 0 28px;
    border: 1px solid var(--border-light, #e2e8f0);
    border-radius: 6px;
    font-size: 12px;
    color: var(--text, #1e293b);
    background: var(--bg-secondary, #f8fafc);
    transition: all 0.2s;
    outline: none;
    
    &:focus {
      background: var(--surface, #ffffff);
      border-color: var(--primary, #3b82f6);
      box-shadow: 0 0 0 2px var(--primary-light, #bfdbfe);
    }
  }
}

/* Action Icons */
.action-icons {
  display: flex;
  align-items: center;
  gap: 8px;
  padding-left: 16px;
  border-left: 1px solid var(--border-light, #e2e8f0);
}

.icon-btn {
  position: relative;
  width: 32px;
  height: 32px;
  border: 1px solid var(--border-light, #e2e8f0);
  background: var(--surface, #ffffff);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary, #64748b);
  cursor: pointer;
  transition: all 0.2s;
  font-size: 13px;
  
  &:hover {
    color: var(--primary, #3b82f6);
    background: var(--bg-secondary, #f8fafc);
    border-color: var(--border-hover, #cbd5e1);
  }
}

.badge-num {
  position: absolute;
  top: -5px;
  right: -5px;
  min-width: 16px;
  height: 16px;
  background: var(--error, #ef4444);
  color: #fff;
  border-radius: 8px;
  font-size: 9px;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
  border: 2px solid var(--surface, #ffffff);
}

/* Dense Grid */
.dense-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 16px;
}

/* Compact Empty State */
.compact-empty {
  padding: 60px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px dashed var(--border-light, #e2e8f0);
  border-radius: 12px;
  background: var(--bg-secondary, #f8fafc);
  
  .empty-icon-wrap {
    width: 40px;
    height: 40px;
    background: var(--surface, #ffffff);
    border: 1px solid var(--border-light, #e2e8f0);
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-tertiary, #94a3b8);
    font-size: 18px;
    margin-bottom: 12px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.02);
  }
  
  .empty-text {
    font-size: 13px;
    font-weight: 600;
    color: var(--text-secondary, #64748b);
    margin: 0 0 12px;
  }
  
  .reset-link {
    background: none;
    border: none;
    color: var(--primary, #3b82f6);
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    
    &:hover { text-decoration: underline; }
  }
}

/* Responsive Overrides */
@media (max-width: 900px) {
  .dock-inner {
    flex-wrap: wrap;
    gap: 16px;
  }
  
  .right-col {
    width: 100%;
    justify-content: space-between;
  }
  
  .search-box {
    flex: 1;
    max-width: 300px;
  }
}

@media (max-width: 640px) {
  .shop-subpage { padding: 12px; }
  .toolbar-dock {
    padding: 10px;
    margin-bottom: 16px;
    position: static;
  }
  .right-col {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }
  .search-box { max-width: 100%; }
  .action-icons { display: none; }
  .filter-tabs { overflow-x: auto; &::-webkit-scrollbar { display: none; } }
  .dense-grid { grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 12px; }
}
</style>
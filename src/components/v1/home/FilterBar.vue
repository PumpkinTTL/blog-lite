<template>
  <section class="filter-bar">
    <!-- Left: Title & Live Stats -->
    <div class="left-zone">
      <div class="brand-box">
        <div class="brand-icon">
          <font-awesome-icon icon="compass" class="pulse-icon" />
        </div>
        <div class="brand-text">
          <h2>探索广场</h2>
          <span class="live-count">1.2k+ 资源</span>
        </div>
      </div>
      <div class="divider-v"></div>
    </div>

    <!-- Center: Modern Categories -->
    <div class="center-zone">
      <div class="category-nav">
        <button
          v-for="(item, index) in categories"
          :key="item"
          class="cat-chip"
          :class="[`cat-${index % 5}`, { active: item === activeCategory }]"
          @click="selectCategory(item)"
        >
          <font-awesome-icon :icon="getCatIcon(item)" class="c-icon" />
          <span>{{ item }}</span>
        </button>
      </div>
    </div>

    <!-- Right: Search & Refined Sort -->
    <div class="right-zone">
      <div class="search-pill" :class="{ focused: isSearchFocused }">
        <font-awesome-icon icon="magnifying-glass" class="s-icon" />
        <input 
          type="text" 
          placeholder="快速查找..." 
          @focus="isSearchFocused = true"
          @blur="isSearchFocused = false"
        />
        <kbd class="search-kbd">/</kbd>
      </div>

      <div class="sort-capsule">
        <button
          v-for="item in sortOptions"
          :key="item.value"
          class="sort-tab"
          :class="{ active: item.value === activeSort }"
          @click="selectSort(item.value)"
        >
          {{ item.label }}
        </button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  categories: string[]
  activeCategory: string
  activeSort: 'latest' | 'popular'
}>()

const emit = defineEmits<{
  (e: 'update:activeCategory', value: string): void
  (e: 'update:activeSort', value: 'latest' | 'popular'): void
}>()

const isSearchFocused = ref(false)

const sortOptions = [
  { label: '最新发布', value: 'latest' as const },
  { label: '热门互动', value: 'popular' as const },
]

const getCatIcon = (cat: string) => {
  const icons: Record<string, string> = {
    '全部': 'grid-2',
    '前端': 'code',
    '后端': 'server',
    '设计': 'palette',
    'AI': 'brain',
    '工具': 'wrench'
  }
  return icons[cat] || 'tag'
}

const selectCategory = (value: string) => {
  if (value !== props.activeCategory) emit('update:activeCategory', value)
}

const selectSort = (value: 'latest' | 'popular') => {
  if (value !== props.activeSort) emit('update:activeSort', value)
}
</script>

<style scoped lang="scss">
.filter-bar {
  position: sticky;
  top: 64px;
  z-index: 30;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 20px;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(229, 231, 235, 0.7);
  border-radius: 16px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.01), 0 2px 4px -1px rgba(0, 0, 0, 0.005);
  margin-bottom: 4px;
}

/* ── Left Zone ── */
.left-zone {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.brand-box {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-right: 20px;
}

.brand-icon {
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, #3B82F6, #2563EB);
  color: #fff;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);

  .pulse-icon {
    animation: slow-rotate 10s linear infinite;
  }
}

@keyframes slow-rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.brand-text h2 {
  margin: 0;
  font-size: 15px;
  font-weight: 800;
  color: #111827;
  line-height: 1.2;
}

.live-count {
  font-size: 10px;
  font-weight: 700;
  color: #94A3B8;
  display: block;
}

.divider-v {
  width: 1px;
  height: 24px;
  background: #E5E7EB;
}

/* ── Center Zone (Navigation) ── */
.center-zone {
  flex: 1;
  display: flex;
  justify-content: center;
  padding: 0 20px;
}

.category-nav {
  display: flex;
  gap: 6px;
  background: #F8FAFC;
  padding: 4px;
  border-radius: 12px;
  border: 1px solid #F1F5F9;
}

.cat-chip {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 14px;
  border: none;
  background: transparent;
  color: #64748B;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  font-family: inherit;

  .c-icon { font-size: 11px; opacity: 0.6; }

  &:hover {
    color: #1E293B;
    background: #fff;
    box-shadow: 0 2px 4px rgba(0,0,0,0.02);
  }

  &.active {
    background: #fff;
    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
    transform: translateY(-1px);
    
    &.cat-0 { color: #3B82F6; .c-icon { color: #3B82F6; } }
    &.cat-1 { color: #F59E0B; .c-icon { color: #F59E0B; } }
    &.cat-2 { color: #10B981; .c-icon { color: #10B981; } }
    &.cat-3 { color: #EC4899; .c-icon { color: #EC4899; } }
    &.cat-4 { color: #8B5CF6; .c-icon { color: #8B5CF6; } }
  }
}

/* ── Right Zone ── */
.right-zone {
  display: flex;
  align-items: center;
  gap: 12px;
}

.search-pill {
  display: flex;
  align-items: center;
  background: #F1F5F9;
  border: 1.5px solid transparent;
  border-radius: 10px;
  padding: 0 12px;
  width: 160px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &.focused {
    width: 220px;
    background: #fff;
    border-color: #3B82F6;
    box-shadow: 0 10px 15px -3px rgba(59, 130, 246, 0.1);
  }

  .s-icon { font-size: 12px; color: #94A3B8; }

  input {
    flex: 1;
    border: none;
    outline: none;
    background: transparent;
    padding: 8px 10px;
    font-size: 13px;
    color: #1E293B;
    &::placeholder { color: #94A3B8; }
  }

  .search-kbd {
    font-size: 10px;
    font-weight: 700;
    color: #94A3B8;
    background: #fff;
    padding: 2px 6px;
    border-radius: 4px;
    border: 1px solid #E2E8F0;
    box-shadow: 0 1px 0 #CBD5E1;
  }
}

.sort-capsule {
  display: flex;
  background: #F1F5F9;
  padding: 3px;
  border-radius: 10px;
  border: 1px solid #E2E8F0;
}

.sort-tab {
  border: none;
  background: transparent;
  padding: 6px 12px;
  font-size: 12px;
  font-weight: 700;
  color: #64748B;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;

  &.active {
    background: #fff;
    color: #3B82F6;
    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  }
}

/* ── Responsive ── */
@media (max-width: 1200px) {
  .left-zone { display: none; }
}

@media (max-width: 900px) {
  .filter-bar { flex-direction: column; height: auto; padding: 16px; gap: 16px; }
  .center-zone { order: 1; padding: 0; width: 100%; }
  .category-nav { width: 100%; overflow-x: auto; padding-bottom: 8px; }
  .right-zone { order: 2; width: 100%; justify-content: space-between; }
  .search-pill { flex: 1; &.focused { width: 100%; } }
}
</style>

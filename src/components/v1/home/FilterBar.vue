<template>
  <div class="filter-bar">
    <div class="filter-wrap">
      <!-- Search Input -->
      <div class="inp-w">
        <font-awesome-icon :icon="['fas', 'magnifying-glass']" class="search-icon" />
        <input
          class="inp"
          type="text"
          placeholder="搜索资源、文章、工具..."
          v-model="searchQuery"
          @keyup.enter="handleSearch"
        />
      </div>

      <!-- Category Tags -->
      <div class="tag-row">
        <button
          v-for="cat in categories"
          :key="cat.id"
          class="tag"
          :class="{ on: activeCategory === cat.id }"
          @click="selectCategory(cat.id)"
        >
          <font-awesome-icon :icon="['fas', cat.icon]" />
          {{ cat.name }}
        </button>
      </div>

      <!-- Bottom Info Bar -->
      <div class="info-bar">
        <div class="info-left">
          <span class="count">共 <strong>{{ totalCount }}</strong> 项资源</span>
          <span class="dot">·</span>
          <button class="sort-btn">
            <font-awesome-icon :icon="['fas', 'clock']" />
            最新
          </button>
        </div>
        <div class="view-btns">
          <button class="ico-btn" :class="{ active: viewMode === 'grid' }" @click="$emit('view-change', 'grid')">
            <font-awesome-icon :icon="['fas', 'grip']" />
          </button>
          <button class="ico-btn" :class="{ active: viewMode === 'list' }" @click="$emit('view-change', 'list')">
            <font-awesome-icon :icon="['fas', 'list']" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

interface Props {
  totalCount?: number
  viewMode?: 'grid' | 'list'
}

const props = withDefaults(defineProps<Props>(), {
  totalCount: 0,
  viewMode: 'grid'
})

const emit = defineEmits<{
  (e: 'category-change', categoryId: string): void
  (e: 'view-change', mode: 'grid' | 'list'): void
}>()

const router = useRouter()
const searchQuery = ref('')
const activeCategory = ref('all')

const categories = [
  { id: 'all', name: '全部', icon: 'grip', count: 128 },
  { id: 'frontend', name: '前端', icon: 'code', count: 45 },
  { id: 'backend', name: '后端', icon: 'server', count: 32 },
  { id: 'design', name: '设计', icon: 'palette', count: 28 },
  { id: 'ai', name: 'AI', icon: 'brain', count: 19 },
  { id: 'tools', name: '工具', icon: 'wrench', count: 24 }
]

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    router.push({ path: '/search', query: { q: searchQuery.value } })
  }
}

const selectCategory = (categoryId: string) => {
  activeCategory.value = categoryId
  emit('category-change', categoryId)
}
</script>

<style scoped lang="scss">
.filter-bar {
  background: var(--surface);
  border-bottom: 1px solid var(--border);
  position: sticky;
  top: 60px;
  z-index: 100;
}

.filter-wrap {
  max-width: 1280px;
  margin: 0 auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 14px;

  @media (max-width: 768px) {
    padding: 16px;
    gap: 12px;
  }
}

// ══════ Search Input ══════
.inp-w {
  position: relative;
  max-width: 480px;

  @media (max-width: 768px) {
    max-width: 100%;
  }
}

.search-icon {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 17px;
  color: var(--text-3);
  pointer-events: none;
}

.inp {
  width: 100%;
  font-family: inherit;
  font-size: 14px;
  padding: 11px 16px 11px 42px;
  border: 1.5px solid var(--border);
  border-radius: var(--r-pill);
  background: var(--surface);
  color: var(--text);
  outline: none;
  transition: all var(--ease);

  &:focus {
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(59, 109, 245, 0.1);
  }

  &::placeholder {
    color: var(--text-3);
  }
}

// ══════ Category Tags ══════
.tag-row {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  overflow-x: auto;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }

  @media (max-width: 768px) {
    gap: 6px;
  }
}

.tag {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 12.5px;
  font-weight: 500;
  padding: 6px 14px;
  border-radius: var(--r-pill);
  background: var(--surface);
  border: 1.5px solid var(--border);
  color: var(--text-2);
  cursor: pointer;
  transition: all var(--ease);
  font-family: inherit;
  white-space: nowrap;

  svg {
    font-size: 14px;
  }

  &:hover:not(.on) {
    border-color: #d0d5dd;
  }

  &.on {
    background: var(--primary-soft);
    color: var(--primary);
    border-color: transparent;
  }
}

// ══════ Info Bar ══════
.info-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 10px;
  border-top: 1px solid var(--border);

  @media (max-width: 768px) {
    padding-top: 8px;
  }
}

.info-left {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 12px;
  color: var(--text-3);
  font-weight: 500;

  strong {
    color: var(--text);
    font-weight: 600;
  }

  .dot {
    color: var(--text-3);
  }
}

.sort-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  background: transparent;
  border: none;
  border-radius: var(--r-pill);
  color: var(--text-2);
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--ease);
  font-family: inherit;

  svg {
    font-size: 13px;
  }

  &:hover {
    background: rgba(0, 0, 0, 0.04);
    color: var(--text);
  }
}

// ══════ View Buttons ══════
.view-btns {
  display: flex;
  gap: 6px;
}

.ico-btn {
  width: 36px;
  height: 36px;
  padding: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--r-pill);
  background: var(--surface);
  border: 1.5px solid var(--border);
  cursor: pointer;
  color: var(--text-2);
  transition: all var(--ease);

  svg {
    font-size: 16px;
  }

  &:hover:not(.active) {
    border-color: #d0d5dd;
    color: var(--text);
    background: #fafbfc;
  }

  &.active {
    background: var(--primary-soft);
    border-color: var(--primary);
    color: var(--primary);
  }
}
</style>

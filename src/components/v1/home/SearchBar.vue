<template>
  <div class="search-section">
    <div class="search-container">
      <!-- Search Input -->
      <div class="search-box">
        <font-awesome-icon :icon="['fas', 'magnifying-glass']" class="search-icon" />
        <input
          type="text"
          placeholder="搜索资源、文章、工具..."
          v-model="searchQuery"
          @keyup.enter="handleSearch"
          class="search-input"
        />
        <button v-if="searchQuery" class="clear-btn" @click="searchQuery = ''">
          <font-awesome-icon :icon="['fas', 'xmark']" />
        </button>
      </div>

      <!-- Quick Filters -->
      <div class="quick-filters">
        <button
          v-for="filter in quickFilters"
          :key="filter.id"
          class="filter-btn"
          :class="{ active: activeFilter === filter.id }"
          @click="selectFilter(filter.id)"
        >
          <font-awesome-icon :icon="['fas', filter.icon]" />
          {{ filter.label }}
        </button>
      </div>

      <!-- View & Sort Controls -->
      <div class="controls">
        <div class="control-group">
          <span class="control-label">{{ totalCount }} 项资源</span>
          <button class="sort-btn" @click="toggleSort">
            <font-awesome-icon :icon="['fas', 'arrow-down-short-wide']" />
            {{ sortLabel }}
          </button>
        </div>
        <div class="view-toggle">
          <button
            class="view-btn"
            :class="{ active: viewMode === 'grid' }"
            @click="$emit('view-change', 'grid')"
          >
            <font-awesome-icon :icon="['fas', 'grip']" />
          </button>
          <button
            class="view-btn"
            :class="{ active: viewMode === 'list' }"
            @click="$emit('view-change', 'list')"
          >
            <font-awesome-icon :icon="['fas', 'list']" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
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
  (e: 'filter-change', filterId: string): void
  (e: 'view-change', mode: 'grid' | 'list'): void
  (e: 'sort-change', sort: string): void
}>()

const router = useRouter()
const searchQuery = ref('')
const activeFilter = ref('all')
const currentSort = ref('latest')

const quickFilters = [
  { id: 'all', label: '全部', icon: 'grip' },
  { id: 'frontend', label: '前端', icon: 'code' },
  { id: 'backend', label: '后端', icon: 'server' },
  { id: 'design', label: '设计', icon: 'palette' },
  { id: 'ai', label: 'AI', icon: 'brain' }
]

const sortOptions = [
  { value: 'latest', label: '最新' },
  { value: 'popular', label: '最热' },
  { value: 'views', label: '浏览量' }
]

const sortLabel = computed(() => {
  return sortOptions.find(opt => opt.value === currentSort.value)?.label || '最新'
})

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    router.push({ path: '/search', query: { q: searchQuery.value } })
  }
}

const selectFilter = (filterId: string) => {
  activeFilter.value = filterId
  emit('filter-change', filterId)
}

const toggleSort = () => {
  const currentIndex = sortOptions.findIndex(opt => opt.value === currentSort.value)
  const nextIndex = (currentIndex + 1) % sortOptions.length
  currentSort.value = sortOptions[nextIndex].value
  emit('sort-change', currentSort.value)
}
</script>

<style scoped lang="scss">
.search-section {
  background: var(--surface);
  border-bottom: 1px solid var(--border);
  position: sticky;
  top: 64px;
  z-index: 100;

  @media (max-width: 768px) {
    top: 56px;
  }
}

.search-container {
  max-width: 1280px;
  margin: 0 auto;
  padding: var(--space-lg);
  display: flex;
  flex-direction: column;
  gap: var(--space-md);

  @media (max-width: 768px) {
    padding: var(--space-md);
    gap: 12px;
  }
}

// ── Search Box ──
.search-box {
  position: relative;
  display: flex;
  align-items: center;
  max-width: 600px;
}

.search-icon {
  position: absolute;
  left: 16px;
  font-size: 18px;
  color: var(--text-3);
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 14px 48px 14px 48px;
  background: var(--surface-hover);
  border: 2px solid transparent;
  border-radius: var(--r-lg);
  font-size: 15px;
  color: var(--text);
  transition: all var(--ease);

  &:focus {
    background: var(--surface);
    border-color: var(--accent);
    box-shadow: 0 0 0 4px var(--accent-soft);
  }

  &::placeholder {
    color: var(--text-3);
  }
}

.clear-btn {
  position: absolute;
  right: 12px;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--text-3);
  border-radius: var(--r-pill);
  color: white;
  font-size: 12px;
  transition: all var(--ease);

  &:hover {
    background: var(--text-2);
    transform: scale(1.1);
  }
}

// ── Quick Filters ──
.quick-filters {
  display: flex;
  gap: var(--space-sm);
  flex-wrap: wrap;
  overflow-x: auto;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
}

.filter-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 18px;
  background: var(--surface-hover);
  border: 2px solid transparent;
  border-radius: var(--r-lg);
  font-size: 14px;
  font-weight: 600;
  color: var(--text-2);
  white-space: nowrap;
  transition: all var(--ease);

  svg {
    font-size: 14px;
  }

  &:hover:not(.active) {
    background: var(--border);
    color: var(--text);
  }

  &.active {
    background: var(--accent);
    color: white;
    border-color: var(--accent);
  }
}

// ── Controls ──
.controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-md);
  padding-top: var(--space-md);
  border-top: 1px solid var(--border-light);

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
}

.control-group {
  display: flex;
  align-items: center;
  gap: var(--space-md);
}

.control-label {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-2);
}

.sort-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  background: var(--surface-hover);
  border-radius: var(--r-sm);
  font-size: 13px;
  font-weight: 500;
  color: var(--text-2);
  transition: all var(--ease);

  svg {
    font-size: 14px;
  }

  &:hover {
    background: var(--border);
    color: var(--text);
  }
}

.view-toggle {
  display: flex;
  gap: 4px;
  background: var(--surface-hover);
  padding: 4px;
  border-radius: var(--r-sm);
}

.view-btn {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border-radius: var(--r-sm);
  color: var(--text-2);
  font-size: 16px;
  transition: all var(--ease);

  &:hover:not(.active) {
    background: var(--border);
    color: var(--text);
  }

  &.active {
    background: var(--surface);
    color: var(--accent);
    box-shadow: var(--shadow-sm);
  }
}
</style>

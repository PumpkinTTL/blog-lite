<template>
  <div class="pagination-container" v-if="totalPages > 1">
    <nav class="pagination" aria-label="分页导航">
      <!-- Previous Button -->
      <button
        class="page-btn prev"
        :disabled="current === 1"
        @click="changePage(current - 1)"
        aria-label="上一页"
      >
        <font-awesome-icon icon="chevron-left" />
      </button>

      <!-- Page Numbers -->
      <div class="pages">
        <template v-for="page in visiblePages" :key="page">
          <button
            v-if="typeof page === 'number'"
            class="page-item"
            :class="{ active: current === page }"
            @click="changePage(page)"
          >
            {{ page }}
          </button>
          <span v-else class="pagination-ellipsis">
            <font-awesome-icon icon="ellipsis" />
          </span>
        </template>
      </div>

      <!-- Next Button -->
      <button
        class="page-btn next"
        :disabled="current === totalPages"
        @click="changePage(current + 1)"
        aria-label="下一页"
      >
        <font-awesome-icon icon="chevron-right" />
      </button>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface Props {
  current: number;
  total: number;
  pageSize: number;
}

const props = defineProps<Props>();
const emit = defineEmits(["update:current", "change"]);

const totalPages = computed(() => Math.ceil(props.total / props.pageSize));

const visiblePages = computed(() => {
  const total = totalPages.value;
  const current = props.current;
  const delta = 2; // Number of pages to show before and after current
  const pages: (number | string)[] = [];

  if (total <= 7) {
    for (let i = 1; i <= total; i++) pages.push(i);
  } else {
    pages.push(1);
    
    if (current > delta + 2) {
      pages.push("...");
    }
    
    const start = Math.max(2, current - delta);
    const end = Math.min(total - 1, current + delta);
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    if (current < total - delta - 1) {
      pages.push("...");
    }
    
    pages.push(total);
  }
  
  return pages;
});

const changePage = (page: number) => {
  if (page >= 1 && page <= totalPages.value && page !== props.current) {
    emit("update:current", page);
    emit("change", page);
    
    // Scroll to top of list smoothly
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
};
</script>

<style scoped lang="scss">
.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 40px;
  padding-bottom: 20px;
}

.pagination {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-radius: 20px;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 15px 30px -8px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }
}

.pages {
  display: flex;
  align-items: center;
  gap: 6px;
}

.page-item, .page-btn {
  width: 42px;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 14px;
  border: none;
  background: transparent;
  color: #64748b;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  outline: none;

  &:hover:not(:disabled) {
    background: var(--bg-secondary);
    color: var(--primary);
    box-shadow: var(--shadow-sm);
    transform: scale(1.05);
  }

  &.active {
    background: var(--primary);
    color: #fff;
    box-shadow: 0 8px 16px -4px rgba(99, 102, 241, 0.4);
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
}

.page-btn {
  background: rgba(241, 245, 249, 0.5);
  
  &:hover:not(:disabled) {
    background: #fff;
    color: #4f46e5;
  }

  .icon-rotate-90 {
    transform: rotate(90deg);
  }
  
  .icon-rotate-n90 {
    transform: rotate(-90deg);
  }
}

.pagination-ellipsis {
  width: 32px;
  display: flex;
  justify-content: center;
  color: #94a3b8;
  font-size: 12px;
}

/* ── Dark Mode Support ── */
:global(.dark) .pagination {
  background: rgba(15, 23, 42, 0.7);
  border-color: rgba(255, 255, 255, 0.06);
  box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.4);
  
  .page-item, .page-btn {
    color: var(--text-secondary);
    
    &:hover:not(:disabled) {
      background: rgba(255, 255, 255, 0.05);
      color: var(--primary);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    }
    
    &.active {
      background: var(--primary);
      color: #fff;
      box-shadow: 0 8px 20px -4px rgba(99, 102, 241, 0.6);
    }
  }
  
  .page-btn {
    background: rgba(255, 255, 255, 0.03);
  }
  
  .pagination-ellipsis {
    color: var(--text-tertiary);
  }
}

@media (max-width: 640px) {
  .pagination {
    gap: 8px;
    padding: 6px 8px;
  }
  
  .page-item, .page-btn {
    width: 36px;
    height: 36px;
    border-radius: 10px;
    font-size: 13px;
  }
  
  .pages {
    gap: 4px;
  }
}
</style>

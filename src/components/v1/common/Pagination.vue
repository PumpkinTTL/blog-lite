<template>
  <div class="pagination-container" v-if="totalPages > 1">
    <div class="pagination-island">
      <!-- Nav Button: Prev -->
      <button
        class="nav-trigger prev"
        :disabled="current === 1"
        @click="changePage(current - 1)"
      >
        <font-awesome-icon icon="chevron-left" />
      </button>

      <!-- Page Numbers Area -->
      <div class="page-track">
        <template
          v-for="(page, index) in visiblePages"
          :key="page === '...' ? `dot-${index}` : page"
        >
          <button
            v-if="typeof page === 'number'"
            class="page-blob"
            :class="{ 'is-active': current === page }"
            @click="changePage(page)"
          >
            <span class="num">{{ page }}</span>
          </button>

          <div v-else class="page-spacer">
            <span class="dot"></span>
            <span class="dot"></span>
            <span class="dot"></span>
          </div>
        </template>
      </div>

      <!-- Nav Button: Next -->
      <button
        class="nav-trigger next"
        :disabled="current === totalPages"
        @click="changePage(current + 1)"
      >
        <font-awesome-icon icon="chevron-right" />
      </button>

      <!-- Flat Metadata Area -->
      <div class="meta-section">
        <div class="v-line"></div>
        <div class="page-stats">
          <span class="current-label">第</span>
          <span class="highlight">{{ current }}</span>
          <span class="total-label">/ {{ totalPages }} 页</span>
        </div>
      </div>
    </div>
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
  const delta = 1;
  const pages: (number | string)[] = [];

  if (total <= 5) {
    for (let i = 1; i <= total; i++) pages.push(i);
  } else {
    pages.push(1);
    if (current > delta + 2) pages.push("...");
    const start = Math.max(2, current - delta);
    const end = Math.min(total - 1, current + delta);
    for (let i = start; i <= end; i++) pages.push(i);
    if (current < total - delta - 1) pages.push("...");
    pages.push(total);
  }
  return pages;
});

const changePage = (page: number) => {
  if (page >= 1 && page <= totalPages.value && page !== props.current) {
    emit("update:current", page);
    emit("change", page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
};
</script>

<style scoped lang="scss">
.pagination-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 60px 0 30px;
  width: 100%;
}

.pagination-island {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px;
  background: var(--bg-secondary);
  border: 1px solid var(--border);
  border-radius: 8px;
  transition: all 0.2s ease;
}

/* ── Nav Triggers ── */
.nav-trigger {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  color: var(--text-tertiary);
  font-size: 10px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background: var(--bg);
    color: var(--primary);
  }

  &:disabled {
    opacity: 0.15;
    cursor: not-allowed;
  }
}

/* ── Page Track & Blobs ── */
.page-track {
  display: flex;
  align-items: center;
  gap: 4px;
}

.page-blob {
  min-width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  color: var(--text-secondary);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.2s;
  padding: 0 8px;

  &:hover:not(.is-active) {
    background: var(--bg);
    color: var(--text);
  }

  &.is-active {
    color: #fff;
    background: var(--primary);
  }
}

.page-spacer {
  display: flex;
  gap: 2px;
  padding: 0 4px;
  opacity: 0.3;

  .dot {
    width: 2px;
    height: 2px;
    background: var(--text-tertiary);
    border-radius: 50%;
  }
}

/* ── Meta & Stats ── */
.meta-section {
  display: flex;
  align-items: center;
  padding-right: 6px;
}

.v-line {
  width: 1px;
  height: 14px;
  background: var(--border);
  margin: 0 8px;
  opacity: 0.4;
}

.page-stats {
  display: flex;
  align-items: center;
  gap: 3px;
  font-size: 11px;
  font-weight: 700;
  color: var(--text-tertiary);
  letter-spacing: 0.01em;

  .highlight {
    color: var(--primary);
    font-size: 13px;
  }

  .total-label {
    opacity: 0.5;
    font-weight: 500;
  }
}

/* ── Dark Mode ── */
:global(.dark) {
  .pagination-island {
    background: #111827;
    border-color: rgba(255, 255, 255, 0.05);
  }

  .nav-trigger:hover:not(:disabled),
  .page-blob:hover:not(.is-active) {
    background: rgba(255, 255, 255, 0.03);
  }

  .v-line {
    background: rgba(255, 255, 255, 0.08);
  }
}

@media (max-width: 640px) {
  .meta-section {
    display: none;
  }
  .pagination-island {
    gap: 2px;
  }
  .page-blob,
  .nav-trigger {
    min-width: 32px;
    height: 32px;
    font-size: 12px;
  }
}
</style>

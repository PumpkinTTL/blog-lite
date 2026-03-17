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
            <div class="active-indicator" v-if="current === page"></div>
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

      <!-- Refined Metadata Area -->
      <div class="meta-section">
        <div class="v-line"></div>
        <div class="page-stats">
          <span class="current-label">第</span>
          <div class="num-box">
            <transition name="slide-up" mode="out-in">
              <span :key="current" class="highlight">{{ current }}</span>
            </transition>
          </div>
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
  position: relative;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px;
  background: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(24px) saturate(200%);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.6);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05),
    0 10px 30px -5px rgba(0, 0, 0, 0.08), inset 0 0 0 1px rgba(255, 255, 255, 1);
  transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);

  &:hover {
    box-shadow: 0 10px 40px -10px rgba(0, 0, 0, 0.12),
      inset 0 0 0 1px rgba(255, 255, 255, 1);
    transform: translateY(-2px);
  }
}

/* ── Nav Triggers ── */
.nav-trigger {
  width: 34px;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  color: var(--text-tertiary);
  font-size: 11px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.25s;

  &:hover:not(:disabled) {
    background: var(--bg);
    color: var(--primary);
    transform: scale(1.05);
  }

  &:active:not(:disabled) {
    transform: scale(0.95);
  }

  &:disabled {
    opacity: 0.2;
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
  position: relative;
  min-width: 34px;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  color: var(--text-secondary);
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  border-radius: 10px;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  padding: 0 8px;

  .num {
    position: relative;
    z-index: 2;
  }

  &:hover:not(.is-active) {
    background: var(--bg);
    color: var(--text);
  }

  &.is-active {
    color: #fff;
    background: var(--primary);
    box-shadow: 0 4px 12px -2px rgba(99, 102, 241, 0.45);
    transform: scale(1.05);

    &::after {
      content: "";
      position: absolute;
      inset: 0;
      background: linear-gradient(
        135deg,
        rgba(255, 255, 255, 0.2),
        transparent
      );
      border-radius: inherit;
      z-index: 1;
    }
  }
}

.active-indicator {
  position: absolute;
  bottom: 5px;
  left: 50%;
  transform: translateX(-50%);
  width: 12px;
  height: 2px;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 99px;
  z-index: 3;
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
  height: 18px;
  background: var(--border);
  margin: 0 10px;
  opacity: 0.6;
}

.page-stats {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  font-weight: 800;
  color: var(--text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.02em;

  .num-box {
    min-width: 14px;
    display: flex;
    justify-content: center;
  }

  .highlight {
    color: var(--primary);
    font-size: 13px;
    font-family: "Inter", sans-serif;
  }

  .total-label {
    opacity: 0.5;
  }
}

/* ── Transitions ── */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
}
.slide-up-enter-from {
  opacity: 0;
  transform: translateY(10px);
}
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* ── Dark Mode ── */
:global(.dark) {
  .pagination-island {
    background: rgba(15, 23, 42, 0.6);
    border-color: rgba(255, 255, 255, 0.04);
    box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.4),
      inset 0 1px 0 rgba(255, 255, 255, 0.05);

    &:hover {
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5),
        inset 0 1px 0 rgba(255, 255, 255, 0.05);
    }
  }

  .nav-trigger:hover:not(:disabled),
  .page-blob:hover:not(.is-active) {
    background: rgba(255, 255, 255, 0.05);
  }

  .v-line {
    background: rgba(255, 255, 255, 0.1);
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

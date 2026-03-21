<template>
  <section class="filter-bar">
    <!-- Left: Brand (Hidden on mobile) -->
    <div class="left-zone">
      <div class="brand-hub">
        <div class="hub-icon">
          <font-awesome-icon icon="compass" class="rotate-icon" />
        </div>
        <div class="hub-text">
          <h2 class="hub-title">探索广场</h2>
          <span class="hub-meta">1.2k+ 内容精选</span>
        </div>
      </div>
    </div>

    <!-- Center: Fluid Category Navigation -->
    <div class="center-zone">
      <div class="scroll-container">
        <div class="category-nav" ref="navContainer">
          <!-- The Motion Slider -->
          <div class="nav-slider" :style="activeBgStyle"></div>

          <button
            v-for="(item, index) in categories"
            :ref="(el) => (catRefs[index] = el)"
            :key="item"
            class="cat-item"
            :class="[{ active: item === activeCategory }]"
            @click="selectCategory(item)"
          >
            <font-awesome-icon :icon="getCatIcon(item)" class="c-i" />
            <span class="c-l">{{ item }}</span>
            <span class="c-c" v-if="index > 0">{{ 12 + index * 8 }}</span>
          </button>
        </div>
        <!-- Gradient Masks -->
        <div class="edge-mask left"></div>
        <div class="edge-mask right"></div>
      </div>
    </div>

    <!-- Right: Tools Section -->
    <div class="right-zone">
      <div class="tools-container">
        <!-- Search Pill -->
        <div class="search-wrap" :class="{ 'is-active': isSearchFocused }">
          <font-awesome-icon icon="magnifying-glass" class="s-i" />
          <input
            type="text"
            placeholder="发现新灵感..."
            @focus="isSearchFocused = true"
            @blur="isSearchFocused = false"
          />
        </div>

        <div class="v-divider"></div>

        <!-- Sort Switches -->
        <div class="sort-switches">
          <button
            v-for="item in sortOptions"
            :key="item.value"
            class="sort-tab"
            :class="{ active: item.value === activeSort }"
            @click="selectSort(item.value)"
          >
            <font-awesome-icon
              :icon="item.value === 'latest' ? 'clock' : 'fire'"
              class="s-i"
            />
            <span class="s-l">{{ item.label }}</span>
          </button>
        </div>

        <!-- Settings icon -->
        <button class="settings-btn" title="显示选项">
          <font-awesome-icon icon="sliders" />
        </button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, onMounted, watch } from "vue";

const props = defineProps<{
  categories: string[];
  activeCategory: string;
  activeSort: "latest" | "popular";
}>();

const emit = defineEmits<{
  (e: "update:activeCategory", value: string): void;
  (e: "update:activeSort", value: "latest" | "popular"): void;
}>();

const isSearchFocused = ref(false);
const catRefs = ref<any[]>([]);
const navContainer = ref<HTMLElement | null>(null);
const activeBgStyle = ref({
  left: "0px",
  width: "0px",
  opacity: "0",
});

let resizeObserver: ResizeObserver | null = null;

// 更新滑动背景位置
const updateActiveBg = () => {
  const index = props.categories.indexOf(props.activeCategory);
  const el = catRefs.value[index];
  if (el) {
    activeBgStyle.value = {
      left: `${el.offsetLeft}px`,
      width: `${el.offsetWidth}px`,
      opacity: "1",
    };
  }
};

watch(
  () => props.activeCategory,
  () => {
    nextTick(updateActiveBg);
  }
);

onMounted(() => {
  nextTick(updateActiveBg);

  // 监听容器尺寸变化，确保背景同步
  if (navContainer.value) {
    resizeObserver = new ResizeObserver(() => {
      updateActiveBg();
    });
    resizeObserver.observe(navContainer.value);
  }
});

import { onUnmounted } from "vue";
onUnmounted(() => {
  if (resizeObserver) resizeObserver.disconnect();
});

const sortOptions = [
  { label: "最新", value: "latest" as const },
  { label: "热门", value: "popular" as const },
];

const getCatIcon = (cat: string) => {
  const icons: Record<string, string> = {
    全部: "grid-2",
    前端: "code",
    后端: "server",
    设计: "palette",
    AI: "brain",
    工具: "wrench",
  };
  return icons[cat] || "tag";
};

const selectCategory = (value: string) => {
  if (value !== props.activeCategory) emit("update:activeCategory", value);
};

const selectSort = (value: "latest" | "popular") => {
  if (value !== props.activeSort) emit("update:activeSort", value);
};
</script>

<style scoped lang="scss">
.filter-bar {
  position: sticky;
  top: 64px;
  z-index: 100;
  /* 确保在最上层 */
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 8px 24px;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(28px) saturate(200%);
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 20px;
  box-shadow: 0 10px 40px -10px rgba(0, 0, 0, 0.08),
    inset 0 0 0 1px rgba(255, 255, 255, 0.4);
  margin-bottom: 24px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

/* ── Brand Hub ── */
.left-zone {
  flex-shrink: 0;
}

.brand-hub {
  display: flex;
  align-items: center;
  gap: 14px;
}

.hub-icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #4f46e5, #2563eb);
  color: #fff;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  box-shadow: 0 8px 16px -4px rgba(37, 99, 235, 0.3);

  .rotate-icon {
    animation: spin-slow 20s linear infinite;
  }
}

@keyframes spin-slow {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

.hub-title {
  margin: 0;
  font-size: 14px;
  font-weight: 850;
  color: #1e293b;
  letter-spacing: -0.02em;
}

.hub-meta {
  font-size: 10px;
  font-weight: 700;
  color: #94a3b8;
  text-transform: uppercase;
}

/* ── Fluid Navigation ── */
.center-zone {
  flex: 1;
  min-width: 0;
  /* 允许收缩 */
}

.scroll-container {
  position: relative;
  display: flex;
  align-items: center;
}

.category-nav {
  display: flex;
  gap: 6px;
  background: rgba(241, 245, 249, 0.5);
  padding: 5px;
  border-radius: 14px;
  overflow-x: auto;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }

  position: relative;
  width: 100%;
}

.nav-slider {
  position: absolute;
  top: 5px;
  bottom: 5px;
  background: #fff;
  border-radius: 9px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  z-index: 1;
  transition: all 0.4s cubic-bezier(0.2, 1, 0.3, 1);
}

.cat-item {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 7px 16px;
  border: none;
  background: transparent;
  color: #64748b;
  border-radius: 9px;
  font-size: 13px;
  font-weight: 750;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.3s;

  .c-i {
    font-size: 11px;
    opacity: 0.5;
    transition: transform 0.3s;
  }

  .c-c {
    font-size: 9px;
    background: #e2e8f0;
    color: #94a3b8;
    padding: 1px 6px;
    border-radius: 100px;
    font-weight: 800;
  }

  &:hover {
    color: #1e293b;

    .c-i {
      transform: scale(1.2);
      opacity: 1;
    }
  }

  &.active {
    color: #2563eb;

    .c-i {
      color: #2563eb;
      opacity: 1;
    }

    .c-c {
      background: #dbeafe;
      color: #2563eb;
    }
  }
}

.edge-mask {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 30px;
  pointer-events: none;
  z-index: 10;

  &.left {
    left: 0;
    background: linear-gradient(90deg, rgba(255, 255, 255, 0.05), transparent);
  }

  &.right {
    right: 0;
    background: linear-gradient(-90deg, rgba(230, 230, 230, 0.1), transparent);
  }
}

/* ── Tools ── */
.right-zone {
  flex-shrink: 0;
}

.tools-container {
  display: flex;
  align-items: center;
  gap: 12px;
}

.search-wrap {
  display: flex;
  align-items: center;
  background: #f1f5f9;
  border: 1px solid transparent;
  border-radius: 14px;
  padding: 0 14px;
  width: 140px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);

  &.is-active {
    width: 220px;
    background: #fff;
    border-color: #3b82f6;
    box-shadow: 0 12px 20px -8px rgba(59, 130, 246, 0.2);
  }

  .s-i {
    font-size: 12px;
    color: #94a3b8;
  }

  input {
    flex: 1;
    border: none;
    outline: none;
    background: transparent;
    padding: 10px 10px;
    font-size: 13px;
    color: #1e293b;
    font-weight: 500;

    &::placeholder {
      color: #94a3b8;
    }
  }
}

.v-divider {
  width: 1px;
  height: 20px;
  background: #e2e8f0;
}

.sort-switches {
  display: flex;
  background: #f1f5f9;
  padding: 4px;
  border-radius: 14px;
  border: 1px solid #e2e8f0;
}

.sort-tab {
  border: none;
  background: transparent;
  padding: 6px 14px;
  font-size: 12px;
  font-weight: 800;
  color: #64748b;
  border-radius: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s;

  &.active {
    background: #fff;
    color: #111827;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.06);

    .s-i {
      color: #2563eb;
    }
  }
}

.settings-btn {
  width: 38px;
  height: 38px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  background: #fff;
  color: #64748b;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    color: #2563eb;
    border-color: #3b82f6;
    background: #f8fafc;
    transform: rotate(90deg);
  }
}

/* ── Responsive Architecture ── */
@media (max-width: 1200px) {
  .left-zone {
    display: none;
  }

  /* 平板端隐藏品牌区 */
}

@media (max-width: 900px) {
  .filter-bar {
    flex-wrap: wrap;
    padding: 16px;
    gap: 16px;
  }

  .center-zone {
    order: 1;
    width: 100%;
    min-width: 100%;
  }

  .right-zone {
    order: 2;
    width: 100%;

    .tools-container {
      justify-content: space-between;
      gap: 8px;
    }

    .search-wrap {
      flex: 1;

      &.is-active {
        width: 100%;
      }
    }

    .v-divider {
      display: none;
    }
  }
}

@media (max-width: 480px) {
  .filter-bar {
    padding: 12px;
  }

  .scroll-container {
    mask-image: linear-gradient(90deg, black 85%, transparent);
  }

  .cat-item {
    padding: 7px 12px;
    font-size: 12px;
  }

  .s-l {
    display: none;
  }

  /* 极窄屏只显示排序图标 */
  .sort-tab {
    padding: 6px 12px;
  }

  .settings-btn {
    display: none;
  }
}
</style>

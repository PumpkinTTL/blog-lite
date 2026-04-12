<template>
  <!-- PC端：原始筛选面板 -->
  <div v-if="!isMobile" class="filter-dashboard-v7">
    <div class="filter-primary-card" :class="{ 'dark-mode': isDark }">
      <div class="primary-row">
        <div class="category-segment">
          <div class="active-capsule" :style="pillStyle"></div>
          <button
            v-for="(cat, index) in categories"
            :key="cat"
            :ref="(el) => setTabRef(el, index)"
            class="cat-item-btn"
            :class="{ active: activeCategory === cat }"
            @click="emit('update:activeCategory', cat)"
          >
            <font-awesome-icon :icon="getCategoryIcon(cat)" class="btn-i" />
            <span>{{ cat }}</span>
          </button>
        </div>

        <div class="spacer"></div>

        <div class="utility-group">
          <div class="search-field-v7" :class="{ focused: isFocused }">
            <font-awesome-icon icon="search" class="search-lead" />
            <input
              type="text"
              :value="modelValue"
              placeholder="搜索文章内容..."
              @input="onSearch"
              @focus="isFocused = true"
              @blur="isFocused = false"
            />
            <button
              v-if="modelValue"
              class="search-clear"
              @click="emit('update:modelValue', '')"
            >
              <font-awesome-icon icon="circle-xmark" />
            </button>
          </div>

          <div class="vertical-sep"></div>

          <div class="sort-selector-v7">
            <button
              class="sort-v7-btn"
              :class="{ active: activeSort === 'latest' }"
              @click="emit('update:activeSort', 'latest')"
            >
              <font-awesome-icon icon="clock" />
              <span>最新</span>
            </button>
            <button
              class="sort-v7-btn"
              :class="{ active: activeSort === 'popular' }"
              @click="emit('update:activeSort', 'popular')"
            >
              <font-awesome-icon icon="fire" />
              <span>热门</span>
            </button>
          </div>
        </div>
      </div>

      <div class="row-divider"></div>

      <div class="tags-recommendation-bar">
        <div class="tags-label">
          <div class="fire-icon-box">
            <font-awesome-icon icon="fire" class="fire-vibrate" />
          </div>
          <span>热门筛选:</span>
        </div>

        <div class="tags-overflow-container">
          <button
            v-for="tag in currentTags"
            :key="tag"
            class="v7-tag-chip"
            @click="emit('update:modelValue', tag)"
          >
            <span class="hash">#</span>
            <span class="tag-name">{{ tag }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- 移动端：贴边筛选 FAB 按钮 -->
  <button
    v-if="isMobile"
    class="mobile-filter-fab"
    :class="{ 'has-filter': hasActiveFilter, 'dark-mode': isDark }"
    @click="isDrawerOpen = true"
  >
    <font-awesome-icon icon="sliders" />
    <span v-if="hasActiveFilter" class="fab-dot"></span>
  </button>

  <!-- 移动端：筛选抽屉遮罩 -->
  <transition name="drawer-overlay">
    <div
      v-if="isMobile && isDrawerOpen"
      class="mobile-drawer-overlay"
      @click="closeDrawer"
    ></div>
  </transition>

  <!-- 移动端：筛选抽屉 -->
  <transition name="drawer-slide">
    <div
      v-if="isMobile && isDrawerOpen"
      class="mobile-filter-drawer"
      :class="{ 'dark-mode': isDark }"
    >
      <div class="drawer-header">
        <span class="drawer-title">
          <font-awesome-icon icon="filter" style="margin-right: 6px; opacity: 0.7;" />
          筛选
        </span>
        <button class="drawer-close" @click="closeDrawer">
          <font-awesome-icon icon="xmark" />
        </button>
      </div>

      <div class="drawer-body">
        <!-- 搜索 -->
        <div class="drawer-section">
          <div class="drawer-section-title">
            <font-awesome-icon icon="magnifying-glass" style="opacity: 0.6;" />
            搜索
          </div>
          <div class="drawer-search">
            <font-awesome-icon icon="magnifying-glass" class="drawer-search-icon" />
            <input
              type="text"
              :value="modelValue"
              placeholder="搜索文章内容..."
              class="drawer-search-input"
              @input="onSearch"
            />
            <div
              v-if="modelValue"
              class="drawer-search-clear"
              @click="emit('update:modelValue', '')"
            >
              <font-awesome-icon icon="circle-xmark" />
            </div>
          </div>
        </div>

        <!-- 分类 -->
        <div class="drawer-section">
          <div class="drawer-section-title">
            <font-awesome-icon icon="folder" style="opacity: 0.6;" />
            文章分类
          </div>
          <div class="drawer-cat-grid">
            <button
              v-for="cat in categories"
              :key="cat"
              class="drawer-cat-btn"
              :class="{ active: activeCategory === cat }"
              @click="emit('update:activeCategory', cat)"
            >
              <font-awesome-icon :icon="getCategoryIcon(cat)" class="cat-icon" />
              <span>{{ cat }}</span>
            </button>
          </div>
        </div>

        <!-- 排序 -->
        <div class="drawer-section">
          <div class="drawer-section-title">
            <font-awesome-icon icon="arrow-up-wide-short" style="opacity: 0.6;" />
            排序方式
          </div>
          <div class="drawer-sort-group">
            <button
              class="drawer-sort-btn"
              :class="{ active: activeSort === 'latest' }"
              @click="emit('update:activeSort', 'latest')"
            >
              <font-awesome-icon icon="clock" />
              <span>最新发布</span>
            </button>
            <button
              class="drawer-sort-btn"
              :class="{ active: activeSort === 'popular' }"
              @click="emit('update:activeSort', 'popular')"
            >
              <font-awesome-icon icon="fire" />
              <span>最多阅读</span>
            </button>
          </div>
        </div>

        <!-- 热门标签 -->
        <div class="drawer-section">
          <div class="drawer-section-title">
            <font-awesome-icon icon="fire" style="color: #f59e0b; opacity: 0.8;" />
            热门标签
          </div>
          <div class="drawer-tags-wrap">
            <button
              v-for="tag in currentTags"
              :key="tag"
              class="drawer-tag-chip"
              :class="{ active: modelValue === tag }"
              @click="emit('update:modelValue', modelValue === tag ? '' : tag)"
            >
              <span class="hash">#</span>
              <span>{{ tag }}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- 底部操作栏 -->
      <div class="drawer-footer">
        <button class="drawer-btn-reset" @click="resetAll">
          <font-awesome-icon icon="rotate-left" />
          清除筛选
        </button>
        <button class="drawer-btn-apply" @click="closeDrawer">
          <font-awesome-icon icon="check" />
          应用筛选
        </button>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick, onUnmounted } from "vue";
import { useThemeStore } from "@/stores/theme";

const themeStore = useThemeStore();
const isDark = computed(() => themeStore.isDark);

interface Props {
  categories: string[];
  activeCategory: string;
  activeSort: "latest" | "popular";
  modelValue?: string;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: "",
});

const emit = defineEmits<{
  (e: "update:activeCategory", value: string): void;
  (e: "update:activeSort", value: "latest" | "popular"): void;
  (e: "update:modelValue", value: string): void;
}>();

// ── 移动端检测 ──
const isMobile = ref(false);
const checkMobile = () => {
  isMobile.value = window.innerWidth <= 768;
};
onMounted(() => {
  checkMobile();
  window.addEventListener("resize", checkMobile);
});
onUnmounted(() => {
  window.removeEventListener("resize", checkMobile);
});

// ── 抽屉状态 ──
const isDrawerOpen = ref(false);
const hasActiveFilter = computed(() => {
  return props.activeCategory !== "全部" || props.activeSort !== "latest" || props.modelValue !== "";
});

const closeDrawer = () => {
  isDrawerOpen.value = false;
};

const resetAll = () => {
  emit("update:activeCategory", "全部");
  emit("update:activeSort", "latest");
  emit("update:modelValue", "");
};

// ── PC端胶囊动画 ──
const isFocused = ref(false);
const tabRefs = ref<HTMLElement[]>([]);
const pillStyle = ref({ transform: "translateX(0)", width: "0", opacity: 0 });

const setTabRef = (el: any, index: number) => {
  if (el) tabRefs.value[index] = el;
};

const updatePill = () => {
  nextTick(() => {
    const index = props.categories.indexOf(props.activeCategory);
    const el = tabRefs.value[index];
    if (el) {
      pillStyle.value = {
        opacity: 1,
        transform: `translateX(${el.offsetLeft}px)`,
        width: `${el.offsetWidth}px`,
      };
    }
  });
};

onMounted(() => {
  updatePill();
  window.addEventListener("resize", updatePill);
});

onUnmounted(() => {
  window.removeEventListener("resize", updatePill);
});

watch(() => props.activeCategory, updatePill);

const onSearch = (e: Event) => {
  emit("update:modelValue", (e.target as HTMLInputElement).value);
};

const getCategoryIcon = (cat: string) => {
  const map: Record<string, string> = {
    全部: "compass",
    前端: "code",
    后端: "server",
    设计: "palette",
    AI: "brain",
    工具: "wrench",
  };
  return map[cat] || "tag";
};

const currentTags = computed(() => {
  const tagsMap: Record<string, string[]> = {
    全部: ["JavaScript", "Python", "UI/UX", "Github", "Docker"],
    前端: ["Vue 3", "React", "TypeScript", "Tailwind", "Vite", "Pinia"],
    后端: ["Node.js", "SprintBoot", "Go", "Redis", "MySQL", "K8s"],
    设计: ["Figma", "UI/UX", "C4D", "Midjourney", "Blender"],
    AI: ["ChatGPT", "Claude", "Stable Diffusion", "DeepSeek", "Pytorch"],
    工具: ["VsCode", "Terminator", "Git", "Warp", "Obsidian"],
  };
  return tagsMap[props.activeCategory] || tagsMap.全部;
});
</script>

<style scoped lang="scss">
/* ═══════════════════════════════════════════
   PC 端：原始筛选面板样式（保持不变）
   ═══════════════════════════════════════════ */
.filter-dashboard-v7 {
  width: 100%;
  background: var(--bg-secondary, #ffffff);
  flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border-bottom: 1px solid rgba(0, 0, 0, 0.04);
}

.filter-primary-card {
  display: flex;
  flex-direction: column;
  padding: 16px;
  background: transparent;
  border-radius: 0;
  gap: 12px;

  @media (max-width: 950px) {
    padding: 12px;
    gap: 12px;
  }
}

.primary-row {
  display: flex;
  align-items: center;
  width: 100%;
  gap: 12px;
  flex-wrap: wrap;

  @media (max-width: 950px) {
    flex-direction: column;
    align-items: stretch;
  }
}

.row-divider {
  height: 1px;
  background: linear-gradient(to right, transparent, var(--border, #f1f5f9) 10%, var(--border, #f1f5f9) 90%, transparent);
  width: 100%;
  margin-bottom: 4px;
}

.category-segment {
  display: flex;
  position: relative;
  background: var(--bg, #f1f4f9);
  padding: 4px;
  border-radius: 10px;
  height: 40px;
  box-sizing: border-box;
  overflow-x: auto;
  scrollbar-width: none;
  width: auto;
  min-width: 0;
  flex-shrink: 0;
  &::-webkit-scrollbar {
    display: none;
  }

  @media (max-width: 768px) {
    width: 100%;
  }
}

.active-capsule {
  position: absolute;
  top: 4px;
  bottom: 4px;
  left: 0;
  background: var(--bg-secondary, #ffffff);
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s cubic-bezier(0.18, 0.89, 0.32, 1.28);
  z-index: 1;
}

.cat-item-btn {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 16px;
  border: none;
  background: transparent;
  color: var(--text-secondary, #64748b);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s ease;
  height: 100%;

  .btn-i {
    font-size: 11px;
    opacity: 0.6;
  }

  &.active {
    color: var(--primary, #3b82f6);
    font-weight: 700;
    .btn-i {
      opacity: 1;
      transform: scale(1.1);
    }
  }
}

.spacer {
  flex: 1;
}

.utility-group {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;

  @media (max-width: 950px) {
    width: 100%;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }
}

.search-field-v7 {
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
  width: 240px;
  height: 40px;
  padding: 0 12px;
  background: var(--bg, #f1f4f9);
  border: 1px solid transparent;
  border-radius: 10px;
  transition: background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
  box-sizing: border-box;
  flex-shrink: 0;

  .search-lead {
    font-size: 14px;
    color: #94a3b8;
    flex-shrink: 0;
    display: flex;
    align-items: center;
  }

  input {
    flex: 1;
    border: none;
    outline: none;
    background: transparent;
    font-size: 14px;
    color: var(--text, #1e293b);
    height: 100%;
    margin: 0;
    padding: 0;
    padding-right: 24px;
    &::placeholder {
      color: var(--text-tertiary, #94a3b8);
    }
  }

  .search-clear {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    border: none;
    background: transparent;
    color: #94a3b8;
    cursor: pointer;
    font-size: 14px;
    padding: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    &:hover {
      color: #ef4444;
    }
  }

  &.focused {
    background: var(--bg-secondary, #ffffff);
    border-color: var(--primary, #3b82f6);
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  @media (max-width: 950px) {
    width: 100%;
  }
}

.vertical-sep {
  width: 1px;
  height: 18px;
  background: #e2e8f0;

  @media (max-width: 950px) {
    display: none;
  }
}

.sort-selector-v7 {
  display: flex;
  background: var(--bg, #f1f4f9);
  padding: 4px;
  border-radius: 10px;
  height: 40px;
  box-sizing: border-box;
  flex-shrink: 0;
}

.sort-v7-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 0 14px;
  border: none;
  background: transparent;
  color: var(--text-secondary, #64748b);
  font-size: 13px;
  font-weight: 600;
  border-radius: 7px;
  cursor: pointer;
  height: 100%;
  transition: all 0.2s ease;
  white-space: nowrap;
  flex-shrink: 0;

  &.active {
    background: var(--bg-secondary, #ffffff);
    color: var(--primary, #3b82f6);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  }

  @media (max-width: 950px) {
    flex: 1;
    justify-content: center;
  }
}

.tags-recommendation-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 2px 0;
  width: 100%;
  min-width: 0;

  @media (max-width: 950px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
}

.tags-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 800;
  color: #64748b;
  white-space: nowrap;

  .fire-icon-box {
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #fffbeb;
    color: #f59e0b;
    border-radius: 6px;
    box-shadow: 0 2px 10px rgba(245, 158, 11, 0.1);
  }

  .fire-vibrate {
    animation: vibrate 0.5s infinite linear;
  }

  @keyframes vibrate {
    0% { transform: scale(1); }
    50% { transform: scale(1.1); }
    100% { transform: scale(1); }
  }
}

.tags-overflow-container {
  flex: 1;
  display: flex;
  gap: 8px;
  overflow-x: auto;
  scrollbar-width: none;
  width: 100%;
  min-width: 0;
  &::-webkit-scrollbar {
    display: none;
  }
}

.v7-tag-chip {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 5px 12px;
  background: var(--bg-secondary, #f8fafc);
  border: 1px solid var(--border, #eef2f6);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.02);

  .hash {
    color: #cbd5e1;
    font-weight: 700;
    transition: color 0.2s;
  }
  .tag-name {
    font-size: 12.5px;
    font-weight: 600;
    color: #64748b;
    transition: color 0.2s;
  }

  &:hover {
    background: #f1f5f9;
    border-color: #cbd5e1;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    .hash { color: var(--primary, #3b82f6); }
    .tag-name { color: var(--primary, #3b82f6); }
  }
}

/* PC端深色模式 */
.filter-primary-card.dark-mode {
  background: var(--bg-tertiary);

  .category-segment,
  .search-field-v7,
  .sort-selector-v7 {
    background: var(--bg);
  }

  .active-capsule,
  .sort-v7-btn.active {
    background: var(--border-dark);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
  }

  .cat-item-btn,
  .sort-v7-btn {
    color: var(--text-secondary);
    &.active { color: var(--primary-soft); }
  }

  .search-field-v7 {
    input {
      color: var(--text);
      &::placeholder { color: var(--text-tertiary); }
    }
    &.focused {
      background: var(--bg);
      border-color: var(--primary);
    }
  }

  .vertical-sep, .row-divider {
    background: var(--border-dark);
    opacity: 0.5;
  }

  .tags-label {
    color: var(--text-secondary);
    .fire-icon-box {
      background: rgba(245, 158, 11, 0.1);
      color: #f59e0b;
    }
  }

  .v7-tag-chip {
    background: var(--bg-tertiary);
    border-color: var(--border-dark);
    .tag-name { color: var(--text-secondary); }
    &:hover {
      background: var(--border-dark);
      border-color: var(--primary-soft);
      .tag-name, .hash { color: var(--primary-soft); }
    }
  }
}

/* ═══════════════════════════════════════════
   移动端：贴边 FAB 按钮
   ═══════════════════════════════════════════ */
.mobile-filter-fab {
  position: fixed;
  left: 0;
  bottom: 100px;
  width: 42px;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2px;
  background: rgba(255, 255, 255, 0.88);
  backdrop-filter: blur(16px) saturate(180%);
  -webkit-backdrop-filter: blur(16px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-left: none;
  border-radius: 0 14px 14px 0;
  color: var(--primary, #3b82f6);
  font-size: 16px;
  cursor: pointer;
  z-index: 900;
  box-shadow: 2px 0 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &.has-filter {
    width: 48px;
    height: 44px;
    box-shadow: 2px 0 16px rgba(0, 0, 0, 0.12);
  }

  &.dark-mode {
    background: rgba(30, 41, 59, 0.85);
    box-shadow: 2px 0 12px rgba(0, 0, 0, 0.25);
    color: #e2e8f0;

    &.has-filter {
      background: rgba(30, 41, 59, 0.92);
      box-shadow: 2px 0 16px rgba(0, 0, 0, 0.3);
    }
  }
}

.fab-dot {
  position: absolute;
  top: 6px;
  right: 6px;
  width: 7px;
  height: 7px;
  background: #ef4444;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.9);
}

/* ═══════════════════════════════════════════
   移动端：抽屉遮罩
   ═══════════════════════════════════════════ */
.mobile-drawer-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  z-index: 990;
}

.drawer-overlay-enter-active { transition: opacity 0.25s ease; }
.drawer-overlay-leave-active { transition: opacity 0.2s ease; }
.drawer-overlay-enter-from,
.drawer-overlay-leave-to { opacity: 0; }

/* ═══════════════════════════════════════════
   移动端：筛选抽屉
   ═══════════════════════════════════════════ */
.mobile-filter-drawer {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  max-height: 85vh;
  background: #ffffff;
  border-radius: 20px 20px 0 0;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  box-shadow: 0 -8px 40px rgba(0, 0, 0, 0.12);

  &.dark-mode {
    background: #1e293b;
    box-shadow: 0 -8px 40px rgba(0, 0, 0, 0.3);
  }
}

.drawer-slide-enter-active { transition: transform 0.35s cubic-bezier(0.32, 0.72, 0, 1); }
.drawer-slide-leave-active { transition: transform 0.25s ease-in; }
.drawer-slide-enter-from,
.drawer-slide-leave-to { transform: translateY(100%); }

.drawer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 20px 12px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);

  .drawer-title {
    font-size: 17px;
    font-weight: 700;
    color: var(--text, #1e293b);
  }

  .drawer-close {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    background: rgba(0, 0, 0, 0.06);
    border-radius: 50%;
    color: var(--text-secondary, #64748b);
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s;

    &:active {
      transform: scale(0.92);
      background: rgba(0, 0, 0, 0.1);
    }
  }

  .dark-mode & {
    border-bottom-color: rgba(255, 255, 255, 0.06);
    .drawer-title { color: #f1f5f9; }
    .drawer-close {
      background: rgba(255, 255, 255, 0.08);
      color: #94a3b8;
      &:active { background: rgba(255, 255, 255, 0.12); }
    }
  }
}

.drawer-body {
  flex: 1;
  overflow-y: auto;
  padding: 16px 20px;
  scrollbar-width: none;
  &::-webkit-scrollbar { display: none; }
}

.drawer-section {
  margin-bottom: 24px;

  &:last-child {
    margin-bottom: 8px;
  }
}

.drawer-section-title {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 700;
  color: var(--text-secondary, #64748b);
  margin-bottom: 12px;
  text-transform: uppercase;
  letter-spacing: 0.03em;

  .dark-mode & {
    color: #94a3b8;
  }
}

/* 抽屉内搜索 */
.drawer-search {
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
  height: 42px;
  padding: 0 14px;
  background: var(--bg, #f1f4f9);
  border: 1px solid transparent;
  border-radius: 12px;
  transition: all 0.2s;

  .drawer-search-icon {
    font-size: 14px;
    color: #94a3b8;
    flex-shrink: 0;
  }

  .drawer-search-input {
    flex: 1;
    border: none;
    outline: none;
    background: transparent;
    font-size: 14px;
    color: var(--text, #1e293b);
    height: 100%;
    padding: 0;
    &::placeholder { color: var(--text-tertiary, #94a3b8); }
  }

  .drawer-search-clear {
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    background: transparent;
    color: #94a3b8;
    cursor: pointer;
    font-size: 14px;
    padding: 4px;
    &:active { color: #ef4444; }
  }

  .dark-mode & {
    background: rgba(15, 23, 42, 0.6);
    .drawer-search-input { color: #f1f5f9; }
  }
}

/* 抽屉内分类 */
.drawer-cat-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

.drawer-cat-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 14px 8px;
  border: 1px solid rgba(0, 0, 0, 0.06);
  background: rgba(0, 0, 0, 0.02);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
  min-height: 72px;

  .cat-icon {
    font-size: 18px;
    color: var(--text-tertiary, #94a3b8);
    transition: color 0.2s;
  }

  span {
    font-size: 12.5px;
    font-weight: 600;
    color: var(--text-secondary, #64748b);
    transition: color 0.2s;
  }

  &.active {
    background: rgba(59, 130, 246, 0.08);
    border-color: rgba(59, 130, 246, 0.25);
    .cat-icon { color: var(--primary, #3b82f6); }
    span { color: var(--primary, #3b82f6); font-weight: 700; }
  }

  &:active {
    transform: scale(0.96);
  }

  .dark-mode & {
    background: rgba(255, 255, 255, 0.04);
    border-color: rgba(255, 255, 255, 0.06);
    .cat-icon { color: #64748b; }
    span { color: #94a3b8; }

    &.active {
      background: rgba(59, 130, 246, 0.15);
      border-color: rgba(59, 130, 246, 0.3);
      .cat-icon { color: #60a5fa; }
      span { color: #60a5fa; }
    }
  }
}

/* 抽屉内排序 */
.drawer-sort-group {
  display: flex;
  gap: 8px;
}

.drawer-sort-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 12px 14px;
  border: 1px solid rgba(0, 0, 0, 0.06);
  background: rgba(0, 0, 0, 0.02);
  border-radius: 12px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
  color: var(--text-secondary, #64748b);
  transition: all 0.2s;

  &.active {
    background: rgba(59, 130, 246, 0.08);
    border-color: rgba(59, 130, 246, 0.25);
    color: var(--primary, #3b82f6);
  }

  &:active {
    transform: scale(0.96);
  }

  .dark-mode & {
    background: rgba(255, 255, 255, 0.04);
    border-color: rgba(255, 255, 255, 0.06);
    color: #94a3b8;

    &.active {
      background: rgba(59, 130, 246, 0.15);
      border-color: rgba(59, 130, 246, 0.3);
      color: #60a5fa;
    }
  }
}

/* 抽屉内热门标签 */
.drawer-tags-wrap {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.drawer-tag-chip {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px 14px;
  background: rgba(0, 0, 0, 0.02);
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 20px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
  color: var(--text-secondary, #64748b);
  transition: all 0.2s;

  .hash {
    color: #cbd5e1;
    font-weight: 700;
  }

  &.active {
    background: rgba(59, 130, 246, 0.08);
    border-color: rgba(59, 130, 246, 0.25);
    color: var(--primary, #3b82f6);
    .hash { color: var(--primary, #3b82f6); }
  }

  &:active {
    transform: scale(0.95);
  }

  .dark-mode & {
    background: rgba(255, 255, 255, 0.04);
    border-color: rgba(255, 255, 255, 0.06);
    color: #94a3b8;
    .hash { color: #475569; }

    &.active {
      background: rgba(59, 130, 246, 0.15);
      border-color: rgba(59, 130, 246, 0.3);
      color: #60a5fa;
      .hash { color: #60a5fa; }
    }
  }
}

/* 抽屉底部操作栏 */
.drawer-footer {
  display: flex;
  gap: 10px;
  padding: 16px 20px;
  padding-bottom: calc(16px + env(safe-area-inset-bottom));
  border-top: 1px solid rgba(0, 0, 0, 0.06);
  background: inherit;
}

.drawer-btn-reset {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 13px 16px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  background: transparent;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-secondary, #64748b);
  cursor: pointer;
  transition: all 0.2s;

  &:active {
    transform: scale(0.97);
    background: rgba(0, 0, 0, 0.04);
  }

  .dark-mode & {
    border-color: rgba(255, 255, 255, 0.08);
    color: #94a3b8;
    &:active { background: rgba(255, 255, 255, 0.06); }
  }
}

.drawer-btn-apply {
  flex: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 13px 16px;
  border: none;
  background: var(--primary, #3b82f6);
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  color: #ffffff;
  cursor: pointer;
  transition: all 0.2s;

  &:active {
    transform: scale(0.97);
    opacity: 0.9;
  }

  .dark-mode & {
    background: #3b82f6;
  }
}
</style>

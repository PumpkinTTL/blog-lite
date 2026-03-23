<template>
  <div class="filter-dashboard-v7">
    <!-- Main Card Container (Now wraps both rows) -->
    <div class="filter-primary-card" :class="{ 'dark-mode': isDark }">
      <!-- Top Row: Categories, Search, and Sort -->
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
          <!-- Robust Search with Clear & CMD+K -->
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
            <div v-if="!modelValue" class="kbd-hint">
              <span class="kbd-symbol">⌘</span>
              <span class="kbd-key">K</span>
            </div>
            <button
              v-else
              class="search-clear"
              @click="emit('update:modelValue', '')"
            >
              <font-awesome-icon icon="circle-xmark" />
            </button>
          </div>

          <div class="vertical-sep"></div>

          <!-- Segmented Sort Controller -->
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

      <!-- Subtle Divider -->
      <div class="row-divider"></div>

      <!-- Bottom Row: Popular Tags (Optimized Tags) -->
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
.filter-dashboard-v7 {
  width: 100%;
  margin: 16px 0 24px;
  position: sticky;
  top: 72px;
  z-index: 100;
}

.filter-primary-card {
  display: flex;
  flex-direction: column;
  padding: 16px;
  background: var(--bg-secondary, #ffffff);
  border: 1px solid var(--border, #eef2f6);
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.04);
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

  @media (max-width: 950px) {
    flex-direction: column;
    align-items: stretch;
  }
}

.row-divider {
  height: 1px;
  background: linear-gradient(to right, transparent, #f1f5f9 10%, #f1f5f9 90%, transparent);
  width: 100%;
}

/* ── Category Segment ── */
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

  @media (max-width: 950px) {
    width: 100%;
  }
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }
}

/* ── Enhanced Search ── */
.search-field-v7 {
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
  width: 280px;
  height: 40px;
  padding: 0 20px;
  background: var(--bg, #f1f4f9);
  border: 1px solid transparent;
  border-radius: 10px;
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1), background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
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
    &::placeholder {
      color: var(--text-tertiary, #94a3b8);
    }
  }

  .kbd-hint {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 2px;
    font-size: 11px;
    font-weight: 700;
    color: var(--text-tertiary, #94a3b8);
    background: var(--bg-secondary, #ffffff);
    border: 1px solid var(--border);
    padding: 2px 5px;
    border-radius: 5px;
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);
    flex-shrink: 0;

    .kbd-symbol {
      font-size: 12px;
      line-height: 1;
    }

    @media (max-width: 768px) {
      display: none;
    }
  }

  .search-clear {
    border: none;
    background: transparent;
    color: #94a3b8;
    cursor: pointer;
    font-size: 14px;
    padding: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    &:hover {
      color: #ef4444;
    }
  }

  &.focused {
    background: var(--bg-secondary, #ffffff);
    border-color: var(--primary, #3b82f6);
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    
    @media (min-width: 951px) {
      width: 320px;
    }
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

/* ── Enhanced Sort ── */
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

/* ── Specialized Tags Recommendation ── */
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
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.1);
    }
    100% {
      transform: scale(1);
    }
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

    .hash {
      color: var(--primary, #3b82f6);
    }
    .tag-name {
      color: var(--primary, #3b82f6);
    }
  }
}

/* ── Dark Mode Adaptations ── */
.filter-primary-card.dark-mode {
  background: var(--bg-tertiary);
  border-color: var(--border-dark);
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.4);

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
    &.active {
      color: var(--primary-soft);
    }
  }

  .search-field-v7 {
    input {
      color: var(--text);
      &::placeholder {
        color: var(--text-tertiary);
      }
    }
    .kbd-hint {
      background: var(--border-dark);
      border-color: var(--border-dark);
      color: var(--text-tertiary);
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
    .tag-name {
      color: var(--text-secondary);
    }
    &:hover {
      background: var(--border-dark);
      border-color: var(--primary-soft);
      .tag-name, .hash {
        color: var(--primary-soft);
      }
    }
  }
}
</style>

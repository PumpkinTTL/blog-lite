<template>
  <div class="filter-dashboard-v7">
    <!-- Primary Filter Row (White Card) -->
    <div class="filter-primary-card">
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

    <!-- Secondary Recommendation Row (Optimized Tags) -->
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
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick, onUnmounted } from "vue";

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
  align-items: center;
  padding: 8px 16px;
  background: #ffffff;
  border: 1px solid #eef2f6;
  border-radius: 14px;
  box-shadow: 0 4px 18px rgba(0, 0, 0, 0.04);

  @media (max-width: 950px) {
    flex-direction: column;
    height: auto;
    padding: 12px;
    gap: 12px;
  }
}

/* ── Category Segment ── */
.category-segment {
  display: flex;
  position: relative;
  background: #f1f4f9;
  padding: 4px;
  border-radius: 11px;
}

.active-capsule {
  position: absolute;
  top: 4px;
  bottom: 4px;
  left: 0;
  background: #ffffff;
  border-radius: 8px;
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
  padding: 9px 18px;
  border: none;
  background: transparent;
  color: #64748b;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s ease;

  .btn-i {
    font-size: 11px;
    opacity: 0.6;
  }

  &.active {
    color: #4f46e5;
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
}

/* ── Enhanced Search ── */
.search-field-v7 {
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
  width: 260px;
  height: 40px;
  padding: 0 14px;
  background: #f1f4f9;
  border: 1px solid transparent;
  border-radius: 10px;
  transition: all 0.3s ease;

  .search-lead {
    font-size: 13px;
    color: #94a3b8;
  }

  input {
    flex: 1;
    border: none;
    outline: none;
    background: transparent;
    font-size: 13px;
    color: #1e293b;
    &::placeholder {
      color: #94a3b8;
    }
  }

  .kbd-hint {
    display: flex;
    align-items: center;
    gap: 2px;
    font-size: 11px;
    font-weight: 700;
    color: #94a3b8;
    background: #ffffff;
    border: 1px solid #e2e8f0;
    padding: 2px 4px;
    border-radius: 5px;
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);

    .kbd-symbol {
      font-size: 12px;
    }
  }

  .search-clear {
    border: none;
    background: transparent;
    color: #94a3b8;
    cursor: pointer;
    font-size: 14px;
    padding: 4px;
    &:hover {
      color: #ef4444;
    }
  }

  &.focused {
    background: #ffffff;
    border-color: #4f46e5;
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
    width: 300px;
  }
}

.vertical-sep {
  width: 1px;
  height: 18px;
  background: #e2e8f0;
}

/* ── Enhanced Sort ── */
.sort-selector-v7 {
  display: flex;
  background: #f1f4f9;
  padding: 3px;
  border-radius: 9px;
  height: 38px;
}

.sort-v7-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 0 12px;
  border: none;
  background: transparent;
  color: #64748b;
  font-size: 12.5px;
  font-weight: 600;
  border-radius: 7px;
  cursor: pointer;
  transition: all 0.2s ease;

  &.active {
    background: #ffffff;
    color: #4f46e5;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  }
}

/* ── Specialized Tags Recommendation ── */
.tags-recommendation-bar {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: 10px;
  padding: 0 4px;
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
  &::-webkit-scrollbar {
    display: none;
  }
}

.v7-tag-chip {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 14px;
  background: #ffffff;
  border: 1px solid #eef2f6;
  border-radius: 30px;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.18, 0.89, 0.32, 1.28);
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
    background: #f5f3ff;
    border-color: #4f46e5;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(79, 70, 229, 0.15);

    .hash {
      color: #4f46e5;
    }
    .tag-name {
      color: #4f46e5;
    }
  }
}
</style>

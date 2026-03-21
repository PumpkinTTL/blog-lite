<template>
  <div class="filter-bar-final">
    <div class="filter-content">
      <!-- Left: Navigation with sliding pill -->
      <div class="nav-segment">
        <div class="active-pill" :style="pillStyle"></div>
        <button
          v-for="(cat, index) in categories"
          :key="cat"
          :ref="el => setTabRef(el, index)"
          class="nav-tab"
          :class="{ active: activeCategory === cat }"
          @click="emit('update:activeCategory', cat)"
        >
          <div class="icon-wrapper">
             <font-awesome-icon :icon="getCategoryIcon(cat)" />
          </div>
          <span>{{ cat }}</span>
        </button>
      </div>

      <div class="flex-grow"></div>

      <!-- Right: Search & Sort Tools -->
      <div class="tools-segment">
        <div class="search-input-box" :class="{ focused: isFocused }">
          <font-awesome-icon icon="search" class="s-icon" />
          <input
            type="text"
            :value="modelValue"
            placeholder="探你所想..."
            @input="onSearch"
            @focus="isFocused = true"
            @blur="isFocused = false"
          />
          <button v-if="modelValue" class="clear-btn" @click="emit('update:modelValue', '')">
            <font-awesome-icon icon="xmark" />
          </button>
        </div>

        <div class="sort-toggle-box">
          <button
            class="toggle-btn"
            :class="{ active: activeSort === 'latest' }"
            @click="emit('update:activeSort', 'latest')"
            title="最新"
          >
            <font-awesome-icon icon="clock" />
          </button>
          <button
            class="toggle-btn"
            :class="{ active: activeSort === 'popular' }"
            @click="emit('update:activeSort', 'popular')"
            title="热门"
          >
            <font-awesome-icon icon="fire" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, nextTick, onUnmounted } from "vue";

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
const pillStyle = ref({ opacity: 0, transform: "translateX(0)", width: "0" });

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
  window.addEventListener('resize', updatePill);
});

onUnmounted(() => {
  window.removeEventListener('resize', updatePill);
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
</script>

<style scoped lang="scss">
.filter-bar-final {
  width: 100%;
  margin: 12px 0;
  position: sticky;
  top: 72px;
  z-index: 100;
}

.filter-content {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 16px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);

  @media (max-width: 900px) {
    flex-direction: column;
    padding: 12px;
    height: auto;
  }
}

/* ── Navigation ── */
.nav-segment {
  display: flex;
  position: relative;
  background: #f1f5f9;
  padding: 4px;
  border-radius: 10px;
  
  @media (max-width: 600px) {
    width: 100%;
    overflow-x: auto;
    &::-webkit-scrollbar { display: none; }
  }
}

.active-pill {
  position: absolute;
  top: 4px;
  bottom: 4px;
  left: 0;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s cubic-bezier(0.18, 0.89, 0.32, 1.28);
  z-index: 1;
}

.nav-tab {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border: none;
  background: transparent;
  color: #64748b;
  font-size: 13.5px;
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s ease;

  .icon-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: transparent;
    transition: all 0.2s ease;
    
    svg { font-size: 12px; }
  }

  &.active {
    color: #4f46e5;
    font-weight: 600;
    
    .icon-wrapper {
      background: #eef2ff;
      color: #4f46e5;
    }
  }

  &:hover:not(.active) {
    color: #1e293b;
    .icon-wrapper { background: #e2e8f0; }
  }
}

.flex-grow { flex: 1; }

/* ── Tools ── */
.tools-segment {
  display: flex;
  align-items: center;
  gap: 12px;
  
  @media (max-width: 900px) {
    width: 100%;
    justify-content: space-between;
  }
}

.search-input-box {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 200px;
  height: 40px;
  padding: 0 12px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  transition: all 0.3s ease;

  .s-icon { font-size: 14px; color: #94a3b8; }

  input {
    flex: 1;
    border: none;
    outline: none;
    background: transparent;
    font-size: 13px;
    color: #1e293b;
    &::placeholder { color: #94a3b8; }
  }

  .clear-btn {
    border: none;
    background: transparent;
    padding: 0 4px;
    color: #94a3b8;
    cursor: pointer;
    &:hover { color: #ef4444; }
  }

  &:hover { border-color: #cbd5e1; }

  &.focused {
    background: white;
    border-color: #4f46e5;
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
    min-width: 260px;
    
    .s-icon { color: #4f46e5; }
  }
}

.sort-toggle-box {
  display: flex;
  background: #f1f5f9;
  padding: 4px;
  border-radius: 10px;
  height: 40px;
}

.toggle-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  color: #64748b;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover { color: #1e293b; background: rgba(0,0,0,0.05); }

  &.active {
    background: white;
    color: #4f46e5;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
}
</style>

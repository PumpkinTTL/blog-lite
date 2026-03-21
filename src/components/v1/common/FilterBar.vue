<template>
  <div class="nav-filter-bar">
    <div class="nav-filter-container">
      <!-- Left: Category Tabs -->
      <nav class="categories-nav">
        <button
          v-for="cat in categories"
          :key="cat"
          class="category-tab"
          :class="{ active: activeCategory === cat }"
          @click="emit('update:activeCategory', cat)"
        >
          <span class="tab-label">{{ cat }}</span>
          <div class="tab-indicator" v-if="activeCategory === cat"></div>
        </button>
      </nav>

      <div class="spacer"></div>

      <!-- Right: Search & Sort Group -->
      <div class="actions-group">
        <!-- Modern Search Pill -->
        <div class="search-pill" :class="{ focused: isFocused }">
          <font-awesome-icon icon="search" class="search-icon" />
          <input
            type="text"
            :value="modelValue"
            placeholder="探你所想..."
            @input="onInput"
            @focus="isFocused = true"
            @blur="isFocused = false"
          />
        </div>

        <!-- Compact Sort Control -->
        <div class="sort-pills">
          <button
            class="sort-btn"
            :class="{ active: activeSort === 'latest' }"
            @click="emit('update:activeSort', 'latest')"
            title="最新"
          >
            <font-awesome-icon icon="clock" />
          </button>
          <button
            class="sort-btn"
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
import { ref } from "vue";

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

const onInput = (e: Event) => {
  emit("update:modelValue", (e.target as HTMLInputElement).value);
};
</script>

<style scoped lang="scss">
.nav-filter-bar {
  width: 100%;
  margin: 8px 0;
  // Use sticky to stay visible when scrolling past header
  position: sticky;
  top: 72px;
  z-index: 40;
}

.nav-filter-container {
  display: flex;
  align-items: center;
  height: 56px;
  padding: 0 16px;
  background: var(--surface);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
  
  @media (max-width: 800px) {
    height: auto;
    flex-direction: column;
    padding: 12px;
    gap: 12px;
  }
}

.categories-nav {
  display: flex;
  align-items: center;
  gap: 24px;
  height: 100%;

  @media (max-width: 800px) {
    width: 100%;
    overflow-x: auto;
    padding-bottom: 4px;
    gap: 20px;
    &::-webkit-scrollbar { display: none; }
    scrollbar-width: none;
  }
}

.category-tab {
  position: relative;
  height: 100%;
  display: flex;
  align-items: center;
  padding: 0 4px;
  border: none;
  background: transparent;
  color: var(--text-secondary);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;

  &:hover {
    color: var(--text);
  }

  &.active {
    color: var(--primary);
    font-weight: 600;
  }
}

.tab-indicator {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--primary);
  border-radius: 99px;
  box-shadow: 0 1px 4px rgba(99, 102, 241, 0.2);
}

.spacer {
  flex: 1;
}

.actions-group {
  display: flex;
  align-items: center;
  gap: 16px;

  @media (max-width: 800px) {
    width: 100%;
    justify-content: space-between;
  }
}

.search-pill {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 240px;
  height: 38px;
  padding: 0 14px;
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 20px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  .search-icon {
    font-size: 13px;
    color: var(--text-tertiary);
  }

  input {
    flex: 1;
    border: none;
    outline: none;
    background: transparent;
    font-size: 13px;
    color: var(--text);
    &::placeholder { color: var(--text-tertiary); }
  }

  &.focused {
    width: 280px;
    background: var(--surface);
    border-color: var(--primary);
    box-shadow: 0 0 0 4px var(--primary-light);
    
    .search-icon { color: var(--primary); }
  }

  @media (max-width: 600px) {
    width: 100%;
    &.focused { width: 100%; }
  }
}

.sort-pills {
  display: flex;
  background: var(--bg);
  padding: 3px;
  border-radius: 8px;
  gap: 2px;
}

.sort-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  color: var(--text-secondary);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 13px;

  &:hover {
    color: var(--text);
    background: rgba(0, 0, 0, 0.05);
  }

  &.active {
    background: var(--surface);
    color: var(--primary);
    box-shadow: var(--shadow-sm);
  }
}
</style>

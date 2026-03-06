<template>
  <nav class="mobile-bottom-nav">
    <button
      v-for="item in navItems"
      :key="item.id"
      class="nav-item"
      :class="{ active: activeItem === item.id, center: item.center }"
      @click="handleClick(item.id)"
    >
      <font-awesome-icon :icon="['fas', item.icon]" class="nav-icon" />
      <span class="nav-label">{{ item.label }}</span>
    </button>
  </nav>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{
  (e: 'navigate', id: string): void
}>()

const activeItem = ref('home')

const navItems = [
  { id: 'home', label: '首页', icon: 'house', center: false },
  { id: 'categories', label: '分类', icon: 'grip', center: false },
  { id: 'add', label: '发布', icon: 'plus', center: true },
  { id: 'bookmarks', label: '收藏', icon: 'bookmark', center: false },
  { id: 'profile', label: '我的', icon: 'user', center: false }
]

const handleClick = (id: string) => {
  activeItem.value = id
  emit('navigate', id)
}
</script>

<style scoped lang="scss">
.mobile-bottom-nav {
  display: none;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: var(--surface);
  border-top: 1px solid var(--border);
  padding: 8px 8px calc(8px + env(safe-area-inset-bottom));
  z-index: 1000;
  backdrop-filter: blur(8px);
  background: rgba(255, 255, 255, 0.95);

  [data-theme='dark'] & {
    background: rgba(24, 24, 27, 0.95);
  }

  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: space-around;
  }
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 8px 12px;
  background: transparent;
  border-radius: var(--r-sm);
  color: var(--text-3);
  transition: all var(--ease);
  flex: 1;
  max-width: 80px;

  &.center {
    position: relative;
    margin-top: -20px;

    .nav-icon {
      width: 56px;
      height: 56px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--accent);
      color: white;
      border-radius: var(--r-lg);
      font-size: 24px;
      box-shadow: var(--shadow-lg);
    }

    .nav-label {
      margin-top: 4px;
    }
  }

  &:not(.center) {
    &:active {
      transform: scale(0.95);
    }

    &.active {
      color: var(--accent);

      .nav-icon {
        transform: scale(1.1);
      }
    }

    &:hover:not(.active) {
      color: var(--text-2);
    }
  }
}

.nav-icon {
  font-size: 20px;
  transition: transform var(--ease);
}

.nav-label {
  font-size: 11px;
  font-weight: 500;
}
</style>

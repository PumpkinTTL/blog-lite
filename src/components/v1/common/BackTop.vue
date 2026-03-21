<template>
  <Transition name="backtop">
    <button
      v-show="visible"
      class="backtop-btn"
      :class="{ 'dark-mode': isDark }"
      @click="scrollToTop"
    >
      <font-awesome-icon icon="arrow-up" class="arrow-icon" />
    </button>
  </Transition>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useThemeStore } from "@/stores/theme";

const themeStore = useThemeStore();
const isDark = computed(() => themeStore.isDark);

const visible = ref(false);
const SCROLL_THRESHOLD = 300;

const handleScroll = () => {
  visible.value = window.scrollY > SCROLL_THRESHOLD;
};

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

onMounted(() => {
  window.addEventListener("scroll", handleScroll);
  handleScroll(); // 初始检查
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>

<style scoped lang="scss">
.backtop-btn {
  position: fixed;
  bottom: 40px;
  right: 40px;
  width: 44px;
  height: 44px;
  border: 1px solid var(--border, #e5e7eb);
  border-radius: 12px;
  background: var(--bg-secondary, #ffffff);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.25s ease;
  z-index: 999;

  .arrow-icon {
    font-size: 16px;
    color: var(--text-secondary, #64748b);
  }

  &:hover {
    border-color: var(--primary, #6366f1);
    background: var(--bg-secondary, #ffffff);

    .arrow-icon {
      color: var(--primary, #6366f1);
    }
  }

  &:active {
    transform: scale(0.95);
  }

  @media (max-width: 768px) {
    bottom: 24px;
    right: 24px;
    width: 40px;
    height: 40px;
  }
}

.backtop-btn.dark-mode {
  background: var(--bg-secondary, #1e293b);
  border-color: var(--border, #334155);

  .arrow-icon {
    color: var(--text-secondary, #94a3b8);
  }

  &:hover {
    background: var(--bg-secondary, #1e293b);
    border-color: var(--primary-soft, #818cf8);

    .arrow-icon {
      color: var(--primary-soft, #818cf8);
    }
  }
}

// Fade transition
.backtop-enter-active,
.backtop-leave-active {
  transition: all 0.25s ease;
}

.backtop-enter-from,
.backtop-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>

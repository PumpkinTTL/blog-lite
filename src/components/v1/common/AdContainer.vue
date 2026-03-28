<template>
  <div
    class="ad-container"
    :class="[
      `is-${type}`,
      { 'dark-mode': isDark }
    ]"
  >
    <div class="ad-inner">
      <div class="ad-badge">广告</div>

      <!-- Slot for custom ad content (e.g. iframe, banner) -->
      <div class="ad-slot-wrapper" :class="{ 'no-padding': $slots.default }">
        <slot>
          <div class="ad-content">
            <div class="ad-icon" v-if="image">
              <img :src="image" :alt="title" class="ad-image" />
            </div>
            <div class="ad-icon" v-else-if="icon">
              <font-awesome-icon :icon="icon" />
            </div>
            <div class="ad-text">
              <h4 class="ad-title">{{ title }}</h4>
              <p class="ad-desc">{{ description }}</p>
            </div>
          </div>

          <button class="ad-btn" @click="$emit('click')">
            {{ buttonText }}
            <font-awesome-icon icon="arrow-right" class="btn-arrow" />
          </button>
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useThemeStore } from "@/stores/theme";

interface Props {
  title?: string;
  description?: string;
  buttonText?: string;
  icon?: string;
  image?: string;
  type?: "default" | "glass";
}

withDefaults(defineProps<Props>(), {
  title: "探索无限可能",
  description: "加入我们的开发者社区，获取最新技术资讯与独家资源。",
  buttonText: "了解详情",
  icon: "gem",
  type: "default",
});

defineEmits(["click"]);

const themeStore = useThemeStore();
const isDark = computed(() => themeStore.isDark);
</script>

<style scoped lang="scss">
.ad-container {
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  background: #fff;
  border: 1px solid rgba(226, 232, 240, 0.8);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04),
    0 8px 24px -8px rgba(15, 23, 42, 0.06);
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1),
    box-shadow 0.3s ease,
    background 0.3s ease,
    border-color 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06),
      0 16px 40px -8px rgba(15, 23, 42, 0.12);
    .btn-arrow { transform: translateX(4px); }
  }

  // ── glass ──
  &.is-glass {
    background: rgba(255, 255, 255, 0.6);
    backdrop-filter: blur(12px);
    border-color: rgba(226, 232, 240, 0.5);
  }

  // ── dark mode ──
  &.dark-mode {
    background: #1e293b;
    border-color: rgba(51, 65, 85, 0.6);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1),
      0 8px 24px -8px rgba(0, 0, 0, 0.25);

    &:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15),
        0 16px 40px -8px rgba(0, 0, 0, 0.35);
    }

    .ad-title { color: #f1f5f9; }
    .ad-desc { color: #94a3b8; }
    .ad-badge {
      background: rgba(0, 0, 0, 0.35);
      border-color: rgba(255, 255, 255, 0.08);
    }
    .ad-icon {
      background: rgba(59, 130, 246, 0.15);
      color: #60a5fa;
    }

    &.is-glass {
      background: rgba(30, 41, 59, 0.7);
      backdrop-filter: blur(16px);
      border-color: rgba(51, 65, 85, 0.4);
    }
  }
}

.ad-inner {
  position: relative;
  background: transparent;
  border-radius: 15px;
  height: 100%;
  display: flex;
  flex-direction: column;
  z-index: 1;
  overflow: hidden;
}

.ad-slot-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 24px;
  gap: 20px;

  &.no-padding {
    padding: 0;
    gap: 0;
  }
}

:deep(iframe) {
  width: 100% !important;
  height: auto !important;
  aspect-ratio: 16 / 9;
  display: block;
}

.ad-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 9px;
  font-weight: 800;
  color: rgba(255, 255, 255, 0.9);
  background: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 3px 8px;
  border-radius: 6px;
  letter-spacing: 0.08em;
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  pointer-events: none;
  text-transform: uppercase;
}

.ad-content {
  display: flex;
  gap: 16px;
  align-items: flex-start;
}

.ad-icon {
  width: 44px;
  height: 44px;
  background: rgba(59, 130, 246, 0.08);
  color: var(--primary, #3b82f6);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  flex-shrink: 0;
  overflow: hidden;
  transition: background 0.3s, color 0.3s;
}

.ad-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 12px;
}

.ad-text { flex: 1; }

.ad-title {
  margin: 0 0 6px;
  font-size: 16px;
  font-weight: 700;
  color: #1f2937;
  line-height: 1.4;
  transition: color 0.3s;
}

.ad-desc {
  margin: 0;
  font-size: 13px;
  color: #6b7280;
  line-height: 1.6;
  transition: color 0.3s;
}

.ad-btn {
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 12px;
  background: #1f2937;
  color: #fff;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.3s ease;

  .btn-arrow {
    font-size: 11px;
    transition: transform 0.3s ease;
  }

  &:hover {
    background: var(--primary, #3b82f6);
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(59, 130, 246, 0.3);
  }

  .dark-mode & {
    background: var(--primary, #3b82f6);
    box-shadow: 0 4px 14px rgba(59, 130, 246, 0.35);

    &:hover {
      background: #60a5fa;
    }
  }
}

@keyframes float {
  from { transform: translate(0, 0); }
  to { transform: translate(20px, 20px); }
}

@media (max-width: 640px) {
  .ad-slot-wrapper:not(.no-padding) { padding: 18px; }
  .ad-icon { width: 36px; height: 36px; font-size: 16px; }
  .ad-title { font-size: 15px; }
  .ad-desc { font-size: 12px; }
}
</style>

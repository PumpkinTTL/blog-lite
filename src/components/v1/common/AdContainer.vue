<template>
  <div
    class="ad-container"
    :class="{ 'is-glass': type === 'glass', 'is-dark': type === 'dark' }"
  >
    <div class="ad-inner">
      <div class="ad-badge">广告</div>

      <!-- Slot for custom ad content (e.g. iframe, banner) -->
      <div class="ad-slot-wrapper" :class="{ 'no-padding': $slots.default }">
        <slot>
          <div class="ad-content">
            <div class="ad-icon" v-if="icon">
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

      <!-- Background Decorations -->
      <div class="glow-sphere"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title?: string;
  description?: string;
  buttonText?: string;
  icon?: string;
  type?: "default" | "glass" | "dark";
}

withDefaults(defineProps<Props>(), {
  title: "探索无限可能",
  description: "加入我们的开发者社区，获取最新技术资讯与独家资源。",
  buttonText: "立即加入",
  icon: "rocket",
  type: "default",
});

defineEmits(["click"]);
</script>

<style scoped lang="scss">
.ad-container {
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
  padding: 1px; /* Border effect */
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  cursor: pointer;

  &:hover {
    transform: translateY(-4px);
    .btn-arrow {
      transform: translateX(4px);
    }
    .glow-sphere {
      transform: scale(1.2) translate(-10%, -10%);
      opacity: 0.6;
    }
  }

  &.is-glass {
    background: rgba(255, 255, 255, 0.7);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.3);
    .ad-title {
      color: #111827;
    }
    .ad-desc {
      color: #4b5563;
    }
    .ad-inner {
      background: transparent;
    }
    .ad-btn {
      background: #111827;
      color: #fff;
    }
  }

  &.is-dark {
    background: #111827;
    .ad-inner {
      background: #111827;
    }
    .ad-inner::before {
      content: "";
      position: absolute;
      inset: 0;
      background: radial-gradient(
        circle at 0% 0%,
        rgba(99, 102, 241, 0.15) 0%,
        transparent 50%
      );
    }
  }
}

.ad-inner {
  position: relative;
  background: #fff;
  background-image: radial-gradient(
      at 0% 0%,
      rgba(99, 102, 241, 0.05) 0px,
      transparent 50%
    ),
    radial-gradient(at 100% 100%, rgba(168, 85, 247, 0.05) 0px, transparent 50%);
  border-radius: 15px;
  padding: 0px;
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
  padding: 24px; /* Move padding here by default */
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
  background: rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  padding: 3px 8px;
  border-radius: 6px;
  letter-spacing: 0.08em;
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
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
  background: linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%);
  color: #4f46e5;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  flex-shrink: 0;
}

.ad-text {
  flex: 1;
}

.ad-title {
  margin: 0 0 6px;
  font-size: 16px;
  font-weight: 700;
  color: #1f2937;
  line-height: 1.4;
}

.ad-desc {
  margin: 0;
  font-size: 13px;
  color: #6b7280;
  line-height: 1.6;
}

.ad-btn {
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 12px;
  background: #111827;
  color: #fff;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

  .btn-arrow {
    font-size: 11px;
    transition: transform 0.3s ease;
  }

  &:hover {
    background: #4f46e5;
    transform: translateY(-2px) scale(1.02);
    box-shadow: 0 8px 20px rgba(79, 70, 229, 0.3);
  }
}

.glow-sphere {
  position: absolute;
  top: -20px;
  left: -20px;
  width: 120px;
  height: 120px;
  background: radial-gradient(
    circle,
    rgba(99, 102, 241, 0.15) 0%,
    transparent 70%
  );
  filter: blur(30px);
  z-index: -1;
  animation: float 6s ease-in-out infinite alternate;
}

@keyframes float {
  from {
    transform: translate(0, 0);
  }
  to {
    transform: translate(20px, 20px);
  }
}

/* Responsive adjustment */
@media (max-width: 640px) {
  .ad-slot-wrapper:not(.no-padding) {
    padding: 18px;
  }
  .ad-icon {
    width: 36px;
    height: 36px;
    font-size: 16px;
  }
  .ad-title {
    font-size: 15px;
  }
  .ad-desc {
    font-size: 12px;
  }
}
</style>

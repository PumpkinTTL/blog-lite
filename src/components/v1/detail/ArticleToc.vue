<template>
  <aside
    class="premium-toc"
    :class="{ 'is-dark': isDark, 'is-mobile': mobile }"
  >
    <div class="toc-container" :class="{ 'sticky-wrapper': !mobile }">
      <!-- Minimalist Header -->
      <div v-if="!mobile" class="toc-header">
        <div class="header-left">
          <div class="pulse-dot"></div>
          <span class="toc-title">本章目录</span>
        </div>
        <div class="header-right" v-if="headingCount > 0">
          <div class="circular-progress">
            <svg viewBox="0 0 36 36" class="circular-chart">
              <path
                class="circle-bg"
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                class="circle"
                :stroke-dasharray="`${readingProgress}, 100`"
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span class="percentage">{{ Math.round(readingProgress) }}%</span>
          </div>
        </div>
      </div>

      <!-- Main Body -->
      <div class="toc-content">
        <div v-if="headingCount > 0" class="toc-wrapper">
          <MdCatalog
            class="md-catalog-custom"
            :editor-id="editorId"
            :scroll-element="scrollElement"
            :theme="isDark ? 'dark' : 'light'"
            :offset-top="100"
          />
        </div>

        <div v-else class="empty-state">
          <div class="empty-icon">
            <font-awesome-icon icon="compass" />
          </div>
          <p>暂无内容索引</p>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from "vue";
import { MdCatalog } from "md-editor-v3";
import { useThemeStore } from "@/stores/theme";
import "md-editor-v3/lib/preview.css";

const props = withDefaults(
  defineProps<{
    editorId: string;
    markdown: string;
    scrollElement?: string;
    mobile?: boolean;
  }>(),
  {
    scrollElement: "html",
    mobile: false,
  }
);

const themeStore = useThemeStore();
const isDark = computed(() => themeStore.isDark);

const headingCount = computed(() => {
  const matches = props.markdown.match(/^#{1,6}\s+/gm);
  return matches ? matches.length : 0;
});

const readingProgress = ref(0);
let progressFrameId: number;
let lastProgressUpdate = 0;

const handleScrollProgress = () => {
  if (props.mobile) return;

  const now = Date.now();
  // Throttle to ~15fps for progress indicator, no need for 60fps
  if (now - lastProgressUpdate < 66) return;
  lastProgressUpdate = now;

  if (progressFrameId) {
    cancelAnimationFrame(progressFrameId);
  }

  progressFrameId = requestAnimationFrame(() => {
    const h = document.documentElement;
    const st = h.scrollTop || document.body.scrollTop;
    const sh = h.scrollHeight || document.body.scrollHeight;
    const ch = h.clientHeight;
    const total = sh - ch;
    readingProgress.value = total > 0 ? Math.min((st / total) * 100, 100) : 0;
  });
};

onMounted(() => {
  if (!props.mobile) {
    window.addEventListener("scroll", handleScrollProgress, { passive: true });
    handleScrollProgress();
  }
});

onUnmounted(() => {
  if (!props.mobile) {
    window.removeEventListener("scroll", handleScrollProgress);
  }
  if (progressFrameId) {
    cancelAnimationFrame(progressFrameId);
  }
});
</script>

<style scoped lang="scss">
.premium-toc {
  width: 100%;
  font-family: "Inter", system-ui, -apple-system, sans-serif;
}

.toc-container {
  background: transparent;
  border-radius: var(--radius-lg);
  position: relative;

  // Flat card for PC
  @media (min-width: 768px) {
    background: #fff;
    border: 1px solid rgba(226, 232, 240, 0.8);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02),
      0 8px 24px -8px rgba(15, 23, 42, 0.06);
    padding: 24px;

    .is-dark & {
      background: #1e293b;
      border-color: rgba(51, 65, 85, 0.6);
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05),
        0 8px 24px -8px rgba(0, 0, 0, 0.2);
    }
  }
}

.sticky-wrapper {
  position: sticky;
  top: 100px; /* Offset from top nav */
}

/* ── Header ── */
.toc-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.pulse-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: var(--primary);
  box-shadow: 0 0 0 0 rgba(var(--primary-rgb, 59, 130, 246), 0.7);
  animation: pulse-animation 2s infinite;
}

@keyframes pulse-animation {
  0% {
    box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4);
  }
  70% {
    box-shadow: 0 0 0 8px rgba(59, 130, 246, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(59, 130, 246, 0);
  }
}

.toc-title {
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: var(--text-secondary);
  text-transform: uppercase;
}

/* circular progress */
.circular-progress {
  position: relative;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.circular-chart {
  display: block;
  margin: 0 auto;
  max-width: 100%;
  max-height: 250px;
}

.circle-bg {
  fill: none;
  stroke: var(--border);
  stroke-width: 2.5;
}

.circle {
  fill: none;
  stroke-width: 2.5;
  stroke-linecap: round;
  stroke: var(--primary);
  transition: stroke-dasharray 0.3s ease;
}

.percentage {
  position: absolute;
  font-size: 9px;
  font-weight: 700;
  color: var(--text);
}

/* ── Main Content ── */
.toc-content {
  position: relative;
  max-height: calc(100vh - 220px);
  overflow-y: auto;
  padding-right: 4px;

  &::-webkit-scrollbar {
    width: 2px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: var(--border);
    border-radius: 4px;
  }
}

.toc-wrapper {
  position: relative;
}

/* ── Customizing MdCatalog (NUKE ALL INLINE & DEFAULT STYLES) ── */
:deep(.md-catalog-custom) {
  position: relative;
  z-index: 1;

  .md-editor-catalog-indicator {
    display: none !important; /* completely hide their weird indicator */
  }

  .md-editor-catalog-container {
    padding: 0;
  }

  .md-editor-catalog-link {
    position: relative;
    padding: 6px 0 6px 18px;
    margin: 4px 0;
    font-size: 14px;
    line-height: 1.6;
    color: var(--text-secondary);
    cursor: pointer;
    border-radius: 0;
    background: transparent !important;
    // Only transition specific properties, never use "all"
    transition: color 0.2s ease, padding-left 0.2s ease;

    > span {
      color: inherit !important;
      background: transparent !important;
      transition: color 0.2s ease;
    }

    // Per-item left indicator line
    &::before {
      content: "";
      position: absolute;
      left: 0;
      top: 6px;
      height: 22px;
      width: 2px;
      background: transparent;
      border-radius: 2px;
      transition: background 0.2s ease, box-shadow 0.2s ease,
        height 0.2s ease;
    }

    // Hover state
    &:hover {
      color: var(--text) !important;
      > span {
        color: var(--text) !important;
      }
    }
  }

  /* THE ACTIVE STATE */
  .md-editor-catalog-link.md-editor-catalog-active {
    color: var(--primary) !important;
    font-weight: 600;
    padding-left: 22px;

    > span {
      color: var(--primary) !important;
    }

    &::before {
      background: var(--primary);
      height: 22px;
      box-shadow: 0 0 6px rgba(59, 130, 246, 0.4);
    }

    // Reset nested child links so they don't inherit active styles
    .md-editor-catalog-link {
      color: var(--text-secondary) !important;
      font-weight: normal;
      padding-left: 18px;

      > span {
        color: var(--text-secondary) !important;
      }
    }
  }

  /* Structural typography */
  .md-editor-catalog-container > .md-editor-catalog-link {
    margin-top: 12px;
    font-size: 14.5px;
    color: var(--text);

    > span {
      color: var(--text);
    }
  }

  .md-editor-catalog-wrapper {
    padding-left: 12px;
  }
}

/* ── Empty State ── */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 60px 0;
  color: var(--text-tertiary);

  .empty-icon {
    font-size: 32px;
    opacity: 0.5;
    background: linear-gradient(135deg, var(--text-tertiary), var(--border));
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  p {
    font-size: 13px;
    font-weight: 500;
    letter-spacing: 0.05em;
  }
}

/* ── Mobile Layout ── */
.is-mobile {
  .toc-container {
    padding: 0;
  }

  .toc-content {
    max-height: none;
  }

  :deep(.md-catalog-custom) {
    .md-editor-catalog-link {
      padding: 12px 16px;
      margin: 8px 0;
      border-radius: var(--radius-md);
      background: var(--surface) !important;
      border: 1px solid var(--border);
      box-shadow: var(--shadow-xs);

      .is-dark & {
        background: var(--bg-secondary) !important;
      }

      &:hover {
        border-color: var(--primary-light);
      }
    }

    // Mobile Active Item
    .md-editor-catalog-link.md-editor-catalog-active {
      background: var(--primary) !important;
      color: white !important;
      border-color: var(--primary);
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
      transform: translateY(-2px);

      > span {
        color: white !important;
      }

      // Reset nested child links on mobile
      .md-editor-catalog-link {
        color: var(--text-secondary) !important;
        background: var(--surface) !important;
        border: 1px solid var(--border);
        transform: none;
        box-shadow: var(--shadow-xs);

        .is-dark & {
          background: var(--bg-secondary) !important;
        }

        > span {
          color: var(--text-secondary) !important;
        }
      }
    }

    .md-editor-catalog-wrapper {
      padding-left: 10px;
    }
  }
}
</style>

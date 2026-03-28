<template>
  <aside class="toc-panel" :class="{ 'dark-mode': isDark, 'is-mobile': mobile }">
    <div class="toc-card">
      <!-- Header -->
      <div v-if="!mobile" class="toc-header">
        <div class="toc-title-row">
          <font-awesome-icon icon="list-ul" class="toc-icon" />
          <span class="toc-title">文章目录</span>
        </div>
        <span class="toc-count">{{ headingCount }} 节</span>
      </div>

      <!-- Progress -->
      <div v-if="!mobile && headingCount > 0" class="toc-progress">
        <div class="progress-track">
          <div class="progress-fill" :style="{ width: readingProgress + '%' }"></div>
        </div>
      </div>

      <!-- Catalog -->
      <div class="toc-body">
        <div v-if="headingCount > 0" class="toc-viewport">
          <MdCatalog
            class="toc-catalog"
            :editor-id="editorId"
            :scroll-element="scrollElement"
            :theme="isDark ? 'dark' : 'light'"
            :offset-top="100"
          />
        </div>
        <div v-else class="toc-empty">
          <font-awesome-icon icon="file-lines" />
          <span>暂无目录</span>
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
  const matches = props.markdown.match(/^#{1,4}\s+/gm);
  return matches ? matches.length : 0;
});

const readingProgress = ref(0);

const handleScrollProgress = () => {
  if (props.mobile) return;
  const h = document.documentElement;
  const st = h.scrollTop || document.body.scrollTop;
  const sh = h.scrollHeight || document.body.scrollHeight;
  const ch = h.clientHeight;
  const total = sh - ch;
  readingProgress.value = total > 0 ? Math.min((st / total) * 100, 100) : 0;
};

onMounted(() => {
  if (!props.mobile) {
    window.addEventListener("scroll", handleScrollProgress, { passive: true });
    handleScrollProgress();
  }
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScrollProgress);
});
</script>

<style scoped lang="scss">
.toc-panel {
  width: 100%;
  font-family: inherit;
}

// ── Card: 对齐主文章卡片风格 ──
.toc-card {
  background: white;
  border-radius: 20px;
  border: 1px solid rgba(226, 232, 240, 0.8);
  box-shadow:
    0 1px 3px rgba(0, 0, 0, 0.02),
    0 20px 60px -15px rgba(15, 23, 42, 0.08);
  overflow: hidden;
  transition: box-shadow 0.3s;

  .dark-mode & {
    background: #1e293b;
    border-color: rgba(45, 55, 72, 0.8);
    box-shadow:
      0 1px 3px rgba(0, 0, 0, 0.05),
      0 20px 60px -15px rgba(0, 0, 0, 0.2);
  }
}

.is-mobile .toc-card {
  background: transparent;
  border: none;
  box-shadow: none;
}

// ── Header: 对齐 Hero meta-section 风格 ──
.toc-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px 16px;
  border-bottom: 1px solid #f1f5f9;

  .dark-mode & {
    border-color: rgba(51, 65, 85, 0.5);
  }
}

.toc-title-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.toc-icon {
  font-size: 13px;
  color: #2563eb;

  .dark-mode & {
    color: #60a5fa;
  }
}

.toc-title {
  font-size: 15px;
  font-weight: 700;
  color: #0f172a;
  letter-spacing: -0.01em;

  .dark-mode & {
    color: #f8fafc;
  }
}

.toc-count {
  font-size: 11px;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: 20px;
  background: #f1f5f9;
  color: #64748b;
  border: 1px solid #e2e8f0;

  .dark-mode & {
    background: rgba(15, 23, 42, 0.5);
    color: #94a3b8;
    border-color: rgba(51, 65, 85, 0.5);
  }
}

// ── Progress: 细线进度条 ──
.toc-progress {
  padding: 0 24px;
  margin-bottom: -1px;
}

.progress-track {
  height: 2px;
  background: #f1f5f9;
  border-radius: 2px;
  overflow: hidden;

  .dark-mode & {
    background: rgba(51, 65, 85, 0.4);
  }
}

.progress-fill {
  height: 100%;
  background: #3b82f6;
  border-radius: 2px;
  transition: width 0.3s ease;

  .dark-mode & {
    background: #60a5fa;
  }
}

// ── Body ──
.toc-body {
  padding: 12px 0 16px;
}

.toc-viewport {
  max-height: calc(100vh - 320px);
  overflow-y: auto;
  padding: 0 12px;

  &::-webkit-scrollbar {
    width: 3px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: #e2e8f0;
    border-radius: 10px;

    .dark-mode & {
      background: #334155;
    }
  }
}

.is-mobile .toc-viewport {
  max-height: none;
  padding: 0;
}

// ── Empty ──
.toc-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 36px 16px;
  color: #94a3b8;
  font-size: 13px;

  svg {
    font-size: 20px;
    opacity: 0.4;
  }
}

// ── Catalog: 对齐文章内链接/hover 风格 ──
:deep(.toc-catalog) {
  .md-editor-catalog-indicator {
    display: none !important;
  }

  .md-editor-catalog-container {
    padding: 0;
  }

  .md-editor-catalog-link {
    position: relative;
    display: block;
    padding: 8px 14px 8px 22px;
    margin: 1px 0;
    font-size: 13.5px;
    line-height: 1.5;
    color: #64748b;
    border-radius: 8px;
    transition: color 0.15s, background 0.15s;
    cursor: pointer;

    .dark-mode & {
      color: #94a3b8;
    }

    // 左侧小圆点指示器
    &::before {
      content: "";
      position: absolute;
      left: 8px;
      top: 50%;
      transform: translateY(-50%);
      width: 5px;
      height: 5px;
      border-radius: 50%;
      background: transparent;
      transition: all 0.2s ease;
    }

    &:hover {
      color: #1f2937;
      background: #f8fafc;

      .dark-mode & {
        color: #f1f5f9;
        background: rgba(255, 255, 255, 0.03);
      }
    }
  }

  // Active state
  .md-editor-catalog-active > .md-editor-catalog-link {
    color: #2563eb;
    background: #eff6ff;
    font-weight: 600;

    .dark-mode & {
      color: #60a5fa;
      background: rgba(59, 130, 246, 0.1);
    }

    &::before {
      background: #2563eb;

      .dark-mode & {
        background: #60a5fa;
      }
    }
  }

  // Top-level
  .md-editor-catalog-container > .md-editor-catalog-link {
    font-weight: 600;
    color: #1f2937;

    .dark-mode & {
      color: #f1f5f9;
    }
  }

  // Nesting
  .md-editor-catalog-wrapper {
    padding-left: 14px;
  }
}

// ── Mobile ──
.is-mobile {
  :deep(.toc-catalog) {
    .md-editor-catalog-link {
      padding: 12px 16px;
      margin: 3px 0;
      font-size: 14px;
      border-radius: 10px;

      &::before {
        display: none;
      }

      &:hover {
        background: #f8fafc;

        .dark-mode & {
          background: rgba(255, 255, 255, 0.03);
        }
      }
    }

    .md-editor-catalog-active > .md-editor-catalog-link {
      background: #eff6ff;

      .dark-mode & {
        background: rgba(59, 130, 246, 0.1);
      }
    }

    .md-editor-catalog-wrapper {
      padding-left: 16px;
    }
  }
}
</style>

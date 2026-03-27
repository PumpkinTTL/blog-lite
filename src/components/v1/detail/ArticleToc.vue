<template>
  <aside class="elite-nav" :class="{ 'dark-mode': isDark, 'is-mobile': mobile }">
    <div class="nav-shell">
      <!-- ── TOP SECTION: BRAND & PROGRESS ── -->
      <div v-if="!mobile" class="nav-header">
        <div class="header-content">
          <div class="header-title-row">
            <div class="icon-indicator">
              <span class="pulse"></span>
              <font-awesome-icon icon="compass" />
            </div>
            <div class="title-meta">
              <span class="subtitle">Quick Access</span>
              <h3 class="main-title">目录导航</h3>
            </div>
          </div>

          <!-- REFINED PROGRESS BAR (Precision Aligned) -->
          <div class="progress-precision">
            <div class="label-row">
              <span class="p-label">Reading Progress</span>
              <span class="p-val">{{ Math.round(readingProgress) }}%</span>
            </div>
            <div class="track-outer">
              <div class="track-inner">
                <div class="bar-glow" :style="{ width: readingProgress + '%' }"></div>
                <div class="bar-solid" :style="{ width: readingProgress + '%' }"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ── MIDDLE SECTION: HIERARCHY ── -->
      <div class="nav-body">
        <div v-if="headingCount > 0" class="catalog-viewport">
          <MdCatalog
            class="elite-catalog-custom"
            :editor-id="editorId"
            :scroll-element="scrollElement"
            :theme="isDark ? 'dark' : 'light'"
            :offset-top="100"
          />
        </div>
        <div v-else class="empty-nav">
          <font-awesome-icon icon="face-meh" class="meh-icon" />
          <p>暂无层级索引</p>
        </div>
      </div>

      <!-- ── BOTTOM SECTION: STATS ── -->
      <div v-if="!mobile && headingCount > 0" class="nav-footer">
        <div class="stats-row">
          <div class="stat">
            <span class="s-val">{{ headingCount }}</span>
            <span class="s-lab">节点</span>
          </div>
          <div class="stat">
            <span class="s-val">{{ Math.round(headingCount / 3 + 1) }}</span>
            <span class="s-lab">分钟</span>
          </div>
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
  readingProgress.value = total > 0 ? (st / total) * 100 : 0;
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
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@700;800&family=Inter:wght@400;500;600&display=swap');

// ── ELITE COLOR SYSTEM (FORCING BLUE / NEUTRAL) ──
.elite-nav {
  --primary: #3B82F6; // ABSOLUTE BLUE
  --primary-rgb: 59, 130, 246;
  --bg-panel: #FFFFFF;
  --bg-accent: #F9FAFB;
  --border-ui: #F3F4F6;
  --text-main: #111827;
  --text-sec: #6B7280;
  
  width: 100%;
  font-family: 'Inter', -apple-system, sans-serif;
  -webkit-font-smoothing: antialiased;
}

.dark-mode {
  --bg-panel: #111827;
  --bg-accent: #1E293B;
  --border-ui: #1F2937;
  --text-main: #F9FAFB;
  --text-sec: #9CA3AF;
}

.nav-shell {
  background: var(--bg-panel);
  border: 1px solid var(--border-ui);
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 
    0 4px 6px -1px rgba(0, 0, 0, 0.02),
    0 10px 15px -3px rgba(0, 0, 0, 0.03);
  
  .dark-mode & {
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  }
}

.is-mobile .nav-shell {
  background: transparent;
  border: none;
  box-shadow: none;
}

// Header
.nav-header {
  padding: 30px 24px 20px;
  border-bottom: 2px solid var(--bg-accent);

  .header-title-row {
    display: flex;
    gap: 14px;
    align-items: center;
    margin-bottom: 24px;
  }

  .icon-indicator {
    width: 40px;
    height: 40px;
    background: var(--bg-accent);
    color: var(--primary);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    position: relative;
    
    .pulse {
      position: absolute;
      inset: 0;
      border-radius: inherit;
      border: 2px solid var(--primary);
      opacity: 0.3;
      animation: indicator-pulse 2s infinite;
    }
  }

  .title-meta {
    .subtitle {
      font-size: 10px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.15em;
      color: var(--primary);
      display: block;
      margin-bottom: 2px;
    }
    .main-title {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 19px;
      font-weight: 800;
      color: var(--text-main);
      margin: 0;
    }
  }
}

// Progress Precision UI
.progress-precision {
  .label-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
    
    .p-label {
      font-size: 11px;
      font-weight: 700;
      color: var(--text-sec);
    }
    .p-val {
      font-weight: 800;
      font-size: 13px;
      color: var(--primary);
    }
  }

  .track-outer {
    height: 6px;
    background: var(--border-ui);
    border-radius: 10px;
    overflow: hidden;
    padding: 1px; // Visual alignment trick
  }

  .track-inner {
    height: 100%;
    position: relative;
    border-radius: 10px;
    overflow: hidden;
  }

  .bar-glow {
    position: absolute;
    inset: 0;
    background: var(--primary);
    opacity: 0.2;
    filter: blur(4px);
  }

  .bar-solid {
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, var(--primary), #60A5FA);
    border-radius: 10px;
    transition: width 0.3s cubic-bezier(0.1, 0.7, 0.1, 1);
  }
}

// Catalog Viewport
.nav-body {
  padding: 12px 0 20px;
}

.catalog-viewport {
  max-height: calc(100vh - 420px);
  overflow-y: auto;
  padding: 0 16px;

  &::-webkit-scrollbar { width: 3px; }
  &::-webkit-scrollbar-thumb { background: var(--border-ui); border-radius: 10px; }
}

.is-mobile .catalog-viewport {
  max-height: none;
  padding: 0;
}

// Catalog Custom styling (DEEP OVERRIDE OF MD-EDITOR)
:deep(.elite-catalog-custom) {
  --md-primary-color: #3B82F6 !important; // FORCING BLUE

  .md-editor-catalog-link {
    position: relative;
    padding: 10px 14px 10px 24px;
    margin: 4px 0;
    font-size: 14.5px;
    line-height: 1.5;
    color: var(--text-sec);
    border-radius: 12px;
    transition: all 0.25s ease;
    cursor: pointer;
    overflow: hidden;

    &::before {
      content: "";
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 4px;
      height: 0%;
      background: var(--primary);
      border-radius: 0 4px 4px 0;
      transition: height 0.3s ease;
    }

    &:hover {
      color: var(--text-main);
      background: var(--bg-accent);
      padding-left: 28px;
    }
  }

  .md-editor-catalog-active > .md-editor-catalog-link {
    color: var(--primary) !important;
    background: rgba(var(--primary-rgb), 0.06) !important;
    font-weight: 700;
    padding-left: 28px;

    &::before {
      height: 20px;
    }
  }

  // Hierarchy Structure
  .md-editor-catalog-item-level-1 {
    .md-editor-catalog-link {
      font-weight: 700;
      color: var(--text-main);
    }
  }

  .md-editor-catalog-item-level-2 { margin-left: 12px; }
  .md-editor-catalog-item-level-3 { margin-left: 24px; }
}

// Footer
.nav-footer {
  padding: 16px 24px;
  background: var(--bg-accent);
  border-top: 1px solid var(--border-ui);

  .stats-row {
    display: flex;
    justify-content: space-around;
  }

  .stat {
    display: flex;
    flex-direction: column;
    align-items: center;

    .s-val {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 14px;
      font-weight: 800;
      color: var(--text-main);
    }
    .s-lab {
      font-size: 9px;
      font-weight: 700;
      color: var(--text-sec);
      text-transform: uppercase;
      letter-spacing: 0.1em;
      margin-top: 2px;
    }
  }
}

// Animations
@keyframes indicator-pulse {
  0% { transform: scale(1); opacity: 0.3; }
  100% { transform: scale(1.6); opacity: 0; }
}

// Mobile Overrides
.is-mobile {
  :deep(.elite-catalog-custom) {
    .md-editor-catalog-link {
      padding: 16px 20px;
      background: var(--bg-panel);
      border: 1px solid var(--border-ui);
      margin: 12px 0;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.02);

      &::before { display: none; }
    }

    .md-editor-catalog-active > .md-editor-catalog-link {
      border-color: var(--primary);
      background: rgba(var(--primary-rgb), 0.04) !important;
    }
  }
}
</style>

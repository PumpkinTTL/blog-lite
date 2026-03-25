<template>
  <section class="article-content" :class="{ 'dark-mode': isDark }">
    <div class="content-shell">
      <div class="content-body-top">
        <div class="ai-summary-card animate__animated animate__fadeInDown animate__delay-800ms">
          <div class="ai-badge">
            <div class="ai-icon-wrap">
              <font-awesome-icon icon="robot" />
            </div>
            <span>AI 导读</span>
            <div class="ai-sparkle">
              <font-awesome-icon icon="bolt" />
            </div>
          </div>

          <div class="ai-content">
            <p class="ai-text">{{ article.lead }}</p>
          </div>

          <div class="ai-glass-reflection"></div>
        </div>
      </div>

      <div class="preview-wrap">
        <MdPreview
          :id="previewId"
          class="md-preview-reset"
          :model-value="article.markdown"
          :theme="isDark ? 'dark' : 'light'"
          preview-theme="github"
          code-theme="github"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { MdPreview } from "md-editor-v3";
import { useThemeStore } from "@/stores/theme";
import "md-editor-v3/lib/preview.css";

interface Article {
  id: string;
  title: string;
  description: string;
  markdown: string;
  readMinutes: number;
  wordCount: number;
  updatedAt: string;
  difficulty: string;
  lead: string;
}

const props = defineProps<{
  article: Article;
}>();

const themeStore = useThemeStore();
const isDark = computed(() => themeStore.isDark);
const previewId = computed(() => `article-preview-${props.article.id}`);
const formatWordCount = (count: number) => count.toLocaleString("en-US");
</script>

<style scoped lang="scss">
.article-content {
  position: relative;
  min-width: 0;
  font-family: "Inter", "Outfit", -apple-system, sans-serif;
}

.content-shell {
  position: relative;
  overflow: hidden;
  padding: 40px;
}

.content-header {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 40px;
}

.header-top-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 14px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 700;
  color: #2563eb;
  background: rgba(37, 99, 235, 0.06);
  border: 1px solid rgba(37, 99, 235, 0.12);
}

.reading-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 13px;
  color: #64748b;
  font-weight: 500;

  .meta-item.dot {
    width: 3px;
    height: 3px;
    border-radius: 50%;
    background: #cbd5e1;
  }
}

.content-title {
  margin: 0;
  font-size: clamp(26px, 3vw, 36px);
  font-weight: 850;
  line-height: 1.25;
  letter-spacing: -0.04em;
  color: #0f172a;
}

.content-subtitle {
  margin: 0;
  font-size: 16px;
  line-height: 1.6;
  color: #475569;
  font-weight: 450;
  max-width: 800px;
}

.ai-summary-card {
  position: relative;
  overflow: hidden;
  padding: 24px 28px;
  border-radius: 20px;
  background: linear-gradient(135deg, rgba(237, 233, 254, 0.6) 0%, rgba(252, 231, 243, 0.6) 100%);
  border: 1px solid rgba(167, 139, 250, 0.3);
  box-shadow: 
    0 12px 34px -12px rgba(139, 92, 246, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: -150%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.6),
      transparent
    );
    transform: skewX(-25deg);
    animation: flowLight 4s infinite cubic-bezier(0.4, 0, 0.2, 1);
    pointer-events: none;
  }
}

@keyframes flowLight {
  0% { left: -150%; }
  50% { left: 150%; }
  100% { left: 150%; }
}

.ai-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  padding: 6px 12px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(167, 139, 250, 0.2);
  box-shadow: 0 4px 12px rgba(124, 58, 237, 0.1);
  font-size: 13px;
  font-weight: 800;
  color: #5b21b6;

  .ai-icon-wrap {
    color: #8b5cf6;
    display: flex;
    align-items: center;
  }

  .ai-sparkle {
    color: #ec4899;
    font-size: 11px;
    margin-left: 2px;
    animation: pulse 1.5s ease-in-out infinite;
  }
}

@keyframes pulse {
  0% { opacity: 0.6; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.1); }
  100% { opacity: 0.6; transform: scale(1); }
}

.ai-text {
  margin: 0;
  font-size: 15px;
  line-height: 1.75;
  color: #334155;
  font-weight: 600;
  position: relative;
  z-index: 1;
}

.ai-glass-reflection {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(167, 139, 250, 0.08) 0%, transparent 70%);
  pointer-events: none;
}

.preview-wrap {
  padding: 8px 0;
}

:deep(.md-preview) {
  background: transparent;
  color: #334155;
  font-family: inherit;
  font-size: 16px;
}

:deep(.md-preview h1),
:deep(.md-preview h2),
:deep(.md-preview h3),
:deep(.md-preview h4),
:deep(.md-preview h5),
:deep(.md-preview h6) {
  color: #0f172a;
  margin-top: 1.5em;
  font-weight: 700;
}

:deep(.md-preview p) {
  margin-bottom: 1.25em;
  line-height: 1.8;
}

:deep(.md-preview blockquote) {
  border-left: 4px solid #3b82f6;
  background: #f8fafc;
  border-radius: 0 12px 12px 0;
  padding: 16px 20px;
  margin: 24px 0;
}

:deep(.md-preview pre) {
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.05);
}

.dark-mode {
  .content-shell {
    background: #0f172a;
    border-color: rgba(255, 255, 255, 0.05);
    box-shadow: 0 20px 80px rgba(0, 0, 0, 0.4);
    color: #cbd5e1;
  }

  .content-title {
    color: #f8fafc;
  }

  .content-subtitle {
    color: #94a3b8;
  }

  .eyebrow {
    background: rgba(59, 130, 246, 0.15);
    color: #60a5fa;
    border-color: rgba(96, 165, 250, 0.2);
  }

  .reading-meta {
    color: #64748b;
  }

  .ai-summary-card {
    background: linear-gradient(135deg, rgba(88, 28, 135, 0.25) 0%, rgba(131, 24, 67, 0.25) 100%);
    border-color: rgba(167, 139, 250, 0.4);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);

    &::before {
      background: linear-gradient(
        90deg,
        transparent,
        rgba(167, 139, 250, 0.25),
        rgba(244, 114, 182, 0.25),
        transparent
      );
    }
  }

  .ai-badge {
    background: rgba(30, 27, 75, 0.8);
    color: #ddd6fe;
    border-color: rgba(167, 139, 250, 0.3);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
    
    .ai-icon-wrap {
      color: #a78bfa;
    }
  }

  .ai-sparkle {
    color: #f472b6;
  }

  .ai-text {
    color: #e2e8f0;
  }

  :deep(.md-preview) {
    color: #cbd5e1;
  }

  :deep(.md-preview h1),
  :deep(.md-preview h2),
  :deep(.md-preview h3),
  :deep(.md-preview h4),
  :deep(.md-preview h5),
  :deep(.md-preview h6) {
    color: #f8fafc;
  }

  :deep(.md-preview blockquote) {
    background: rgba(30, 41, 59, 0.5);
    border-left-color: #60a5fa;
  }

  // 修复富文本编辑器深色模式背景色，使其与网站深色主题一致
  :deep(.md-preview) {
    background: transparent !important;
  }

  :deep(.md-editor) {
    background: transparent !important;
  }

  :deep(.md-editor-preview) {
    background: transparent !important;
  }

  // 代码块背景色透明
  :deep(.md-preview pre) {
    background: transparent !important;
  }

  :deep(.md-preview code) {
    background: rgba(30, 41, 59, 0.5) !important;
  }
}

@media (max-width: 768px) {
  .content-shell {
    padding: 24px 20px;
  }

  .content-header {
    margin-bottom: 28px;
  }

  .header-top-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .ai-summary-card {
    padding: 20px;
  }
}
</style>

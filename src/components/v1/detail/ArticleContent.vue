<template>
  <section class="article-content" :class="{ 'dark-mode': isDark }">
    <div class="content-shell">
      <div class="content-header">
        <div class="header-top-meta">
          <div class="eyebrow">
            <font-awesome-icon icon="newspaper" />
            <span>深度专栏</span>
          </div>
          <div class="reading-meta">
            <span class="meta-item">
              <font-awesome-icon icon="clock" />
              {{ article.readMinutes }} min read
            </span>
            <span class="meta-item dot"></span>
            <span class="meta-item">
              {{ formatWordCount(article.wordCount) }} words
            </span>
          </div>
        </div>

        <h2 class="content-title">{{ article.title }}</h2>
        <p class="content-subtitle">{{ article.description }}</p>

        <div class="ai-summary-card">
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
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.72);
  background:
    radial-gradient(circle at top right, rgba(59, 130, 246, 0.08), transparent 40%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.98), rgba(255, 255, 255, 0.92));
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.02),
    0 20px 50px -4px rgba(15, 23, 42, 0.06),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(20px);
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
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border: 1px solid rgba(226, 232, 240, 0.8);
  box-shadow: 
    0 10px 30px -10px rgba(15, 23, 42, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);
}

.ai-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  padding: 6px 12px;
  border-radius: 10px;
  background: white;
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.04);
  font-size: 13px;
  font-weight: 800;
  color: #1e293b;

  .ai-icon-wrap {
    color: #3b82f6;
    animation: rotate 4s linear infinite;
  }

  .ai-sparkle {
    color: #f59e0b;
    font-size: 11px;
    margin-left: 2px;
    animation: pulse 1.5s ease-in-out infinite;
  }
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
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
  font-weight: 500;
  position: relative;
  z-index: 1;
}

.ai-glass-reflection {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(59, 130, 246, 0.05) 0%, transparent 70%);
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
    background:
      radial-gradient(circle at top right, rgba(168, 85, 247, 0.15), transparent 40%),
      linear-gradient(180deg, rgba(15, 23, 42, 0.95), rgba(15, 23, 42, 0.98));
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
    background: linear-gradient(135deg, rgba(30, 41, 59, 0.6) 0%, rgba(15, 23, 42, 0.6) 100%);
    border-color: rgba(255, 255, 255, 0.05);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  }

  .ai-badge {
    background: #1e293b;
    color: #f1f5f9;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    
    .ai-icon-wrap {
      color: #60a5fa;
    }
  }

  .ai-text {
    color: #cbd5e1;
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

<template>
  <section class="article-content" :class="{ 'dark-mode': isDark }">
    <div class="content-shell">
      <div class="content-header">
        <div class="eyebrow">
          <font-awesome-icon icon="book-open" />
          <span>正文内容</span>
        </div>

        <h2 class="content-title">{{ article.title }}</h2>
        <p class="content-subtitle">{{ article.description }}</p>

        <div class="reading-meta">
          <span class="meta-chip">
            <font-awesome-icon icon="clock" />
            {{ article.readMinutes }} 分钟阅读
          </span>
          <span class="meta-chip">
            <font-awesome-icon icon="pen-nib" />
            {{ formatWordCount(article.wordCount) }} 字
          </span>
          <span class="meta-chip">
            <font-awesome-icon icon="calendar-days" />
            更新于 {{ article.updatedAt }}
          </span>
          <span class="meta-chip">
            <font-awesome-icon icon="layer-group" />
            {{ article.difficulty }}
          </span>
        </div>

        <div class="lead-card">
          <div class="lead-label">导读</div>
          <p class="lead-text">{{ article.lead }}</p>
        </div>

        <div class="takeaways">
          <div
            v-for="(takeaway, index) in article.takeaways"
            :key="takeaway"
            class="takeaway-item"
          >
            <span class="takeaway-index">0{{ index + 1 }}</span>
            <span class="takeaway-text">{{ takeaway }}</span>
          </div>
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
  takeaways: string[];
  lead: string;
}

const props = defineProps<{
  article: Article;
}>();

const themeStore = useThemeStore();
const isDark = computed(() => themeStore.isDark);
const previewId = computed(() => `article-preview-${props.article.id}`);
const formatWordCount = (count: number) => count.toLocaleString("zh-CN");
</script>

<style scoped lang="scss">
.article-content {
  position: relative;
  min-width: 0;
  font-family: "OPPO Sans", "Outfit", sans-serif;
}

.content-shell {
  position: relative;
  overflow: hidden;
  padding: 28px 30px 34px;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.72);
  background:
    radial-gradient(circle at top right, rgba(168, 85, 247, 0.12), transparent 34%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.94), rgba(255, 255, 255, 0.84));
  box-shadow:
    0 24px 80px rgba(15, 23, 42, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(18px);
}

.content-header {
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-bottom: 24px;
}

.eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  width: fit-content;
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.04em;
  color: #7c3aed;
  background: rgba(124, 58, 237, 0.08);
  border: 1px solid rgba(196, 181, 253, 0.55);
}

.content-title {
  margin: 2px 0 0;
  font-size: clamp(24px, 2.2vw, 32px);
  line-height: 1.18;
  letter-spacing: -0.03em;
  color: #0f172a;
}

.content-subtitle {
  margin: 0;
  max-width: 680px;
  font-size: 14px;
  line-height: 1.72;
  color: #475569;
}

.reading-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.meta-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  color: #475569;
  background: rgba(248, 250, 252, 0.92);
  border: 1px solid rgba(226, 232, 240, 0.9);
}

.lead-card {
  max-width: 760px;
  padding: 14px 16px;
  border-radius: 16px;
  background: linear-gradient(135deg, rgba(248, 250, 252, 0.96), rgba(241, 245, 249, 0.92));
  border: 1px solid rgba(226, 232, 240, 0.9);
}

.lead-label {
  margin-bottom: 8px;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.08em;
  color: #7c3aed;
  text-transform: uppercase;
}

.lead-text {
  margin: 0;
  font-size: 14px;
  line-height: 1.8;
  color: #334155;
}

.takeaways {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.takeaway-item {
  display: flex;
  gap: 10px;
  align-items: flex-start;
  padding: 14px 14px 13px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.66);
  border: 1px solid rgba(226, 232, 240, 0.85);
}

.takeaway-index {
  flex-shrink: 0;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.08em;
  color: #7c3aed;
}

.takeaway-text {
  font-size: 13px;
  line-height: 1.7;
  color: #334155;
}

.preview-wrap {
  padding: 22px 24px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.58);
  border: 1px solid rgba(255, 255, 255, 0.6);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.46);
}

:deep(.md-preview) {
  background: transparent;
  color: #334155;
  font-family: "OPPO Sans", "Source Serif 4", serif;
  font-size: 14px;
}

:deep(.md-preview h1),
:deep(.md-preview h2),
:deep(.md-preview h3),
:deep(.md-preview h4),
:deep(.md-preview h5),
:deep(.md-preview h6) {
  color: #0f172a;
  border-bottom-color: rgba(148, 163, 184, 0.18);
}

:deep(.md-preview p),
:deep(.md-preview li),
:deep(.md-preview blockquote) {
  line-height: 1.82;
}

:deep(.md-preview h1) {
  font-size: 30px;
}

:deep(.md-preview h2) {
  font-size: 24px;
}

:deep(.md-preview h3) {
  font-size: 20px;
}

:deep(.md-preview pre) {
  border-radius: 16px;
}

:deep(.md-preview code),
:deep(.md-preview pre code) {
  font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace;
}

:deep(.md-preview blockquote) {
  border-left-color: #8b5cf6;
  background: linear-gradient(135deg, rgba(250, 245, 255, 0.95), rgba(243, 232, 255, 0.72));
  border-radius: 14px;
  padding: 14px 16px;
}

:deep(.md-preview table) {
  overflow: hidden;
  border-radius: 14px;
}

.dark-mode {
  .content-shell {
    border-color: rgba(148, 163, 184, 0.12);
    background:
      radial-gradient(circle at top right, rgba(168, 85, 247, 0.18), transparent 34%),
      linear-gradient(180deg, rgba(15, 23, 42, 0.92), rgba(15, 23, 42, 0.82));
    box-shadow:
      0 24px 80px rgba(2, 6, 23, 0.32),
      inset 0 1px 0 rgba(255, 255, 255, 0.04);
  }

  .content-title {
    color: #f8fafc;
  }

  .content-subtitle,
  .lead-text,
  .takeaway-text,
  .meta-chip {
    color: #cbd5e1;
  }

  .eyebrow {
    color: #d8b4fe;
    background: rgba(124, 58, 237, 0.12);
    border-color: rgba(167, 139, 250, 0.2);
  }

  .meta-chip,
  .takeaway-item {
    background: rgba(15, 23, 42, 0.58);
    border-color: rgba(51, 65, 85, 0.9);
  }

  .lead-card {
    background: linear-gradient(135deg, rgba(15, 23, 42, 0.72), rgba(30, 41, 59, 0.72));
    border-color: rgba(51, 65, 85, 0.9);
  }

  .preview-wrap {
    background: rgba(15, 23, 42, 0.55);
    border-color: rgba(148, 163, 184, 0.1);
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.04);
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
    border-bottom-color: rgba(148, 163, 184, 0.12);
  }

  :deep(.md-preview blockquote) {
    background: linear-gradient(135deg, rgba(76, 29, 149, 0.22), rgba(59, 7, 100, 0.16));
    border-left-color: #c084fc;
  }
}

@media (max-width: 768px) {
  .content-shell {
    padding: 24px 18px 28px;
    border-radius: 18px;
  }

  .content-header {
    gap: 12px;
    margin-bottom: 24px;
  }

  .content-title {
    margin-top: 0;
    font-size: 24px;
  }

  .reading-meta {
    gap: 8px;
  }

  .meta-chip {
    padding: 5px 9px;
    font-size: 11px;
  }

  .lead-card {
    padding: 12px 14px;
    border-radius: 14px;
  }

  .takeaways {
    grid-template-columns: 1fr;
    gap: 10px;
  }

  .preview-wrap {
    padding: 16px 14px;
    border-radius: 16px;
  }
}
</style>

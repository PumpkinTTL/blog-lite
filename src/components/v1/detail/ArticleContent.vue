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
}

const props = defineProps<{
  article: Article;
}>();

const themeStore = useThemeStore();
const isDark = computed(() => themeStore.isDark);
const previewId = computed(() => `article-preview-${props.article.id}`);
</script>

<style scoped lang="scss">
.article-content {
  position: relative;
  font-family: "OPPO Sans", "Outfit", sans-serif;
}

.content-shell {
  position: relative;
  overflow: hidden;
  padding: 36px 40px 44px;
  border-radius: 24px;
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
  margin-bottom: 32px;
}

.eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.04em;
  color: #7c3aed;
  background: rgba(124, 58, 237, 0.08);
  border: 1px solid rgba(196, 181, 253, 0.55);
}

.content-title {
  margin: 20px 0 12px;
  font-size: clamp(28px, 3vw, 38px);
  line-height: 1.2;
  letter-spacing: -0.03em;
  color: #0f172a;
}

.content-subtitle {
  margin: 0;
  max-width: 720px;
  font-size: 16px;
  line-height: 1.8;
  color: #475569;
}

.preview-wrap {
  padding: 28px;
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.58);
  border: 1px solid rgba(255, 255, 255, 0.6);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.46);
}

:deep(.md-preview) {
  background: transparent;
  color: #334155;
  font-family: "OPPO Sans", "Source Serif 4", serif;
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
  line-height: 1.95;
}

:deep(.md-preview pre) {
  border-radius: 20px;
}

:deep(.md-preview code),
:deep(.md-preview pre code) {
  font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace;
}

:deep(.md-preview blockquote) {
  border-left-color: #8b5cf6;
  background: linear-gradient(135deg, rgba(250, 245, 255, 0.95), rgba(243, 232, 255, 0.72));
  border-radius: 16px;
  padding: 18px 20px;
}

:deep(.md-preview table) {
  overflow: hidden;
  border-radius: 16px;
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

  .content-subtitle {
    color: #cbd5e1;
  }

  .eyebrow {
    color: #d8b4fe;
    background: rgba(124, 58, 237, 0.12);
    border-color: rgba(167, 139, 250, 0.2);
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
    padding: 28px 22px 32px;
    border-radius: 20px;
  }

  .content-header {
    margin-bottom: 24px;
  }

  .content-title {
    margin-top: 16px;
    font-size: 28px;
  }

  .preview-wrap {
    padding: 20px 16px;
    border-radius: 18px;
  }
}
</style>

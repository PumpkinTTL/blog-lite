<script setup lang="ts">
import { computed } from 'vue'
import { Sparkles } from 'lucide-vue-next'
import { MdPreview } from 'md-editor-v3'
import type { HeadList } from 'md-editor-v3'
import 'md-editor-v3/lib/preview.css'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import type { ArticleFull } from '@/data/articleMock'

const props = defineProps<{
  article: ArticleFull
  mdHeadingId?: (opts: { text: string; level: number; index: number }) => string
}>()

const emit = defineEmits<{
  (e: 'catalog-ready', list: HeadList[]): void
}>()

const previewId = `v2-article-preview-${props.article.id}`

// 去掉 markdown 首行 H1:与 Hero 大标题重复,渲染时不再出现
// 仅匹配紧跟字符串开头的第一个 # 标题,后续 H2/H3 不动
const processedMarkdown = computed(() => {
  const md = props.article.markdown ?? ''
  return md.replace(/^#\s+[^\n]*\n?/, '')
})

// MdPreview 渲染完成、目录就绪时触发,把列表上抛给父组件转发给 TOC
function onGetCatalog(list: HeadList[]) {
  emit('catalog-ready', list)
}
</script>

<template>
  <article class="space-y-6">
    <!-- AI 导读:shadcn Alert 标准组件 -->
    <Alert
      v-if="article.lead"
      class="border-primary/20 bg-primary/[0.04] v2-animate-in v2-delay-2"
    >
      <Sparkles class="h-4 w-4 text-primary" />
      <AlertTitle class="text-primary">AI 导读</AlertTitle>
      <AlertDescription class="text-foreground/80 leading-relaxed">
        {{ article.lead }}
      </AlertDescription>
    </Alert>

    <!-- Markdown 正文(已去重 H1) -->
    <div class="article-md v2-animate-up v2-delay-3">
      <MdPreview
        :id="previewId"
        :model-value="processedMarkdown"
        preview-theme="github"
        code-theme="github"
        :md-heading-id="mdHeadingId"
        :on-get-catalog="onGetCatalog"
        class="md-preview-reset"
      />
    </div>

    <!-- footer slot(点赞/收藏/分享 + 上下篇) -->
    <slot name="footer" />
  </article>
</template>

<style scoped>
:deep(.md-preview) {
  background: transparent !important;
  color: hsl(var(--foreground));
  font-family: inherit;
  font-size: 16px;
  line-height: 1.8;
}

:deep(.md-preview h1),
:deep(.md-preview h2),
:deep(.md-preview h3),
:deep(.md-preview h4) {
  color: hsl(var(--foreground));
  margin-top: 2em;
  margin-bottom: 0.8em;
  font-weight: 700;
  letter-spacing: -0.02em;
  scroll-margin-top: 6rem;
}

:deep(.md-preview h1) { font-size: 2em; }
:deep(.md-preview h2) {
  font-size: 1.5em;
  padding-bottom: 0.3em;
  border-bottom: 1px solid hsl(var(--border));
}
:deep(.md-preview h3) { font-size: 1.25em; }

:deep(.md-preview p) {
  margin: 1.25em 0;
  color: hsl(var(--foreground) / 0.88);
}

:deep(.md-preview blockquote) {
  border-left: 3px solid hsl(var(--primary));
  background: hsl(var(--muted) / 0.5);
  border-radius: 0 0.5rem 0.5rem 0;
  padding: 0.75rem 1.25rem;
  margin: 1.5rem 0;
  color: hsl(var(--foreground) / 0.7);
  font-style: normal;
}

:deep(.md-preview code) {
  background: hsl(var(--muted));
  border-radius: 0.25rem;
  padding: 0.125rem 0.375rem;
  font-size: 0.875em;
  font-weight: 500;
}

:deep(.md-preview pre) {
  background: hsl(var(--muted)) !important;
  border: 1px solid hsl(var(--border));
  border-radius: 0.5rem;
  padding: 1rem 1.25rem;
  overflow-x: auto;
  margin: 1.5em 0;
  font-size: 0.875em;
}

:deep(.md-preview pre code) {
  background: transparent;
  padding: 0;
  font-weight: 400;
}

:deep(.md-preview a) {
  color: hsl(var(--primary));
  text-decoration: underline;
  text-underline-offset: 3px;
  text-decoration-color: hsl(var(--primary) / 0.4);
  transition: text-decoration-color 0.15s;
}

:deep(.md-preview a:hover) {
  text-decoration-color: hsl(var(--primary));
}

:deep(.md-preview ul),
:deep(.md-preview ol) {
  margin: 1.25em 0;
  padding-left: 1.5em;
}

:deep(.md-preview ul li),
:deep(.md-preview ol li) {
  margin: 0.5em 0;
  color: hsl(var(--foreground) / 0.88);
}

:deep(.md-preview ul li::marker) {
  color: hsl(var(--muted-foreground));
}

:deep(.md-preview img) {
  border-radius: 0.5rem;
  border: 1px solid hsl(var(--border));
  max-width: 100%;
  margin: 1.5em 0;
}

:deep(.md-preview hr) {
  border: 0;
  border-top: 1px solid hsl(var(--border));
  margin: 2.5em 0;
}

:deep(.md-preview table) {
  width: 100%;
  border-collapse: collapse;
  margin: 1.5em 0;
  font-size: 0.9em;
}

:deep(.md-preview th),
:deep(.md-preview td) {
  border: 1px solid hsl(var(--border));
  padding: 0.5rem 0.75rem;
  text-align: left;
}

:deep(.md-preview th) {
  background: hsl(var(--muted));
  font-weight: 600;
}
</style>

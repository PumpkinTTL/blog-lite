<template>
  <aside class="article-toc" :class="{ 'dark-mode': isDark, mobile: mobile }">
    <div class="toc-shell">
      <div class="toc-head">
        <div class="toc-title-row">
          <font-awesome-icon icon="list-check" class="toc-icon" />
          <span class="toc-title">文章目录</span>
        </div>
        <span class="toc-count">{{ headingCount }} 节</span>
      </div>

      <p class="toc-tip">跟随正文结构快速定位重点内容。</p>

      <MdCatalog
        class="toc-catalog"
        :editor-id="editorId"
        :scroll-element="scrollElement"
        :theme="isDark ? 'dark' : 'light'"
        :offset-top="88"
      />
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed } from "vue";
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
const headingCount = computed(
  () => props.markdown.match(/^#{1,3}\s+/gm)?.length ?? 0
);
const scrollElement = computed(() => props.scrollElement);
const mobile = computed(() => props.mobile);
</script>

<style scoped lang="scss">
.article-toc {
  width: 100%;
}

.toc-shell {
  padding: 18px 16px 16px;
  border-radius: 18px;
  border: 1px solid rgba(226, 232, 240, 0.9);
  background: #fff;
  box-shadow: 0 16px 36px rgba(15, 23, 42, 0.08);
}

.toc-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 8px;
}

.toc-title-row {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.toc-icon {
  color: #2563eb;
}

.toc-title {
  font-size: 14px;
  font-weight: 800;
  color: #0f172a;
}

.toc-count {
  padding: 4px 8px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
  color: #475569;
  background: #f8fafc;
  border: 1px solid rgba(226, 232, 240, 0.9);
}

.toc-tip {
  margin: 0 0 12px;
  font-size: 12px;
  line-height: 1.6;
  color: #64748b;
}

:deep(.md-editor-catalog) {
  font-family: "OPPO Sans", sans-serif;
}

:deep(.md-editor-catalog-link) {
  border-radius: 10px;
  transition: background-color 0.2s ease, color 0.2s ease;
}

:deep(.md-editor-catalog-active > .md-editor-catalog-link) {
  background: rgba(59, 130, 246, 0.1);
}

.mobile {
  .toc-shell {
    padding: 0;
    border: none;
    border-radius: 0;
    background: transparent;
    box-shadow: none;
  }

  .toc-head {
    margin-bottom: 10px;
  }

  .toc-title {
    font-size: 15px;
  }

  .toc-count {
    background: #eef2ff;
    color: #4338ca;
    border-color: #c7d2fe;
  }

  .toc-tip {
    margin-bottom: 10px;
    font-size: 11px;
  }

  :deep(.md-editor-catalog-link) {
    padding: 6px 8px;
    border-radius: 12px;
  }

  :deep(.md-editor-catalog-active > .md-editor-catalog-link) {
    background: rgba(37, 99, 235, 0.12);
  }
}

.dark-mode {
  .toc-shell {
    border-color: rgba(51, 65, 85, 0.9);
    background: #0f172a;
    box-shadow: 0 18px 44px rgba(2, 6, 23, 0.28);
  }

  .toc-title {
    color: #f8fafc;
  }

  .toc-count {
    color: #cbd5e1;
    background: rgba(15, 23, 42, 0.72);
    border-color: rgba(51, 65, 85, 0.9);
  }

  .toc-tip {
    color: #94a3b8;
  }

  :deep(.md-editor-catalog) {
    color: #cbd5e1;
  }

  :deep(.md-editor-catalog-active > .md-editor-catalog-link) {
    background: rgba(96, 165, 250, 0.16);
  }

  &.mobile {
    .toc-shell {
      background: transparent;
      box-shadow: none;
      border: none;
    }
  }
}
</style>

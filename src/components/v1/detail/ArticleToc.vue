<template>
  <aside class="article-toc" :class="{ 'dark-mode': isDark, mobile: mobile }">
    <div class="toc-shell">
      <div class="toc-head">
        <div class="toc-title-row">
          <div class="icon-wrap animate__animated animate__fadeInLeft animate__delay-1000ms">
            <font-awesome-icon icon="list-ul" class="toc-icon" />
          </div>
          <span class="toc-title animate__animated animate__fadeInLeft animate__delay-1050ms">文章目录</span>
        </div>
        <span class="toc-count animate__animated animate__fadeInLeft animate__delay-1100ms">{{ headingCount }} 节</span>
      </div>

      <p class="toc-tip animate__animated animate__fadeInLeft animate__delay-1150ms">快速预览文章结构，点击跳转指定章节。</p>

      <div class="toc-content animate__animated animate__fadeInLeft animate__delay-1200ms">
        <MdCatalog
          class="toc-catalog"
          :editor-id="editorId"
          :scroll-element="scrollElement"
          :theme="isDark ? 'dark' : 'light'"
          :offset-top="88"
        />
      </div>
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
const headingCount = computed(() => {
  const matches = props.markdown.match(/^#{1,3}\s+/gm);
  return matches ? matches.length : 0;
});
const scrollElement = computed(() => props.scrollElement);
const mobile = computed(() => props.mobile);
</script>

<style scoped lang="scss">
.article-toc {
  width: 100%;
  font-family: "Inter", "Outfit", -apple-system, sans-serif;
}

.toc-shell {
  padding: 20px;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.6);
  background: rgba(255, 255, 255, 0.72);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  box-shadow: 
    0 4px 24px -1px rgba(0, 0, 0, 0.04),
    0 12px 40px -2px rgba(0, 0, 0, 0.06);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.toc-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.toc-title-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.icon-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 8px;
  background: linear-gradient(135deg, #3b82f615, #2563eb15);
  color: #2563eb;
}

.toc-icon {
  font-size: 14px;
}

.toc-title {
  font-size: 15px;
  font-weight: 700;
  color: #1e293b;
  letter-spacing: -0.01em;
}

.toc-count {
  font-size: 11px;
  font-weight: 600;
  padding: 3px 8px;
  border-radius: 6px;
  background: #f1f5f9;
  color: #64748b;
  border: 1px solid #e2e8f0;
}

.toc-tip {
  margin: 0 0 16px;
  font-size: 11px;
  line-height: 1.5;
  color: #94a3b8;
  font-weight: 500;
}

.toc-content {
  max-height: calc(100vh - 300px);
  overflow-y: auto;
  margin-right: -4px;
  padding-right: 4px;

  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: #e2e8f0;
    border-radius: 10px;
  }
}

:deep(.md-editor-catalog) {
  font-family: inherit;
  font-size: 14px;
  line-height: 1.4;
}

:deep(.md-editor-catalog-link) {
  padding: 8px 12px;
  margin: 2px 0;
  border-radius: 10px;
  color: #64748b;
  transition: all 0.2s ease;
  cursor: pointer;
  border: 1px solid transparent;

  span {
    display: inline-block;
    transition: transform 0.2s ease;
  }

  &:hover {
    color: #2563eb;
    background: rgba(59, 130, 246, 0.05);
    transform: translateX(4px);
  }
}

:deep(.md-editor-catalog-active > .md-editor-catalog-link) {
  color: #2563eb;
  font-weight: 600;
  background: rgba(59, 130, 246, 0.08);
  border-color: rgba(59, 130, 246, 0.1);
  
  &::before {
    content: "";
    position: absolute;
    left: 4px;
    height: 12px;
    width: 3px;
    background: #2563eb;
    border-radius: 2px;
  }
}

.mobile {
  .toc-shell {
    padding: 0;
    border: none;
    border-radius: 0;
    background: transparent;
    box-shadow: none;
    backdrop-filter: none;
  }

  .toc-head {
    margin-bottom: 14px;
  }

  .toc-title {
    font-size: 16px;
  }

  .toc-tip {
    font-size: 12px;
    margin-bottom: 20px;
  }

  .toc-content {
    max-height: none;
    margin: 0;
    padding: 0;
  }

  :deep(.md-editor-catalog-link) {
    padding: 10px 12px;
    margin: 4px 0;
    background: #f8fafc;
    border: 1px solid #f1f5f9;
  }

  :deep(.md-editor-catalog-active > .md-editor-catalog-link) {
    background: #eff6ff;
    border-color: #dbeafe;
  }
}

.dark-mode {
  .toc-shell {
    background: rgba(30, 41, 59, 0.7);
    border-color: rgba(255, 255, 255, 0.05);
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
  }

  .toc-title {
    color: #f8fafc;
  }

  .icon-wrap {
    background: rgba(59, 130, 246, 0.2);
    color: #60a5fa;
  }

  .toc-count {
    background: rgba(15, 23, 42, 0.5);
    color: #94a3b8;
    border-color: rgba(255, 255, 255, 0.05);
  }

  .toc-tip {
    color: #64748b;
  }

  .toc-content::-webkit-scrollbar-thumb {
    background: #334155;
  }

  :deep(.md-editor-catalog-link) {
    color: #94a3b8;

    &:hover {
      color: #60a5fa;
      background: rgba(59, 130, 246, 0.1);
    }
  }

  :deep(.md-editor-catalog-active > .md-editor-catalog-link) {
    color: #60a5fa;
    background: rgba(59, 130, 246, 0.15);
    border-color: rgba(59, 130, 246, 0.2);

    &::before {
      background: #60a5fa;
    }
  }

  &.mobile {
    :deep(.md-editor-catalog-link) {
      background: rgba(15, 23, 42, 0.3);
      border-color: rgba(255, 255, 255, 0.03);
    }

    :deep(.md-editor-catalog-active > .md-editor-catalog-link) {
      background: rgba(37, 99, 235, 0.15);
      border-color: rgba(37, 99, 235, 0.2);
    }
  }
}
</style>

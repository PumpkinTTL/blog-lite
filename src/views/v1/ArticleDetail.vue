<template>
  <div class="article-detail-page" :class="{ 'dark-mode': isDark }">
    <div class="detail-container">
      <section class="detail-left">
        <div class="master-article-shell" v-if="article">
          <ArticleHero :article="article" />
          <div class="shell-divider"></div>
          <ArticleContent :article="article">
            <template #footer>
              <ArticleFooter :likes="article.likes" :liked="article.liked" :bookmarked="article.bookmarked" :prev="prevArticle" :next="nextArticle" />
            </template>
          </ArticleContent>
        </div>

        <!-- 评论区 -->
        <ArticleComments v-if="article" />

        <!-- 移动端相关推荐 -->
        <ArticleRelated v-if="article && isMobile" :articles="relatedArticles" :mobile="true" />

        <!-- 文末广告位 -->
        <div class="after-article-ad" v-if="article">
          <AdContainer
            title="想要系统学习 Vue 3？"
            description="从零到一完整实战课程，覆盖 Composition API、Pinia、TypeScript 全栈开发，限时折扣中。"
            button-text="了解详情"
            @click="handleAdClick('after-article')"
          />
        </div>

      </section>

      <aside class="detail-right" v-if="article && !isMobile">
        <div class="detail-right-inner">
          <ArticleToc
            :editor-id="previewId"
            :markdown="article.markdown"
            scroll-element="html"
          />

          <!-- 相关推荐 -->
          <ArticleRelated :articles="relatedArticles" />

          <!-- 侧边栏广告位 1：推广卡片 -->
          <div class="sidebar-ad">
            <AdContainer
              title="VueConf China 2026"
              description="全球顶级 Vue 开发者大会，早鸟票限时优惠中，抢先锁定席位！"
              button-text="了解详情"
              image="https://api.dicebear.com/9.x/notionists/svg?seed=VueConf&backgroundColor=3b82f6"
              @click="handleAdClick('sidebar-promo')"
            />
          </div>

        </div>
      </aside>
    </div>

    <!-- ── Mobile TOC Drawer ── -->
    <div
      v-if="article && isMobile"
      class="toc-drawer-root"
      :class="{ open: mobileTocOpen }"
    >
      <!-- Backdrop -->
      <div class="drawer-backdrop" @click="mobileTocOpen = false"></div>

      <!-- Trigger Button -->
      <button
        class="drawer-trigger"
        @click="mobileTocOpen = !mobileTocOpen"
        :aria-expanded="mobileTocOpen"
        aria-label="打开目录"
      >
        <font-awesome-icon icon="list-ul" />
      </button>

      <!-- Drawer Panel -->
      <div class="drawer-panel">
        <div class="drawer-head">
          <div class="drawer-title-row">
            <font-awesome-icon icon="list-ul" class="drawer-icon" />
            <span class="drawer-title">文章目录</span>
          </div>
          <button class="drawer-close" @click="mobileTocOpen = false">
            <font-awesome-icon icon="xmark" />
          </button>
        </div>
        <div class="drawer-body">
          <ArticleToc
            :editor-id="previewId"
            :markdown="article.markdown"
            :mobile="true"
            scroll-element="html"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { useThemeStore } from "@/stores/theme";
import AdContainer from "@/components/v1/common/AdContainer.vue";
import ArticleComments from "@/components/v1/detail/ArticleComments.vue";
import ArticleContent from "@/components/v1/detail/ArticleContent.vue";
import ArticleHero from "@/components/v1/detail/ArticleHero.vue";
import ArticleToc from "@/components/v1/detail/ArticleToc.vue";
import ArticleFooter from "@/components/v1/detail/ArticleFooter.vue";
import ArticleRelated from "@/components/v1/detail/ArticleRelated.vue";
import { articleList, getAdjacentArticles } from "@/data/articleMock";
import type { ArticleFull } from "@/data/articleMock";

const themeStore = useThemeStore();
const isDark = computed(() => themeStore.isDark);
const route = useRoute();
const article = ref<ArticleFull | null>(null);
const prevArticle = ref<{ id: string; title: string; cover: string; category: string } | null>(null);
const nextArticle = ref<{ id: string; title: string; cover: string; category: string } | null>(null);
const mobileTocOpen = ref(false);
const isMobile = ref(false);
const previewId = computed(() =>
  article.value ? `article-preview-${article.value.id}` : "article-preview"
);

const handleAdClick = (slot: string) => {
  console.log(`[Ad] clicked: ${slot}`);
};

const updateMobileState = () => {
  if (typeof window === "undefined") return;
  isMobile.value = window.innerWidth <= 1100;
  if (!isMobile.value) mobileTocOpen.value = false;
};

const loadArticle = () => {
  const id = route.params.id as string;
  const found = articleList.find((a) => a.id === id);
  article.value = found ?? articleList[0] ?? null;
  const { prev, next } = getAdjacentArticles(article.value?.id ?? id);
  prevArticle.value = prev;
  nextArticle.value = next;
};

// 相关推荐：排除当前文章，取同分类优先，最多5篇
const relatedArticles = computed(() => {
  if (!article.value) return [];
  const currentId = article.value.id;
  const currentCategory = article.value.category;
  const others = articleList.filter((a) => a.id !== currentId);
  const sameCategory = others.filter((a) => a.category === currentCategory);
  const diffCategory = others.filter((a) => a.category !== currentCategory);
  return [...sameCategory, ...diffCategory].slice(0, 5).map((a) => ({
    id: a.id,
    title: a.title,
    cover: a.cover,
    category: a.category,
  }));
});

// 监听路由变化，重新加载文章并关闭目录
watch(
  () => route.path,
  () => {
    mobileTocOpen.value = false;
    loadArticle();
  }
);

onMounted(() => {
  updateMobileState();
  window.addEventListener("resize", updateMobileState);
  loadArticle();
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", updateMobileState);
});
</script>

<style scoped lang="scss">
.article-detail-page {
  min-height: 100vh;
  background: var(--bg, #f8fafc);
  color: var(--text, #0a0a0a);
  transition: background-color 0.3s;

  &.dark-mode {
    background: var(--bg, #0f172a);
    color: var(--text, #e8e8e8);
  }
}

.detail-container {
  position: relative;
  max-width: 1320px;
  margin: 0 auto;
  padding: 40px 20px 88px;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 300px;
  gap: 32px;
}

.detail-left {
  min-width: 0;
}

.master-article-shell {
  background: white;
  border-radius: 28px;
  border: 1px solid rgba(226, 232, 240, 0.8);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02),
    0 20px 60px -15px rgba(15, 23, 42, 0.08);
  overflow: hidden;
  transition: all 0.3s ease;
  min-height: calc(100vh - 160px);

  .article-detail-page.dark-mode & {
    background: #1e293b;
    border-color: rgba(45, 55, 72, 0.8);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05),
      0 20px 60px -15px rgba(0, 0, 0, 0.2);
  }
}

.shell-divider {
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent 5%,
    rgba(226, 232, 240, 0.6) 20%,
    rgba(226, 232, 240, 0.6) 80%,
    transparent 95%
  );
  margin: 0 40px;

  .article-detail-page.dark-mode & {
    background: linear-gradient(
      90deg,
      transparent 5%,
      rgba(45, 55, 72, 0.6) 20%,
      rgba(45, 55, 72, 0.6) 80%,
      transparent 95%
    );
  }
}

.detail-right-inner {
  position: sticky;
  top: 100px;
  width: 100%;
  z-index: 20;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.sidebar-ad {
  flex-shrink: 0;
}

.after-article-ad {
  margin-top: 24px;
  max-width: 100%;
}

.comments-wrapper {
  margin-top: 24px;
}

@media (max-width: 1400px) {
  .detail-container {
    grid-template-columns: minmax(0, 1fr) 280px;
    gap: 24px;
  }
}

@media (max-width: 1100px) {
  .detail-container {
    grid-template-columns: 1fr;
    padding: 24px 16px 88px;
  }

  // ── Mobile TOC Drawer ──
  .toc-drawer-root {
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 5000;
  }

  .drawer-backdrop {
    position: absolute;
    inset: 0;
    background: rgba(15, 23, 42, 0.4);
    opacity: 0;
    transition: opacity 0.3s ease;
    pointer-events: none;

    .toc-drawer-root.open & {
      opacity: 1;
      pointer-events: auto;
    }
  }

  // Trigger: 右侧竖条按钮
  .drawer-trigger {
    pointer-events: auto;
    position: fixed;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    z-index: 5002;
    width: 36px;
    height: 80px;
    background: white;
    color: #2563eb;
    border: 1px solid rgba(226, 232, 240, 0.8);
    border-right: none;
    border-radius: 12px 0 0 12px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 4px;
    font-size: 14px;
    box-shadow: -2px 0 12px rgba(0, 0, 0, 0.06);
    cursor: pointer;
    transition: all 0.2s ease;

    .trigger-label {
      font-size: 10px;
      font-weight: 700;
      color: #64748b;
    }

    .dark-mode & {
      background: #1e293b;
      border-color: rgba(45, 55, 72, 0.8);
      box-shadow: -2px 0 12px rgba(0, 0, 0, 0.3);
      color: #60a5fa;

      .trigger-label {
        color: #94a3b8;
      }
    }

    &:hover {
      background: #2563eb;
      color: #fff;
      box-shadow: -4px 0 16px rgba(37, 99, 235, 0.25);

      .trigger-label {
        color: #fff;
      }

      .dark-mode & {
        background: #2563eb;
      }
    }

    .toc-drawer-root.open & {
      opacity: 0;
      pointer-events: none;
    }
  }

  // Drawer Panel: 实心白底，对齐主文章卡片
  .drawer-panel {
    pointer-events: auto;
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    width: min(80vw, 320px);
    background: white;
    box-shadow: -8px 0 30px rgba(0, 0, 0, 0.1);
    transform: translateX(100%);
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 5001;
    display: flex;
    flex-direction: column;
    overflow: hidden;

    .dark-mode & {
      background: #1e293b;
      box-shadow: -8px 0 30px rgba(0, 0, 0, 0.4);
    }

    .toc-drawer-root.open & {
      transform: translateX(0);
    }
  }

  .drawer-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 20px 16px;
    border-bottom: 1px solid #f1f5f9;
    flex-shrink: 0;

    .dark-mode & {
      border-color: rgba(51, 65, 85, 0.5);
    }
  }

  .drawer-title-row {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .drawer-icon {
    font-size: 13px;
    color: #2563eb;

    .dark-mode & {
      color: #60a5fa;
    }
  }

  .drawer-title {
    font-size: 15px;
    font-weight: 700;
    color: #0f172a;

    .dark-mode & {
      color: #f8fafc;
    }
  }

  .drawer-close {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    background: #f8fafc;
    border: none;
    color: #94a3b8;
    font-size: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.15s ease;

    .dark-mode & {
      background: rgba(51, 65, 85, 0.4);
    }

    &:hover {
      color: #64748b;
      background: #f1f5f9;

      .dark-mode & {
        color: #cbd5e1;
        background: rgba(51, 65, 85, 0.6);
      }
    }
  }

  .drawer-body {
    flex: 1;
    overflow-y: auto;
    padding: 8px 16px 24px;

    &::-webkit-scrollbar {
      width: 3px;
    }
    &::-webkit-scrollbar-thumb {
      background: #e2e8f0;
      border-radius: 10px;

      .dark-mode & {
        background: #334155;
      }
    }
  }
}
</style>

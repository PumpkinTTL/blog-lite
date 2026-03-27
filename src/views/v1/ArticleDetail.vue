<template>
  <div class="article-detail-page" :class="{ 'dark-mode': isDark }">
    <div class="detail-container">
      <section class="detail-left">
        <div class="master-article-shell" v-if="article">
          <ArticleHero :article="article" />
          <div class="shell-divider"></div>
          <ArticleContent :article="article" />
        </div>
      </section>

      <aside class="detail-right" v-if="article && !isMobile">
        <div class="detail-right-inner">
          <ArticleToc
            :editor-id="previewId"
            :markdown="article.markdown"
            scroll-element="html"
          />
        </div>
      </aside>
    </div>

    <!-- ── PRO NAVIGATION MODAL (CENTERED POPUP) ── -->
    <div
      v-if="article && isMobile"
      class="nav-modal-root"
      :class="{ open: mobileTocOpen }"
    >
      <div class="modal-backdrop" @click="mobileTocOpen = false"></div>

      <!-- Sophisticated Floating Button -->
      <button
        class="nav-trigger-fab"
        @click="mobileTocOpen = !mobileTocOpen"
        :aria-expanded="mobileTocOpen"
        aria-label="Navigation Menu"
      >
        <div class="icon-box">
          <font-awesome-icon :icon="mobileTocOpen ? 'xmark' : 'list-ul'" />
        </div>
      </button>

      <!-- Centered Premium Modal -->
      <div class="modal-viewport">
        <div class="modal-surface">
          <header class="modal-header">
            <div class="header-left">
              <span class="badge">Outline</span>
              <h2 class="title">快速导航</h2>
            </div>
            <button class="modal-close-btn" @click="mobileTocOpen = false">
              <font-awesome-icon icon="xmark" />
            </button>
          </header>
          
          <div class="modal-main">
            <ArticleToc
              :editor-id="previewId"
              :markdown="article.markdown"
              :mobile="true"
              scroll-element="html"
            />
          </div>

          <footer class="modal-footer">
            <div class="footer-tip">Scroll or Click to Jump</div>
            <button class="primary-btn" @click="mobileTocOpen = false">我知道了</button>
          </footer>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { useThemeStore } from "@/stores/theme";
import ArticleContent from "@/components/v1/detail/ArticleContent.vue";
import ArticleHero from "@/components/v1/detail/ArticleHero.vue";
import ArticleToc from "@/components/v1/detail/ArticleToc.vue";

interface Article {
  id: string;
  title: string;
  description: string;
  cover: string;
  category: string;
  author: {
    name: string;
    avatar: string;
    role: string;
  };
  createdAt: string;
  views: number;
  tags: string[];
  markdown: string;
  readMinutes: number;
  wordCount: number;
  updatedAt: string;
  difficulty: string;
  lead: string;
}

const markdownContent = [
  "# Composition API 的价值，不只是语法升级",
  "",
  "Composition API 的关键价值，不是语法更新，而是让你按业务能力组织代码。页面一旦同时承载数据请求、筛选状态、权限控制和交互反馈，继续按 `data`、`computed`、`methods` 机械拆分，很快就会失去可读性。",
  "",
  "真正影响维护成本的，是状态边界是否清晰。哪些是源数据，哪些是派生值，哪些逻辑应该抽成 composable，哪些副作用必须留在组件内部，这些判断比 API 本身更重要。",
  "",
  "## 核心判断",
  "",
  "> 一个功能块如果会跨两个以上页面复用，或者内部同时维护状态、计算值和副作用，就不要继续堆在单文件组件里，应该尽早抽离成 composable。",
  "",
  "## 实际项目里最值得先统一的三件事",
  "",
  "- 把接口请求、缓存和 loading/error 状态收口到 composable，避免页面组件里充满重复的异步模板逻辑。",
  "- 约定 computed 只做派生，不混入副作用，这样依赖链才容易推断，排查问题也更快。",
  "- 把筛选、分页、滚动监听、复制链接这类局部共享能力沉淀成 hooks，而不是直接塞进 Pinia。",
  "",
  "## 一个更稳的组合式拆分方式",
  "",
  "```ts",
  "const article = ref<ArticleDetail | null>(null)",
  "const loading = ref(false)",
  "",
  'const tagText = computed(() => article.value?.tags.join(" / ") ?? "")',
  "",
  "async function fetchArticle(id: string) {",
  "  loading.value = true",
  "  try {",
  "    article.value = await getArticleDetail(id)",
  "  } finally {",
  "    loading.value = false",
  "  }",
  "}",
  "```",
  "",
  "## 为什么现在先做正文，而不是评论",
  "",
  "这也是为什么详情页现在应该先把正文做完整，而不是直接去做评论。只有正文结构、视觉节奏、代码块和重点信息都稳定了，目录、锚点、分享和相关推荐这些能力接入时才不会返工。",
  "",
  "等这个组件定型，下一步就可以自然衔接到 `ArticleToc`，因为它直接依赖正文标题结构和内容分段。",
  "",
  "## 当前组件定位",
  "",
  "这一版先解决正文阅读体验、内容层级和暗色主题表现，后续再在这个基础上接标题锚点、高亮导航和评论系统。",
].join("\n");

const themeStore = useThemeStore();
const isDark = computed(() => themeStore.isDark);
const route = useRoute();
const article = ref<Article | null>(null);
const mobileTocOpen = ref(false);
const isMobile = ref(false);
const previewId = computed(() =>
  article.value ? `article-preview-${article.value.id}` : "article-preview"
);

const updateMobileState = () => {
  if (typeof window === "undefined") return;
  isMobile.value = window.innerWidth <= 1100;
  if (!isMobile.value) mobileTocOpen.value = false;
};

// 监听路由变化，关闭目录
watch(
  () => route.path,
  () => {
    mobileTocOpen.value = false;
  }
);

onMounted(() => {
  updateMobileState();
  window.addEventListener("resize", updateMobileState);

  article.value = {
    id: route.params.id as string,
    title: "Vue 3 Composition API 深度解析：从原理到实战落地",
    description:
      "深入探讨 Vue 3 Composition API 的设计理念、拆分方式与项目落地经验，帮助你建立更稳定的状态组织 and 组件协作思路。",
    cover:
      "https://images.unsplash.com/photo-1555099962-4199c345e5dd?w=1200&h=600&fit=crop",
    category: "前端",
    author: {
      name: "开发者",
      avatar:
        "https://api.dicebear.com/9.x/notionists/svg?seed=Felix&backgroundColor=e6e6fa",
      role: "admin",
    },
    createdAt: "2024-03-20",
    updatedAt: "2024-03-24",
    views: 8542,
    tags: ["Vue3", "Composition API", "前端开发", "JavaScript"],
    readMinutes: 8,
    wordCount: 3680,
    difficulty: "进阶",
    lead: "AI 算法深度分析：本文核心在于揭示 Vue 3 组合式 API 的逻辑复用机制。通过对数据链路与副作用边界的深度拆解，为开发者提供了一套可落地的状态管理与组件协作范式。不仅是语法的变迁，更是思维方式的进化。",
    markdown: markdownContent,
  };
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
}

.mobile-toc-float {
  display: none;
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

  // ── PREMIUM NAVIGATION MODAL STYLES ──
  .nav-modal-root {
    display: block;
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 5000;
  }

  .modal-backdrop {
    position: absolute;
    inset: 0;
    background: rgba(15, 23, 42, 0.6);
    backdrop-filter: blur(10px);
    opacity: 0;
    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    pointer-events: none;
    
    .nav-modal-root.open & {
      opacity: 1;
      pointer-events: auto;
    }
  }

  // Sleek FAB
  .nav-trigger-fab {
    pointer-events: auto;
    position: fixed;
    right: 24px;
    bottom: 40px;
    z-index: 5002;
    width: 60px;
    height: 60px;
    background: #0f172a;
    color: white;
    border: none;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.3);
    transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
    cursor: pointer;

    .dark-mode & {
      background: #3b82f6;
    }

    .icon-box {
      font-size: 22px;
      transition: transform 0.4s ease;
    }

    .nav-modal-root.open & {
      transform: scale(0) rotate(180deg);
      opacity: 0;
    }
  }

  // Modal Viewport
  .modal-viewport {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
    z-index: 5001;
    perspective: 1200px;
  }

  .modal-surface {
    pointer-events: auto;
    width: 100%;
    max-width: 440px;
    background: white;
    border-radius: 36px;
    box-shadow: 0 40px 100px -20px rgba(0, 0, 0, 0.4);
    display: flex;
    flex-direction: column;
    max-height: 85vh;
    transform: translateY(60px) scale(0.92);
    opacity: 0;
    transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1); // Bouncy Entrance

    .nav-modal-root.open & {
      transform: translateY(0) scale(1);
      opacity: 1;
    }

    .dark-mode & {
      background: #111827;
      box-shadow: 0 40px 100px -20px rgba(0, 0, 0, 0.7);
    }
  }

  .modal-header {
    padding: 32px 32px 20px;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;

    .badge {
      font-size: 10px;
      font-weight: 800;
      color: #3b82f6;
      text-transform: uppercase;
      letter-spacing: 0.2em;
      display: block;
      margin-bottom: 6px;
    }

    .title {
      font-size: 24px;
      font-weight: 800;
      color: #0f172a;
      margin: 0;

      .dark-mode & {
        color: white;
      }
    }

    .modal-close-btn {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: #f1f5f9;
      border: none;
      color: #94a3b8;
      font-size: 18px;
      display: flex;
      align-items: center;
      justify-content: center;

      .dark-mode & {
        background: #1e293b;
      }
    }
  }

  .modal-main {
    flex: 1;
    overflow-y: auto;
    padding: 12px 28px;
    
    &::-webkit-scrollbar { display: none; }
  }

  .modal-footer {
    padding: 20px 32px 40px;
    text-align: center;

    .footer-tip {
      font-size: 12px;
      color: #64748b;
      margin-bottom: 16px;
      font-weight: 600;
      opacity: 0.6;
    }
    
    .primary-btn {
      width: 100%;
      height: 56px;
      background: #3b82f6;
      color: white;
      border: none;
      border-radius: 18px;
      font-size: 16px;
      font-weight: 800;
      letter-spacing: 0.1em;
      cursor: pointer;
      box-shadow: 0 10px 24px rgba(59, 130, 246, 0.4);
      transition: all 0.3s ease;

      &:active { transform: scale(0.98); }
    }
  }
}
</style>

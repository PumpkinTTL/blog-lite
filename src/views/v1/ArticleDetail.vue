<template>
  <div class="article-detail-page" :class="{ 'dark-mode': isDark }">
    <div class="detail-container">
      <section class="detail-left">
        <ArticleHero v-if="article" :article="article" />
        <ArticleContent v-if="article" :article="article" />
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

    <div
      v-if="article && isMobile"
      class="mobile-toc-float"
      :class="{ open: mobileTocOpen }"
    >
      <button
        class="mobile-toc-handle"
        type="button"
        @click="mobileTocOpen = !mobileTocOpen"
      >
        <font-awesome-icon :icon="mobileTocOpen ? 'xmark' : 'list-check'" />
        <span>{{ mobileTocOpen ? "收起" : "目录" }}</span>
      </button>

      <div class="mobile-toc-card">
        <div class="mobile-toc-card-head">
          <div class="mobile-toc-card-title">文章目录</div>
          <div class="mobile-toc-card-tip">贴边展开，随时定位章节</div>
        </div>
        <ArticleToc
          :editor-id="previewId"
          :markdown="article.markdown"
          :mobile="true"
          scroll-element="html"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
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
  takeaways: string[];
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
const isDark = themeStore.isDark;
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

onMounted(() => {
  updateMobileState();
  window.addEventListener("resize", updateMobileState);

  article.value = {
    id: route.params.id as string,
    title: "Vue 3 Composition API 深度解析：从原理到实战落地",
    description:
      "深入探讨 Vue 3 Composition API 的设计理念、拆分方式与项目落地经验，帮助你建立更稳定的状态组织和组件协作思路。",
    cover:
      "https://images.unsplash.com/photo-1555099962-4199c345e5dd?w=1200&h=600&fit=crop",
    category: "前端",
    author: {
      name: "DevMaster",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=DevMaster",
      role: "admin",
    },
    createdAt: "2024-03-20",
    updatedAt: "2024-03-24",
    views: 8542,
    tags: ["Vue3", "Composition API", "前端开发", "JavaScript"],
    readMinutes: 8,
    wordCount: 3680,
    difficulty: "进阶",
    lead:
      "这篇文章不是概念罗列，而是从真实项目里最常见的状态组织问题出发，帮你判断什么时候该拆 composable、什么时候该保留在页面组件里。",
    takeaways: [
      "理清源数据、派生值和副作用的边界",
      "用更稳的 composable 结构承接接口与状态",
      "为后续目录、锚点和评论能力预留清晰内容结构",
    ],
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

  &.dark-mode {
    background: var(--bg, #0f172a);
    color: var(--text, #e8e8e8);
  }
}

.detail-container {
  position: relative;
  max-width: 1320px;
  margin: 0 auto;
  padding: 60px 20px 88px;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 320px;
  gap: 24px;
  align-items: start;
}

.detail-left {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.detail-right-inner {
  position: fixed;
  top: 132px;
  right: max(20px, calc((100vw - 1320px) / 2 + 20px));
  width: 320px;
  z-index: 20;
}

.mobile-toc-float {
  display: none;
}

@media (max-width: 1400px) {
  .detail-container {
    grid-template-columns: minmax(0, 1fr) 300px;
  }

  .detail-right-inner {
    width: 300px;
    right: max(16px, calc((100vw - 1200px) / 2 + 16px));
  }
}

@media (max-width: 1100px) {
  .detail-container {
    grid-template-columns: 1fr;
    gap: 18px;
    padding: 48px 14px 72px;
  }

  .mobile-toc-float {
    position: fixed;
    top: 34%;
    right: 0;
    z-index: 60;
    display: flex;
    align-items: flex-start;
    transform: translateX(calc(100% - 36px));
    transition:
      transform 0.42s cubic-bezier(0.16, 1, 0.3, 1),
      opacity 0.26s ease;
    filter: drop-shadow(0 18px 36px rgba(15, 23, 42, 0.12));
    opacity: 0.98;
  }

  .mobile-toc-float.open {
    transform: translateX(0);
    opacity: 1;
  }

  .mobile-toc-handle {
    align-self: flex-start;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    justify-content: center;
    min-width: 36px;
    min-height: 118px;
    margin-top: 18px;
    margin-right: -14px;
    padding: 12px 6px 10px;
    border: 1px solid rgba(226, 232, 240, 0.95);
    border-right: none;
    border-top-left-radius: 18px;
    border-bottom-left-radius: 18px;
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.98), rgba(248, 250, 252, 0.98));
    color: #475569;
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.9),
      0 8px 20px rgba(15, 23, 42, 0.06);
    writing-mode: vertical-rl;
    text-orientation: mixed;
    letter-spacing: 0.08em;
    position: relative;
    z-index: 2;
  }

  .mobile-toc-handle :deep(svg) {
    color: #38bdf8;
  }

  .mobile-toc-float.open .mobile-toc-handle {
    margin-right: -16px;
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.92),
      0 10px 24px rgba(15, 23, 42, 0.08);
  }

  .mobile-toc-card {
    width: min(76vw, 296px);
    max-height: 68vh;
    padding: 16px 14px 14px;
    overflow-y: auto;
    border-top-left-radius: 22px;
    border-bottom-left-radius: 22px;
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.98), rgba(248, 250, 252, 0.98));
    box-shadow:
      -12px 18px 40px rgba(15, 23, 42, 0.1),
      inset 0 1px 0 rgba(255, 255, 255, 0.96);
    border: 1px solid rgba(226, 232, 240, 0.95);
    position: relative;
  }

  .mobile-toc-card::before {
    content: "";
    position: absolute;
    left: -12px;
    top: 20px;
    width: 18px;
    height: calc(100% - 40px);
    border-top-left-radius: 14px;
    border-bottom-left-radius: 14px;
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.98), rgba(248, 250, 252, 0.98));
    border: 1px solid rgba(226, 232, 240, 0.95);
    border-right: none;
    pointer-events: none;
  }

  .mobile-toc-card-head {
    margin-bottom: 12px;
    padding-bottom: 12px;
    border-bottom: 1px solid rgba(226, 232, 240, 0.95);
  }

  .mobile-toc-card-title {
    font-size: 16px;
    font-weight: 800;
    color: #0f172a;
  }

  .mobile-toc-card-tip {
    margin-top: 4px;
    font-size: 11px;
    line-height: 1.5;
    color: #64748b;
  }
}
</style>

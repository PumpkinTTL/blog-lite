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
      <div 
        class="mobile-toc-backdrop" 
        @click="mobileTocOpen = false"
      ></div>
      
      <button
        class="mobile-toc-handle"
        type="button"
        @click="mobileTocOpen = !mobileTocOpen"
        :aria-expanded="mobileTocOpen"
        aria-label="Toggle Table of Contents"
      >
        <div class="handle-icon-box">
          <font-awesome-icon :icon="mobileTocOpen ? 'xmark' : 'list-check'" />
        </div>
        <span class="handle-text">{{ mobileTocOpen ? "关闭" : "目录" }}</span>
        
        <div class="handle-pulse" v-if="!mobileTocOpen"></div>
      </button>

      <div class="mobile-toc-card">
        <div class="mobile-toc-card-inner">
          <div class="mobile-toc-card-head">
            <div class="head-left">
              <div class="head-icon">
                <font-awesome-icon icon="list-ul" />
              </div>
              <div>
                <div class="mobile-toc-card-title">文章目录</div>
                <div class="mobile-toc-card-tip">快速定位章节内容</div>
              </div>
            </div>
          </div>
          <div class="mobile-toc-body">
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
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { useThemeStore } from "@/stores/theme";
import ArticleContent from "@/components/v1/detail/ArticleContent.vue";
import ArticleHero from "@/components/v1/detail/ArticleHero.vue";
import ArticleToc from "@/components/v1/detail/ArticleToc.vue";

// ... (Interface and data remains same)
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
watch(() => route.path, () => {
  mobileTocOpen.value = false;
});

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
  align-items: start;
}

.detail-left {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 24px;
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
    padding: 24px 16px 72px;
  }

  .mobile-toc-float {
    display: block;
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 1000;
  }

  .mobile-toc-backdrop {
    position: absolute;
    inset: 0;
    background: rgba(15, 23, 42, 0.4);
    backdrop-filter: blur(4px);
    opacity: 0;
    transition: opacity 0.4s ease;
    pointer-events: none;
  }

  .mobile-toc-float.open .mobile-toc-backdrop {
    opacity: 1;
    pointer-events: auto;
  }

  .mobile-toc-handle {
    pointer-events: auto;
    position: fixed;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    z-index: 1002;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 42px;
    height: 100px;
    background: #2563eb;
    color: white;
    border: none;
    border-radius: 12px 0 0 12px;
    box-shadow: -4px 0 16px rgba(37, 99, 235, 0.3);
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.1);
    cursor: pointer;

    .handle-icon-box {
      font-size: 18px;
      margin-bottom: 4px;
    }

    .handle-text {
      writing-mode: vertical-lr;
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0.15em;
      text-transform: uppercase;
    }
  }

  .mobile-toc-float.open .mobile-toc-handle {
    right: min(80vw, 340px);
    background: #1e293b;
    box-shadow: -4px 0 16px rgba(0, 0, 0, 0.2);
  }

  .handle-pulse {
    position: absolute;
    inset: 0;
    border-radius: inherit;
    box-shadow: 0 0 0 0 rgba(37, 99, 235, 0.4);
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0% { box-shadow: 0 0 0 0 rgba(37, 99, 235, 0.7); }
    70% { box-shadow: 0 0 0 15px rgba(37, 99, 235, 0); }
    100% { box-shadow: 0 0 0 0 rgba(37, 99, 235, 0); }
  }

  .mobile-toc-card {
    pointer-events: auto;
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    width: min(80vw, 340px);
    background: white;
    box-shadow: -10px 0 40px rgba(15, 23, 42, 0.15);
    transform: translateX(100%);
    transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    z-index: 1001;
    overflow: hidden;
  }

  .mobile-toc-float.open .mobile-toc-card {
    transform: translateX(0);
  }

  .mobile-toc-card-inner {
    height: 100%;
    display: flex;
    flex-direction: column;
    background: linear-gradient(180deg, #f8fafc 0%, #ffffff 100%);
  }

  .mobile-toc-card-head {
    padding: 24px 20px 20px;
    border-bottom: 1px solid #f1f5f9;
    
    .head-left {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .head-icon {
      width: 40px;
      height: 40px;
      border-radius: 10px;
      background: #eff6ff;
      color: #2563eb;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
    }
  }

  .mobile-toc-card-title {
    font-size: 18px;
    font-weight: 800;
    color: #1e293b;
  }

  .mobile-toc-card-tip {
    font-size: 12px;
    color: #94a3b8;
    margin-top: 2px;
  }

  .mobile-toc-body {
    flex: 1;
    overflow-y: auto;
    padding: 20px;

    &::-webkit-scrollbar {
      width: 4px;
    }
    &::-webkit-scrollbar-thumb {
      background: #e2e8f0;
      border-radius: 10px;
    }
  }

  .dark-mode {
    .mobile-toc-card {
      background: #0f172a;
      box-shadow: -10px 0 40px rgba(0, 0, 0, 0.4);
    }

    .mobile-toc-card-inner {
      background: linear-gradient(180deg, #1e293b 0%, #0f172a 100%);
    }

    .mobile-toc-card-head {
      border-color: rgba(255, 255, 255, 0.05);

      .head-icon {
        background: rgba(59, 130, 246, 0.1);
        color: #60a5fa;
      }
    }

    .mobile-toc-card-title {
      color: #f8fafc;
    }

    .mobile-toc-card-tip {
      color: #64748b;
    }

    .mobile-toc-handle {
      background: #3b82f6;
      
      &.open {
        background: #334155;
      }
    }

    .mobile-toc-body::-webkit-scrollbar-thumb {
      background: #334155;
    }
  }
}
</style>

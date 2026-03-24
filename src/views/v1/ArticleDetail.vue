<template>
  <div class="article-detail-page" :class="{ 'dark-mode': isDark }">
    <div class="page-background">
      <div class="gradient-orb orb-1"></div>
      <div class="gradient-orb orb-2"></div>
      <div class="noise-overlay"></div>
    </div>

    <div class="detail-container">
      <ArticleHero v-if="article" :article="article" />
      <ArticleContent v-if="article" :article="article" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { useThemeStore } from "@/stores/theme";
import ArticleContent from "@/components/v1/detail/ArticleContent.vue";
import ArticleHero from "@/components/v1/detail/ArticleHero.vue";

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

onMounted(() => {
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
    views: 8542,
    tags: ["Vue3", "Composition API", "前端开发", "JavaScript"],
    markdown: markdownContent,
  };
});
</script>

<style scoped lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=Source+Serif+4:opsz,wght@8..60,400;8..60,500;8..60,600&display=swap");

.article-detail-page {
  min-height: 100vh;
  position: relative;
  overflow-x: hidden;
  font-family: "Source Serif 4", Georgia, serif;
  background: var(--bg, #fafbfc);
  color: var(--text, #0a0a0a);

  &.dark-mode {
    background: var(--bg, #0a0a0a);
    color: var(--text, #e8e8e8);
  }
}

.page-background {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}

.gradient-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.4;
  animation: orb-float 20s ease-in-out infinite;

  &.orb-1 {
    width: 600px;
    height: 600px;
    background: radial-gradient(circle, var(--primary, #3b82f6) 0%, transparent 70%);
    top: -200px;
    right: -100px;
    animation-delay: 0s;
  }

  &.orb-2 {
    width: 400px;
    height: 400px;
    background: radial-gradient(circle, #a855f7 0%, transparent 70%);
    bottom: -100px;
    left: -100px;
    animation-delay: -10s;
  }
}

@keyframes orb-float {
  0%,
  100% {
    transform: translate(0, 0) scale(1);
  }

  33% {
    transform: translate(30px, -30px) scale(1.05);
  }

  66% {
    transform: translate(-20px, 20px) scale(0.95);
  }
}

.noise-overlay {
  position: absolute;
  inset: 0;
  opacity: 0.015;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
}

.detail-container {
  position: relative;
  z-index: 1;
  max-width: 1000px;
  margin: 0 auto;
  padding: 60px 20px 96px;
  display: flex;
  flex-direction: column;
  gap: 32px;
}
</style>

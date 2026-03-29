// 文章导航摘要
export interface ArticleNavSummary {
  id: string;
  title: string;
  cover: string;
  category: string;
}

// 完整文章数据
export interface ArticleFull {
  id: string;
  title: string;
  description: string;
  cover: string;
  category: string;
  author: { name: string; avatar: string; role: string };
  createdAt: string;
  updatedAt: string;
  views: number;
  tags: string[];
  markdown: string;
  readMinutes: number;
  wordCount: number;
  difficulty: string;
  lead: string;
  likes: number;
  liked: boolean;
  bookmarked: boolean;
}

// ── 当前文章的 Markdown 内容 ──
const compositionApiMarkdown = [
  "# Composition API 深度解析：从原理到实战落地",
  "",
  "Composition API 的关键价值，不是语法更新，而是让你按业务能力组织代码。页面一旦同时承载数据请求、筛选状态、权限控制和交互反馈，继续按 `data`、`computed`、`methods` 机械拆分，很快就会失去可读性。",
  "",
  "真正影响维护成本的，是状态边界是否清晰。哪些是源数据，哪些是派生值，哪些逻辑应该抽成 composable，哪些副作用必须留在组件内部，这些判断比 API 本身更重要。",
  "",
  "本文会从实际项目痛点出发，逐步拆解 Composition API 的核心思维模型，并结合真实场景给出可落地的代码组织方案。",
  "",
  "## 为什么 Options API 不够用了",
  "",
  "在 Vue 2 时代，Options API 是唯一的组织方式。一个组件的逻辑被强制拆分到 `data`、`computed`、`methods`、`watch` 等选项中。这种方式在小型组件里很清晰，但随着组件复杂度增长，一个「功能」的代码会散落在四五个不同的选项里。",
  "",
  "比如一个带有搜索、分页、排序的用户列表组件：",
  "",
  "- 搜索关键词存在 `data.searchKeyword`",
  "- 过滤后的列表在 `computed.filteredList`",
  "- 排序逻辑在 `methods.sortList`",
  "- 分页状态在 `data.currentPage`",
  "- 路由参数变化在 `watch.$route` 里处理",
  "",
  "当你想理解「搜索」这个功能的完整逻辑时，需要在五个选项之间反复跳转。这就是所谓的**代码分散问题**——功能边界被 Options API 的结构切碎了。",
  "",
  "## Composition API 的核心思维转变",
  "",
  "Composition API 解决的不是一个语法问题，而是一个**代码组织问题**。它让你可以按功能维度（而不是选项类型）来组织代码。",
  "",
  "核心判断标准很简单：",
  "",
  "> 一个功能块如果会跨两个以上页面复用，或者内部同时维护状态、计算值和副作用，就不要继续堆在单文件组件里，应该尽早抽离成 composable。",
  "",
  "这意味着你的思维要从「这个变量放 data 还是 ref」转变为「这段逻辑属于哪个功能域」。功能域的边界越清晰，代码就越容易理解和维护。",
  "",
  "## 项目中最值得先统一的三件事",
  "",
  "在实际项目中落地 Composition API，最有效的方式是先统一三个高频场景：",
  "",
  "**第一，收口异步请求。** 把接口请求、缓存和 loading/error 状态收口到 composable，避免页面组件里充满重复的异步模板逻辑。一个 `useFetch` 就能覆盖 80% 的数据获取场景。",
  "",
  "**第二，纯净计算值。** 约定 computed 只做派生，不混入副作用。这样依赖链才容易推断，排查问题也更快。如果一个 computed 里需要触发请求或修改其他状态，说明它的职责已经越界了。",
  "",
  "**第三，沉淀局部共享逻辑。** 把筛选、分页、滚动监听、复制链接这类局部共享能力沉淀成 hooks，而不是直接塞进 Pinia。全局状态只存真正需要跨页面共享的数据。",
  "",
  "## 状态边界的判断原则",
  "",
  "在实际开发中，最容易混淆的是**哪些状态应该放到 composable，哪些应该留在组件内部**。一个实用的判断方法是问自己三个问题：",
  "",
  "1. **这个状态会被其他组件使用吗？** 如果会，放到 composable 或 store；如果不会，留在组件内部。",
  "2. **这个状态的变化会触发网络请求吗？** 如果会，它应该在 composable 的控制范围内；如果是纯 UI 状态（如展开/折叠），留在组件内部。",
  "3. **这个逻辑能在测试中独立验证吗？** 如果能抽离成可测试的函数，说明它的边界是清晰的。",
  "",
  "记住一个原则：**composable 是按业务能力分组的，不是按技术类型分组的**。一个 composable 可以同时包含 ref、computed、watch 和方法，只要它们属于同一个业务场景。",
  "",
  "## 总结与下一步",
  "",
  "Composition API 不是银弹，但它提供了一个更好的代码组织基础。关键不在于你用 `ref` 还是 `reactive`，而在于你是否按功能域来划分代码边界。",
  "",
  "建议的落地路径：先从一个高频场景（如数据请求）开始统一，让团队习惯 composable 的思维模式，再逐步扩展到其他场景。不要试图一次性重构所有代码，渐进式迁移才是最稳妥的方式。",
].join("\n");

const piniaMarkdown = [
  "# Pinia 状态管理实战：从 Vuex 迁移到现代方案",
  "",
  "Pinia 已经成为 Vue 3 官方推荐的状态管理方案。相比 Vuex，它更轻量、类型推断更友好、模块化更自然。本文将从实际迁移经验出发，带你理解 Pinia 的核心设计和最佳实践。",
  "",
  "## 为什么选择 Pinia",
  "",
  "Vuex 在 Vue 2 时代是标准方案，但它的模块嵌套、mutation/action 分离、命名空间等设计，在大型项目中容易变得繁琐。Pinia 简化了这些概念：",
  "",
  "- 没有 mutations，actions 直接修改状态",
  "- Store 自动代码分割，无需手动配置模块",
  "- 完整的 TypeScript 推断，无需手写类型声明",
  "",
  "## 核心 API 速览",
  "",
  "Pinia 提供 `defineStore` 来创建 store，支持两种写法：Options API 风格和 Setup 风格。推荐使用 Setup 风格，与 Composition API 一致。",
  "",
  "## Store 之间的组合",
  "",
  "Pinia 的 store 可以直接互相引用，不需要 Vuex 的 rootGetters。在一个 store 的 action 中直接调用另一个 store 即可。",
  "",
  "## DevTools 集成",
  "",
  "Pinia 的 DevTools 支持非常完善，可以实时查看状态变化、时间旅行调试、持久化等。",
  "",
  "## 总结",
  "",
  "Pinia 让状态管理回归简单。如果你还在用 Vuex，建议在新项目中尝试 Pinia，旧项目可以渐进式迁移。",
].join("\n");

const responsiveMarkdown = [
  "# 响应式设计进阶：从媒体查询到容器查询",
  "",
  "响应式设计不再只是加几个 `@media` 断点。现代 CSS 提供了容器查询、逻辑属性、clamp() 等新工具，让组件级别的自适应成为可能。本文梳理响应式设计的演进路线和实战技巧。",
  "",
  "## 媒体查询的局限",
  "",
  "传统媒体查询基于视口宽度，但很多时候组件的适配需求取决于自身容器大小，而非整个页面。这导致同一组件在不同布局位置需要不同的样式。",
  "",
  "## 容器查询：组件级响应式",
  "",
  "容器查询 (`@container`) 让你可以根据父容器的尺寸来应用样式，实现真正的组件级自适应。这是响应式设计的一次范式转换。",
  "",
  "## 实战：构建自适应卡片组件",
  "",
  "通过容器查询，我们可以让一个卡片组件在小容器中纵向排列，在大容器中横向排列，而无需知道它在页面中的具体位置。",
  "",
  "## 流式排版技巧",
  "",
  "使用 `clamp()` 实现字体大小的流式缩放，避免断点处的突变。结合 `min()`/`max()` 让间距也具备流式特性。",
  "",
  "## 总结",
  "",
  "响应式设计正在从页面级走向组件级。掌握容器查询和现代 CSS 函数，让你的组件真正具备自适应能力。",
].join("\n");

// ── 短 Markdown 模板 ──
const shortMarkdown = (title: string) => [
  `# ${title}`,
  "",
  "这是一篇示例文章，用于展示相关推荐功能的卡片布局效果。实际内容会在后续开发中补充完整。",
  "",
  "## 核心要点",
  "",
  "- 要点一：前端技术持续演进，需要不断学习",
  "- 要点二：实践出真知，动手才是最好的学习方式",
  "- 要点三：社区分享能加速成长",
  "",
  "## 总结",
  "",
  "保持学习热情，持续精进技术能力。",
].join("\n");

// ── 文章列表 ──
export const articleList: ArticleFull[] = [
  {
    id: "1",
    title: "Pinia 状态管理实战：从 Vuex 迁移到现代方案",
    description:
      "从 Vuex 到 Pinia 的完整迁移指南，涵盖核心 API、Store 组合、DevTools 集成和最佳实践。",
    cover:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200&h=600&fit=crop",
    category: "前端",
    author: {
      name: "开发者",
      avatar:
        "https://api.dicebear.com/9.x/notionists/svg?seed=Felix&backgroundColor=e6e6fa",
      role: "admin",
    },
    createdAt: "2024-03-15",
    updatedAt: "2024-03-18",
    views: 5230,
    tags: ["Pinia", "Vue3", "状态管理", "Vuex"],
    markdown: piniaMarkdown,
    readMinutes: 6,
    wordCount: 2800,
    difficulty: "中级",
    lead:
      "本文系统梳理了从 Vuex 迁移到 Pinia 的全流程。通过对比两者的 API 设计、模块化方案和 TypeScript 支持，帮助团队快速完成状态管理层的现代化升级。",
    likes: 156,
    liked: false,
    bookmarked: false,
  },
  {
    id: "2",
    title: "Vue 3 Composition API 深度解析：从原理到实战落地",
    description:
      "深入探讨 Vue 3 Composition API 的设计理念、拆分方式与项目落地经验，帮助你建立更稳定的状态组织和组件协作思路。",
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
    markdown: compositionApiMarkdown,
    readMinutes: 8,
    wordCount: 3680,
    difficulty: "进阶",
    lead:
      "AI 算法深度分析：本文核心在于揭示 Vue 3 组合式 API 的逻辑复用机制。通过对数据链路与副作用边界的深度拆解，为开发者提供了一套可落地的状态管理与组件协作范式。不仅是语法的变迁，更是思维方式的进化。",
    likes: 342,
    liked: false,
    bookmarked: false,
  },
  {
    id: "3",
    title: "响应式设计进阶：从媒体查询到容器查询",
    description:
      "梳理响应式设计的演进路线，掌握容器查询、流式排版等现代 CSS 技术，实现组件级自适应。",
    cover:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&h=600&fit=crop",
    category: "设计",
    author: {
      name: "开发者",
      avatar:
        "https://api.dicebear.com/9.x/notionists/svg?seed=Felix&backgroundColor=e6e6fa",
      role: "admin",
    },
    createdAt: "2024-03-25",
    updatedAt: "2024-03-28",
    views: 3180,
    tags: ["CSS", "响应式设计", "容器查询", "现代布局"],
    markdown: responsiveMarkdown,
    readMinutes: 5,
    wordCount: 2100,
    difficulty: "中级",
    lead:
      "容器查询正在重新定义响应式设计的边界。本文从媒体查询的局限出发，深入讲解 @container 规则、流式排版函数 clamp() 和组件级自适应的实战方案。",
    likes: 89,
    liked: false,
    bookmarked: false,
  },
  {
    id: "4",
    title: "TypeScript 泛型实战：从入门到进阶模式",
    description: "通过真实案例掌握 TypeScript 泛型的核心用法，涵盖约束、条件类型和映射类型。",
    cover: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=1200&h=600&fit=crop",
    category: "前端",
    author: {
      name: "开发者",
      avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=Felix&backgroundColor=e6e6fa",
      role: "admin",
    },
    createdAt: "2024-04-02",
    updatedAt: "2024-04-05",
    views: 6720,
    tags: ["TypeScript", "泛型", "类型系统"],
    markdown: shortMarkdown("TypeScript 泛型实战：从入门到进阶模式"),
    readMinutes: 7,
    wordCount: 3200,
    difficulty: "进阶",
    lead: "泛型是 TypeScript 类型系统的核心武器。本文通过表单校验、API 响应封装等真实案例，带你从泛型基础一路走到条件类型和映射类型的高级用法。",
    likes: 210,
    liked: false,
    bookmarked: false,
  },
  {
    id: "5",
    title: "Tailwind CSS 工程化：设计系统与主题管理",
    description: "如何在团队项目中用 Tailwind CSS 构建可维护的设计系统，统一设计语言。",
    cover: "https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=1200&h=600&fit=crop",
    category: "前端",
    author: {
      name: "开发者",
      avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=Felix&backgroundColor=e6e6fa",
      role: "admin",
    },
    createdAt: "2024-04-10",
    updatedAt: "2024-04-12",
    views: 4560,
    tags: ["Tailwind", "CSS", "设计系统"],
    markdown: shortMarkdown("Tailwind CSS 工程化：设计系统与主题管理"),
    readMinutes: 5,
    wordCount: 2400,
    difficulty: "中级",
    lead: "Tailwind CSS 不只是工具类框架，更是构建团队设计系统的基础。本文分享如何用 Tailwind 统一颜色、间距、字体等设计令牌，实现跨项目的一致性。",
    likes: 134,
    liked: false,
    bookmarked: false,
  },
  {
    id: "6",
    title: "Vite 构建优化：从 30 秒到 3 秒的提速之路",
    description: "真实项目中的 Vite 构建性能优化经验，涵盖分包、预构建和缓存策略。",
    cover: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=1200&h=600&fit=crop",
    category: "工程化",
    author: {
      name: "开发者",
      avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=Felix&backgroundColor=e6e6fa",
      role: "admin",
    },
    createdAt: "2024-04-18",
    updatedAt: "2024-04-20",
    views: 9870,
    tags: ["Vite", "构建优化", "性能"],
    markdown: shortMarkdown("Vite 构建优化：从 30 秒到 3 秒的提速之路"),
    readMinutes: 6,
    wordCount: 2900,
    difficulty: "进阶",
    lead: "一个中型项目的 Vite 构建从 30 秒优化到 3 秒的全过程。涵盖依赖预构建、代码分包、Tree Shaking 和持久缓存等关键优化手段。",
    likes: 278,
    liked: false,
    bookmarked: false,
  },
  {
    id: "7",
    title: "CSS 动画性能指南：60fps 流畅交互的秘密",
    description: "深入理解浏览器渲染管线，掌握 GPU 加速和复合层优化的实战技巧。",
    cover: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&h=600&fit=crop",
    category: "设计",
    author: {
      name: "开发者",
      avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=Felix&backgroundColor=e6e6fa",
      role: "admin",
    },
    createdAt: "2024-04-25",
    updatedAt: "2024-04-28",
    views: 5340,
    tags: ["CSS", "动画", "性能优化"],
    markdown: shortMarkdown("CSS 动画性能指南：60fps 流畅交互的秘密"),
    readMinutes: 5,
    wordCount: 2200,
    difficulty: "中级",
    lead: "流畅的动画不只是 CSS 属性的组合，更关乎浏览器渲染管线的理解。本文从像素管线出发，讲解如何利用 GPU 合成层和 will-change 实现 60fps 丝滑体验。",
    likes: 167,
    liked: false,
    bookmarked: false,
  },
  {
    id: "8",
    title: "Node.js 中间件架构：从 Express 到 Koa 的演进",
    description: "对比 Express 和 Koa 的中间件模型，理解洋葱模型的设计思想与实践应用。",
    cover: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=1200&h=600&fit=crop",
    category: "后端",
    author: {
      name: "开发者",
      avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=Felix&backgroundColor=e6e6fa",
      role: "admin",
    },
    createdAt: "2024-05-03",
    updatedAt: "2024-05-06",
    views: 4120,
    tags: ["Node.js", "Express", "Koa", "中间件"],
    markdown: shortMarkdown("Node.js 中间件架构：从 Express 到 Koa 的演进"),
    readMinutes: 6,
    wordCount: 2700,
    difficulty: "中级",
    lead: "中间件是 Node.js Web 框架的灵魂。本文对比 Express 的线性模型和 Koa 的洋葱模型，帮你理解两种设计哲学的区别和各自的最佳适用场景。",
    likes: 98,
    liked: false,
    bookmarked: false,
  },
];

// ── 工具函数：获取上下篇 ──
export function getAdjacentArticles(currentId: string): {
  prev: ArticleNavSummary | null;
  next: ArticleNavSummary | null;
} {
  const idx = articleList.findIndex((a) => a.id === currentId);
  if (idx === -1) return { prev: null, next: null };

  const prev =
    idx > 0
      ? {
          id: articleList[idx - 1].id,
          title: articleList[idx - 1].title,
          cover: articleList[idx - 1].cover,
          category: articleList[idx - 1].category,
        }
      : null;

  const next =
    idx < articleList.length - 1
      ? {
          id: articleList[idx + 1].id,
          title: articleList[idx + 1].title,
          cover: articleList[idx + 1].cover,
          category: articleList[idx + 1].category,
        }
      : null;

  return { prev, next };
}

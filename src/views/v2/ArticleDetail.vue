<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { List } from 'lucide-vue-next'
import type { HeadList } from 'md-editor-v3'
import Layout from '@/components/v2/layout/Layout.vue'
import ArticleHero from '@/components/v2/detail/ArticleHero.vue'
import ArticleContent from '@/components/v2/detail/ArticleContent.vue'
import ArticleToc from '@/components/v2/detail/ArticleToc.vue'
import ArticleAuthor from '@/components/v2/detail/ArticleAuthor.vue'
import ArticleFooter from '@/components/v2/detail/ArticleFooter.vue'
import ArticleComments from '@/components/v2/detail/ArticleComments.vue'
import ArticleRelated from '@/components/v2/detail/ArticleRelated.vue'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { articleList, getAdjacentArticles } from '@/data/articleMock'
import type { ArticleFull } from '@/data/articleMock'

const route = useRoute()
const article = ref<ArticleFull | null>(null)
const prevArticle = ref<{ id: string; title: string; cover: string; category: string } | null>(null)
const nextArticle = ref<{ id: string; title: string; cover: string; category: string } | null>(null)
const mobileTocOpen = ref(false)
const isMobile = ref(false)
// MdPreview 渲染完成后:目录数据(HeadList[])+ 自增版本号触发 TOC 重建 observer
const catalogList = ref<HeadList[]>([])
const catalogVersion = ref(0)

// 共享的 heading id 生成函数(URL 安全 + 唯一),保证 MdPreview DOM 和 TOC 的 id 完全一致
const mdHeadingId = (opts: { text: string; level: number; index: number }): string => {
  const slug = opts.text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 40)
  return slug ? `h-${opts.index}-${slug}` : `h-${opts.index}`
}

const previewId = computed(() =>
  article.value ? `v2-article-preview-${article.value.id}` : 'v2-article-preview',
)

// 相关推荐:排除当前文章,同分类优先,最多 5 篇
const relatedArticles = computed(() => {
  if (!article.value) return []
  const currentId = article.value.id
  const currentCategory = article.value.category
  const others = articleList.filter((a) => a.id !== currentId)
  const sameCategory = others.filter((a) => a.category === currentCategory)
  const diffCategory = others.filter((a) => a.category !== currentCategory)
  return [...sameCategory, ...diffCategory].slice(0, 5).map((a) => ({
    id: a.id,
    title: a.title,
    cover: a.cover,
    category: a.category,
  }))
})

function updateMobileState() {
  if (typeof window === 'undefined') return
  isMobile.value = window.innerWidth <= 1024
  if (!isMobile.value) mobileTocOpen.value = false
}

// 移动端 TOC 跳转后关闭抽屉(由 ArticleToc 内 dispatch)
function handleTocJump() {
  mobileTocOpen.value = false
}

// MdPreview 渲染完成 → 收 catalog 数据 + 自增版本号驱动 TOC 重建 observer
function onCatalogReady(list: HeadList[]) {
  catalogList.value = list
  catalogVersion.value += 1
}

function loadArticle() {
  const id = route.params.id as string
  const found = articleList.find((a) => a.id === id)
  article.value = found ?? articleList[0] ?? null
  const { prev, next } = getAdjacentArticles(article.value?.id ?? id)
  prevArticle.value = prev
  nextArticle.value = next
}

watch(() => route.path, () => {
  mobileTocOpen.value = false
  loadArticle()
})

onMounted(() => {
  updateMobileState()
  window.addEventListener('resize', updateMobileState)
  window.addEventListener('v2-toc-jump', handleTocJump)
  loadArticle()
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateMobileState)
  window.removeEventListener('v2-toc-jump', handleTocJump)
})
</script>

<template>
  <Layout>
    <main class="mx-auto max-w-6xl px-4 pt-16 pb-6 sm:px-6 sm:pt-20 lg:pt-24 lg:pb-10">
      <div v-if="article" class="grid gap-8 lg:grid-cols-[minmax(0,1fr)_280px]">
        <!-- 主栏:editorial 内容自然填满主栏宽度 -->
        <div class="min-w-0">
          <div class="space-y-6">
            <!-- Hero:Magazine editorial 风格(内含封面) -->
            <ArticleHero :article="article" />

            <!-- 内容:AI 导读 + Markdown 正文 + Footer -->
            <ArticleContent
              :article="article"
              :md-heading-id="mdHeadingId"
              @catalog-ready="onCatalogReady"
            >
              <template #footer>
                <ArticleFooter
                  :likes="article.likes"
                  :liked="article.liked"
                  :bookmarked="article.bookmarked"
                  :prev="prevArticle"
                  :next="nextArticle"
                />
              </template>
            </ArticleContent>

            <!-- 评论区 -->
            <ArticleComments />

            <!-- 移动端相关推荐(桌面端在侧栏) -->
            <ArticleRelated
              v-if="isMobile"
              :articles="relatedArticles"
              :mobile="true"
            />
          </div>
        </div>

        <!-- 侧栏(桌面):sticky top-20,无独立滚动区,跟随页面自然布局 -->
        <aside v-if="!isMobile" class="hidden lg:block">
          <div class="sticky top-20 space-y-4">
            <!-- 目录:章节导航,激活态高亮 -->
            <ArticleToc
              :editor-id="previewId"
              :headings-list="catalogList"
              :md-heading-id="mdHeadingId"
              :catalog-version="catalogVersion"
              scroll-element="html"
            />
            <!-- 作者卡:头像 + 简介 + 关注 -->
            <ArticleAuthor
              v-if="article.author"
              :author="article.author"
            />
            <!-- 相关推荐:桌面紧凑列表 -->
            <ArticleRelated :articles="relatedArticles" />
          </div>
        </aside>
      </div>

      <!-- 加载状态 -->
      <div v-else class="flex items-center justify-center py-20 text-muted-foreground">
        <p class="text-sm">文章加载中...</p>
      </div>
    </main>

    <!-- 移动端 TOC:shadcn Sheet 抽屉 -->
    <div v-if="article && isMobile" class="fixed right-0 top-1/2 z-40 -translate-y-1/2">
      <Sheet v-model:open="mobileTocOpen">
        <SheetTrigger as-child>
          <Button
            class="h-16 rounded-l-lg rounded-r-none px-2 shadow-md"
            aria-label="打开目录"
          >
            <List class="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" class="w-[85vw] sm:max-w-sm">
          <SheetHeader>
            <SheetTitle>文章目录</SheetTitle>
            <SheetDescription class="sr-only">
              浏览本文的所有章节标题,点击跳转到对应位置
            </SheetDescription>
          </SheetHeader>
          <div class="mt-4">
            <ArticleToc
              :editor-id="previewId"
              :headings-list="catalogList"
              :md-heading-id="mdHeadingId"
              :catalog-version="catalogVersion"
              scroll-element="html"
              :mobile="true"
            />
          </div>
          <SheetClose class="sr-only">关闭</SheetClose>
        </SheetContent>
      </Sheet>
    </div>
  </Layout>
</template>

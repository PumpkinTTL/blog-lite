<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Heart, Bookmark, Share2, ChevronLeft, ChevronRight } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface NavItem {
  id: string
  title: string
  cover: string
  category: string
}

const props = defineProps<{
  likes: number
  liked: boolean
  bookmarked: boolean
  prev: NavItem | null
  next: NavItem | null
}>()

const router = useRouter()

const localLiked = ref(props.liked)
const localLikes = ref(props.likes)
const localBookmarked = ref(props.bookmarked)

function toggleLike() {
  localLiked.value = !localLiked.value
  localLikes.value += localLiked.value ? 1 : -1
}

function toggleBookmark() {
  localBookmarked.value = !localBookmarked.value
}

function handleShare() {
  if (navigator.share) {
    navigator.share({ title: document.title, url: window.location.href })
  } else {
    navigator.clipboard.writeText(window.location.href)
  }
}

function navigate(id: string) {
  router.push(`/v2/article/${id}`)
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <footer class="mt-12 space-y-6">
    <!-- 操作按钮组(居中,克制) -->
    <div class="flex items-center justify-center gap-2">
      <Button
        variant="outline"
        size="sm"
        class="gap-1.5"
        :class="localLiked ? 'border-red-200 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 dark:border-red-900/40 dark:bg-red-950/20 dark:text-red-400' : ''"
        @click="toggleLike"
      >
        <Heart
          class="h-3.5 w-3.5"
          :class="localLiked ? 'fill-current' : ''"
        />
        <span class="tabular-nums">{{ localLikes }}</span>
      </Button>
      <Button
        variant="outline"
        size="sm"
        class="gap-1.5"
        :class="localBookmarked ? 'border-amber-200 bg-amber-50 text-amber-600 hover:bg-amber-100 hover:text-amber-700 dark:border-amber-900/40 dark:bg-amber-950/20 dark:text-amber-400' : ''"
        @click="toggleBookmark"
      >
        <Bookmark
          class="h-3.5 w-3.5"
          :class="localBookmarked ? 'fill-current' : ''"
        />
        <span>{{ localBookmarked ? '已收藏' : '收藏' }}</span>
      </Button>
      <Button
        variant="outline"
        size="sm"
        class="gap-1.5"
        @click="handleShare"
      >
        <Share2 class="h-3.5 w-3.5" />
        <span>分享</span>
      </Button>
    </div>

    <!-- 上下篇导航:shadcn Card -->
    <div class="grid gap-3 sm:grid-cols-2">
      <Card
        class="group cursor-pointer p-4 transition-colors hover:bg-accent"
        :class="!prev ? 'cursor-not-allowed opacity-50' : ''"
        @click="prev && navigate(prev.id)"
      >
        <div class="flex items-center gap-1 text-xs text-muted-foreground">
          <ChevronLeft class="h-3 w-3" />
          <span>上一篇</span>
        </div>
        <div v-if="prev" class="mt-1.5 line-clamp-2 text-sm font-medium transition-colors group-hover:text-primary">
          {{ prev.title }}
        </div>
        <div v-else class="mt-1.5 text-sm text-muted-foreground/70">
          已经是第一篇了
        </div>
      </Card>

      <Card
        class="group cursor-pointer p-4 text-right transition-colors hover:bg-accent"
        :class="!next ? 'cursor-not-allowed opacity-50' : ''"
        @click="next && navigate(next.id)"
      >
        <div class="flex items-center justify-end gap-1 text-xs text-muted-foreground">
          <span>下一篇</span>
          <ChevronRight class="h-3 w-3" />
        </div>
        <div v-if="next" class="mt-1.5 line-clamp-2 text-sm font-medium transition-colors group-hover:text-primary">
          {{ next.title }}
        </div>
        <div v-else class="mt-1.5 text-sm text-muted-foreground/70">
          已经是最后一篇了
        </div>
      </Card>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed, nextTick, reactive, ref } from 'vue'
import { MessageSquare, ThumbsUp, AtSign, Send, X, ChevronDown } from 'lucide-vue-next'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import coderAvatar from '@/assets/avatars/coder.png'
import writerAvatar from '@/assets/avatars/writer.png'
import designerAvatar from '@/assets/avatars/Designer.png'
import dataCuratorAvatar from '@/assets/avatars/DataCurator.png'
import officerAvatar from '@/assets/avatars/Officer.png'
import operatorAvatar from '@/assets/avatars/operator.png'

interface CommentItem {
  id: number
  name: string
  avatar: string
  content: string
  time: string
  likes: number
  liked: boolean
  isAuthor?: boolean
  replyTo?: string
  replies?: CommentItem[]
}

const COMMENT_PAGE_SIZE = 3
const REPLY_INIT_COUNT = 2

const newComment = ref('')
const inputFocused = ref(false)
const replyTarget = ref<CommentItem | null>(null)
const replyParent = ref<CommentItem | null>(null)
const inputCardRef = ref<HTMLElement | null>(null)
const textareaRef = ref<InstanceType<typeof Textarea> | null>(null)
const commentDisplayCount = ref(COMMENT_PAGE_SIZE)
const replyExpandMap = reactive(new Map<number, number>())
const loadingMore = ref(false)

const currentUser = { name: '匿名用户', avatar: coderAvatar }

const comments = ref<CommentItem[]>([
  {
    id: 1,
    name: '林小北',
    avatar: writerAvatar,
    content: 'Composition API 确实解决了 Options API 的代码分散问题,但团队迁移的时候最大阻力其实是思维惯性问题。文章里提到的「先统一高频场景」这个策略很实用。',
    time: '2 小时前',
    likes: 24,
    liked: false,
    replies: [
      { id: 101, name: '开发者', avatar: officerAvatar, content: '对,渐进式迁移才是最稳妥的,感谢认可!', time: '1 小时前', likes: 8, liked: false, isAuthor: true, replyTo: '林小北' },
      { id: 102, name: '陈大鱼', avatar: designerAvatar, content: '我们团队就是从 Vue 2 直接跳到 Composition API 的,前期确实有点痛苦。', time: '45 分钟前', likes: 3, liked: false, replyTo: '林小北' },
      { id: 103, name: '前端小白', avatar: dataCuratorAvatar, content: '同感!不过熬过前两周就顺畅多了,现在反而不想回去写 Options API 了。', time: '30 分钟前', likes: 5, liked: false, replyTo: '陈大鱼' },
      { id: 104, name: '林小北', avatar: writerAvatar, content: '是的,关键是前两天别放弃,写几个小需求就上手了。', time: '15 分钟前', likes: 2, liked: false, replyTo: '前端小白' },
    ],
  },
  {
    id: 2,
    name: '陈大鱼',
    avatar: designerAvatar,
    content: '状态边界的三个判断问题很实用,以前总搞不清哪些该抽 composable 哪些留组件内。收藏了。',
    time: '5 小时前',
    likes: 16,
    liked: false,
  },
  {
    id: 3,
    name: '前端小白',
    avatar: dataCuratorAvatar,
    content: '请问 useArticle 这个 composable 里的 error 状态一般怎么展示给用户?是 toast 还是 inline 提示?',
    time: '1 天前',
    likes: 6,
    liked: false,
    replies: [
      { id: 301, name: '林小北', avatar: writerAvatar, content: '看场景,网络错误用 toast,表单校验用 inline。关键数据加载失败可以在页面级做一个 error boundary。', time: '20 小时前', likes: 4, liked: false, replyTo: '前端小白' },
    ],
  },
  {
    id: 4,
    name: '赵铁柱',
    avatar: operatorAvatar,
    content: '讲真,Pinia + Composable 这套组合拳打下来,状态管理终于不脏了。之前用 Vuex 写大型项目,模块嵌套到后面自己都不想看。',
    time: '2 天前',
    likes: 31,
    liked: false,
    replies: [
      { id: 401, name: '开发者', avatar: officerAvatar, content: 'Pinia 的 DevTools 支持也做得很好,调试体验比 Vuex 舒服太多了。', time: '1 天前', likes: 12, liked: false, isAuthor: true, replyTo: '赵铁柱' },
    ],
  },
  {
    id: 5,
    name: '周小鱼',
    avatar: dataCuratorAvatar,
    content: '文章里提到的 ref vs reactive 选择建议很中肯,我们项目组之前为这个争论了好久,最后统一用 ref + 解构,代码可读性确实好很多。',
    time: '3 天前',
    likes: 19,
    liked: false,
  },
  {
    id: 6,
    name: '孙大强',
    avatar: designerAvatar,
    content: '自定义指令那块写得不错,不过建议补充一下 Teleport 的使用场景,我们在做全局弹窗的时候用得特别多。',
    time: '4 天前',
    likes: 11,
    liked: false,
    replies: [
      { id: 601, name: '开发者', avatar: officerAvatar, content: '好建议!下一篇文章会专门讲 Teleport 和 Suspense 的实战用法。', time: '3 天前', likes: 7, liked: false, isAuthor: true, replyTo: '孙大强' },
      { id: 602, name: '周小鱼', avatar: dataCuratorAvatar, content: '期待!Suspense 配合异步组件真的是性能优化的利器。', time: '3 天前', likes: 3, liked: false, replyTo: '开发者' },
      { id: 603, name: '赵铁柱', avatar: operatorAvatar, content: 'Teleport 做模态框和通知是真的香,再也不用管 z-index 层级问题了。', time: '2 天前', likes: 6, liked: false, replyTo: '孙大强' },
    ],
  },
  {
    id: 7,
    name: '吴前端',
    avatar: writerAvatar,
    content: '刚把公司老项目从 Vue 2 迁移到 Vue 3,整体用了两个月,踩了不少坑,不过迁移完之后开发效率确实提升了不少。',
    time: '5 天前',
    likes: 28,
    liked: false,
  },
  {
    id: 8,
    name: '李全栈',
    avatar: officerAvatar,
    content: '作为后端转前端的开发者,Composition API 的写法更接近普通函数调用,学习曲线比 Options API 平缓很多,强烈推荐。',
    time: '1 周前',
    likes: 15,
    liked: false,
  },
])

const totalCount = computed(() => {
  let count = comments.value.length
  comments.value.forEach((c) => {
    if (c.replies) count += c.replies.length
  })
  return count
})

const visibleComments = computed(() => comments.value.slice(0, commentDisplayCount.value))
const hasMoreComments = computed(() => commentDisplayCount.value < comments.value.length)

function loadMoreComments() {
  loadingMore.value = true
  setTimeout(() => {
    commentDisplayCount.value += COMMENT_PAGE_SIZE
    loadingMore.value = false
  }, 300)
}

function getVisibleReplies(comment: CommentItem) {
  const count = replyExpandMap.get(comment.id) ?? REPLY_INIT_COUNT
  return comment.replies?.slice(0, count) ?? []
}

function hasMoreReplies(comment: CommentItem) {
  const shown = replyExpandMap.get(comment.id) ?? REPLY_INIT_COUNT
  return (comment.replies?.length ?? 0) > shown
}

function expandReplies(comment: CommentItem) {
  replyExpandMap.set(comment.id, comment.replies?.length ?? 0)
}

function toggleLike(item: CommentItem) {
  item.liked = !item.liked
  item.likes += item.liked ? 1 : -1
}

function startReply(target: CommentItem, parent?: CommentItem) {
  replyTarget.value = target
  replyParent.value = parent || target
  inputFocused.value = true
  nextTick(() => {
    inputCardRef.value?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    textareaRef.value?.focus()
  })
}

function cancelReply() {
  replyTarget.value = null
  replyParent.value = null
}

function handleBlur() {
  if (!newComment.value.trim() && !replyTarget.value) {
    inputFocused.value = false
  }
}

function submitComment() {
  if (!newComment.value.trim()) return
  const newReply: CommentItem = {
    id: Date.now(),
    name: currentUser.name,
    avatar: currentUser.avatar,
    content: newComment.value.trim(),
    time: '刚刚',
    likes: 0,
    liked: false,
  }
  if (replyTarget.value && replyParent.value) {
    newReply.replyTo = replyTarget.value.name
    if (!replyParent.value.replies) replyParent.value.replies = []
    replyParent.value.replies.push(newReply)
  } else {
    comments.value.unshift(newReply)
  }
  newComment.value = ''
  replyTarget.value = null
  replyParent.value = null
}

function initial(name: string): string {
  return name.slice(0, 1)
}
</script>

<template>
  <Card class="gap-0">
    <!-- 标题 -->
    <CardHeader class="flex-row items-center justify-between pb-4">
      <div class="flex items-center gap-2">
        <MessageSquare class="h-4 w-4 text-muted-foreground" />
        <h3 class="text-base font-semibold">评论区</h3>
      </div>
      <Badge variant="secondary" class="font-normal">
        {{ totalCount }} 条
      </Badge>
    </CardHeader>

    <CardContent class="space-y-6">
      <!-- 输入区 -->
      <div ref="inputCardRef" class="flex gap-3">
        <Avatar class="h-9 w-9 shrink-0">
          <AvatarImage :src="currentUser.avatar" :alt="currentUser.name" />
          <AvatarFallback>{{ initial(currentUser.name) }}</AvatarFallback>
        </Avatar>
        <div class="min-w-0 flex-1 space-y-2">
          <!-- 回复提示 -->
          <div
            v-if="replyTarget"
            class="flex items-center justify-between rounded-md bg-primary/5 px-3 py-1.5 text-xs text-primary"
          >
            <span>
              回复 <strong>@{{ replyTarget.name }}</strong>
            </span>
            <Button
              variant="ghost"
              size="icon"
              class="h-5 w-5"
              aria-label="取消回复"
              @mousedown.prevent
              @click="cancelReply"
            >
              <X class="h-3 w-3" />
            </Button>
          </div>

          <!-- shadcn Textarea -->
          <Textarea
            ref="textareaRef"
            v-model="newComment"
            class="resize-none transition-all"
            :class="(inputFocused || newComment.trim()) ? 'min-h-[96px]' : 'min-h-[40px]'"
            placeholder="写下你的想法..."
            @focus="inputFocused = true"
            @blur="handleBlur"
          />

          <div
            v-if="inputFocused || newComment.trim()"
            class="flex items-center justify-end gap-2"
          >
            <Button
              v-if="replyTarget"
              variant="ghost"
              size="sm"
              @mousedown.prevent
              @click="cancelReply"
            >
              取消
            </Button>
            <Button
              size="sm"
              class="gap-1"
              :disabled="!newComment.trim()"
              @mousedown.prevent
              @click="submitComment"
            >
              <Send class="h-3 w-3" />
              {{ replyTarget ? '回复' : '发布' }}
            </Button>
          </div>
        </div>
      </div>

      <Separator />

      <!-- 评论列表 -->
      <div v-if="comments.length" class="space-y-6">
        <div
          v-for="(comment, idx) in visibleComments"
          :key="comment.id"
          class="space-y-3"
        >
          <!-- 主评论 -->
          <div class="flex gap-3">
            <Avatar class="h-9 w-9 shrink-0">
              <AvatarImage :src="comment.avatar" :alt="comment.name" />
              <AvatarFallback>{{ initial(comment.name) }}</AvatarFallback>
            </Avatar>
            <div class="min-w-0 flex-1">
              <div class="mb-1 flex flex-wrap items-center gap-1.5">
                <span class="text-sm font-semibold">{{ comment.name }}</span>
                <Badge v-if="comment.isAuthor" variant="secondary" class="bg-primary/10 text-primary">
                  作者
                </Badge>
                <span class="text-xs text-muted-foreground">{{ comment.time }}</span>
              </div>
              <p class="mb-2 text-sm leading-relaxed text-foreground/85">
                {{ comment.content }}
              </p>
              <div class="flex items-center gap-4">
                <button
                  type="button"
                  class="inline-flex items-center gap-1 text-xs transition-colors"
                  :class="comment.liked ? 'text-red-500 dark:text-red-400' : 'text-muted-foreground hover:text-foreground'"
                  @click="toggleLike(comment)"
                >
                  <ThumbsUp class="h-3 w-3" :class="comment.liked ? 'fill-current' : ''" />
                  <span class="tabular-nums">{{ comment.likes || '' }}</span>
                </button>
                <button
                  type="button"
                  class="inline-flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
                  @click="startReply(comment)"
                >
                  <AtSign class="h-3 w-3" />
                  <span>回复</span>
                </button>
              </div>
            </div>
          </div>

          <!-- 嵌套回复 -->
          <div
            v-if="comment.replies?.length"
            class="ml-12 border-l-2 border-border pl-4"
          >
            <div
              v-for="reply in getVisibleReplies(comment)"
              :key="reply.id"
              class="flex gap-2.5 py-2"
            >
              <Avatar class="h-7 w-7 shrink-0">
                <AvatarImage :src="reply.avatar" :alt="reply.name" />
                <AvatarFallback>{{ initial(reply.name) }}</AvatarFallback>
              </Avatar>
              <div class="min-w-0 flex-1">
                <div class="mb-0.5 flex flex-wrap items-center gap-1.5">
                  <span class="text-xs font-semibold">{{ reply.name }}</span>
                  <Badge v-if="reply.isAuthor" variant="secondary" class="bg-primary/10 text-primary">
                    作者
                  </Badge>
                  <span v-if="reply.replyTo" class="text-xs text-muted-foreground">
                    回复 <em class="not-italic font-medium text-primary">@{{ reply.replyTo }}</em>
                  </span>
                  <span class="text-xs text-muted-foreground">{{ reply.time }}</span>
                </div>
                <p class="mb-1.5 text-sm leading-relaxed text-foreground/85">
                  {{ reply.content }}
                </p>
                <div class="flex items-center gap-4">
                  <button
                    type="button"
                    class="inline-flex items-center gap-1 text-xs transition-colors"
                    :class="reply.liked ? 'text-red-500 dark:text-red-400' : 'text-muted-foreground hover:text-foreground'"
                    @click="toggleLike(reply)"
                  >
                    <ThumbsUp class="h-3 w-3" :class="reply.liked ? 'fill-current' : ''" />
                    <span class="tabular-nums">{{ reply.likes || '' }}</span>
                  </button>
                  <button
                    type="button"
                    class="inline-flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
                    @click="startReply(reply, comment)"
                  >
                    <AtSign class="h-3 w-3" />
                    <span>回复</span>
                  </button>
                </div>
              </div>
            </div>
            <Button
              v-if="hasMoreReplies(comment)"
              variant="link"
              size="sm"
              class="mt-1 h-auto gap-1 p-0 text-xs"
              @click="expandReplies(comment)"
            >
              <ChevronDown class="h-3 w-3" />
              展开更多回复({{ (comment.replies?.length ?? 0) - (replyExpandMap.get(comment.id) ?? REPLY_INIT_COUNT) }} 条)
            </Button>
          </div>

          <Separator v-if="idx < visibleComments.length - 1" />
        </div>

        <!-- 加载更多 -->
        <Button
          v-if="hasMoreComments"
          variant="ghost"
          class="w-full gap-1.5"
          :disabled="loadingMore"
          @click="loadMoreComments"
        >
          <ChevronDown class="h-3 w-3" :class="loadingMore ? 'animate-spin' : ''" />
          {{ loadingMore ? '加载中...' : '查看更多评论' }}
        </Button>
      </div>

      <!-- 空状态 -->
      <div
        v-else
        class="flex flex-col items-center justify-center gap-2 py-10 text-muted-foreground"
      >
        <MessageSquare class="h-7 w-7 opacity-30" />
        <p class="text-xs">还没有评论,来说两句吧</p>
      </div>
    </CardContent>
  </Card>
</template>

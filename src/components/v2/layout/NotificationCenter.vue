<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, type Component } from 'vue'
import {
  Bell,
  Check,
  Heart,
  MessageSquare,
  ShieldCheck,
  ShoppingBag,
  UserPlus,
  X,
} from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

const props = withDefaults(defineProps<{
  mobile?: boolean
}>(), {
  mobile: false,
})

type NotificationType = 'system' | 'activity' | 'support' | 'store'
type NotificationTab = 'all' | 'unread' | NotificationType

interface NotificationItem {
  id: number
  type: NotificationType
  title: string
  message: string
  time: string
  read: boolean
  action?: string
  icon: Component
}

const rootRef = ref<HTMLElement | null>(null)
const open = ref(false)
const activeTab = ref<NotificationTab>('all')

const notifications = ref<NotificationItem[]>([
  {
    id: 1,
    type: 'system',
    title: 'v2 深色模式已更新',
    message: '新的石墨蓝灰主题已启用，卡片和边框层次更加柔和。',
    time: '刚刚',
    read: false,
    action: '查看更新',
    icon: ShieldCheck,
  },
  {
    id: 2,
    type: 'activity',
    title: '你的文章获得了新的评论',
    message: '林小北在《Vue 组合式 API 实践》中回复了你的讨论。',
    time: '12 分钟前',
    read: false,
    action: '去回复',
    icon: MessageSquare,
  },
  {
    id: 3,
    type: 'support',
    title: '收到一笔新的赞助',
    message: '追风的饭团刚刚请你喝了一杯咖啡。',
    time: '1 小时前',
    read: false,
    action: '查看赞助',
    icon: Heart,
  },
  {
    id: 4,
    type: 'store',
    title: '商城资源上新',
    message: '新增 Tailwind CSS 设计手册与 Code Review 检查清单。',
    time: '昨天',
    read: true,
    icon: ShoppingBag,
  },
  {
    id: 5,
    type: 'activity',
    title: '新用户加入社区',
    message: '温柔的蓝莓通过邀请码加入了 Blog Lite。',
    time: '2 天前',
    read: true,
    icon: UserPlus,
  },
])

const unreadCount = computed(() => notifications.value.filter(item => !item.read).length)

const tabs = computed(() => [
  { id: 'all' as const, label: '全部', count: notifications.value.length },
  { id: 'unread' as const, label: '未读', count: unreadCount.value },
  { id: 'system' as const, label: '系统', count: notifications.value.filter(item => item.type === 'system').length },
  { id: 'activity' as const, label: '互动', count: notifications.value.filter(item => item.type === 'activity').length },
])

const filteredNotifications = computed(() => {
  if (activeTab.value === 'all') return notifications.value
  if (activeTab.value === 'unread') return notifications.value.filter(item => !item.read)
  return notifications.value.filter(item => item.type === activeTab.value)
})

function toggleOpen() {
  open.value = !open.value
}

function close() {
  open.value = false
}

function markAsRead(id: number) {
  const item = notifications.value.find(notification => notification.id === id)
  if (item) item.read = true
}

function markAllRead() {
  notifications.value.forEach((item) => {
    item.read = true
  })
}

function handleClickOutside(event: MouseEvent) {
  if (!open.value) return
  const target = event.target as Node
  if (rootRef.value?.contains(target)) return
  open.value = false
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside, true)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside, true)
})
</script>

<template>
  <div ref="rootRef" class="relative">
    <Button
      v-if="!mobile"
      variant="ghost"
      size="icon"
      class="relative h-9 w-9 cursor-pointer"
      aria-label="通知中心"
      @click="toggleOpen"
    >
      <Bell class="h-4 w-4" />
      <span
        v-if="unreadCount > 0"
        class="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-destructive ring-2 ring-background"
      />
    </Button>

    <Button
      v-else
      variant="ghost"
      class="w-full justify-start gap-2 rounded-md text-muted-foreground hover:text-foreground cursor-pointer"
      @click="toggleOpen"
    >
      <Bell class="h-4 w-4" />
      通知
      <Badge v-if="unreadCount > 0" variant="destructive" class="ml-auto px-1.5 py-0 text-[10px]">
        {{ unreadCount }}
      </Badge>
    </Button>

    <Transition
      enter-active-class="transition duration-150 ease-out"
      enter-from-class="opacity-0 translate-y-1 scale-95"
      enter-to-class="opacity-100 translate-y-0 scale-100"
      leave-active-class="transition duration-100 ease-in"
      leave-from-class="opacity-100 translate-y-0 scale-100"
      leave-to-class="opacity-0 translate-y-1 scale-95"
    >
      <Card
        v-if="open"
        class="z-50 gap-0 overflow-hidden shadow-md"
        :class="mobile ? 'mt-2 w-full' : 'absolute right-0 top-full mt-2 w-[360px]'"
      >
        <CardHeader class="px-4 py-3">
          <div class="flex items-start justify-between gap-3">
            <div>
              <div class="flex items-center gap-2">
                <h3 class="text-sm font-semibold leading-none">通知中心</h3>
                <Badge v-if="unreadCount > 0" variant="secondary" class="px-1.5 py-0 text-[10px] font-medium">
                  {{ unreadCount }} 未读
                </Badge>
              </div>
              <p class="mt-1 text-xs text-muted-foreground">
                {{ unreadCount > 0 ? '你有新的社区动态' : '所有通知都已读' }}
              </p>
            </div>

            <div class="flex items-center gap-1">
              <Button
                v-if="unreadCount > 0"
                variant="ghost"
                size="sm"
                class="h-7 gap-1 px-2 text-xs text-muted-foreground cursor-pointer"
                @click="markAllRead"
              >
                <Check class="h-3 w-3" />
                全部已读
              </Button>
              <Button variant="ghost" size="icon" class="h-7 w-7 cursor-pointer text-muted-foreground" @click="close">
                <X class="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <div class="flex gap-1 overflow-x-auto px-3 pb-2">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            type="button"
            class="inline-flex shrink-0 items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors cursor-pointer"
            :class="activeTab === tab.id ? 'bg-muted text-foreground' : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'"
            @click="activeTab = tab.id"
          >
            {{ tab.label }}
            <span v-if="tab.count > 0" class="text-[10px] text-muted-foreground">
              {{ tab.count }}
            </span>
          </button>
        </div>

        <CardContent class="max-h-[320px] overflow-y-auto p-1">
          <div v-if="filteredNotifications.length">
            <button
              v-for="item in filteredNotifications"
              :key="item.id"
              type="button"
              class="group relative flex w-full cursor-pointer gap-2.5 rounded-md px-2.5 py-2 text-left transition-colors hover:bg-muted/45"
              @click="markAsRead(item.id)"
            >
              <span
                class="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                :class="!item.read ? 'bg-primary' : 'bg-transparent'"
              />
              <div class="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center text-muted-foreground">
                <component :is="item.icon" class="h-3.5 w-3.5" />
              </div>

              <div class="min-w-0 flex-1">
                <div class="flex items-center justify-between gap-3">
                  <p class="line-clamp-1 text-xs font-medium leading-snug">
                    {{ item.title }}
                  </p>
                  <span class="shrink-0 text-[11px] text-muted-foreground">{{ item.time }}</span>
                </div>
                <p class="mt-0.5 line-clamp-1 text-[11px] leading-relaxed text-muted-foreground">
                  {{ item.message }}
                </p>
              </div>

            </button>
          </div>

          <div v-else class="flex flex-col items-center justify-center py-12 text-center">
            <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-muted-foreground">
              <Bell class="h-4 w-4" />
            </div>
            <p class="mt-3 text-sm font-medium">暂无通知</p>
            <p class="mt-1 text-xs text-muted-foreground">新的系统消息会显示在这里。</p>
          </div>
        </CardContent>
      </Card>
    </Transition>
  </div>
</template>

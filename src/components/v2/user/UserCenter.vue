<script setup lang="ts">
import { ref, watch } from 'vue'
import {
  X,
  User,
  Bookmark,
  Crown,
  LogOut,
  ExternalLink,
  Pencil,
  Mail,
  Calendar,
  KeyRound,
  Lock,
  Check,
  ChevronRight,
} from 'lucide-vue-next'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'

type TabKey = 'profile' | 'favorites'

const props = defineProps<{ open: boolean }>()
const emit = defineEmits<{
  (e: 'update:open', val: boolean): void
}>()

const activeTab = ref<TabKey>('profile')

type PlanType = 'Pro' | 'Plus' | 'Free'
const planConfig: Record<PlanType, { label: string; class: string }> = {
  Pro: { label: 'Pro', class: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
  Plus: { label: 'Plus', class: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' },
  Free: { label: 'Free', class: 'bg-muted text-muted-foreground' },
}

const mockUser = ref({
  name: '林间微风信使',
  uid: '100248',
  avatar: 'https://picsum.photos/seed/user-avatar/100/100',
  plan: 'Pro' as PlanType,
  email: 'breeze@example.com',
  bio: '代码与文字之间，寻找属于第三种表达',
  joinDate: '2024-03-15',
  posts: 42,
  followers: 128,
  following: 36,
})

const favorites = ref([
  { id: 1, title: 'Vue 3 组合式 API 实践指南', category: '前端', date: '2025-05-20', cover: 'https://picsum.photos/seed/fav1/120/80' },
  { id: 2, title: 'TypeScript 高级类型体操技巧', category: '技术', date: '2025-04-18', cover: 'https://picsum.photos/seed/fav2/120/80' },
  { id: 3, title: 'Tailwind CSS 设计系统搭建', category: '设计', date: '2025-03-10', cover: 'https://picsum.photos/seed/fav3/120/80' },
  { id: 4, title: 'Vite 插件开发入门到精通', category: '工具', date: '2025-02-25', cover: 'https://picsum.photos/seed/fav4/120/80' },
  { id: 5, title: 'Node.js 性能优化实战笔记', category: '后端', date: '2025-01-12', cover: 'https://picsum.photos/seed/fav5/120/80' },
])

// 编辑简介
const isEditingBio = ref(false)
const editBio = ref('')
function startEditBio() {
  editBio.value = mockUser.value.bio
  isEditingBio.value = true
}
function saveBio() {
  mockUser.value.bio = editBio.value
  isEditingBio.value = false
}
function cancelEditBio() {
  isEditingBio.value = false
}

// 修改密码
const isChangingPwd = ref(false)
const pwdForm = ref({ current: '', newPwd: '', confirm: '' })
function startChangePwd() { isChangingPwd.value = true }
function cancelChangePwd() {
  isChangingPwd.value = false
  pwdForm.value = { current: '', newPwd: '', confirm: '' }
}
function savePwd() {
  isChangingPwd.value = false
  pwdForm.value = { current: '', newPwd: '', confirm: '' }
}

function handleLogout() {
  emit('update:open', false)
}

watch(() => props.open, (val) => {
  if (val) {
    activeTab.value = 'profile'
    isEditingBio.value = false
    isChangingPwd.value = false
  }
})

const tabs: { key: TabKey; label: string; icon: typeof User }[] = [
  { key: 'profile', label: '个人资料', icon: User },
  { key: 'favorites', label: '我的收藏', icon: Bookmark },
]
</script>

<template>
  <transition
    enter-active-class="transition duration-200 ease-out"
    enter-from-class="opacity-0 scale-[0.98]"
    enter-to-class="opacity-100 scale-100"
    leave-active-class="transition duration-150 ease-in"
    leave-from-class="opacity-100 scale-100"
    leave-to-class="opacity-0 scale-[0.98]"
  >
    <div
      v-if="open"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      @click="emit('update:open', false)"
    >
      <!-- ═══ PC: 左侧导航 + 右侧内容 ═══ -->
      <Card
        class="v2-root hidden md:flex w-[640px] h-[480px] overflow-hidden border-border/40 bg-background text-foreground shadow-lg"
        @click.stop
      >
        <!-- 左侧导航 -->
        <div class="flex w-[180px] shrink-0 flex-col border-r border-border/40">
          <div class="px-4 pt-5 pb-3">
            <Avatar class="h-11 w-11">
              <AvatarImage :src="mockUser.avatar" :alt="mockUser.name" />
              <AvatarFallback class="text-sm">{{ mockUser.name.slice(0, 1) }}</AvatarFallback>
            </Avatar>
            <p class="mt-2 text-[13px] font-semibold truncate">{{ mockUser.name }}</p>
            <div class="mt-1 flex items-center gap-1.5">
              <span
                v-if="mockUser.plan !== 'Free'"
                class="inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 text-[10px] font-semibold"
                :class="planConfig[mockUser.plan].class"
              >
                <Crown class="h-2.5 w-2.5" />
                {{ mockUser.plan }}
              </span>
              <span class="text-[11px] text-muted-foreground">{{ mockUser.uid }}</span>
            </div>
          </div>

          <div class="h-px bg-border/40" />

          <nav class="flex-1 p-2 space-y-0.5">
            <button
              v-for="tab in tabs"
              :key="tab.key"
              class="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-[13px] transition-colors cursor-pointer"
              :class="activeTab === tab.key
                ? 'bg-accent text-accent-foreground font-medium'
                : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'"
              @click="activeTab = tab.key"
            >
              <component :is="tab.icon" class="h-4 w-4" />
              {{ tab.label }}
            </button>
          </nav>

          <div class="h-px bg-border/40" />

          <div class="p-2">
            <button
              class="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-[13px] text-destructive transition-colors hover:bg-destructive/10 cursor-pointer"
              @click="handleLogout"
            >
              <LogOut class="h-4 w-4" />
              退出登录
            </button>
          </div>
        </div>

        <!-- 右侧内容 -->
        <div class="flex flex-1 flex-col min-w-0">
          <div class="flex items-center justify-between px-6 py-4 border-b border-border/40">
            <h2 class="text-sm font-semibold">{{ tabs.find(t => t.key === activeTab)?.label }}</h2>
            <button
              class="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              @click="emit('update:open', false)"
            >
              <X class="h-4 w-4" />
            </button>
          </div>

          <ScrollArea class="flex-1">
            <!-- Profile -->
            <div v-if="activeTab === 'profile'" class="p-6 space-y-4">
              <!-- Bio（可编辑） -->
              <div v-if="!isEditingBio" class="flex items-start gap-2">
                <p class="flex-1 text-[13px] text-muted-foreground leading-relaxed">{{ mockUser.bio }}</p>
                <button
                  class="mt-0.5 shrink-0 inline-flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground/60 hover:bg-muted hover:text-foreground cursor-pointer"
                  @click="startEditBio"
                >
                  <Pencil class="h-3 w-3" />
                </button>
              </div>
              <div v-else class="space-y-2">
                <textarea
                  v-model="editBio"
                  class="w-full rounded-md border border-border/60 bg-transparent px-3 py-2 text-[13px] leading-relaxed resize-none focus:outline-none focus:ring-1 focus:ring-ring"
                  rows="2"
                  placeholder="写点什么介绍自己..."
                />
                <div class="flex gap-2 justify-end">
                  <Button variant="ghost" size="sm" class="h-7 text-xs" @click="cancelEditBio">取消</Button>
                  <Button size="sm" class="h-7 text-xs" @click="saveBio">保存</Button>
                </div>
              </div>

              <!-- Stats 行内 -->
              <div class="flex gap-4 text-[13px]">
                <span><span class="font-semibold tabular-nums">{{ mockUser.posts }}</span> <span class="text-muted-foreground">文章</span></span>
                <span><span class="font-semibold tabular-nums">{{ mockUser.followers }}</span> <span class="text-muted-foreground">关注者</span></span>
                <span><span class="font-semibold tabular-nums">{{ mockUser.following }}</span> <span class="text-muted-foreground">关注中</span></span>
              </div>

              <!-- Info list -->
              <div class="space-y-0">
                <div class="flex items-center gap-3 py-2 text-[13px]">
                  <Mail class="h-3.5 w-3.5 text-muted-foreground/50 shrink-0" />
                  <span class="text-muted-foreground">邮箱</span>
                  <span class="flex-1 text-right">{{ mockUser.email }}</span>
                </div>
                <div class="h-px bg-border/40" />
                <div class="flex items-center gap-3 py-2 text-[13px]">
                  <Calendar class="h-3.5 w-3.5 text-muted-foreground/50 shrink-0" />
                  <span class="text-muted-foreground">注册时间</span>
                  <span class="flex-1 text-right">{{ mockUser.joinDate }}</span>
                </div>
                <div class="h-px bg-border/40" />
                <!-- 修改密码 -->
                <div v-if="!isChangingPwd">
                  <button
                    class="flex w-full items-center gap-3 py-2 text-[13px] text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                    @click="startChangePwd"
                  >
                    <KeyRound class="h-3.5 w-3.5 text-muted-foreground/50 shrink-0" />
                    <span>修改密码</span>
                    <ChevronRight class="h-3.5 w-3.5 ml-auto" />
                  </button>
                </div>
                <div v-else class="py-2 space-y-2.5">
                  <div class="relative">
                    <Lock class="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground/40" />
                    <Input v-model="pwdForm.current" type="password" placeholder="当前密码" class="h-8 pl-9 text-[13px]" />
                  </div>
                  <div class="relative">
                    <KeyRound class="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground/40" />
                    <Input v-model="pwdForm.newPwd" type="password" placeholder="新密码" class="h-8 pl-9 text-[13px]" />
                  </div>
                  <div class="relative">
                    <Check class="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground/40" />
                    <Input v-model="pwdForm.confirm" type="password" placeholder="确认新密码" class="h-8 pl-9 text-[13px]" />
                  </div>
                  <div class="flex gap-2 justify-end">
                    <Button variant="ghost" size="sm" class="h-7 gap-1.5 text-xs" @click="cancelChangePwd"><X class="h-3 w-3" />取消</Button>
                    <Button size="sm" class="h-7 gap-1.5 text-xs" @click="savePwd"><Check class="h-3 w-3" />确认</Button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Favorites -->
            <div v-if="activeTab === 'favorites'" class="p-6">
              <div class="space-y-1">
                <button
                  v-for="item in favorites"
                  :key="item.id"
                  class="group flex w-full items-center gap-3.5 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-muted/50 cursor-pointer"
                >
                  <img
                    :src="item.cover"
                    :alt="item.title"
                    class="h-10 w-14 shrink-0 rounded-md bg-muted object-cover"
                  />
                  <div class="flex-1 min-w-0">
                    <p class="text-[13px] font-medium truncate">{{ item.title }}</p>
                    <p class="text-[11px] text-muted-foreground mt-0.5">{{ item.category }} · {{ item.date }}</p>
                  </div>
                  <ExternalLink class="h-3.5 w-3.5 shrink-0 text-muted-foreground/30 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              </div>

              <div v-if="favorites.length === 0" class="flex flex-col items-center justify-center py-16 text-center">
                <Bookmark class="h-7 w-7 text-muted-foreground/30" />
                <p class="mt-3 text-[13px] text-muted-foreground">还没有收藏任何文章</p>
              </div>
            </div>
          </ScrollArea>
        </div>
      </Card>

      <!-- ═══ 移动端: 居中弹窗 ═══ -->
      <Card
        class="v2-root flex md:hidden w-full max-w-[400px] max-h-[85vh] flex-col overflow-hidden rounded-xl border-border/40 bg-background text-foreground shadow-lg"
        @click.stop
      >
        <!-- Header -->
        <div class="flex items-center justify-between px-4 py-3 border-b border-border/30">
          <h2 class="text-[15px] font-semibold tracking-tight">个人中心</h2>
          <button
            class="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted cursor-pointer"
            @click="emit('update:open', false)"
          >
            <X class="h-4 w-4" />
          </button>
        </div>

        <!-- Tab 栏 -->
        <div class="flex items-center gap-1 px-4 py-3">
          <button
            v-for="tab in tabs"
            :key="tab.key"
            class="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer"
            :class="activeTab === tab.key
              ? 'bg-muted text-foreground'
              : 'text-muted-foreground hover:text-foreground'"
            @click="activeTab = tab.key"
          >
            <component :is="tab.icon" class="h-3.5 w-3.5" />
            {{ tab.label }}
          </button>
          <div class="flex-1" />
          <button
            class="flex items-center gap-1 rounded-md px-3 py-1.5 text-xs font-medium text-destructive/70 transition-colors hover:text-destructive cursor-pointer"
            @click="handleLogout"
          >
            <LogOut class="h-3.5 w-3.5" />
          </button>
        </div>

        <!-- Content -->
        <ScrollArea class="flex-1">
          <!-- Profile -->
          <div v-if="activeTab === 'profile'" class="p-4 space-y-4">
            <div class="flex items-center gap-3.5">
              <Avatar class="h-14 w-14 shrink-0">
                <AvatarImage :src="mockUser.avatar" :alt="mockUser.name" />
                <AvatarFallback class="text-base">{{ mockUser.name.slice(0, 1) }}</AvatarFallback>
              </Avatar>
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-1.5">
                  <span class="text-[15px] font-semibold tracking-tight truncate">{{ mockUser.name }}</span>
                  <span
                    v-if="mockUser.plan !== 'Free'"
                    class="inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 text-[10px] font-semibold"
                    :class="planConfig[mockUser.plan].class"
                  >
                    <Crown class="h-2.5 w-2.5" />
                    {{ mockUser.plan }}
                  </span>
                </div>
                <span class="text-[11px] text-muted-foreground/50">UID {{ mockUser.uid }}</span>
                <div v-if="!isEditingBio" class="flex items-start gap-1.5 mt-1">
                  <p class="text-[12px] text-muted-foreground leading-relaxed flex-1">{{ mockUser.bio }}</p>
                  <button class="shrink-0 mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded text-muted-foreground/40 hover:text-foreground transition-colors cursor-pointer" @click="startEditBio">
                    <Pencil class="h-2.5 w-2.5" />
                  </button>
                </div>
              </div>
            </div>

            <div v-if="isEditingBio" class="space-y-2">
              <textarea v-model="editBio" class="w-full rounded-lg border border-border/50 bg-muted/30 px-3 py-2.5 text-[13px] resize-none focus:outline-none focus:ring-2 focus:ring-ring/50" rows="2" placeholder="写点什么介绍自己..." />
              <div class="flex gap-2 justify-end">
                <Button variant="ghost" size="sm" class="h-8 text-xs" @click="cancelEditBio">取消</Button>
                <Button size="sm" class="h-8 text-xs" @click="saveBio">保存</Button>
              </div>
            </div>

            <div class="flex items-center gap-5 py-1 text-[13px]">
              <div><span class="font-semibold tabular-nums">{{ mockUser.posts }}</span> <span class="text-muted-foreground">文章</span></div>
              <div><span class="font-semibold tabular-nums">{{ mockUser.followers }}</span> <span class="text-muted-foreground">关注者</span></div>
              <div><span class="font-semibold tabular-nums">{{ mockUser.following }}</span> <span class="text-muted-foreground">关注中</span></div>
            </div>

            <div class="space-y-0.5">
              <div class="flex items-center gap-3 py-2.5 text-[13px]">
                <Mail class="h-4 w-4 text-muted-foreground/40 shrink-0" />
                <span class="text-muted-foreground">邮箱</span>
                <span class="flex-1 text-right text-[12px]">{{ mockUser.email }}</span>
              </div>
              <div class="flex items-center gap-3 py-2.5 text-[13px]">
                <Calendar class="h-4 w-4 text-muted-foreground/40 shrink-0" />
                <span class="text-muted-foreground">注册时间</span>
                <span class="flex-1 text-right text-[12px]">{{ mockUser.joinDate }}</span>
              </div>
              <div v-if="!isChangingPwd">
                <button class="flex w-full items-center gap-3 py-2.5 text-[13px] text-muted-foreground transition-colors active:bg-muted/40 rounded-md cursor-pointer" @click="startChangePwd">
                  <KeyRound class="h-4 w-4 text-muted-foreground/40 shrink-0" />
                  <span class="flex-1 text-left">修改密码</span>
                  <ChevronRight class="h-4 w-4 text-muted-foreground/25" />
                </button>
              </div>
              <div v-else class="space-y-2.5">
                <div class="relative">
                  <Lock class="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground/40" />
                  <Input v-model="pwdForm.current" type="password" placeholder="当前密码" class="h-9 pl-9 text-[13px]" />
                </div>
                <div class="relative">
                  <KeyRound class="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground/40" />
                  <Input v-model="pwdForm.newPwd" type="password" placeholder="新密码" class="h-9 pl-9 text-[13px]" />
                </div>
                <div class="relative">
                  <Check class="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground/40" />
                  <Input v-model="pwdForm.confirm" type="password" placeholder="确认新密码" class="h-9 pl-9 text-[13px]" />
                </div>
                <div class="flex gap-2 justify-end pt-1">
                  <Button variant="ghost" size="sm" class="h-8 gap-1.5 text-xs" @click="cancelChangePwd"><X class="h-3 w-3" />取消</Button>
                  <Button size="sm" class="h-8 gap-1.5 text-xs" @click="savePwd"><Check class="h-3 w-3" />确认</Button>
                </div>
              </div>
            </div>
          </div>

          <!-- Favorites -->
          <div v-if="activeTab === 'favorites'" class="px-4 py-3 space-y-2">
            <button v-for="item in favorites" :key="item.id" class="flex w-full items-center gap-3 text-left transition-colors active:bg-muted/30 rounded-lg px-2 py-2 cursor-pointer">
              <img :src="item.cover" :alt="item.title" class="h-12 w-16 shrink-0 rounded-lg bg-muted object-cover" />
              <div class="flex-1 min-w-0">
                <p class="text-[13px] font-medium truncate leading-snug">{{ item.title }}</p>
                <div class="flex items-center gap-1.5 mt-1">
                  <span class="text-[11px] text-muted-foreground">{{ item.date }}</span>
                </div>
              </div>
            </button>
            <div v-if="favorites.length === 0" class="flex flex-col items-center justify-center py-12 text-center">
              <Bookmark class="h-8 w-8 text-muted-foreground/15" />
              <p class="mt-3 text-[13px] text-muted-foreground">还没有收藏任何文章</p>
            </div>
          </div>
        </ScrollArea>
      </Card>
    </div>
  </transition>
</template>

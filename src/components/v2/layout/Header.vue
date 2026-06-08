<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, nextTick, watch } from 'vue'
import { useRoute } from 'vue-router'
import {
  Home,
  ShoppingBag,
  Heart,
  Info,
  Menu,
  X,
  Sun,
  Moon,
  Search,
  Bell,
  User,
  LogIn,
  LogOut,
  Settings,
  Bookmark,
  Copy,
  Check,
  Crown,
} from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'

const route = useRoute()

const navItems = [
  { label: '首页', to: '/v2', icon: Home },
  { label: '商城', to: '/v2/shop', icon: ShoppingBag },
  { label: '赞助', to: '/v2/donation', icon: Heart },
  { label: '关于', to: '/v2/about', icon: Info },
]

// 模拟登录状态(后续接入真实用户状态替换)
const isLoggedIn = ref(true)

type PlanType = 'Pro' | 'Plus' | 'Free'
const planConfig: Record<PlanType, { class: string }> = {
  Pro: { class: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
  Plus: { class: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' },
  Free: { class: 'bg-muted text-muted-foreground' },
}

const mockUser = {
  name: '林间微风信使',
  uid: '100248',
  avatar: 'https://picsum.photos/seed/user-avatar/100/100',
  plan: 'Pro' as PlanType,
}

const copied = ref(false)
function copyUid() {
  navigator.clipboard.writeText(mockUser.uid)
  copied.value = true
  setTimeout(() => { copied.value = false }, 2000)
}

const isDark = ref(document.documentElement.classList.contains('dark'))

function toggleTheme() {
  isDark.value = !isDark.value
  document.documentElement.classList.toggle('dark', isDark.value)
}

const isActive = (to: string) => {
  if (to === '/v2') return route.path === '/v2'
  return route.path.startsWith(to)
}

function toggleLogin() {
  isLoggedIn.value = !isLoggedIn.value
}

const mobileOpen = ref(false)

// 自定义用户下拉菜单(避开 reka-ui body scroll lock)
const userDropdownOpen = ref(false)
const triggerRef = ref<HTMLElement | null>(null)
const dropdownStyle = ref<Record<string, string>>({})

function toggleUserDropdown() {
  userDropdownOpen.value = !userDropdownOpen.value
  if (userDropdownOpen.value) {
    nextTick(() => updateDropdownPosition())
  }
}

function updateDropdownPosition() {
  const el = triggerRef.value?.$el ?? triggerRef.value
  if (!el) return
  const rect = el.getBoundingClientRect()
  dropdownStyle.value = {
    position: 'fixed',
    top: `${rect.bottom + 4}px`,
    right: `${window.innerWidth - rect.right}px`,
  }
}

function handleClickOutside(e: MouseEvent) {
  if (!userDropdownOpen.value) return
  const target = e.target as HTMLElement
  const el = triggerRef.value?.$el ?? triggerRef.value
  if (el?.contains(target)) return
  if (target.closest('[data-user-dropdown]')) return
  userDropdownOpen.value = false
}

function handleScroll() {
  if (userDropdownOpen.value) {
    updateDropdownPosition()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside, true)
  window.addEventListener('scroll', handleScroll, true)
  window.addEventListener('resize', handleScroll)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside, true)
  window.removeEventListener('scroll', handleScroll, true)
  window.removeEventListener('resize', handleScroll)
})
</script>

<template>
  <header class="sticky top-0 z-50 w-full border-b bg-background">
    <div class="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
      <!-- Logo -->
      <router-link to="/v2" class="flex items-center shrink-0">
        <img src="/logo.png" alt="Blog Lite" style="height: 48px; width: auto; max-width: none;" />
      </router-link>

      <nav class="hidden items-center gap-1 md:flex">
        <router-link
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors"
          :class="isActive(item.to)
            ? 'bg-secondary text-secondary-foreground'
            : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'"
        >
          <component :is="item.icon" class="h-4 w-4" />
          {{ item.label }}
        </router-link>
      </nav>

      <!-- Desktop Actions -->
      <div class="hidden items-center gap-1 md:flex">
        <Button variant="ghost" size="icon" class="h-9 w-9">
          <Search class="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" class="relative h-9 w-9">
          <Bell class="h-4 w-4" />
          <span v-if="isLoggedIn" class="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-destructive" />
        </Button>
        <Button variant="ghost" size="icon" class="h-9 w-9" @click="toggleTheme">
          <Sun v-if="isDark" class="h-4 w-4" />
          <Moon v-else class="h-4 w-4" />
        </Button>
        <Separator orientation="vertical" class="mx-2 h-5" />

        <!-- 已登录:头像下拉菜单 -->
        <template v-if="isLoggedIn">
          <Button ref="triggerRef" variant="ghost" class="h-9 gap-2 px-2" @click="toggleUserDropdown">
            <Avatar class="h-6 w-6">
              <AvatarImage :src="mockUser.avatar" :alt="mockUser.name" />
              <AvatarFallback>{{ mockUser.name.slice(0, 1) }}</AvatarFallback>
            </Avatar>
            <span class="hidden text-sm font-medium sm:inline">{{ mockUser.name }}</span>
            <span
              v-if="mockUser.plan !== 'Free'"
              class="hidden items-center gap-0.5 rounded px-1.5 py-0.5 text-[10px] font-semibold sm:inline-flex"
              :class="planConfig[mockUser.plan].class"
            >
              <Crown class="h-3 w-3" />
              {{ mockUser.plan }}
            </span>
          </Button>
          <!-- 自定义下拉面板 (Teleport to body, fixed 定位, 不触发 scroll lock) -->
          <Teleport to="body">
            <Transition
              enter-active-class="transition duration-150 ease-out"
              enter-from-class="opacity-0 scale-95"
              enter-to-class="opacity-100 scale-100"
              leave-active-class="transition duration-100 ease-in"
              leave-from-class="opacity-100 scale-100"
              leave-to-class="opacity-0 scale-95"
            >
              <div
                v-if="userDropdownOpen"
                data-user-dropdown
                :style="dropdownStyle"
                class="z-50 w-48 rounded-md border bg-popover p-1 text-popover-foreground shadow-md"
              >
                <!-- 用户信息 -->
                <div class="px-2 pt-1.5 pb-2">
                  <p class="text-sm font-medium">{{ mockUser.name }}</p>
                  <div class="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                    <span>ID: {{ mockUser.uid }}</span>
                    <button
                      class="inline-flex items-center justify-center rounded p-0.5 hover:bg-accent transition-colors"
                      @click.stop="copyUid"
                    >
                      <Check v-if="copied" class="h-3 w-3 text-green-500" />
                      <Copy v-else class="h-3 w-3" />
                    </button>
                  </div>
                </div>
                <!-- 菜单项 -->
                <button class="flex w-full cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent" @click="userDropdownOpen = false">
                  <User class="h-4 w-4" />
                  个人主页
                </button>
                <button class="flex w-full cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent" @click="userDropdownOpen = false">
                  <Bookmark class="h-4 w-4" />
                  我的收藏
                </button>
                <button class="flex w-full cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent" @click="userDropdownOpen = false">
                  <Settings class="h-4 w-4" />
                  设置
                </button>
                <button class="flex w-full cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm text-destructive outline-none transition-colors hover:bg-accent mt-1" @click="userDropdownOpen = false; toggleLogin()">
                  <LogOut class="h-4 w-4" />
                  退出登录
                </button>
              </div>
            </Transition>
          </Teleport>
        </template>

        <!-- 未登录:登录按钮 -->
        <Button v-else variant="outline" size="sm" class="gap-2" @click="toggleLogin">
          <LogIn class="h-4 w-4" />
          登录
        </Button>
      </div>

      <!-- Mobile Menu -->
      <div class="flex items-center gap-1 md:hidden">
        <Button variant="ghost" size="icon" class="h-9 w-9" @click="toggleTheme">
          <Sun v-if="isDark" class="h-4 w-4" />
          <Moon v-else class="h-4 w-4" />
        </Button>
        <Sheet v-model:open="mobileOpen">
          <SheetTrigger as-child>
            <Button variant="ghost" size="icon" class="h-9 w-9">
              <Menu class="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" class="w-72">
            <div class="flex flex-col gap-6 pt-6">
              <!-- Mobile 用户信息 -->
              <div v-if="isLoggedIn" class="flex items-center gap-3 px-2">
                <Avatar class="h-10 w-10">
                  <AvatarImage :src="mockUser.avatar" :alt="mockUser.name" />
                  <AvatarFallback>{{ mockUser.name.slice(0, 1) }}</AvatarFallback>
                </Avatar>
                <div>
                  <div class="flex items-center gap-2">
                    <p class="text-sm font-medium">{{ mockUser.name }}</p>
                    <span
                      v-if="mockUser.plan !== 'Free'"
                      class="inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 text-[10px] font-semibold"
                      :class="planConfig[mockUser.plan].class"
                    >
                      <Crown class="h-3 w-3" />
                      {{ mockUser.plan }}
                    </span>
                  </div>
                  <div class="flex items-center gap-1 text-xs text-muted-foreground">
                    <span>ID: {{ mockUser.uid }}</span>
                    <button
                      class="inline-flex items-center justify-center rounded p-0.5 hover:bg-accent transition-colors"
                      @click.stop="copyUid"
                    >
                      <Check v-if="copied" class="h-3 w-3 text-green-500" />
                      <Copy v-else class="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>
              <!-- Mobile 未登录 -->
              <div v-else class="flex items-center px-2">
                <img src="/logo.png" alt="Blog Lite" style="height: 48px; width: auto; max-width: none;" />
              </div>

              <Separator />

              <!-- Mobile Nav Links -->
              <nav class="flex flex-col gap-1">
                <router-link
                  v-for="item in navItems"
                  :key="item.to"
                  :to="item.to"
                  class="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors"
                  :class="isActive(item.to)
                    ? 'bg-secondary text-secondary-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'"
                  @click="mobileOpen = false"
                >
                  <component :is="item.icon" class="h-4 w-4" />
                  {{ item.label }}
                </router-link>
              </nav>

              <Separator />

              <!-- Mobile Actions -->
              <div class="flex flex-col gap-2 px-2">
                <Button variant="outline" class="w-full justify-start gap-2">
                  <Search class="h-4 w-4" />
                  搜索
                </Button>
                <Button variant="outline" class="w-full justify-start gap-2">
                  <Bell class="h-4 w-4" />
                  通知
                </Button>
                <template v-if="isLoggedIn">
                  <Button variant="outline" class="w-full justify-start gap-2">
                    <User class="h-4 w-4" />
                    个人主页
                  </Button>
                  <Button variant="outline" class="w-full justify-start gap-2">
                    <Bookmark class="h-4 w-4" />
                    我的收藏
                  </Button>
                  <Button variant="outline" class="w-full justify-start gap-2 text-destructive" @click="toggleLogin">
                    <LogOut class="h-4 w-4" />
                    退出登录
                  </Button>
                </template>
                <Button v-else class="w-full justify-start gap-2" @click="toggleLogin">
                  <LogIn class="h-4 w-4" />
                  登录
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  </header>
</template>

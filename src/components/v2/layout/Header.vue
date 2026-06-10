<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'
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
import LoginModal from '@/components/v2/auth/LoginModal.vue'
import NotificationCenter from '@/components/v2/layout/NotificationCenter.vue'
const emit = defineEmits<{
  (e: 'open-user-center'): void
}>()

const route = useRoute()

const navItems = [
  { label: '首页', to: '/v2', icon: Home },
  { label: '商城', to: '/v2/shop', icon: ShoppingBag },
  { label: '捐赠', to: '/v2/donation', icon: Heart },
  { label: '关于', to: '/v2/about', icon: Info },
]

// 模拟登录状态(后续接入真实用户状态替换)
const isLoggedIn = ref(true)
const showLoginModal = ref(false)

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
  if (isLoggedIn.value) {
    isLoggedIn.value = false
  } else {
    showLoginModal.value = true
  }
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
        <NotificationCenter />
        <Button variant="ghost" size="icon" class="h-9 w-9" @click="toggleTheme">
          <Sun v-if="isDark" class="h-4 w-4" />
          <Moon v-else class="h-4 w-4" />
        </Button>
        <router-link to="/v2/donation">
          <Button size="sm" class="h-7 gap-1 rounded-full px-2.5 text-xs">
            <Heart class="h-3 w-3 fill-current animate-[heartbeat_1.8s_ease-in-out_infinite]" />
            赞助
          </Button>
        </router-link>
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
                class="v2-root z-50 w-48 rounded-md border-border/40 bg-card p-1 text-card-foreground shadow-lg dark:bg-[hsl(222,18%,15%)]"
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
                      <Check v-if="copied" class="h-3 w-3 text-green-500 dark:text-green-400" />
                      <Copy v-else class="h-3 w-3" />
                    </button>
                  </div>
                </div>
                <button class="flex w-full cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent" @click="userDropdownOpen = false; emit('open-user-center')">
                  <Settings class="h-4 w-4" />
                  个人中心
                </button>
                <button class="flex w-full cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm text-destructive outline-none transition-colors hover:bg-accent" @click="userDropdownOpen = false; toggleLogin()">
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
        <Button
          v-if="isLoggedIn"
          variant="ghost"
          class="h-9 gap-1.5 px-2"
          @click="mobileOpen = true"
        >
          <Avatar class="h-5 w-5">
            <AvatarImage :src="mockUser.avatar" :alt="mockUser.name" />
            <AvatarFallback>{{ mockUser.name.slice(0, 1) }}</AvatarFallback>
          </Avatar>
          <span class="max-w-24 truncate text-xs font-medium">{{ mockUser.name }}</span>
          <span
            v-if="mockUser.plan !== 'Free'"
            class="inline-flex items-center rounded px-1 py-0.5 text-[9px] font-semibold leading-none"
            :class="planConfig[mockUser.plan].class"
          >
            {{ mockUser.plan }}
          </span>
        </Button>
        <Button v-else variant="outline" size="sm" class="h-8 gap-1.5 px-2 text-xs" @click="toggleLogin">
          <LogIn class="h-3.5 w-3.5" />
          登录
        </Button>
        <Sheet v-model:open="mobileOpen">
          <SheetTrigger as-child>
            <Button variant="ghost" size="icon" class="h-9 w-9">
              <Menu class="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" class="v2-root w-72 bg-background text-foreground">
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
                      <Check v-if="copied" class="h-3 w-3 text-green-500 dark:text-green-400" />
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
                <NotificationCenter mobile />
                <router-link to="/v2/donation" class="block" @click="mobileOpen = false">
                  <Button class="w-full justify-start gap-2 rounded-md">
                    <Heart class="h-3 w-3 fill-current animate-[heartbeat_1.8s_ease-in-out_infinite]" />
                    赞助
                  </Button>
                </router-link>
                <template v-if="isLoggedIn">
                  <Button variant="ghost" class="w-full justify-start gap-2 rounded-md text-muted-foreground hover:text-foreground" @click="mobileOpen = false; emit('open-user-center')">
                    <User class="h-4 w-4" />
                    个人中心
                  </Button>
                  <Button variant="ghost" class="w-full justify-start gap-2 rounded-md text-destructive hover:bg-destructive/10 hover:text-destructive" @click="toggleLogin">
                    <LogOut class="h-4 w-4" />
                    退出登录
                  </Button>
                </template>
                <Button v-else class="w-full justify-start gap-2 rounded-md" @click="toggleLogin">
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

  <!-- 登录弹窗 -->
  <LoginModal
    v-model:open="showLoginModal"
    @login-success="isLoggedIn = true"
  />
</template>

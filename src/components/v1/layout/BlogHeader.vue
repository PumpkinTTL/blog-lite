<template>
  <header class="fixed top-0 left-0 right-0 z-50 transition-colors duration-300" :class="isDark ? 'bg-[#0F172A] border-gray-800' : 'bg-white border-gray-200'" style="border-bottom-width: 1px;">
    <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center gap-4 h-16">
        <!-- Logo -->
        <div class="flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-pointer transition-all" :class="isDark ? 'hover:bg-gray-800/60' : 'hover:bg-gray-100'" @click="goHome">
          <div class="w-9 h-9 rounded-lg flex items-center justify-center bg-blue-600">
            <font-awesome-icon icon="book" class="text-white text-base" />
          </div>
          <div class="flex flex-col">
            <span class="text-base font-semibold leading-tight" :class="isDark ? 'text-white' : 'text-gray-900'">博客资源</span>
            <span class="text-[10px] font-medium leading-tight" :class="isDark ? 'text-gray-500' : 'text-gray-400'">Resource Hub</span>
          </div>
        </div>

        <!-- Desktop Nav Panel -->
        <div class="hidden md:flex items-center gap-1 px-2 py-1.5 rounded-lg transition-all" :class="isDark ? 'bg-gray-800/40 border border-gray-700/50' : 'bg-gray-50 border border-gray-200/50'">
          <a v-for="item in navItems" :key="item.name" :href="item.href" class="group flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-all cursor-pointer" :class="isDark ? 'text-gray-300 hover:text-white hover:bg-gray-700/60' : 'text-gray-700 hover:text-gray-900 hover:bg-white'" @click.prevent="handleNavClick(item)">
            <font-awesome-icon :icon="item.icon" class="text-sm" :class="isDark ? 'group-hover:text-blue-400' : 'group-hover:text-blue-600'" />
            <span>{{ item.name }}</span>
          </a>
        </div>

        <div class="flex-1"></div>

        <!-- Actions -->
        <div class="flex items-center gap-2">
          <!-- Action Buttons -->
          <button class="p-2 rounded-lg transition-all cursor-pointer" :class="isDark ? 'text-gray-400 hover:text-white hover:bg-gray-800/60' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'" @click="openSearch">
            <font-awesome-icon icon="search" class="text-base" />
          </button>

          <button class="hidden sm:block p-2 rounded-lg transition-all cursor-pointer" :class="isDark ? 'text-gray-400 hover:text-white hover:bg-gray-800/60' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'" @click="toggleTheme">
            <font-awesome-icon :icon="isDark ? 'sun' : 'moon'" class="text-base" />
          </button>

          <button class="hidden sm:block relative p-2 rounded-lg transition-all cursor-pointer" :class="isDark ? 'text-gray-400 hover:text-white hover:bg-gray-800/60' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'" @click="openNotifications">
            <font-awesome-icon icon="bell" class="text-base" />
            <span v-if="hasNotifications" class="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2" :class="isDark ? 'ring-[#0F172A]' : 'ring-white'"></span>
          </button>

          <!-- Divider -->
          <div class="hidden sm:block w-px h-6 mx-1" :class="isDark ? 'bg-gray-700' : 'bg-gray-200'"></div>

          <!-- User -->
          <div class="hidden sm:block relative">
            <button class="flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all cursor-pointer" :class="isDark ? 'bg-gray-800/60 hover:bg-gray-800' : 'bg-gray-100 hover:bg-gray-200'" @click="toggleUserMenu">
              <div class="relative">
                <div class="w-8 h-8 rounded-full flex items-center justify-center ring-2 ring-offset-2 overflow-hidden" :class="isDark ? 'ring-gray-700 ring-offset-[#0F172A]' : 'ring-gray-200 ring-offset-white'">
                  <img src="https://img2.woyaogexing.com/2025/04/05/2d3c285633cc350b263ae66888c525ed.jpg" alt="用户头像" class="w-full h-full object-cover" />
                </div>
                <div v-if="user?.isVip" class="vip-crown-badge">
                  <font-awesome-icon icon="crown" class="text-[7px]" />
                </div>
              </div>
              <span class="text-sm font-medium username-text" :class="[isDark ? 'text-gray-200' : 'text-gray-700', user?.isVip ? 'vip-shimmer' : '']">{{ user?.username || '用户' }}</span>
              <font-awesome-icon icon="chevron-down" class="text-xs transition-transform" :class="[isDark ? 'text-gray-400' : 'text-gray-500', isUserMenuOpen ? 'rotate-180' : '']" />
            </button>

            <transition enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0 scale-95" enter-to-class="opacity-100 scale-100" leave-active-class="transition duration-100 ease-in" leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95">
              <div v-if="isUserMenuOpen" class="absolute right-0 mt-2 w-56 rounded-xl shadow-2xl py-2 overflow-hidden" :class="isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'">
                <div class="px-4 py-3" :class="isDark ? 'bg-gray-900/50' : 'bg-gray-50'">
                  <p class="text-sm font-semibold username-text" :class="[isDark ? 'text-white' : 'text-gray-900', user?.isVip ? 'vip-shimmer' : '']">{{ user?.username || '用户' }}</p>
                  <p class="text-xs mt-0.5" :class="isDark ? 'text-gray-400' : 'text-gray-500'">{{ user?.email || 'user@example.com' }}</p>
                </div>
                <div class="py-1">
                  <a href="#" class="flex items-center gap-3 px-4 py-2.5 text-sm transition-colors cursor-pointer" :class="isDark ? 'text-gray-300 hover:text-white hover:bg-gray-700/50' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'">
                    <font-awesome-icon icon="user" class="w-4" />
                    个人资料
                  </a>
                  <a href="#" class="flex items-center gap-3 px-4 py-2.5 text-sm transition-colors cursor-pointer" :class="isDark ? 'text-gray-300 hover:text-white hover:bg-gray-700/50' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'">
                    <font-awesome-icon icon="cog" class="w-4" />
                    设置
                  </a>
                </div>
                <div class="mt-1 pt-1" :class="isDark ? 'border-t border-gray-700' : 'border-t border-gray-200'">
                  <a href="#" class="flex items-center gap-3 px-4 py-2.5 text-sm transition-colors cursor-pointer" :class="isDark ? 'text-red-400 hover:text-red-300 hover:bg-red-500/10' : 'text-red-600 hover:text-red-700 hover:bg-red-50'">
                    <font-awesome-icon icon="arrow-right" class="w-4" />
                    退出登录
                  </a>
                </div>
              </div>
            </transition>
          </div>

          <button class="md:hidden p-2 rounded-lg transition-all cursor-pointer" :class="isDark ? 'text-gray-400 hover:text-white hover:bg-gray-800/60' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'" @click="toggleMobileMenu">
            <font-awesome-icon :icon="isMobileMenuOpen ? 'xmark' : 'bars'" class="text-base" />
          </button>
        </div>
      </div>
    </nav>

    <transition enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0 -translate-y-2" enter-to-class="opacity-100 translate-y-0" leave-active-class="transition duration-150 ease-in" leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 -translate-y-2">
      <div v-if="isMobileMenuOpen" class="md:hidden" :class="isDark ? 'bg-gray-900 border-gray-800' : 'bg-gray-50 border-gray-200'" style="border-top-width: 1px;">
        <div class="px-4 py-3 space-y-1">
          <a v-for="item in navItems" :key="item.name" :href="item.href" class="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all cursor-pointer" :class="isDark ? 'text-gray-300 hover:text-white hover:bg-gray-800/60' : 'text-gray-700 hover:text-gray-900 hover:bg-white'" @click.prevent="handleNavClickMobile(item)">
            <font-awesome-icon :icon="item.icon" class="w-4" />
            {{ item.name }}
          </a>
          <div class="pt-3" :class="isDark ? 'border-t border-gray-800' : 'border-t border-gray-200'">
            <div class="flex items-center gap-3 px-4 py-3 rounded-lg" :class="isDark ? 'bg-gray-800/60' : 'bg-white'">
              <div class="relative">
                <div class="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden">
                  <img src="https://img2.woyaogexing.com/2025/04/05/2d3c285633cc350b263ae66888c525ed.jpg" alt="用户头像" class="w-full h-full object-cover" />
                </div>
                <div v-if="user?.isVip" class="vip-crown-badge-large">
                  <font-awesome-icon icon="crown" class="text-[8px]" />
                </div>
              </div>
              <div>
                <p class="text-sm font-semibold username-text" :class="[isDark ? 'text-white' : 'text-gray-900', user?.isVip ? 'vip-shimmer' : '']">{{ user?.username || '用户' }}</p>
                <p class="text-xs" :class="isDark ? 'text-gray-400' : 'text-gray-500'">{{ user?.email || 'user@example.com' }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const isMobileMenuOpen = ref(false)
const isUserMenuOpen = ref(false)
const hasNotifications = ref(true)
const isDark = ref(false)

const user = ref({
  username: '又是一年冬',
  email: 'zhangsan@example.com',
  isVip: true
})

const navItems = [
  { name: '首页', href: '/', isRoute: true, icon: 'home' },
  { name: '资源', href: '#resources', isRoute: false, icon: 'book' },
  { name: '关于', href: '#about', isRoute: false, icon: 'circle-info' }
]

const goHome = () => router.push('/')

const handleNavClick = (item: typeof navItems[0]) => {
  if (item.isRoute) {
    router.push(item.href)
  } else {
    const element = document.querySelector(item.href)
    if (element) element.scrollIntoView({ behavior: 'smooth' })
  }
}

const handleNavClickMobile = (item: typeof navItems[0]) => {
  isMobileMenuOpen.value = false
  handleNavClick(item)
}

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
  if (isMobileMenuOpen.value) isUserMenuOpen.value = false
}

const toggleUserMenu = () => {
  isUserMenuOpen.value = !isUserMenuOpen.value
}

const toggleTheme = () => {
  isDark.value = !isDark.value
}

const openSearch = () => {
  console.log('Open search')
}

const openNotifications = () => {
  console.log('Open notifications')
}
</script>

<style scoped>
/* VIP 会员昵称流光动画 - 粉紫色高级感 */
.vip-shimmer {
  position: relative;
  background: linear-gradient(90deg, 
    #ec4899 0%, 
    #a855f7 25%, 
    #d946ef 50%, 
    #a855f7 75%, 
    #ec4899 100%
  );
  background-size: 200% 100%;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: shimmer 3s linear infinite;
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

/* 确保非会员用户正常显示 */
.username-text:not(.vip-shimmer) {
  -webkit-text-fill-color: inherit;
}

/* VIP 皇冠徽章 - 边缘流光版 */
.vip-crown-badge {
  position: absolute;
  top: -2px;
  right: -2px;
  width: 16px;
  height: 16px;
  background: linear-gradient(135deg, #ffd700 0%, #ffed4e 50%, #f4c430 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid transparent;
  background-clip: padding-box;
  box-shadow: 
    0 1px 3px rgba(0, 0, 0, 0.15),
    inset 0 1px 2px rgba(255, 255, 255, 0.7);
  color: #8b6914;
  z-index: 10;
}

.vip-crown-badge::before {
  content: '';
  position: absolute;
  inset: -2px;
  border-radius: 50%;
  padding: 2px;
  background: linear-gradient(90deg, 
    #ffd700 0%, 
    #fff 25%, 
    #ffd700 50%, 
    #fff 75%, 
    #ffd700 100%
  );
  background-size: 200% 100%;
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  animation: borderShimmer 2s linear infinite;
}

.vip-crown-badge-large {
  position: absolute;
  top: -1px;
  right: -1px;
  width: 18px;
  height: 18px;
  background: linear-gradient(135deg, #ffd700 0%, #ffed4e 50%, #f4c430 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2.5px solid transparent;
  background-clip: padding-box;
  box-shadow: 
    0 1px 4px rgba(0, 0, 0, 0.15),
    inset 0 1px 2px rgba(255, 255, 255, 0.7);
  color: #8b6914;
  z-index: 10;
}

.vip-crown-badge-large::before {
  content: '';
  position: absolute;
  inset: -2.5px;
  border-radius: 50%;
  padding: 2.5px;
  background: linear-gradient(90deg, 
    #ffd700 0%, 
    #fff 25%, 
    #ffd700 50%, 
    #fff 75%, 
    #ffd700 100%
  );
  background-size: 200% 100%;
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  animation: borderShimmer 2s linear infinite;
}

@keyframes borderShimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
</style>

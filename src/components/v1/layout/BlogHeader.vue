<template>
  <header class="fixed top-0 left-0 right-0 z-50 transition-colors duration-300" :class="isDark ? 'border-gray-800' : 'bg-white border-gray-200'"
    :style="isDark ? { background: 'var(--bg)' } : {}"
    style="border-bottom-width: 1px; box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.02)">
    <nav class="mx-auto px-5" style="max-width: 1320px">
      <div class="flex items-center gap-2 sm:gap-4 h-14 sm:h-16">
        <!-- Logo -->
        <div class="flex items-center gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg cursor-pointer transition-all"
          :class="isDark ? 'hover:bg-gray-800/60' : 'hover:bg-gray-100'" @click="goHome">
          <div class="w-7 h-7 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center" style="background: var(--primary)">
            <font-awesome-icon icon="book" class="text-sm sm:text-base text-white" />
          </div>
          <div class="flex flex-col">
            <span class="text-sm sm:text-base font-semibold leading-tight"
              :class="isDark ? 'text-white' : 'text-gray-900'">博客资源</span>
            <span class="hidden sm:block text-[10px] font-medium leading-tight"
              :class="isDark ? 'text-gray-500' : 'text-gray-400'">Resource Hub</span>
          </div>
        </div>

        <!-- Desktop Nav Panel -->
        <div class="hidden md:flex items-center gap-1 px-2 py-1.5 rounded-lg transition-all" :class="isDark
            ? 'bg-gray-800/40 border border-gray-700/50'
            : 'bg-gray-50 border border-gray-200/50'
          ">
          <a v-for="item in navItems" :key="item.name" :href="item.href"
            class="group flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-all cursor-pointer"
            :class="isDark
                ? 'text-gray-300 hover:text-white hover:bg-gray-700/60'
                : 'text-gray-700 hover:text-gray-900 hover:bg-white'
              " @click.prevent="handleNavClick(item)">
            <font-awesome-icon :icon="item.icon" class="text-sm nav-icon" />
            <span>{{ item.name }}</span>
          </a>
        </div>

        <div class="flex-1"></div>

        <!-- Actions -->
        <div class="flex items-center gap-1 sm:gap-2">
          <!-- Theme Toggle (Desktop only) -->
          <button class="hidden sm:block p-2 rounded-lg transition-all cursor-pointer" :class="isDark
              ? 'text-gray-400 hover:text-white hover:bg-gray-800/60'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            " @click="toggleTheme">
            <font-awesome-icon :icon="isDark ? 'sun' : 'moon'" class="text-base" />
          </button>

          <!-- Notification Button (Desktop only) -->
          <button class="hidden sm:block relative p-2 rounded-lg transition-all cursor-pointer" :class="isDark
              ? 'text-gray-400 hover:text-white hover:bg-gray-800/60'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            " @click="toggleNotifications">
            <font-awesome-icon icon="bell" class="text-base" />
            <span v-if="hasNotifications" class="absolute top-1.5 right-1.5 w-2 h-2 rounded-full ring-2"
              style="background: var(--error)"
              :class="isDark ? `ring-[${DARK_BG}]` : 'ring-white'"></span>
          </button>

          <!-- Divider (Desktop only) -->
          <div class="hidden sm:block w-px h-6 mx-1" :class="isDark ? 'bg-gray-700' : 'bg-gray-200'"></div>

          <!-- User Button (All screens) -->
          <div class="relative" ref="userMenuRef">
            <button
              class="flex items-center gap-1.5 sm:gap-2.5 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg transition-all cursor-pointer"
              :class="isDark
                  ? 'bg-gray-800/60 hover:bg-gray-800'
                  : 'bg-gray-100 hover:bg-gray-200'
                " @click="toggleUserMenu">
              <div class="relative">
                <div
                  class="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center ring-1 sm:ring-2 ring-offset-1 sm:ring-offset-2 overflow-hidden"
                  :class="isDark
                      ? `ring-gray-700 ring-offset-[${DARK_BG}]`
                      : 'ring-gray-200 ring-offset-white'
                    ">
                  <img src="https://img2.woyaogexing.com/2025/04/05/2d3c285633cc350b263ae66888c525ed.jpg" alt="用户头像"
                    class="w-full h-full object-cover" />
                </div>
                <div v-if="user?.isVip" class="vip-crown-badge-mobile sm:vip-crown-badge">
                  <font-awesome-icon icon="crown" class="text-[6px] sm:text-[7px]" />
                </div>
              </div>
              <span class="text-xs sm:text-sm font-medium username-text max-w-[60px] sm:max-w-none truncate" :class="[
                isDark ? 'text-gray-200' : 'text-gray-700',
                user?.isVip ? 'vip-shimmer' : '',
              ]">{{ user?.username || "用户" }}</span>
              <font-awesome-icon icon="chevron-down" class="text-xs transition-transform duration-200" :class="[
                isDark ? 'text-gray-400' : 'text-gray-500',
                isUserMenuOpen ? 'rotate-180' : '',
              ]" />
            </button>

            <!-- User Menu Dropdown -->
            <transition>
              <div v-if="isUserMenuOpen" class="absolute right-0 mt-4 w-60 sm:w-64 rounded-xl overflow-hidden z-[9999]"
                :class="isDark
                    ? 'bg-gray-800/95 backdrop-blur-xl border border-gray-700/50'
                    : 'bg-white/95 backdrop-blur-xl border border-gray-200/50'
                  " style="box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.3)">
                <!-- User Info Header -->
                <div class="animate__animated animate__fadeInUp px-4 py-4 relative overflow-hidden"
                  style="animation-delay: 12ms; animation-duration: 180ms" :class="isDark
                      ? 'bg-gradient-to-br from-gray-900/50 to-gray-800/50'
                      : 'bg-gradient-to-br from-gray-50/50 to-white/50'
                    ">
                  <div class="absolute inset-0 bg-gradient-to-br from-transparent to-transparent" style="background: linear-gradient(to bottom right, rgba(59, 130, 246, 0.05), transparent)"></div>
                  <div class="flex items-start gap-3 relative z-10">
                    <div class="relative flex-shrink-0">
                      <div class="w-12 h-12 rounded-lg overflow-hidden ring-2 ring-offset-2" :class="isDark
                          ? 'ring-gray-700 ring-offset-gray-800'
                          : 'ring-gray-200 ring-offset-white'
                        ">
                        <img src="https://img2.woyaogexing.com/2025/04/05/2d3c285633cc350b263ae66888c525ed.jpg"
                          alt="用户头像" class="w-full h-full object-cover" />
                      </div>
                      <div v-if="user?.isVip"
                        class="absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center ring-2"
                        :class="isDark ? 'ring-gray-800' : 'ring-white'">
                        <font-awesome-icon icon="crown" class="text-[8px] text-white" />
                      </div>
                    </div>
                    <div class="flex-1 min-w-0 pt-0.5">
                      <div class="flex items-center gap-1.5 mb-1.5">
                        <p class="text-sm font-bold username-text truncate" :class="[
                          isDark ? 'text-white' : 'text-gray-900',
                          user?.isVip ? 'vip-shimmer' : '',
                        ]">
                          {{ user?.username || "用户" }}
                        </p>
                        <span v-if="user?.isVip"
                          class="inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-semibold rounded whitespace-nowrap flex-shrink-0"
                          :class="isDark
                              ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                              : 'bg-yellow-50 text-yellow-600 border border-yellow-200'
                            ">
                          <font-awesome-icon icon="crown" class="text-[8px]" />
                          VIP
                        </span>
                      </div>
                      <p class="text-xs truncate" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
                        {{ user?.email || "user@example.com" }}
                      </p>
                    </div>
                  </div>
                </div>

                <!-- Menu Items -->
                <div class="py-2 px-2">
                  <a href="#"
                    class="animate__animated animate__fadeInUp flex items-center gap-2.5 px-3 py-2 mb-0.5 text-sm font-medium rounded-lg transition-all duration-200 cursor-pointer group"
                    style="animation-delay: 38ms; animation-duration: 180ms" :class="isDark
                        ? 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                        : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                      " @click.prevent="openProfileCenter">
                    <font-awesome-icon icon="user" class="text-sm w-4 menu-icon" :class="isDark ? 'text-gray-400' : 'text-gray-500'" />
                    <span>个人资料</span>
                  </a>
                  <a href="#"
                    class="animate__animated animate__fadeInUp flex items-center gap-2.5 px-3 py-2 mb-0.5 text-sm font-medium rounded-lg transition-all duration-200 cursor-pointer group"
                    style="animation-delay: 64ms; animation-duration: 180ms" :class="isDark
                        ? 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                        : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                      ">
                    <font-awesome-icon icon="cog" class="text-sm w-4 menu-icon" :class="isDark ? 'text-gray-400' : 'text-gray-500'" />
                    <span>设置</span>
                  </a>

                  <!-- Mobile only options -->
                  <a href="#"
                    class="animate__animated animate__fadeInUp sm:hidden flex items-center gap-2.5 px-3 py-2 mb-0.5 text-sm font-medium rounded-lg transition-all duration-200 cursor-pointer group"
                    style="animation-delay: 90ms; animation-duration: 180ms" :class="isDark
                        ? 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                        : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                      " @click.prevent="toggleTheme">
                    <font-awesome-icon :icon="isDark ? 'sun' : 'moon'" class="text-sm w-4 menu-icon" :class="isDark ? 'text-gray-400' : 'text-gray-500'" />
                    <span>{{ isDark ? "浅色模式" : "深色模式" }}</span>
                  </a>
                  <a href="#"
                    class="animate__animated animate__fadeInUp sm:hidden flex items-center gap-2.5 px-3 py-2 mb-0.5 text-sm font-medium rounded-lg transition-all duration-200 cursor-pointer group relative"
                    style="animation-delay: 116ms; animation-duration: 180ms" :class="isDark
                        ? 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                        : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                      " @click.prevent="toggleNotifications">
                    <font-awesome-icon icon="bell" class="text-sm w-4 menu-icon" :class="isDark ? 'text-gray-400' : 'text-gray-500'" />
                    <span>通知中心</span>
                  </a>
                </div>

                <!-- Logout -->
                <div class="animate__animated animate__fadeInUp px-2 pb-2 pt-1 border-t"
                  style="animation-delay: 142ms; animation-duration: 180ms"
                  :class="isDark ? 'border-gray-700/50' : 'border-gray-200/50'">
                  <a href="#"
                    class="flex items-center gap-2.5 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 cursor-pointer group"
                    :class="isDark
                        ? 'text-red-400 hover:text-red-300 hover:bg-red-500/10'
                        : 'text-red-600 hover:text-red-700 hover:bg-red-50'
                      ">
                    <font-awesome-icon icon="arrow-right" class="text-sm w-4" />
                    <span>退出登录</span>
                  </a>
                </div>
              </div>
            </transition>
          </div>

          <!-- Mobile Menu Button (Mobile only) -->
          <button class="md:hidden p-1.5 rounded-lg transition-all cursor-pointer" :class="isDark
              ? 'text-gray-400 hover:text-white hover:bg-gray-800/60'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            " @click="toggleMobileMenu">
            <font-awesome-icon :icon="isMobileMenuOpen ? 'xmark' : 'bars'" class="text-sm" />
          </button>
        </div>
      </div>
    </nav>

    <transition enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0" leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 -translate-y-2">
      <div v-if="isMobileMenuOpen" class="md:hidden" :class="isDark ? 'bg-gray-900 border-gray-800' : 'bg-gray-50 border-gray-200'
        " style="border-top-width: 1px">
        <div class="px-4 py-3 space-y-1">
          <a v-for="item in navItems" :key="item.name" :href="item.href"
            class="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all cursor-pointer"
            :class="isDark
                ? 'text-gray-300 hover:text-white hover:bg-gray-800/60'
                : 'text-gray-700 hover:text-gray-900 hover:bg-white'
              " @click.prevent="handleNavClickMobile(item)">
            <font-awesome-icon :icon="item.icon" class="w-4" />
            {{ item.name }}
          </a>
          <div class="pt-3" :class="isDark ? 'border-t border-gray-800' : 'border-t border-gray-200'
            ">
            <div class="flex items-center gap-3 px-4 py-3 rounded-lg" :class="isDark ? 'bg-gray-800/60' : 'bg-white'">
              <div class="relative">
                <div class="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden">
                  <img src="https://img2.woyaogexing.com/2025/04/05/2d3c285633cc350b263ae66888c525ed.jpg" alt="用户头像"
                    class="w-full h-full object-cover" />
                </div>
                <div v-if="user?.isVip" class="vip-crown-badge-large">
                  <font-awesome-icon icon="crown" class="text-[8px]" />
                </div>
              </div>
              <div>
                <p class="text-sm font-semibold username-text" :class="[
                  isDark ? 'text-white' : 'text-gray-900',
                  user?.isVip ? 'vip-shimmer' : '',
                ]">
                  {{ user?.username || "用户" }}
                </p>
                <p class="text-xs" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
                  {{ user?.email || "user@example.com" }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <!-- Notification Center Modal -->
    <NotificationCenter :is-open="isNotificationOpen" :is-dark="isDark" @close="isNotificationOpen = false"
      @mark-all-read="handleMarkAllRead" />
    <ProfileCenter :is-open="isProfileCenterOpen" :is-dark="isDark" @close="isProfileCenterOpen = false" />
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from "vue";
import { useRouter } from "vue-router";
import NotificationCenter from "./NotificationCenter.vue";
import ProfileCenter from "./ProfileCenter.vue";
import { useThemeStore } from "@/stores/theme";

// 深色模式颜色常量
const DARK_BG = '#0F172A';
const DARK_BORDER = '#1f2937';

const router = useRouter();
const themeStore = useThemeStore();
const isDark = computed(() => themeStore.isDark);
const isMobileMenuOpen = ref(false);
const isUserMenuOpen = ref(false);
const isNotificationOpen = ref(false);
const isProfileCenterOpen = ref(false);
const hasNotifications = ref(true);
const userMenuRef = ref<HTMLElement | null>(null);

const user = ref({
  username: "又是一年冬",
  email: "zhangsan@example.com",
  isVip: true,
});

const notifications = ref([
  {
    id: 1,
    type: "success",
    icon: "check",
    title: "系统更新",
    message: "新版本已发布，包含多项功能优化",
    time: "5分钟前",
    read: false,
  },
  {
    id: 2,
    type: "info",
    icon: "circle-info",
    title: "新资源推荐",
    message: "发现3个符合你兴趣的优质资源",
    time: "1小时前",
    read: false,
  },
  {
    id: 3,
    type: "warning",
    icon: "star",
    title: "VIP会员提醒",
    message: "您的会员将在7天后到期",
    time: "昨天",
    read: true,
  },
]);

const navItems = [
  { name: "首页", href: "/", isRoute: true, icon: "home" },
  { name: "资源", href: "#resources", isRoute: false, icon: "book" },
  { name: "关于", href: "#about", isRoute: false, icon: "circle-info" },
];

const goHome = () => router.push("/");

const handleNavClick = (item: (typeof navItems)[0]) => {
  if (item.isRoute) {
    router.push(item.href);
  } else {
    const element = document.querySelector(item.href);
    if (element) element.scrollIntoView({ behavior: "smooth" });
  }
};

const handleNavClickMobile = (item: (typeof navItems)[0]) => {
  isMobileMenuOpen.value = false;
  handleNavClick(item);
};

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
  if (isMobileMenuOpen.value) {
    isUserMenuOpen.value = false;
    isNotificationOpen.value = false;
    isProfileCenterOpen.value = false;
  }
};

const toggleUserMenu = () => {
  isUserMenuOpen.value = !isUserMenuOpen.value;
  if (isUserMenuOpen.value) {
    isNotificationOpen.value = false;
    isProfileCenterOpen.value = false;
  }
};

const toggleNotifications = () => {
  isNotificationOpen.value = !isNotificationOpen.value;
  if (isNotificationOpen.value) {
    isUserMenuOpen.value = false;
    isProfileCenterOpen.value = false;
  }
};

const openProfileCenter = () => {
  isProfileCenterOpen.value = true;
  isUserMenuOpen.value = false;
  isNotificationOpen.value = false;
};

const handleMarkAllRead = () => {
  hasNotifications.value = false;
};

const toggleTheme = () => {
  themeStore.toggle();
};

// 点击外部关闭用户菜单
const handleClickOutside = (event: MouseEvent) => {
  if (userMenuRef.value && !userMenuRef.value.contains(event.target as Node)) {
    isUserMenuOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<style scoped>
/* 导航图标悬停颜色 - 整行悬停时图标变色 */
.group:hover .nav-icon {
  color: var(--primary) !important;
}

html.dark .group:hover .nav-icon {
  color: var(--primary-soft) !important;
}

.menu-icon {
  transition: color 0.2s;
}

.group:hover .menu-icon {
  color: var(--primary) !important;
}

html.dark .group:hover .menu-icon {
  color: var(--primary-soft) !important;
}

/* VIP 会员昵称流光动画 - 粉紫色高级感 */
.vip-shimmer {
  position: relative;
  background: linear-gradient(90deg,
      #ec4899 0%,
      #a855f7 25%,
      #d946ef 50%,
      #a855f7 75%,
      #ec4899 100%);
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
.vip-crown-badge-mobile {
  position: absolute;
  top: -1px;
  right: -1px;
  width: 14px;
  height: 14px;
  background: linear-gradient(135deg, #ffd700 0%, #ffed4e 50%, #f4c430 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1.5px solid transparent;
  background-clip: padding-box;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.15),
    inset 0 1px 1px rgba(255, 255, 255, 0.7);
  color: #8b6914;
  z-index: 10;
}

.vip-crown-badge-mobile::before {
  content: "";
  position: absolute;
  inset: -1.5px;
  border-radius: 50%;
  padding: 1.5px;
  background: linear-gradient(90deg,
      #ffd700 0%,
      #fff 25%,
      #ffd700 50%,
      #fff 75%,
      #ffd700 100%);
  background-size: 200% 100%;
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  animation: borderShimmer 2s linear infinite;
}

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
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15),
    inset 0 1px 2px rgba(255, 255, 255, 0.7);
  color: #8b6914;
  z-index: 10;
}

.vip-crown-badge::before {
  content: "";
  position: absolute;
  inset: -2px;
  border-radius: 50%;
  padding: 2px;
  background: linear-gradient(90deg,
      #ffd700 0%,
      #fff 25%,
      #ffd700 50%,
      #fff 75%,
      #ffd700 100%);
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
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.15),
    inset 0 1px 2px rgba(255, 255, 255, 0.7);
  color: #8b6914;
  z-index: 10;
}

.vip-crown-badge-large::before {
  content: "";
  position: absolute;
  inset: -2.5px;
  border-radius: 50%;
  padding: 2.5px;
  background: linear-gradient(90deg,
      #ffd700 0%,
      #fff 25%,
      #ffd700 50%,
      #fff 75%,
      #ffd700 100%);
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

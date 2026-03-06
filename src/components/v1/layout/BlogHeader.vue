<template>
  <header
    class="fixed top-0 left-0 right-0 z-50 transition-colors duration-300"
    :class="
      isDark ? 'bg-[#0F172A] border-gray-800' : 'bg-white border-gray-200'
    "
    style="border-bottom-width: 1px"
  >
    <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center gap-6 h-16">
        <!-- Logo -->
        <div
          class="flex items-center gap-3 px-3 py-2 rounded-xl cursor-pointer group transition-all"
          :class="isDark ? 'hover:bg-gray-800/40' : 'hover:bg-gray-50'"
          @click="goHome"
        >
          <div
            class="relative w-10 h-10 rounded-xl flex items-center justify-center transition-all group-hover:scale-105"
            :class="
              isDark
                ? 'bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/20'
                : 'bg-gradient-to-br from-blue-500 to-blue-600 shadow-md'
            "
          >
            <div
              class="absolute inset-0 rounded-xl bg-gradient-to-br from-white/20 to-transparent"
            ></div>
            <font-awesome-icon
              icon="book"
              class="relative text-white text-lg"
            />
          </div>
          <div class="flex flex-col">
            <span
              class="text-base font-bold tracking-tight transition-colors leading-tight"
              :class="isDark ? 'text-white' : 'text-gray-900'"
              >博客资源</span
            >
            <span
              class="text-[10px] font-semibold tracking-wider uppercase transition-colors leading-tight"
              :class="isDark ? 'text-gray-500' : 'text-gray-400'"
              >Resource Hub</span
            >
          </div>
        </div>

        <!-- Desktop Nav -->
        <div
          class="hidden md:flex items-center gap-1 px-2 py-1.5 rounded-xl transition-all"
          :class="
            isDark
              ? 'bg-gray-800/40 border border-gray-700/50'
              : 'bg-gray-50 border border-gray-200/50'
          "
        >
          <a
            v-for="item in navItems"
            :key="item.name"
            :href="item.href"
            class="group relative flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all cursor-pointer"
            :class="
              isDark
                ? 'text-gray-300 hover:text-white hover:bg-gray-700/60'
                : 'text-gray-700 hover:text-gray-900 hover:bg-white hover:shadow-sm'
            "
            @click.prevent="handleNavClick(item)"
          >
            <div
              class="p-1 rounded-md transition-all"
              :class="
                isDark
                  ? 'bg-gray-700/50 group-hover:bg-blue-500/20'
                  : 'bg-white group-hover:bg-blue-50'
              "
            >
              <font-awesome-icon
                :icon="item.icon"
                class="w-4 h-4 transition-all group-hover:scale-110"
                :class="
                  isDark
                    ? 'group-hover:text-blue-400'
                    : 'group-hover:text-blue-600'
                "
              />
            </div>
            <span>{{ item.name }}</span>
            <span
              class="absolute bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 rounded-full transition-all duration-300 group-hover:w-8"
              :class="isDark ? 'bg-blue-400' : 'bg-blue-600'"
            ></span>
          </a>
        </div>

        <!-- Spacer -->
        <div class="flex-1"></div>

        <!-- Actions -->
        <div class="flex items-center gap-2">
          <!-- Action Buttons -->
          <div class="flex items-center gap-1">
            <button
              class="p-2.5 rounded-lg transition-all cursor-pointer"
              :class="
                isDark
                  ? 'text-gray-400 hover:text-white hover:bg-gray-800/60'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              "
              @click="openSearch"
              title="搜索"
            >
              <font-awesome-icon icon="search" class="text-base" />
            </button>

            <button
              class="hidden sm:block p-2.5 rounded-lg transition-all cursor-pointer"
              :class="
                isDark
                  ? 'text-gray-400 hover:text-white hover:bg-gray-800/60'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              "
              @click="toggleTheme"
              title="切换主题"
            >
              <font-awesome-icon
                :icon="isDark ? 'sun' : 'moon'"
                class="text-base"
              />
            </button>

            <button
              class="hidden sm:block relative p-2.5 rounded-lg transition-all cursor-pointer"
              :class="
                isDark
                  ? 'text-gray-400 hover:text-white hover:bg-gray-800/60'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              "
              @click="openNotifications"
              title="通知"
            >
              <font-awesome-icon icon="bell" class="text-base" />
              <span
                v-if="hasNotifications"
                class="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 animate-pulse"
                :class="isDark ? 'ring-[#0F172A]' : 'ring-white'"
              ></span>
            </button>
          </div>

          <!-- Divider -->
          <div
            class="hidden sm:block w-px h-6 mx-1"
            :class="isDark ? 'bg-gray-700' : 'bg-gray-300'"
          ></div>

          <!-- User -->
          <div class="hidden sm:block relative">
            <button
              class="flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all cursor-pointer"
              :class="
                isDark
                  ? 'bg-gray-800/60 hover:bg-gray-800'
                  : 'bg-gray-100 hover:bg-gray-200'
              "
              @click="toggleUserMenu"
            >
              <div
                class="w-7 h-7 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center"
              >
                <span class="text-xs font-semibold text-white">{{
                  user?.username?.charAt(0) || "U"
                }}</span>
              </div>
              <span
                class="text-sm font-medium transition-colors"
                :class="isDark ? 'text-gray-200' : 'text-gray-700'"
                >{{ user?.username || "用户" }}</span
              >
              <font-awesome-icon
                icon="chevron-down"
                class="text-xs"
                :class="isDark ? 'text-gray-400' : 'text-gray-500'"
              />
            </button>

            <transition
              enter-active-class="transition duration-200 ease-out"
              enter-from-class="opacity-0 scale-95 -translate-y-2"
              enter-to-class="opacity-100 scale-100 translate-y-0"
              leave-active-class="transition duration-100 ease-in"
              leave-from-class="opacity-100 scale-100 translate-y-0"
              leave-to-class="opacity-0 scale-95 -translate-y-2"
            >
              <div
                v-if="isUserMenuOpen"
                class="absolute right-0 mt-2 w-64 rounded-xl shadow-2xl py-2 overflow-hidden"
                :class="
                  isDark
                    ? 'bg-gray-800 border border-gray-700'
                    : 'bg-white border border-gray-200'
                "
              >
                <div
                  class="px-4 py-3"
                  :class="isDark ? 'bg-gray-900/50' : 'bg-gray-50'"
                >
                  <div class="flex items-center gap-3">
                    <div
                      class="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center"
                    >
                      <span class="text-base font-semibold text-white">{{
                        user?.username?.charAt(0) || "U"
                      }}</span>
                    </div>
                    <div>
                      <p
                        class="text-sm font-semibold"
                        :class="isDark ? 'text-white' : 'text-gray-900'"
                      >
                        {{ user?.username || "用户" }}
                      </p>
                      <p
                        class="text-xs mt-0.5"
                        :class="isDark ? 'text-gray-400' : 'text-gray-500'"
                      >
                        {{ user?.email || "user@example.com" }}
                      </p>
                    </div>
                  </div>
                </div>
                <div class="py-1">
                  <a
                    href="#"
                    class="flex items-center gap-3 px-4 py-2.5 text-sm transition-colors cursor-pointer"
                    :class="
                      isDark
                        ? 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                        : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                    "
                  >
                    <font-awesome-icon icon="user" class="w-4" />
                    个人资料
                  </a>
                  <a
                    href="#"
                    class="flex items-center gap-3 px-4 py-2.5 text-sm transition-colors cursor-pointer"
                    :class="
                      isDark
                        ? 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                        : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                    "
                  >
                    <font-awesome-icon icon="cog" class="w-4" />
                    设置
                  </a>
                </div>
                <div
                  class="mt-1 pt-1"
                  :class="
                    isDark
                      ? 'border-t border-gray-700'
                      : 'border-t border-gray-200'
                  "
                >
                  <a
                    href="#"
                    class="flex items-center gap-3 px-4 py-2.5 text-sm transition-colors cursor-pointer"
                    :class="
                      isDark
                        ? 'text-red-400 hover:text-red-300 hover:bg-red-500/10'
                        : 'text-red-600 hover:text-red-700 hover:bg-red-50'
                    "
                  >
                    <font-awesome-icon icon="arrow-right" class="w-4" />
                    退出登录
                  </a>
                </div>
              </div>
            </transition>
          </div>

          <!-- Mobile Menu -->
          <button
            class="md:hidden p-2.5 rounded-lg transition-all cursor-pointer"
            :class="
              isDark
                ? 'text-gray-400 hover:text-white hover:bg-gray-800/60'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            "
            @click="toggleMobileMenu"
          >
            <font-awesome-icon
              :icon="isMobileMenuOpen ? 'xmark' : 'bars'"
              class="text-base"
            />
          </button>
        </div>
      </div>
    </nav>

    <!-- Mobile Menu -->
    <transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div
        v-if="isMobileMenuOpen"
        class="md:hidden transition-colors"
        :class="
          isDark ? 'bg-gray-900 border-gray-800' : 'bg-gray-50 border-gray-200'
        "
        style="border-top-width: 1px"
      >
        <div class="px-4 py-3 space-y-1">
          <a
            v-for="item in navItems"
            :key="item.name"
            :href="item.href"
            class="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all cursor-pointer"
            :class="
              isDark
                ? 'text-gray-300 hover:text-white hover:bg-gray-800/60'
                : 'text-gray-700 hover:text-gray-900 hover:bg-white'
            "
            @click.prevent="handleNavClickMobile(item)"
          >
            <font-awesome-icon :icon="item.icon" class="w-4" />
            {{ item.name }}
          </a>
          <div
            class="pt-3"
            :class="
              isDark ? 'border-t border-gray-800' : 'border-t border-gray-200'
            "
          >
            <div
              class="flex items-center gap-3 px-4 py-3 rounded-lg"
              :class="isDark ? 'bg-gray-800/60' : 'bg-white'"
            >
              <div
                class="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center"
              >
                <span class="text-sm font-semibold text-white">{{
                  user?.username?.charAt(0) || "U"
                }}</span>
              </div>
              <div>
                <p
                  class="text-sm font-semibold"
                  :class="isDark ? 'text-white' : 'text-gray-900'"
                >
                  {{ user?.username || "用户" }}
                </p>
                <p
                  class="text-xs"
                  :class="isDark ? 'text-gray-400' : 'text-gray-500'"
                >
                  {{ user?.email || "user@example.com" }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </header>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const isMobileMenuOpen = ref(false);
const isUserMenuOpen = ref(false);
const hasNotifications = ref(true);
const isDark = ref(false);

const user = ref({
  username: "张三",
  email: "zhangsan@example.com",
  avatar: "",
});

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
  if (isMobileMenuOpen.value) isUserMenuOpen.value = false;
};

const toggleUserMenu = () => {
  isUserMenuOpen.value = !isUserMenuOpen.value;
};

const toggleTheme = () => {
  isDark.value = !isDark.value;
};

const openSearch = () => {
  console.log("Open search");
};

const openNotifications = () => {
  console.log("Open notifications");
};
</script>

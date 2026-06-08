<template>
  <header
    class="blog-header-flat"
    :class="{
      'dark-mode': isDark
    }"
  >
    <div class="header-container">
      <!-- Left Column Group (Logo + Nav links unified) -->
      <div class="left-group">
        <!-- Brand Logo -->
        <div class="logo-wrapper" @click="goHome">
          <div class="logo-badge">
            <font-awesome-icon icon="book" class="logo-icon" />
          </div>
          <span class="logo-text">
            博客资源<span class="logo-period">.</span>
          </span>
        </div>

        <!-- Vertical Divider inside left group -->
        <div class="left-divider"></div>

        <!-- Navigation links -->
        <nav class="nav-links-wrapper">
          <a
            v-for="(item, index) in navItems"
            :key="item.name"
            :href="item.href"
            :ref="(el) => setNavRef(el, index)"
            class="nav-link-item"
            :class="{ active: isNavItemActive(item) }"
            @click.prevent="handleNavClick(item)"
          >
            <font-awesome-icon :icon="item.icon" class="link-icon" />
            <span class="link-label">{{ item.name }}</span>
          </a>
          <!-- The sliding active capsule -->
          <div class="nav-active-capsule" :style="navUnderlineStyle"></div>
        </nav>
      </div>

      <!-- Right Column Group (Cohesive elements without nested capsule borders) -->
      <div class="right-actions-group">
        <!-- Theme Toggle Button -->
        <button
          class="action-circle-btn theme-btn"
          @click="toggleTheme"
          aria-label="切换主题"
        >
          <font-awesome-icon :icon="isDark ? 'sun' : 'moon'" class="action-icon theme-icon" />
        </button>

        <!-- Notifications Bell Button -->
        <button
          class="action-circle-btn bell-btn"
          @click="toggleNotifications"
          aria-label="查看通知"
        >
          <font-awesome-icon icon="bell" class="action-icon bell-icon" />
          <span
            v-if="hasNotifications"
            class="badge-pill"
          >3</span>
        </button>

        <!-- Vertical Divider Line -->
        <div class="vertical-divider"></div>

        <!-- User Profile Center Dropdown -->
        <div v-if="userStore.isLoggedIn" class="user-profile-wrapper" ref="userMenuRef">
          <button
            class="user-profile-btn"
            @click="toggleUserMenu"
            :class="{ 'menu-open': isUserMenuOpen }"
          >
            <div class="avatar-ring">
              <img
                :src="userStore.avatar || 'https://img2.woyaogexing.com/2025/04/05/2d3c285633cc350b263ae66888c525ed.jpg'"
                alt="头像"
                class="avatar-img"
              />
            </div>
            <span
              class="username-label"
              :class="userStore.isVip ? 'vip-shimmer' : ''"
            >
              {{ userStore.username }}
            </span>
            <font-awesome-icon
              icon="chevron-down"
              class="chevron-icon"
              :class="{ 'rotate-180': isUserMenuOpen }"
            />
          </button>

          <!-- User Menu Dropdown Card -->
          <transition name="dropdown-fade">
            <div
              v-if="isUserMenuOpen"
              class="user-dropdown-card"
            >
              <!-- Dropdown profile summary -->
              <div class="user-card-header">
                <p
                  class="header-name"
                  :class="userStore.isVip ? 'vip-shimmer' : ''"
                >
                  {{ userStore.username }}
                </p>
                <p class="header-email">
                  {{ userStore.email || "user@example.com" }}
                </p>
              </div>

              <!-- Options link list -->
              <div class="dropdown-links">
                <a
                  href="#"
                  class="dropdown-link-item"
                  @click.prevent="openProfileCenter"
                >
                  <font-awesome-icon icon="user" class="item-icon" />
                  <span>个人资料</span>
                  <span v-if="userStore.isVip" class="vip-badge">VIP</span>
                  <span class="shortcut-key">⌘P</span>
                </a>
                
                <a href="#" class="dropdown-link-item">
                  <font-awesome-icon icon="cog" class="item-icon" />
                  <span>账号设置</span>
                  <span class="shortcut-key">⌘,</span>
                </a>

                <!-- Mobile integrated items inside list -->
                <a
                  href="#"
                  class="dropdown-link-item mobile-only-item"
                  @click.prevent="toggleTheme"
                >
                  <font-awesome-icon :icon="isDark ? 'sun' : 'moon'" class="item-icon" />
                  <span>{{ isDark ? "浅色模式" : "深色模式" }}</span>
                  <span class="shortcut-key">⌘T</span>
                </a>
                <a
                  href="#"
                  class="dropdown-link-item mobile-only-item"
                  @click.prevent="toggleNotifications"
                >
                  <font-awesome-icon icon="bell" class="item-icon" />
                  <span>通知中心</span>
                  <span class="shortcut-key">⌘N</span>
                </a>
              </div>

              <!-- Sign out link container -->
              <div class="dropdown-footer">
                <a
                  href="#"
                  class="logout-link"
                  @click.prevent="handleLogout"
                >
                  <font-awesome-icon icon="arrow-right" class="logout-icon" />
                  <span>退出登录</span>
                  <span class="shortcut-key">⌥⇧Q</span>
                </a>
              </div>
            </div>
          </transition>
        </div>

        <!-- Login & Register modern split buttons -->
        <div v-else class="login-action-container">
          <button
            @click="openLoginModal('login')"
            class="login-link-btn"
          >
            登录
          </button>
          <button
            @click="openLoginModal('register')"
            class="register-cta-btn"
          >
            注册
          </button>
        </div>

        <!-- Mobile Menu hamburger icon button -->
        <button
          class="mobile-hamburger-btn"
          @click="toggleMobileMenu"
          aria-label="导航菜单"
        >
          <font-awesome-icon :icon="isMobileMenuOpen ? 'xmark' : 'bars'" class="hamburger-icon" />
        </button>
      </div>
    </div>

    <!-- Mobile Drawer panel -->
    <transition name="drawer-fade">
      <div
        v-if="isMobileMenuOpen"
        class="mobile-drawer-panel"
      >
        <div class="drawer-links-container">
          <a
            v-for="item in navItems"
            :key="item.name"
            :href="item.href"
            class="drawer-link-item"
            :class="{ active: isNavItemActive(item) }"
            @click.prevent="handleNavClickMobile(item)"
          >
            <font-awesome-icon :icon="item.icon" class="drawer-icon" />
            <span>{{ item.name }}</span>
          </a>

          <!-- Mobile user panel details -->
          <div
            v-if="userStore.isLoggedIn"
            class="drawer-user-info-section"
          >
            <div class="drawer-user-card">
              <img
                :src="userStore.avatar || 'https://img2.woyaogexing.com/2025/04/05/2d3c285633cc350b263ae66888c525ed.jpg'"
                alt="头像"
                class="drawer-avatar"
              />
              <div class="drawer-user-text">
                <p
                  class="drawer-username"
                  :class="userStore.isVip ? 'vip-shimmer' : ''"
                >
                  {{ userStore.username }}
                </p>
                <p class="drawer-email">{{ userStore.email || "user@example.com" }}</p>
              </div>
            </div>
            
            <a
              href="#"
              class="drawer-action-link logout-danger"
              @click.prevent="handleLogout"
            >
              <font-awesome-icon icon="arrow-right" class="drawer-icon" />
              <span>退出登录</span>
            </a>
          </div>

          <!-- Mobile login prompt if logged out -->
          <div v-else class="drawer-login-prompt">
            <button
              class="drawer-login-btn"
              @click="openLoginModal('login'); isMobileMenuOpen = false"
            >
              登录 / 注册
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Overlay Modals -->
    <NotificationCenter
      :is-open="isNotificationOpen"
      :is-dark="isDark"
      @close="isNotificationOpen = false"
      @mark-all-read="handleMarkAllRead"
    />
    <ProfileCenter
      :is-open="isProfileCenterOpen"
      :is-dark="isDark"
      @close="isProfileCenterOpen = false"
    />
    <LoginModal
      :is-open="isLoginModalOpen"
      :is-dark="isDark"
      :initial-mode="loginModalMode"
      @close="isLoginModalOpen = false"
      @login-success="handleLoginSuccess"
    />
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch, nextTick } from "vue";
import { useRouter, useRoute } from "vue-router";
import { message, Modal } from "ant-design-vue";
import NotificationCenter from "./NotificationCenter.vue";
import ProfileCenter from "./ProfileCenter.vue";
import LoginModal from "../auth/LoginModal.vue";
import { useThemeStore } from "@/stores/theme";
import { useUserStore } from "@/stores/user";

const router = useRouter();
const route = useRoute();
const themeStore = useThemeStore();
const userStore = useUserStore();
const isDark = computed(() => themeStore.isDark);
const isMobileMenuOpen = ref(false);
const isUserMenuOpen = ref(false);
const isNotificationOpen = ref(false);
const isProfileCenterOpen = ref(false);
const isLoginModalOpen = ref(false);
const loginModalMode = ref<'login' | 'register'>('login');

const openLoginModal = (mode: 'login' | 'register') => {
  loginModalMode.value = mode;
  isLoginModalOpen.value = true;
};

const hasNotifications = ref(true);
const userMenuRef = ref<HTMLElement | null>(null);

const handleLoginSuccess = () => {
  // Login success trigger
};

const navItems = [
  { name: "首页", href: "/", isRoute: true, icon: "home" },
  { name: "资源", href: "/#resources", isRoute: true, icon: "book" },
  { name: "商城", href: "/shop", isRoute: true, icon: "shop" },
  { name: "赞助", href: "/donation", isRoute: true, icon: "heart" },
  { name: "关于", href: "/about", isRoute: true, icon: "circle-info" },
];

const goHome = () => router.push("/");

/** Check if route / hash is currently active */
const isNavItemActive = (item: (typeof navItems)[0]) => {
  if (!item.isRoute) return false;
  const currentPath = router.currentRoute.value.path;
  const currentHash = router.currentRoute.value.hash;
  const [itemPath, itemHash] = item.href.split("#");

  if (itemHash) {
    return currentPath === itemPath && currentHash === `#${itemHash}`;
  }

  if (currentPath === "/") {
    if (currentHash) {
      const hashMatched = navItems.some(
        (other) =>
          other !== item &&
          other.href.split("#")[1] === currentHash.slice(1) &&
          other.href.split("#")[0] === currentPath
      );
      if (hashMatched) return false;
    }
    return currentPath === itemPath;
  }

  return currentPath.startsWith(itemPath);
};

// ── Active Underline Animation Logic ──
const navRefs = ref<HTMLElement[]>([]);
const navUnderlineStyle = ref({ transform: "translateX(0px)", width: "0px", opacity: 0 });

const setNavRef = (el: any, index: number) => {
  if (el) navRefs.value[index] = el;
};

const updateNavUnderline = () => {
  nextTick(() => {
    const activeIndex = navItems.findIndex(isNavItemActive);
    if (activeIndex !== -1) {
      const el = navRefs.value[activeIndex];
      if (el) {
        navUnderlineStyle.value = {
          opacity: 1,
          transform: `translateX(${el.offsetLeft}px)`,
          width: `${el.offsetWidth}px`,
        };
      }
    } else {
      navUnderlineStyle.value = {
        opacity: 0,
        transform: "translateX(0px)",
        width: "0px",
      };
    }
  });
};

const handleNavClick = (item: (typeof navItems)[0]) => {
  const [path, hash] = item.href.split("#");
  if (item.isRoute) {
    const currentPath = router.currentRoute.value.path;
    const currentHash = router.currentRoute.value.hash;

    if (hash) {
      if (currentPath === path && currentHash === `#${hash}`) {
        const element = document.getElementById(hash);
        if (element) element.scrollIntoView({ behavior: "smooth" });
      } else {
        router.push(item.href);
      }
    } else {
      if (currentPath !== path || currentHash) {
        router.push(path);
      }
    }
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

const handleLogout = async () => {
  isUserMenuOpen.value = false;
  Modal.confirm({
    title: "退出登录",
    content: "确定要退出当前账号吗？",
    okText: "确定退出",
    cancelText: "再想想",
    okButtonProps: { danger: true },
    onOk: async () => {
      try {
        await userStore.logout();
        message.success("已退出登录");
      } catch {
        message.error("退出登录失败");
      }
    },
  });
};

const toggleTheme = () => {
  themeStore.toggle();
};

const handleClickOutside = (event: MouseEvent) => {
  if (userMenuRef.value && !userMenuRef.value.contains(event.target as Node)) {
    isUserMenuOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
  window.addEventListener("resize", updateNavUnderline);
  updateNavUnderline();
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
  window.removeEventListener("resize", updateNavUnderline);
});

// Watch route path and hash to slide the active underline
watch(
  () => [route.path, route.hash],
  () => {
    updateNavUnderline();
  }
);
</script>

<style scoped lang="scss">
/* ==========================================================================
   1. Flat Solid Sticky Layout
   ========================================================================== */
.blog-header-flat {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  z-index: 50;
  height: 64px;
  width: 100%;
  display: flex;
  align-items: center;
  box-sizing: border-box;

  background-color: var(--bg-secondary, #ffffff);
  border-bottom: 1px solid var(--border-light, #f3f4f6);
  transition: background-color 0.25s, border-color 0.25s;
  
  &.dark-mode {
    background-color: var(--bg, #0f172a);
    border-bottom: 1px solid var(--border-light, #1e293b);
    
    .vertical-divider {
      background-color: var(--border, #334155);
    }
  }
}

.header-container {
  width: 100%;
  max-width: 1320px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  box-sizing: border-box;
}

/* ==========================================================================
   2. Group Alignments (SaaS Layout)
   ========================================================================== */
.left-group {
  display: flex;
  align-items: center;
  gap: 20px;
  height: 100%;
}

.left-divider {
  display: none;
  width: 1px;
  height: 16px;
  background-color: var(--border-light, #f3f4f6);
  flex-shrink: 0;
  
  @media (min-width: 820px) {
    display: block;
  }
  
  .blog-header-flat.dark-mode & {
    background-color: var(--border-light, #1e293b);
  }
}

/* ==========================================================================
   3. Logo Branding
   ========================================================================== */
.logo-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  user-select: none;
  flex-shrink: 0;
  
  &:hover {
    .logo-badge {
      border-radius: 10px;
      transform: translateY(-0.5px);
      background-color: var(--primary-hover, #2563eb);
      
      .logo-icon {
        transform: rotate(-10deg) scale(1.08);
      }
    }
  }
}

.logo-badge {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background-color: var(--primary, #3b82f6);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  transition: all 0.25s cubic-bezier(0.2, 0.8, 0.2, 1);
  box-sizing: border-box;
  border: 1px solid rgba(255, 255, 255, 0.15);
  
  .logo-icon {
    font-size: 12px;
    transition: transform 0.3s ease;
  }
}

.logo-text {
  font-size: 15px;
  font-weight: 700;
  color: var(--text, #1f2937);
  transition: color 0.2s;
}

.logo-period {
  color: var(--primary, #3b82f6);
}

/* ==========================================================================
   4. Segmented Control Navigation Capsule
   ========================================================================== */
.nav-links-wrapper {
  display: none; /* Hidden on mobile */
  position: relative;
  align-items: center;
  gap: 2px;
  height: 36px;
  background-color: var(--border-light, #f3f4f6);
  padding: 3px;
  border-radius: 99px;
  box-sizing: border-box;
  
  @media (min-width: 820px) {
    display: flex;
  }
}

/* Active sliding background block */
.nav-active-capsule {
  position: absolute;
  top: 3px;
  bottom: 3px;
  left: 0;
  border-radius: 99px;
  background-color: var(--bg-secondary, #ffffff);
  box-shadow: var(--shadow-xs, 0 1px 2px rgba(0, 0, 0, 0.05));
  transition: transform 0.25s cubic-bezier(0.25, 1, 0.5, 1), width 0.25s cubic-bezier(0.25, 1, 0.5, 1);
  opacity: 0;
  z-index: 5;
  box-sizing: border-box;
  
  .blog-header-flat.dark-mode & {
    background-color: var(--bg, #0f172a);
    box-shadow: none;
    border: 1px solid var(--border, #334155);
  }
}

.nav-link-item {
  position: relative;
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 6px;
  height: 100%;
  padding: 0 16px;
  border-radius: 99px;
  font-size: 12.5px;
  font-weight: 600;
  color: var(--text-secondary, #6b7280);
  text-decoration: none;
  cursor: pointer;
  user-select: none;
  transition: color 0.2s ease, background-color 0.2s ease;
  box-sizing: border-box;
  
  .link-icon {
    font-size: 11px;
    opacity: 0.7;
  }
  
  &:hover:not(.active) {
    color: var(--text, #1f2937);
    background-color: rgba(0, 0, 0, 0.035);
    
    .blog-header-flat.dark-mode & {
      background-color: rgba(255, 255, 255, 0.045);
    }
  }

  &.active {
    color: var(--primary, #3b82f6);
    font-weight: 700;
  }
}

/* ==========================================================================
   5. Right Utility Icons & Actions
   ========================================================================== */
.right-actions-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* Circular Borderless Action Button */
.action-circle-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  background: transparent;
  color: var(--text-secondary, #6b7280);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
  transition: background-color 0.2s, color 0.2s;
  outline: none;
  
  .action-icon {
    font-size: 14px;
    transition: color 0.2s ease;
  }
  
  &:hover {
    background-color: var(--surface-hover, #f9fafb);
    color: var(--text, #1f2937);
  }
  
  /* Icon colors on hover */
  &.theme-btn:hover {
    .theme-icon {
      color: var(--warning, #f59e0b);
    }
  }
  
  &.bell-btn:hover {
    .bell-icon {
      color: var(--primary, #3b82f6);
    }
  }
}

/* Red Dot notification badge pill */
.badge-pill {
  position: absolute;
  top: -1px;
  right: -1px;
  background-color: var(--error, #ef4444);
  color: #ffffff;
  font-size: 8px;
  font-weight: 700;
  line-height: 1;
  padding: 1.5px 4px;
  border-radius: 99px;
  transform: scale(0.85);
  box-shadow: 0 0 0 1.5px var(--bg-secondary, #ffffff);
  
  .blog-header-flat.dark-mode & {
    box-shadow: 0 0 0 1.5px var(--bg, #0f172a);
  }
}

.vertical-divider {
  width: 1px;
  height: 14px;
  background-color: var(--border, #e5e7eb);
  flex-shrink: 0;
  margin: 0 4px;
  
  .blog-header-flat.dark-mode & {
    background-color: var(--border-light, #1e293b);
  }
}

/* ==========================================================================
   6. User Account Center Dropdown (Flat Card)
   ========================================================================== */
.user-profile-wrapper {
  position: relative;
}

.user-profile-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  border: none;
  background: transparent;
  cursor: pointer;
  padding: 4px 6px;
  border-radius: 6px;
  transition: background-color 0.2s ease;
  outline: none;
  
  &:hover, &.menu-open {
    background-color: var(--surface-hover, #f9fafb);
  }
}

.avatar-ring {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  
  .avatar-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.username-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--text, #1f2937);
  max-width: 80px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  transition: color 0.2s;
}

.chevron-icon {
  font-size: 8px;
  color: var(--text-tertiary, #9ca3af);
  transition: transform 0.2s ease;
}

/* User dropdown floating card style */
.user-dropdown-card {
  position: absolute;
  right: 0;
  top: calc(100% + 6px);
  width: 220px;
  border-radius: var(--radius, 8px);
  overflow: hidden;
  z-index: 100;
  
  border: 1px solid var(--border, #e5e7eb);
  background-color: var(--bg-secondary, #ffffff);
  box-shadow: var(--shadow, 0 4px 6px rgba(0, 0, 0, 0.07));
  box-sizing: border-box;
}

.user-card-header {
  padding: 12px 16px;
  border-bottom: 1px solid var(--border, #e5e7eb);
  
  .header-name {
    font-size: 13.5px;
    font-weight: 700;
    color: var(--text, #1f2937);
    margin: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  
  .header-email {
    font-size: 11px;
    color: var(--text-secondary, #6b7280);
    margin: 2px 0 0 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.dropdown-links {
  padding: 4px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.dropdown-link-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  border-radius: var(--radius-sm, 6px);
  font-size: 13px;
  font-weight: 500;
  color: var(--text, #1f2937);
  text-decoration: none;
  transition: background-color 0.2s, color 0.2s;
  box-sizing: border-box;
  
  .item-icon {
    font-size: 11px;
    color: var(--text-tertiary, #9ca3af);
    width: 12px;
    text-align: center;
    opacity: 0.8;
  }
  
  .vip-badge {
    margin-left: auto;
    font-size: 9px;
    font-weight: 700;
    padding: 1px 4px;
    border-radius: 3px;
    background: var(--warning-light, #fef3c7);
    color: var(--warning, #f59e0b);
  }
  
  .shortcut-key {
    margin-left: auto;
    font-size: 9.5px;
    color: var(--text-tertiary, #9ca3af);
    background-color: var(--surface-hover, #f9fafb);
    padding: 1px 4px;
    border-radius: 4px;
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    font-weight: 500;
  }
  
  .vip-badge + .shortcut-key {
    margin-left: 6px;
  }
  
  &:hover {
    background-color: var(--surface-hover, #f9fafb);
    
    .item-icon {
      color: var(--primary, #3b82f6);
    }
  }
}

.dropdown-footer {
  padding: 4px;
  border-top: 1px solid var(--border, #e5e7eb);
  
  .logout-link {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 6px 12px;
    border-radius: var(--radius-sm, 6px);
    font-size: 13px;
    font-weight: 600;
    color: var(--error, #ef4444);
    text-decoration: none;
    transition: background-color 0.2s;
    box-sizing: border-box;
    
    .logout-icon {
      font-size: 11px;
    }
    
    .shortcut-key {
      margin-left: auto;
      font-size: 9.5px;
      color: var(--error, #ef4444);
      background-color: var(--error-light, #fee2e2);
      padding: 1px 4px;
      border-radius: 4px;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-weight: 500;
    }
    
    &:hover {
      background-color: var(--error-light, #fee2e2);
    }
  }
}

/* Transition animation for dropdown */
.dropdown-fade-enter-active, .dropdown-fade-leave-active {
  transition: opacity 0.15s ease;
}
.dropdown-fade-enter-from, .dropdown-fade-leave-to {
  opacity: 0;
}

/* ==========================================================================
   7. Split Login & Register Buttons (SaaS Style)
   ========================================================================== */
.login-action-container {
  display: flex;
  align-items: center;
  gap: 8px;
}

.login-link-btn {
  border: none;
  background: transparent;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  color: var(--text-secondary, #6b7280);
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s;
  outline: none;
  
  &:hover {
    color: var(--text, #1f2937);
    background-color: var(--surface-hover, #f9fafb);
  }
}

.register-cta-btn {
  border: none;
  padding: 6px 16px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 700;
  color: #ffffff;
  cursor: pointer;
  background-color: var(--primary, #3b82f6);
  transition: background-color 0.2s, transform 0.1s, box-shadow 0.2s;
  box-shadow: 0 1px 2px rgba(59, 130, 246, 0.1);
  outline: none;
  
  &:hover {
    background-color: var(--primary-hover, #2563eb);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);
  }
  
  &:active {
    transform: scale(0.97);
  }
}

/* ==========================================================================
   8. Mobile Menu Hamburger Button & Drawer Panel
   ========================================================================== */
.mobile-hamburger-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: 6px;
  border: none;
  background: transparent;
  color: var(--text-secondary, #6b7280);
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s;
  
  .hamburger-icon {
    font-size: 15px;
  }
  
  &:hover {
    background-color: var(--surface-hover, #f9fafb);
    color: var(--text, #1f2937);
  }

  @media (min-width: 820px) {
    display: none;
  }
}

/* Mobile Drawer Dropdown Panel */
.mobile-drawer-panel {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  max-height: calc(100vh - 64px);
  overflow-y: auto;
  box-sizing: border-box;
  
  border-bottom: 1px solid var(--border, #e5e7eb);
  background-color: var(--bg-secondary, #ffffff);
  
  @media (min-width: 820px) {
    display: none;
  }
}

.drawer-links-container {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.drawer-link-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-secondary, #6b7280);
  text-decoration: none;
  transition: background-color 0.2s, color 0.2s;
  
  .drawer-icon {
    font-size: 13px;
    opacity: 0.7;
  }
  
  &:hover, &.active {
    background-color: var(--surface-hover, #f9fafb);
    color: var(--primary, #3b82f6);
  }
}

.drawer-auth-section {
  padding: 12px 8px;
  margin-top: 8px;
  border-top: 1px solid var(--border, #e5e7eb);
}

.drawer-login-btn {
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 8px;
  background-color: var(--primary, #3b82f6);
  color: #ffffff;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  
  &:hover {
    background-color: var(--primary-hover, #2563eb);
  }
}

.drawer-user-info-section {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid var(--border, #e5e7eb);
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.drawer-user-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 16px;
  background-color: var(--surface-hover, #f9fafb);
  border-radius: 8px;
  
  .drawer-avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    object-fit: cover;
  }
  
  .drawer-user-text {
    min-width: 0;
    flex: 1;
  }
  
  .drawer-username {
    font-size: 13.5px;
    font-weight: 700;
    color: var(--text, #1f2937);
    margin: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  
  .drawer-email {
    font-size: 11px;
    color: var(--text-secondary, #6b7280);
    margin: 1px 0 0 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.drawer-action-link {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  
  &.logout-danger {
    color: var(--error, #ef4444);
    
    &:hover {
      background-color: var(--error-light, #fee2e2);
    }
  }
}

/* Mobile drawer entry transitions */
.drawer-fade-enter-active, .drawer-fade-leave-active {
  transition: opacity 0.2s ease;
}
.drawer-fade-enter-from, .drawer-fade-leave-to {
  opacity: 0;
}

/* ==========================================================================
   9. VIP Member User Name Shimmering (Kept Intact)
   ========================================================================== */
.vip-shimmer {
  background: linear-gradient(
    90deg,
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
</style>

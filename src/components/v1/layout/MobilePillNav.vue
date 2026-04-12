<template>
  <div class="mobile-pill-nav-container" v-if="isMobile">
    <nav class="pill-nav" :class="{ 'dark-mode': isDark }">
      <!-- Active Background Slider -->
      <div class="active-slider" :style="sliderStyle"></div>
      
      <div
        v-for="item in navItems"
        :key="item.href"
        class="nav-item"
        :class="{ active: isItemActive(item) }"
        @click="handleNav(item)"
        :ref="(el) => setItemRef(el, item.href)"
      >
        <div class="icon-box">
          <font-awesome-icon :icon="item.icon" class="nav-icon" />
        </div>
        <span class="nav-label">{{ item.name }}</span>
      </div>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useThemeStore } from "@/stores/theme";

const router = useRouter();
const route = useRoute();
const themeStore = useThemeStore();
const isDark = computed(() => themeStore.isDark);

const isMobile = ref(false);
const itemRefs = ref<Record<string, HTMLElement>>({});
const sliderStyle = ref({ transform: "translateX(0)", width: "0" });

const navItems = [
  { name: "首页", href: "/", icon: "home" },
  { name: "资源", href: "/#resources", icon: "book" },
  { name: "商城", href: "/shop", icon: "shop" },
  { name: "关于", href: "/about", icon: "circle-info" },
];

const setItemRef = (el: any, href: string) => {
  if (el) itemRefs.value[href] = el;
};

const isItemActive = (item: typeof navItems[0]) => {
  const currentPath = route.path;
  const currentHash = route.hash;
  const [targetPath, targetHash] = item.href.split('#');

  if (targetHash) {
    return currentPath === targetPath && currentHash === `#${targetHash}`;
  }
  return currentPath === targetPath && !currentHash;
};

const handleNav = (item: typeof navItems[0]) => {
  const [path, hash] = item.href.split('#');
  if (hash) {
    if (route.path === path) {
      // 同页面，先更新 hash 再滚动
      router.push(item.href);
      // 等待 DOM 更新后滚动
      nextTick(() => {
        const element = document.getElementById(hash);
        if (element) element.scrollIntoView({ behavior: "smooth" });
      });
    } else {
      // 跨页面，先跳转，滚动交给 router scrollBehavior
      router.push(item.href);
    }
  } else {
    router.push(path);
  }
};

const updateSlider = () => {
  nextTick(() => {
    const activeItem = navItems.find(item => isItemActive(item));
    if (activeItem && itemRefs.value[activeItem.href]) {
      const el = itemRefs.value[activeItem.href];
      sliderStyle.value = {
        transform: `translateX(${el.offsetLeft}px)`,
        width: `${el.offsetWidth}px`,
      };
    }
  });
};

const checkMobile = () => {
  isMobile.value = window.innerWidth <= 768;
  if (isMobile.value) {
    nextTick(updateSlider);
  }
};

watch(() => route.fullPath, () => {
  if (isMobile.value) updateSlider();
});

onMounted(() => {
  checkMobile();
  window.addEventListener("resize", checkMobile);
});

onUnmounted(() => {
  window.removeEventListener("resize", checkMobile);
});
</script>

<style scoped lang="scss">
.mobile-pill-nav-container {
  position: fixed;
  bottom: 20px;
  left: 0;
  width: 100vw;
  z-index: 1000;
  pointer-events: none;
  display: flex;
  justify-content: center;
  padding: 0 20px;
  padding-bottom: env(safe-area-inset-bottom);
  box-sizing: border-box;
}

.pill-nav {
  pointer-events: auto;
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.5);
  padding: 6px;
  border-radius: 999px;
  box-shadow: 
    0 12px 30px -5px rgba(0, 0, 0, 0.12),
    0 8px 10px -6px rgba(0, 0, 0, 0.08);
  position: relative;
  gap: 2px;
  width: auto;
  max-width: 100%;
  transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);

  &.dark-mode {
    background: rgba(15, 23, 42, 0.7);
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 
      0 20px 25px -5px rgba(0, 0, 0, 0.3),
      0 10px 10px -5px rgba(0, 0, 0, 0.2);
    
    .active-slider {
      background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
    }
  }
}

.active-slider {
  position: absolute;
  top: 7px;
  bottom: 7px;
  left: 0;
  background: white;
  border-radius: 999px;
  z-index: 0;
  transition: all 0.5s cubic-bezier(0.2, 1, 0.3, 1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.02);
}

.nav-item {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 10px 18px;
  border-radius: 999px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.18, 0.89, 0.32, 1.28);
  -webkit-tap-highlight-color: transparent;

  @media (max-width: 400px) {
    padding: 8px 10px;
    gap: 4px;
    
    .nav-label {
      font-size: 12px;
    }
  }

  .icon-box {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    transition: transform 0.3s;
  }

  .nav-icon {
    font-size: 16px;
    color: #64748b;
    transition: color 0.3s;
  }

  .nav-label {
    font-size: 14px;
    font-weight: 600;
    color: #475569;
    transition: all 0.3s;
    white-space: nowrap;
  }

  &.active {
    .nav-icon {
      color: #3b82f6;
      transform: scale(1.1);
    }
    
    .nav-label {
      color: #0f172a;
    }

    .dark-mode & {
      .nav-icon, .nav-label {
        color: white;
      }
    }
  }

  &:active {
    transform: scale(0.92);
  }
}

/* 隐藏在桌面端如果样式没处理好 */
@media (min-width: 769px) {
  .mobile-pill-nav-container {
    display: none;
  }
}

/* 细腻流光边框动画 - 增加灵动感 */
.pill-nav::after {
  content: '';
  position: absolute;
  inset: -1px;
  border-radius: 999px;
  padding: 1px;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.2),
    transparent
  );
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.3s;
}

.pill-nav:hover::after {
  opacity: 1;
}
</style>

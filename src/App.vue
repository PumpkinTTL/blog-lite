<template>
  <!-- v2 路由：Layout 常驻，只有 router-view 切换 -->
  <div v-if="isV2" class="v2-root min-h-screen bg-background text-foreground flex flex-col">
    <V2Header @open-user-center="showUserCenter = true" />
    <main class="flex-1">
      <router-view v-slot="{ Component, route }">
        <transition name="v2-fade" mode="out-in">
          <component :is="Component" :key="route.path" />
        </transition>
      </router-view>
    </main>
    <V2Footer />
    <MobileBottomTab />
    <BackToTop />
    <UserCenter v-model:open="showUserCenter" />
    <div class="h-14 md:hidden" />
  </div>

  <!-- v1 路由：原始布局，完全不动 -->
  <div v-else id="app">
    <a-layout class="app-layout">
      <BlogHeader />
      <a-layout-content class="app-main">
        <router-view v-slot="{ Component, route }">
          <transition
            @enter="onEnter"
            @leave="onLeave"
            :css="false"
            mode="out-in"
          >
            <component :is="Component" :key="route.path" />
          </transition>
        </router-view>
      </a-layout-content>
      <Footer />
    </a-layout>
    <MobilePillNav />
    <BackTop />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
// v1 组件
import BlogHeader from '@/components/v1/layout/BlogHeader.vue'
import MobilePillNav from '@/components/v1/layout/MobilePillNav.vue'
import BackTop from '@/components/v1/common/BackTop.vue'
// v2 组件
import V2Header from '@/components/v2/layout/Header.vue'
import V2Footer from '@/components/v2/layout/Footer.vue'
import MobileBottomTab from '@/components/v2/layout/MobileBottomTab.vue'
import BackToTop from '@/components/v2/common/BackToTop.vue'
import UserCenter from '@/components/v2/user/UserCenter.vue'

const route = useRoute()
const isV2 = computed(() => route.path.startsWith('/v2'))

const showUserCenter = ref(false)

const onEnter = (el: Element, done: () => void) => {
  const htmlEl = el as HTMLElement;
  htmlEl.style.opacity = '0';
  htmlEl.offsetHeight;
  htmlEl.style.transition = 'opacity 0.3s ease';
  htmlEl.style.opacity = '1';
  let finished = false;
  const finish = () => {
    if (finished) return;
    finished = true;
    htmlEl.style.transition = '';
    htmlEl.style.opacity = '';
    el.removeEventListener('transitionend', onEnd);
    clearTimeout(timer);
    done();
  };
  const onEnd = (e: TransitionEvent) => {
    if (e.target === el && e.propertyName === 'opacity') finish();
  };
  const timer = setTimeout(finish, 400);
  el.addEventListener('transitionend', onEnd);
};

const onLeave = (el: Element, done: () => void) => {
  const htmlEl = el as HTMLElement;
  htmlEl.style.transition = 'opacity 0.2s ease';
  htmlEl.style.opacity = '0';
  let finished = false;
  const finish = () => {
    if (finished) return;
    finished = true;
    htmlEl.style.transition = '';
    htmlEl.style.opacity = '';
    el.removeEventListener('transitionend', onEnd);
    clearTimeout(timer);
    done();
  };
  const onEnd = (e: TransitionEvent) => {
    if (e.target === el && e.propertyName === 'opacity') finish();
  };
  const timer = setTimeout(finish, 300);
  el.addEventListener('transitionend', onEnd);
};
</script>

<style lang="scss">
/* v1 样式 — 不变 */
#app {
  min-height: 100vh;
  background: var(--bg);
}

.app-layout {
  min-height: 100vh;
  background: var(--bg);
}

.app-main {
  padding-top: 64px;
  background: var(--bg);
}

/* v2 过渡动画 — 对齐 v1 page-fade 节奏 */
.v2-fade-enter-active {
  animation: v2-route-in 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}
.v2-fade-leave-active {
  animation: v2-route-out 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}
@keyframes v2-route-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
@keyframes v2-route-out {
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(-6px);
  }
}
</style>

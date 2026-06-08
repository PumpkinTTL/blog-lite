<template>
  <!-- v2 路由：使用 v2 布局 -->
  <div v-if="isV2" class="v2-root">
    <router-view v-slot="{ Component, route }">
      <transition name="v2-fade" mode="out-in">
        <component :is="Component" :key="route.path" />
      </transition>
    </router-view>
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
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import BlogHeader from '@/components/v1/layout/BlogHeader.vue'
import MobilePillNav from '@/components/v1/layout/MobilePillNav.vue'
import BackTop from '@/components/v1/common/BackTop.vue'

const route = useRoute()
const isV2 = computed(() => route.path.startsWith('/v2'))

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

/* v2 过渡动画 */
.v2-fade-enter-active,
.v2-fade-leave-active {
  transition: opacity 0.2s ease;
}

.v2-fade-enter-from,
.v2-fade-leave-to {
  opacity: 0;
}
</style>

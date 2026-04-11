<template>
  <div id="app">
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
      <MobilePillNav />
      <BackTop />
    </a-layout>
  </div>
</template>

<script setup lang="ts">
import BlogHeader from '@/components/v1/layout/BlogHeader.vue';
import MobilePillNav from '@/components/v1/layout/MobilePillNav.vue';
import BackTop from '@/components/v1/common/BackTop.vue';

const onEnter = (el: Element, done: () => void) => {
  const htmlEl = el as HTMLElement;
  htmlEl.style.opacity = '0';
  htmlEl.style.transform = 'translateY(16px)';
  // 强制浏览器重排，确保初始状态生效
  htmlEl.offsetHeight;
  htmlEl.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
  htmlEl.style.opacity = '1';
  htmlEl.style.transform = 'translateY(0)';
  const onEnd = () => {
    htmlEl.style.transition = '';
    htmlEl.style.transform = '';
    htmlEl.style.opacity = '';
    el.removeEventListener('transitionend', onEnd);
    done();
  };
  el.addEventListener('transitionend', onEnd);
};

const onLeave = (el: Element, done: () => void) => {
  const htmlEl = el as HTMLElement;
  htmlEl.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
  htmlEl.style.opacity = '0';
  htmlEl.style.transform = 'translateY(-10px)';
  const onEnd = () => {
    htmlEl.style.transition = '';
    el.removeEventListener('transitionend', onEnd);
    done();
  };
  el.addEventListener('transitionend', onEnd);
};
</script>

<style lang="scss">
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
</style>

<template>
  <div id="app">
    <a-layout class="app-layout">
      <BlogHeader />
      <a-layout-content class="app-main">
        <router-view v-slot="{ Component, route }">
          <transition
            :name="route.meta.transition || 'fade-slide'"
            mode="out-in"
          >
            <component :is="Component" :key="route.path" />
          </transition>
        </router-view>
      </a-layout-content>
      <Footer />
    </a-layout>
    <BackTop />
  </div>
</template>

<script setup lang="ts">
import BlogHeader from '@/components/v1/layout/BlogHeader.vue';
import BackTop from '@/components/v1/common/BackTop.vue';
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

/* 路由切换过渡动画 */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(12px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>

<template>
  <div id="app">
    <a-layout class="app-layout">
      <BlogHeader />
      <a-layout-content class="app-main">
        <router-view />
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
</style>

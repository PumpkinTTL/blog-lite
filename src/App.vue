<template>
  <div id="app">
    <a-layout class="app-layout">
      <a-layout-content class="app-main">
        <router-view />
      </a-layout-content>
    </a-layout>
    <BackTop />
  </div>
</template>

<script setup lang="ts">
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
  padding: 0;
  background: var(--bg);
}
</style>

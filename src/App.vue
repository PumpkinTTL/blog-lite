<template>
  <div id="app">
    <a-layout class="app-layout">
      <a-layout-content class="app-main">
        <router-view />
      </a-layout-content>
    </a-layout>
  </div>
</template>

<script setup lang="ts">
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

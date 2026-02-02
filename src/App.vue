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
@import "@/styles/variables.scss";

#app {
  min-height: 100vh;
}

.app-layout {
  min-height: 100vh;
}

.app-main {
  padding: 0;
 
}
</style>

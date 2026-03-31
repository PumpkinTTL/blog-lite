<template>
  <div class="shop-view">
    <ResourceList />
  </div>
</template>

<script setup lang="ts">
import ResourceList from '@/components/v1/shop/ResourceList.vue'
</script>

<style scoped lang="scss">
.shop-view {
  min-height: 100vh;
  background-color: var(--bg);
}

</style>


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
  background-color: #f8fafc;
  background-image: 
    radial-gradient(at 0% 0%, rgba(59, 130, 246, 0.05) 0px, transparent 50%),
    radial-gradient(at 100% 100%, rgba(59, 130, 246, 0.05) 0px, transparent 50%);
}
</style>


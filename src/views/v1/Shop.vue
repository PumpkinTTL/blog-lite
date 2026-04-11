<template>
  <div class="shop-view" :class="{ 'dark-mode': isDark }">
    <ResourceList :animated="mounted" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useThemeStore } from '@/stores/theme'
import ResourceList from '@/components/v1/shop/ResourceList.vue'

const themeStore = useThemeStore()
const isDark = computed(() => themeStore.isDark)
const mounted = ref(false)

onMounted(() => {
  mounted.value = true
})
</script>

<style scoped lang="scss">
.shop-view {
  min-height: 100vh;
  background: var(--bg, #ffffff);
  transition: background-color 0.3s ease;

  &.dark-mode {
    background: var(--bg, #0f172a);
  }
}
</style>

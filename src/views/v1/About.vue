<template>
  <div class="about-view" :class="{ 'dark-mode': isDark }">
    <div class="container">
      <AboutSection :animated="mounted" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useThemeStore } from "@/stores/theme";
import AboutSection from "@/components/v1/home/AboutSection.vue";

const themeStore = useThemeStore();
const isDark = computed(() => themeStore.isDark);
const mounted = ref(false);

onMounted(() => {
  // 延迟触发动画
  requestAnimationFrame(() => {
    mounted.value = true;
  });
});
</script>

<style scoped lang="scss">
.about-view {
  min-height: 100vh;
  background: var(--bg);

  .container {
    max-width: 1320px;
    margin: 0 auto;
    padding: 0 20px;
  }
}
</style>

<template>
  <div class="home">
    <BlogHeader />
    
    <main class="main-content">
      <div class="container">
        <!-- 内容区域 -->
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import BlogHeader from '@/components/v1/layout/BlogHeader.vue'
</script>

<style scoped lang="scss">
.home {
  min-height: 100vh;
  background: var(--bg);
}

.main-content {
  padding-top: 64px; // 为固定头部留出空间
  
  @media (max-width: 640px) {
    padding-top: 56px;
  }
}

.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 var(--space-6);
  
  @media (max-width: 768px) {
    padding: 0 var(--space-4);
  }
}
</style>

<script setup lang="ts">
import Header from './Header.vue'
import Footer from './Footer.vue'
import BackToTop from '@/components/v2/common/BackToTop.vue'
</script>

<template>
  <div class="v2-root min-h-screen bg-background text-foreground flex flex-col">
    <Header />
    <main class="flex-1">
      <slot />
    </main>
    <Footer />
    <BackToTop />
  </div>
</template>

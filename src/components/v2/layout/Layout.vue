<script setup lang="ts">
import { ref } from 'vue'
import Header from './Header.vue'
import Footer from './Footer.vue'
import MobileBottomTab from './MobileBottomTab.vue'
import UserCenter from '@/components/v2/user/UserCenter.vue'
import BackToTop from '@/components/v2/common/BackToTop.vue'

const showUserCenter = ref(false)
</script>

<template>
  <div class="v2-root min-h-screen bg-background text-foreground flex flex-col">
    <Header @open-user-center="showUserCenter = true" />
    <main class="flex-1">
      <router-view />
    </main>
    <Footer />
    <MobileBottomTab />
    <BackToTop />
    <UserCenter v-model:open="showUserCenter" />
    <!-- 移动端底部 tab 占位 -->
    <div class="h-14 md:hidden" />
  </div>
</template>

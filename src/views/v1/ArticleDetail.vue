<template>
  <div class="article-detail-page" :class="{ 'dark-mode': isDark }">
    <!-- Background Decoration -->
    <div class="page-background">
      <div class="gradient-orb orb-1"></div>
      <div class="gradient-orb orb-2"></div>
      <div class="noise-overlay"></div>
    </div>

    <!-- Main Container -->
    <div class="detail-container">
      <!-- Article Hero -->
      <ArticleHero v-if="article" :article="article" />

      <!-- Content Area (Placeholder) -->
      <div class="content-placeholder">
        <p class="placeholder-text">更多组件开发中...</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useThemeStore } from '@/stores/theme'
import ArticleHero from '@/components/v1/detail/ArticleHero.vue'

const themeStore = useThemeStore()
const isDark = themeStore.isDark
const route = useRoute()

interface Article {
  id: string
  title: string
  description: string
  cover: string
  category: string
  author: {
    name: string
    avatar: string
    role: string
  }
  createdAt: string
  views: number
  tags: string[]
}

const article = ref<Article | null>(null)

onMounted(() => {
  // Mock data - replace with actual API call
  article.value = {
    id: route.params.id as string,
    title: 'Vue 3 Composition API 深度解析：从原理到实践',
    description: '深入探讨 Vue 3 Composition API 的设计理念、核心概念以及在实际项目中的最佳实践，帮助你更好地理解和使用这一强大的特性。',
    cover: 'https://images.unsplash.com/photo-1555099962-4199c345e5dd?w=1200&h=600&fit=crop',
    category: '前端',
    author: {
      name: 'DevMaster',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=DevMaster',
      role: 'admin'
    },
    createdAt: '2024-03-20',
    views: 8542,
    tags: ['Vue3', 'Composition API', '前端开发', 'JavaScript']
  }
})
</script>

<style scoped lang="scss">
// Import Google Fonts
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=Source+Serif+4:opsz,wght@8..60,400;8..60,500;8..60,600&display=swap');

.article-detail-page {
  min-height: 100vh;
  position: relative;
  overflow-x: hidden;
  font-family: 'Source Serif 4', Georgia, serif;
  background: var(--bg, #fafbfc);
  color: var(--text, #0a0a0a);

  &.dark-mode {
    background: var(--bg, #0a0a0a);
    color: var(--text, #e8e8e8);
  }
}

// Background Decoration
.page-background {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}

.gradient-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.4;
  animation: orb-float 20s ease-in-out infinite;

  &.orb-1 {
    width: 600px;
    height: 600px;
    background: radial-gradient(circle, var(--primary, #3b82f6) 0%, transparent 70%);
    top: -200px;
    right: -100px;
    animation-delay: 0s;
  }

  &.orb-2 {
    width: 400px;
    height: 400px;
    background: radial-gradient(circle, #a855f7 0%, transparent 70%);
    bottom: -100px;
    left: -100px;
    animation-delay: -10s;
  }
}

@keyframes orb-float {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(30px, -30px) scale(1.05); }
  66% { transform: translate(-20px, 20px) scale(0.95); }
}

.noise-overlay {
  position: absolute;
  inset: 0;
  opacity: 0.015;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
}

// Main Container
.detail-container {
  position: relative;
  z-index: 1;
  max-width: 1000px;
  margin: 0 auto;
  padding: 60px 20px;
}

// Content Placeholder
.content-placeholder {
  margin-top: 60px;
  padding: 80px 40px;
  text-align: center;
  border: 2px dashed var(--border, #e0e0e0);
  border-radius: 20px;
  background: var(--surface, rgba(255, 255, 255, 0.5));
  backdrop-filter: blur(10px);

  .placeholder-text {
    font-family: 'Outfit', sans-serif;
    font-size: 18px;
    font-weight: 600;
    color: var(--text-tertiary, #999);
    letter-spacing: 0.05em;
    text-transform: uppercase;
  }
}

.dark-mode {
  .content-placeholder {
    background: var(--surface, rgba(255, 255, 255, 0.03));
    border-color: var(--border, rgba(255, 255, 255, 0.1));
  }
}
</style>

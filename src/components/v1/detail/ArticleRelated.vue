<template>
  <div class="related-panel" :class="{ 'is-dark': isDark }">
    <div class="related-glass">
      <!-- Header -->
      <div class="related-header">
        <div class="header-icon">
          <font-awesome-icon icon="layer-group" />
        </div>
        <span class="header-title">相关推荐</span>
      </div>

      <!-- Article List -->
      <div class="related-list">
        <router-link
          v-for="item in articles"
          :key="item.id"
          :to="`/article/${item.id}`"
          class="related-card"
        >
          <div class="card-cover">
            <img :src="item.cover" :alt="item.title" loading="lazy" />
          </div>
          <div class="card-info">
            <span class="card-category">{{ item.category }}</span>
            <h4 class="card-title">{{ item.title }}</h4>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useThemeStore } from "@/stores/theme";

interface RelatedArticle {
  id: string;
  title: string;
  cover: string;
  category: string;
}

const props = defineProps<{
  articles: RelatedArticle[];
}>();

const themeStore = useThemeStore();
const isDark = computed(() => themeStore.isDark);
</script>

<style scoped lang="scss">
.related-panel {
  width: 100%;
  font-family: "Inter", system-ui, -apple-system, sans-serif;
}

.related-glass {
  position: relative;
  overflow: hidden;
  border-radius: 16px;

  // Glass card — match TOC style
  background: rgba(255, 255, 255, 0.4);
  backdrop-filter: blur(16px) saturate(150%);
  -webkit-backdrop-filter: blur(16px) saturate(150%);
  border: 1px solid rgba(255, 255, 255, 0.6);
  box-shadow: 0 4px 24px -8px rgba(0, 0, 0, 0.05),
    inset 0 0 0 1px rgba(255, 255, 255, 0.2);
  padding: 20px;

  .is-dark & {
    background: rgba(15, 23, 42, 0.4);
    border: 1px solid rgba(51, 65, 85, 0.4);
    box-shadow: 0 4px 24px -8px rgba(0, 0, 0, 0.4),
      inset 0 0 0 1px rgba(255, 255, 255, 0.02);
  }
}

/* ── Header ── */
.related-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
}

.header-icon {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  background: linear-gradient(
    135deg,
    rgba(59, 130, 246, 0.12),
    rgba(168, 85, 247, 0.1)
  );
  color: var(--primary, #3b82f6);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;

  .is-dark & {
    background: linear-gradient(
      135deg,
      rgba(96, 165, 250, 0.18),
      rgba(167, 139, 250, 0.14)
    );
    color: #60a5fa;
  }
}

.header-title {
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: var(--text-secondary);
  text-transform: uppercase;
}

/* ── Card List ── */
.related-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.related-card {
  display: flex;
  gap: 10px;
  padding: 10px;
  border-radius: 12px;
  text-decoration: none;
  cursor: pointer;
  transition: background 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    background: rgba(59, 130, 246, 0.06);

    .card-title {
      color: var(--primary, #3b82f6);
    }

    .card-cover img {
      transform: scale(1.05);
    }

    .is-dark & {
      background: rgba(96, 165, 250, 0.08);

      .card-title {
        color: #60a5fa;
      }
    }
  }
}

.card-cover {
  width: 56px;
  height: 56px;
  border-radius: 10px;
  overflow: hidden;
  flex-shrink: 0;
  background: #f1f5f9;

  .is-dark & {
    background: #334155;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.25s ease;
  }
}

.card-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
  justify-content: center;
}

.card-category {
  font-size: 10px;
  font-weight: 700;
  color: var(--primary, #3b82f6);
  letter-spacing: 0.05em;
  text-transform: uppercase;

  .is-dark & {
    color: #60a5fa;
  }
}

.card-title {
  font-size: 13px;
  font-weight: 600;
  color: #1e293b;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  transition: color 0.2s ease;

  .is-dark & {
    color: #e2e8f0;
  }
}
</style>

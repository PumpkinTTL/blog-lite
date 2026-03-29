<template>
  <div class="related-panel" :class="{ 'is-dark': isDark, 'is-mobile': mobile }">
    <!-- 桌面端：毛玻璃卡片列表 -->
    <div v-if="!mobile" class="related-glass">
      <div class="related-header">
        <div class="header-icon">
          <font-awesome-icon icon="layer-group" />
        </div>
        <span class="header-title">相关推荐</span>
        <span class="header-count">{{ articles.length }}</span>
      </div>

      <div class="related-list">
        <router-link
          v-for="(item, index) in articles"
          :key="item.id"
          :to="`/article/${item.id}`"
          class="related-card"
        >
          <span class="card-index">{{ String(index + 1).padStart(2, '0') }}</span>
          <div class="card-cover">
            <img :src="item.cover" :alt="item.title" loading="lazy" />
            <div class="cover-overlay"></div>
          </div>
          <div class="card-info">
            <span class="card-category">{{ item.category }}</span>
            <h4 class="card-title">{{ item.title }}</h4>
          </div>
        </router-link>
      </div>
    </div>

    <!-- 移动端：水平滑动卡片 -->
    <div v-else class="mobile-related">
      <div class="mobile-header">
        <div class="mobile-header-left">
          <div class="mobile-header-icon">
            <font-awesome-icon icon="layer-group" />
          </div>
          <span class="mobile-header-title">相关推荐</span>
        </div>
        <span class="mobile-header-count">{{ articles.length }} 篇</span>
      </div>

      <div class="mobile-scroll">
        <router-link
          v-for="item in articles"
          :key="item.id"
          :to="`/article/${item.id}`"
          class="mobile-card"
        >
          <div class="mobile-card-cover">
            <img :src="item.cover" :alt="item.title" loading="lazy" />
            <div class="mobile-cover-overlay"></div>
            <span class="mobile-card-tag">{{ item.category }}</span>
          </div>
          <h4 class="mobile-card-title">{{ item.title }}</h4>
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

withDefaults(defineProps<{
  articles: RelatedArticle[];
  mobile?: boolean;
}>(), {
  mobile: false,
});

const themeStore = useThemeStore();
const isDark = computed(() => themeStore.isDark);
</script>

<style scoped lang="scss">
.related-panel {
  width: 100%;
  font-family: "Inter", system-ui, -apple-system, sans-serif;
}

/* ════════════════════════════════════════
   桌面端
   ════════════════════════════════════════ */
.related-glass {
  position: relative;
  overflow: hidden;
  border-radius: 16px;
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

.related-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 18px;
  padding-bottom: 14px;
  border-bottom: 1px solid rgba(226, 232, 240, 0.5);

  .is-dark & {
    border-bottom-color: rgba(51, 65, 85, 0.35);
  }
}

.header-icon {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.12), rgba(168, 85, 247, 0.1));
  color: var(--primary, #3b82f6);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;

  .is-dark & {
    background: linear-gradient(135deg, rgba(96, 165, 250, 0.18), rgba(167, 139, 250, 0.14));
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

.header-count {
  margin-left: auto;
  font-size: 11px;
  font-weight: 700;
  color: #94a3b8;
  background: rgba(148, 163, 184, 0.1);
  padding: 2px 8px;
  border-radius: 6px;

  .is-dark & {
    color: #64748b;
    background: rgba(100, 116, 139, 0.15);
  }
}

.related-list {
  display: flex;
  flex-direction: column;
}

.related-card {
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 10px 10px 0;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s ease;

  &::before {
    content: "";
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 3px;
    height: 0;
    border-radius: 2px;
    background: var(--primary, #3b82f6);
    transition: height 0.2s ease;
  }

  & + .related-card {
    border-top: 1px solid rgba(226, 232, 240, 0.4);

    .is-dark & {
      border-top-color: rgba(51, 65, 85, 0.3);
    }
  }

  &:hover {
    padding-left: 12px;

    &::before { height: 20px; }
    .card-cover img { transform: scale(1.08); }
    .card-title { color: var(--primary, #3b82f6); }
    .card-index { color: var(--primary, #3b82f6); }

    .is-dark & {
      .card-title { color: #60a5fa; }
      .card-index { color: #60a5fa; }
    }
  }
}

.card-index {
  width: 22px;
  text-align: center;
  font-size: 11px;
  font-weight: 800;
  color: #cbd5e1;
  flex-shrink: 0;
  font-variant-numeric: tabular-nums;
  transition: color 0.2s ease;

  .is-dark & { color: #475569; }
}

.card-cover {
  width: 52px;
  height: 52px;
  border-radius: 10px;
  overflow: hidden;
  flex-shrink: 0;
  position: relative;
  background: #f1f5f9;

  .is-dark & { background: #334155; }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.25s ease;
  }
}

.cover-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.08), rgba(168, 85, 247, 0.06));
  pointer-events: none;

  .is-dark & {
    background: linear-gradient(135deg, rgba(96, 165, 250, 0.1), rgba(167, 139, 250, 0.08));
  }
}

.card-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 3px;
  justify-content: center;
}

.card-category {
  font-size: 10px;
  font-weight: 700;
  color: var(--primary, #3b82f6);
  letter-spacing: 0.05em;
  text-transform: uppercase;

  .is-dark & { color: #60a5fa; }
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

  .is-dark & { color: #e2e8f0; }
}

/* ════════════════════════════════════════
   移动端：水平滑动卡片
   ════════════════════════════════════════ */
.mobile-related {
  padding: 20px 28px;
  margin-top: 20px;
  border-radius: 24px;
  border: 1px solid rgba(226, 232, 240, 0.8);
  background: #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02),
    0 12px 40px -12px rgba(15, 23, 42, 0.06);
  transition: background 0.3s, border-color 0.3s, box-shadow 0.3s;

  .is-dark & {
    background: #1e293b;
    border-color: rgba(51, 65, 85, 0.6);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05),
      0 12px 40px -12px rgba(0, 0, 0, 0.2);
  }
}

.mobile-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
  padding: 0 4px;
}

.mobile-header-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.mobile-header-icon {
  width: 26px;
  height: 26px;
  border-radius: 7px;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.12), rgba(168, 85, 247, 0.1));
  color: var(--primary, #3b82f6);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;

  .is-dark & {
    background: linear-gradient(135deg, rgba(96, 165, 250, 0.18), rgba(167, 139, 250, 0.14));
    color: #60a5fa;
  }
}

.mobile-header-title {
  font-size: 14px;
  font-weight: 700;
  color: #0f172a;

  .is-dark & { color: #f1f5f9; }
}

.mobile-header-count {
  font-size: 11px;
  font-weight: 600;
  color: #94a3b8;

  .is-dark & { color: #64748b; }
}

.mobile-scroll {
  display: flex;
  gap: 12px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
  padding-bottom: 4px;

  // 隐藏滚动条但保留滚动功能
  &::-webkit-scrollbar { display: none; }
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.mobile-card {
  flex-shrink: 0;
  width: 160px;
  text-decoration: none;
  cursor: pointer;
  scroll-snap-align: start;
  transition: transform 0.2s ease;

  &:active {
    transform: scale(0.97);
  }
}

.mobile-card-cover {
  position: relative;
  width: 100%;
  height: 96px;
  border-radius: 12px;
  overflow: hidden;
  background: #f1f5f9;

  .is-dark & { background: #334155; }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.mobile-cover-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    transparent 40%,
    rgba(0, 0, 0, 0.35) 100%
  );
  pointer-events: none;
}

.mobile-card-tag {
  position: absolute;
  bottom: 6px;
  left: 6px;
  font-size: 9px;
  font-weight: 700;
  color: #fff;
  background: rgba(59, 130, 246, 0.75);
  backdrop-filter: blur(4px);
  padding: 2px 7px;
  border-radius: 5px;
  letter-spacing: 0.03em;
}

.mobile-card-title {
  margin: 8px 0 0;
  padding: 0 2px;
  font-size: 12px;
  font-weight: 600;
  color: #1e293b;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;

  .is-dark & { color: #e2e8f0; }
}
</style>

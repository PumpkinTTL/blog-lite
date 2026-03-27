<template>
  <article class="article-hero" :class="{ 'dark-mode': isDark }">
    <div class="cover-header">
      <img
        :src="article.cover"
        :alt="article.title"
        class="cover-img"
        loading="lazy"
      />
      <div class="cover-overlay"></div>
    </div>

    <div class="hero-body">
      <div class="hero-category-row">
        <div class="cat-badge" :class="`cat-${catIndex}`">
          <font-awesome-icon
            :icon="catIcon"
            class="cat-icon animate__animated animate__fadeInLeft"
          />
          <span
            class="animate__animated animate__fadeInLeft animate__delay-50ms"
            >{{ article.category }}</span
          >
        </div>
        <div
          class="meta-eyebrow animate__animated animate__fadeInLeft animate__delay-100ms"
        >
          <font-awesome-icon icon="newspaper" />
          <span>深度专栏</span>
        </div>
      </div>

      <h1
        class="article-title animate__animated animate__fadeInUp animate__delay-150ms"
      >
        {{ article.title }}
      </h1>
      <p
        class="article-desc animate__animated animate__fadeInUp animate__delay-200ms"
      >
        {{ article.description }}
      </p>

      <div class="tags-row">
        <span
          v-for="(tag, i) in article.tags.slice(0, 4)"
          :key="tag"
          class="tag animate__animated animate__fadeInLeft"
          :class="`t${i % 4}`"
          :style="{ animationDelay: `${250 + i * 50}ms` }"
        >
          #{{ tag }}
        </span>
      </div>

      <div class="meta-section">
        <div class="author-block">
          <div
            class="avatar-wrapper animate__animated animate__zoomIn animate__delay-450ms"
          >
            <img
              :src="article.author.avatar"
              :alt="article.author.name"
              class="author-avatar"
            />
            <div class="avatar-ring"></div>
          </div>
          <div class="author-details">
            <div class="author-name-row">
              <span
                class="name animate__animated animate__fadeInLeft animate__delay-500ms"
                >{{ article.author.name }}</span
              >
              <span
                v-if="roleLabel"
                class="role-badge animate__animated animate__fadeInLeft animate__delay-550ms"
                :class="article.author.role"
              >
                <font-awesome-icon
                  v-if="article.author.role === 'super_admin'"
                  icon="gem"
                />
                <font-awesome-icon
                  v-if="article.author.role === 'admin'"
                  icon="shield-halved"
                />
                <font-awesome-icon
                  v-if="article.author.role === 'system'"
                  icon="circle-check"
                />
                <font-awesome-icon
                  v-if="article.author.role === 'vip'"
                  icon="crown"
                />
                {{ roleLabel }}
              </span>
            </div>
            <div
              class="publish-info animate__animated animate__fadeInLeft animate__delay-600ms"
            >
              <font-awesome-icon icon="calendar-days" class="date-icon" />
              <span class="date-label">发布于</span>
              <span class="date-value">{{ article.createdAt }}</span>
            </div>
          </div>
        </div>

        <div class="stats-block">
          <div
            class="stat-item animate__animated animate__fadeInLeft animate__delay-650ms"
          >
            <font-awesome-icon icon="eye" />
            <span>{{ formatNumber(article.views) }} 浏览</span>
          </div>
          <div
            class="stat-item animate__animated animate__fadeInLeft animate__delay-700ms"
          >
            <font-awesome-icon icon="clock" />
            <span>{{ article.readMinutes }} min read</span>
          </div>
          <div
            class="stat-item animate__animated animate__fadeInLeft animate__delay-750ms"
          >
            <font-awesome-icon icon="file-lines" />
            <span>{{ formatWordCount(article.wordCount) }} 字</span>
          </div>
        </div>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useThemeStore } from "@/stores/theme";

const themeStore = useThemeStore();
const isDark = computed(() => themeStore.isDark);

const CATEGORIES = ["前端", "后端", "设计", "AI", "工具"];

interface Article {
  title: string;
  description: string;
  cover: string;
  category: string;
  author: {
    name: string;
    avatar: string;
    role: string;
  };
  createdAt: string;
  views: number;
  tags: string[];
  readMinutes: number;
  wordCount: number;
}

const props = defineProps<{
  article: Article;
}>();

const catIndex = computed(
  () => Math.max(0, CATEGORIES.indexOf(props.article.category)) % 5
);

const catIcon = computed(() => {
  const map: Record<string, string> = {
    前端: "code",
    后端: "server",
    设计: "palette",
    AI: "brain",
    工具: "wrench",
  };
  return map[props.article.category] || "tags";
});

const roleLabel = computed(() => {
  const role = props.article.author.role;
  if (role === "super_admin") return "超管";
  if (role === "admin") return "站长";
  if (role === "system") return "官方";
  if (role === "vip") return "会员";
  return "";
});

const formatNumber = (num: number) => {
  if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
  return num.toString();
};

const formatWordCount = (count: number) => count.toLocaleString("en-US");
</script>

<style scoped lang="scss">
.article-hero {
  position: relative;
  font-family: "Outfit", -apple-system, BlinkMacSystemFont, "Segoe UI",
    sans-serif;
  overflow: hidden;
}

.cover-header {
  position: relative;
  width: 100%;
  height: 240px;
  background: var(--bg-card, #f8fafc);
  border-bottom: 1px solid var(--border-light, #f1f5f9);
  overflow: hidden;
}

.cover-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.article-hero:hover .cover-img {
  transform: scale(1.03);
}

.cover-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, transparent 60%, rgba(0, 0, 0, 0.1) 100%);
  pointer-events: none;
}

.hero-body {
  padding: 32px 40px;
}

.hero-category-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.cat-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 12px;
  border-radius: 9px;
  font-size: 12px;
  font-weight: 700;
  color: white;
  letter-spacing: 0.03em;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);

  .cat-icon {
    font-size: 12px;
  }

  &.cat-0 {
    background: linear-gradient(135deg, #3b82f6, #2563eb);
  }
  &.cat-1 {
    background: linear-gradient(135deg, #10b981, #059669);
  }
  &.cat-2 {
    background: linear-gradient(135deg, #ec4899, #db2777);
  }
  &.cat-3 {
    background: linear-gradient(135deg, #8b5cf6, #7c3aed);
  }
  &.cat-4 {
    background: linear-gradient(135deg, #f59e0b, #d97706);
  }
}

.meta-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 12px;
  border-radius: 9px;
  font-size: 12px;
  font-weight: 700;
  color: #2563eb;
  background: rgba(37, 99, 235, 0.06);
  border: 1px solid rgba(37, 99, 235, 0.1);
}

.article-title {
  font-size: clamp(26px, 3.2vw, 36px);
  font-weight: 850;
  line-height: 1.25;
  letter-spacing: -0.03em;
  color: #0f172a;
  margin: 0 0 16px;
}

.article-desc {
  font-size: 17px;
  line-height: 1.6;
  color: #475569;
  font-weight: 450;
  margin-bottom: 24px;
  max-width: 860px;
}

.tags-row {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 28px;
}

.tag {
  font-size: 12px;
  font-weight: 700;
  padding: 5px 12px;
  border-radius: 8px;
  transition: all 0.3s;

  &.t0 {
    color: #2563eb;
    background: #eff6ff;
  }
  &.t1 {
    color: #7c3aed;
    background: #f5f3ff;
  }
  &.t2 {
    color: #059669;
    background: #ecfdf5;
  }
  &.t3 {
    color: #d97706;
    background: #fffbeb;
  }

  &:hover {
    filter: brightness(0.95);
  }
}

.meta-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 20px;
  padding-top: 28px;
  margin-top: 8px;
  border-top: 1px solid var(--border-light, #f1f5f9);
}

.author-block {
  display: flex;
  align-items: center;
  gap: 16px;
}

.avatar-wrapper {
  position: relative;
  width: 50px;
  height: 50px;
  flex-shrink: 0;
}

.author-avatar {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  position: relative;
  z-index: 2;
  border: 2px solid white;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.08);
}

.avatar-ring {
  position: absolute;
  inset: -3px;
  border-radius: 50%;
  background: linear-gradient(
    135deg,
    rgba(37, 99, 235, 0.12),
    rgba(37, 99, 235, 0.02)
  );
  z-index: 1;
  border: 1px solid rgba(37, 99, 235, 0.08);
}

.author-details {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.author-name-row {
  display: flex;
  align-items: center;
  gap: 10px;

  .name {
    font-size: 17px;
    font-weight: 800;
    color: #0f172a;
    line-height: 1;
  }
}

.role-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 10px;
  font-weight: 800;
  padding: 3px 10px;
  border-radius: 7px;
  text-transform: uppercase;
  letter-spacing: 0.04em;

  &.super_admin {
    background: #fdf4ff;
    color: #c026d3;
    border: 1px solid rgba(192, 38, 211, 0.08);
  }
  &.admin {
    background: #fef2f2;
    color: #ef4444;
    border: 1px solid rgba(239, 68, 68, 0.08);
  }
  &.system {
    background: #f0f9ff;
    color: #0284c7;
    border: 1px solid rgba(2, 132, 199, 0.08);
  }
  &.vip {
    background: #fffbeb;
    color: #d97706;
    border: 1px solid rgba(217, 119, 6, 0.08);
  }
}

.publish-info {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #64748b;
  font-weight: 500;

  .date-icon {
    font-size: 12px;
    color: #94a3b8;
  }

  .date-label {
    opacity: 0.7;
  }

  .date-value {
    color: #475569;
    font-weight: 600;
    letter-spacing: 0.01em;
  }
}

.stats-block {
  display: flex;
  align-items: center;
  gap: 12px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 600;
  color: #64748b;
  padding: 8px 16px;
  background: #f8fafc;
  border-radius: 12px;
  border: 1px solid #f1f5f9;
  transition: all 0.2s ease;

  &:hover {
    background: #f1f5f9;
    color: #1e293b;
  }

  svg {
    font-size: 12px;
    color: #94a3b8;
  }
}

/* Dark Mode Overrides for Static State */
.article-hero.dark-mode {
  .hero-body {
    background: transparent;
  }

  .article-title {
    color: #f8fafc;
  }

  .article-desc {
    color: #94a3b8;
  }

  .tag {
    background: rgba(255, 255, 255, 0.05);

    &.t0 {
      background: rgba(37, 99, 235, 0.15);
      color: #93c5fd;
    }
    &.t1 {
      background: rgba(124, 58, 237, 0.15);
      color: #c4b5fd;
    }
    &.t2 {
      background: rgba(5, 150, 105, 0.15);
      color: #6ee7b7;
    }
    &.t3 {
      background: rgba(217, 119, 6, 0.15);
      color: #fcd34d;
    }
  }

  .meta-section {
    border-color: rgba(255, 255, 255, 0.08);
  }

  .name {
    color: #f1f5f9;
  }

  .author-avatar {
    border-color: #1e293b;
    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.4);
  }

  .avatar-ring {
    background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), transparent);
    border-color: rgba(59, 130, 246, 0.1);
  }

  .role-badge {
    border-color: transparent;
    &.super_admin {
      background: rgba(168, 85, 247, 0.12);
      color: #d8b4fe;
    }
    &.admin {
      background: rgba(239, 68, 68, 0.12);
      color: #fca5a5;
    }
    &.system {
      background: rgba(59, 130, 246, 0.12);
      color: #93c5fd;
    }
    &.vip {
      background: rgba(245, 158, 11, 0.12);
      color: #fcd34d;
    }
  }

  .publish-info {
    color: #94a3b8;
    .date-value {
      color: #cbd5e1;
    }
  }

  .stat-item {
    background: rgba(255, 255, 255, 0.03);
    border-color: rgba(255, 255, 255, 0.05);
    color: #94a3b8;

    &:hover {
      background: rgba(255, 255, 255, 0.06);
      color: #e2e8f0;
    }
  }
}

@media (max-width: 768px) {
  .hero-body {
    padding: 24px 20px;
  }
  .cover-header {
    height: 200px;
  }
  .article-title {
    font-size: 24px;
  }
  .meta-section {
    flex-direction: column;
    align-items: flex-start;
    gap: 24px;
  }
  .author-block {
    width: 100%;
  }
  .stats-block {
    width: 100%;
    flex-wrap: wrap;
    gap: 8px;
  }
  .stat-item {
    padding: 6px 12px;
    font-size: 12px;
    flex: 1 1 auto;
    justify-content: center;
  }
}
</style>

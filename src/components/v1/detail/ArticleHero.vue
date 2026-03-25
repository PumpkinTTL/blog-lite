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
          <font-awesome-icon :icon="catIcon" class="cat-icon" />
          {{ article.category }}
        </div>
        <div class="meta-eyebrow">
          <font-awesome-icon icon="newspaper" />
          <span>深度专栏</span>
        </div>
      </div>

      <h1 class="article-title">{{ article.title }}</h1>
      <p class="article-desc">{{ article.description }}</p>

      <div class="tags-row">
        <span
          v-for="(tag, i) in article.tags.slice(0, 4)"
          :key="tag"
          class="tag"
          :class="`t${i % 4}`"
        >
          #{{ tag }}
        </span>
      </div>

      <div class="meta-section">
        <div class="author-block">
          <img
            :src="article.author.avatar"
            :alt="article.author.name"
            class="author-avatar"
          />
          <div class="author-details">
            <div class="author-name-row">
              <span class="name">{{ article.author.name }}</span>
              <span
                v-if="roleLabel"
                class="role-badge"
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
            <div class="publish-date">{{ article.createdAt }}</div>
          </div>
        </div>

        <div class="stats-block">
          <div class="stat-item">
            <font-awesome-icon icon="eye" />
            <span>{{ formatNumber(article.views) }} 浏览</span>
          </div>
          <div class="stat-item">
            <font-awesome-icon icon="clock" />
            <span>{{ article.readMinutes }} min read</span>
          </div>
          <div class="stat-item">
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

  &.cat-0 { background: linear-gradient(135deg, #3b82f6, #2563eb); }
  &.cat-1 { background: linear-gradient(135deg, #10b981, #059669); }
  &.cat-2 { background: linear-gradient(135deg, #ec4899, #db2777); }
  &.cat-3 { background: linear-gradient(135deg, #8b5cf6, #7c3aed); }
  &.cat-4 { background: linear-gradient(135deg, #f59e0b, #d97706); }
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

  &.t0 { color: #2563eb; background: #eff6ff; }
  &.t1 { color: #7c3aed; background: #f5f3ff; }
  &.t2 { color: #059669; background: #ecfdf5; }
  &.t3 { color: #d97706; background: #fffbeb; }

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
  padding-top: 24px;
  border-top: 1px dashed #e2e8f0;
}

.author-block {
  display: flex;
  align-items: center;
  gap: 12px;
}

.author-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.author-details {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.author-name-row {
  display: flex;
  align-items: center;
  gap: 8px;

  .name {
    font-size: 16px;
    font-weight: 700;
    color: #1e293b;
  }
}

.role-badge {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  font-size: 10px;
  font-weight: 800;
  padding: 2px 8px;
  border-radius: 6px;
  text-transform: uppercase;

  &.super_admin { background: #fdf4ff; color: #c026d3; }
  &.admin { background: #fef2f2; color: #ef4444; }
  &.system { background: #eff6ff; color: #3b82f6; }
  &.vip { background: #fff7ed; color: #f59e0b; }
}

.publish-date {
  font-size: 12px;
  color: #94a3b8;
  font-weight: 500;
}

.stats-block {
  display: flex;
  align-items: center;
  gap: 16px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 600;
  color: #64748b;
  padding: 6px 12px;
  background: #f8fafc;
  border-radius: 10px;
  border: 1px solid #f1f5f9;

  svg {
    font-size: 12px;
    opacity: 0.8;
  }
}

.dark-mode {
  .hero-body {
    background: transparent;
  }

  .meta-eyebrow {
    background: rgba(59, 130, 246, 0.1);
    color: #60a5fa;
    border-color: rgba(96, 165, 250, 0.2);
  }

  .article-title {
    color: #f8fafc;
  }

  .article-desc {
    color: #94a3b8;
  }

  .tag {
    background: rgba(255, 255, 255, 0.05);
    
    &.t0 { background: rgba(37, 99, 235, 0.15); color: #93c5fd; }
    &.t1 { background: rgba(124, 58, 237, 0.15); color: #c4b5fd; }
    &.t2 { background: rgba(5, 150, 105, 0.15); color: #6ee7b7; }
    &.t3 { background: rgba(217, 119, 6, 0.15); color: #fcd34d; }
    
    &:hover { background: rgba(255, 255, 255, 0.08); }
  }

  .meta-section {
    border-color: rgba(255, 255, 255, 0.06);
  }

  .name {
    color: #f1f5f9;
  }

  .author-avatar {
    border-color: #1e293b;
  }

  .role-badge {
    &.super_admin { background: rgba(168, 85, 247, 0.1); }
    &.admin { background: rgba(239, 68, 68, 0.1); }
    &.system { background: rgba(59, 130, 246, 0.1); }
    &.vip { background: rgba(245, 158, 11, 0.1); }
  }

  .stat-item {
    background: rgba(255, 255, 255, 0.03);
    border-color: rgba(255, 255, 255, 0.05);
    color: #64748b;
  }
}

@media (max-width: 768px) {
  .hero-body { padding: 24px 20px; }
  .cover-header { height: 200px; }
  .article-title { font-size: 24px; }
  .meta-section { flex-direction: column; align-items: flex-start; gap: 20px; }
  .stats-block { width: 100%; overflow-x: auto; padding-bottom: 4px; }
}
</style>

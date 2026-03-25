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
      <div class="hero-category">
        <div class="cat-badge" :class="`cat-${catIndex}`">
          <font-awesome-icon :icon="catIcon" class="cat-icon" />
          {{ article.category }}
        </div>
      </div>

      <h1 class="article-title">{{ article.title }}</h1>

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
            <font-awesome-icon icon="eye" class="stat-icon" />
            <span>{{ formatNumber(article.views) }} 浏览</span>
          </div>
          <div class="stat-item">
            <font-awesome-icon icon="clock" class="stat-icon" />
            <span>约 {{ readTime }} 分钟阅读</span>
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

const readTime = computed(() =>
  Math.max(3, Math.ceil(props.article.description.length / 50))
);

const formatNumber = (num: number) => {
  if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
  return num.toString();
};
</script>

<style scoped lang="scss">
.article-hero {
  position: relative;
  font-family: "Outfit", -apple-system, BlinkMacSystemFont, "Segoe UI",
    sans-serif;
  background: var(--bg-card, #ffffff);
  border-radius: 18px;
  box-shadow: 0 4px 18px rgba(0, 0, 0, 0.04);
  border: 1px solid var(--border, #f1f5f9);
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
  padding: 28px 30px;
}

.hero-category {
  margin-bottom: 12px;
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

.article-title {
  font-size: clamp(22px, 2.4vw, 31px);
  font-weight: 800;
  line-height: 1.28;
  letter-spacing: -0.01em;
  color: var(--text, #0f172a);
  margin: 0 0 12px;
}

.tags-row {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 22px;
}

.tag {
  font-size: 12px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 7px;
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
  padding-top: 18px;
  border-top: 1px dashed var(--border-light, #e2e8f0);
}

.author-block {
  display: flex;
  align-items: center;
  gap: 12px;
}

.author-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
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
    font-size: 15px;
    line-height: 1.2;
    font-weight: 700;
    color: var(--text, #1e293b);
  }
}

.role-badge {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  font-size: 10px;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 6px;

  &.super_admin {
    background: #fdf4ff;
    color: #c026d3;
  }
  &.admin {
    background: #fef2f2;
    color: #ef4444;
  }
  &.system {
    background: #eff6ff;
    color: #3b82f6;
  }
  &.vip {
    background: #fff7ed;
    color: #f59e0b;
  }
}

.publish-date {
  font-size: 12px;
  color: #64748b;
  font-weight: 500;
}

.stats-block {
  display: flex;
  align-items: center;
  gap: 10px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  font-weight: 600;
  color: #64748b;
  padding: 5px 10px;
  background: #f8fafc;
  border-radius: 7px;

  .stat-icon {
    font-size: 12px;
    opacity: 0.7;
  }
}

.dark-mode {
  background: var(--bg-card, #1e293b);
  border-color: var(--border, #334155);

  .cover-header {
    background: var(--bg-card, #0f172a);
    border-color: transparent;
  }

  .article-title {
    color: #f8fafc;
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
    border-color: rgba(255, 255, 255, 0.1);
  }

  .name {
    color: #f1f5f9;
  }

  .publish-date {
    color: #94a3b8;
  }

  .role-badge {
    &.super_admin {
      background: rgba(168, 85, 247, 0.1);
    }
    &.admin {
      background: rgba(239, 68, 68, 0.1);
    }
    &.system {
      background: rgba(59, 130, 246, 0.1);
    }
    &.vip {
      background: rgba(245, 158, 11, 0.1);
    }
  }

  .stats-block .stat-item {
    background: rgba(255, 255, 255, 0.05);
    color: #94a3b8;
  }
}

@media (max-width: 768px) {
  .hero-body {
    padding: 22px 18px;
  }

  .cover-header {
    height: 188px;
  }

  .article-title {
    font-size: 21px;
  }

  .meta-section {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .stats-block {
    width: 100%;
    justify-content: flex-start;
  }
}
</style>

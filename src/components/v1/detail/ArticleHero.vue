<template>
  <article class="article-hero" :class="{ 'dark-mode': isDark }">
    <!-- 1. 置顶封面 -->
    <div class="cover-header">
      <img
        :src="article.cover"
        :alt="article.title"
        class="cover-img"
        loading="lazy"
      />
      <div class="cover-overlay"></div>
    </div>

    <!-- 正文容器 -->
    <div class="hero-body">
      <!-- 2. 分类徽章 -->
      <div class="hero-category">
        <div class="cat-badge" :class="`cat-${catIndex}`">
          <font-awesome-icon :icon="catIcon" class="cat-icon" />
          {{ article.category }}
        </div>
      </div>

      <!-- 3. 大标题 -->
      <h1 class="article-title">{{ article.title }}</h1>

      <!-- 4. 彩色文章标签 (恢复丰富的彩色质感并置于标题下方) -->
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

      <!-- 5. 数据元信息栏 -->
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

      <!-- 6. 高级版 AI 摘要卡片 (重新优化质感，高级且清透) -->
      <div class="ai-summary-premium">
        <!-- 绚丽顶部高光线 -->
        <div class="ai-glow-line"></div>
        <div class="ai-glass-bg"></div>

        <div class="ai-sparkles">
          <span class="sparkle sparkle-1">✦</span>
          <span class="sparkle sparkle-2">✦</span>
        </div>

        <div class="ai-inner">
          <div class="ai-header">
            <div class="ai-title-wrap">
              <div class="ai-icon-box">
                <font-awesome-icon icon="robot" class="ai-icon" />
              </div>
              <span class="ai-title">AI 智能摘要</span>
            </div>
            <div class="ai-time">
              <font-awesome-icon icon="bolt" class="bolt-icon" />
              <span>0.3s生成</span>
            </div>
          </div>
          <div class="ai-body">
            <p class="ai-text">{{ article.description }}</p>
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
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
  border: 1px solid var(--border, #f1f5f9);
  margin-bottom: 32px;
  overflow: hidden; // Ensures top cover blends with radius
}

/* 1. 置顶封面 */
.cover-header {
  position: relative;
  width: 100%;
  height: 280px;
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

/* 内部间距包裹 */
.hero-body {
  padding: 36px 40px;
}

/* 2. 分类 */
.hero-category {
  margin-bottom: 16px;
}

.cat-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: 10px;
  font-size: 13px;
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

/* 3. 标题 */
.article-title {
  font-size: clamp(24px, 3.5vw, 36px);
  font-weight: 800;
  line-height: 1.35;
  letter-spacing: -0.01em;
  color: var(--text, #0f172a);
  margin: 0 0 16px;
}

/* 4. 恢复并移至标题下方的多彩标签 */
.tags-row {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 28px;
}

.tag {
  font-size: 13px;
  font-weight: 600;
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

/* 5. 分割与元信息 */
.meta-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 20px;
  padding-top: 24px;
  border-top: 1px dashed var(--border-light, #e2e8f0);
}

.author-block {
  display: flex;
  align-items: center;
  gap: 14px;
}

.author-avatar {
  width: 44px;
  height: 44px;
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
  font-size: 13px;
  color: #64748b;
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
  border-radius: 8px;

  .stat-icon {
    font-size: 12px;
    opacity: 0.7;
  }
}

/* 6. 高级版 AI 摘要区块 */
.ai-summary-premium {
  --ai-summary-radius: 18px;
  position: relative;
  margin-top: 32px;
  padding: 24px;
  border-radius: var(--ai-summary-radius);
  background: linear-gradient(
    135deg,
    rgba(244, 244, 255, 0.9) 0%,
    rgba(243, 232, 255, 0.7) 100%
  );
  border: 1px solid rgba(216, 180, 254, 0.5);
  box-shadow: 0 8px 32px rgba(168, 85, 247, 0.06);
  overflow: hidden;
}

/* 顶部高光发光线 */
.ai-glow-line {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, #c084fc, #ec4899, #c084fc);
  border-top-left-radius: var(--ai-summary-radius);
  border-top-right-radius: var(--ai-summary-radius);
  background-size: 200% auto;
  animation: shine 3s linear infinite;
}

@keyframes shine {
  to {
    background-position: 200% center;
  }
}

.ai-glass-bg {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  backdrop-filter: blur(16px);
  z-index: 0;
}

/* 点缀的一点点闪星，不用太多 */
.ai-sparkles {
  position: absolute;
  top: 16px;
  right: 20px;
  z-index: 1;
}

.sparkle {
  font-size: 10px;
  color: #c084fc;
  opacity: 0;
  animation: pop 4s ease-in-out infinite;

  &.sparkle-1 {
    animation-delay: 0s;
    margin-right: 6px;
  }
  &.sparkle-2 {
    animation-delay: 1.5s;
    font-size: 14px;
    color: #ec4899;
  }
}

@keyframes pop {
  0%,
  100% {
    opacity: 0;
    transform: scale(0.5) translateY(0);
  }
  50% {
    opacity: 1;
    transform: scale(1) translateY(-4px);
  }
}

.ai-inner {
  position: relative;
  z-index: 2;
  border-radius: calc(var(--ai-summary-radius) - 4px);
  padding: 2px;
}

.ai-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.ai-title-wrap {
  display: flex;
  align-items: center;
  gap: 12px;
}

.ai-icon-box {
  width: 32px;
  height: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #a855f7, #ec4899);
  color: white;
  border-radius: 10px;
  font-size: 14px;
  box-shadow: 0 4px 12px rgba(168, 85, 247, 0.4);
}

.ai-title {
  font-size: 15px;
  font-weight: 800;
  background: linear-gradient(135deg, #7c3aed, #db2777);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.ai-time {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 20px;
  color: #c026d3;
  background: rgba(192, 38, 211, 0.08);
  border: 1px solid rgba(192, 38, 211, 0.1);
}

.ai-body {
  padding: 14px 16px;
  border-radius: calc(var(--ai-summary-radius) - 6px);
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.44) 0%,
    rgba(255, 255, 255, 0.18) 100%
  );
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.28);
}

.ai-text {
  font-size: 14px;
  line-height: 1.8;
  color: #4c1d95;
  margin: 0;
  font-weight: 500;
}

/* 黑暗模式细节适配 */
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

  /* 黑暗模式 AI摘要依然高级通透 */
  .ai-summary-premium {
    background: linear-gradient(
      135deg,
      rgba(88, 28, 135, 0.2) 0%,
      rgba(126, 34, 206, 0.05) 100%
    );
    border-color: rgba(192, 132, 252, 0.25);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  }

  .ai-body {
    background: linear-gradient(
      135deg,
      rgba(76, 29, 149, 0.28) 0%,
      rgba(59, 7, 100, 0.18) 100%
    );
    border-color: rgba(216, 180, 254, 0.16);
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.06);
  }

  .ai-text {
    color: #e9d5ff;
  }
}

/* 响应式调整 */
@media (max-width: 768px) {
  .hero-body {
    padding: 24px;
  }
  .cover-header {
    height: 200px;
  }
  .article-title {
    font-size: 22px;
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

<template>
  <article class="post-card" :class="{ 'is-hot': isHot }">

    <!-- ── Cover ── -->
    <div class="cover-wrap" v-if="post.image">
      <img :src="post.image" :alt="post.title" class="cover" loading="lazy" />
      <div class="cover-mask"></div>
      <div class="cover-top">
        <span class="cat-badge" :class="`cat-${catIndex}`">
          <font-awesome-icon :icon="catIcon" class="cat-icon" />
          {{ post.category }}
        </span>
      </div>
      <span class="time-badge">
        <font-awesome-icon icon="clock" />
        {{ readingMinutes }} min
      </span>
      <!-- 热门标签 - 吸附在封面图上 -->
      <div v-if="isHot" class="hot-badge-pinned">
        <font-awesome-icon icon="fire" class="fire-icon" />
        <span>HOT</span>
      </div>
    </div>

    <!-- ── Content ── -->
    <div class="content">

      <!-- 1. Title + bookmark -->
      <div class="title-row">
        <h3 class="title">{{ post.title }}</h3>
        <button class="bookmark" type="button" aria-label="收藏">
          <font-awesome-icon icon="star" />
        </button>
      </div>

      <!-- 2. Description -->
      <p class="desc">{{ post.description }}</p>

      <!-- 3. Author · date -->
      <div class="meta">
        <img :src="post.author.avatar" :alt="post.author.name" class="avatar" loading="lazy" />
        <div class="author-unit" :class="post.author.role">
          <span class="name">{{ post.author.name }}</span>
          <template v-if="post.author.role && post.author.role !== 'user'">
            <span class="role-sep"></span>
            <span class="role-label">
              <font-awesome-icon v-if="post.author.role === 'super_admin'" icon="gem" />
              <font-awesome-icon v-if="post.author.role === 'admin'" icon="shield-halved" />
              <font-awesome-icon v-if="post.author.role === 'system'" icon="circle-check" />
              <font-awesome-icon v-if="post.author.role === 'vip'" icon="crown" />
              {{ 
                post.author.role === 'super_admin' ? '超管' : 
                post.author.role === 'admin' ? '站长' : 
                post.author.role === 'system' ? '官方' : '会员' 
              }}
            </span>
          </template>
        </div>

        <span class="dot">·</span>

        <div class="date-unit">
          <font-awesome-icon icon="calendar-days" />
          <span>{{ dateLabel }}</span>
        </div>

        <!-- 移动端标签展示：放置在时间后面 -->
        <div class="mobile-tags">
          <span v-for="(tag, i) in post.tags.slice(0, 2)" :key="tag" class="m-tag" :class="`t${i % 4}`">
            #{{ tag }}
          </span>
        </div>
      </div>

      <!-- 4. Bottom bar -->
      <div class="bottom-bar">
        <div class="stats">
          <span class="stat">
            <font-awesome-icon icon="eye" />{{ formatNum(post.views) }}
          </span>
          <span class="stat">
            <font-awesome-icon icon="heart" />{{ formatNum(post.likes) }}
          </span>
          <span class="stat">
            <font-awesome-icon icon="comment" />{{ commentsEstimate }}
          </span>
        </div>

        <div class="tags">
          <span v-for="(tag, i) in post.tags.slice(0, 3)" :key="tag" class="tag" :class="`t${i % 4}`">
            # {{ tag }}
          </span>
        </div>

        <div class="actions">

          <button class="btn-share" type="button" aria-label="分享">
            <font-awesome-icon icon="share-nodes" />
          </button>
        </div>
      </div>

    </div>
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Resource } from '@/data/mockData'

const CATEGORIES = ['前端', '后端', '设计', 'AI', '工具']

const props = withDefaults(
  defineProps<{ post: Resource; index?: number }>(),
  { index: 0 }
)

const catIndex       = computed(() => Math.max(0, CATEGORIES.indexOf(props.post.category)) % 5)
const catIcon        = computed(() => {
  const map: Record<string, string> = { '前端': 'code', '后端': 'server', '设计': 'palette', 'AI': 'brain', '工具': 'wrench' }
  return map[props.post.category] || 'tags'
})
const isHot          = computed(() => props.post.views >= 7000) /* 提高门槛，使热门更稀有 */
const dateLabel      = computed(() => {
  const d = new Date(props.post.createdAt)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
})
const readingMinutes   = computed(() => Math.max(3, Math.round(props.post.description.length / 42)))
const commentsEstimate = computed(() => Math.max(8, Math.round(props.post.views / 95)))
const formatNum = (n: number) => n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n)
</script>

<style scoped lang="scss">
/* ─────────────────────────────
   Card shell
───────────────────────────── */
.post-card {
  display: grid;
  grid-template-columns: 200px minmax(0, 1fr);
  background: #fff;
  border: 1px solid #F3F4F6;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  min-width: 0;
  cursor: pointer;

  &.is-hot {
    border: 1px solid #FFEDD5;
    background: #FFFCF8;
    box-shadow: none;
  }

  &:hover {
    border-color: #BFDBFE;
    box-shadow: 0 20px 25px -5px rgba(37, 99, 235, 0.08), 0 10px 10px -12px rgba(37, 99, 235, 0.08);

    &.is-hot {
      border-color: #FED7AA;
      box-shadow: 0 20px 30px -5px rgba(251, 146, 60, 0.15);
    }

    .cover { transform: scale(1.04); }
    .title { color: #2563EB; }
  }
}

/* ─────────────────────────────
   Cover
───────────────────────────── */
.cover-wrap {
  position: relative;
  min-height: 162px;
  background: #F3F4F6;
  overflow: hidden;
  margin: 8px 0 8px 8px;
  border-radius: 8px;
}

.cover {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.6s cubic-bezier(0.33, 1, 0.68, 1);
}

.cover-mask {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0) 40%, rgba(0, 0, 0, 0) 60%, rgba(0, 0, 0, 0.4) 100%);
  opacity: 0.5;
  pointer-events: none;
  z-index: 1;
}

.cover-top {
  position: absolute;
  top: 8px; left: 8px; right: 8px;
  display: flex;
  align-items: center;
  gap: 5px;
  z-index: 2;
}

/* Category badge - Ultra Flat style */
.cat-badge {
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 9px;
  font-weight: 700;
  color: #fff;
  white-space: nowrap;
  letter-spacing: 0.01em;
  z-index: 2;
  display: inline-flex;
  align-items: center;
  gap: 3px;
  
  /* 彻底扁平：纯色背景，零阴影，无描边 */
  border: none;
  box-shadow: none;
  text-shadow: none;

  .cat-icon {
    font-size: 8px;
    opacity: 0.9;
  }
}

.cat-0 { background: #3B82F6; } /* 前端 - 纯蓝 */
.cat-1 { background: #10B981; } /* 后端 - 纯绿 */
.cat-2 { background: #EC4899; } /* 设计 - 纯粉 */
.cat-3 { background: #8B5CF6; } /* AI - 纯紫 */
.cat-4 { background: #F59E0B; } /* 工具 - 纯橙 */

.time-badge {
  position: absolute;
  bottom: 8px; right: 8px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 8px;
  border-radius: 5px;
  background: rgba(15, 23, 42, 0.6);
  color: #fff;
  font-size: 10px;
  font-weight: 600;

  z-index: 2;

  :deep(svg) { font-size: 9px; opacity: 0.9; }
}

/* ─────────────────────────────
   Content
───────────────────────────── */
.content {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px 20px 16px 12px;
  min-width: 0;
}

/* 1. Title */
.title-row {
  display: flex;
  align-items: flex-start;
  gap: 8px;
}

.title {
  margin: 0;
  flex: 1;
  font-size: 16px;
  font-weight: 700;
  color: #111827;
  line-height: 1.45;
  letter-spacing: -0.018em;
  transition: all 0.3s;
}

/* 热门标题：高级金黄带流光效果 */
.is-hot .title {
  background: linear-gradient(
    110deg, 
    #92400e 20%, 
    #b45309 30%, 
    #f59e0b 40%, 
    #fff7ed 50%, 
    #f59e0b 60%, 
    #b45309 70%, 
    #92400e 80%
  );
  background-size: 200% auto;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: title-shine 4s linear infinite;
  font-weight: 800;
}

@keyframes title-shine {
  from { background-position: 150% center; }
  to { background-position: -50% center; }
}

.bookmark {
  flex-shrink: 0;
  width: 28px;
  height: 28px;
  border: 1.5px solid #F3F4F6;
  border-radius: 8px;
  background: #fff;
  color: #D1D5DB;
  font-size: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
  font-family: inherit;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);

  &:hover {
    border-color: #FCD34D;
    background: #FFFBEB;
    color: #F59E0B;
    transform: scale(1.15) rotate(8deg);
    box-shadow: 0 4px 12px rgba(245, 158, 11, 0.15);
  }

  &:active {
    transform: scale(0.95);
  }
}

/* 2. Description */
.desc {
  margin: 0;
  font-size: 12.5px;
  color: #4B5563;
  line-height: 1.65;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 3. Meta */
.meta {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap; /* 允许在空间不足时换行，防止挤出 */
}

.avatar {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  object-fit: cover;
  border: 1.5px solid #fff;
  box-shadow: 0 0 0 1px #E5E7EB;
  flex-shrink: 0;
}

.author-unit {
  display: inline-flex;
  align-items: center;
  transition: all 0.2s ease;

  .name {
    font-size: 13px;
    font-weight: 600; /* 改为 600，不再过粗 */
    color: #4B5563;
  }

  /* 统一所有角色的基础容器样式 (包括超级管理员) */
  &.super_admin, &.admin, &.system, &.vip {
    padding: 2px 2px 2px 8px;
    background: #F9FAFB;
    border: 1px solid #F3F4F6;
    border-radius: 7px;
    line-height: 1;
    
    .name { font-size: 12px; }
  }

  /* 角色分割线 */
  .role-sep {
    width: 1px;
    height: 10px;
    background: #E5E7EB;
    margin: 0 6px;
  }

  .role-label {
    display: flex;
    align-items: center;
    gap: 3px;
    font-size: 10px;
    font-weight: 800;
    padding: 2px 6px;
    border-radius: 4px;
  }

  /* 身份化配色 - 一体化视觉 */
  &.super_admin {
    background: #fdf4ff; 
    border-color: #f5d0fe;
    .name { color: #86198f; }
    .role-sep { background: #f0abfc; margin: 0 6px; }
    .role-label { 
      color: #fff; 
      background: linear-gradient(135deg, #f472b6 0%, #a855f7 100%); 
      box-shadow: 0 1px 3px rgba(168, 85, 247, 0.25);
      border-radius: 5px;
    }
  }
  &.admin {
    background: #FEF2F2; border-color: #FEE2E2;
    .name { color: #B91C1C; }
    .role-sep { background: #FECACA; }
    .role-label { color: #EF4444; background: #fff; box-shadow: 0 1px 2px rgba(239, 68, 68, 0.1); }
  }
  &.system {
    background: #EFF6FF; border-color: #DBEAFE;
    .name { color: #1D4ED8; }
    .role-sep { background: #BFDBFE; }
    .role-label { color: #3B82F6; background: #fff; box-shadow: 0 1px 2px rgba(59, 130, 246, 0.1); }
  }
  &.vip {
    background: #FFFBEB; border-color: #FEF3C7;
    .name { color: #B45309; }
    .role-sep { background: #FDE68A; }
    .role-label { color: #F59E0B; background: #fff; box-shadow: 0 1px 2px rgba(245, 158, 11, 0.1); }
  }
}

.dot {
  color: #E5E7EB;
  margin: 0 2px;
}

.date-unit {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 11px;
  font-weight: 600;
  color: #9CA3AF;
  padding: 3px 0;
  
  :deep(svg) { font-size: 10px; }
}

/* 移动端标签专属样式 (默认隐藏，仅在 mobile 激活) */
.mobile-tags {
  display: none;
  gap: 4px;
  flex-wrap: wrap;
}

.m-tag {
  font-size: 10px;
  font-weight: 600;
  padding: 1px 6px;
  border-radius: 4px;
  border: 1px solid transparent;
  white-space: nowrap;
  
  &.t0 { color: #1e40af; background: #eff6ff; border-color: #dbeafe; }
  &.t1 { color: #5b21b6; background: #f5f3ff; border-color: #ede9fe; }
  &.t2 { color: #065f46; background: #f0fdf4; border-color: #dcfce7; }
  &.t3 { color: #92400e; background: #fffbeb; border-color: #fef3c7; }
}

/* 热门文章 - 封面右侧吸附树叶角标 */
.hot-badge-pinned {
  position: absolute;
  top: 15px; /* 稍微下移，不挤在最顶角 */
  right: -4px; /* 右侧贴齐封面图边缘 */
  padding: 4px 12px;
  background: linear-gradient(135deg, #fb923c, #f43f5e);
  color: #fff;
  font-size: 10px;
  font-weight: 900;
  /* 树叶形状：左边圆润，右边贴合 */
  border-radius: 20px 2px 2px 20px;
  display: flex;
  align-items: center;
  gap: 4px;
  z-index: 10;
  letter-spacing: 0.05em;
  overflow: hidden;
  box-shadow: -2px 4px 10px rgba(244, 63, 94, 0.2);

  /* 镜面扫过流光效果，只在hot标签上 */
  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: -150%;
    width: 60%;
    height: 100%;
    background: linear-gradient(
      90deg, 
      transparent, 
      rgba(255, 255, 255, 0.5), 
      transparent
    );
    transform: skewX(-20deg);
    animation: hot-shine 3s infinite;
  }

  .fire-icon {
    font-size: 11px;
    position: relative;
    z-index: 1;
  }

  span {
    position: relative;
    z-index: 1;
  }
}

@keyframes hot-shine {
  0% { left: -150%; }
  30% { left: 150%; }
  100% { left: 150%; }
}

@keyframes fire-flicker {
  0% { transform: scale(1); opacity: 1; filter: drop-shadow(0 0 2px #fff); }
  100% { transform: scale(1); opacity: 1; filter: drop-shadow(0 0 2px #fff); }
}

/* 4. Bottom bar */
.bottom-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: auto;
  padding-top: 9px;
  border-top: 1px solid #F3F4F6;
}

.stats {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}

.stat {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 11px;
  color: #6B7280;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 6px;
  transition: all 0.2s ease;
  background: #F9FAFB;

  :deep(svg) { 
    font-size: 12px; 
    color: #9CA3AF; 
    transition: all 0.2s ease;
  }

  &:nth-child(1):hover { color: #3B82F6; background: #EFF6FF; :deep(svg) { color: #3B82F6; transform: scale(1.1); } }
  &:nth-child(2):hover { color: #EF4444; background: #FEF2F2; :deep(svg) { color: #EF4444; transform: scale(1.1); } }
  &:nth-child(3):hover { color: #10B981; background: #ECFDF5; :deep(svg) { color: #10B981; transform: scale(1.1); } }
}

.tags {
  display: flex;
  gap: 4px;
  overflow: hidden;
}

.tag {
  font-size: 10px;
  font-weight: 600;
  border-radius: 6px;
  padding: 2px 8px;
  white-space: nowrap;
  border: 1px solid;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    transform: translateY(-1px);
    filter: brightness(0.95);
  }
}

.tag.t0 { color: #1e40af; background: #eff6ff; border-color: #dbeafe; }
.tag.t1 { color: #5b21b6; background: #f5f3ff; border-color: #ede9fe; }
.tag.t2 { color: #065f46; background: #f0fdf4; border-color: #dcfce7; }
.tag.t3 { color: #92400e; background: #fffbeb; border-color: #fef3c7; }

.actions {
  display: flex;
  gap: 5px;
  margin-left: auto;
  flex-shrink: 0;
}


.btn-share {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: 1.5px solid #F3F4F6;
  border-radius: 9px;
  background: #fff;
  color: #9CA3AF;
  font-size: 12px;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);

  &:hover { 
    background: #F3F4F6; 
    border-color: #E5E7EB; 
    color: #111827; 
    transform: scale(1.1) rotate(-8deg);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  }

  &:active {
    transform: scale(0.95);
  }
}

/* ─────────────────────────────
   ≤ 1100px  stacked layout
───────────────────────────── */
@media (max-width: 1100px) {
  .post-card { grid-template-columns: 1fr; }
  .cover-wrap { min-height: 180px; }
}

/* ─────────────────────────────
   ≤ 640px  mobile app style
───────────────────────────── */
@media (max-width: 640px) {
  .post-card {
    grid-template-columns: auto 1fr;
    border-radius: 12px;
    min-height: 116px;
    align-items: center; /* 垂直居中对齐，防止拉伸 */
  }

  .cover-wrap { 
    width: 96px;
    height: 96px;
    min-height: 96px;
    margin: 10px;
    flex-shrink: 0;
  }

  .time-badge { display: none; }
  .cat-badge  { display: none; }
  .rank-badge { display: none; }

  .content { 
    padding: 12px 12px 12px 0; 
    gap: 6px; 
  }

  .title {
    font-size: 13px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .desc       { display: none; }
  .hot-badge  { display: none; }

  .author { font-size: 11px; }
  .date   { font-size: 10.5px; }

  .bottom-bar { padding-top: 5px; gap: 6px; }

  .stats { gap: 7px; flex-wrap: wrap; }
  .stat  { font-size: 10.5px; padding: 2px 6px; }

  /* 移动端缩小热门角标并微调位置 */
  .hot-badge-pinned {
    transform: scale(0.7);
    right: -10px;
    top: 12px;
  }

  /* 发布时间允许换行，不再隐藏 */
  .date-unit { 
    display: flex;
    background: transparent;
    border: none;
    padding-left: 0;
  } 
  /* 移动端展示标签：接在时间后面 */
  .mobile-tags { display: flex; }
  .tags { display: none; }
  
  /* 调整 meta 区域以支持换行 */
  .meta {
    gap: 6px;
    row-gap: 4px;
  }
  
  .dot { display: none; } /* 移动端隐藏中间的点，靠 gap 和换行区分 */
  .btn-share { display: none; }
}
</style>

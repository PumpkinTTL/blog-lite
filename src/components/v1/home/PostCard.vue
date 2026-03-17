<template>
  <article class="post-card">

    <!-- ── Cover ── -->
    <div class="cover-wrap" v-if="post.image">
      <img :src="post.image" :alt="post.title" class="cover" loading="lazy" />
      <div class="cover-top">
        <span class="rank-badge" :class="rankClass">{{ rankLabel }}</span>
        <span class="cat-badge" :class="`cat-${catIndex}`">{{ post.category }}</span>
      </div>
      <span class="time-badge">
        <font-awesome-icon icon="clock" />
        {{ readingMinutes }} min
      </span>
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
        <span class="author">{{ post.author.name }}</span>
        <span class="dot">·</span>
        <font-awesome-icon icon="calendar-days" class="cal-icon" />
        <span class="date">{{ dateLabel }}</span>
        <span v-if="isHot" class="hot-badge">
          <font-awesome-icon icon="fire" class="fire-icon" />
          热门
        </span>
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
          <button class="btn-read" type="button">
            <font-awesome-icon icon="book-open" />
            阅读全文
          </button>
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

const rankLabel      = computed(() => String(props.index + 1).padStart(2, '0'))
const rankClass      = computed(() =>
  props.index === 0 ? 'rank-gold' : props.index === 1 ? 'rank-silver' : props.index === 2 ? 'rank-bronze' : 'rank-normal'
)
const catIndex       = computed(() => Math.max(0, CATEGORIES.indexOf(props.post.category)) % 5)
const isHot          = computed(() => props.post.views >= 3000)
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
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    border-color: #BFDBFE;
    box-shadow: 0 10px 25px -5px rgba(37, 99, 235, 0.1), 0 8px 10px -6px rgba(37, 99, 235, 0.1);

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

.cover-top {
  position: absolute;
  top: 8px; left: 8px; right: 8px;
  display: flex;
  align-items: center;
  gap: 5px;
}

/* Rank badge — colored by position */
.rank-badge {
  padding: 3px 10px;
  border-radius: 6px;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.06em;
  color: #fff;
  backdrop-filter: blur(6px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.rank-gold   { background: rgba(245, 158, 11, 0.95); }
.rank-silver { background: rgba(100, 116, 139, 0.9); }
.rank-bronze { background: rgba(180, 83, 9, 0.88); }
.rank-normal { background: rgba(15, 23, 42, 0.55); }

/* Category badge */
.cat-badge {
  padding: 3px 10px;
  border-radius: 6px;
  font-size: 10px;
  font-weight: 700;
  color: #fff;
  backdrop-filter: blur(6px);
}

.cat-0 { background: rgba(37, 99, 235, 0.7); }
.cat-1 { background: rgba(5, 150, 105, 0.7); }
.cat-2 { background: rgba(124, 58, 237, 0.7); }
.cat-3 { background: rgba(217, 119, 6, 0.75); }
.cat-4 { background: rgba(15, 118, 110, 0.7); }

.time-badge {
  position: absolute;
  bottom: 8px; right: 8px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 8px;
  border-radius: 5px;
  background: rgba(15, 23, 42, 0.45);
  color: #fff;
  font-size: 10px;
  font-weight: 600;
  backdrop-filter: blur(4px);

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
  transition: color 120ms;
}

.bookmark {
  flex-shrink: 0;
  width: 26px;
  height: 26px;
  border: 1px solid #E5E7EB;
  border-radius: 6px;
  background: transparent;
  color: #D1D5DB;
  font-size: 11px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 120ms;
  font-family: inherit;

  &:hover {
    border-color: #FDE68A;
    background: #FFFBEB;
    color: #F59E0B;
    transform: scale(1.1);
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
  flex-wrap: nowrap;
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

.author {
  font-size: 12px;
  font-weight: 600;
  color: #1F2937;
  white-space: nowrap;
}

.dot {
  color: #D1D5DB;
  font-size: 11px;
  flex-shrink: 0;
}

.cal-icon {
  font-size: 10px;
  color: #93C5FD;
  flex-shrink: 0;
}

.date {
  font-size: 11.5px;
  color: #9CA3AF;
  white-space: nowrap;
}

/* Hot badge — shows when views >= 3000 */
.hot-badge {
  margin-left: auto;
  font-size: 10.5px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 6px;
  background: #FFF7ED;
  color: #EA580C;
  border: 1px solid #FFEDD5;
  white-space: nowrap;
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  gap: 4px;

  .fire-icon {
    font-size: 11px;
    color: #F97316;
  }
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
  gap: 4px;
  font-size: 11.5px;
  color: #9CA3AF;
  font-weight: 500;

  :deep(svg) { 
    font-size: 11px; 
    color: #9CA3AF; 
    transition: color 0.2s ease;
  }

  &:hover {
    color: #4B5563;
    :deep(svg) { color: #6B7280; }
  }
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

.btn-read {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 5px 12px;
  border: 1px solid #BFDBFE;
  border-radius: 7px;
  background: #EFF6FF;
  color: #2563EB;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  font-family: inherit;
  white-space: nowrap;
  transition: all 120ms;

  :deep(svg) { font-size: 11px; color: #2563EB; }

  &:hover { 
    background: #2563EB; 
    border-color: #2563EB;
    color: #fff;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);
    :deep(svg) { color: #fff; }
  }

  &:active {
    transform: translateY(0);
  }
}

.btn-share {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border: 1px solid #E5E7EB;
  border-radius: 7px;
  background: transparent;
  color: #9CA3AF;
  font-size: 11px;
  cursor: pointer;
  font-family: inherit;
  transition: all 120ms;

  &:hover { 
    background: #F3F4F6; 
    border-color: #D1D5DB; 
    color: #374151; 
    transform: scale(1.05);
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
    grid-template-columns: 96px minmax(0, 1fr);
    border-radius: 8px;
    min-height: 96px;
  }

  .cover-wrap { min-height: 96px; height: 100%; }

  .time-badge { display: none; }
  .cat-badge  { display: none; }
  .rank-badge { font-size: 9px; padding: 1px 5px; }

  .content { padding: 9px 11px; gap: 5px; }

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

  .stats { gap: 7px; }
  .stat  { font-size: 10.5px; }

  .tags      { display: none; }
  .btn-share { display: none; }
  .btn-read  { padding: 4px 9px; font-size: 11px; margin-left: auto; }
}
</style>

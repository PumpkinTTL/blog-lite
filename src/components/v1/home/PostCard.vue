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
        <span v-if="isHot" class="hot-badge">🔥 热门</span>
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
  border: 1px solid #E5E7EB;
  border-radius: 10px;
  overflow: hidden;
  transition: border-color 160ms, box-shadow 160ms;

  &:hover {
    border-color: #BFDBFE;
    box-shadow: 0 4px 18px rgba(37, 99, 235, 0.08);

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
}

.cover {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 320ms ease;
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
  padding: 3px 8px;
  border-radius: 5px;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.06em;
  color: #fff;
}

.rank-gold   { background: rgba(245, 158, 11, 0.95); }
.rank-silver { background: rgba(100, 116, 139, 0.9); }
.rank-bronze { background: rgba(180, 83, 9, 0.88); }
.rank-normal { background: rgba(15, 23, 42, 0.55); }

/* Category badge */
.cat-badge {
  padding: 3px 8px;
  border-radius: 5px;
  font-size: 10px;
  font-weight: 600;
  color: #fff;
}

.cat-0 { background: rgba(37, 99, 235, 0.85); }
.cat-1 { background: rgba(5, 150, 105, 0.85); }
.cat-2 { background: rgba(124, 58, 237, 0.85); }
.cat-3 { background: rgba(217, 119, 6, 0.9); }
.cat-4 { background: rgba(15, 118, 110, 0.85); }

.time-badge {
  position: absolute;
  bottom: 8px; right: 8px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 8px;
  border-radius: 5px;
  background: rgba(15, 23, 42, 0.55);
  color: #fff;
  font-size: 10px;
  font-weight: 500;

  :deep(svg) { font-size: 9px; }
}

/* ─────────────────────────────
   Content
───────────────────────────── */
.content {
  display: flex;
  flex-direction: column;
  gap: 9px;
  padding: 14px 16px;
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
  font-size: 15.5px;
  font-weight: 600;
  color: #111827;
  line-height: 1.35;
  letter-spacing: -0.01em;
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
  gap: 5px;
  flex-wrap: nowrap;
}

.avatar {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  object-fit: cover;
  border: 1.5px solid #E0E7FF;
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
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 4px;
  background: #FFF7ED;
  color: #C2410C;
  border: 1px solid #FED7AA;
  white-space: nowrap;
  flex-shrink: 0;
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

  :deep(svg) { font-size: 10px; color: #9CA3AF; }
}

.tags {
  display: flex;
  gap: 4px;
  overflow: hidden;
}

.tag {
  font-size: 10.5px;
  font-weight: 500;
  border-radius: 4px;
  padding: 2px 7px;
  white-space: nowrap;
  border: 1px solid;
}

.tag.t0 { color: #1D4ED8; background: #EFF6FF; border-color: #BFDBFE; }
.tag.t1 { color: #7C3AED; background: #F5F3FF; border-color: #DDD6FE; }
.tag.t2 { color: #0F766E; background: #F0FDFA; border-color: #99F6E4; }
.tag.t3 { color: #92400E; background: #FFFBEB; border-color: #FDE68A; }

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

  :deep(svg) { font-size: 11px; color: #60A5FA; }

  &:hover { background: #DBEAFE; border-color: #93C5FD; }
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

  &:hover { background: #F9FAFB; border-color: #D1D5DB; color: #6B7280; }
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

<template>
  <article class="post-card">
    <!-- Cover image -->
    <div class="cover-wrap" v-if="post.image">
      <img :src="post.image" :alt="post.title" class="cover" loading="lazy" />
      <div class="cover-badges">
        <span class="rank-badge">{{ rankLabel }}</span>
        <span class="cat-badge">{{ post.category }}</span>
      </div>
      <span class="read-badge">
        <font-awesome-icon icon="clock" />
        {{ readingMinutes }} min
      </span>
    </div>

    <!-- Content -->
    <div class="content">
      <!-- Title + bookmark -->
      <div class="title-row">
        <h3 class="title">{{ post.title }}</h3>
        <button class="bookmark" type="button" aria-label="收藏">
          <font-awesome-icon icon="star" />
        </button>
      </div>

      <!-- Description -->
      <p class="desc">{{ post.description }}</p>

      <!-- Meta: author + date + stats -->
      <div class="meta-row">
        <img :src="post.author.avatar" :alt="post.author.name" class="avatar" loading="lazy" />
        <span class="author-name">{{ post.author.name }}</span>
        <span class="meta-sep">·</span>
        <span class="meta-date">{{ dateLabel }}</span>
        <div class="stat-group">
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
      </div>

      <!-- Tags + actions -->
      <div class="bottom-row">
        <div class="tags">
          <span
            v-for="(tag, i) in post.tags.slice(0, 3)"
            :key="tag"
            class="tag"
            :class="`t${i % 4}`"
          ># {{ tag }}</span>
        </div>
        <div class="actions">
          <button class="btn btn-read" type="button">
            <font-awesome-icon icon="book-open" />
            阅读全文
          </button>
          <button class="btn btn-icon" type="button" aria-label="分享">
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

const props = withDefaults(
  defineProps<{ post: Resource; index?: number }>(),
  { index: 0 }
)

const rankLabel = computed(() => String(props.index + 1).padStart(2, '0'))

const dateLabel = computed(() => {
  const d = new Date(props.post.createdAt)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
})

const readingMinutes = computed(() => Math.max(3, Math.round(props.post.description.length / 42)))
const commentsEstimate = computed(() => Math.max(8, Math.round(props.post.views / 95)))
const formatNum = (n: number) => n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n)
</script>

<style scoped lang="scss">
/* ════════════════════════════════════
   Desktop: side-by-side
══════════════════════════════════════ */
.post-card {
  display: grid;
  grid-template-columns: 192px minmax(0, 1fr);
  background: #fff;
  border: 1px solid #E5E7EB;
  border-radius: 10px;
  overflow: hidden;
  transition: border-color 150ms ease, box-shadow 150ms ease;

  &:hover {
    border-color: #D1D5DB;
    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.07);
    .cover { transform: scale(1.03); }
    .title { color: #2563EB; }
  }
}

/* ── Cover ── */
.cover-wrap {
  position: relative;
  min-height: 160px;
  background: #F3F4F6;
  overflow: hidden;
}

.cover {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 300ms ease;
}

.cover-badges {
  position: absolute;
  top: 8px;
  left: 8px;
  right: 8px;
  display: flex;
  align-items: center;
  gap: 5px;
}

.rank-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 2px 7px;
  border-radius: 4px;
  background: rgba(17, 24, 39, 0.68);
  color: #fff;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.05em;
}

.cat-badge {
  padding: 2px 8px;
  border-radius: 4px;
  background: rgba(17, 24, 39, 0.68);
  color: #fff;
  font-size: 10px;
  font-weight: 600;
}

.read-badge {
  position: absolute;
  bottom: 8px;
  right: 8px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 7px;
  border-radius: 4px;
  background: rgba(17, 24, 39, 0.68);
  color: #fff;
  font-size: 10px;
  font-weight: 500;

  :deep(svg) { font-size: 9px; }
}

/* ── Content ── */
.content {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 14px 16px;
  min-width: 0;
}

/* Title */
.title-row {
  display: flex;
  align-items: flex-start;
  gap: 8px;
}

.title {
  margin: 0;
  flex: 1;
  font-size: 15px;
  font-weight: 600;
  color: #111827;
  line-height: 1.35;
  letter-spacing: -0.01em;
  transition: color 120ms ease;
}

.bookmark {
  width: 26px;
  height: 26px;
  border: 1px solid #E5E7EB;
  border-radius: 6px;
  background: #fff;
  color: #D1D5DB;
  font-size: 11px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 120ms ease;
  font-family: inherit;

  &:hover {
    border-color: #FDE68A;
    background: #FFFBEB;
    color: #D97706;
  }
}

/* Description */
.desc {
  margin: 0;
  font-size: 12.5px;
  color: #6B7280;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Meta row */
.meta-row {
  display: flex;
  align-items: center;
  gap: 5px;
  flex-wrap: wrap;
}

.avatar {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid #E5E7EB;
  flex-shrink: 0;
}

.author-name {
  font-size: 12px;
  font-weight: 600;
  color: #374151;
}

.meta-sep { color: #D1D5DB; font-size: 11px; }

.meta-date {
  color: #9CA3AF;
  font-size: 11.5px;
}

.stat-group {
  display: flex;
  align-items: center;
  gap: 9px;
  margin-left: auto;
}

.stat {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 11.5px;
  color: #9CA3AF;
  font-weight: 500;

  :deep(svg) { font-size: 10px; }
}

/* Bottom row */
.bottom-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-top: auto;
  padding-top: 2px;
}

.tags {
  display: flex;
  gap: 4px;
  min-width: 0;
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
  flex-shrink: 0;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 5px 11px;
  border: 1px solid #E5E7EB;
  border-radius: 7px;
  background: #F9FAFB;
  color: #374151;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  font-family: inherit;
  transition: all 120ms ease;
  white-space: nowrap;

  &:hover {
    background: #F3F4F6;
    border-color: #D1D5DB;
  }

  :deep(svg) { font-size: 11px; color: #6B7280; }
}

/* 阅读全文按钮 — 浅蓝底带边框 */
.btn.btn-read {
  border-color: #BFDBFE;
  background: #EFF6FF;
  color: #2563EB;

  :deep(svg) { color: #2563EB; }

  &:hover {
    background: #DBEAFE;
    border-color: #93C5FD;
  }
}

/* 分享图标按钮 */
.btn.btn-icon {
  padding: 5px 8px;
}

/* ════════════════════════════════════
   ≤ 1100px: stacked (cover top)
══════════════════════════════════════ */
@media (max-width: 1100px) {
  .post-card { grid-template-columns: 1fr; }
  .cover-wrap { min-height: 180px; }
}

/* ════════════════════════════════════
   ≤ 640px: mobile compact app style
══════════════════════════════════════ */
@media (max-width: 640px) {
  .post-card {
    /* 左缩略图 + 右内容，紧凑两行 */
    grid-template-columns: 96px minmax(0, 1fr);
    border-radius: 8px;
    min-height: 96px;
  }

  .cover-wrap {
    min-height: 96px;
    height: 100%;
  }

  /* 手机端只保留 rank + cat，不显示阅读时间 */
  .read-badge { display: none; }

  .cover-badges { top: 6px; left: 6px; gap: 4px; }
  .rank-badge, .cat-badge { font-size: 9px; padding: 1px 5px; }

  .content {
    padding: 9px 11px;
    gap: 4px;
  }

  .title {
    font-size: 13px;
    font-weight: 600;
    line-height: 1.3;
    /* 手机端标题最多两行 */
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  /* 手机端描述隐藏，靠标题+meta传达信息 */
  .desc { display: none; }

  .meta-row {
    gap: 4px;
    flex-wrap: nowrap;
    overflow: hidden;
  }

  .author-name { font-size: 11px; }
  .meta-date { font-size: 10.5px; }

  /* 手机端stats简化显示 */
  .stat-group {
    gap: 6px;
    margin-left: 0;
  }

  .stat { font-size: 10.5px; }

  .bottom-row {
    padding-top: 0;
    gap: 5px;
  }

  .tags {
    gap: 3px;
    /* 只显示第一个tag */
    .tag:not(:first-child) { display: none; }
  }

  .tag { font-size: 10px; padding: 1px 6px; }

  .actions {
    /* 手机端只显示阅读按钮 */
    .btn-icon { display: none; }
  }

  .btn.btn-read {
    padding: 4px 9px;
    font-size: 11px;
  }
}
</style>

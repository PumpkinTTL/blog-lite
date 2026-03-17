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
            <font-awesome-icon icon="eye" />{{ post.views.toLocaleString() }}
          </span>
          <span class="stat">
            <font-awesome-icon icon="heart" />{{ post.likes.toLocaleString() }}
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
          <button class="btn btn-blue" type="button">
            <font-awesome-icon icon="book-open" />
            阅读全文
          </button>
          <button class="btn" type="button">
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
</script>

<style scoped lang="scss">
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
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);

    .cover { transform: scale(1.03); }
  }
}

/* ── Cover ── */
.cover-wrap {
  position: relative;
  min-height: 168px;
  background: #F3F4F6;
  overflow: hidden;
  flex-shrink: 0;
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
  top: 10px;
  left: 10px;
  right: 10px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.rank-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 20px;
  border-radius: 4px;
  background: rgba(17, 24, 39, 0.7);
  color: #fff;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.04em;
}

.cat-badge {
  padding: 2px 8px;
  border-radius: 4px;
  background: rgba(17, 24, 39, 0.7);
  color: #fff;
  font-size: 10px;
  font-weight: 600;
}

.read-badge {
  position: absolute;
  bottom: 10px;
  right: 10px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 8px;
  border-radius: 4px;
  background: rgba(17, 24, 39, 0.65);
  color: #fff;
  font-size: 10px;
  font-weight: 600;
}

/* ── Content ── */
.content {
  display: flex;
  flex-direction: column;
  gap: 9px;
  padding: 14px 16px;
  min-width: 0;
}

/* Title row */
.title-row {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.title {
  margin: 0;
  flex: 1;
  font-size: clamp(14px, 1.1vw, 17px);
  font-weight: 600;
  color: #111827;
  line-height: 1.35;
  letter-spacing: -0.015em;
  transition: color 120ms ease;

  .post-card:hover & { color: #2563EB; }
}

.bookmark {
  width: 28px;
  height: 28px;
  border: 1px solid #E5E7EB;
  border-radius: 6px;
  background: #fff;
  color: #9CA3AF;
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
  gap: 6px;
  font-size: 12px;
}

.avatar {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid #E5E7EB;
  flex-shrink: 0;
}

.author-name {
  font-weight: 600;
  color: #374151;
  font-size: 12px;
}

.meta-sep { color: #D1D5DB; }

.meta-date {
  color: #9CA3AF;
  font-size: 11.5px;
}

.stat-group {
  display: flex;
  align-items: center;
  gap: 8px;
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

/* Tags + actions */
.bottom-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-top: auto;
}

.tags {
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
  min-width: 0;
}

.tag {
  font-size: 11px;
  font-weight: 500;
  border-radius: 4px;
  padding: 2px 7px;
  white-space: nowrap;
}

.tag.t0 { color: #1D4ED8; background: #EFF6FF; border: 1px solid #BFDBFE; }
.tag.t1 { color: #7C3AED; background: #F5F3FF; border: 1px solid #DDD6FE; }
.tag.t2 { color: #0F766E; background: #F0FDFA; border: 1px solid #99F6E4; }
.tag.t3 { color: #92400E; background: #FFFBEB; border: 1px solid #FDE68A; }

.actions {
  display: flex;
  gap: 6px;
  flex-shrink: 0;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 6px 12px;
  border: 1px solid #E5E7EB;
  border-radius: 7px;
  background: #fff;
  color: #374151;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  font-family: inherit;
  transition: all 120ms ease;

  &:hover {
    background: #F9FAFB;
    border-color: #D1D5DB;
  }
}

.btn.btn-blue {
  background: #2563EB;
  border-color: #2563EB;
  color: #fff;

  &:hover {
    background: #1D4ED8;
    border-color: #1D4ED8;
  }
}

/* ── Responsive ── */
@media (max-width: 1100px) {
  .post-card { grid-template-columns: 1fr; }
  .cover-wrap { min-height: 180px; }
}

@media (max-width: 640px) {
  .post-card { border-radius: 8px; }
  .content { padding: 12px; gap: 8px; }
  .cover-wrap { min-height: 160px; }

  .meta-row { flex-wrap: wrap; }
  .stat-group { margin-left: 0; width: 100%; }

  .bottom-row { flex-direction: column; align-items: flex-start; }
  .tags { flex-wrap: nowrap; overflow-x: auto; scrollbar-width: none; }
}
</style>

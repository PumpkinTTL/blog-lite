<template>
  <div class="article-footer">
    <!-- 点赞 / 收藏 / 分享 -->
    <div class="action-row">
      <button class="action-item" :class="{ active: localLiked }" @click="toggleLike">
        <font-awesome-icon icon="heart" />
        <span>{{ localLikes }}</span>
      </button>
      <button class="action-item" :class="{ active: localBookmarked }" @click="toggleBookmark">
        <font-awesome-icon icon="bookmark" />
        <span>{{ localBookmarked ? '已收藏' : '收藏' }}</span>
      </button>
      <button class="action-item" @click="handleShare">
        <font-awesome-icon icon="share-nodes" />
        <span>分享</span>
      </button>
    </div>

    <!-- 上下篇导航 -->
    <div class="nav-row">
      <div class="nav-card" :class="{ disabled: !prev }" @click="prev && navigate(prev.id)">
        <div class="nav-label">
          <font-awesome-icon icon="chevron-left" />
          <span>上一篇</span>
        </div>
        <span class="nav-title" v-if="prev">{{ prev.title }}</span>
        <span class="nav-empty" v-else>已经是第一篇了</span>
      </div>

      <div class="nav-card" :class="{ disabled: !next }" @click="next && navigate(next.id)">
        <div class="nav-label">
          <span>下一篇</span>
          <font-awesome-icon icon="chevron-right" />
        </div>
        <span class="nav-title" v-if="next">{{ next.title }}</span>
        <span class="nav-empty" v-else>已经是最后一篇了</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";

interface NavItem {
  id: string;
  title: string;
  cover: string;
  category: string;
}

const props = defineProps<{
  likes: number;
  liked: boolean;
  bookmarked: boolean;
  prev: NavItem | null;
  next: NavItem | null;
}>();

const router = useRouter();

const localLiked = ref(props.liked);
const localLikes = ref(props.likes);
const localBookmarked = ref(props.bookmarked);

const toggleLike = () => {
  localLiked.value = !localLiked.value;
  localLikes.value += localLiked.value ? 1 : -1;
};

const toggleBookmark = () => {
  localBookmarked.value = !localBookmarked.value;
};

const handleShare = () => {
  if (navigator.share) {
    navigator.share({ title: document.title, url: window.location.href });
  } else {
    navigator.clipboard.writeText(window.location.href);
  }
};

const navigate = (id: string) => {
  router.push(`/article/${id}`);
  window.scrollTo({ top: 0, behavior: "smooth" });
};
</script>

<style scoped lang="scss">
.article-footer {
  margin-top: 40px;
  padding-top: 24px;
  border-top: 1px solid rgba(226, 232, 240, 0.6);

  :deep(.dark-mode *) &,
  :deep(.dark-mode) & {
    border-top-color: rgba(51, 65, 85, 0.4);
  }
}

/* ── Action Row ── */
.action-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 24px;
}

.action-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 16px;
  border: none;
  border-radius: 20px;
  background: rgba(0, 0, 0, 0.03);
  color: #94a3b8;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease-out;

  &:hover {
    background: rgba(0, 0, 0, 0.06);
    color: #64748b;
  }

  // 点赞激活
  &.active:nth-child(1) {
    color: #ef4444;
    background: rgba(239, 68, 68, 0.08);
  }

  // 收藏激活
  &.active:nth-child(2) {
    color: #f59e0b;
    background: rgba(245, 158, 11, 0.08);
  }

  :deep(.dark-mode *) &,
  :deep(.dark-mode) & {
    background: rgba(255, 255, 255, 0.05);
    color: #64748b;

    &:hover {
      background: rgba(255, 255, 255, 0.1);
      color: #94a3b8;
    }

    &.active:nth-child(1) {
      color: #f87171;
      background: rgba(239, 68, 68, 0.12);
    }

    &.active:nth-child(2) {
      color: #fbbf24;
      background: rgba(245, 158, 11, 0.12);
    }
  }
}

/* ── Nav Row ── */
.nav-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.nav-card {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 12px 14px;
  border-radius: 12px;
  cursor: pointer;
  transition: background 0.2s;

  &:hover:not(.disabled) {
    background: rgba(59, 130, 246, 0.04);

    .nav-title {
      color: var(--primary, #3b82f6);
    }

    :deep(.dark-mode *) &,
    :deep(.dark-mode) & {
      background: rgba(96, 165, 250, 0.06);

      .nav-title {
        color: #60a5fa;
      }
    }
  }

  &.disabled {
    cursor: default;

    .nav-title {
      color: #cbd5e1;
    }

    .nav-empty {
      color: #cbd5e1;
    }

    :deep(.dark-mode *) &,
    :deep(.dark-mode) & {
      .nav-title {
        color: #475569;
      }

      .nav-empty {
        color: #475569;
      }
    }
  }

  &:nth-child(2) {
    text-align: right;
    align-items: flex-end;

    .nav-label {
      flex-direction: row-reverse;
    }
  }
}

.nav-label {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  font-weight: 600;
  color: #94a3b8;
  letter-spacing: 0.3px;

  :deep(.dark-mode *) &,
  :deep(.dark-mode) & {
    color: #64748b;
  }
}

.nav-title {
  font-size: 13px;
  font-weight: 600;
  color: #334155;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  transition: color 0.2s;

  :deep(.dark-mode *) &,
  :deep(.dark-mode) & {
    color: #cbd5e1;
  }
}

.nav-empty {
  font-size: 12px;
  color: #94a3b8;

  :deep(.dark-mode *) &,
  :deep(.dark-mode) & {
    color: #64748b;
  }
}

@media (max-width: 640px) {
  .article-footer {
    margin-top: 28px;
    padding-top: 18px;
  }

  .action-row {
    gap: 4px;
    margin-bottom: 18px;
  }

  .action-item {
    padding: 5px 10px;
    font-size: 12px;
  }

  .nav-row {
    grid-template-columns: 1fr;
    gap: 8px;
  }

  .nav-card:nth-child(2) {
    text-align: left;
    align-items: flex-start;

    .nav-label {
      flex-direction: row;
    }
  }
}
</style>

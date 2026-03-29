<template>
  <section class="comments-section" :class="{ 'dark-mode': isDark }">
    <!-- 头部 -->
    <div class="comments-header">
      <div class="header-info">
        <div class="header-icon-wrap">
          <font-awesome-icon icon="comment" />
        </div>
        <div class="header-text">
          <h3 class="header-title">评论区</h3>
          <span class="header-sub">共 {{ totalCount }} 条评论</span>
        </div>
      </div>
    </div>

    <!-- 评论输入区 -->
    <div class="comment-input-card" ref="inputCardRef">
      <img :src="currentUser.avatar" :alt="currentUser.name" class="input-avatar" />
      <div class="input-body">
        <div class="reply-hint" v-if="replyTarget">
          <span>回复 <strong>@{{ replyTarget.name }}</strong></span>
          <button class="reply-hint-close" @mousedown.prevent @click="cancelReply">
            <font-awesome-icon icon="xmark" />
          </button>
        </div>
        <textarea ref="textareaRef" v-model="newComment" class="input-textarea"
          :class="{ expanded: inputFocused || newComment.trim() }" placeholder="写下你的想法..." @focus="inputFocused = true"
          @blur="handleBlur" />
        <transition name="slide-fade">
          <div class="input-actions" v-if="inputFocused || newComment.trim()">
            <button v-if="replyTarget" class="cancel-reply-btn" @mousedown.prevent @click="cancelReply">
              取消
            </button>
            <button class="submit-btn" :disabled="!newComment.trim()" @mousedown.prevent @click="submitComment">
              <font-awesome-icon icon="paper-plane" />
              {{ replyTarget ? '回复' : '发布' }}
            </button>
          </div>
        </transition>
      </div>
    </div>

    <!-- 评论列表 -->
    <div class="comments-list">
      <div v-for="comment in visibleComments" :key="comment.id" class="comment-thread">
        <!-- 主评论 -->
        <div class="comment-item">
          <img :src="comment.avatar" :alt="comment.name" class="comment-avatar" />
          <div class="comment-body">
            <div class="comment-meta">
              <span class="comment-name">{{ comment.name }}</span>
              <span v-if="comment.isAuthor" class="author-badge">作者</span>
              <span class="comment-time">{{ comment.time }}</span>
            </div>
            <p class="comment-text">{{ comment.content }}</p>
            <div class="comment-actions">
              <button class="action-btn" :class="{ liked: comment.liked }" @click="toggleLike(comment)">
                <font-awesome-icon icon="thumbs-up" />
                <span>{{ comment.likes || '' }}</span>
              </button>
              <button class="action-btn" @click="startReply(comment)">
                <font-awesome-icon icon="at" />
                <span>回复</span>
              </button>
            </div>
          </div>
        </div>

        <!-- 嵌套回复 -->
        <div v-if="comment.replies?.length" class="replies">
          <div v-for="reply in getVisibleReplies(comment)" :key="reply.id" class="comment-item reply-item">
            <img :src="reply.avatar" :alt="reply.name" class="comment-avatar small" />
            <div class="comment-body">
              <div class="comment-meta">
                <span class="comment-name">{{ reply.name }}</span>
                <span v-if="reply.isAuthor" class="author-badge">作者</span>
                <span class="reply-to" v-if="reply.replyTo">
                  回复 <em>{{ reply.replyTo }}</em>
                </span>
                <span class="comment-time">{{ reply.time }}</span>
              </div>
              <p class="comment-text">{{ reply.content }}</p>
              <div class="comment-actions">
                <button class="action-btn" :class="{ liked: reply.liked }" @click="toggleLike(reply)">
                  <font-awesome-icon icon="thumbs-up" />
                  <span>{{ reply.likes || '' }}</span>
                </button>
                <button class="action-btn" @click="startReply(reply, comment)">
                  <font-awesome-icon icon="at" />
                  <span>回复</span>
                </button>
              </div>
            </div>
          </div>
          <!-- 展开更多回复 -->
          <button v-if="hasMoreReplies(comment)" class="expand-replies-btn" @click="expandReplies(comment)">
            <font-awesome-icon icon="chevron-down" />
            展开更多回复（{{ (comment.replies?.length ?? 0) - (replyExpandMap.get(comment.id) ?? REPLY_INIT_COUNT) }} 条）
          </button>
        </div>
      </div>

      <!-- 加载更多评论 -->
      <button v-if="hasMoreComments" class="load-more-btn" :disabled="loadingMoreComments" @click="loadMoreComments">
        <font-awesome-icon v-if="loadingMoreComments" icon="refresh" spin class="load-more-icon" />
        <font-awesome-icon v-else icon="chevron-down" class="load-more-icon" />
        {{ loadingMoreComments ? '加载中...' : '查看更多评论' }}
      </button>

      <!-- 空状态 -->
      <div v-if="!comments.length" class="empty-state">
        <font-awesome-icon icon="comment" class="empty-icon" />
        <p class="empty-text">还没有评论，来说两句吧</p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, nextTick, reactive, ref } from "vue";
import { useThemeStore } from "@/stores/theme";
import coderAvatar from "@/assets/avatars/coder.png";
import writerAvatar from "@/assets/avatars/writer.png";
import designerAvatar from "@/assets/avatars/Designer.png";
import dataCuratorAvatar from "@/assets/avatars/DataCurator.png";
import officerAvatar from "@/assets/avatars/Officer.png";
import operatorAvatar from "@/assets/avatars/operator.png";

interface CommentItem {
  id: number;
  name: string;
  avatar: string;
  content: string;
  time: string;
  likes: number;
  liked: boolean;
  isAuthor?: boolean;
  replyTo?: string;
  replies?: CommentItem[];
}

const themeStore = useThemeStore();
const isDark = computed(() => themeStore.isDark);

const newComment = ref("");
const inputFocused = ref(false);
const replyTarget = ref<CommentItem | null>(null);
const replyParent = ref<CommentItem | null>(null);
const inputCardRef = ref<HTMLElement | null>(null);
const textareaRef = ref<HTMLTextAreaElement | null>(null);

// ── 分页配置 ──
const COMMENT_PAGE_SIZE = 3;
const REPLY_INIT_COUNT = 2;
const commentDisplayCount = ref(COMMENT_PAGE_SIZE);
const replyExpandMap = reactive(new Map<number, number>()); // commentId → 已展开的回复数
const loadingMoreComments = ref(false);

const currentUser = {
  name: "匿名用户",
  avatar: coderAvatar,
};

const comments = ref<CommentItem[]>([
  {
    id: 1,
    name: "林小北",
    avatar: writerAvatar,
    content:
      "Composition API 确实解决了 Options API 的代码分散问题，但团队迁移的时候最大阻力其实是思维惯性问题。文章里提到的「先统一高频场景」这个策略很实用。",
    time: "2 小时前",
    likes: 24,
    liked: false,
    replies: [
      {
        id: 101,
        name: "开发者",
        avatar: officerAvatar,
        content: "对，渐进式迁移才是最稳妥的，感谢认可！",
        time: "1 小时前",
        likes: 8,
        liked: false,
        isAuthor: true,
        replyTo: "林小北",
      },
      {
        id: 102,
        name: "陈大鱼",
        avatar: designerAvatar,
        content: "我们团队就是从 Vue 2 直接跳到 Composition API 的，前期确实有点痛苦。",
        time: "45 分钟前",
        likes: 3,
        liked: false,
        replyTo: "林小北",
      },
      {
        id: 103,
        name: "前端小白",
        avatar: dataCuratorAvatar,
        content: "同感！不过熬过前两周就顺畅多了，现在反而不想回去写 Options API 了。",
        time: "30 分钟前",
        likes: 5,
        liked: false,
        replyTo: "陈大鱼",
      },
      {
        id: 104,
        name: "林小北",
        avatar: writerAvatar,
        content: "是的，关键是前两天别放弃，写几个小需求就上手了。",
        time: "15 分钟前",
        likes: 2,
        liked: false,
        replyTo: "前端小白",
      },
    ],
  },
  {
    id: 2,
    name: "陈大鱼",
    avatar: designerAvatar,
    content:
      "状态边界的三个判断问题很实用，以前总搞不清哪些该抽 composable 哪些留组件内。收藏了。",
    time: "5 小时前",
    likes: 16,
    liked: false,
  },
  {
    id: 3,
    name: "前端小白",
    avatar: dataCuratorAvatar,
    content:
      "请问 useArticle 这个 composable 里的 error 状态一般怎么展示给用户？是 toast 还是 inline 提示？",
    time: "1 天前",
    likes: 6,
    liked: false,
    replies: [
      {
        id: 301,
        name: "林小北",
        avatar: writerAvatar,
        content:
          "看场景，网络错误用 toast，表单校验用 inline。关键数据加载失败可以在页面级做一个 error boundary。",
        time: "20 小时前",
        likes: 4,
        liked: false,
        replyTo: "前端小白",
      },
    ],
  },
  {
    id: 4,
    name: "赵铁柱",
    avatar: operatorAvatar,
    content:
      "讲真，Pinia + Composable 这套组合拳打下来，状态管理终于不脏了。之前用 Vuex 写大型项目，模块嵌套到后面自己都不想看。",
    time: "2 天前",
    likes: 31,
    liked: false,
    replies: [
      {
        id: 401,
        name: "开发者",
        avatar: officerAvatar,
        content: "Pinia 的 DevTools 支持也做得很好，调试体验比 Vuex 舒服太多了。",
        time: "1 天前",
        likes: 12,
        liked: false,
        isAuthor: true,
        replyTo: "赵铁柱",
      },
    ],
  },
  {
    id: 5,
    name: "周小鱼",
    avatar: dataCuratorAvatar,
    content:
      "文章里提到的 ref vs reactive 选择建议很中肯，我们项目组之前为这个争论了好久，最后统一用 ref + 解构，代码可读性确实好很多。",
    time: "3 天前",
    likes: 19,
    liked: false,
  },
  {
    id: 6,
    name: "孙大强",
    avatar: designerAvatar,
    content:
      "自定义指令那块写得不错，不过建议补充一下 Teleport 的使用场景，我们在做全局弹窗的时候用得特别多。",
    time: "4 天前",
    likes: 11,
    liked: false,
    replies: [
      {
        id: 601,
        name: "开发者",
        avatar: officerAvatar,
        content: "好建议！下一篇文章会专门讲 Teleport 和 Suspense 的实战用法。",
        time: "3 天前",
        likes: 7,
        liked: false,
        isAuthor: true,
        replyTo: "孙大强",
      },
      {
        id: 602,
        name: "周小鱼",
        avatar: dataCuratorAvatar,
        content: "期待！Suspense 配合异步组件真的是性能优化的利器。",
        time: "3 天前",
        likes: 3,
        liked: false,
        replyTo: "开发者",
      },
      {
        id: 603,
        name: "赵铁柱",
        avatar: operatorAvatar,
        content: "Teleport 做模态框和通知是真的香，再也不用管 z-index 层级问题了。",
        time: "2 天前",
        likes: 6,
        liked: false,
        replyTo: "孙大强",
      },
    ],
  },
  {
    id: 7,
    name: "吴前端",
    avatar: writerAvatar,
    content:
      "刚把公司老项目从 Vue 2 迁移到 Vue 3，整体用了两个月，踩了不少坑，不过迁移完之后开发效率确实提升了不少。",
    time: "5 天前",
    likes: 28,
    liked: false,
  },
  {
    id: 8,
    name: "李全栈",
    avatar: officerAvatar,
    content:
      "作为后端转前端的开发者，Composition API 的写法更接近普通函数调用，学习曲线比 Options API 平缓很多，强烈推荐。",
    time: "1 周前",
    likes: 15,
    liked: false,
  },
]);

const totalCount = computed(() => {
  let count = comments.value.length;
  comments.value.forEach((c) => {
    if (c.replies) count += c.replies.length;
  });
  return count;
});

// ── 评论分页 ──
const visibleComments = computed(() =>
  comments.value.slice(0, commentDisplayCount.value)
);
const hasMoreComments = computed(
  () => commentDisplayCount.value < comments.value.length
);

const loadMoreComments = () => {
  loadingMoreComments.value = true;
  setTimeout(() => {
    commentDisplayCount.value += COMMENT_PAGE_SIZE;
    loadingMoreComments.value = false;
  }, 300);
};

// ── 回复展开 ──
const getVisibleReplies = (comment: CommentItem) => {
  const count = replyExpandMap.get(comment.id) ?? REPLY_INIT_COUNT;
  return comment.replies?.slice(0, count) ?? [];
};
const hasMoreReplies = (comment: CommentItem) => {
  const shown = replyExpandMap.get(comment.id) ?? REPLY_INIT_COUNT;
  return (comment.replies?.length ?? 0) > shown;
};
const expandReplies = (comment: CommentItem) => {
  replyExpandMap.set(comment.id, comment.replies?.length ?? 0);
};

const toggleLike = (item: CommentItem) => {
  item.liked = !item.liked;
  item.likes += item.liked ? 1 : -1;
};

const startReply = (target: CommentItem, parent?: CommentItem) => {
  replyTarget.value = target;
  replyParent.value = parent || target;
  inputFocused.value = true;
  nextTick(() => {
    inputCardRef.value?.scrollIntoView({ behavior: "smooth", block: "center" });
    textareaRef.value?.focus();
  });
};

const cancelReply = () => {
  replyTarget.value = null;
  replyParent.value = null;
};

const handleBlur = () => {
  if (!newComment.value.trim() && !replyTarget.value) {
    inputFocused.value = false;
  }
};

const submitComment = () => {
  if (!newComment.value.trim()) return;

  const newReply: CommentItem = {
    id: Date.now(),
    name: currentUser.name,
    avatar: currentUser.avatar,
    content: newComment.value.trim(),
    time: "刚刚",
    likes: 0,
    liked: false,
  };

  if (replyTarget.value && replyParent.value) {
    newReply.replyTo = replyTarget.value.name;
    if (!replyParent.value.replies) replyParent.value.replies = [];
    replyParent.value.replies.push(newReply);
  } else {
    comments.value.unshift(newReply);
  }

  newComment.value = "";
  replyTarget.value = null;
  replyParent.value = null;
};
</script>

<style scoped lang="scss">
.comments-section {
  background: #fff;
  border-radius: 24px;
  border: 1px solid rgba(226, 232, 240, 0.8);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02),
    0 12px 40px -12px rgba(15, 23, 42, 0.06);
  padding: 24px 28px;
  margin-top: 20px;
  transition: background 0.3s, border-color 0.3s, box-shadow 0.3s;

  &.dark-mode {
    background: #1e293b;
    border-color: rgba(51, 65, 85, 0.6);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05),
      0 12px 40px -12px rgba(0, 0, 0, 0.2);
  }
}

/* ── Header ── */
.comments-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(226, 232, 240, 0.5);

  .dark-mode & {
    border-bottom-color: rgba(51, 65, 85, 0.35);
  }
}

.header-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.header-icon-wrap {
  width: 32px;
  height: 32px;
  border-radius: 9px;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.12), rgba(168, 85, 247, 0.1));
  color: var(--primary, #3b82f6);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;

  .dark-mode & {
    background: linear-gradient(135deg, rgba(96, 165, 250, 0.18), rgba(167, 139, 250, 0.14));
    color: #60a5fa;
  }
}

.header-text {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.header-title {
  margin: 0;
  font-size: 16px;
  font-weight: 800;
  color: #0f172a;

  .dark-mode & {
    color: #f1f5f9;
  }
}

.header-sub {
  font-size: 12px;
  color: #94a3b8;
  font-weight: 500;
}

/* ── Input Card ── */
.comment-input-card {
  display: flex;
  gap: 12px;
  padding: 0;
  margin-bottom: 18px;
}

.input-avatar {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  flex-shrink: 0;
  margin-top: 2px;
  background: #e2e8f0;

  .dark-mode & {
    background: #334155;
  }
}

.input-body {
  flex: 1;
  min-width: 0;
}

.reply-hint {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 12px;
  margin-bottom: 8px;
  border-radius: 8px;
  background: rgba(59, 130, 246, 0.06);
  font-size: 12px;
  color: var(--primary, #3b82f6);
  font-weight: 500;

  strong {
    font-weight: 700;
  }

  .dark-mode & {
    background: rgba(96, 165, 250, 0.1);
  }
}

.reply-hint-close {
  width: 22px;
  height: 22px;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: #94a3b8;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  transition: all 0.2s;

  &:hover {
    background: rgba(0, 0, 0, 0.06);
    color: #475569;
  }
}

.input-textarea {
  width: 100%;
  border: 1px solid rgba(226, 232, 240, 0.6);
  border-radius: 12px;
  padding: 10px 14px;
  font-size: 13px;
  line-height: 1.6;
  color: #1f2937;
  background: transparent;
  resize: none;
  font-family: inherit;
  height: 40px;
  overflow: hidden;
  transition: height 0.3s ease-out, border-color 0.2s ease-out, box-shadow 0.2s ease-out;

  &.expanded {
    height: 88px;
  }

  &::placeholder {
    color: #94a3b8;
  }

  &:focus {
    outline: none;
    border-color: var(--primary, #3b82f6);
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.06);
  }

  .dark-mode & {
    background: transparent;
    border-color: rgba(51, 65, 85, 0.5);
    color: #e2e8f0;

    &::placeholder {
      color: #475569;
    }

    &:focus {
      border-color: #60a5fa;
      box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.1);
    }
  }
}

.input-actions {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 8px;
  margin-top: 10px;
}

.slide-fade-enter-active {
  transition: all 0.25s ease-out;
  overflow: hidden;
}

.slide-fade-leave-active {
  transition: all 0.2s ease-out;
  overflow: hidden;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
  max-height: 0;
  margin-top: 0;
}

.slide-fade-enter-to,
.slide-fade-leave-from {
  max-height: 50px;
  margin-top: 10px;
}

.cancel-reply-btn {
  padding: 6px 12px;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: #64748b;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: color 0.2s;

  &:hover {
    color: #334155;

    .dark-mode & {
      color: #cbd5e1;
    }
  }
}

.submit-btn {
  padding: 6px 16px;
  border: none;
  border-radius: 8px;
  background: var(--primary, #3b82f6);
  color: #fff;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  transition: all 0.2s ease-out;

  &:hover:not(:disabled) {
    background: #2563eb;
    transform: translateY(-1px);
    box-shadow: 0 3px 10px rgba(59, 130, 246, 0.25);
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
}

/* ── Comment List ── */
.comments-list {
  display: flex;
  flex-direction: column;
}

.comment-thread {
  &+.comment-thread {
    border-top: 1px solid rgba(226, 232, 240, 0.5);
    padding-top: 16px;
    margin-top: 16px;

    .dark-mode & {
      border-top-color: rgba(51, 65, 85, 0.35);
    }
  }
}

.comment-item {
  display: flex;
  gap: 12px;
}

.comment-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  flex-shrink: 0;
  background: #e2e8f0;

  &.small {
    width: 28px;
    height: 28px;
  }

  .dark-mode & {
    background: #334155;
  }
}

.comment-body {
  flex: 1;
  min-width: 0;
}

.comment-meta {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 4px;
  flex-wrap: wrap;
}

.comment-name {
  font-size: 13px;
  font-weight: 700;
  color: #0f172a;

  .dark-mode & {
    color: #f1f5f9;
  }
}

.author-badge {
  font-size: 10px;
  font-weight: 700;
  color: var(--primary, #3b82f6);
  background: rgba(59, 130, 246, 0.07);
  padding: 1px 6px;
  border-radius: 4px;

  .dark-mode & {
    color: #60a5fa;
    background: rgba(96, 165, 250, 0.12);
  }
}

.comment-time {
  font-size: 11px;
  color: #94a3b8;
}

.reply-to {
  font-size: 11px;
  color: #94a3b8;

  em {
    font-style: normal;
    color: var(--primary, #3b82f6);
    font-weight: 600;
  }
}

.comment-text {
  margin: 0 0 8px;
  font-size: 13px;
  line-height: 1.7;
  color: #334155;

  .dark-mode & {
    color: #cbd5e1;
  }
}

/* ── Action Buttons ── */
.comment-actions {
  display: flex;
  gap: 20px;
  margin-top: 2px;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 2px 0;
  border: none;
  background: none;
  color: #94a3b8;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: color 0.2s ease-out;

  svg {
    font-size: 13px;
    transition: transform 0.2s ease-out;
  }

  &:hover {
    color: var(--primary, #3b82f6);

    svg {
      transform: scale(1.15);
    }

    .dark-mode & {
      color: #60a5fa;
    }
  }

  &.liked {
    color: #ef4444;

    svg {
      transform: scale(1.1);
    }

    &:hover {
      color: #dc2626;
    }
  }
}

/* ── Replies ── */
.replies {
  margin-top: 12px;
  margin-left: 48px;
  padding-left: 12px;
  border-left: 2px solid rgba(59, 130, 246, 0.1);

  .dark-mode & {
    border-left-color: rgba(96, 165, 250, 0.12);
  }

  .comment-item+.comment-item {
    margin-top: 12px;
  }
}

/* ── Expand Replies ── */
.expand-replies-btn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  margin-top: 10px;
  padding: 4px 0;
  border: none;
  background: none;
  color: var(--primary, #3b82f6);
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: opacity 0.2s;

  svg {
    font-size: 10px;
    transition: transform 0.2s;
  }

  &:hover {
    opacity: 0.8;

    svg {
      transform: translateY(1px);
    }
  }

  .dark-mode & {
    color: #60a5fa;
  }
}

/* ── Load More Comments ── */
.load-more-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  width: 100%;
  padding: 14px 0 0;
  margin-top: 16px;
  border: none;
  border-top: 1px solid rgba(226, 232, 240, 0.5);
  border-radius: 0;
  background: none;
  color: #94a3b8;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: color 0.2s;

  .load-more-icon {
    font-size: 10px;
  }

  &:hover:not(:disabled) {
    color: var(--primary, #3b82f6);
  }

  &:disabled {
    cursor: not-allowed;
  }

  .dark-mode & {
    border-top-color: rgba(51, 65, 85, 0.35);
    color: #64748b;

    &:hover:not(:disabled) {
      color: #60a5fa;
    }
  }
}

/* ── Empty State ── */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 40px 0;
}

.empty-icon {
  font-size: 28px;
  color: #cbd5e1;

  .dark-mode & {
    color: #334155;
  }
}

.empty-text {
  margin: 0;
  font-size: 13px;
  color: #94a3b8;
}

/* ── Responsive ── */
@media (max-width: 640px) {
  .comments-section {
    padding: 18px;
    border-radius: 20px;
    margin-top: 16px;
  }

  .comments-header {
    padding-bottom: 12px;
  }

  .replies {
    margin-left: 24px;
    padding-left: 10px;
  }

  .comment-avatar {
    width: 32px;
    height: 32px;

    &.small {
      width: 24px;
      height: 24px;
    }
  }
}
</style>

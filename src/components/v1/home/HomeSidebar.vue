<template>
  <aside class="sidebar">

    <!-- Advertising Container (Slot-based) -->
    <AdContainer type="glass">
      <iframe
        src="https://static.nube.sh/html-video/speed-sc/1280x720/index.html?lp=https%3A%2F%2Fnube.sh%2Finvite%2F6723572561HYYC"
        style="width:100%; height:auto; border:none;"
        scrolling="no" frameborder="0">
      </iframe>
    </AdContainer>

    <!-- Mission -->
    <section class="panel">
      <h3 class="panel-title">
        <div class="panel-icon">
          <font-awesome-icon icon="list-check" />
        </div>
        专题任务
      </h3>
      <ul class="task-list">
        <li v-for="task in tasks" :key="task.name" class="task-item">
          <div class="task-top">
            <span class="task-name">{{ task.name }}</span>
            <span class="task-count">{{ task.done }}/{{ task.total }}</span>
          </div>
          <div class="progress-track">
            <div
              class="progress-fill"
              :style="{ width: `${(task.done / task.total) * 100}%` }"
            ></div>
          </div>
        </li>
      </ul>
      <button class="cta-btn" type="button">
        <font-awesome-icon icon="play" />
        继续学习
      </button>
    </section>

    <!-- Hot Tags -->
    <section class="panel">
      <h3 class="panel-title">
        <div class="panel-icon">
          <font-awesome-icon icon="tags" />
        </div>
        热门标签
      </h3>
      <div class="tag-grid">
        <button
          v-for="(tag, i) in tags"
          :key="tag"
          class="tag-btn"
          :class="`tc${i % 4}`"
          type="button"
        ># {{ tag }}</button>
      </div>
    </section>

    <!-- Second Ad Container (Improved Light Style) -->
    <AdContainer 
      title="加入技术沙龙" 
      description="与行业大佬零距离接触，探索最前沿的技术变迁与工程实践。"
      buttonText="立即报名"
      icon="users-rectangle"
      type="default"
    />

    <!-- Authors -->
    <section class="panel">
      <h3 class="panel-title">
        <div class="panel-icon">
          <font-awesome-icon icon="users" />
        </div>
        推荐作者
      </h3>
      <div class="author-list">
        <div v-for="person in authors" :key="person.name" class="author-row">
          <img :src="person.avatar" :alt="person.name" class="author-avatar" />
          <div class="author-info">
            <p class="author-name">{{ person.name }}</p>
            <span class="author-field">{{ person.field }}</span>
          </div>
          <button class="follow-btn" type="button">关注</button>
        </div>
      </div>
    </section>

  </aside>
</template>

<script setup lang="ts">
import AdContainer from '@/components/v1/common/AdContainer.vue'

defineProps<{ tags: string[] }>()

const tasks = [
  { name: '组件边界设计', done: 4, total: 6 },
  { name: '状态管理重构', done: 2, total: 5 },
  { name: '移动端适配', done: 3, total: 4 },
]

const authors = [
  { name: '林川', field: 'Vue 工程化', avatar: 'https://i.pravatar.cc/80?img=12' },
  { name: '张译', field: '前端性能', avatar: 'https://i.pravatar.cc/80?img=15' },
  { name: '阿宁', field: '设计系统', avatar: 'https://i.pravatar.cc/80?img=19' },
]
</script>

<style scoped lang="scss">
.sidebar {
  position: sticky;
  top: 130px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

/* ── Panel base ── */
.panel {
  background: #fff;
  border: 1px solid #E5E7EB;
  border-radius: 10px;
  padding: 16px;
}

.panel-title {
  margin: 0 0 14px;
  font-size: 13px;
  font-weight: 600;
  color: #111827;
  display: flex;
  align-items: center;
  gap: 8px;
}

.panel-icon {
  width: 24px;
  height: 24px;
  border-radius: 6px;
  background: #EFF6FF;
  color: #2563EB;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  flex-shrink: 0;
}

/* ── Task list ── */
.task-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.task-item { display: flex; flex-direction: column; gap: 5px; }

.task-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.task-name {
  font-size: 12px;
  font-weight: 500;
  color: #374151;
}

.task-count {
  font-size: 11px;
  font-weight: 600;
  color: #2563EB;
}

.progress-track {
  height: 4px;
  border-radius: 999px;
  background: #F3F4F6;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 999px;
  background: #2563EB;
  transition: width 500ms ease;
}

.cta-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin-top: 14px;
  width: 100%;
  padding: 8px;
  border-radius: 8px;
  border: 1px solid #BFDBFE;
  background: #EFF6FF;
  color: #2563EB;
  font-size: 12.5px;
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
  transition: all 150ms ease;

  &:hover {
    background: #DBEAFE;
    border-color: #93C5FD;
  }
}

/* ── Tags ── */
.tag-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.tag-btn {
  border-radius: 5px;
  font-size: 11.5px;
  font-weight: 500;
  padding: 4px 10px;
  border: 1px solid;
  cursor: pointer;
  font-family: inherit;
  transition: all 120ms ease;

  &:hover { opacity: 0.75; }
}

.tag-btn.tc0 { color: #1D4ED8; background: #EFF6FF; border-color: #BFDBFE; }
.tag-btn.tc1 { color: #7C3AED; background: #F5F3FF; border-color: #DDD6FE; }
.tag-btn.tc2 { color: #0F766E; background: #F0FDFA; border-color: #99F6E4; }
.tag-btn.tc3 { color: #92400E; background: #FFFBEB; border-color: #FDE68A; }

/* ── Authors ── */
.author-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.author-row {
  display: grid;
  grid-template-columns: 34px 1fr auto;
  gap: 9px;
  align-items: center;
}

.author-avatar {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid #E5E7EB;
  display: block;
}

.author-info { min-width: 0; }

.author-name {
  margin: 0;
  font-size: 12.5px;
  font-weight: 600;
  color: #111827;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.author-field {
  font-size: 11px;
  color: #9CA3AF;
}

.follow-btn {
  padding: 4px 10px;
  border: 1px solid #E5E7EB;
  border-radius: 6px;
  background: #fff;
  color: #374151;
  font-size: 11.5px;
  font-weight: 500;
  cursor: pointer;
  font-family: inherit;
  transition: all 120ms ease;
  white-space: nowrap;

  &:hover {
    border-color: #BFDBFE;
    background: #EFF6FF;
    color: #2563EB;
  }
}

/* ── Responsive ── */
@media (max-width: 1100px) {
  .sidebar {
    position: static;
    display: grid;
    grid-template-columns: 1fr 1fr;
  }

  .sidebar > section:last-child {
    grid-column: 1 / -1;
    .author-list {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 8px;
    }
  }
}

@media (max-width: 640px) {
  .sidebar { grid-template-columns: 1fr; }
  .sidebar > section:last-child {
    .author-list { grid-template-columns: 1fr; }
  }
}
</style>

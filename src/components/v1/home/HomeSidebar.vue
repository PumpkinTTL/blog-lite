<template>
  <aside class="sidebar">
    <!-- Advertising Container (Slot-based) -->
    <AdContainer type="glass">
      <iframe
        src="https://static.nube.sh/html-video/speed-sc/1280x720/index.html?lp=https%3A%2F%2Fnube.sh%2Finvite%2F6723572561HYYC"
        style="width: 100%; height: auto; border: none" scrolling="no" frameborder="0">
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
            <div class="progress-fill" :style="{ width: `${(task.done / task.total) * 100}%` }"></div>
          </div>
        </li>
      </ul>
      <button class="cta-btn" type="button">
        <font-awesome-icon icon="play" />
        继续学习
      </button>
    </section>

    <!-- Second Ad Container (Improved Light Style) -->
    <AdContainer title="加入技术沙龙" description="与行业大佬零距离接触，探索最前沿的技术变迁与工程实践。" buttonText="立即报名" icon="users-rectangle"
      type="default" />
  </aside>
</template>

<script setup lang="ts">
import AdContainer from "@/components/v1/common/AdContainer.vue";

defineProps<{}>();

const tasks = [
  { name: "组件边界设计", done: 4, total: 6 },
  { name: "状态管理重构", done: 2, total: 5 },
  { name: "移动端适配", done: 3, total: 4 },
];
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
  border: 1px solid #e5e7eb;
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
  background: #eff6ff;
  color: #2563eb;
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

.task-item {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

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
  color: #2563eb;
}

.progress-track {
  height: 4px;
  border-radius: 999px;
  background: #f3f4f6;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 999px;
  background: #2563eb;
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
  border: 1px solid #bfdbfe;
  background: #eff6ff;
  color: #2563eb;
  font-size: 12.5px;
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
  transition: all 150ms ease;

  &:hover {
    background: #dbeafe;
    border-color: #93c5fd;
  }
}

/* ── Responsive ── */
@media (max-width: 1100px) {
  .sidebar {
    position: static;
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 640px) {
  .sidebar {
    grid-template-columns: 1fr;
  }
}
</style>

<template>
  <div class="site-info-card" :class="{ 'dark': isDark }">
    <div class="card-header">
      <div class="title-with-icon">
        <div class="icon-blob">
          <font-awesome-icon icon="chart-line" />
        </div>
        <span class="title">站点数据</span>
      </div>
      <div class="status-indicator">
        <span class="dot"></span>
        <span class="text">正在运行</span>
      </div>
    </div>

    <div class="stats-grid">
      <div class="stat-item" v-for="item in stats" :key="item.label">
        <div class="stat-icon" :style="{ color: item.color, background: `${item.color}15` }">
          <font-awesome-icon :icon="item.icon" />
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ item.value }}</div>
          <div class="stat-label">{{ item.label }}</div>
        </div>
      </div>
    </div>

    <div class="card-footer">
      <div class="manifesto">
        <font-awesome-icon icon="bolt" class="bolt" />
        <span>精选优质资源，记录技术成长</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useThemeStore } from '@/stores/theme';

const themeStore = useThemeStore();
const isDark = computed(() => themeStore.isDark);

const stats = [
  { label: '内容总计', value: '3,248', icon: 'newspaper', color: '#6366f1' },
  { label: '建站天数', value: '512+', icon: 'calendar-days', color: '#10b981' },
  { label: '今日到访', value: '1.2k', icon: 'fire', color: '#f43f5e' },
  { label: '累计访客', value: '45.8k', icon: 'users', color: '#f59e0b' }
];
</script>

<style scoped lang="scss">
.site-info-card {
  --primary: #6366f1;
  --bg-card: #ffffff;
  --text-main: #1e293b;
  --text-soft: #64748b;
  --text-pale: #94a3b8;
  --border: #f1f5f9;
  --shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05);

  &.dark {
    --bg-card: #1e293b;
    --text-main: #f1f5f9;
    --text-soft: #94a3b8;
    --text-pale: #475569;
    --border: #334155;
    --shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.2);
  }

  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 20px;
  padding: 18px;
  width: 100%;
  box-shadow: var(--shadow);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-family: 'OPPO Sans', sans-serif;
  overflow: hidden;
  position: relative;

  &:hover {
    transform: translateY(-4px);
    border-color: var(--primary);
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
  }
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  .title-with-icon {
    display: flex;
    align-items: center;
    gap: 10px;
    .icon-blob {
      width: 32px;
      height: 32px;
      background: var(--primary);
      color: white;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
    }
    .title {
      font-weight: 700;
      font-size: 15px;
      color: var(--text-main);
    }
  }

  .status-indicator {
    display: flex;
    align-items: center;
    gap: 6px;
    background: #10b98115;
    padding: 4px 10px;
    border-radius: 20px;
    .dot {
      width: 6px;
      height: 6px;
      background: #10b981;
      border-radius: 50%;
      animation: pulse 1.5s infinite;
    }
    .text {
      font-size: 11px;
      font-weight: 700;
      color: #10b981;
    }
  }
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 16px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 10px;
  background: var(--border);
  padding: 12px;
  border-radius: 16px;
  border: 1px solid transparent;
  transition: all 0.2s;

  &:hover {
    background: var(--bg-card);
    border-color: var(--border);
    transform: scale(1.02);
  }

  .stat-icon {
    width: 34px;
    height: 34px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
  }

  .stat-content {
    display: flex;
    flex-direction: column;
    .stat-value {
      font-weight: 800;
      font-size: 14px;
      color: var(--text-main);
      line-height: 1.2;
    }
    .stat-label {
      font-size: 11px;
      color: var(--text-soft);
      font-weight: 600;
    }
  }
}

.card-footer {
  padding-top: 14px;
  border-top: 1px dashed var(--border);
  .manifesto {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 11px;
    font-weight: 600;
    color: var(--text-soft);
    .bolt {
      color: var(--primary);
    }
  }
}

@keyframes pulse {
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.4); opacity: 0.5; }
  100% { transform: scale(1); opacity: 1; }
}

/* Mobile Compatibility */
@media (max-width: 640px) {
  .site-info-card {
    max-width: 100%;
    margin: 10px 0;
  }
  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>

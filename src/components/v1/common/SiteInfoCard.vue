<template>
  <div class="site-info-card" :class="{ 'dark': isDark }">
    <!-- REFINED HEADER WITH THEME-COLORED SHIMMER -->
    <div class="stats-header-integrated">
      <div class="brand-unit">
        <div class="accent-logo">
          <font-awesome-icon icon="chart-line" />
        </div>
        <div class="text-meta">
          <h3 class="shimmer-title">站点实时概览</h3>
          <p class="en-sub">LIVE ANALYTICS MONITOR</p>
        </div>
      </div>
      <div class="status-badge">
        <span class="pulsing-dot"></span>
        <span class="status-name">运行中</span>
      </div>
    </div>

    <!-- REVERTED STATS GRID WITH LIGHTER TINTS -->
    <div class="stats-grid">
      <div class="stat-item" v-for="item in stats" :key="item.label">
        <div class="stat-icon" :style="{ color: item.color, background: `${item.color}05` }">
          <font-awesome-icon :icon="item.icon" />
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ item.value }}</div>
          <div class="stat-label">{{ item.label }}</div>
        </div>
      </div>
    </div>

    <!-- CLEAN FOOTER -->
    <div class="card-footer">
      <div class="manifesto">
        <font-awesome-icon icon="bolt" class="bolt-icon" />
        <span>精选优质内容，记录技术成长</span>
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
  { label: '内容总计', value: '3,248', icon: 'newspaper', color: '#3b82f6' },
  { label: '建站天数', value: '512+', icon: 'calendar-days', color: '#10b981' },
  { label: '今日到访', value: '1.2k', icon: 'fire', color: '#f43f5e' },
  { label: '累计访客', value: '45.8k', icon: 'users', color: '#f59e0b' }
];
</script>

<style scoped lang="scss">
.site-info-card {
  --bg-card: #ffffff;
  --text-main: #1e293b;
  --text-soft: #64748b;
  --border: #f1f5f9;
  --green: #10b981;

  &.dark {
    --bg-card: #1e293b;
    --text-main: #f1f5f9;
    --text-soft: #94a3b8;
    --border: #334155;
  }

  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 14px;
  width: 100%;
  font-family: 'OPPO Sans', sans-serif;
  overflow: hidden;
  transition: all 0.35s ease;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.02);
  padding-bottom: 4px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 16px 24px -10px rgba(0, 0, 0, 0.05);
  }
}

/* ── REFINED HEADER (THEME COLORED SHIMMER) ── */
.stats-header-integrated {
  padding: 18px 20px 16px;
  border-bottom: 1px solid var(--border);
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .brand-unit {
    display: flex; align-items: center; gap: 12px;
    .accent-logo {
      width: 32px; height: 32px; color: var(--primary);
      background: color-mix(in srgb, var(--primary), transparent 94%);
      border-radius: 8px; display: flex; align-items: center; justify-content: center;
      font-size: 14px; border: 1px solid color-mix(in srgb, var(--primary), transparent 88%);
    }
    .text-meta {
      .shimmer-title {
        font-size: 13.5px; font-weight: 800; margin: 0; line-height: 1.2;
        /* THEME COLORED (INDIGO) SHIMMER */
        background: linear-gradient(110deg, var(--primary) 0%, var(--primary) 48%, rgba(255,255,255,0.25) 50%, var(--primary) 52%, var(--primary) 100%);
        background-size: 200% auto; color: transparent; -webkit-background-clip: text; background-clip: text;
        animation: shimmer-anim 5s infinite linear;
      }
      .en-sub { font-size: 8px; font-weight: 700; color: var(--text-soft); opacity: 0.6; letter-spacing: 0.12em; margin-top: 2px; }
    }
  }

  .status-badge {
    display: flex; align-items: center; gap: 5px;
    padding: 3px 10px; background: rgba(16, 185, 129, 0.06);
    border: 1px solid rgba(16, 185, 129, 0.15); border-radius: 100px;
    .pulsing-dot { width: 4.5px; height: 4.5px; background: var(--green); border-radius: 50%; opacity: 0.8; box-shadow: 0 0 6px var(--green); animation: pulse-dot 2s infinite; }
    .status-name { font-size: 9px; font-weight: 800; color: var(--green); }
  }
}

/* ── REVERTED STATS GRID (LIGHT TINTS) ── */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  padding: 0 18px 18px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 10px;
  background: rgba(241, 245, 249, 0.4); /* LIGHTER POD BG */
  padding: 12px;
  border-radius: 12px;
  transition: all 0.2s;

  &.dark { background: rgba(51, 65, 85, 0.3); }

  &:hover {
    background: var(--bg-card);
    transform: translateY(-1px);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.03);
  }

  .stat-icon {
    width: 32px; height: 32px; border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    font-size: 13px;
  }

  .stat-content {
    display: flex; flex-direction: column;
    .stat-value { font-weight: 800; font-size: 14.5px; color: var(--text-main); line-height: 1.1; }
    .stat-label { font-size: 10.5px; color: var(--text-soft); font-weight: 600; margin-top: 2px; }
  }
}

/* ── FOOTER Area ── */
.card-footer {
  padding: 12px 18px;
  border-top: 1px dashed var(--border);
  .manifesto {
    display: flex; align-items: center; gap: 8px;
    font-size: 10.5px; font-weight: 600; color: var(--text-soft);
    .bolt-icon { color: var(--primary); font-size: 9px; }
  }
}

/* ANIMS */
@keyframes shimmer-anim { 0% { background-position: 120% center; } 100% { background-position: -120% center; } }
@keyframes pulse-dot { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.4); opacity: 0.5; } }

/* Mobile */
@media (max-width: 640px) {
  .site-info-card { max-width: 100%; }
  .stats-grid { grid-template-columns: 1fr; }
}
</style>

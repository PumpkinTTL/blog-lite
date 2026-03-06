<template>
  <div class="home">
    <BlogHeader />

    <main class="main">
      <div class="container">
        <!-- Hero Section -->
        <div class="hero">
          <h1 class="hero-title">你好，姓苏丘比特 👋</h1>
        </div>

        <!-- Stats Grid -->
        <div class="stats-grid">
          <!-- Stat Card 1 - Users -->
          <div class="stat-card purple">
            <div class="stat-icon">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
              >
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <div class="stat-value">12,489</div>
            <div class="stat-label">活跃用户</div>
            <div class="stat-badge success">✓ 配额充足</div>
          </div>

          <!-- Stat Card 2 - Gemini -->
          <div class="stat-card green">
            <div class="stat-icon">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
              >
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
            </div>
            <div class="stat-value">100%</div>
            <div class="stat-label">Gemini 平均配额</div>
            <div class="stat-badge success">✓ 配额充足</div>
          </div>

          <!-- Stat Card 3 - Claude -->
          <div class="stat-card cyan">
            <div class="stat-icon">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
              >
                <path
                  d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"
                />
              </svg>
            </div>
            <div class="stat-value">100%</div>
            <div class="stat-label">Claude 平均配额</div>
            <div class="stat-badge success">✓ 配额充足</div>
          </div>

          <!-- Stat Card 4 - Warning -->
          <div class="stat-card orange">
            <div class="stat-icon">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
              >
                <path
                  d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
                />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </div>
            <div class="stat-value">0</div>
            <div class="stat-label">低配额账号</div>
            <div class="stat-badge warning">配额 < 20%</div>
          </div>
        </div>

        <!-- Action Cards -->
        <div class="action-section">
          <div class="action-card">
            <div class="action-header">
              <div class="action-icon success">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <h3>当前账号</h3>
            </div>
            <div class="account-info">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
              >
                <path
                  d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
                />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              <span>huanghuabin442@gmail.com</span>
              <span class="badge-free">FREE</span>
            </div>
            <div class="quota-list">
              <div class="quota-item">
                <div class="quota-header">
                  <span class="quota-name">Gemini 3.1 Pro</span>
                  <span class="quota-time">R-6d 19h</span>
                  <span class="quota-percent">100%</span>
                </div>
                <div class="progress-bar">
                  <div class="progress-fill green" style="width: 100%"></div>
                </div>
              </div>
              <div class="quota-item">
                <div class="quota-header">
                  <span class="quota-name">Gemini 3 Flash</span>
                  <span class="quota-time">R-6d 19h</span>
                  <span class="quota-percent">100%</span>
                </div>
                <div class="progress-bar">
                  <div class="progress-fill green" style="width: 100%"></div>
                </div>
              </div>
              <div class="quota-item">
                <div class="quota-header">
                  <span class="quota-name">Claude 系列</span>
                  <span class="quota-time">R-6d 19h</span>
                  <span class="quota-percent">100%</span>
                </div>
                <div class="progress-bar">
                  <div class="progress-fill cyan" style="width: 100%"></div>
                </div>
              </div>
            </div>
            <button class="btn-outline">切换账号</button>
          </div>

          <div class="action-card">
            <div class="action-header">
              <div class="action-icon info">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                >
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                </svg>
              </div>
              <h3>最佳账号推荐</h3>
            </div>
            <div class="empty-state">
              <p>无数据</p>
            </div>
          </div>
        </div>

        <!-- Bottom Actions -->
        <div class="bottom-actions">
          <button class="btn-link">
            查看所有账号
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
          <button class="btn-link purple">
            导出账号数据
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
          </button>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import BlogHeader from "@/components/v1/layout/BlogHeader.vue";
</script>

<style scoped lang="scss">
.home {
  min-height: 100vh;
  background: var(--bg);
}

.main {
  padding-top: 72px; /* Account for fixed header */
  padding-bottom: var(--space-16);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--space-6);
}

// ── Hero ──
.hero {
  margin-bottom: var(--space-8);
}

.hero-title {
  font-size: 32px;
  font-weight: 600;
  color: var(--text);
  letter-spacing: -0.02em;
}

// ── Stats Grid ──
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: var(--space-4);
  margin-bottom: var(--space-8);
}

.stat-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: var(--space-5);
  transition: all var(--transition);

  &:hover {
    box-shadow: var(--shadow-md);
    transform: translateY(-2px);
  }

  &.purple {
    .stat-icon {
      background: var(--secondary-light);
      color: var(--secondary);
    }
  }

  &.green {
    .stat-icon {
      background: var(--success-light);
      color: var(--success);
    }
  }

  &.cyan {
    .stat-icon {
      background: var(--cyan-light);
      color: var(--cyan);
    }
  }

  &.orange {
    .stat-icon {
      background: var(--orange-light);
      color: var(--orange);
    }
  }
}

.stat-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius);
  margin-bottom: var(--space-3);
}

.stat-value {
  font-size: 32px;
  font-weight: 700;
  color: var(--text);
  margin-bottom: var(--space-1);
  line-height: 1;
}

.stat-label {
  font-size: 13px;
  color: var(--text-secondary);
  margin-bottom: var(--space-3);
}

.stat-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: var(--radius-sm);
  font-size: 12px;
  font-weight: 500;

  &.success {
    background: var(--success-light);
    color: var(--success);
  }

  &.warning {
    background: var(--warning-light);
    color: var(--warning);
  }
}

// ── Action Section ──
.action-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-6);
  margin-bottom: var(--space-8);

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}

.action-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
}

.action-header {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  margin-bottom: var(--space-5);

  h3 {
    font-size: 16px;
    font-weight: 600;
    color: var(--text);
  }
}

.action-icon {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius);

  &.success {
    background: var(--success-light);
    color: var(--success);
  }

  &.info {
    background: var(--info-light);
    color: var(--info);
  }
}

.account-info {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-3);
  background: var(--bg);
  border-radius: var(--radius);
  margin-bottom: var(--space-5);
  font-size: 14px;
  color: var(--text-secondary);

  svg {
    color: var(--text-tertiary);
  }

  span {
    flex: 1;
  }
}

.badge-free {
  padding: 2px 8px;
  background: var(--border-light);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  font-size: 11px;
  font-weight: 600;
  color: var(--text-tertiary);
}

.quota-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  margin-bottom: var(--space-5);
}

.quota-item {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.quota-header {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  font-size: 13px;
}

.quota-name {
  flex: 1;
  font-weight: 500;
  color: var(--text);
}

.quota-time {
  color: var(--text-tertiary);
  font-size: 12px;
}

.quota-percent {
  font-weight: 600;
  color: var(--text);
}

.progress-bar {
  height: 6px;
  background: var(--border-light);
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 3px;
  transition: width var(--transition);

  &.green {
    background: var(--success);
  }

  &.cyan {
    background: var(--cyan);
  }
}

.btn-outline {
  width: 100%;
  padding: var(--space-3);
  background: transparent;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  font-size: 14px;
  font-weight: 500;
  color: var(--text);
  cursor: pointer;
  transition: all var(--transition);

  &:hover {
    background: var(--bg);
    border-color: var(--primary);
    color: var(--primary);
  }
}

.empty-state {
  padding: var(--space-16) 0;
  text-align: center;
  color: var(--text-tertiary);
  font-size: 14px;
}

// ── Bottom Actions ──
.bottom-actions {
  display: flex;
  gap: var(--space-4);
  flex-wrap: wrap;
}

.btn-link {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: 0;
  background: transparent;
  border: none;
  font-size: 14px;
  font-weight: 500;
  color: var(--info);
  cursor: pointer;
  transition: all var(--transition);

  &:hover {
    color: var(--primary-hover);
  }

  &.purple {
    color: var(--secondary);

    &:hover {
      color: var(--primary);
    }
  }

  svg {
    width: 16px;
    height: 16px;
  }
}
</style>

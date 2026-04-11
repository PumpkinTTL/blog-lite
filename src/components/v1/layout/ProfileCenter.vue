<template>
  <a-modal
    :open="isOpen"
    :footer="null"
    :closable="false"
    :width="modalWidth"
    centered
    destroy-on-close
    :body-style="{ padding: 0, overflow: 'hidden', borderRadius: '16px' }"
    wrap-class-name="profile-center-modal"
    @cancel="emit('close')"
  >
    <div class="profile-container" :class="{ 'dark-mode': isDark }">
      <!-- 顶部条（仅移动端显示或作为控制条） -->
      <div class="mobile-header">
        <span class="mobile-title">{{ currentMenuLabel }}</span>
        <button class="icon-btn" @click="emit('close')">
          <font-awesome-icon icon="xmark" />
        </button>
      </div>

      <!-- 左侧边栏 -->
      <aside
        class="sidebar"
        :class="{ 'mobile-hidden': isMobile && !sidebarOpen }"
      >
        <div class="sidebar-top">
          <div class="brand">
            <div class="brand-icon">
              <font-awesome-icon icon="user-gear" />
            </div>
            <div class="brand-text">
              <h3>账户设置</h3>
              <p>ACCOUNT SETTINGS</p>
            </div>
          </div>

          <nav class="nav-list">
            <button
              v-for="item in menuItems"
              :key="item.id"
              class="nav-item"
              :class="{ active: activeTab === item.id }"
              @click="handleTabChange(item.id)"
            >
              <font-awesome-icon :icon="item.icon" class="nav-icon" />
              <span>{{ item.label }}</span>
            </button>
          </nav>
        </div>

        <div class="sidebar-bottom">
          <div class="user-card">
            <div class="user-avatar-small">
              <img :src="user.avatar" />
              <div v-if="user.isVip" class="vip-dot"></div>
            </div>
            <div class="user-info-small">
              <span class="name">{{ user.username }}</span>
              <span class="role">PRO USER</span>
            </div>
          </div>
        </div>
      </aside>

      <!-- 主内容区 -->
      <main class="main-area">
        <!-- 桌面端标题栏 -->
        <header class="desktop-header">
          <div class="title-group">
            <h1>{{ currentMenuLabel }}</h1>
            <p>{{ currentMenuDesc }}</p>
          </div>
          <div class="action-group">
            <button class="btn-ghost" @click="resetForm">
              <font-awesome-icon icon="rotate-left" />
              <span>还原</span>
            </button>
            <button
              class="btn-primary"
              @click="saveChanges"
              :disabled="isSaving"
            >
              <font-awesome-icon v-if="isSaving" icon="spinner" spin />
              <font-awesome-icon v-else icon="check" />
              <span>{{ isSaving ? "保存中" : "保存更改" }}</span>
            </button>
            <button class="close-btn-desktop" @click="emit('close')">
              <font-awesome-icon icon="xmark" />
            </button>
          </div>
        </header>

        <!-- 内容区域 -->
        <div class="content-wrapper custom-scrollbar">
          <transition name="page-fade" mode="out-in">
            <!-- 个人资料面板 -->
            <div
              v-if="activeTab === 'profile'"
              key="profile"
              class="panel profile-panel"
            >
              <!-- 头像部分 -->
              <section class="form-section">
                <div class="section-content avatar-row">
                  <div class="avatar-box-wrapper">
                    <div class="avatar-box">
                      <img :src="user.avatar" />
                      <button class="avatar-overlay">
                        <font-awesome-icon icon="camera" />
                        <span>更换</span>
                      </button>
                    </div>
                  </div>
                  <div class="avatar-meta">
                    <h3>个人头像</h3>
                    <p>支持 JPG、PNG 或 WebP 格式</p>
                    <p>推荐尺寸 400x400px，大小不超过 2MB</p>
                  </div>
                </div>
              </section>

              <!-- 基本信息部分 -->
              <section class="form-section">
                <div class="section-grid">
                  <div class="field-item">
                    <label>用户昵称</label>
                    <div class="input-wrapper">
                      <input
                        v-model="formData.username"
                        type="text"
                        placeholder="请输入昵称"
                        spellcheck="false"
                      />
                    </div>
                    <p class="field-hint">展示在您的个人主页与评论区</p>
                  </div>

                  <div class="field-item">
                    <label>电子邮箱</label>
                    <div class="input-wrapper readonly">
                      <input v-model="formData.email" type="email" readonly />
                      <div class="status-badge verified">
                        <font-awesome-icon icon="circle-check" />
                        <span>已认证</span>
                      </div>
                    </div>
                    <p class="field-hint">您的账户登录与通知接收邮箱</p>
                  </div>

                  <div class="field-item col-span-2">
                    <div class="label-with-meta">
                      <label>个人简介</label>
                      <span class="count">{{ formData.bio.length }}/200</span>
                    </div>
                    <div class="input-wrapper">
                      <textarea
                        v-model="formData.bio"
                        maxlength="200"
                        placeholder="介绍一下你自己..."
                      ></textarea>
                    </div>
                    <p class="field-hint">用一句话向社区表达您的态度</p>
                  </div>
                </div>
              </section>
            </div>

            <!-- 安全隐私面板 -->
            <div
              v-else-if="activeTab === 'security'"
              key="security"
              class="panel"
            >
              <div class="security-cards">
                <div class="s-card">
                  <div class="s-card-lead">
                    <div class="s-icon purple">
                      <font-awesome-icon icon="lock" />
                    </div>
                    <div class="s-text">
                      <h4>登录账户密码</h4>
                      <p>上次修改于 3 个月前</p>
                    </div>
                  </div>
                  <button class="btn-small">重置密码</button>
                </div>
                <div class="s-card">
                  <div class="s-card-lead">
                    <div class="s-icon blue">
                      <font-awesome-icon icon="shield-halved" />
                    </div>
                    <div class="s-text">
                      <h4>双重身份验证 (2FA)</h4>
                      <p>显著提高您的账户安全性级别</p>
                    </div>
                  </div>
                  <div
                    class="s-toggle"
                    :class="{ active: authEnabled }"
                    @click="authEnabled = !authEnabled"
                  >
                    <div class="toggle-nob"></div>
                  </div>
                </div>
                <div class="s-card danger">
                  <div class="s-card-lead">
                    <div class="s-icon red">
                      <font-awesome-icon icon="circle-xmark" />
                    </div>
                    <div class="s-text">
                      <h4>注销账号</h4>
                      <p>永久删除您的所有数据和账户记录</p>
                    </div>
                  </div>
                  <button class="btn-small danger">立即注销</button>
                </div>
              </div>
            </div>

            <!-- 活动动态面板 -->
            <div
              v-else-if="activeTab === 'activity'"
              key="activity"
              class="panel activity-panel"
            >
              <div class="activity-feed">
                <div v-for="act in activities" :key="act.id" class="feed-item">
                  <div class="feed-line"></div>
                  <div class="feed-marker"></div>
                  <div class="feed-body">
                    <div class="feed-header">
                      <span class="feed-type">{{ act.type }}</span>
                      <span class="feed-time">{{ act.time }}</span>
                    </div>
                    <p class="feed-title">{{ act.title }}</p>
                    <p v-if="act.desc" class="feed-desc">{{ act.desc }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- 偏好设置面板 -->
            <div
              v-else-if="activeTab === 'preferences'"
              key="preferences"
              class="panel"
            >
              <div class="pref-list">
                <div class="pref-item">
                  <div class="pref-info">
                    <h4>实时通知</h4>
                    <p>当收到回复或点赞时立即推送到设备</p>
                  </div>
                  <div class="s-toggle active">
                    <div class="toggle-nob"></div>
                  </div>
                </div>
                <div class="pref-item">
                  <div class="pref-info">
                    <h4>邮件订阅</h4>
                    <p>每周接收精选文章和社区动态</p>
                  </div>
                  <div class="s-toggle"><div class="toggle-nob"></div></div>
                </div>
                <div class="pref-item">
                  <div class="pref-info">
                    <h4>公开可见性</h4>
                    <p>允许其他人在社区中找到您的主页</p>
                  </div>
                  <div class="s-toggle active">
                    <div class="toggle-nob"></div>
                  </div>
                </div>
              </div>
            </div>
          </transition>
        </div>
      </main>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, computed, reactive, onMounted, onUnmounted } from "vue";
import { message } from "ant-design-vue";

const props = defineProps({
  isOpen: { type: Boolean, default: false },
  isDark: { type: Boolean, default: false },
});

const emit = defineEmits(["close"]);

const activeTab = ref("profile");
const isSaving = ref(false);
const sidebarOpen = ref(false);
const authEnabled = ref(false);
const isMobile = ref(false);

const modalWidth = computed(() => (isMobile.value ? "100%" : 840));

const user = reactive({
  username: "又是一年冬",
  email: "zhangsan@example.com",
  avatar:
    "https://img2.woyaogexing.com/2025/04/05/2d3c285633cc350b263ae66888c525ed.jpg",
  isVip: true,
  bio: "热爱生活，专注于前端开发。在这里分享我的技术视野与点滴思考。",
});

const formData = reactive({ ...user });

// UI 装饰状态
const activeField = ref("");

const menuItems = [
  {
    id: "profile",
    label: "基本资料",
    icon: "user-circle",
    desc: "管理您的个人品牌与基本身份信息",
  },
  {
    id: "security",
    label: "隐私安全",
    icon: "shield-halved",
    desc: "强化账户防御，保护您的数据隐私",
  },
  {
    id: "activity",
    label: "足迹动态",
    icon: "clock-rotate-left",
    desc: "回顾您在社区中留下的每一个精彩瞬间",
  },
  {
    id: "preferences",
    label: "环境偏好",
    icon: "sliders",
    desc: "定制您的专属博客浏览与通知体验",
  },
];

const currentMenuLabel = computed(
  () => menuItems.find((m) => m.id === activeTab.value)?.label || ""
);
const currentMenuDesc = computed(
  () => menuItems.find((m) => m.id === activeTab.value)?.desc || ""
);

const activities = ref([
  {
    id: 1,
    type: "COMMENT",
    time: "2h ago",
    title: "回复了《Vue3 架构实践》",
    desc: "这篇文章关于解耦的思路非常清晰，获益匪浅。",
  },
  {
    id: 2,
    type: "LIKE",
    time: "1d ago",
    title: "点赞了《现代 CSS 魔法》",
    desc: "",
  },
  {
    id: 3,
    type: "POST",
    time: "3d ago",
    title: "发布了新文章《TypeScript 进阶指南》",
    desc: "基于 TS 5.0 的新特性探索...",
  },
]);

const handleTabChange = (id: string) => {
  activeTab.value = id;
  if (isMobile.value) sidebarOpen.value = false;
};

const resetForm = () => {
  Object.assign(formData, user);
  message.info("已重置变更内容");
};

const saveChanges = () => {
  isSaving.value = true;
  setTimeout(() => {
    Object.assign(user, formData);
    isSaving.value = false;
    message.success("设置更新成功");
  }, 800);
};

const checkMobile = () => {
  isMobile.value = window.innerWidth <= 768;
};

onMounted(() => {
  checkMobile();
  window.addEventListener("resize", checkMobile);
});

onUnmounted(() => {
  window.removeEventListener("resize", checkMobile);
});
</script>

<style lang="scss" scoped>
/* 核心容器 */
.profile-container {
  display: flex;
  height: 600px;
  background: #ffffff;
  transition: all 0.3s ease;
  overflow: hidden;

  &.dark-mode {
    background: #0d1117;
    color: #c9d1d9;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    height: 100vh;
  }
}

/* 侧边栏 */
.sidebar {
  width: 210px;
  background: #f8fafc;
  border-right: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 24px 12px;
  transition: all 0.3s;

  .dark-mode & {
    background: #010409;
    border-right-color: #30363d;
  }

  @media (max-width: 768px) {
    display: none; /* 移动端可根据需要实现侧边切换 */
  }
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 8px;
  margin-bottom: 28px;
}

.brand-icon {
  width: 30px;
  height: 30px;
  background: #3b82f6;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 14px;
}

.brand-text {
  h3 {
    margin: 0;
    font-size: 13px;
    font-weight: 700;
    color: #0f172a;
  }
  p {
    margin: 0;
    font-size: 9px;
    font-weight: 800;
    color: #94a3b8;
    letter-spacing: 0.1em;
  }

  .dark-mode & {
    h3 {
      color: #f0f6fc;
    }
  }
}

.nav-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 8px;
  border: none;
  background: transparent;
  color: #64748b;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;

  &:hover {
    background: #f1f5f9;
    color: #0f172a;
  }
  &.active {
    background: #fff;
    color: #3b82f6;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
    font-weight: 600;
  }

  .dark-mode & {
    &:hover {
      background: #161b22;
      color: #f0f6fc;
    }
    &.active {
      background: #21262d;
      color: #58a6ff;
      box-shadow: none;
    }
  }
}

.nav-icon {
  width: 14px;
  font-size: 13px;
  opacity: 0.8;
}

.user-card {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #fff;
  padding: 10px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;

  .dark-mode & {
    background: #161b22;
    border-color: #30363d;
  }
}

.user-avatar-small {
  position: relative;
  img {
    width: 32px;
    height: 32px;
    border-radius: 6px;
    object-fit: cover;
  }
}

.vip-dot {
  position: absolute;
  top: -2px;
  right: -2px;
  width: 8px;
  height: 8px;
  background: #f59e0b;
  border: 2px solid #fff;
  border-radius: 50%;
  .dark-mode & {
    border-color: #161b22;
  }
}

.user-info-small {
  display: flex;
  flex-direction: column;
  .name {
    font-size: 12px;
    font-weight: 700;
    color: #1e293b;
    .dark-mode & {
      color: #f0f6fc;
    }
  }
  .role {
    font-size: 10px;
    color: #94a3b8;
    font-weight: 600;
  }
}

/* 主内容区 */
.main-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #fff;
  min-width: 0;

  .dark-mode & {
    background: #0d1117;
  }
}

.desktop-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 32px 48px 24px;
  border-bottom: 1px solid rgba(226, 232, 240, 0.8);

  .dark-mode & {
    border-bottom-color: rgba(48, 54, 61, 0.6);
  }

  @media (max-width: 768px) {
    display: none;
  }
}

.title-group {
  h1 {
    font-size: 24px;
    font-weight: 700;
    margin: 0 0 6px;
    color: #0f172a;
    letter-spacing: -0.02em;
    .dark-mode & {
      color: #f0f6fc;
    }
  }
  p {
    font-size: 14px;
    color: #64748b;
    font-weight: 450;
    margin: 0;
  }
}

.action-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.close-btn-desktop {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  border: none;
  background: transparent;
  color: #94a3b8;
  cursor: pointer;
  margin-left: 12px;
  transition: all 0.2s;
  &:hover {
    background: #f1f5f9;
    color: #ef4444;
  }
  .dark-mode & {
    &:hover {
      background: #21262d;
    }
  }
}

.mobile-header {
  display: none;
  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px;
    border-bottom: 1px solid #e2e8f0;
    .dark-mode & {
      border-bottom-color: #30363d;
    }
  }
}

.mobile-title {
  font-size: 16px;
  font-weight: 700;
}

/* 按钮通用 */
.btn-primary {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 20px;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(37, 99, 235, 0.3);
    filter: brightness(1.05);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
}

.btn-ghost {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px 16px;
  border: 1px solid #e2e8f0;
  background: #ffffff;
  color: #64748b;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  span {
    font-size: 13px;
  }

  &:hover {
    background: #f8fafc;
    color: #0f172a;
    border-color: #cbd5e1;
  }
  .dark-mode & {
    background: #0d1117;
    border-color: #30363d;
    color: #8b949e;
    &:hover {
      background: #161b22;
      color: #f0f6fc;
      border-color: #444c56;
    }
  }
}

/* --- 现代 SaaS 表单样式重写 --- */

.content-wrapper {
  padding: 0 48px 48px;
  @media (max-width: 768px) {
    padding: 0 24px 24px;
  }
}

.form-section {
  padding: 32px 0;
  border-bottom: 1px solid #f1f5f9;
  &:last-child {
    border-bottom: none;
  }
  .dark-mode & {
    border-bottom-color: #1e293b;
  }
}

.avatar-row {
  display: flex;
  align-items: center;
  gap: 32px;
}

.avatar-box {
  position: relative;
  width: 96px;
  height: 96px;
  border-radius: 50%;
  overflow: hidden;
  border: 1px solid #e2e8f0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);

  .dark-mode & {
    border-color: #30363d;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.avatar-meta {
  h3 {
    font-size: 16px;
    font-weight: 700;
    margin: 0 0 8px;
    color: #0f172a;
    letter-spacing: -0.01em;
    .dark-mode & {
      color: #f0f6fc;
    }
  }
  p {
    font-size: 13px;
    color: #94a3b8;
    margin: 4px 0;
    line-height: 1.4;
  }
}

.field-hint {
  font-size: 12px;
  color: #94a3b8;
  margin: 4px 0 0;
  line-height: 1.4;
}

.profile-panel {
  max-width: 720px;
}

.section-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px 24px;
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
}

.field-item {
  display: flex;
  flex-direction: column;
  gap: 8px;

  &.col-span-2 {
    grid-column: span 2;
  }

  label {
    font-size: 13px;
    font-weight: 600;
    color: #334155;
    .dark-mode & {
      color: #94a3b8;
    }
  }
}

.label-with-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .count {
    font-size: 11px;
    color: #94a3b8;
    font-variant-numeric: tabular-nums;
  }
}

.input-wrapper {
  position: relative;
  width: 100%;

  input,
  textarea {
    width: 100%;
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 10px 14px;
    font-size: 14px;
    color: #1e293b;
    line-height: 1.5;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    outline: none;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);

    &::placeholder {
      color: #94a3b8;
    }

    &:hover {
      border-color: #cbd5e1;
    }

    &:focus {
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
      background: #ffffff;
    }

    .dark-mode & {
      background: #0d1117;
      border-color: #30363d;
      color: #f0f6fc;
      box-shadow: none;
      &:focus {
        border-color: #58a6ff;
        box-shadow: 0 0 0 3px rgba(88, 166, 255, 0.15);
      }
    }
  }

  textarea {
    min-height: 120px;
    resize: vertical;
  }

  &.readonly {
    input {
      background: #f8fafc;
      border-color: #e2e8f0;
      color: #64748b;
      cursor: default;
      box-shadow: none;

      .dark-mode & {
        background: #161b22;
        border-color: #30363d;
        color: #8b949e;
      }
    }
  }
}

.status-badge {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  font-weight: 700;
  color: #10b981;
  background: rgba(16, 185, 129, 0.08);
  padding: 4px 10px;
  border-radius: 20px;
  border: 1px solid rgba(16, 185, 129, 0.1);
  pointer-events: none;

  .dark-mode & {
    background: rgba(16, 185, 129, 0.15);
  }
}

.label-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2px;
}

.char-count {
  font-size: 11px;
  color: #94a3b8;
  font-weight: 500;
  &.limit {
    color: #ef4444;
  }
}

/* 安全仪表盘 */
.security-cards {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.s-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  transition: all 0.2s;
  &:hover {
    border-color: #3b82f6;
    background: #fafafa;
  }
  .dark-mode & {
    border-color: #30363d;
    &:hover {
      background: #161b22;
    }
  }

  &.danger:hover {
    border-color: #ef4444;
    background: rgba(239, 68, 68, 0.02);
  }
}

.s-card-lead {
  display: flex;
  align-items: center;
  gap: 14px;
}

.s-icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  &.purple {
    background: rgba(139, 92, 246, 0.1);
    color: #8b5cf6;
  }
  &.blue {
    background: rgba(59, 130, 246, 0.1);
    color: #3b82f6;
  }
  &.red {
    background: rgba(239, 68, 68, 0.1);
    color: #ef4444;
  }
}

.s-text {
  h4 {
    margin: 0;
    font-size: 13px;
    font-weight: 700;
    color: #0f172a;
    .dark-mode & {
      color: #f0f6fc;
    }
  }
  p {
    margin: 0;
    font-size: 11px;
    color: #94a3b8;
  }
}

.btn-small {
  padding: 6px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  background: #fff;
  color: #475569;
  font-size: 11px;
  font-weight: 700;
  cursor: pointer;
  &:hover {
    background: #f8fafc;
    color: #0f172a;
  }
  &.danger {
    color: #ef4444;
    &:hover {
      background: #ef4444;
      color: #fff;
      border-color: #ef4444;
    }
  }
  .dark-mode & {
    background: #21262d;
    border-color: #30363d;
    color: #c9d1d9;
    &:hover {
      background: #30363d;
      color: #f0f6fc;
    }
  }
}

/* 开关组件 */
.s-toggle {
  width: 36px;
  height: 20px;
  background: #e2e8f0;
  border-radius: 10px;
  padding: 2px;
  display: flex;
  cursor: pointer;
  transition: all 0.3s;
  &.active {
    background: #22c55e;
    .toggle-nob {
      transform: translateX(16px);
    }
  }
  .dark-mode & {
    background: #30363d;
  }
}

.toggle-nob {
  width: 16px;
  height: 16px;
  background: #fff;
  border-radius: 50%;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.3s;
}

/* 动态流 */
.activity-feed {
  display: flex;
  flex-direction: column;
}

.feed-item {
  position: relative;
  display: flex;
  gap: 16px;
  padding-bottom: 24px;
  &:last-child {
    padding-bottom: 0;
    .feed-line {
      display: none;
    }
  }
}

.feed-line {
  position: absolute;
  left: 6px;
  top: 18px;
  bottom: 0;
  width: 2px;
  background: #f1f5f9;
  .dark-mode & {
    background: #21262d;
  }
}
.feed-marker {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 3px solid #3b82f6;
  background: #fff;
  z-index: 1;
  flex-shrink: 0;
  margin-top: 3px;
  .dark-mode & {
    background: #0d1117;
  }
}

.feed-body {
  flex: 1;
}
.feed-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}
.feed-type {
  font-size: 10px;
  font-weight: 800;
  color: #3b82f6;
}
.feed-time {
  font-size: 11px;
  color: #94a3b8;
}
.feed-title {
  margin: 0;
  font-size: 13px;
  font-weight: 700;
  color: #0f172a;
  .dark-mode & {
    color: #f0f6fc;
  }
}
.feed-desc {
  margin: 4px 0 0;
  font-size: 12px;
  color: #64748b;
  line-height: 1.4;
}

/* 偏好列表 */
.pref-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.pref-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-radius: 12px;
  background: #f8fafc;
  .dark-mode & {
    background: #161b22;
  }
}
.pref-info {
  h4 {
    margin: 0;
    font-size: 13px;
    font-weight: 700;
  }
  p {
    margin: 2px 0 0;
    font-size: 11px;
    color: #94a3b8;
  }
}

/* 滚动条 */
.custom-scrollbar {
  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: #e2e8f0;
    border-radius: 4px;
  }
  .dark-mode & {
    &::-webkit-scrollbar-thumb {
      background: #30363d;
    }
  }
}

/* 动画 */
.page-fade-enter-active,
.page-fade-leave-active {
  transition: all 0.2s ease;
}
.page-fade-enter-from {
  opacity: 0;
  transform: translateY(4px);
}
.page-fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>

<style lang="scss">
/* 穿透 Ant Design Modal 样式以移除默认内边距 */
.profile-center-modal {
  .ant-modal-content {
    padding: 0 !important;
    overflow: hidden;
    border-radius: 16px;
    background: transparent; // 允许容器自持背景
  }

  .ant-modal-body {
    padding: 0 !important;
  }
}
</style>

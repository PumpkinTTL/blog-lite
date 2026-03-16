<template>
  <a-modal
    :open="isOpen"
    :footer="null"
    :closable="false"
    :width="modalWidth"
    centered
    wrap-class-name="profile-modal"
    @cancel="close"
  >
    <section class="profile-shell" :class="{ dark: isDark }">
      <header class="profile-header">
        <div class="profile-user">
          <div class="profile-avatar-wrap">
            <img :src="form.avatar" alt="用户头像" class="profile-avatar" />
            <span class="profile-vip" v-if="isVip">
              <font-awesome-icon icon="crown" />
            </span>
          </div>
          <div class="profile-user-meta">
            <p class="profile-user-name">{{ form.username }}</p>
            <p class="profile-user-email">{{ form.email }}</p>
            <div class="profile-user-tags">
              <span class="profile-tag"><font-awesome-icon icon="check" /> 已认证</span>
              <span class="profile-tag profile-tag-muted">创作者</span>
            </div>
          </div>
        </div>

        <div class="profile-header-actions">
          <button class="btn btn-ghost" @click="resetForm">重置</button>
          <button class="btn btn-primary" @click="saveProfile">
            <font-awesome-icon icon="save" />
            <span>保存</span>
          </button>
          <button class="btn-icon" @click="close" aria-label="关闭">
            <font-awesome-icon icon="xmark" />
          </button>
        </div>
      </header>

      <main class="profile-layout custom-scrollbar">
        <aside class="profile-side">
          <article class="card">
            <div class="card-head">
              <h3>数据总览</h3>
              <span>近30天</span>
            </div>
            <div class="stat-list">
              <div class="stat-item" v-for="item in stats" :key="item.key">
                <span class="stat-icon"><font-awesome-icon :icon="item.icon" /></span>
                <div class="stat-body">
                  <p class="stat-value">{{ item.value }}</p>
                  <p class="stat-label">{{ item.label }}</p>
                </div>
              </div>
            </div>
          </article>

          <article class="card">
            <div class="card-head">
              <h3>账号状态</h3>
            </div>
            <div class="meta-list">
              <div class="meta-row">
                <span>账号等级</span>
                <strong>Lv.12</strong>
              </div>
              <div class="meta-row">
                <span>身份状态</span>
                <strong class="ok">正常</strong>
              </div>
              <div class="meta-row">
                <span>会员到期</span>
                <strong>2026-12-31</strong>
              </div>
            </div>
          </article>
        </aside>

        <section class="profile-main">
          <article class="card form-card">
            <div class="card-head form-head">
              <div>
                <p class="overline">PROFILE SETTINGS</p>
                <h3>基础信息</h3>
              </div>
              <span class="pill"><font-awesome-icon icon="user" /> 公开资料</span>
            </div>

            <div class="form-grid">
              <label class="field">
                <span><font-awesome-icon icon="at" /> 用户名</span>
                <input v-model="form.username" type="text" />
              </label>
              <label class="field">
                <span><font-awesome-icon icon="id-card" /> 昵称</span>
                <input v-model="form.nickname" type="text" />
              </label>
              <label class="field">
                <span><font-awesome-icon icon="envelope" /> 邮箱</span>
                <input v-model="form.email" type="email" />
              </label>
              <label class="field">
                <span><font-awesome-icon icon="phone" /> 手机号</span>
                <input v-model="form.phone" type="tel" />
              </label>
              <label class="field field-full">
                <span><font-awesome-icon icon="link" /> 头像地址</span>
                <input v-model="form.avatar" type="text" />
              </label>
              <label class="field field-full">
                <span><font-awesome-icon icon="quote-left" /> 个人简介</span>
                <textarea v-model="form.bio" rows="5"></textarea>
              </label>
            </div>
          </article>
        </section>
      </main>
    </section>
  </a-modal>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, reactive, ref } from "vue";

const props = defineProps<{
  isOpen: boolean;
  isDark: boolean;
}>();

const emit = defineEmits<{
  close: [];
}>();

const isVip = ref(true);

const initialForm = {
  username: "又是一年冬",
  nickname: "冬冬",
  email: "zhangsan@example.com",
  phone: "138****8888",
  avatar: "https://img2.woyaogexing.com/2025/04/05/2d3c285633cc350b263ae66888c525ed.jpg",
  bio: "这里是我的个人简介，简洁而专业。",
};

const form = reactive({ ...initialForm });

const stats = [
  { key: "fav", label: "收藏", value: "128", icon: "star" },
  { key: "post", label: "发布", value: "34", icon: "book" },
  { key: "score", label: "成长值", value: "2,480", icon: "chart-line" },
];

const isMobile = ref(false);
const mediaQuery = "(max-width: 768px)";
let mediaMatcher: MediaQueryList | null = null;

const updateMobileState = () => {
  if (typeof window === "undefined") return;
  isMobile.value = window.matchMedia(mediaQuery).matches;
};

const close = () => emit("close");

const resetForm = () => {
  Object.assign(form, initialForm);
};

const saveProfile = () => {
  Object.assign(initialForm, form);
};

onMounted(() => {
  if (typeof window === "undefined") return;
  mediaMatcher = window.matchMedia(mediaQuery);
  updateMobileState();
  mediaMatcher.addEventListener("change", updateMobileState);
});

onBeforeUnmount(() => {
  mediaMatcher?.removeEventListener("change", updateMobileState);
});

const modalWidth = computed(() => (isMobile.value ? "calc(100vw - 64px)" : 840));
</script>

<style lang="scss">
.profile-modal {
  .ant-modal {
    margin: 22px auto;
  }

  .ant-modal-content {
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 12px 30px rgba(15, 23, 42, 0.16);
  }

  .ant-modal-body {
    padding: 0;
  }
}

.profile-shell {
  --bg: #f8fafc;
  --surface: #ffffff;
  --line: #e2e8f0;
  --text: #0f172a;
  --muted: #64748b;
  --primary: #2563eb;
  --primary-soft: #eff6ff;
  background: var(--bg);
  color: var(--text);
  max-height: min(78vh, 760px);
  overflow-y: auto;
}

.profile-header {
  height: 72px;
  padding: 0 14px;
  border-bottom: 1px solid var(--line);
  background: var(--surface);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.profile-user {
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 10px;
}

.profile-avatar-wrap {
  position: relative;
  width: 42px;
  height: 42px;
  flex-shrink: 0;
}

.profile-avatar {
  width: 100%;
  height: 100%;
  border-radius: 10px;
  object-fit: cover;
}

.profile-vip {
  position: absolute;
  right: -5px;
  bottom: -5px;
  width: 16px;
  height: 16px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 8px;
  background: #f59e0b;
  color: #fff;
  border: 1px solid #fff;
}

.profile-user-name {
  margin: 0;
  font-size: 14px;
  font-weight: 700;
}

.profile-user-email {
  margin: 2px 0 0;
  font-size: 12px;
  color: var(--muted);
  max-width: 220px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.profile-user-tags {
  display: flex;
  gap: 6px;
  margin-top: 4px;
}

.profile-tag {
  height: 20px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 0 8px;
  font-size: 10px;
  font-weight: 700;
  background: var(--primary-soft);
  color: var(--primary);
}

.profile-tag-muted {
  background: #f1f5f9;
  color: #475569;
}

.profile-header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn,
.btn-icon,
.field input,
.field textarea {
  transition: all 0.18s ease;
}

.btn {
  height: 34px;
  border-radius: 10px;
  border: 1px solid var(--line);
  background: #fff;
  color: var(--text);
  padding: 0 12px;
  font-size: 12px;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
}

.btn-ghost:hover {
  border-color: #cbd5e1;
}

.btn-primary {
  background: var(--primary);
  border-color: var(--primary);
  color: #fff;
}

.btn-primary:hover {
  background: #1d4ed8;
  border-color: #1d4ed8;
}

.btn-icon {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  border: 1px solid var(--line);
  background: #fff;
  color: var(--muted);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.btn-icon:hover {
  border-color: #cbd5e1;
  color: var(--text);
}

.profile-layout {
  padding: 10px;
  display: grid;
  grid-template-columns: 260px 1fr;
  gap: 10px;
}

.profile-side,
.profile-main {
  display: grid;
  gap: 10px;
}

.card {
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 10px;
  padding: 10px;
}

.card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 10px;
}

.card-head h3 {
  margin: 0;
  font-size: 13px;
  font-weight: 700;
  color: var(--muted);
}

.card-head span {
  font-size: 11px;
  color: #94a3b8;
}

.stat-list {
  display: grid;
  gap: 8px;
}

.stat-item {
  border: 1px solid var(--line);
  border-radius: 9px;
  padding: 8px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.stat-icon {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  background: var(--primary-soft);
  color: var(--primary);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
}

.stat-value {
  margin: 0;
  font-size: 15px;
  font-weight: 700;
}

.stat-label {
  margin: 1px 0 0;
  font-size: 11px;
  color: var(--muted);
}

.meta-list {
  display: grid;
  gap: 8px;
}

.meta-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 7px 0;
  border-bottom: 1px solid var(--line);
}

.meta-row:last-child {
  border-bottom: 0;
}

.meta-row span {
  font-size: 12px;
  color: var(--muted);
}

.meta-row strong {
  font-size: 12px;
  font-weight: 700;
  color: var(--text);
}

.meta-row .ok {
  color: #059669;
}

.form-head {
  margin-bottom: 8px;
}

.overline {
  margin: 0;
  font-size: 10px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--muted);
  font-weight: 700;
}

.form-head h3 {
  margin: 4px 0 0;
  font-size: 20px;
  color: var(--text);
}

.pill {
  height: 22px;
  border-radius: 999px;
  padding: 0 8px;
  font-size: 11px;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background: #eef2ff;
  color: #4338ca;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.field-full {
  grid-column: 1 / -1;
}

.field span {
  font-size: 12px;
  color: var(--muted);
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 5px;
}

.field input,
.field textarea {
  width: 100%;
  border: 1px solid var(--line);
  border-radius: 9px;
  background: #fff;
  color: var(--text);
  font-size: 13px;
  font-family: inherit;
  outline: none;
}

.field input {
  height: 38px;
  padding: 0 11px;
}

.field textarea {
  min-height: 110px;
  padding: 10px 11px;
  resize: vertical;
}

.field input:focus,
.field textarea:focus {
  border-color: #93c5fd;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(148, 163, 184, 0.35);
  border-radius: 999px;
}

.profile-shell.dark {
  --bg: #111827;
  --surface: #111827;
  --line: #1f2937;
  --text: #f8fafc;
  --muted: #94a3b8;
  --primary: #3b82f6;
  --primary-soft: rgba(59, 130, 246, 0.16);
}

.profile-shell.dark .profile-header,
.profile-shell.dark .btn,
.profile-shell.dark .btn-icon,
.profile-shell.dark .field input,
.profile-shell.dark .field textarea,
.profile-shell.dark .stat-item {
  background: #0f172a;
}

.profile-shell.dark .profile-tag-muted {
  background: rgba(148, 163, 184, 0.16);
  color: #cbd5e1;
}

.profile-shell.dark .pill {
  background: rgba(99, 102, 241, 0.2);
  color: #c7d2fe;
}

@media (max-width: 768px) {
  .profile-modal {
    .ant-modal {
      margin: 20px auto;
      width: min(420px, calc(100vw - 44px)) !important;
    }
  }

  .profile-shell {
    max-height: calc(100vh - 122px);
  }

  .profile-layout {
    grid-template-columns: 1fr;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .profile-modal {
    .ant-modal {
      width: calc(100vw - 32px) !important;
      margin: 16px auto;
    }
  }

  .profile-shell {
    max-height: calc(100vh - 104px);
  }

  .profile-user-email {
    max-width: 150px;
  }
}
</style>

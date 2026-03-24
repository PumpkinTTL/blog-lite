<template>
  <div class="announcement-wrapper">
    <transition name="crisp-fade-premium">
      <div
        v-if="!closed"
        class="announcement-card-final"
        :class="[type, { 'dark-mode': isDark, 'is-clickable': !!link }]"
        @click="handleCardClick"
      >
        <div class="card-inner-final">
          <!-- Left: Hero Icon -->
          <div class="icon-hero-final">
            <font-awesome-icon :icon="currentIcon" />
          </div>

          <!-- Center: Spacious Content Block -->
          <div class="content-body-final">
            <div class="header-line-final">
              <span class="badge-v8" v-if="tag">{{ tag }}</span>
              <h4 class="title-v8">{{ title }}</h4>
              <span class="date-v8" v-if="date">{{ date }}</span>
            </div>
            <!-- Improved Margin here for spacious feel -->
            <p class="message-v8">{{ message }}</p>
          </div>

          <!-- Right: Iconic Actions (No Text as requested) -->
          <div class="actions-group-final" @click.stop>
            <!-- View More Icon Button (Optional) -->
            <button
              v-if="link"
              class="icon-btn-v8 btn-more-v8"
              @click="handleAction"
              title="查看更多"
            >
              <font-awesome-icon icon="arrow-right" />
            </button>

            <!-- Close Icon Button (Always present) -->
            <button
              class="icon-btn-v8 btn-close-v8"
              @click="close"
              title="不再显示"
            >
              <font-awesome-icon icon="xmark" />
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useThemeStore } from "@/stores/theme";

const themeStore = useThemeStore();
const isDark = computed(() => themeStore.isDark);

interface Props {
  title?: string;
  message?: string;
  tag?: string;
  date?: string;
  icon?: string;
  link?: string;
  type?: "primary" | "success" | "warning" | "info" | "accent";
  persistKey?: string;
}

const props = withDefaults(defineProps<Props>(), {
  title: "系统公告",
  message: "欢迎访问我们的博客！这里有最新系统公告与更新详情。",
  tag: "NEW",
  date: "",
  icon: "",
  type: "primary",
});

const emit = defineEmits(["close", "click"]);
const closed = ref(false);

const currentIcon = computed(() => {
  if (props.icon) return props.icon;
  const map: Record<string, string> = {
    primary: "bullhorn",
    success: "circle-check",
    warning: "triangle-exclamation",
    info: "circle-info",
    accent: "bolt",
  };
  return map[props.type] || "bullhorn";
});

if (
  props.persistKey &&
  localStorage.getItem(`announcement_closed_${props.persistKey}`)
) {
  closed.value = true;
}

const close = () => {
  closed.value = true;
  if (props.persistKey) {
    localStorage.setItem(`announcement_closed_${props.persistKey}`, "true");
  }
  emit("close");
};

const handleAction = () => {
  if (props.link) window.open(props.link, "_blank");
  emit("click");
};

const handleCardClick = () => {
  if (props.link) handleAction();
};
</script>

<style scoped lang="scss">
.announcement-wrapper {
  width: 100%;
  margin: 0;
}

.announcement-card-final {
  /* Strictly Flat Card */
  background: var(--bg-secondary, #ffffff);
  border: 1px solid var(--border, #eef3f7);
  border-radius: 14px;
  position: relative;
  padding: 16px 20px;

  /* *** HOVER TRANSITION ON CARD AS REQUESTED *** */
  transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
  cursor: default;

  &.is-clickable {
    cursor: pointer;
  }

  // Type Color Configuration
  &.primary {
    --t-accent: var(--primary, #3b82f6);
    --t-bg: #dbeafe;
  }
  &.success {
    --t-accent: #10b981;
    --t-bg: #ecfdf5;
  }
  &.warning {
    --t-accent: #f59e0b;
    --t-bg: #fffbeb;
  }
  &.info {
    --t-accent: #3b82f6;
    --t-bg: #eff6ff;
  }
  &.accent {
    --t-accent: #ec4899;
    --t-bg: #fdf2f8;
  }

  &:hover {
    transform: translateY(-4px); /* Premium Card Displacement */
    border-color: var(--t-accent);
    box-shadow: 0 10px 20px -10px rgba(0, 0, 0, 0.1);
  }
}

.card-inner-final {
  display: flex;
  align-items: center;
  gap: 20px;
  width: 100%;
}

/* Icon (Crisp & Simple) */
.icon-hero-final {
  width: 42px;
  height: 42px;
  background: var(--t-bg);
  color: var(--t-accent);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  flex-shrink: 0;
}

/* Content (Expanded hierarchy) */
.content-body-final {
  flex: 1;
  min-width: 0;
}

.header-line-final {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px; /* Increased Spacing */
}

.badge-v8 {
  background: var(--t-accent);
  color: #fff;
  font-size: 10px;
  font-weight: 800;
  padding: 1px 6px;
  border-radius: 4px;
}

.title-v8 {
  font-size: 16px;
  font-weight: 800;
  color: var(--text, #1e293b);
  margin: 0;
}

.date-v8 {
  font-size: 11.5px;
  color: var(--text-tertiary, #94a3b8);
  font-weight: 500;
  opacity: 0.7;
}

.message-v8 {
  font-size: 13.5px;
  color: var(--text-secondary, #64748b);
  margin: 0;
  line-height: 1.6;
  opacity: 0.9;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Iconic Actions (No Text) */
.actions-group-final {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

.icon-btn-v8 {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 9px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease;
  background: var(--bg, #f1f4f9);
  color: var(--text-tertiary, #94a3b8);

  &.btn-more-v8 {
    background: var(--t-accent);
    color: #fff;
    &:hover {
      filter: brightness(1.1);
    }
  }

  &.btn-close-v8:hover {
    background: #fee2e2;
    color: #ef4444;
  }
}

/* ── Dark Mode Fixes ── */
.announcement-card-final.dark-mode {
  background: var(--bg-tertiary, #0f172a);
  border-color: var(--border-dark, #1e293b);

  .icon-hero-final {
    background: rgba(255, 255, 255, 0.04);
  }
  .title-v8 {
    color: #f1f5f9;
  }
  .message-v8 {
    color: #94a3b8;
  }
  .icon-btn-v8 {
    background: var(--border-dark);
  }

  .btn-more-v8 {
    background: var(--t-accent);
    color: #fff;
  }
}

/* Entrance */
.crisp-fade-premium-enter-active,
.crisp-fade-premium-leave-active {
  transition: all 0.3s ease;
}
.crisp-fade-premium-enter-from,
.crisp-fade-premium-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

/* Mobile */
@media (max-width: 640px) {
  .actions-group-final {
    display: none;
  } /* Hide on mobile for space, use card click */
  .card-inner-final {
    padding: 12px;
  }
}
</style>

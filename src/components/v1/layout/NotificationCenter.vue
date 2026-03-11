<template>
  <a-config-provider :theme="{ algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm }">
    <a-modal
      :open="isOpen"
      :footer="null"
      :closable="false"
      :width="isMobile ? 'calc(100vw - 32px)' : 640"
      :centered="true"
      :maskClosable="true"
      wrap-class-name="notification-center-modal"
      @cancel="close"
    >
      <div class="notification-center-content rounded-lg overflow-hidden">
        <!-- Header -->
        <div
          class="py-3 sm:py-4 flex items-center justify-between border-b"
          :class="
            isDark
              ? 'bg-gray-800/50 border-gray-700/50'
              : 'bg-gray-50/50 border-gray-200/50'
          "
        >
          <div class="flex items-center gap-2.5 sm:gap-3">
            <div
              class="w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center"
              :class="isDark ? 'bg-blue-500/10' : 'bg-blue-50'"
            >
              <font-awesome-icon
                icon="bell"
                class="text-sm sm:text-base"
                :class="isDark ? 'text-blue-400' : 'text-blue-600'"
              />
            </div>
            <div>
              <h3
                class="text-sm sm:text-base font-semibold"
                :class="isDark ? 'text-white' : 'text-gray-900'"
              >
                通知中心
              </h3>
              <p
                class="text-xs"
                :class="isDark ? 'text-gray-500' : 'text-gray-400'"
              >
                {{ unreadCount }}条未读
              </p>
            </div>
          </div>
          <div class="flex items-center gap-1.5 sm:gap-2">
            <button
              v-if="unreadCount > 0"
              class="px-2.5 py-1 sm:px-3 sm:py-1.5 text-xs font-medium rounded-lg transition-all duration-200 cursor-pointer"
              :class="
                isDark
                  ? 'bg-blue-500/10 text-blue-400'
                  : 'bg-blue-50 text-blue-600'
              "
              @click="markAllRead"
            >
              <font-awesome-icon icon="check" class="mr-1 text-xs" />
              <span class="hidden sm:inline">全部已读</span>
            </button>
            <button
              class="p-1.5 sm:p-2 rounded-lg transition-all duration-200 cursor-pointer"
              :class="
                isDark
                  ? 'text-gray-400'
                  : 'text-gray-500'
              "
              @click="close"
            >
              <font-awesome-icon icon="xmark" class="text-base" />
            </button>
          </div>
        </div>

      <!-- Tabs -->
      <div
        class="py-2"
        :class="isDark ? 'bg-gray-800/30' : 'bg-gray-50/40'"
      >
        <div
          class="notification-tabs-wrap p-0.5 rounded-lg"
          :class="
            isDark
              ? 'bg-gray-800/50'
              : 'bg-gray-100'
          "
        >
          <button
            v-for="tab in tabs"
            :key="tab.id"
            class="notification-tab-btn flex-1 sm:flex-none px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium rounded-md transition-colors duration-150 cursor-pointer"
            :class="
              activeTab === tab.id
                ? isDark
                  ? 'bg-gray-700 text-white'
                  : 'bg-white text-gray-900'
                : isDark
                ? 'text-gray-400 hover:text-gray-200'
                : 'text-gray-600 hover:text-gray-900'
            "
            @click="changeTab(tab.id)"
          >
            <span>{{ tab.name }}</span>
            <span
              v-if="tab.count > 0"
              class="ml-1.5 px-2 py-0.5 text-xs font-semibold rounded-full"
              :class="
                activeTab === tab.id
                  ? 'bg-blue-500 text-white'
                  : isDark
                  ? 'bg-gray-700 text-gray-400'
                  : 'bg-gray-200 text-gray-600'
              "
              >{{ tab.count }}</span
            >
          </button>
        </div>
      </div>

      <!-- Notifications List -->
      <div
        ref="listContainer"
        class="overflow-y-auto custom-scrollbar h-[58vh] max-h-[58vh] min-h-[220px] sm:h-[460px] sm:max-h-[60vh] sm:min-h-[280px]"
        :class="isDark ? 'bg-gray-800' : 'bg-white'"
      >
        <Transition name="tab-list" mode="out-in" appear>
          <div :key="activeTab" class="py-2.5 sm:py-3">
            <transition-group
              name="notification-item"
              tag="div"
              class="space-y-2 sm:space-y-2.5"
            >
              <div
                v-for="(notification, index) in filteredNotifications"
                :key="notification.id"
                class="p-3 sm:p-3.5 rounded-lg transition-colors duration-200 cursor-pointer animate__animated animate__fadeInUp"
                :class="[
                  isDark
                    ? 'bg-gray-700/30 border border-gray-700/50'
                    : 'bg-gray-50/50 border border-gray-200/60',
                ]"
                :style="{ '--i': index, animationDelay: `${index * 44}ms`, animationDuration: '320ms' }"
                @click="markAsRead(notification.id)"
              >
                <div class="flex gap-2.5 sm:gap-3">
                  <div
                    class="flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center"
                    :class="getNotificationStyle(notification.type)"
                  >
                    <font-awesome-icon
                      :icon="notification.icon"
                      class="text-xs sm:text-sm"
                    />
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="flex items-start justify-between gap-2 mb-1">
                      <p
                        class="text-sm sm:text-[15px] font-semibold animate__animated animate__fadeInUp"
                        :style="{ animationDelay: `${index * 44 + 30}ms`, animationDuration: '280ms' }"
                        :class="isDark ? 'text-white' : 'text-gray-900'"
                      >
                        {{ notification.title }}
                      </p>
                      <div
                        class="flex items-center gap-1.5 flex-shrink-0 animate__animated animate__fadeInUp"
                        :style="{ animationDelay: `${index * 44 + 48}ms`, animationDuration: '260ms' }"
                      >
                        <span
                          v-if="!notification.read"
                          class="w-2 h-2 bg-blue-500 rounded-full"
                        ></span>
                        <span
                          class="text-[11px] sm:text-xs whitespace-nowrap"
                          :class="isDark ? 'text-gray-500' : 'text-gray-400'"
                          >{{ notification.time }}</span
                        >
                      </div>
                    </div>
                    <p
                      class="text-xs sm:text-sm leading-relaxed mb-1.5 sm:mb-2 animate__animated animate__fadeInUp"
                      :style="{ animationDelay: `${index * 44 + 66}ms`, animationDuration: '300ms' }"
                      :class="isDark ? 'text-gray-400' : 'text-gray-600'"
                    >
                      {{ notification.message }}
                    </p>
                    <div
                      v-if="notification.action"
                      class="animate__animated animate__fadeInUp"
                      :style="{ animationDelay: `${index * 44 + 84}ms`, animationDuration: '260ms' }"
                    >
                      <button
                        class="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-md"
                        :class="
                          isDark
                            ? 'bg-blue-500/10 text-blue-400'
                            : 'bg-blue-50 text-blue-600'
                        "
                      >
                        <span>{{ notification.action }}</span>
                        <font-awesome-icon icon="arrow-right" class="text-[10px]" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </transition-group>
          </div>
        </Transition>

        <!-- Empty State -->
        <div
          v-if="filteredNotifications.length === 0"
          class="py-16 text-center"
        >
          <div
            class="w-16 h-16 mx-auto mb-4 rounded-xl flex items-center justify-center"
            :class="isDark ? 'bg-gray-700/40' : 'bg-gray-100'"
          >
            <font-awesome-icon
              icon="bell"
              class="text-3xl"
              :class="isDark ? 'text-gray-600' : 'text-gray-300'"
            />
          </div>
          <p
            class="text-base font-semibold mb-1"
            :class="isDark ? 'text-gray-400' : 'text-gray-600'"
          >
            暂无通知
          </p>
          <p
            class="text-sm"
            :class="isDark ? 'text-gray-500' : 'text-gray-400'"
          >
            所有通知都会显示在这里
          </p>
        </div>
      </div>
      </div>
    </a-modal>
  </a-config-provider>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { theme } from 'ant-design-vue';

interface Notification {
  id: number;
  type: "success" | "info" | "warning" | "system";
  icon: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  action?: string;
  category: "all" | "system" | "activity";
}

defineProps<{
  isOpen: boolean;
  isDark: boolean;
}>();

const emit = defineEmits<{
  close: [];
  markAllRead: [];
}>();

const activeTab = ref("all");
const isMobile = ref(false);

const mediaQuery = "(max-width: 640px)";
let mediaMatcher: MediaQueryList | null = null;

const updateMobileState = () => {
  if (typeof window === "undefined") return;
  isMobile.value = window.matchMedia(mediaQuery).matches;
};

const tabs = computed(() => [
  {
    id: "all",
    name: "全部",
    count: notifications.value.filter((n) => !n.read).length,
  },
  {
    id: "system",
    name: "系统",
    count: notifications.value.filter((n) => !n.read && n.category === "system")
      .length,
  },
  {
    id: "activity",
    name: "动态",
    count: notifications.value.filter(
      (n) => !n.read && n.category === "activity"
    ).length,
  },
]);

const notifications = ref<Notification[]>([
  {
    id: 1,
    type: "system",
    icon: "check",
    title: "系统更新完成",
    message: "新版本 v2.0 已成功部署，包含多项功能优化和性能提升",
    time: "5分钟前",
    read: false,
    action: "查看详情",
    category: "system",
  },
  {
    id: 2,
    type: "info",
    icon: "book",
    title: "新资源推荐",
    message: "根据你的兴趣，我们为你推荐了3个优质学习资源",
    time: "1小时前",
    read: false,
    action: "立即查看",
    category: "activity",
  },
  {
    id: 3,
    type: "warning",
    icon: "star",
    title: "VIP会员即将到期",
    message: "您的会员将在7天后到期，续费可享受8折优惠",
    time: "昨天",
    read: false,
    action: "立即续费",
    category: "system",
  },
  {
    id: 4,
    type: "success",
    icon: "circle-info",
    title: "评论回复",
    message: '有人回复了你的评论："非常有用的资源，感谢分享！"',
    time: "2天前",
    read: true,
    category: "activity",
  },
]);

const filteredNotifications = computed(() => {
  if (activeTab.value === "all") return notifications.value;
  return notifications.value.filter((n) => n.category === activeTab.value);
});

const unreadCount = computed(
  () => notifications.value.filter((n) => !n.read).length
);

const getNotificationStyle = (type: string) => {
  const styles = {
    success:
      "bg-gradient-to-br from-green-400 to-green-500 text-white shadow-sm shadow-green-500/30",
    warning:
      "bg-gradient-to-br from-yellow-400 to-yellow-500 text-white shadow-sm shadow-yellow-500/30",
    info: "bg-gradient-to-br from-blue-400 to-blue-500 text-white shadow-sm shadow-blue-500/30",
    system:
      "bg-gradient-to-br from-purple-400 to-purple-500 text-white shadow-sm shadow-purple-500/30",
  };
  return styles[type as keyof typeof styles] || styles.info;
};

const changeTab = (tabId: string) => {
  activeTab.value = tabId;
};

const close = () => {
  emit("close");
};

const markAllRead = () => {
  notifications.value.forEach((n) => (n.read = true));
  emit("markAllRead");
};

const markAsRead = (id: number) => {
  const notification = notifications.value.find((n) => n.id === id);
  if (notification) notification.read = true;
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
</script>

<style scoped>
/* Ant Design Modal 自定义样式 - 只设置必要的 padding */
:deep(.ant-modal-body) {
  padding: 16px;
}

.notification-center-content {
  overflow: hidden;
}

.notification-tabs-wrap {
  display: flex;
  gap: 0.25rem;
}

.notification-tab-btn {
  transform: none;
}

.tab-list-enter-active {
  transition: opacity 0.24s ease, transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
}

.tab-list-leave-active {
  transition: opacity 0.14s ease, transform 0.14s ease;
}

.tab-list-enter-from,
.tab-list-leave-to {
  opacity: 0;
}

.tab-list-enter-from {
  transform: translateY(6px) scale(0.995);
}

.tab-list-leave-to {
  transform: translateY(-2px);
}

.notification-item-enter-active {
  transition:
    opacity 0.22s ease,
    transform 0.3s cubic-bezier(0.22, 1, 0.36, 1),
    filter 0.24s ease;
  transition-delay: calc(var(--i, 0) * 24ms);
}

.notification-item-leave-active {
  transition: opacity 0.1s ease, transform 0.1s ease;
}

.notification-item-enter-from,
.notification-item-leave-to {
  opacity: 0;
}

.notification-item-enter-from {
  transform: translateY(8px) scale(0.992);
  filter: blur(2px);
}

.notification-item-leave-to {
  transform: translateY(-2px);
}

.notification-item-move {
  transition: none;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 5px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(156, 163, 175, 0.25);
  border-radius: 3px;
  transition: background 0.2s;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(156, 163, 175, 0.4);
}

:deep(.notification-center-modal .ant-modal) {
  max-width: 640px;
}

:deep(.notification-center-modal .ant-modal-content) {
  overflow: hidden;
}

@media (max-width: 640px) {
  :deep(.notification-center-modal .ant-modal) {
    width: calc(100vw - 32px) !important;
    max-width: 420px !important;
    margin: 16px auto;
  }

  :deep(.notification-center-modal .ant-modal-content) {
    max-height: calc(100vh - 32px);
    border-radius: 12px;
  }

  :deep(.ant-modal-body) {
    padding: 12px;
  }
}

@media (min-width: 641px) {
  :deep(.ant-modal-body) {
    padding: 16px;
  }
}
</style>


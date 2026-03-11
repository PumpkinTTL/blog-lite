<template>
  <transition
    enter-active-class="animate__animated animate__fadeIn"
    enter-active-style="animation-duration: 0.2s;"
    leave-active-class="animate__animated animate__fadeOut"
    leave-active-style="animation-duration: 0.15s;"
  >
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 flex items-start justify-center sm:pt-16 px-4 sm:px-4"
      @click="close"
    >
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>

      <!-- Modal -->
      <div
        class="relative w-full max-w-md sm:max-w-lg h-full sm:h-auto animate__animated animate__zoomIn"
        style="animation-duration: 0.25s"
        :class="
          isDark
            ? 'bg-gray-800/95 backdrop-blur-xl sm:border sm:border-gray-700/30'
            : 'bg-white/95 backdrop-blur-xl sm:border sm:border-gray-200/30'
        "
        :style="{ boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.3)' }"
        @click.stop
      >
        <!-- Header -->
        <div
          class="px-4 sm:px-5 py-3.5 flex items-center justify-between backdrop-blur-sm"
          :class="
            isDark
              ? 'bg-gray-900/40 border-b border-gray-700/30'
              : 'bg-gray-50/40 border-b border-gray-200/30'
          "
        >
          <div class="flex items-center gap-2.5">
            <div
              class="w-9 h-9 rounded-lg flex items-center justify-center relative overflow-hidden"
              :class="isDark ? 'bg-blue-500/10' : 'bg-blue-50'"
            >
              <div
                class="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-transparent"
              ></div>
              <font-awesome-icon
                icon="bell"
                class="text-base relative z-10"
                :class="isDark ? 'text-blue-400' : 'text-blue-600'"
              />
            </div>
            <div>
              <h3
                class="text-base font-semibold"
                :class="isDark ? 'text-white' : 'text-gray-900'"
              >
                通知中心
              </h3>
              <p
                class="text-xs"
                :class="isDark ? 'text-gray-400' : 'text-gray-500'"
              >
                {{ unreadCount }}条未读
              </p>
            </div>
          </div>
          <div class="flex items-center gap-1.5">
            <button
              v-if="unreadCount > 0"
              class="px-2.5 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 cursor-pointer"
              :class="
                isDark
                  ? 'bg-blue-500/10 text-blue-400 hover:bg-blue-500/15'
                  : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
              "
              @click="markAllRead"
            >
              <font-awesome-icon icon="check" class="mr-1 text-xs" />
              <span class="hidden sm:inline">全部已读</span>
            </button>
            <button
              class="p-1.5 rounded-lg transition-all duration-200 cursor-pointer"
              :class="
                isDark
                  ? 'text-gray-400 hover:text-white hover:bg-gray-700/40'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
              "
              @click="close"
            >
              <font-awesome-icon icon="xmark" class="text-base" />
            </button>
          </div>
        </div>

        <!-- Tabs -->
        <div
          class="px-4 sm:px-5 py-2.5 flex gap-1.5 backdrop-blur-sm"
          :class="isDark ? 'bg-gray-900/20' : 'bg-gray-50/40'"
        >
          <button
            v-for="tab in tabs"
            :key="tab.id"
            class="flex-1 sm:flex-none px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all duration-200 cursor-pointer relative overflow-hidden"
            :class="
              activeTab === tab.id
                ? isDark
                  ? 'bg-gray-700/60 text-white'
                  : 'bg-white text-gray-900'
                : isDark
                ? 'text-gray-400 hover:text-white hover:bg-gray-800/40'
                : 'text-gray-600 hover:text-gray-900 hover:bg-white/60'
            "
            @click="changeTab(tab.id)"
          >
            <span class="relative z-10">{{ tab.name }}</span>
            <span
              v-if="tab.count > 0"
              class="relative z-10 ml-1.5 px-1.5 py-0.5 text-xs font-semibold rounded-full transition-all duration-200"
              :class="
                activeTab === tab.id
                  ? 'bg-blue-500 text-white'
                  : isDark
                  ? 'bg-gray-700 text-gray-300'
                  : 'bg-gray-200 text-gray-600'
              "
              >{{ tab.count }}</span
            >
            <div
              v-if="activeTab === tab.id"
              class="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent"
            ></div>
          </button>
        </div>

        <!-- Notifications List -->
        <div
          class="h-[calc(100vh-140px)] sm:h-auto sm:max-h-[450px] overflow-y-auto custom-scrollbar"
          :class="isDark ? 'bg-gray-900/10' : 'bg-gray-50/20'"
        >
          <transition-group
            name="notification-list"
            tag="div"
            class="p-3 sm:p-4 space-y-2"
          >
            <div
              v-for="(notification, index) in filteredNotifications"
              :key="notification.id"
              class="p-3 sm:p-3.5 rounded-lg transition-all duration-200 cursor-pointer relative overflow-hidden group"
              :class="[
                isDark
                  ? 'bg-gray-800/50 hover:bg-gray-800/70 border border-gray-700/30'
                  : 'bg-white/80 hover:bg-white border border-gray-200/40',
                !notification.read
                  ? isDark
                    ? 'shadow-md shadow-blue-500/5'
                    : 'shadow-md shadow-blue-500/10'
                  : 'shadow-sm',
              ]"
              :style="{ animationDelay: `${index * 60}ms` }"
              @click="markAsRead(notification.id)"
            >
              <!-- Gradient overlay for unread -->
              <div
                v-if="!notification.read"
                class="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-transparent pointer-events-none"
              ></div>

              <div class="flex gap-3 relative z-10">
                <div
                  class="flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center relative overflow-hidden transition-transform duration-200 group-hover:scale-105"
                  :class="getNotificationStyle(notification.type)"
                >
                  <div
                    class="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"
                  ></div>
                  <font-awesome-icon
                    :icon="notification.icon"
                    class="text-sm sm:text-base relative z-10"
                  />
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-start justify-between gap-2 mb-1">
                    <p
                      class="text-xs sm:text-sm font-semibold"
                      :class="isDark ? 'text-white' : 'text-gray-900'"
                    >
                      {{ notification.title }}
                    </p>
                    <div class="flex items-center gap-1.5 flex-shrink-0">
                      <span
                        v-if="!notification.read"
                        class="w-2 h-2 bg-blue-500 rounded-full animate-pulse"
                        style="box-shadow: 0 0 6px rgba(59, 130, 246, 0.6)"
                      ></span>
                      <span
                        class="text-xs whitespace-nowrap"
                        :class="isDark ? 'text-gray-500' : 'text-gray-400'"
                        >{{ notification.time }}</span
                      >
                    </div>
                  </div>
                  <p
                    class="text-xs sm:text-sm leading-relaxed mb-2"
                    :class="isDark ? 'text-gray-400' : 'text-gray-600'"
                  >
                    {{ notification.message }}
                  </p>
                  <div v-if="notification.action">
                    <button
                      class="text-xs font-medium px-3 py-1.5 rounded-md transition-all duration-200 relative overflow-hidden group/btn"
                      :class="
                        isDark
                          ? 'bg-blue-500/10 text-blue-400 hover:bg-blue-500/15'
                          : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                      "
                    >
                      <span class="relative z-10">{{
                        notification.action
                      }}</span>
                      <div
                        class="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity duration-200"
                      ></div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </transition-group>

          <!-- Empty State -->
          <div
            v-if="filteredNotifications.length === 0"
            class="px-4 py-16 sm:py-20 text-center"
          >
            <div
              class="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 rounded-xl flex items-center justify-center relative overflow-hidden"
              :class="isDark ? 'bg-gray-800/40' : 'bg-gray-100'"
            >
              <div
                class="absolute inset-0 bg-gradient-to-br from-gray-500/10 to-transparent"
              ></div>
              <font-awesome-icon
                icon="bell"
                class="text-3xl sm:text-4xl relative z-10"
                :class="isDark ? 'text-gray-600' : 'text-gray-300'"
              />
            </div>
            <p
              class="text-sm sm:text-base font-semibold mb-1"
              :class="isDark ? 'text-gray-300' : 'text-gray-600'"
            >
              暂无通知
            </p>
            <p
              class="text-xs sm:text-sm"
              :class="isDark ? 'text-gray-500' : 'text-gray-400'"
            >
              所有通知都会显示在这里
            </p>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

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
</script>

<style scoped>
.notification-list-enter-active {
  animation: slideInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.notification-list-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 1, 1);
}

.notification-list-leave-to {
  opacity: 0;
  transform: translateX(-10px) scale(0.95);
}

.notification-list-move {
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(10px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
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
</style>


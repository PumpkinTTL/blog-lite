<template>
  <div
    class="product-card"
    :class="{ 'dark-mode': isDark, 'is-hot': resource.isHot }"
    :style="{ '--accent-color': getCategoryColor(resource.category) }"
    @click="emit('click')"
  >
    <!-- 封面区域 -->
    <div class="card-cover">
      <img :src="resource.cover" :alt="resource.title" loading="lazy" />
      <div class="cover-overlay"></div>

      <!-- Premium Glass Gradient Overlay -->
      <div class="glass-reflection"></div>

      <!-- 热销标签 -->
      <div v-if="resource.isHot" class="hot-tag">
        <font-awesome-icon icon="fire" class="tag-icon" />
        <span>HOT</span>
      </div>

      <!-- 价格浮标 (放在左下角) -->
      <div class="price-buoy">
        <span class="currency">¥</span>
        <span class="amount">{{ resource.price }}</span>
      </div>
    </div>

    <!-- 内容区域 -->
    <div class="card-body">
      <!-- 分类 & 已售 (Beautified with Icons) -->
      <div class="body-meta">
        <span class="category-tag">
          <font-awesome-icon
            :icon="getCategoryIcon(resource.category)"
            class="cat-icon"
          />
          {{ getCategoryLabel(resource.category) }}
        </span>
        <span class="sales-info">
          <font-awesome-icon icon="bag-shopping" class="sales-icon" />
          已售 {{ resource.sales }}
        </span>
      </div>

      <!-- 标题 -->
      <h3
        class="product-title"
        :class="{ 'hot-title': resource.isHot }"
        :title="resource.title"
      >
        {{ resource.title }}
      </h3>

      <!-- 描述 -->
      <p class="product-desc">{{ resource.description }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useThemeStore } from "@/stores/theme";

export interface Resource {
  id: number;
  title: string;
  description: string;
  cover: string;
  price: number;
  sales: number;
  rating: number;
  isHot?: boolean;
  category: string;
  author: string;
  authorAvatar: string;
}

const props = defineProps<{ resource: Resource }>();
const emit = defineEmits<{ (e: "click"): void }>();

const themeStore = useThemeStore();
const isDark = computed(() => themeStore.isDark);

const getCategoryLabel = (cat: string) => {
  const m: Record<string, string> = {
    ai_account: "AI 账号",
    dev_tool: "开发工具",
    subscription: "会员订阅",
    course: "学习资源",
    design: "设计素材",
  };
  return m[cat] || cat;
};

const getCategoryIcon = (cat: string) => {
  const m: Record<string, string> = {
    ai_account: "robot",
    dev_tool: "code",
    subscription: "crown",
    course: "graduation-cap",
    design: "palette",
  };
  return m[cat] || "tag";
};

const getCategoryColor = (cat: string) => {
  const m: Record<string, string> = {
    ai_account: "#8b5cf6", // Violet
    dev_tool: "#3b82f6", // Blue
    subscription: "#f59e0b", // Amber
    course: "#10b981", // Emerald
    design: "#ec4899", // Pink
  };
  return m[cat] || "#3b82f6";
};
</script>

<style scoped lang="scss">
.product-card {
  --card-bg: var(--surface, #ffffff);
  --card-border: var(--border-light, #f1f5f9);
  --card-shadow: 0 4px 20px -4px rgba(0, 0, 0, 0.05);
  --card-shadow-hover: 0 20px 40px -12px rgba(0, 0, 0, 0.12);
  --accent-color: #3b82f6;

  position: relative;
  display: flex;
  flex-direction: column;
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: 20px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.5s cubic-bezier(0.2, 1, 0.3, 1);
  height: 100%;

  &:hover {
    transform: translateY(-8px);
    border-color: color-mix(in srgb, var(--accent-color) 30%, transparent);
    box-shadow: 0 20px 40px -12px rgba(0, 0, 0, 0.1),
      0 0 20px 0 color-mix(in srgb, var(--accent-color) 15%, transparent);

    .card-cover img {
      transform: scale(1.1);
    }
    .cover-overlay {
      opacity: 1;
    }
    .glass-reflection {
      transform: translateX(100%) rotate(45deg);
    }
    .price-buoy {
      transform: translate(4px, -4px);
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
    }
  }

  &.is-hot {
    border-color: rgba(245, 158, 11, 0.2);
    &:hover {
      box-shadow: 0 20px 40px -12px rgba(245, 158, 11, 0.1),
        0 0 25px 0 rgba(245, 158, 11, 0.15);
    }
  }

  .dark-mode & {
    --card-bg: #1e293b;
    --card-border: rgba(255, 255, 255, 0.05);
    --card-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.3);

    &:hover {
      background: #1e293b;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5),
        0 0 20px 0 color-mix(in srgb, var(--accent-color) 20%, transparent);
    }
  }
}

/* === 封面区域 === */
.card-cover {
  position: relative;
  aspect-ratio: 16 / 10;
  overflow: hidden;
  background: var(--bg-secondary, #f8fafc);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.8s cubic-bezier(0.2, 1, 0.3, 1);
  }
}

.cover-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.3) 0%, transparent 60%);
  opacity: 0.6;
  transition: opacity 0.3s ease;
}

.glass-reflection {
  position: absolute;
  top: 0;
  left: -150%;
  width: 50%;
  height: 300%;
  background: linear-gradient(
    to right,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.2) 50%,
    rgba(255, 255, 255, 0) 100%
  );
  transform: rotate(45deg);
  transition: transform 0.8s cubic-bezier(0.23, 1, 0.32, 1);
  pointer-events: none;
  z-index: 1;
}

.hot-tag {
  position: absolute;
  top: 12px;
  right: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  background: linear-gradient(135deg, #f97316, #ef4444);
  backdrop-filter: blur(8px);
  border-radius: 8px;
  font-size: 10px;
  font-weight: 900;
  color: #fff;
  z-index: 2;
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
  letter-spacing: 0.5px;
}

.price-buoy {
  position: absolute;
  bottom: 12px;
  left: 12px;
  display: flex;
  align-items: baseline;
  gap: 1px;
  padding: 6px 14px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  color: #ef4444;
  z-index: 2;
  transition: all 0.4s cubic-bezier(0.2, 1, 0.3, 1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);

  .currency {
    font-size: 14px;
    font-weight: 800;
    margin-right: 2px;
  }
  .amount {
    font-size: 18px;
    font-weight: 800;
    letter-spacing: -0.5px;
  }

  .dark-mode & {
    background: rgba(15, 23, 42, 0.85);
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: #f87171;
  }
}

/* === 内容区域 === */
.card-body {
  padding: 16px 18px 20px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.body-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.tag-and-dot {
  display: flex;
  align-items: center;
  gap: 8px;
}

.category-tag {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 11px;
  font-weight: 800;
  color: var(--accent-color);
  background: color-mix(in srgb, var(--accent-color) 10%, transparent);
  padding: 3px 10px;
  border-radius: 8px;
  letter-spacing: 0.3px;
  white-space: nowrap;

  .cat-icon {
    font-size: 10px;
    opacity: 0.8;
  }
}

.meta-dot {
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: #cbd5e1;

  .dark-mode & {
    background: #475569;
  }
}

.sales-info {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: var(--text-tertiary, #94a3b8);
  font-weight: 600;
  white-space: nowrap;

  .sales-icon {
    font-size: 11px;
    opacity: 0.7;
  }
}

.product-title {
  font-size: 17px;
  font-weight: 800;
  color: var(--text, #1e293b);
  line-height: 1.4;
  margin: 0 0 8px;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  transition: color 0.3s;

  &.hot-title {
    background: linear-gradient(
      to right,
      #b45309 0%,
      #f59e0b 25%,
      #fff 50%,
      #f59e0b 75%,
      #b45309 100%
    );
    background-size: 200% auto;
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: flow 3s linear infinite;
  }

  .dark-mode & {
    color: #f1f5f9;
  }
}

@keyframes flow {
  from {
    background-position: 200% center;
  }
  to {
    background-position: 0% center;
  }
}

.product-desc {
  font-size: 13px;
  color: var(--text-secondary, #64748b);
  line-height: 1.6;
  margin: 0 0 16px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  flex-grow: 1;

  .dark-mode & {
    color: #94a3b8;
  }
}

/* === 移动端优化 === */
@media (max-width: 768px) {
  .card-body {
    padding: 12px 6px 1px;
  }

  .body-meta {
    gap: 8px;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-items: center;
    overflow: hidden;
  }

  .category-tag {
    padding: 2px 6px;
    font-size: 10px;
    gap: 3px;
    .cat-icon {
      font-size: 9px;
    }
  }

  .sales-info {
    font-size: 11px;
    gap: 3px;
    .sales-icon {
      font-size: 10px;
    }
  }

  .product-title {
    font-size: 15px;
    margin-bottom: 4px;
  }

  .product-desc {
    font-size: 12px;
  }
}
</style>

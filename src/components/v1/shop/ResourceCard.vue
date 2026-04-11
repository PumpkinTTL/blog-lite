<template>
  <div class="product-card" @click="emit('click')">
    <!-- 封面区域 -->
    <div class="card-cover">
      <img :src="resource.cover" :alt="resource.title" loading="lazy" />
      <div class="cover-overlay"></div>

      <!-- 热销标签 -->
      <div v-if="resource.isHot" class="hot-tag">
        <font-awesome-icon icon="fire" class="tag-icon" />
        <span>热门</span>
      </div>

      <!-- 价格浮标 (放在左下角) -->
      <div class="price-buoy">
        <span class="currency">¥</span>
        <span class="amount">{{ resource.price }}</span>
      </div>

      <!-- Hover 操作按钮 -->
      <div class="hover-actions">
        <button
          class="action-item add-cart"
          @click.stop="handleAddToCart"
          title="加入购物车"
        >
          <font-awesome-icon icon="plus" />
        </button>
        <button
          class="action-item favorite"
          @click.stop
          title="收藏"
        >
          <font-awesome-icon icon="heart" />
        </button>
      </div>
    </div>

    <!-- 内容区域 -->
    <div class="card-body">
      <!-- 分类 & 销量 -->
      <div class="body-meta">
        <span
          class="category-tag"
          :style="{ '--cat-color': getCategoryColor(resource.category) }"
        >
          {{ getCategoryLabel(resource.category) }}
        </span>
        <span class="sales-info">{{ resource.sales }} 销量</span>
      </div>

      <!-- 标题 -->
      <h3 class="product-title" :title="resource.title">
        {{ resource.title }}
      </h3>

      <!-- 描述 -->
      <p class="product-desc">{{ resource.description }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
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

const getCategoryColor = (cat: string) => {
  const m: Record<string, string> = {
    ai_account: "#8b5cf6",
    dev_tool: "#3b82f6",
    subscription: "#f59e0b",
    course: "#10b981",
    design: "#ec4899",
  };
  return m[cat] || "#3b82f6";
};

const handleAddToCart = () => {
  console.log("Add to cart:", props.resource.id);
};
</script>

<style scoped lang="scss">
.product-card {
  --card-bg: var(--surface, #ffffff);
  --card-border: var(--border-light, #f1f5f9);
  --card-shadow: 0 2px 10px rgba(0, 0, 0, 0.03);
  --card-shadow-hover: 0 16px 36px -10px rgba(0, 0, 0, 0.08);
  
  position: relative;
  display: flex;
  flex-direction: column;
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
  height: 100%;

  &:hover {
    transform: translateY(-6px);
    border-color: var(--primary-light, #dbeafe);
    box-shadow: var(--card-shadow-hover);

    .card-cover img {
      transform: scale(1.08);
    }
    .cover-overlay {
      opacity: 1;
    }
    .hover-actions {
      opacity: 1;
      transform: translateY(0);
    }
    .price-buoy {
      transform: translate(2px, -2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
    }
  }

  /* 暗色模式适配 */
  .dark-mode & {
    --card-bg: #1e293b;
    --card-border: rgba(255, 255, 255, 0.06);
    --card-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
    --card-shadow-hover: 0 20px 45px -12px rgba(0, 0, 0, 0.5);

    &:hover {
      border-color: rgba(59, 130, 246, 0.3);
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
    transition: transform 0.6s cubic-bezier(0.23, 1, 0.32, 1);
  }
}

.cover-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, transparent 60%, rgba(0, 0, 0, 0.15) 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.hot-tag {
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 3px 10px;
  background: rgba(249, 115, 22, 0.9);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border-radius: 8px;
  font-size: 10px;
  font-weight: 800;
  color: #fff;
  z-index: 2;

  .tag-icon {
    font-size: 9px;
  }
}

/* 价格浮标 (左下角) */
.price-buoy {
  position: absolute;
  bottom: 10px;
  left: 10px;
  display: flex;
  align-items: baseline;
  gap: 1px;
  padding: 4px 12px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: 10px;
  color: #ef4444;
  z-index: 2;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

  .currency {
    font-size: 11px;
    font-weight: 800;
    color: #ef4444;
    margin-right: 1px;
  }
  .amount {
    font-size: 19px;
    font-weight: 900;
    letter-spacing: -0.5px;
    color: #ef4444;
  }

  .dark-mode & {
    background: rgba(15, 23, 42, 0.9);
    color: #f87171;
  }
}

.hover-actions {
  position: absolute;
  top: 10px;
  left: 10px;
  display: flex;
  gap: 6px;
  opacity: 0;
  transform: translateY(-4px);
  transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
  z-index: 3;
}

.action-item {
  width: 32px;
  height: 32px;
  border-radius: 10px;
  border: none;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);

  &:hover {
    transform: scale(1.1);
    color: var(--primary);
  }

  &.add-cart:hover {
    background: var(--primary);
    color: #fff;
  }

  &.favorite:hover {
    color: #ef4444;
  }

  .dark-mode & {
    background: #1e293b;
    color: #94a3b8;
  }
}

/* === 内容区域 === */
.card-body {
  padding: 14px 16px 18px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.body-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.category-tag {
  font-size: 10px;
  font-weight: 700;
  color: var(--cat-color);
  background: color-mix(in srgb, var(--cat-color) 10%, transparent);
  padding: 1px 8px;
  border-radius: 5px;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.sales-info {
  font-size: 11px;
  color: var(--text-tertiary, #94a3b8);
  font-weight: 600;
}

.product-title {
  font-size: 16px;
  font-weight: 750;
  color: var(--text);
  line-height: 1.4;
  margin-bottom: 6px;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-desc {
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.55;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  flex-grow: 1;
}
</style>



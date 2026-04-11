<template>
  <div class="product-card" @click="emit('click')">
    <!-- 封面区域 -->
    <div class="card-cover">
      <img :src="resource.cover" :alt="resource.title" loading="lazy" />
      <div class="cover-gradient"></div>

      <!-- 热销标签 -->
      <span v-if="resource.isHot" class="hot-badge">
        <font-awesome-icon icon="fire" />
        热销
      </span>

      <!-- 价格浮标 -->
      <span class="cover-price">
        <span class="yen">¥</span>{{ resource.price }}
      </span>

      <!-- Hover 操作按钮 -->
      <div class="cover-actions">
        <button class="action-btn primary" @click.stop="handleAddToCart" title="加入购物车">
          <font-awesome-icon icon="bag-shopping" />
        </button>
        <button class="action-btn" @click.stop title="收藏">
          <font-awesome-icon icon="heart" />
        </button>
      </div>
    </div>

    <!-- 内容区域 -->
    <div class="card-content">
      <!-- 分类 -->
      <div class="content-meta">
        <span class="meta-cat" :style="{ '--cat-color': getCategoryColor(resource.category) }">
          <i class="cat-dot"></i>
          {{ getCategoryLabel(resource.category) }}
        </span>
        <span class="footer-sales">{{ resource.sales }} 人已购</span>
      </div>

      <!-- 标题 -->
      <h3 class="content-title" :title="resource.title">{{ resource.title }}</h3>

      <!-- 描述 -->
      <p class="content-desc">{{ resource.description }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
export interface Resource {
  id: number
  title: string
  description: string
  cover: string
  price: number
  sales: number
  rating: number
  isHot?: boolean
  category: string
  author: string
  authorAvatar: string
}

const props = defineProps<{ resource: Resource }>()
const emit = defineEmits<{ (e: 'click'): void }>()

const getCategoryLabel = (cat: string) => {
  const m: Record<string, string> = {
    ai_account: 'AI 账号',
    dev_tool: '开发工具',
    subscription: '会员订阅',
    course: '学习资源',
    design: '设计素材',
  }
  return m[cat] || cat
}

const getCategoryColor = (cat: string) => {
  const m: Record<string, string> = {
    ai_account: '#8b5cf6',
    dev_tool: '#3b82f6',
    subscription: '#f59e0b',
    course: '#10b981',
    design: '#ec4899',
  }
  return m[cat] || '#3b82f6'
}

const handleAddToCart = () => {
  console.log('Add to cart:', props.resource.id)
}
</script>

<style scoped lang="scss">
/* ========================================
   ResourceCard — Digital Resource Store
   Style: Vibrant & Block-based
   Palette: Primary #3B82F6 / CTA #F97316
   Transition: cubic-bezier(0.16, 1, 0.3, 1)
   ======================================== */

.product-card {
  position: relative;
  display: flex;
  flex-direction: column;
  background: var(--surface, #ffffff);
  border: 1px solid var(--border-light, #e2e8f0);
  border-radius: 14px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1),
              box-shadow 0.25s cubic-bezier(0.16, 1, 0.3, 1),
              border-color 0.2s ease;

  &:hover {
    transform: translateY(-4px);
    border-color: var(--border-hover, #cbd5e1);
    box-shadow: 0 16px 32px -8px rgba(15, 23, 42, 0.1);

    .cover-gradient { opacity: 1; }
    .cover-actions { opacity: 1; transform: translateY(0); }
    .card-cover img { transform: scale(1.05); }
    .cover-price { opacity: 0; }
  }

  /* 暗色模式 */
  .dark-mode & {
    background: rgba(30, 41, 59, 0.6);
    border-color: rgba(71, 85, 105, 0.25);

    &:hover {
      border-color: rgba(100, 116, 139, 0.4);
      box-shadow: 0 16px 32px -8px rgba(0, 0, 0, 0.3);
    }
  }
}

/* === 封面 === */
.card-cover {
  position: relative;
  aspect-ratio: 16 / 10;
  overflow: hidden;
  background: var(--bg-secondary, #f1f5f9);

  .dark-mode & { background: rgba(30, 41, 59, 0.4); }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  }
}

.cover-gradient {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, transparent 40%, rgba(0, 0, 0, 0.2) 100%);
  opacity: 0;
  transition: opacity 0.3s;
  pointer-events: none;
}

/* 热销标签 */
.hot-badge {
  position: absolute;
  top: 10px;
  left: 10px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 10px;
  background: #f97316;
  color: #fff;
  font-size: 10px;
  font-weight: 700;
  border-radius: 6px;
  letter-spacing: 0.3px;
  box-shadow: 0 2px 8px rgba(249, 115, 22, 0.35);
}

/* 价格浮标 */
.cover-price {
  position: absolute;
  bottom: 10px;
  right: 10px;
  display: inline-flex;
  align-items: baseline;
  gap: 1px;
  padding: 4px 10px;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  border-radius: 8px;
  font-size: 16px;
  font-weight: 800;
  color: var(--text, #0f172a);
  letter-spacing: -0.3px;
  transition: opacity 0.2s;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);

  .yen { font-size: 10px; font-weight: 700; opacity: 0.5; }

  .dark-mode & {
    background: rgba(15, 23, 42, 0.92);
    color: #f8fafc;
  }
}

/* Hover 操作 */
.cover-actions {
  position: absolute;
  bottom: 10px;
  right: 10px;
  display: flex;
  gap: 6px;
  opacity: 0;
  transform: translateY(6px);
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.action-btn {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: none;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  color: var(--text-secondary, #475569);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background: #fff;
    color: var(--text, #0f172a);
  }

  &.primary {
    background: #3b82f6;
    color: #fff;

    &:hover { background: #2563eb; color: #fff; }
  }

  .dark-mode & {
    background: rgba(30, 41, 59, 0.92);
    color: #94a3b8;

    &:hover { background: rgba(51, 65, 85, 0.95); color: #f8fafc; }

    &.primary { background: #3b82f6; color: #fff; &:hover { background: #2563eb; } }
  }
}

/* === 内容 === */
.card-content {
  padding: 14px 16px 16px;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.content-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.meta-cat {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 11px;
  font-weight: 600;
  color: var(--cat-color, #3b82f6);

  .cat-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--cat-color, #3b82f6);
    display: inline-block;
  }
}

.footer-sales {
  font-size: 11px;
  font-weight: 500;
  color: var(--text-tertiary, #94a3b8);
}

.content-title {
  margin: 0 0 5px;
  font-size: 15px;
  font-weight: 700;
  color: var(--text, #0f172a);
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;

  .dark-mode & { color: #f1f5f9; }
}

.content-desc {
  margin: 0 0 12px;
  font-size: 12px;
  color: var(--text-secondary, #64748b);
  line-height: 1.55;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  flex: 1;

  .dark-mode & { color: #94a3b8; }
}

/* 减弱动画偏好 */
@media (prefers-reduced-motion: reduce) {
  .product-card { transition: none !important; }
  .card-cover img { transition: none !important; }
  .cover-actions { transition: none !important; opacity: 1 !important; transform: none !important; }
}
</style>

<template>
  <div class="shop-card group" @click="handleClick">
    <div class="card-inner">
      <div class="visual-area">
        <img :src="resource.cover" :alt="resource.title" class="cover" loading="lazy" />
        <div class="overlay"></div>
        <div class="price-pill">
          <span class="symbol">¥</span>
          <span class="num">{{ resource.price }}</span>
        </div>
        <div v-if="resource.isHot" class="hot-badge">
          精选
        </div>
      </div>

      <div class="info-area">
        <div class="meta-line">
          <span class="cat-tag" :style="{ color: getCategoryColor(resource.category) }">
            {{ getCategoryLabel(resource.category) }}
          </span>
          <span class="sales-text">已售 {{ resource.sales }}</span>
        </div>

        <h3 class="title" :title="resource.title">{{ resource.title }}</h3>
        <p class="desc">{{ resource.description }}</p>

        <div class="bottom-bar">
          <div class="author-block">
            <img :src="resource.authorAvatar" class="avatar" />
            <span class="name">{{ resource.author }}</span>
          </div>
          
          <button class="add-btn" @click.stop="handleAddToCart" title="加入购物车">
            <font-awesome-icon icon="plus" class="icon" />
          </button>
        </div>
      </div>
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
  const labels: Record<string, string> = {
    template: 'UI模板', component: '组件', tool: '插件', tutorial: '教程'
  }
  return labels[cat] || cat
}

const getCategoryColor = (cat: string) => {
  const colors: Record<string, string> = {
    template: 'var(--primary, #3b82f6)',
    component: 'var(--success, #10b981)',
    tool: 'var(--secondary, #8b5cf6)',
    tutorial: 'var(--warning, #f59e0b)'
  }
  return colors[cat] || 'var(--primary)'
}

const handleClick = () => {
  emit('click')
}

const handleAddToCart = () => {
  console.log('Action for:', props.resource.id)
}
</script>

<style scoped lang="scss">
.shop-card {
  display: block;
  cursor: pointer;
  perspective: 1000px;
}

.card-inner {
  height: 100%;
  background: var(--surface, #ffffff);
  border: 1px solid var(--border-light, #e2e8f0);
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.03);

  &:hover {
    border-color: var(--border-hover, #cbd5e1);
    box-shadow: 0 8px 24px -6px rgba(15, 23, 42, 0.08);
    transform: translateY(-2px);
    
    .cover { transform: scale(1.04); }
    .overlay { opacity: 1; }
  }
}

.visual-area {
  position: relative;
  aspect-ratio: 16 / 10;
  background: var(--bg-secondary, #f8fafc);
  overflow: hidden;
  border-bottom: 1px solid var(--border-light, #f1f5f9);
}

.cover {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(0,0,0,0) 40%, rgba(0,0,0,0.15) 100%);
  opacity: 0;
  transition: opacity 0.3s;
  pointer-events: none;
}

.price-pill {
  position: absolute;
  bottom: 8px;
  right: 8px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  padding: 2px 8px;
  border-radius: 6px;
  display: flex;
  align-items: baseline;
  gap: 1px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

  .symbol { font-size: 10px; font-weight: 800; color: var(--text-secondary, #64748b); }
  .num { font-size: 14px; font-weight: 800; color: var(--text, #0f172a); letter-spacing: -0.5px; }
}

@media (prefers-color-scheme: dark) {
  html.dark .price-pill {
    background: rgba(15, 23, 42, 0.95);
    .symbol { color: var(--text-tertiary); }
    .num { color: #f8fafc; }
  }
}

.hot-badge {
  position: absolute;
  top: 8px;
  left: 8px;
  background: var(--error, #ef4444);
  color: #fff;
  font-size: 9px;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 4px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 2px 6px rgba(239, 68, 68, 0.3);
}

.info-area {
  padding: 12px;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.meta-line {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.cat-tag {
  font-size: 10px;
  font-weight: 700;
}

.sales-text {
  font-size: 10px;
  color: var(--text-tertiary, #94a3b8);
  font-weight: 500;
}

.title {
  font-size: 14px;
  font-weight: 700;
  color: var(--text, #1e293b);
  margin: 0 0 4px;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.desc {
  font-size: 12px;
  color: var(--text-secondary, #64748b);
  line-height: 1.5;
  margin: 0 0 12px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  flex: 1;
}

.bottom-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 10px;
  border-top: 1px dashed var(--border-light, #e2e8f0);
}

.author-block {
  display: flex;
  align-items: center;
  gap: 6px;

  .avatar {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    object-fit: cover;
    border: 1px solid var(--border-light, #f1f5f9);
  }
  
  .name {
    font-size: 11px;
    font-weight: 600;
    color: var(--text-secondary, #475569);
  }
}

.add-btn {
  width: 26px;
  height: 26px;
  border-radius: 6px;
  border: 1px solid var(--border-light, #e2e8f0);
  background: var(--bg-secondary, #f8fafc);
  color: var(--text-secondary, #64748b);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;

  .icon { font-size: 12px; }

  &:hover {
    background: var(--primary, #3b82f6);
    border-color: var(--primary, #3b82f6);
    color: #fff;
    transform: scale(1.05);
  }
}
</style>

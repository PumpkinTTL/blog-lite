<template>
  <div class="resource-card" :class="{ 'is-featured': resource.isHot }">
    <div class="card-inner">
      <!-- Media Header -->
      <div class="image-box">
        <img :src="resource.cover" :alt="resource.title" class="cover-img" loading="lazy" />
        <div class="overlay-gradient"></div>
        
        <!-- Premium Floating Badges -->
        <div class="floating-meta">
          <div v-if="resource.isHot" class="premium-badge">PRO</div>
          <div class="category-pill" :style="{ '--cat-color': getCategoryColor(resource.category) }">
            {{ getCategoryLabel(resource.category) }}
          </div>
        </div>

        <!-- Quick Stats on Image -->
        <div class="bottom-stats">
          <div class="stats-left">
            <span class="stat-item"><font-awesome-icon icon="eye" /> 1.2k</span>
            <span class="stat-item"><font-awesome-icon icon="heart" /> 428</span>
          </div>
        </div>
      </div>

      <!-- Compact Content Body -->
      <div class="content-body">
        <h3 class="short-title">{{ resource.title }}</h3>
        <p class="mini-desc">{{ resource.description }}</p>

        <!-- Dynamic Tags -->
        <div class="tag-cloud">
          <span class="mini-tag">#Vue3</span>
          <span class="mini-tag">#Tailwind</span>
          <span v-if="resource.isHot" class="mini-tag highlight">#Featured</span>
        </div>

        <!-- Refined Footer -->
        <div class="card-footer">
          <div class="price-section">
            <span class="currency">¥</span>
            <span class="val">{{ resource.price }}</span>
          </div>
          
          <div class="action-zone">
            <span class="sales-text">已售 {{ resource.sales }}</span>
            <button class="get-btn" @click.stop="handleClick">
              <font-awesome-icon icon="plus" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Resource {
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

const props = defineProps<{
  resource: Resource
}>()

const getCategoryLabel = (cat: string) => {
  const labels: Record<string, string> = {
    template: '模板',
    component: '组件',
    tool: '工具',
    tutorial: '教程'
  }
  return labels[cat] || cat
}

const getCategoryColor = (cat: string) => {
  const colors: Record<string, string> = {
    template: '#6366f1', // Indigo
    component: '#10b981', // Emerald
    tool: '#06b6d4',      // Cyan
    tutorial: '#f43f5e'   // Rose
  }
  return colors[cat] || '#6366f1'
}

const handleClick = () => {
  console.log('Action for:', props.resource.id)
}
</script>

<style scoped lang="scss">
.resource-card {
  height: 100%;
}

.card-inner {
  height: 100%;
  background: var(--surface);
  border-radius: var(--radius-lg); 
  border: 1px solid var(--border);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: transform var(--transition), box-shadow var(--transition);
  box-shadow: var(--shadow-sm);
}

.image-box {
  position: relative;
  aspect-ratio: 2 / 1.25; 
  overflow: hidden;
  background: var(--bg);
}

.cover-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.overlay-gradient {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, transparent 60%, rgba(0, 0, 0, 0.2) 100%);
  opacity: 0.6;
}

.floating-meta {
  position: absolute;
  top: 10px;
  left: 10px;
  display: flex;
  gap: 6px;
  z-index: 2;
}

.premium-badge {
  background: var(--warning);
  color: #fff;
  font-size: 9px;
  font-weight: 800;
  padding: 3px 8px;
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  gap: 4px;
}

.category-pill {
  background: var(--surface);
  color: var(--cat-color, var(--primary));
  font-size: 9px;
  font-weight: 800;
  padding: 3px 8px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border-light);
}

.bottom-stats {
  position: absolute;
  bottom: 10px;
  left: 12px;
  right: 12px;
  display: flex;
  justify-content: space-between;
  color: #fff;
  font-size: 10px;
  font-weight: 700;
  z-index: 2;

  .stats-left { display: flex; gap: 10px; }
  .stat-item {
    display: flex;
    align-items: center;
    gap: 4px;
    text-shadow: 0 1px 4px rgba(0,0,0,0.4);
  }
}

.content-body {
  padding: 14px;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.short-title {
  margin: 0 0 6px;
  font-size: 15px;
  font-weight: 700;
  color: var(--text);
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.mini-desc {
  margin: 0 0 12px;
  font-size: 12px;
  color: var(--text-secondary);
  line-height: 1.6;
  height: 38px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.tag-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 14px;
}

.mini-tag {
  font-size: 10px;
  font-weight: 600;
  color: var(--text-tertiary);
  background: var(--bg);
  padding: 2px 8px;
  border-radius: var(--radius-sm);
  &.highlight {
    background: var(--primary-light);
    color: var(--primary);
  }
}

.card-footer {
  margin-top: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 12px;
  border-top: 1px solid var(--border-light);
}

.price-section {
  display: flex;
  align-items: baseline;
  gap: 2px;
  color: var(--primary);
  .currency { font-size: 11px; font-weight: 800; }
  .val { font-size: 22px; font-weight: 900; letter-spacing: -0.04em; }
}

.action-zone {
  display: flex;
  align-items: center;
  gap: 12px;
}

.sales-text {
  font-size: 10px;
  color: var(--text-tertiary);
  font-weight: 600;
}

.get-btn {
  width: 32px;
  height: 32px;
  border-radius: var(--radius-md);
  border: none;
  background: var(--primary);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all var(--transition);
  &:hover {
    background: var(--primary-hover);
    transform: translateY(-2px);
  }
}

/* Hover States */
.resource-card:hover {
  .card-inner {
    border-color: var(--primary);
    box-shadow: var(--shadow-md);
  }
  .cover-img { transform: scale(1.05); }
}

/* Featured State */
.is-featured {
  .card-inner {
    border-color: var(--warning);
    background: linear-gradient(135deg, var(--surface) 0%, var(--warning-light) 60%);
  }
  .short-title, .price-section { color: var(--warning); }
}

@media (max-width: 768px) {
  .content-body { padding: 12px; }
  .short-title { font-size: 14px; }
  .mini-desc, .tag-cloud { display: none; }
  .val { font-size: 19px; }
}
</style>

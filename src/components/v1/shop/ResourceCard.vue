<template>
  <div class="resource-card" :class="{ 'is-featured': resource.isHot }">
    <div class="card-inner">
      <!-- Media Header - Compact Aspect Ratio -->
      <div class="image-box">
        <img :src="resource.cover" :alt="resource.title" class="cover-img" loading="lazy" />
        <div class="overlay-gradient"></div>
        
        <!-- Premium Floating Badges -->
        <div class="floating-meta">
          <div v-if="resource.isHot" class="premium-badge">
            <span class="pulse-dot"></span>
            PRO
          </div>
          <div class="category-pill">{{ getCategoryLabel(resource.category) }}</div>
        </div>

        <!-- Quick Stats on Image -->
        <div class="bottom-stats">
          <span class="stat-item"><font-awesome-icon icon="eye" /> 1.2k</span>
          <span class="stat-item"><font-awesome-icon icon="heart" /> 428</span>
        </div>
      </div>

      <!-- Compact Content Body -->
      <div class="content-body">
        <div class="title-row">
          <h3 class="short-title">{{ resource.title }}</h3>
        </div>
        
        <p class="mini-desc">{{ resource.description }}</p>

        <!-- Dynamic Tags (Adds detail) -->
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
import { defineComponent } from 'vue'

// Define the component name and properties for IDE stability
defineComponent({
  name: 'ResourceCard'
})

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

const handleClick = () => {
  console.log('Action for:', props.resource.id)
}
</script>


<style scoped lang="scss">
.resource-card {
  height: 100%;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  perspective: 1000px;

  &:hover {
    transform: translateY(-5px);
    .card-inner {
      border-color: rgba(59, 130, 246, 0.3);
      box-shadow: 0 12px 30px -10px rgba(0, 0, 0, 0.08);
    }
    .cover-img { transform: scale(1.06); }
    .get-btn {
      background: #1e293b;
      color: white;
      transform: rotate(90deg);
    }
  }
}

.card-inner {
  height: 100%;
  background: #ffffff;
  border-radius: 14px;
  border: 1px solid rgba(0, 0, 0, 0.05);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
}

.image-box {
  position: relative;
  aspect-ratio: 2 / 1.25; 
  overflow: hidden;
  background: #f8fafc;
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
  background: linear-gradient(to bottom, rgba(0,0,0,0) 50%, rgba(0,0,0,0.4) 100%);
  opacity: 0.8;
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
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  color: #fbbf24;
  font-size: 9px;
  font-weight: 800;
  padding: 3px 8px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  gap: 4px;
  border: 1px solid rgba(251, 191, 36, 0.3);
  letter-spacing: 0.05em;
}

.pulse-dot {
  width: 4px;
  height: 4px;
  background: #fbbf24;
  border-radius: 50%;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% { transform: scale(0.9); opacity: 1; }
  50% { transform: scale(1.2); opacity: 0.5; }
  100% { transform: scale(0.9); opacity: 1; }
}

.category-pill {
  background: rgba(255, 255, 255, 0.9);
  color: #475569;
  font-size: 9px;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 6px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.05);
}

.bottom-stats {
  position: absolute;
  bottom: 8px;
  left: 10px;
  right: 10px;
  display: flex;
  gap: 12px;
  color: rgba(255,255,255,0.9);
  font-size: 10px;
  font-weight: 600;
  z-index: 2;

  .stat-item {
    display: flex;
    align-items: center;
    gap: 4px;
    text-shadow: 0 1px 2px rgba(0,0,0,0.3);
  }
}

.content-body {
  padding: 12px;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.short-title {
  margin: 0 0 6px;
  font-size: 14px;
  font-weight: 700;
  color: #1e293b;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.mini-desc {
  margin: 0 0 10px;
  font-size: 11px;
  color: #64748b;
  line-height: 1.5;
  height: 33px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.tag-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-bottom: 12px;
}

.mini-tag {
  font-size: 9px;
  font-weight: 600;
  color: #94a3b8;
  background: #f1f5f9;
  padding: 1px 6px;
  border-radius: 4px;
  
  &.highlight {
    background: #eff6ff;
    color: #3b82f6;
  }
}

.card-footer {
  margin-top: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 10px;
  border-top: 1px solid #f1f5f9;
}

.price-section {
  display: flex;
  align-items: baseline;
  gap: 1px;
  color: #1e293b;

  .currency {
    font-size: 10px;
    font-weight: 700;
    color: #94a3b8;
  }

  .val {
    font-size: 18px;
    font-weight: 800;
    letter-spacing: -0.02em;
  }
}

.action-zone {
  display: flex;
  align-items: center;
  gap: 8px;
}

.sales-text {
  font-size: 10px;
  color: #94a3b8;
  font-weight: 500;
}

.get-btn {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  border: none;
  background: #f1f5f9;
  color: #64748b;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    box-shadow: 0 4px 10px rgba(0,0,0,0.1);
  }

  svg { font-size: 12px; }
}

/* Featured Style Rebuild */
.is-featured {
  .card-inner {
    border-color: rgba(251, 191, 36, 0.15);
    background: linear-gradient(to bottom right, #ffffff, #fffdfa);
  }
  .short-title {
    color: #b45309;
  }
}

/* Mobile Dense Grid */
@media (max-width: 640px) {
  .content-body { padding: 10px; }
  .short-title { font-size: 13px; }
  .mini-desc { display: none; } /* Hide desc on ultra-dense mobile to keep it tight */
  .tag-cloud { display: none; }
  .card-footer { border: none; padding-top: 0; }
  .price-section .val { font-size: 16px; }
  .sales-text { display: none; }
}
</style>



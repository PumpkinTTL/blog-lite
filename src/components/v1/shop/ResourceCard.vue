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
          <div class="category-pill" :style="{ '--cat-color': getCategoryColor(resource.category) }">{{ getCategoryLabel(resource.category) }}</div>
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
  border: 1px solid rgba(59, 130, 246, 0.08); /* Sophisticated tinted border */
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.03);
}

.image-box {
  position: relative;
  aspect-ratio: 2 / 1.25; 
  overflow: hidden;
  background: #edf2f7;
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
  background: linear-gradient(to bottom, transparent 40%, rgba(15, 23, 42, 0.5) 100%);
  opacity: 0.9;
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
  background: rgba(251, 191, 36, 0.9); /* Vibrant Amber */
  backdrop-filter: blur(8px);
  color: #78350f;
  font-size: 9px;
  font-weight: 800;
  padding: 3px 8px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  gap: 4px;
  border: 1px solid rgba(255, 255, 255, 0.4);
  letter-spacing: 0.05em;
  box-shadow: 0 4px 10px rgba(217, 119, 6, 0.2);
}

.category-pill {
  background: rgba(255, 255, 255, 0.95);
  color: var(--cat-color, #6366f1);
  font-size: 9px;
  font-weight: 800;
  padding: 3px 8px;
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  border: 1px solid rgba(0,0,0,0.02);
}

.bottom-stats {
  position: absolute;
  bottom: 8px;
  left: 10px;
  right: 10px;
  display: flex;
  justify-content: space-between;
  color: rgba(255,255,255,0.95);
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
  padding: 12px;
  display: flex;
  flex-direction: column;
  flex: 1;
  background: linear-gradient(180deg, #ffffff 0%, #f9fafb 100%);
}

.short-title {
  margin: 0 0 6px;
  font-size: 14px;
  font-weight: 800;
  color: #0f172a;
  line-height: 1.35;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  letter-spacing: -0.01em;
}

.mini-desc {
  margin: 0 0 10px;
  font-size: 11px;
  color: #475569;
  line-height: 1.6;
  height: 35px;
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
  font-weight: 700;
  color: #64748b;
  background: #f1f5f9;
  padding: 1px 7px;
  border-radius: 5px;
  border: 1px solid transparent;
  
  &.highlight {
    background: #eef2ff;
    color: #4f46e5;
    border-color: rgba(79, 70, 229, 0.1);
  }
}

.card-footer {
  margin-top: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 10px;
  border-top: 1px dashed rgba(203, 213, 225, 0.5);
}

.price-section {
  display: flex;
  align-items: baseline;
  gap: 2px;
  color: #0f172a;

  .currency {
    font-size: 10px;
    font-weight: 800;
    color: #94a3b8;
  }

  .val {
    font-size: 19px;
    font-weight: 900;
    color: #1e1b4b; /* Deep Indigo Price */
    letter-spacing: -0.03em;
  }
}

.action-zone {
  display: flex;
  align-items: center;
  gap: 10px;
}

.sales-text {
  font-size: 10px;
  color: #64748b;
  font-weight: 600;
}

.get-btn {
  width: 28px;
  height: 28px;
  border-radius: 9px;
  border: none;
  background: #eef2ff;
  color: #4f46e5;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 2px 6px rgba(79, 70, 229, 0.1);

  &:hover {
    background: #4f46e5;
    color: white;
    box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
  }

  svg { font-size: 12px; }
}

/* Featured / Special State */
.is-featured {
  .card-inner {
    border-color: rgba(251, 191, 36, 0.3);
    background: linear-gradient(135deg, #ffffff 0%, #fffbf0 100%);
  }
  .short-title { color: #854d0e; }
  .price-section .val { color: #92400e; }
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



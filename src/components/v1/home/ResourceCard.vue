<template>
  <div class="resource-card" :class="{ 'dark-mode': isDark }">
    <div class="card-inner">
      <!-- Image Wrapper -->
      <div class="image-wrapper">
        <img :src="resource.image" :alt="resource.title" class="resource-image" loading="lazy" />
        <div class="image-overlay"></div>
        
        <!-- Category Tag (Glassmorphism restored to 12px) -->
        <div class="category-tag" :style="{ '--tag-color': resource.categoryColor }">
          <span class="tag-dot"></span>
          {{ resource.category }}
        </div>

        <!-- NEW Badge restored to 12px -->
        <div v-if="isNew" class="new-badge">NEW</div>
      </div>

      <!-- Content -->
      <div class="card-content">
        <h3 class="resource-title">{{ resource.title }}</h3>
        
        <!-- Short Description (Compact) -->
        <p class="resource-desc">{{ resource.description }}</p>

        <!-- Tags Cloud (Colorized, NO #) -->
        <div class="tags-cloud">
          <span 
            v-for="(tag, index) in resource.tags.slice(0, 3)" 
            :key="tag" 
            class="small-tag"
            :style="getTagStyle(tag, index)"
          >
            {{ tag }}
          </span>
        </div>

        <!-- Footer Area (Very Compact) -->
        <div class="card-footer">
          <div class="author-info">
            <img :src="resource.author.avatar" :alt="resource.author.name" class="author-avatar" />
            <div class="meta-text">
              <span class="author-name">{{ resource.author.name }}</span>
              <div class="stats-row">
                <span class="stat-item"><font-awesome-icon icon="eye" /> {{ formatNum(resource.views) }}</span>
                <span class="stat-item"><font-awesome-icon icon="heart" /> {{ formatNum(resource.likes) }}</span>
              </div>
            </div>
          </div>
          
          <button class="download-btn" aria-label="获取资源">
            <font-awesome-icon icon="download" class="icon" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useThemeStore } from "@/stores/theme";
import type { Resource } from "@/data/mockData";

const props = defineProps<{
  resource: Resource;
}>();

const themeStore = useThemeStore();
const isDark = computed(() => themeStore.isDark);

const formatNum = (num: number) => {
  if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
  return num.toString();
};

const isNew = computed(() => {
  const createdDate = new Date(props.resource.createdAt);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - createdDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays <= 7;
});

const tagColors = [
  { text: '#3B82F6', bg: '#DBEAFE' },
  { text: '#10B981', bg: '#D1FAE5' },
  { text: '#F59E0B', bg: '#FEF3C7' },
  { text: '#8B5CF6', bg: '#F5F3FF' },
  { text: '#EC4899', bg: '#FCE7F3' },
  { text: '#06B6D4', bg: '#CFFAFE' },
];

const getTagStyle = (tag: string, index: number) => {
  const colorIndex = (tag.length + index) % tagColors.length;
  const color = tagColors[colorIndex];
  
  if (isDark.value) {
    return {
      color: color.text,
      backgroundColor: `rgba(${hexToRgb(color.text)}, 0.1)`,
      borderColor: `rgba(${hexToRgb(color.text)}, 0.2)`
    };
  }
  return {
    color: color.text,
    backgroundColor: color.bg,
    borderColor: 'transparent'
  };
};

function hexToRgb(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r}, ${g}, ${b}`;
}
</script>

<style scoped lang="scss">
.resource-card {
  position: relative;
  height: 100%;
  transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
  cursor: pointer;

  &:hover {
    transform: translateY(-6px);
    .card-inner {
      box-shadow: 0 15px 30px -10px rgba(99, 102, 241, 0.15);
      border-color: var(--primary);
    }
    .resource-image { transform: scale(1.08); }
    .download-btn {
      background: var(--primary);
      color: white;
      transform: scale(1.1);
    }
  }
}

.card-inner {
  height: 100%;
  background: white;
  border-radius: 14px;
  border: 1px solid rgba(0, 0, 0, 0.04);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
}

.image-wrapper {
  position: relative;
  aspect-ratio: 1.9 / 1; 
  overflow: hidden;
  background: #f1f5f9;
}

.resource-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s ease;
}

.image-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, transparent, rgba(0, 0, 0, 0.05));
}

.category-tag {
  position: absolute;
  top: 12px;
  left: 12px;
  padding: 5px 12px;
  border-radius: 8px;
  color: white;
  font-size: 11px;
  font-weight: 700;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  z-index: 2;
  display: flex;
  align-items: center;
  gap: 5px;

  .tag-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--tag-color);
  }
}

.new-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  background: var(--error);
  color: white;
  padding: 3px 10px;
  border-radius: 6px;
  font-size: 10px;
  font-weight: 900;
  z-index: 2;
}

.card-content {
  padding: 10px 12px;
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 6px;
}

.resource-title {
  margin: 0;
  font-size: 14px;
  font-weight: 700;
  color: #1e293b;
  line-height: 1.35;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.resource-desc {
  margin: 0;
  font-size: 11px;
  color: #64748b;
  line-height: 1.4;
  height: 31px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.tags-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.small-tag {
  font-size: 9px;
  font-weight: 700;
  padding: 1px 6px;
  border-radius: 4px;
}

.card-footer {
  margin-top: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 8px;
  border-top: 1px solid rgba(0, 0, 0, 0.03);
}

.author-info {
  display: flex;
  align-items: center;
  gap: 6px;
}

.author-avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  object-fit: cover;
}

.meta-text {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.author-name {
  font-size: 10px;
  font-weight: 700;
  color: #475569;
}

.stats-row {
  display: flex;
  gap: 6px;
  font-size: 8px;
  font-weight: 600;
  color: #94a3b8;
  .stat-item {
    display: flex;
    align-items: center;
    gap: 2px;
  }
}

.download-btn {
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
  transition: all 0.3s ease;
  .icon { font-size: 10px; }
}

.dark-mode {
  .card-inner { background: #1e293b; border-color: rgba(255, 255, 255, 0.05); }
  .resource-title { color: #f1f5f9; }
  .resource-desc { color: #94a3b8; }
  .author-name { color: #cbd5e1; }
  .card-footer { border-top-color: rgba(255, 255, 255, 0.05); }
  .download-btn { background: #334155; color: #94a3b8; }
}
</style>

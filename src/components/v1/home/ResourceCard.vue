<template>
  <div class="resource-card" :class="{ 'dark-mode': isDark }">
    <div class="card-inner">
      <!-- Image Wrapper -->
      <div class="image-wrapper">
        <img :src="resource.image" :alt="resource.title" class="resource-image" loading="lazy" />
        <div class="image-overlay"></div>
        
        <!-- Category Tag (Glassmorphism) -->
        <div class="category-tag" :style="{ '--tag-color': resource.categoryColor }">
          <span class="tag-dot"></span>
          {{ resource.category }}
        </div>

        <!-- NEW Badge -->
        <div v-if="isNew" class="new-badge">
          <font-awesome-icon icon="bolt" class="icon" />
          NEW
        </div>

        <!-- Featured Badge -->
        <div v-if="resource.featured" class="featured-badge" title="精品推荐">
          <font-awesome-icon icon="star" />
        </div>
      </div>

      <!-- Content -->
      <div class="card-content">
        <h3 class="resource-title">{{ resource.title }}</h3>
        <p class="resource-desc">{{ resource.description }}</p>

        <!-- Tags Cloud -->
        <div class="tags-cloud">
          <span v-for="tag in resource.tags.slice(0, 3)" :key="tag" class="small-tag">
            #{{ tag }}
          </span>
        </div>

        <div class="content-divider"></div>

        <!-- Meta info: Author + Stats -->
        <div class="card-meta">
          <div class="author-info">
            <img :src="resource.author.avatar" :alt="resource.author.name" class="author-avatar" />
            <span class="author-name">{{ resource.author.name }}</span>
          </div>
          
          <div class="stats">
            <span class="stat-item" title="浏览量">
              <font-awesome-icon icon="eye" class="icon" />
              {{ formatNum(resource.views) }}
            </span>
          </div>
        </div>

        <!-- Footer Action -->
        <div class="card-action">
          <div class="likes" :class="{ 'is-liked': resource.likes > 500 }">
             <font-awesome-icon icon="heart" class="icon" />
             {{ formatNum(resource.likes) }}
          </div>
          <button class="download-btn" aria-label="获取资源">
            <span>立即获取</span>
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
</script>

<style scoped lang="scss">
.resource-card {
  position: relative;
  height: 100%;
  transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1);
  cursor: pointer;

  &:hover {
    transform: translateY(-10px);

    .card-inner {
      box-shadow: 0 30px 60px -12px rgba(99, 102, 241, 0.25);
      border-color: var(--primary);
    }

    .resource-image {
      transform: scale(1.1) rotate(1deg);
    }

    .image-overlay {
      opacity: 0.2;
    }

    .download-btn {
      background: var(--primary);
      color: white;
      padding: 0 16px;
      
      span {
        width: auto;
        opacity: 1;
        margin-right: 8px;
      }
    }

    .tag-dot {
       transform: scale(1.5);
       box-shadow: 0 0 10px var(--tag-color);
    }
  }
}

.card-inner {
  height: 100%;
  background: white;
  border-radius: 20px;
  border: 1px solid rgba(0, 0, 0, 0.05);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: all 0.4s ease;
  position: relative;
}

/* Image Section */
.image-wrapper {
  position: relative;
  aspect-ratio: 16 / 10;
  overflow: hidden;
  background: #f1f5f9;
}

.resource-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.image-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, transparent, rgba(0, 0, 0, 0.3));
  opacity: 0;
  transition: opacity 0.3s ease;
}

.category-tag {
  position: absolute;
  top: 12px;
  left: 12px;
  padding: 6px 12px;
  border-radius: 10px;
  color: white;
  font-size: 11px;
  font-weight: 700;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  z-index: 2;
  display: flex;
  align-items: center;
  gap: 6px;
  border: 1px solid rgba(255, 255, 255, 0.1);

  .tag-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--tag-color);
    transition: all 0.3s ease;
  }
}

.new-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  background: var(--error);
  color: white;
  padding: 4px 10px;
  border-radius: 8px;
  font-size: 10px;
  font-weight: 800;
  display: flex;
  align-items: center;
  gap: 4px;
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
  z-index: 2;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

.featured-badge {
  position: absolute;
  bottom: 12px;
  right: 12px;
  width: 28px;
  height: 28px;
  background: rgba(255, 255, 255, 0.9);
  color: #f59e0b;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 2;
}

/* Content Section */
.card-content {
  padding: 20px;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.resource-title {
  margin: 0 0 10px;
  font-size: 17px;
  font-weight: 800;
  color: #1e293b;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  letter-spacing: -0.01em;
}

.resource-desc {
  margin: 0 0 16px;
  font-size: 13px;
  color: #64748b;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.tags-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 20px;
}

.small-tag {
  font-size: 11px;
  font-weight: 600;
  color: var(--primary);
  background: var(--primary-light);
  padding: 2px 8px;
  border-radius: 6px;
  transition: all 0.2s ease;

  &:hover {
    filter: brightness(0.95);
  }
}

.content-divider {
  height: 1px;
  background: rgba(0, 0, 0, 0.05);
  margin-bottom: 16px;
}

.card-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.author-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.author-avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  object-fit: cover;
  border: 1.5px solid white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.author-name {
  font-size: 12px;
  font-weight: 600;
  color: #475569;
}

.card-action {
  margin-top: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.likes {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 700;
  color: #94a3b8;
  transition: color 0.3s ease;

  &.is-liked {
    color: var(--error);
  }
}

.stats {
  .stat-item {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 12px;
    font-weight: 600;
    color: #94a3b8;
  }
}

.download-btn {
  height: 38px;
  padding: 0 12px;
  border-radius: 12px;
  border: none;
  background: #f1f5f9;
  color: #64748b;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  font-weight: 700;
  font-size: 13px;

  span {
    width: 0;
    opacity: 0;
    overflow: hidden;
    transition: all 0.3s ease;
    white-space: nowrap;
  }

  .icon {
    font-size: 14px;
  }

  &:hover {
    box-shadow: 0 8px 15px rgba(99, 102, 241, 0.2);
  }
}

/* Dark Mode */
.dark-mode {
  .card-inner {
    background: #1e293b;
    border-color: rgba(255, 255, 255, 0.05);
  }

  .resource-title {
    color: #f1f5f9;
  }

  .resource-desc {
    color: #94a3b8;
  }

  .small-tag {
    background: rgba(99, 102, 241, 0.1);
  }

  .content-divider {
    background: rgba(255, 255, 255, 0.05);
  }

  .author-name {
    color: #cbd5e1;
  }

  .download-btn {
    background: #334155;
    color: #94a3b8;
  }

  .featured-badge {
    background: #334155;
    color: #f59e0b;
  }
}
</style>

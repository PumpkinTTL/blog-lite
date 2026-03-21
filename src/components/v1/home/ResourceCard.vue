<template>
  <div class="resource-card" :class="{ 'dark-mode': isDark }">
    <div class="card-inner">
      <!-- Image Wrapper -->
      <div class="image-wrapper">
        <img :src="resource.image" :alt="resource.title" class="resource-image" loading="lazy" />
        <div class="image-overlay"></div>
        <div class="category-tag" :style="{ backgroundColor: resource.categoryColor }">
          {{ resource.category }}
        </div>
      </div>

      <!-- Content -->
      <div class="card-content">
        <h3 class="resource-title">{{ resource.title }}</h3>
        <p class="resource-desc">{{ resource.description }}</p>

        <!-- Footer -->
        <div class="card-footer">
          <div class="stats">
            <span class="stat-item">
              <font-awesome-icon icon="heart" class="icon" />
              {{ formatNum(resource.likes) }}
            </span>
            <span class="stat-item">
              <font-awesome-icon icon="eye" class="icon" />
              {{ formatNum(resource.views) }}
            </span>
          </div>
          <button class="download-btn" aria-label="获取资源">
            <font-awesome-icon icon="download" />
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
</script>

<style scoped lang="scss">
.resource-card {
  position: relative;
  height: 100%;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  cursor: pointer;

  &:hover {
    transform: translateY(-8px);

    .card-inner {
      box-shadow: 0 20px 30px -10px rgba(0, 0, 0, 0.15);
      border-color: var(--primary-soft);
    }

    .resource-image {
      transform: scale(1.1);
    }

    .image-overlay {
      opacity: 0.1;
    }

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
  border-radius: 16px;
  border: 1px solid rgba(0, 0, 0, 0.05);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
}

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
  transition: transform 0.6s ease;
}

.image-overlay {
  position: absolute;
  inset: 0;
  background: black;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.category-tag {
  position: absolute;
  top: 12px;
  right: 12px;
  padding: 4px 10px;
  border-radius: 8px;
  color: white;
  font-size: 11px;
  font-weight: 700;
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  z-index: 2;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.card-content {
  padding: 16px;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.resource-title {
  margin: 0 0 8px;
  font-size: 15px;
  font-weight: 700;
  color: #1e293b;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.resource-desc {
  margin: 0 0 16px;
  font-size: 12px;
  color: #64748b;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-footer {
  margin-top: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.stats {
  display: flex;
  gap: 12px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  font-weight: 600;
  color: #94a3b8;

  .icon {
    font-size: 10px;
  }
}

.download-btn {
  width: 32px;
  height: 32px;
  border-radius: 10px;
  border: none;
  background: #f1f5f9;
  color: #64748b;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: var(--primary);
    color: white;
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

  .download-btn {
    background: #334155;
    color: #94a3b8;
  }
}
</style>

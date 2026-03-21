<template>
  <div class="resource-card" :class="{ 'dark-mode': isDark, 'is-hot': isHot }">
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

        <!-- Badges -->
        <div class="badge-container">
          <div v-if="isHot" class="hot-badge">
            <font-awesome-icon icon="fire" />
            HOT
          </div>
          <div v-if="isNew" class="new-badge">NEW</div>
        </div>
      </div>

      <!-- Content -->
      <div class="card-content">
        <h3 class="resource-title" :class="{ 'hot-title': isHot }">{{ resource.title }}</h3>
        
        <!-- Short Description -->
        <p class="resource-desc">{{ resource.description }}</p>

        <!-- Tags Cloud -->
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

        <!-- Footer Area (Premium Meta Rebuild) -->
        <div class="card-footer">
          <div class="footer-left">
            <div class="avatar-wrap">
              <img :src="resource.author.avatar" :alt="resource.author.name" class="author-avatar" />
              <div v-if="resource.author.role === 'vip' || resource.author.role === 'admin' || resource.author.role === 'super_admin'" class="vip-crown">
                <font-awesome-icon icon="crown" />
              </div>
            </div>
            <div class="meta-content">
              <span class="author-name">{{ resource.author.name }}</span>
              <span class="publish-date">{{ formattedDate }}</span>
            </div>
          </div>
          
          <div class="footer-right">
            <div class="meta-stats">
              <span class="stat-pill views">
                <font-awesome-icon icon="eye" />
                {{ formatNum(resource.views) }}
              </span>
              <span class="stat-pill likes" :class="{ 'is-high': resource.likes > 800 }">
                <font-awesome-icon :icon="resource.likes > 800 ? 'star' : 'heart'" />
                {{ formatNum(resource.likes) }}
              </span>
            </div>
            <button class="download-btn" aria-label="获取资源">
              <font-awesome-icon icon="download" class="icon" />
            </button>
          </div>
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

const isHot = computed(() => props.resource.views >= 5000);

const formattedDate = computed(() => {
  const d = new Date(props.resource.createdAt);
  return `${d.getMonth() + 1}-${d.getDate()}`;
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

  /* Hot Style */
  &.is-hot {
    .card-inner {
      border-color: #ffed4a30;
      background: linear-gradient(135deg, #ffffff 0%, #fffdf0 100%);
    }
    &:hover .card-inner {
      border-color: #fbcfe8;
      box-shadow: 0 15px 30px -10px rgba(244, 63, 94, 0.15);
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

.badge-container {
  position: absolute;
  top: 12px;
  right: 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  z-index: 2;
}

.new-badge {
  background: var(--error);
  color: white;
  padding: 3px 10px;
  border-radius: 6px;
  font-size: 10px;
  font-weight: 900;
  text-align: center;
}

.hot-badge {
  background: linear-gradient(135deg, #f59e0b, #ef4444);
  color: white;
  padding: 3px 10px;
  border-radius: 6px;
  font-size: 10px;
  font-weight: 900;
  display: flex;
  align-items: center;
  gap: 3px;
  box-shadow: 0 4px 10px rgba(239, 68, 68, 0.2);
}

.card-content {
  padding: 12px 14px; /* More padding */
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 10px; /* Increased vertical gap for breathing room */
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
  transition: all 0.3s;
  position: relative;

  &.hot-title {
    /* 7-stop high-radiance "double glint" metallic gradient */
    background: linear-gradient(
      to right, 
      var(--hot-color-dark, #92400e) 0%, 
      var(--hot-color-mid, #d97706) 20%, 
      #ffffff 40%, 
      var(--hot-color-mid, #d97706) 50%, 
      #ffffff 60%, 
      var(--hot-color-mid, #d97706) 80%, 
      var(--hot-color-dark, #92400e) 100%
    );
    background-size: 200% 100%;
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: hotStream 3s linear infinite;
    display: inline-block;
    font-weight: 800;
    letter-spacing: -0.01em;
  }
}

@keyframes hotStream {
  0% { background-position: 100% 0; }
  100% { background-position: -100% 0; }
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

/* Footer Section - Spacious & Premium */
.card-footer {
  margin-top: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 14px; /* More top space */
  border-top: 1px dashed rgba(0, 0, 0, 0.05);
}

.footer-left {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
  flex: 1; /* Take space to push stats right */
}

.avatar-wrap {
  position: relative;
  flex-shrink: 0;
  
  .author-avatar {
    width: 30px;
    height: 30px;
    border-radius: 10px;
    object-fit: cover;
    border: 1.5px solid white;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
  }
  
  .vip-crown {
    position: absolute;
    top: -6px;
    right: -5px;
    font-size: 10px;
    color: #f59e0b;
    background: white;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  }
}

.meta-content {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.author-name {
  font-size: 11px;
  font-weight: 800;
  color: #1e293b;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  letter-spacing: -0.01em;
}

.publish-date {
  font-size: 8px;
  color: #94a3b8;
  font-weight: 600;
}

.footer-right {
  display: flex;
  align-items: center;
  gap: 12px; /* Balanced gap between stats and button */
}

.meta-stats {
  display: flex;
  align-items: center; /* Horizontal alignment for stats */
  gap: 10px;
  background: rgba(0,0,0,0.02);
  padding: 4px 10px;
  border-radius: 8px; /* "Pill" container for stats */
}

.stat-pill {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 10px;
  font-weight: 800;
  color: #64748b;
  line-height: 1;

  :deep(svg) {
    font-size: 10px;
    opacity: 0.8;
  }

  &.likes.is-high {
    color: #f59e0b;
  }
}

.download-btn {
  width: 32px;
  height: 32px;
  border-radius: 10px;
  border: none;
  background: #f1f5f9;
  color: #475569;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);

  &:hover {
    background: var(--primary);
    color: white;
    transform: scale(1.1) rotate(5deg);
    box-shadow: 0 5px 15px rgba(99, 102, 241, 0.25);
  }

  .icon { font-size: 12px; }
}

.dark-mode {
  .card-inner { background: #1e293b; border-color: rgba(255, 255, 255, 0.05); }

  &.is-hot {
    .card-inner {
      background: linear-gradient(135deg, #1e293b 0%, #221d0a 100%);
      border-color: rgba(255, 215, 0, 0.4); /* Brighter gold border */
    }
    
    &:hover .card-inner {
      border-color: rgba(255, 215, 0, 0.6);
      box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.5);
    }

    /* Brighter, Max-Radiance Gold Palette for Dark Mode */
    --hot-color-dark: #daa520; 
    --hot-color-mid: #ffd700;
  }
  
  .hot-badge {
    background: linear-gradient(135deg, #f59e0b, #d97706);
    border: 1px solid rgba(255, 255, 255, 0.15);
  }

  .resource-title { color: #f1f5f9; }
  .resource-desc { color: #94a3b8; }
  .author-name { color: #cbd5e1; }
  .card-footer { border-top-color: rgba(255, 255, 255, 0.05); }
  .download-btn { background: #334155; color: #94a3b8; }
  .avatar-wrap .author-avatar { border-color: #334155; }
  .meta-stats { background: rgba(255,255,255,0.04); }
}
</style>

<template>
  <article class="resource-card" :class="variant" @click="$emit('click', resource)">
    <!-- Image -->
    <div class="card-image">
      <img :src="resource.image" :alt="resource.title" />
      <div class="image-overlay">
        <button class="bookmark-btn" @click.stop="toggleBookmark">
          <font-awesome-icon :icon="['fas', isBookmarked ? 'bookmark' : 'bookmark']" :class="{ filled: isBookmarked }" />
        </button>
      </div>
      <span v-if="resource.featured" class="featured-badge">
        <font-awesome-icon :icon="['fas', 'fire']" />
        精选
      </span>
    </div>

    <!-- Content -->
    <div class="card-content">
      <!-- Category -->
      <span class="category" :style="{ background: resource.categoryColor }">
        {{ resource.category }}
      </span>

      <!-- Title -->
      <h3 class="title">{{ resource.title }}</h3>

      <!-- Description -->
      <p class="description">{{ resource.description }}</p>

      <!-- Tags -->
      <div class="tags">
        <span v-for="tag in resource.tags.slice(0, 3)" :key="tag" class="tag">
          {{ tag }}
        </span>
      </div>

      <!-- Footer -->
      <div class="card-footer">
        <div class="author">
          <img :src="resource.author.avatar" :alt="resource.author.name" class="avatar" />
          <span class="author-name">{{ resource.author.name }}</span>
        </div>
        <div class="stats">
          <span class="stat">
            <font-awesome-icon :icon="['fas', 'heart']" />
            {{ resource.likes }}
          </span>
          <span class="stat">
            <font-awesome-icon :icon="['fas', 'eye']" />
            {{ resource.views }}
          </span>
        </div>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Resource } from '@/data/mockData'

interface Props {
  resource: Resource
  variant?: 'grid' | 'list'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'grid'
})

defineEmits<{
  (e: 'click', resource: Resource): void
}>()

const isBookmarked = ref(false)

const toggleBookmark = () => {
  isBookmarked.value = !isBookmarked.value
}
</script>

<style scoped lang="scss">
.resource-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--r-lg);
  overflow: hidden;
  cursor: pointer;
  transition: all var(--ease);
  display: flex;
  flex-direction: column;

  &:hover {
    box-shadow: var(--shadow-lg);
    transform: translateY(-4px);
    border-color: var(--accent);
  }

  &.list {
    flex-direction: row;

    .card-image {
      width: 280px;
      height: 180px;
      flex-shrink: 0;
    }

    .card-content {
      flex: 1;
    }

    @media (max-width: 768px) {
      flex-direction: column;

      .card-image {
        width: 100%;
        height: 200px;
      }
    }
  }
}

// ── Image ──
.card-image {
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
  background: var(--surface-hover);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }

  &:hover img {
    transform: scale(1.05);
  }
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.3), transparent);
  opacity: 0;
  transition: opacity var(--ease);
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
  padding: 12px;

  .resource-card:hover & {
    opacity: 1;
  }
}

.bookmark-btn {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.95);
  border-radius: var(--r-sm);
  color: var(--text-2);
  font-size: 16px;
  transition: all var(--ease);

  &:hover {
    background: white;
    color: var(--accent);
    transform: scale(1.1);
  }

  .filled {
    color: var(--accent);
  }
}

.featured-badge {
  position: absolute;
  top: 12px;
  left: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  background: var(--accent);
  color: white;
  border-radius: var(--r-sm);
  font-size: 12px;
  font-weight: 600;

  svg {
    font-size: 12px;
  }
}

// ── Content ──
.card-content {
  padding: var(--space-lg);
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex: 1;
}

.category {
  display: inline-flex;
  align-items: center;
  width: fit-content;
  padding: 4px 12px;
  border-radius: var(--r-pill);
  font-size: 12px;
  font-weight: 600;
  color: white;
}

.title {
  font-size: 18px;
  font-weight: 700;
  color: var(--text);
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.description {
  font-size: 14px;
  color: var(--text-2);
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin: 0;
}

// ── Tags ──
.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.tag {
  padding: 4px 10px;
  background: var(--surface-hover);
  border-radius: var(--r-pill);
  font-size: 11px;
  font-weight: 500;
  color: var(--text-2);
  transition: all var(--ease);

  &:hover {
    background: var(--accent-soft);
    color: var(--accent);
  }
}

// ── Footer ──
.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 12px;
  border-top: 1px solid var(--border-light);
  margin-top: auto;
}

.author {
  display: flex;
  align-items: center;
  gap: 8px;
}

.avatar {
  width: 28px;
  height: 28px;
  border-radius: var(--r-pill);
  object-fit: cover;
}

.author-name {
  font-size: 13px;
  font-weight: 500;
  color: var(--text-2);
}

.stats {
  display: flex;
  align-items: center;
  gap: 12px;
}

.stat {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: var(--text-3);

  svg {
    font-size: 12px;
  }
}
</style>

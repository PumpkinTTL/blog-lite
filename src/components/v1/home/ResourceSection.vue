<template>
  <section id="resources" class="resource-section" :class="{ 'dark-mode': isDark }">
    <div class="section-header">
      <div class="header-content">
        <div class="badge">资源枢纽</div>
        <h2 class="title">精选共享资源</h2>
        <p class="subtitle">为您精心挑选的优质开发资源、设计模板和学习资料</p>
      </div>
      <button class="view-all-btn">
        查看全部
        <font-awesome-icon icon="arrow-right" class="icon" />
      </button>
    </div>

    <div class="resource-grid">
      <ResourceCard 
        v-for="resource in resources" 
        :key="resource.id" 
        :resource="resource" 
      />
    </div>
    
    <!-- Empty state or footer if needed -->
    <div class="section-footer">
      <div class="divider"></div>
      <div class="more-hint">
        更多内容正在持续更新中...
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from "vue";
import { useThemeStore } from "@/stores/theme";
import ResourceCard from "./ResourceCard.vue";
import { generateMockResources } from "@/data/mockData";
import type { Resource } from "@/data/mockData";

const themeStore = useThemeStore();
const isDark = computed(() => themeStore.isDark);

const resources = ref<Resource[]>([]);

onMounted(() => {
  // Generate a separate set of mock resources for this section
  resources.value = generateMockResources(8);
});
</script>

<style scoped lang="scss">
.resource-section {
  padding: 60px 0 40px;
  scroll-margin-top: 100px; /* Offset for sticky header */
}

/* Section Header */
.section-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 40px;
  padding: 0 4px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
  }
}

.header-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.badge {
  width: fit-content;
  padding: 4px 12px;
  background: var(--primary-light);
  color: var(--primary);
  font-size: 11px;
  font-weight: 800;
  border-radius: 99px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.title {
  margin: 0;
  font-size: 28px;
  font-weight: 800;
  color: #1e293b;
  letter-spacing: -0.02em;
}

.subtitle {
  margin: 0;
  font-size: 14px;
  color: #64748b;
  max-width: 480px;
}

.view-all-btn {
  padding: 10px 20px;
  border-radius: 12px;
  border: 1.5px solid #e2e8f0;
  background: white;
  color: #1e293b;
  font-size: 14px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  .icon {
    font-size: 12px;
    transition: transform 0.3s ease;
  }

  &:hover {
    background: #f8fafc;
    border-color: #cbd5e1;
    transform: translateX(4px);

    .icon {
      transform: translateX(4px);
    }
  }
}

/* Grid Layout */
.resource-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 500px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
}

.section-footer {
  margin-top: 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;

  .divider {
    width: 60px;
    height: 4px;
    background: #e2e8f0;
    border-radius: 2px;
  }

  .more-hint {
    font-size: 13px;
    color: #94a3b8;
    font-weight: 500;
  }
}

/* Dark Mode */
.dark-mode {
  .title {
    color: #f1f5f9;
  }

  .subtitle {
    color: #94a3b8;
  }

  .view-all-btn {
    background: #1e293b;
    border-color: #334155;
    color: #f1f5f9;

    &:hover {
      background: #334155;
      border-color: #475569;
    }
  }

  .divider {
    background: #334155;
  }

  .more-hint {
    color: #64748b;
  }
}
</style>

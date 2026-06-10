<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ArrowRight } from 'lucide-vue-next'
import type { Resource } from '@/data/mockData'
import { generateMockResources } from '@/data/mockData'
import { Button } from '@/components/ui/button'
import ResourceCard from './ResourceCard.vue'
import SectionHeading from '@/components/v2/common/SectionHeading.vue'

const resources = ref<Resource[]>([])

onMounted(() => {
  // 单独生成一组资源 mock,与文章区分
  resources.value = generateMockResources(8)
})
</script>

<template>
  <section v-if="resources.length" class="mx-auto max-w-7xl px-4 pt-10 pb-4 sm:px-6 lg:px-8 v2-animate-up v2-delay-3">
    <!-- 标题区:SectionHeading 内置按钮 -->
    <div class="mb-6">
      <SectionHeading
        eyebrow="资源中心"
        title="精选共享资源"
        description="优质开发工具、设计模板与学习资料,一键获取"
      >
        <template #actions>
          <Button variant="outline" size="sm" class="cursor-pointer shrink-0">
            查看全部
            <ArrowRight class="ml-1 h-3.5 w-3.5" />
          </Button>
        </template>
      </SectionHeading>
    </div>

    <!-- 资源网格:桌面 4 列 / 平板 2 列 / 移动 1 列 -->
    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <ResourceCard
        v-for="resource in resources"
        :key="resource.id"
        :resource="resource"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import { Skeleton } from '@/components/ui/skeleton'

defineProps<{
  /** 是否显示封面大图（如赞助页） */
  hero?: boolean
}>()
</script>

<template>
  <div class="mx-auto max-w-4xl px-4 pt-16 pb-12 sm:px-6 sm:pt-20 lg:pt-24">
    <!-- 封面 Hero -->
    <div v-if="hero" class="mb-8">
      <Skeleton class="aspect-[21/9] w-full rounded-xl" />
    </div>

    <!-- 页面标题 -->
    <div class="mb-8 space-y-3">
      <Skeleton class="h-3 w-20" />
      <Skeleton class="h-8 w-1/3" />
      <Skeleton class="h-4 w-2/3" />
    </div>

    <!-- 内容区块 -->
    <div class="space-y-6">
      <!-- 区块 1 -->
      <div class="space-y-3">
        <Skeleton class="h-5 w-1/4" />
        <Skeleton class="h-3 w-full" />
        <Skeleton class="h-3 w-full" />
        <Skeleton class="h-3 w-4/5" />
      </div>
      <!-- 区块 2 -->
      <div class="space-y-3">
        <Skeleton class="h-5 w-1/3" />
        <div class="grid gap-4 sm:grid-cols-2">
          <div v-for="i in 4" :key="i" class="space-y-2 rounded-xl border p-4">
            <Skeleton class="h-4 w-3/4" />
            <Skeleton class="h-3 w-full" />
            <Skeleton class="h-3 w-2/3" />
          </div>
        </div>
      </div>
      <!-- 区块 3 -->
      <div class="space-y-3">
        <Skeleton class="h-5 w-1/4" />
        <Skeleton class="h-3 w-full" />
        <Skeleton class="h-3 w-full" />
        <Skeleton class="h-3 w-5/6" />
      </div>
    </div>
  </div>
</template>

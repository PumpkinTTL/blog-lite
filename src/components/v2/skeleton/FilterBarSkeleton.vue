<script setup lang="ts">
import { Skeleton } from '@/components/ui/skeleton'
import { Card } from '@/components/ui/card'
</script>

<template>
  <Card class="rounded-xl shadow-none">
    <div class="space-y-3 px-3 pt-3">
      <!-- 分类行 -->
      <div class="flex items-center justify-between">
        <div class="flex gap-1">
          <Skeleton v-for="i in 6" :key="i" class="h-8 w-14 rounded-md" />
        </div>
        <div class="flex items-center gap-2">
          <Skeleton class="h-8 w-48 rounded-lg" />
          <Skeleton class="h-6 w-16 rounded-md" />
        </div>
      </div>
    </div>
    <!-- 分割线 -->
    <Skeleton class="mx-3 my-2 h-px w-auto" />
    <!-- 标签行 -->
    <div class="flex gap-1.5 px-3 py-2.5">
      <Skeleton class="h-6 w-16 rounded-md" />
      <Skeleton class="mx-0.5 h-3 w-px" />
      <Skeleton v-for="i in 7" :key="i" class="h-6 w-16 rounded-md" />
    </div>
  </Card>
</template>

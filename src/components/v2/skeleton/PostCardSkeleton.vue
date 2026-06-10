<script setup lang="ts">
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
</script>

<template>
  <Card class="overflow-hidden rounded-xl shadow-none">
    <!-- 封面 -->
    <Skeleton class="aspect-video w-full rounded-t-xl" />
    <!-- 内容 -->
    <div class="space-y-3 p-4">
      <Skeleton class="h-4 w-3/4" />
      <Skeleton class="h-3 w-full" />
      <Skeleton class="h-3 w-2/3" />
      <!-- 标签 -->
      <div class="flex gap-1.5">
        <Skeleton class="h-5 w-14 rounded-md" />
        <Skeleton class="h-5 w-12 rounded-md" />
        <Skeleton class="h-5 w-10 rounded-md" />
      </div>
      <!-- 底部 -->
      <div class="flex items-center justify-between border-t pt-2.5">
        <div class="flex items-center gap-1.5">
          <Skeleton class="h-5 w-5 rounded-full" />
          <Skeleton class="h-3 w-16" />
        </div>
        <div class="flex items-center gap-2">
          <Skeleton class="h-3 w-8" />
          <Skeleton class="h-3 w-8" />
        </div>
      </div>
    </div>
  </Card>
</template>

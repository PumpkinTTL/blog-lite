<script setup lang="ts">
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
</script>

<template>
  <Card class="flex gap-4 overflow-hidden rounded-xl p-3 shadow-none sm:gap-5 sm:p-4">
    <!-- 封面 -->
    <Skeleton class="aspect-[16/10] w-32 shrink-0 rounded-lg sm:w-44 lg:w-48" />
    <!-- 内容 -->
    <div class="flex min-w-0 flex-1 flex-col">
      <Skeleton class="h-4 w-3/4" />
      <Skeleton class="mt-2 hidden h-3 w-full sm:block" />
      <Skeleton class="mt-1 hidden h-3 w-2/3 sm:block" />
      <!-- 标签 -->
      <div class="mt-2 hidden gap-1 sm:flex">
        <Skeleton class="h-5 w-14 rounded-md" />
        <Skeleton class="h-5 w-12 rounded-md" />
      </div>
      <!-- 底部 -->
      <div class="mt-auto flex items-center gap-3 pt-2">
        <Skeleton class="h-5 w-5 rounded-full" />
        <Skeleton class="h-3 w-16" />
        <Skeleton class="h-3 w-12" />
        <Skeleton class="h-3 w-16" />
      </div>
    </div>
  </Card>
</template>

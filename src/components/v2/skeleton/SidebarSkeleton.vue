<script setup lang="ts">
import { Skeleton } from '@/components/ui/skeleton'
import { Card } from '@/components/ui/card'
</script>

<template>
  <aside class="space-y-5">
    <!-- 公告栏 -->
    <Card class="rounded-xl p-4 shadow-none">
      <div class="flex items-start gap-3">
        <Skeleton class="h-8 w-8 shrink-0 rounded-lg" />
        <div class="min-w-0 flex-1">
          <Skeleton class="h-3 w-24" />
          <Skeleton class="mt-1 h-2.5 w-full" />
          <Skeleton class="mt-0.5 h-2.5 w-3/4" />
        </div>
      </div>
    </Card>

    <!-- 社交媒体 -->
    <Card class="rounded-xl p-5 shadow-none">
      <Skeleton class="h-4 w-20" />
      <Skeleton class="mt-1 h-3 w-36" />
      <div class="my-3 h-px bg-border" />
      <div class="flex gap-2">
        <Skeleton v-for="i in 3" :key="i" class="h-9 w-9 rounded-md" />
      </div>
    </Card>

    <!-- 广告位 -->
    <Card class="overflow-hidden rounded-xl shadow-none">
      <Skeleton class="aspect-[2/1] w-full" />
      <div class="space-y-2 p-4">
        <Skeleton class="h-4 w-3/4" />
        <Skeleton class="h-3 w-full" />
        <Skeleton class="h-3 w-2/3" />
        <Skeleton class="mt-2 h-8 w-24 rounded-md" />
      </div>
    </Card>

    <!-- 订阅卡片 -->
    <Card class="rounded-xl p-5 shadow-none">
      <Skeleton class="h-10 w-10 rounded-lg" />
      <Skeleton class="mt-3 h-4 w-28" />
      <Skeleton class="mt-1 h-3 w-full" />
      <Skeleton class="mt-1 h-3 w-3/4" />
      <div class="mt-3 space-y-2">
        <Skeleton class="h-9 w-full rounded-md" />
        <Skeleton class="h-9 w-full rounded-md" />
      </div>
    </Card>
  </aside>
</template>

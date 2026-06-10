<script setup lang="ts">
import { Skeleton } from '@/components/ui/skeleton'
</script>

<template>
  <section class="mx-auto max-w-7xl px-4 pt-10 pb-4 sm:px-6 lg:px-8">
    <!-- 标题 -->
    <div class="mb-6">
      <Skeleton class="h-3 w-16" />
      <Skeleton class="mt-2 h-6 w-32" />
      <Skeleton class="mt-1 h-3 w-56" />
    </div>
    <!-- 4列资源网格 -->
    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div v-for="i in 4" :key="i" class="space-y-3 rounded-xl border p-4">
        <Skeleton class="h-10 w-10 rounded-lg" />
        <Skeleton class="h-4 w-3/4" />
        <Skeleton class="h-3 w-full" />
        <Skeleton class="h-3 w-2/3" />
        <div class="flex items-center justify-between pt-1">
          <Skeleton class="h-5 w-5 rounded-full" />
          <Skeleton class="h-3 w-12" />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Skeleton } from '@/components/ui/skeleton'
import { Card } from '@/components/ui/card'
</script>

<template>
  <div class="mx-auto max-w-6xl px-4 pt-8 pb-6 sm:px-6 sm:pt-10 lg:pt-12 lg:pb-10">
    <div class="grid gap-8 lg:grid-cols-[minmax(0,1fr)_280px]">
      <!-- 主栏 -->
      <div class="min-w-0 space-y-6">
        <!-- Hero -->
        <div class="space-y-4">
          <!-- 封面 -->
          <Skeleton class="aspect-[21/9] w-full rounded-xl" />
          <!-- 分类 + 日期 -->
          <div class="flex items-center gap-2">
            <Skeleton class="h-5 w-14 rounded-md" />
            <Skeleton class="h-3 w-px" />
            <Skeleton class="h-3 w-24" />
            <Skeleton class="h-3 w-px" />
            <Skeleton class="h-3 w-20" />
          </div>
          <!-- 标题 -->
          <Skeleton class="h-8 w-4/5" />
          <Skeleton class="h-8 w-3/5" />
          <!-- 描述 -->
          <Skeleton class="h-4 w-full" />
          <Skeleton class="h-4 w-3/4" />
          <!-- 作者信息 -->
          <div class="flex items-center gap-3">
            <Skeleton class="h-10 w-10 rounded-full" />
            <div>
              <Skeleton class="h-4 w-20" />
              <Skeleton class="mt-1 h-3 w-32" />
            </div>
          </div>
        </div>

        <!-- AI 导读 -->
        <Card class="rounded-xl p-5 shadow-none">
          <Skeleton class="h-4 w-20" />
          <Skeleton class="mt-2 h-3 w-full" />
          <Skeleton class="mt-1 h-3 w-full" />
          <Skeleton class="mt-1 h-3 w-2/3" />
        </Card>

        <!-- 正文占位 -->
        <div class="space-y-4">
          <Skeleton class="h-5 w-2/5" />
          <Skeleton class="h-3 w-full" />
          <Skeleton class="h-3 w-full" />
          <Skeleton class="h-3 w-4/5" />
          <Skeleton class="h-5 w-1/3" />
          <Skeleton class="h-3 w-full" />
          <Skeleton class="h-3 w-full" />
          <Skeleton class="h-3 w-3/4" />
          <Skeleton class="aspect-video w-full rounded-xl" />
          <Skeleton class="h-3 w-full" />
          <Skeleton class="h-3 w-5/6" />
          <Skeleton class="h-5 w-2/5" />
          <Skeleton class="h-3 w-full" />
          <Skeleton class="h-3 w-full" />
          <Skeleton class="h-3 w-3/5" />
        </div>
      </div>

      <!-- 侧栏(桌面) -->
      <aside class="hidden lg:block">
        <div class="sticky top-20 space-y-4">
          <!-- 目录 -->
          <Card class="rounded-xl p-4 shadow-none">
            <Skeleton class="h-4 w-20" />
            <div class="mt-3 space-y-2">
              <Skeleton v-for="i in 5" :key="i" class="h-3" :style="{ width: `${70 + Math.random() * 30}%`, marginLeft: `${i > 2 ? '16px' : '0'}` }" />
            </div>
          </Card>
          <!-- 作者卡 -->
          <Card class="rounded-xl p-4 shadow-none">
            <div class="flex items-center gap-3">
              <Skeleton class="h-12 w-12 rounded-full" />
              <div>
                <Skeleton class="h-4 w-20" />
                <Skeleton class="mt-1 h-3 w-28" />
              </div>
            </div>
            <Skeleton class="mt-3 h-8 w-full rounded-md" />
          </Card>
          <!-- 相关推荐 -->
          <Card class="rounded-xl p-4 shadow-none">
            <Skeleton class="h-4 w-24" />
            <div class="mt-3 space-y-3">
              <div v-for="i in 4" :key="i" class="flex gap-3">
                <Skeleton class="h-12 w-12 shrink-0 rounded-lg" />
                <div class="flex-1">
                  <Skeleton class="h-3 w-full" />
                  <Skeleton class="mt-1 h-2.5 w-16" />
                </div>
              </div>
            </div>
          </Card>
        </div>
      </aside>
    </div>
  </div>
</template>

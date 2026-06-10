<script setup lang="ts">
import { Skeleton } from '@/components/ui/skeleton'
import { Card } from '@/components/ui/card'
</script>

<template>
  <section class="mx-auto max-w-7xl px-4 pt-10 sm:px-6 lg:px-8">
    <!-- 标题 -->
    <div class="mb-5">
      <Skeleton class="h-3 w-16" />
      <Skeleton class="mt-2 h-6 w-28" />
      <Skeleton class="mt-1 h-3 w-48" />
    </div>
    <div class="grid gap-5 lg:grid-cols-5">
      <!-- 主推 -->
      <Card class="overflow-hidden rounded-xl shadow-none lg:col-span-3">
        <div class="grid h-full sm:grid-cols-2">
          <Skeleton class="aspect-[16/10] rounded-t-xl sm:aspect-auto sm:rounded-l-xl sm:rounded-tr-none" />
          <div class="flex flex-col justify-between p-5 sm:p-6">
            <div>
              <Skeleton class="h-3 w-20" />
              <Skeleton class="mt-2 h-5 w-3/4" />
              <Skeleton class="mt-1 h-5 w-1/2" />
              <Skeleton class="mt-3 h-3 w-full" />
              <Skeleton class="mt-1 h-3 w-2/3" />
            </div>
            <div class="mt-4 flex items-center justify-between">
              <div class="flex items-center gap-2">
                <Skeleton class="h-7 w-7 rounded-full" />
                <div>
                  <Skeleton class="h-3 w-16" />
                  <Skeleton class="mt-1 h-2.5 w-12" />
                </div>
              </div>
              <Skeleton class="h-3 w-10" />
            </div>
          </div>
        </div>
      </Card>
      <!-- 副推 -->
      <div class="grid gap-5 lg:col-span-2">
        <Card v-for="i in 2" :key="i" class="overflow-hidden rounded-xl shadow-none">
          <div class="flex h-full gap-3 p-3">
            <Skeleton class="aspect-[4/3] w-32 shrink-0 rounded-lg sm:w-36" />
            <div class="flex flex-1 flex-col justify-between py-0.5">
              <div>
                <Skeleton class="h-4 w-12 rounded-md" />
                <Skeleton class="mt-1.5 h-4 w-full" />
                <Skeleton class="mt-1 h-3 w-4/5" />
              </div>
              <Skeleton class="h-3 w-24" />
            </div>
          </div>
        </Card>
      </div>
    </div>
  </section>
</template>

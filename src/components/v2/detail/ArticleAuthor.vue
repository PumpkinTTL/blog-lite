<script setup lang="ts">
import { UserPlus } from 'lucide-vue-next'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'

defineProps<{
  author: { name: string; avatar: string; role: string }
}>()

function authorInitial(name: string): string {
  return name.slice(0, 1)
}
</script>

<template>
  <Card class="gap-0">
    <CardContent class="px-4 py-4">
      <!-- 头像 + 姓名 + 角色 -->
      <div class="flex items-center gap-3">
        <Avatar class="h-11 w-11">
          <AvatarImage :src="author.avatar" :alt="author.name" />
          <AvatarFallback>{{ authorInitial(author.name) }}</AvatarFallback>
        </Avatar>
        <div class="min-w-0 flex-1">
          <p class="truncate text-sm font-medium">{{ author.name }}</p>
          <p class="truncate text-xs text-muted-foreground">{{ author.role }}</p>
        </div>
      </div>

      <!-- 简介 -->
      <p class="mt-3 text-xs leading-relaxed text-muted-foreground">
        专注前端工程化与体验优化,热爱分享实战中踩过的坑与总结的方法论。
      </p>

      <!-- 关注按钮 -->
      <Button
        variant="outline"
        size="sm"
        class="mt-3 w-full cursor-pointer transition-colors duration-200"
      >
        <UserPlus class="h-3.5 w-3.5" />
        关注作者
      </Button>
    </CardContent>
  </Card>
</template>

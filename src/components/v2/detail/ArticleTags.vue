<script setup lang="ts">
import { Tag } from 'lucide-vue-next'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

defineProps<{
  tags: string[]
}>()
</script>

<template>
  <Card v-if="tags.length" class="gap-0">
    <CardHeader class="px-4 pb-2 pt-4">
      <div class="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
        <Tag class="h-3 w-3" />
        标签
      </div>
    </CardHeader>
    <CardContent class="px-4 pb-4">
      <div class="flex flex-wrap gap-1.5">
        <Badge
          v-for="tag in tags"
          :key="tag"
          variant="outline"
          class="cursor-pointer font-normal transition-colors duration-200 hover:bg-accent"
        >
          {{ tag }}
        </Badge>
      </div>
    </CardContent>
  </Card>
</template>

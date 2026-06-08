<script setup lang="ts">
import { ExternalLink } from 'lucide-vue-next'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface Props {
  /** 广告标题 */
  title?: string
  /** 广告描述 */
  description?: string
  /** 封面/产品图片 URL */
  image?: string
  /** CTA 按钮文字 */
  buttonText?: string
  /** CTA 链接 */
  href?: string
  /** 是否显示"广告"角标 */
  showBadge?: boolean
}

withDefaults(defineProps<Props>(), {
  title: '推广',
  description: '',
  image: '',
  buttonText: '了解详情',
  href: '#',
  showBadge: true,
})
</script>

<template>
  <Card class="group relative overflow-hidden transition-shadow hover:shadow-md">
    <!-- 广告角标 -->
    <Badge
      v-if="showBadge"
      variant="secondary"
      class="absolute right-3 top-3 z-10 text-[10px] font-medium opacity-60"
    >
      广告
    </Badge>

    <CardContent class="p-4">
      <!-- 自定义 slot:完全自定义广告内容 -->
      <slot>
        <!-- 图片 -->
        <div v-if="image" class="mb-3 overflow-hidden rounded-lg">
          <img
            :src="image"
            :alt="title"
            class="aspect-[2/1] w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        </div>

        <!-- 标题 + 描述 -->
        <div class="space-y-1">
          <h4 class="text-sm font-semibold leading-snug">{{ title }}</h4>
          <p v-if="description" class="text-xs leading-relaxed text-muted-foreground">
            {{ description }}
          </p>
        </div>

        <!-- CTA 按钮 -->
        <Button
          v-if="buttonText"
          as="a"
          :href="href"
          target="_blank"
          class="mt-3 h-8 w-full gap-1.5 text-xs"
        >
          {{ buttonText }}
          <ExternalLink class="h-3 w-3" />
        </Button>
      </slot>
    </CardContent>
  </Card>
</template>

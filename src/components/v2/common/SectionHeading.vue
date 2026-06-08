<script setup lang="ts">
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'

withDefaults(defineProps<{
  /** 主标题(必填) */
  title: string
  /** 副标题描述(可选) */
  description?: string
  /** Eyebrow 小标签,Badge 形式显示在标题上方(可选) */
  eyebrow?: string
  /** eyebrow Badge 的样式,默认 outline */
  eyebrowVariant?: 'outline' | 'secondary' | 'default'
  /** 对齐方式 */
  align?: 'left' | 'center'
  /** 标题语义化标签,默认 h2 */
  as?: 'h1' | 'h2' | 'h3'
}>(), {
  eyebrowVariant: 'outline',
  align: 'left',
  as: 'h2',
})
</script>

<template>
  <Card
    class="shadow-none rounded-xl p-5"
    :class="align === 'center' ? 'text-center' : 'text-left'"
  >
    <div class="flex items-center justify-between">
      <div class="flex flex-col gap-1">
        <Badge
          v-if="eyebrow"
          :variant="eyebrowVariant"
          class="w-fit text-[10px] font-medium uppercase tracking-wider"
        >
          {{ eyebrow }}
        </Badge>

        <div class="flex items-baseline gap-3">
          <component
            :is="as"
            class="scroll-m-20 text-lg font-bold tracking-tight sm:text-xl"
          >
            {{ title }}
          </component>

          <p
            v-if="description"
            class="text-xs text-muted-foreground"
          >
            {{ description }}
          </p>
        </div>
      </div>

      <!-- 右侧 action slot -->
      <slot name="actions" />
    </div>
  </Card>
</template>

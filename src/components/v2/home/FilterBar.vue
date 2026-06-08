<script setup lang="ts">
import { computed } from 'vue'
import { Search, X, ArrowDownUp, LayoutGrid, List } from 'lucide-vue-next'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

const props = defineProps<{
  activeCategory: string
  activeTag: string
  activeSort: string
  searchQuery: string
  viewMode: 'grid' | 'list'
  total: number
}>()

const emit = defineEmits<{
  'update:activeCategory': [value: string]
  'update:activeTag': [value: string]
  'update:activeSort': [value: string]
  'update:searchQuery': [value: string]
  'update:viewMode': [value: 'grid' | 'list']
}>()

const categories = [
  { name: '全部', color: '#6B7280' },
  { name: '前端', color: '#3B82F6' },
  { name: '后端', color: '#10B981' },
  { name: '设计', color: '#EC4899' },
  { name: 'AI', color: '#8B5CF6' },
  { name: '工具', color: '#F59E0B' },
]

const sortOptions = [
  { value: 'latest', label: '最新' },
  { value: 'popular', label: '热门' },
]

const tagsMap: Record<string, string[]> = {
  '全部': ['Vue 3', 'React', 'TypeScript', 'Tailwind', 'Node.js', 'Docker', 'Figma'],
  '前端': ['Vue 3', 'React', 'TypeScript', 'Tailwind CSS', 'Vite', 'Pinia'],
  '后端': ['Node.js', 'SpringBoot', 'Go', 'Redis', 'MySQL', 'K8s'],
  '设计': ['Figma', 'UI/UX', 'Sketch', 'Principle'],
  'AI': ['ChatGPT', 'Copilot', 'Midjourney', 'Stable Diffusion'],
  '工具': ['Docker', 'Git', 'VS Code', 'Webpack'],
}

const currentTags = computed(() => tagsMap[props.activeCategory] || tagsMap['全部'])

function onCategoryChange(value: string | number | boolean) {
  if (typeof value === 'string') {
    emit('update:activeCategory', value)
    emit('update:activeTag', '')
  }
}
</script>

<template>
  <div class="sticky top-16 z-20 rounded-xl border bg-card">
    <!-- 顶栏:分类 + 搜索 + 排序 + 数量 -->
    <div class="flex flex-col gap-3 px-3 pt-3 sm:flex-row sm:items-center sm:justify-between">
      <!-- 分类 -->
      <div class="overflow-x-auto">
        <Tabs
          :model-value="activeCategory"
          @update:model-value="onCategoryChange"
        >
          <TabsList>
            <TabsTrigger
              v-for="cat in categories"
              :key="cat.name"
              :value="cat.name"
              class="gap-1.5 px-3"
            >
              <span
                class="h-1.5 w-1.5 rounded-full"
                :style="{ backgroundColor: cat.color }"
              />
              {{ cat.name }}
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <!-- 搜索 + 排序 + 数量 -->
      <div class="flex items-center gap-2">
        <div class="relative w-full sm:w-48">
          <Search class="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            :model-value="searchQuery"
            placeholder="搜索文章..."
            class="h-8 rounded-lg border-muted/50 bg-muted/30 pl-8 pr-8 text-[13px] shadow-none"
            @update:model-value="emit('update:searchQuery', $event)"
          />
          <button
            v-if="searchQuery"
            class="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground/60 transition-colors hover:text-foreground cursor-pointer"
            aria-label="清除"
            @click="emit('update:searchQuery', '')"
          >
            <X class="h-3 w-3" />
          </button>
        </div>
        <ArrowDownUp class="hidden h-3.5 w-3.5 shrink-0 text-muted-foreground sm:block" />
        <div class="hidden items-center gap-0.5 rounded-md bg-muted p-0.5 sm:flex">
          <button
            v-for="opt in sortOptions"
            :key="opt.value"
            class="rounded px-2 py-0.5 text-xs font-medium transition-colors cursor-pointer"
            :class="activeSort === opt.value
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'"
            @click="emit('update:activeSort', opt.value)"
          >
            {{ opt.label }}
          </button>
        </div>
        <!-- 视图切换 -->
        <div class="hidden items-center gap-0.5 rounded-md bg-muted p-0.5 sm:flex">
          <button
            class="flex h-6 w-7 items-center justify-center rounded transition-colors cursor-pointer"
            :class="viewMode === 'grid'
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'"
            aria-label="网格视图"
            @click="emit('update:viewMode', 'grid')"
          >
            <LayoutGrid class="h-3.5 w-3.5" />
          </button>
          <button
            class="flex h-6 w-7 items-center justify-center rounded transition-colors cursor-pointer"
            :class="viewMode === 'list'
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'"
            aria-label="列表视图"
            @click="emit('update:viewMode', 'list')"
          >
            <List class="h-3.5 w-3.5" />
          </button>
        </div>
        <span class="shrink-0 text-xs text-muted-foreground">共 {{ total }} 篇</span>
      </div>
    </div>

    <!-- 移动端排序 + 视图切换 -->
    <div class="flex items-center justify-between gap-2 px-3 pb-2 sm:hidden">
      <div class="flex items-center gap-2">
        <div class="flex items-center gap-0.5 rounded-md bg-muted p-0.5">
          <button
            v-for="opt in sortOptions"
            :key="opt.value"
            class="rounded px-2 py-0.5 text-xs font-medium transition-colors cursor-pointer"
            :class="activeSort === opt.value
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'"
            @click="emit('update:activeSort', opt.value)"
          >
            {{ opt.label }}
          </button>
        </div>
        <div class="flex items-center gap-0.5 rounded-md bg-muted p-0.5">
          <button
            class="flex h-6 w-7 items-center justify-center rounded transition-colors cursor-pointer"
            :class="viewMode === 'grid'
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'"
            aria-label="网格视图"
            @click="emit('update:viewMode', 'grid')"
          >
            <LayoutGrid class="h-3.5 w-3.5" />
          </button>
          <button
            class="flex h-6 w-7 items-center justify-center rounded transition-colors cursor-pointer"
            :class="viewMode === 'list'
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'"
            aria-label="列表视图"
            @click="emit('update:viewMode', 'list')"
          >
            <List class="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
      <span class="text-xs text-muted-foreground">共 {{ total }} 篇</span>
    </div>

    <!-- 分隔线 -->
    <div class="border-t" />

    <!-- 标签 -->
    <div class="flex items-center gap-1.5 overflow-x-auto px-3 py-2.5">
      <Badge
        class="shrink-0 cursor-pointer rounded-md text-xs transition-colors"
        :variant="activeTag === '' ? 'default' : 'outline'"
        @click="emit('update:activeTag', '')"
      >
        全部标签
      </Badge>
      <span class="mx-0.5 h-3 w-px shrink-0 bg-border" />
      <Badge
        v-for="tag in currentTags"
        :key="tag"
        class="shrink-0 cursor-pointer rounded-md text-xs transition-colors"
        :variant="activeTag === tag ? 'default' : 'outline'"
        @click="emit('update:activeTag', activeTag === tag ? '' : tag)"
      >
        {{ tag }}
      </Badge>
    </div>
  </div>
</template>

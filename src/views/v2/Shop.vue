<script setup lang="ts">
import { ref, computed } from 'vue'
import { ShoppingBag, Star, Sparkles, Book, Wrench, Gift } from 'lucide-vue-next'
import Layout from '@/components/v2/layout/Layout.vue'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import SectionHeading from '@/components/v2/common/SectionHeading.vue'

interface Product {
  id: number
  name: string
  price: string
  description: string
  category: string
  rating: number
  sold: number
  badge?: 'hot' | 'new' | 'sale'
}

const products: Product[] = [
  { id: 1, name: 'Vue 3 实战指南', price: '¥59', description: '从零到一掌握 Vue 3 组合式 API 与生态工具链。', category: '书籍', rating: 4.8, sold: 234, badge: 'hot' },
  { id: 2, name: 'TypeScript 进阶教程', price: '¥49', description: '深入类型系统,掌握工程化 TypeScript 开发实践。', category: '书籍', rating: 4.7, sold: 189 },
  { id: 3, name: 'Tailwind CSS 设计手册', price: '¥39', description: '系统学习实用优先的 CSS 框架,构建现代界面。', category: '书籍', rating: 4.6, sold: 156, badge: 'sale' },
  { id: 4, name: '开发者机械键盘贴纸', price: '¥19', description: '精选编程语言与框架图标贴纸,装点你的工作台。', category: '周边', rating: 4.5, sold: 412 },
  { id: 5, name: '前端架构设计笔记', price: '¥69', description: '大型前端项目的架构设计思路与最佳实践总结。', category: '书籍', rating: 4.9, sold: 98, badge: 'new' },
  { id: 6, name: 'Code Review 检查清单', price: '¥9', description: '一份实用的 Code Review 指南,提升团队代码质量。', category: '工具', rating: 4.4, sold: 567 },
  { id: 7, name: 'Git 工作流模板', price: '¥0', description: '团队级 Git 工作流模板,含分支策略与 PR 模板。', category: '工具', rating: 4.6, sold: 891, badge: 'sale' },
  { id: 8, name: '程序员帆布袋', price: '¥49', description: '简约设计的程序员帆布袋,容量大,适合通勤。', category: '周边', rating: 4.3, sold: 145 },
]

const categoryIcons: Record<string, any> = {
  '全部': ShoppingBag,
  '书籍': Book,
  '工具': Wrench,
  '周边': Gift,
}

const categories = ['全部', '书籍', '工具', '周边']
const activeCategory = ref('全部')

const filteredProducts = computed(() => {
  if (activeCategory.value === '全部') return products
  return products.filter(p => p.category === activeCategory.value)
})

const badgeStyles: Record<string, string> = {
  hot: 'bg-red-500/95 text-white',
  new: 'bg-emerald-500/95 text-white',
  sale: 'bg-amber-500/95 text-white',
}

const badgeLabels: Record<string, string> = {
  hot: '热门',
  new: '新品',
  sale: '特价',
}
</script>

<template>
  <Layout>
    <!-- 标题区 -->
    <section class="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="精选商城"
        title="为开发者准备的优质资源"
        description="精选技术书籍、效率工具与周边商品,每一件都经过团队亲测推荐。"
      />
    </section>

    <!-- 促销 banner -->
    <section class="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
      <div class="flex items-center gap-3 rounded-xl border bg-gradient-to-r from-amber-50 to-orange-50 p-4 dark:from-amber-950/20 dark:to-orange-950/20">
        <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-500/15">
          <Sparkles class="h-5 w-5 text-amber-600 dark:text-amber-400" />
        </div>
        <div class="flex-1">
          <div class="text-sm font-semibold">限时优惠</div>
          <div class="mt-0.5 text-xs text-muted-foreground">
            全场书籍满 100 减 20,周边满 2 件 9 折 — 活动持续到本月底
          </div>
        </div>
        <Button variant="outline" size="sm" class="shrink-0 cursor-pointer hidden sm:inline-flex">
          查看详情
        </Button>
      </div>
    </section>

    <!-- 分类筛选 -->
    <section class="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
      <div class="flex items-center gap-2 overflow-x-auto">
        <button
          v-for="cat in categories"
          :key="cat"
          class="inline-flex shrink-0 items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium transition-all cursor-pointer"
          :class="activeCategory === cat
            ? 'border-primary bg-primary text-primary-foreground'
            : 'bg-card text-muted-foreground hover:bg-accent hover:text-accent-foreground'"
          @click="activeCategory = cat"
        >
          <component :is="categoryIcons[cat]" class="h-3.5 w-3.5" />
          {{ cat }}
          <Badge
            v-if="cat !== '全部'"
            variant="outline"
            class="ml-1 px-1 py-0 text-[10px]"
            :class="activeCategory === cat ? 'border-primary-foreground/40 text-primary-foreground' : ''"
          >
            {{ products.filter(p => p.category === cat).length }}
          </Badge>
        </button>
      </div>
    </section>

    <!-- 商品网格 -->
    <section class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <Card
          v-for="product in filteredProducts"
          :key="product.id"
          class="group flex flex-col transition-all hover:-translate-y-0.5 hover:shadow-md"
        >
          <!-- 顶部图标 + badge -->
          <div class="relative flex h-32 items-center justify-center bg-muted/30">
            <div class="flex h-14 w-14 items-center justify-center rounded-xl border bg-background shadow-sm transition-transform group-hover:scale-105">
              <component :is="categoryIcons[product.category]" class="h-6 w-6 text-muted-foreground" />
            </div>
            <Badge
              v-if="product.badge"
              class="absolute left-3 top-3 border-none text-[10px] font-semibold"
              :class="badgeStyles[product.badge]"
            >
              {{ badgeLabels[product.badge] }}
            </Badge>
          </div>

          <CardHeader class="pb-2">
            <CardTitle class="text-base">{{ product.name }}</CardTitle>
            <CardDescription class="line-clamp-2">{{ product.description }}</CardDescription>
          </CardHeader>

          <CardContent class="flex-1 pb-2">
            <!-- 评分 -->
            <div class="flex items-center gap-2 text-xs">
              <div class="inline-flex items-center gap-0.5 text-amber-500">
                <Star class="h-3 w-3 fill-current" />
                <span class="font-medium">{{ product.rating }}</span>
              </div>
              <span class="text-muted-foreground/60">·</span>
              <span class="text-muted-foreground">已售 {{ product.sold }}</span>
            </div>
          </CardContent>

          <CardFooter class="flex items-center justify-between pt-0">
            <span class="text-lg font-bold tracking-tight">{{ product.price }}</span>
            <Button size="sm" class="cursor-pointer">
              立即购买
            </Button>
          </CardFooter>
        </Card>
      </div>

      <!-- 空状态 -->
      <div v-if="filteredProducts.length === 0" class="flex flex-col items-center justify-center rounded-xl border border-dashed py-16">
        <ShoppingBag class="h-10 w-10 text-muted-foreground/40" />
        <p class="mt-3 text-sm text-muted-foreground">该分类下暂无商品</p>
      </div>
    </section>

    <!-- 底部说明 -->
    <section class="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
      <Separator class="mb-6" />
      <div class="grid gap-4 text-center sm:grid-cols-3">
        <div>
          <div class="text-sm font-semibold">极速发货</div>
          <div class="mt-0.5 text-xs text-muted-foreground">24 小时内发货,顺丰包邮</div>
        </div>
        <div>
          <div class="text-sm font-semibold">7 天退换</div>
          <div class="mt-0.5 text-xs text-muted-foreground">不满意?7 天内无理由退换</div>
        </div>
        <div>
          <div class="text-sm font-semibold">正版保证</div>
          <div class="mt-0.5 text-xs text-muted-foreground">所有商品 100% 正版授权</div>
        </div>
      </div>
    </section>
  </Layout>
</template>

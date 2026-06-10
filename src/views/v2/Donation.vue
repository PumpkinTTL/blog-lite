<script setup lang="ts">
import { ref } from 'vue'
import { Heart, Check } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Separator } from '@/components/ui/separator'
import SectionHeading from '@/components/v2/common/SectionHeading.vue'

const tiers = [
  {
    name: '一杯咖啡',
    amount: 10,
    description: '买一杯咖啡,支持作者继续创作。',
    benefits: ['文章署名感谢', '优先阅读新文章', '专属读者徽章'],
    popular: false,
  },
  {
    name: '一顿午餐',
    amount: 30,
    description: '赞助一顿午餐,获得更多专属权益。',
    benefits: ['一杯咖啡 全部权益', '加入读者社群', '每月直播答疑', '文章 PDF 合集'],
    popular: true,
  },
  {
    name: '长期支持',
    amount: 100,
    description: '成为长期支持者,享受全部赞助权益。',
    benefits: ['一顿午餐 全部权益', '一对一技术咨询(每月 1 次)', '产品决策投票权', '限定周边赠品'],
    popular: false,
  },
]

// 模拟赞助者
const supporters = [
  { name: '正义的土豆', avatar: 'https://i.pravatar.cc/100?img=1' },
  { name: '腼腆的西瓜', avatar: 'https://i.pravatar.cc/100?img=68' },
  { name: '熬夜的考拉', avatar: 'https://i.pravatar.cc/100?img=12' },
  { name: '微醺的布丁', avatar: 'https://i.pravatar.cc/100?img=11' },
  { name: '流浪的摩卡', avatar: 'https://i.pravatar.cc/100?img=5' },
  { name: '追风的饭团', avatar: 'https://i.pravatar.cc/100?img=9' },
  { name: '快乐的水蜜桃', avatar: 'https://i.pravatar.cc/100?img=20' },
  { name: '机智的茄子', avatar: 'https://i.pravatar.cc/100?img=33' },
  { name: '温柔的蓝莓', avatar: 'https://i.pravatar.cc/100?img=44' },
  { name: '神秘的小猫', avatar: 'https://i.pravatar.cc/100?img=56' },
]

const stats = {
  totalRaised: '¥12,348',
  supporterCount: 286,
  articleCount: 128,
}

const faqs = [
  {
    q: '赞助后多久能看到权益生效?',
    a: '一次性赞助会在 24 小时内生效。订阅制赞助会在付款成功后立即开通所有对应权益。',
  },
  {
    q: '可以取消赞助吗?',
    a: '订阅制赞助可以随时在个人中心取消,取消后权益会保留到当前周期结束。一次性赞助不可取消。',
  },
  {
    q: '一对一技术咨询怎么预约?',
    a: '长期赞助者可以在专属群内预约时间,支持文字与语音咨询,每次时长约 30 分钟。',
  },
  {
    q: '赞助资金流向哪里?',
    a: '所有赞助资金用于内容创作、服务器成本与作者补贴。我们每季度公开财务报告,欢迎监督。',
  },
]

const accordionValue = ref<string[]>([])
</script>

<template>
  <div>
    <!-- 标题区 -->
    <section v-animate class="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8 animate__animated animate__fadeInUp">
      <Card class="shadow-none rounded-xl p-5">
        <div class="flex flex-col gap-1">
          <Badge variant="outline" class="w-fit text-[10px] font-medium uppercase tracking-wider v2-child-left v2-cd-1">
            <Heart class="mr-1 h-3 w-3 text-rose-500" />
            赞助支持
          </Badge>
          <div class="flex items-baseline gap-3">
            <h2 class="scroll-m-20 text-lg font-bold tracking-tight sm:text-xl v2-child-up v2-cd-2">
              你的支持，是<span class="bg-gradient-to-r from-rose-500 to-orange-500 bg-clip-text text-transparent">持续创作</span>的动力
            </h2>
            <p class="text-xs text-muted-foreground v2-child-fade v2-cd-3">
              如果 Blog Lite 的内容对你有帮助，欢迎请作者喝杯咖啡。
            </p>
          </div>
        </div>
      </Card>
    </section>

    <!-- 总数据 -->
    <section v-animate class="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8 animate__animated animate__fadeInUp" style="animation-delay: 0.1s">
      <div class="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
        <div class="text-center">
          <div class="text-2xl font-bold tracking-tight">{{ stats.totalRaised }}</div>
          <div class="text-xs text-muted-foreground">累计赞助</div>
        </div>
        <div class="h-8 w-px bg-border" />
        <div class="text-center">
          <div class="text-2xl font-bold tracking-tight">{{ stats.supporterCount }}</div>
          <div class="text-xs text-muted-foreground">赞助人数</div>
        </div>
        <div class="h-8 w-px bg-border" />
        <div class="text-center">
          <div class="text-2xl font-bold tracking-tight">{{ stats.articleCount }}</div>
          <div class="text-xs text-muted-foreground">产出文章</div>
        </div>
      </div>
    </section>

    <!-- 套餐 -->
    <section v-animate class="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 animate__animated animate__fadeInUp" style="animation-delay: 0.2s">
      <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <Card
          v-for="tier in tiers"
          :key="tier.name"
          class="relative flex flex-col transition-all"
          :class="tier.popular ? 'border-primary shadow-md ring-1 ring-primary/30 lg:scale-[1.02]' : 'hover:border-primary/30 hover:shadow-md'"
        >
          <Badge
            v-if="tier.popular"
            class="absolute -top-2 left-1/2 -translate-x-1/2 border-none bg-primary text-primary-foreground shadow-sm"
          >
            <Heart class="mr-1 h-3 w-3 fill-current" />
            最受欢迎
          </Badge>

          <CardHeader class="pb-3">
            <CardTitle class="text-base v2-child-up v2-cd-1">{{ tier.name }}</CardTitle>
            <CardDescription class="v2-child-up v2-cd-2">{{ tier.description }}</CardDescription>
          </CardHeader>

          <CardContent class="flex-1 pb-3">
            <div class="mb-4 flex items-baseline gap-1 v2-child-scale v2-cd-3">
              <span class="text-3xl font-bold tracking-tight">¥{{ tier.amount }}</span>
              <span class="text-sm text-muted-foreground">/ 次</span>
            </div>

            <ul class="space-y-2 v2-child-up v2-cd-4">
              <li
                v-for="benefit in tier.benefits"
                :key="benefit"
                class="flex items-start gap-2 text-sm"
              >
                <Check
                  class="mt-0.5 h-3.5 w-3.5 shrink-0"
                  :class="tier.popular ? 'text-primary' : 'text-muted-foreground'"
                />
                <span class="text-muted-foreground">{{ benefit }}</span>
              </li>
            </ul>
          </CardContent>

          <CardFooter class="v2-child-up v2-cd-5">
            <Button
              class="w-full cursor-pointer"
              :variant="tier.popular ? 'default' : 'outline'"
            >
              <Heart class="mr-1 h-3.5 w-3.5" />
              赞助 ¥{{ tier.amount }}
            </Button>
          </CardFooter>
        </Card>
      </div>

      <p class="mt-6 text-center text-xs text-muted-foreground">
        所有赞助资金用于平台运营与内容创作 ·
        <a href="#faq" class="underline-offset-2 hover:underline">了解资金流向</a>
      </p>
    </section>

    <!-- 赞助者墙 -->
    <section v-animate class="mx-auto max-w-6xl px-4 pb-12 sm:px-6 lg:px-8 animate__animated animate__fadeInUp" style="animation-delay: 0.3s">
      <Separator class="mb-10" />

      <SectionHeading
        eyebrow="Supporters"
        title="感谢赞助者"
        description="名单按最新赞助时间排序,显示最近 30 天"
      />

      <div class="mt-5 flex flex-wrap items-center gap-2">
        <div
          v-for="supporter in supporters"
          :key="supporter.name"
          class="group relative inline-flex items-center gap-2 rounded-full border bg-card px-2 py-1 pr-3 transition-all hover:border-primary/30 hover:shadow-sm cursor-pointer"
        >
          <img
            :src="supporter.avatar"
            :alt="supporter.name"
            class="h-6 w-6 rounded-full object-cover"
            loading="lazy"
          />
          <span class="text-xs font-medium">{{ supporter.name }}</span>
        </div>
        <div class="inline-flex items-center gap-1 rounded-full border border-dashed bg-muted/30 px-3 py-1.5 text-xs text-muted-foreground">
          + {{ stats.supporterCount - supporters.length }} 位
        </div>
      </div>
    </section>

    <!-- FAQ -->
    <section v-animate id="faq" class="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8 animate__animated animate__fadeInUp" style="animation-delay: 0.4s">
      <Separator class="mb-10" />
      <SectionHeading
          eyebrow="FAQ"
          title="常见问题"
          description="关于赞助,你想知道的都在这里"
        />

      <Accordion
        v-model="accordionValue"
        type="multiple"
        class="mt-6 space-y-2"
      >
        <AccordionItem
          v-for="(item, idx) in faqs"
          :key="idx"
          :value="`item-${idx}`"
          class="rounded-lg border px-4"
        >
          <AccordionTrigger class="text-sm font-semibold hover:no-underline">
            {{ item.q }}
          </AccordionTrigger>
          <AccordionContent class="text-sm text-muted-foreground leading-relaxed">
            {{ item.a }}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </section>
  </div>
</template>

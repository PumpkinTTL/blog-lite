<script setup lang="ts">
import { Users, FileText, Eye, Mail, Github, MessageCircle, Star } from 'lucide-vue-next'
import Layout from '@/components/v2/layout/Layout.vue'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import SectionHeading from '@/components/v2/common/SectionHeading.vue'

const stats = [
  { label: '原创文章', value: '128', icon: FileText },
  { label: '累计阅读', value: '54.2k', icon: Eye },
  { label: '活跃作者', value: '12', icon: Users },
  { label: 'GitHub Stars', value: '1.8k', icon: Star },
]

const techStack = [
  { name: 'Vue 3', category: '前端框架', color: '#42b883' },
  { name: 'TypeScript', category: '语言', color: '#3178c6' },
  { name: 'Vite', category: '构建工具', color: '#646cff' },
  { name: 'Pinia', category: '状态管理', color: '#ffd859' },
  { name: 'Tailwind CSS', category: '样式', color: '#06b6d4' },
  { name: 'shadcn-vue', category: '组件库', color: '#000000' },
  { name: 'Vue Router', category: '路由', color: '#42b883' },
  { name: 'Lucide Icons', category: '图标', color: '#f59e0b' },
  { name: 'Axios', category: 'HTTP', color: '#5a29e4' },
  { name: 'Node.js', category: '运行时', color: '#3c873a' },
]

const milestones = [
  {
    date: '2024.03',
    title: '项目启动',
    description: '基于 Vue 3 + TypeScript 搭建博客平台雏形,确定 shadcn 设计方向。',
  },
  {
    date: '2024.06',
    title: 'V1 上线',
    description: '完成第一版 UI,使用 Element Plus,实现文章浏览、商城、赞助等核心功能。',
  },
  {
    date: '2024.09',
    title: '内容扩充',
    description: '累计 50+ 篇原创文章,引入分类与标签体系,完善搜索体验。',
  },
  {
    date: '2025.01',
    title: 'V2 重构',
    description: '迁移至 shadcn-vue + Tailwind CSS,采用更简洁现代的设计语言。',
  },
  {
    date: '2025.06',
    title: '开放订阅',
    description: '推出每周精选邮件订阅,持续优化阅读体验与作者工具链。',
  },
]
</script>

<template>
  <Layout>
    <!-- Hero -->
    <section class="relative overflow-hidden border-b">
      <div class="pointer-events-none absolute inset-0 -z-10">
        <div class="absolute left-1/2 top-1/2 h-72 w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-3xl" />
      </div>
      <div class="mx-auto max-w-4xl px-4 py-14 text-center sm:px-6 sm:py-20">
        <span class="inline-flex items-center rounded-full border bg-background/60 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
          关于我们
        </span>
        <h1 class="mt-5 text-4xl font-bold tracking-tight sm:text-5xl">
          一个为开发者而生的
          <span class="bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
            内容社区
          </span>
        </h1>
        <p class="mx-auto mt-5 max-w-2xl text-base text-muted-foreground sm:text-lg">
          我们相信,优质的的技术内容应该简洁、清晰、易于传播。
          Blog Lite 致力于打造一个让创作者专注写作、让读者高效学习的平台。
        </p>
      </div>
    </section>

    <!-- 数据条 -->
    <section class="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <div class="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Card v-for="stat in stats" :key="stat.label" class="text-center">
          <CardContent class="flex flex-col items-center justify-center py-6">
            <stat.icon class="mb-2 h-5 w-5 text-muted-foreground" />
            <div class="text-2xl font-bold tracking-tight">{{ stat.value }}</div>
            <div class="mt-0.5 text-xs text-muted-foreground">{{ stat.label }}</div>
          </CardContent>
        </Card>
      </div>
    </section>

    <!-- 我们的故事 -->
    <section class="mx-auto max-w-4xl px-4 pb-12 sm:px-6">
      <div class="grid gap-6 sm:grid-cols-[1fr_2fr]">
        <div>
          <SectionHeading
            title="我们的故事"
            description="从 2024 春天起步"
          />
        </div>
        <div class="space-y-3 text-sm text-muted-foreground leading-relaxed">
          <p>
            Blog Lite 起初只是一个个人技术博客,用于记录 Vue、TypeScript 相关的学习笔记。
            随着内容积累与读者反馈,我们意识到现有的博客平台要么过于臃肿,要么设计陈旧。
          </p>
          <p>
            于是我们决定自己动手:基于 Vue 3 + shadcn-vue,构建一个轻量、简洁、专注于内容的博客平台。
            2024 年 6 月 V1 上线后,收到了大量正向反馈,2025 年初完成了 V2 设计重构。
          </p>
          <p>
            今天,Blog Lite 已经是一个拥有 12 位活跃作者、累计 5 万读者的内容社区,
            我们仍在持续打磨产品体验。
          </p>
        </div>
      </div>
    </section>

    <!-- 技术栈 -->
    <section class="mx-auto max-w-5xl px-4 pb-12 sm:px-6">
      <SectionHeading
        eyebrow="Stack"
        title="技术栈"
        description="现代化前端工程,围绕 Vue 生态构建"
      />

      <div class="mt-5 flex flex-wrap gap-2">
        <div
          v-for="tech in techStack"
          :key="tech.name"
          class="group inline-flex items-center gap-2 rounded-lg border bg-card px-3 py-1.5 transition-all hover:border-primary/30 hover:shadow-sm cursor-pointer"
        >
          <span class="h-2 w-2 rounded-full" :style="{ backgroundColor: tech.color }" />
          <span class="text-sm font-medium">{{ tech.name }}</span>
          <span class="text-xs text-muted-foreground">{{ tech.category }}</span>
        </div>
      </div>
    </section>

    <!-- 时间线 -->
    <section id="changelog" class="mx-auto max-w-4xl px-4 pb-12 sm:px-6">
      <SectionHeading
        eyebrow="Timeline"
        title="里程碑"
        description="一路走来,持续迭代"
      />

      <div class="relative mt-6 pl-6 sm:pl-8">
        <!-- 竖线 -->
        <div class="absolute left-2 top-2 bottom-2 w-px bg-border sm:left-3" />

        <ul class="space-y-6">
          <li v-for="(item, idx) in milestones" :key="idx" class="relative">
            <span class="absolute -left-[1.4rem] top-1.5 flex h-3 w-3 items-center justify-center rounded-full border-2 border-background bg-primary sm:-left-[1.6rem]" />
            <div class="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-3">
              <span class="shrink-0 text-xs font-semibold text-primary sm:w-20">{{ item.date }}</span>
              <div>
                <h3 class="font-semibold">{{ item.title }}</h3>
                <p class="mt-0.5 text-sm text-muted-foreground leading-relaxed">{{ item.description }}</p>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </section>

    <!-- 联系我们 -->
    <section id="contact" class="mx-auto max-w-4xl px-4 pb-16 sm:px-6">
      <Separator class="mb-10" />
      <div class="text-center">
        <SectionHeading
          align="center"
          eyebrow="Contact"
          title="联系我们"
          description="有问题、建议或合作意向?欢迎随时联系"
        />
      </div>

      <div class="mt-6 grid gap-3 sm:grid-cols-3">
        <Card class="group cursor-pointer transition-all hover:border-primary/30 hover:shadow-md">
          <CardContent class="flex flex-col items-center gap-2 py-6 text-center">
            <Mail class="h-5 w-5 text-muted-foreground transition-colors group-hover:text-primary" />
            <div class="text-sm font-semibold">邮箱</div>
            <div class="text-xs text-muted-foreground">contact@bloglite.dev</div>
          </CardContent>
        </Card>
        <Card class="group cursor-pointer transition-all hover:border-primary/30 hover:shadow-md">
          <CardContent class="flex flex-col items-center gap-2 py-6 text-center">
            <Github class="h-5 w-5 text-muted-foreground transition-colors group-hover:text-primary" />
            <div class="text-sm font-semibold">GitHub</div>
            <div class="text-xs text-muted-foreground">提交 Issue 或 PR</div>
          </CardContent>
        </Card>
        <Card class="group cursor-pointer transition-all hover:border-primary/30 hover:shadow-md">
          <CardContent class="flex flex-col items-center gap-2 py-6 text-center">
            <MessageCircle class="h-5 w-5 text-muted-foreground transition-colors group-hover:text-primary" />
            <div class="text-sm font-semibold">读者群</div>
            <div class="text-xs text-muted-foreground">加入技术交流群</div>
          </CardContent>
        </Card>
      </div>
    </section>
  </Layout>
</template>

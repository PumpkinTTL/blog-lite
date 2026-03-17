// Mock Data for Blog Lite

export interface Resource {
  id: string
  title: string
  description: string
  image: string
  category: string
  categoryColor: string
  tags: string[]
  author: {
    name: string
    avatar: string
    role?: 'super_admin' | 'admin' | 'system' | 'vip' | 'user'
  }
  likes: number
  views: number
  featured: boolean
  createdAt: string
}

const categories = [
  { name: '前端', color: '#3B82F6' },
  { name: '后端', color: '#10B981' },
  { name: '设计', color: '#EC4899' },
  { name: 'AI', color: '#8B5CF6' },
  { name: '工具', color: '#F59E0B' }
]

const tags = [
  'Vue 3', 'React', 'TypeScript', 'Tailwind CSS', 'Node.js',
  'Python', 'Figma', 'UI/UX', 'ChatGPT', 'Docker',
  'GraphQL', 'Next.js', 'Nuxt', 'Vite', 'Webpack'
]

const authors: Resource['author'][] = [
  { name: 'Kylin_Dev', avatar: 'https://i.pravatar.cc/150?img=1', role: 'super_admin' },
  { name: 'Pixel_Artisan', avatar: 'https://i.pravatar.cc/150?img=68', role: 'admin' },
  { name: 'System_Core', avatar: 'https://i.pravatar.cc/150?img=12', role: 'system' },
  { name: 'Frost_Byte', avatar: 'https://i.pravatar.cc/150?img=11', role: 'vip' },
  { name: 'Cloud_Walker', avatar: 'https://i.pravatar.cc/150?img=5', role: 'user' },
  { name: 'Nova_Coder', avatar: 'https://i.pravatar.cc/150?img=9', role: 'vip' }
]

const titles = [
  'Vue 3 组合式 API 完全指南',
  'TypeScript 类型体操实战技巧',
  'Tailwind CSS 最佳实践分享',
  '现代化前端工程化配置方案',
  'React Hooks 深度解析',
  'Node.js 性能优化实战',
  'Figma 设计系统搭建指南',
  'ChatGPT 提示词工程技巧',
  'Docker 容器化部署实践',
  'GraphQL API 设计最佳实践',
  'Next.js 13 App Router 详解',
  'Vite 插件开发入门教程',
  '微前端架构设计与实现',
  'Web 性能优化完全指南',
  'CSS Grid 布局实战案例'
]

const descriptions = [
  '深入浅出讲解核心概念，配合实战案例帮助你快速掌握',
  '从基础到进阶，系统性学习路径，适合各个阶段的开发者',
  '总结了多年实战经验，分享最佳实践和常见陷阱',
  '详细的代码示例和注释，让你轻松理解每个知识点',
  '结合真实项目场景，提供可落地的解决方案',
  '涵盖最新技术栈，紧跟行业发展趋势',
  '图文并茂的教程，配合视频演示更易理解',
  '社区精选内容，经过验证的高质量资源'
]

const images = [
  'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1522542550221-31fd19575a2d?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&h=600&fit=crop'
]

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function randomItems<T>(arr: T[], count: number): T[] {
  const shuffled = [...arr].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count)
}

function randomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function generateMockResources(count: number): Resource[] {
  return Array.from({ length: count }, (_, index) => {
    const category = randomItem(categories)
    return {
      id: `resource-${index + 1}`,
      title: randomItem(titles),
      description: randomItem(descriptions),
      image: randomItem(images),
      category: category.name,
      categoryColor: category.color,
      tags: randomItems(tags, randomNumber(2, 4)),
      author: randomItem(authors) as Resource['author'],
      likes: randomNumber(10, 999),
      views: randomNumber(100, 9999),
      featured: Math.random() > 0.8,
      createdAt: new Date(Date.now() - randomNumber(0, 30) * 24 * 60 * 60 * 1000).toISOString()
    }
  })
}

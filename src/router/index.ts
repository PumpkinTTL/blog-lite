import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { nextTick } from 'vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/v1/Home.vue'),
    meta: {
      title: '首页'
    }
  },
  {
    path: '/article/:id',
    name: 'ArticleDetail',
    component: () => import('@/views/v1/ArticleDetail.vue'),
    meta: {
      title: '文章详情'
    }
  },
  {
    path: '/shop',
    name: 'Shop',
    component: () => import('@/views/v1/Shop.vue'),
    meta: {
      title: '资源商城'
    }
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('@/views/v1/About.vue'),
    meta: {
      title: '关于我们'
    }
  },
  {
    path: '/donation',
    name: 'Donation',
    component: () => import('@/views/v1/Donation.vue'),
    meta: {
      title: '赞助与捐赠'
    }
  },

  // ── v2 路由 ──
  {
    path: '/v2',
    name: 'V2Home',
    component: () => import('@/views/v2/Home.vue'),
    meta: { title: '首页', version: 'v2' }
  },
  {
    path: '/v2/article/:id',
    name: 'V2ArticleDetail',
    component: () => import('@/views/v2/ArticleDetail.vue'),
    meta: { title: '文章详情', version: 'v2' }
  },
  {
    path: '/v2/about',
    name: 'V2About',
    component: () => import('@/views/v2/About.vue'),
    meta: { title: '关于', version: 'v2' }
  },
  {
    path: '/v2/shop',
    name: 'V2Shop',
    component: () => import('@/views/v2/Shop.vue'),
    meta: { title: '商城', version: 'v2' }
  },
  {
    path: '/v2/donation',
    name: 'V2Donation',
    component: () => import('@/views/v2/Donation.vue'),
    meta: { title: '赞助', version: 'v2' }
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, _from, savedPosition) {
    if (to.hash) {
      return new Promise((resolve) => {
        nextTick(() => {
          const element = document.getElementById(to.hash.slice(1))
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' })
          }
          resolve({ el: to.hash, behavior: 'smooth' })
        })
      })
    }
    if (savedPosition) {
      return savedPosition
    }
    return { top: 0 }
  }
})

// 路由守卫
router.beforeEach((to, _from, next) => {
  // 设置页面标题
  if (to.meta?.title) {
    document.title = `${to.meta.title} - Vue Template`
  }
  next()
})

export default router

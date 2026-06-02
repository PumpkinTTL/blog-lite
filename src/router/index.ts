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
  }
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

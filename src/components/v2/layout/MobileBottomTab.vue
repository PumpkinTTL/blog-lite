<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { Home, Heart, Info, ShoppingBag } from 'lucide-vue-next'

const route = useRoute()

const tabs = [
  { path: '/v2', label: '首页', icon: Home, exact: true },
  { path: '/v2/shop', label: '商城', icon: ShoppingBag },
  { path: '/v2/donation', label: '捐赠', icon: Heart },
  { path: '/v2/about', label: '关于', icon: Info },
]

function isActive(tab: { path: string; exact?: boolean }) {
  if (tab.exact) return route.path === tab.path
  return route.path.startsWith(tab.path)
}

const activeIndex = computed(() => tabs.findIndex(t => isActive(t)))

// slider 定位
const navRef = ref<HTMLElement>()
const itemRefs = ref<HTMLElement[]>([])
const sliderStyle = ref({ transform: 'translateX(0)', width: '0' })

function updateSlider() {
  nextTick(() => {
    const idx = activeIndex.value
    if (idx < 0 || !itemRefs.value[idx]) return
    const el = itemRefs.value[idx]
    sliderStyle.value = {
      transform: `translateX(${el.offsetLeft}px)`,
      width: `${el.offsetWidth}px`,
    }
  })
}

watch(activeIndex, updateSlider)

const isMobile = ref(false)
function checkMobile() {
  isMobile.value = window.innerWidth <= 768
  if (isMobile.value) nextTick(updateSlider)
}

onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
})
</script>

<template>
  <nav v-if="isMobile" class="fixed inset-x-0 bottom-0 z-40 flex justify-center pb-[env(safe-area-inset-bottom)] px-5 mb-3">
    <div
      ref="navRef"
      class="relative flex items-center gap-1 rounded-full bg-muted/80 backdrop-blur-lg border border-border/40 px-1.5 py-1.5 shadow-lg"
    >
      <!-- 滑动胶囊 -->
      <div
        class="absolute top-1.5 bottom-1.5 left-0 rounded-full bg-foreground dark:bg-muted-foreground/25 transition-all duration-500 ease-[cubic-bezier(0.2,1,0.3,1)]"
        :style="sliderStyle"
      />

      <router-link
        v-for="(tab, idx) in tabs"
        :key="tab.path"
        :to="tab.path"
        :ref="(el: any) => { if (el?.$el) itemRefs[idx] = el.$el }"
        class="relative z-10 flex items-center justify-center gap-1.5 rounded-full px-4 py-2 text-xs font-medium transition-colors duration-300"
        :class="isActive(tab)
          ? 'text-background/85 dark:text-foreground'
          : 'text-muted-foreground hover:text-foreground'"
      >
        <component
          :is="tab.icon"
          class="h-4 w-4 transition-transform duration-300"
          :class="isActive(tab) ? 'scale-110' : 'scale-100'"
          :stroke-width="isActive(tab) ? 2.2 : 1.5"
        />
        <span class="whitespace-nowrap">{{ tab.label }}</span>
      </router-link>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import { ArrowUp } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'

const scrollTop = ref(0)
const SHOW_AT = 320

function onScroll() {
  scrollTop.value = window.scrollY
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
})

const visible = computed(() => scrollTop.value > SHOW_AT)

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <Transition
    enter-active-class="transition duration-200 ease-out"
    enter-from-class="opacity-0 translate-y-2"
    enter-to-class="opacity-100 translate-y-0"
    leave-active-class="transition duration-150 ease-in"
    leave-from-class="opacity-100 translate-y-0"
    leave-to-class="opacity-0 translate-y-2"
  >
    <Button
      v-if="visible"
      variant="outline"
      size="icon"
      class="fixed right-6 z-50 h-10 w-10 rounded-full shadow-md cursor-pointer md:bottom-6 bottom-20"
      aria-label="回到顶部"
      @click="scrollToTop"
    >
      <ArrowUp class="h-4 w-4" />
    </Button>
  </Transition>
</template>

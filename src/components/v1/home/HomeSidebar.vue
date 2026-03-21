<template>
  <aside class="sidebar">
    <!-- Advertising Container (Slot-based) -->
    <AdContainer type="glass">
      <iframe
        src="https://static.nube.sh/html-video/speed-sc/1280x720/index.html?lp=https%3A%2F%2Fnube.sh%2Finvite%2F6723572561HYYC"
        style="width: 100%; height: auto; border: none" scrolling="no" frameborder="0">
      </iframe>
    </AdContainer>

    <!-- Ad Container (Improved Light Style) -->
    <AdContainer title="加入技术沙龙" description="与行业大佬零距离接触，探索最前沿的技术变迁与工程实践。" buttonText="立即报名" icon="users-rectangle"
      type="default" />
  </aside>
</template>

<script setup lang="ts">
import AdContainer from "@/components/v1/common/AdContainer.vue";

defineProps<{}>();
</script>

<style scoped lang="scss">
.sidebar {
  position: sticky;
  top: 130px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

/* ── Responsive ── */
@media (max-width: 1100px) {
  .sidebar {
    position: static;
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 640px) {
  .sidebar {
    grid-template-columns: 1fr;
  }
}
</style>

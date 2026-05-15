<template>
  <section class="post-feed">
    <PostCard
      v-for="(post, index) in posts"
      :key="post.id"
      :post="post"
      :index="index"
      :animated="animated"
      :animateIndex="animateIndex"
    />
  </section>
</template>

<script setup lang="ts">
import PostCard from "./PostCard.vue";
import type { Resource } from "@/data/mockData";

defineProps<{
  posts: Resource[];
  animated?: boolean;
  animateIndex?: number;
}>();
</script>

<style scoped lang="scss">
.post-feed {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 0 16px 8px;

  @media (max-width: 768px) {
    padding: 0;
    gap: 10px;
  }
}
</style>

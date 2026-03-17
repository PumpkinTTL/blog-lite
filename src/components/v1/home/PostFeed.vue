<template>
  <section class="post-feed">
    <PostCard
      v-for="(post, index) in posts"
      :key="post.id"
      :post="post"
      :index="index"
    />
  </section>
</template>

<script setup lang="ts">
import PostCard from "./PostCard.vue";
import type { Resource } from "@/data/mockData";

defineProps<{
  posts: Resource[];
}>();
</script>

<style scoped lang="scss">
.post-feed {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
</style>

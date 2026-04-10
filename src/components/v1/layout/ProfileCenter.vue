<template>
  <a-modal
    :open="isOpen"
    :footer="null"
    :closable="false"
    :width="modalWidth"
    centered
    wrap-class-name="profile-modal"
    @cancel="close"
  >
    123123
  </a-modal>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, reactive, ref } from "vue";
</script>

<style lang="scss" scoped>

</style>

<template>
  <section class="filter-bar">
    <!-- Left -->
    <div class="left">
      <div class="bar-title">
        <div class="title-icon">
          <font-awesome-icon icon="newspaper" />
        </div>
        <h2>技术文章广场</h2>
      </div>
      <div class="mini-stats">
        <span class="stat-pill">今日更新 <b>18</b></span>
        <span class="stat-pill">精选作者 <b>9</b></span>
        <span class="stat-pill">专题 <b>4</b></span>
      </div>
    </div>

    <!-- Middle: category chips -->
    <div class="middle">
      <div class="chips-wrap">
        <button
          v-for="item in categories"
          :key="item"
          class="chip"
          :class="{ active: item === activeCategory }"
          type="button"
          @click="selectCategory(item)"
        >{{ item }}</button>
      </div>
    </div>

    <!-- Right: sort + view -->
    <div class="right">
      <div class="seg-group">
        <button
          v-for="item in sortOptions"
          :key="item.value"
          class="seg-btn"
          :class="{ active: item.value === activeSort }"
          type="button"
          @click="selectSort(item.value)"
        >{{ item.label }}</button>
      </div>
      <div class="seg-group">
        <button type="button" class="seg-btn active">列表</button>
        <button type="button" class="seg-btn">紧凑</button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const props = defineProps<{
  categories: string[]
  activeCategory: string
  activeSort: 'latest' | 'popular'
}>()

const emit = defineEmits<{
  (e: 'update:activeCategory', value: string): void
  (e: 'update:activeSort', value: 'latest' | 'popular'): void
}>()

const sortOptions = [
  { label: '最新', value: 'latest' as const },
  { label: '最热', value: 'popular' as const },
]

const selectCategory = (value: string) => {
  if (value !== props.activeCategory) emit('update:activeCategory', value)
}

const selectSort = (value: 'latest' | 'popular') => {
  if (value !== props.activeSort) emit('update:activeSort', value)
}
</script>

<style scoped lang="scss">
.filter-bar {
  position: sticky;
  top: 64px;
  z-index: 20;
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: 0;
  background: #fff;
  border: 1px solid #E5E7EB;
  border-radius: 10px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

/* ── Left ── */
.left {
  padding: 12px 16px;
  border-right: 1px solid #F3F4F6;
  min-width: 0;
}

.bar-title {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 7px;
}

.title-icon {
  width: 26px;
  height: 26px;
  border-radius: 6px;
  background: #EFF6FF;
  color: #2563EB;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  flex-shrink: 0;
}

.bar-title h2 {
  margin: 0;
  font-size: 13.5px;
  font-weight: 600;
  color: #111827;
  white-space: nowrap;
}

.mini-stats {
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
}

.stat-pill {
  font-size: 10.5px;
  color: #6B7280;
  background: #F9FAFB;
  border: 1px solid #E5E7EB;
  border-radius: 4px;
  padding: 2px 7px;
  font-weight: 500;

  b {
    font-weight: 600;
    color: #374151;
  }
}

/* ── Middle ── */
.middle {
  padding: 12px 16px;
}

.chips-wrap {
  display: flex;
  gap: 4px;
  overflow-x: auto;
  scrollbar-width: none;
  &::-webkit-scrollbar { display: none; }
}

.chip {
  flex-shrink: 0;
  border: 1px solid #E5E7EB;
  background: transparent;
  color: #6B7280;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  padding: 5px 12px;
  cursor: pointer;
  transition: all 120ms ease;
  font-family: inherit;

  &:hover:not(.active) {
    background: #F9FAFB;
    border-color: #D1D5DB;
    color: #374151;
  }
}

.chip.active {
  background: #EFF6FF;
  color: #2563EB;
  border-color: #BFDBFE;
  font-weight: 600;
}

/* ── Right ── */
.right {
  display: flex;
  gap: 8px;
  align-items: center;
  padding: 12px 16px;
  border-left: 1px solid #F3F4F6;
  flex-shrink: 0;
}

.seg-group {
  display: inline-flex;
  border: 1px solid #E5E7EB;
  border-radius: 7px;
  background: #F9FAFB;
  overflow: hidden;
}

.seg-btn {
  border: none;
  background: transparent;
  color: #6B7280;
  font-size: 12px;
  font-weight: 500;
  padding: 5px 10px;
  cursor: pointer;
  font-family: inherit;
  transition: all 120ms ease;

  &:hover:not(.active) {
    background: #F3F4F6;
    color: #374151;
  }

  & + & {
    border-left: 1px solid #E5E7EB;
  }
}

.seg-btn.active {
  background: #fff;
  color: #2563EB;
  font-weight: 600;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06);
}

/* ── Responsive ── */
@media (max-width: 1100px) {
  .filter-bar {
    grid-template-columns: 1fr;
    top: 56px;
  }
  .left { border-right: none; border-bottom: 1px solid #F3F4F6; }
  .right { border-left: none; border-top: 1px solid #F3F4F6; }
  .middle { padding: 10px 16px; }
}
</style>

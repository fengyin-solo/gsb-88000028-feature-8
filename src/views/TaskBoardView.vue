<script setup>
import { computed } from 'vue'

import PanelSection from '../components/common/PanelSection.vue'
import TaskTable from '../components/restoration/TaskTable.vue'
import { useRestorationState } from '../composables/restorationState'

const RISK_ORDER = {
  high: 0,
  medium: 1,
  low: 2,
}

const { state, processBatch } = useRestorationState()

const sortedTasks = computed(() =>
  [...state.tasks].sort(
    (a, b) =>
      Number(Boolean(a.done)) - Number(Boolean(b.done)) ||
      (RISK_ORDER[a.risk] ?? 3) - (RISK_ORDER[b.risk] ?? 3),
  ),
)

const pendingCount = computed(
  () => state.tasks.filter((item) => !item.done).length,
)
</script>

<template>
  <div class="view-stack">
    <PanelSection title="任务清单" :badge="`待办 ${pendingCount} 项 · 按风险排序`">
      <TaskTable :rows="sortedTasks" @complete="processBatch" />
    </PanelSection>
  </div>
</template>

<style scoped>
.view-stack {
  display: grid;
}
</style>

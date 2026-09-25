<script setup>
import PanelSection from '../components/common/PanelSection.vue'
import TaskTable from '../components/restoration/TaskTable.vue'
import { useRestorationStore } from '../composables/useRestorationStore'

const { state, completeBatch } = useRestorationStore()

function handleComplete(row) {
  completeBatch(row.batchCode)
}
</script>

<template>
  <div class="view-stack">
    <PanelSection title="任务清单" badge="按风险排序">
      <TaskTable :rows="state.tasks" @complete="handleComplete" />
    </PanelSection>
  </div>
</template>

<style scoped>
.view-stack {
  display: grid;
}
</style>

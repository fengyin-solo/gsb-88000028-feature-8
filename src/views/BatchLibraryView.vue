<script setup>
import { computed } from 'vue'

import PanelSection from '../components/common/PanelSection.vue'
import BatchGrid from '../components/restoration/BatchGrid.vue'
import { useRestorationState } from '../composables/restorationState'

const { state, processBatch } = useRestorationState()

const pendingCount = computed(
  () => state.batches.filter((item) => item.state !== 'done').length,
)
</script>

<template>
  <div class="view-stack">
    <PanelSection
      title="批次档案"
      :badge="`待处理 ${pendingCount} / 共 ${state.batches.length} 批`"
    >
      <BatchGrid :items="state.batches" @complete="processBatch" />
    </PanelSection>
  </div>
</template>

<style scoped>
.view-stack {
  display: grid;
}
</style>

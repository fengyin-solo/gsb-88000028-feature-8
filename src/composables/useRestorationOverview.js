import { computed } from 'vue'

import { restorationEnvironment } from '../data/restorationData'
import { useRestorationStore } from './useRestorationStore'

export function useRestorationOverview() {
  const { state, activeTasks } = useRestorationStore()

  const batchCount = computed(() => state.batches.length)
  const highRiskCount = computed(
    () => activeTasks.value.filter((item) => item.risk === 'high').length,
  )
  const environmentCount = computed(() => restorationEnvironment.length)
  const ownerCount = computed(() => new Set(activeTasks.value.map((item) => item.owner)).size)

  return {
    batchCount,
    highRiskCount,
    environmentCount,
    ownerCount,
  }
}

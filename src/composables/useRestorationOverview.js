import { computed } from 'vue'

import { restorationEnvironment } from '../data/restorationData'
import { useRestorationState } from './restorationState'

export function useRestorationOverview() {
  const { state } = useRestorationState()

  const batchCount = computed(() => state.batches.length)
  const highRiskCount = computed(
    () =>
      state.tasks.filter((item) => !item.done && item.risk === 'high').length,
  )
  const environmentCount = computed(() => restorationEnvironment.length)
  const ownerCount = computed(
    () =>
      new Set(
        state.tasks
          .filter((item) => !item.done)
          .map((item) => item.owner),
      ).size,
  )

  return {
    batchCount,
    highRiskCount,
    environmentCount,
    ownerCount,
  }
}

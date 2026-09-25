import { computed } from 'vue'

import { buildBacklogReminders, buildReminderHeadline } from '../utils/backlogReminders'
import { useRestorationStore } from './useRestorationStore'

export function useBacklogReminders() {
  const { state } = useRestorationStore()

  const summary = computed(() =>
    buildBacklogReminders({
      batches: state.batches,
      flags: state.flags,
      capacity: state.capacity,
    }),
  )
  const headline = computed(() => buildReminderHeadline(summary.value))

  return {
    summary,
    headline,
  }
}

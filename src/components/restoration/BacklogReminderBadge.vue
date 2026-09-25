<script setup>
import { computed } from 'vue'

import { useBacklogReminders } from '../../composables/useBacklogReminders'
import { reminderTierMeta } from '../../utils/backlogReminders'

const { summary } = useBacklogReminders()

const highestTier = computed(() => summary.value.items[0]?.tier ?? null)
const tone = computed(() =>
  highestTier.value ? reminderTierMeta(highestTier.value).tone : 'clear',
)
const text = computed(() => {
  const { total, tierCounts } = summary.value
  if (!total) return '待处理提醒：已清空'
  const parts = [`待处理提醒 ${total} 批`]
  if (tierCounts.urgent) parts.push(`紧急 ${tierCounts.urgent}`)
  if (tierCounts.priority) parts.push(`优先 ${tierCounts.priority}`)
  return parts.join(' · ')
})
</script>

<template>
  <RouterLink to="/" :class="['reminder-badge', `reminder-badge--${tone}`]">
    {{ text }}
  </RouterLink>
</template>

<style scoped>
.reminder-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: 14px;
  padding: 8px 14px;
  border-radius: 999px;
  font-size: 0.84rem;
  text-decoration: none;
  border: 1px solid transparent;
}

.reminder-badge--high {
  background: #efd0c9;
  color: #913d2f;
  border-color: rgba(145, 61, 47, 0.28);
}

.reminder-badge--medium {
  background: #f6e5b9;
  color: #8b6314;
  border-color: rgba(139, 99, 20, 0.28);
}

.reminder-badge--low {
  background: #d9ead9;
  color: #366338;
  border-color: rgba(54, 99, 56, 0.28);
}

.reminder-badge--clear {
  background: #efe2ca;
  color: #7e6038;
}
</style>

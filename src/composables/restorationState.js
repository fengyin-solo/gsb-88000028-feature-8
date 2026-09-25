import { reactive } from 'vue'

import {
  restorationAlerts,
  restorationBatches,
  restorationCapacity,
  restorationTasks,
} from '../data/restorationData'

// 模块级共享状态：总览、批次档案、任务清单读写同一份数据，
// 处理完一批后回到任意视图，提醒数量、档案状态和任务清单保持一致。
const state = reactive({
  batches: restorationBatches.map((item) => ({ ...item })),
  tasks: restorationTasks.map((item) => ({ ...item })),
  alerts: restorationAlerts.map((item) => ({ ...item })),
  capacity: restorationCapacity.map((item) => ({ ...item })),
})

function processBatch(code) {
  const batch = state.batches.find((item) => item.code === code)
  if (!batch || batch.state === 'done') {
    // 已处理的批次再次标记直接忽略，避免重复计数
    return
  }
  batch.state = 'done'
  state.alerts = state.alerts.filter((item) => item.code !== code)
  state.tasks = state.tasks.map((item) =>
    item.code === code ? { ...item, done: true } : item,
  )
}

export function useRestorationState() {
  return {
    state,
    processBatch,
  }
}

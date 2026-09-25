import { computed, reactive } from 'vue'

import {
  backlogFlags,
  restorationBatches,
  restorationCapacity,
  restorationTasks,
} from '../data/restorationData'

const STORAGE_KEY = 'restoration-board:processed-batches'

function loadProcessedCodes() {
  try {
    if (typeof window === 'undefined') return []
    const parsed = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? '[]')
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function persistProcessedCodes(codes) {
  try {
    if (typeof window === 'undefined') return
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(codes))
  } catch {
    // 存储不可用时仅保持当前会话内状态
  }
}

const restoredCodes = new Set(loadProcessedCodes())

// 模块级单例状态：跨路由视图共享，处理完成后各页面同步联动
const state = reactive({
  batches: restorationBatches.map((batch) => ({
    ...batch,
    processed: restoredCodes.has(batch.code),
  })),
  tasks: restorationTasks.map((task) => ({
    ...task,
    done: restoredCodes.has(task.batchCode),
  })),
  capacity: restorationCapacity,
  flags: backlogFlags,
})

const pendingBatches = computed(() => state.batches.filter((batch) => !batch.processed))
const pendingVolumes = computed(() =>
  pendingBatches.value.reduce((sum, batch) => sum + (batch.volumes ?? 0), 0),
)
const activeTasks = computed(() => state.tasks.filter((task) => !task.done))

function completeBatch(code) {
  const batch = state.batches.find((item) => item.code === code)
  if (!batch || batch.processed) return
  batch.processed = true
  for (const task of state.tasks) {
    if (task.batchCode === code) {
      task.done = true
    }
  }
  persistProcessedCodes(state.batches.filter((item) => item.processed).map((item) => item.code))
}

export function useRestorationStore() {
  return {
    state,
    pendingBatches,
    pendingVolumes,
    activeTasks,
    completeBatch,
  }
}

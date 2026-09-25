import { computed } from 'vue'

import { riskMeta } from '../utils/restorationFormatters'
import { useRestorationState } from './restorationState'

const RISK_WEIGHT = {
  high: 3,
  medium: 2,
  low: 1,
}

const TIER_ORDER = {
  urgent: 0,
  soon: 1,
  normal: 2,
}

const TIER_SUGGESTION = {
  urgent: '建议立即安排修复师处理。',
  soon: '建议本周内排期处理。',
  normal: '按常规节奏跟进即可。',
}

function backlogWeight(waitingDays) {
  if (!Number.isFinite(waitingDays) || waitingDays < 0) {
    return 0
  }
  if (waitingDays >= 14) {
    return 2
  }
  if (waitingDays >= 7) {
    return 1
  }
  return 0
}

function resolveTier(score) {
  if (score >= 5) {
    return 'urgent'
  }
  if (score >= 3) {
    return 'soon'
  }
  return 'normal'
}

export function useRestorationReminders() {
  const { state } = useRestorationState()

  const pendingBatches = computed(() =>
    state.batches.filter((item) => item.state !== 'done'),
  )

  // 任一修复室容量字段缺失即视为整体未知，不据此升级提醒
  const capacityStatus = computed(() => {
    const missingRooms = state.capacity
      .filter(
        (room) =>
          !Number.isFinite(room.totalSlots) ||
          !Number.isFinite(room.occupiedSlots),
      )
      .map((room) => room.room)
    const known = state.capacity.length > 0 && missingRooms.length === 0
    const totalSlots = known
      ? state.capacity.reduce((sum, room) => sum + room.totalSlots, 0)
      : null
    const remainingSlots = known
      ? state.capacity.reduce(
          (sum, room) => sum + (room.totalSlots - room.occupiedSlots),
          0,
        )
      : null

    return { known, totalSlots, remainingSlots, missingRooms }
  })

  const capacityWeight = computed(() => {
    if (!capacityStatus.value.known) {
      return 0
    }
    if (capacityStatus.value.remainingSlots <= 0) {
      return 2
    }
    if (capacityStatus.value.remainingSlots <= 2) {
      return 1
    }
    return 0
  })

  // 同一批次被重复标记时按批次代码合并，只保留最新一条，避免重复计数
  const uniqueAlerts = computed(() => {
    const pendingCodes = new Set(
      pendingBatches.value.map((item) => item.code),
    )
    const byCode = new Map()
    state.alerts.forEach((alert) => {
      if (!pendingCodes.has(alert.code)) {
        return
      }
      const existing = byCode.get(alert.code)
      if (!existing || String(alert.flaggedAt) > String(existing.flaggedAt)) {
        byCode.set(alert.code, alert)
      }
    })
    return [...byCode.values()]
  })

  const mergedFlagCount = computed(() => {
    const pendingCodes = new Set(
      pendingBatches.value.map((item) => item.code),
    )
    const flagged = state.alerts.filter((alert) =>
      pendingCodes.has(alert.code),
    ).length
    return flagged - uniqueAlerts.value.length
  })

  const reminders = computed(() =>
    uniqueAlerts.value
      .map((alert) => {
        const batch = pendingBatches.value.find(
          (item) => item.code === alert.code,
        )
        if (!batch) {
          return null
        }
        const score =
          (RISK_WEIGHT[batch.risk] ?? RISK_WEIGHT.low) +
          backlogWeight(batch.waitingDays) +
          capacityWeight.value
        const tier = resolveTier(score)
        const factors = [
          `积压 ${batch.waitingDays} 天`,
          `${riskMeta(batch.risk).label}风险`,
        ]
        if (capacityWeight.value > 0) {
          factors.push('修复室容量紧张')
        }
        return {
          code: batch.code,
          title: batch.title,
          tier,
          score,
          waitingDays: batch.waitingDays,
          message: `${factors.join('，')}。${alert.reason}`,
          suggestion: TIER_SUGGESTION[tier],
        }
      })
      .filter(Boolean)
      .sort(
        (a, b) =>
          TIER_ORDER[a.tier] - TIER_ORDER[b.tier] ||
          b.waitingDays - a.waitingDays,
      ),
  )

  const reminderCount = computed(() => reminders.value.length)

  return {
    reminders,
    reminderCount,
    capacityStatus,
    mergedFlagCount,
  }
}

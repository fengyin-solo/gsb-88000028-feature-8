import { riskMeta } from './restorationFormatters.js'

export const REMINDER_TIERS = {
  urgent: { label: '紧急', tone: 'high', rank: 0 },
  priority: { label: '优先', tone: 'medium', rank: 1 },
  routine: { label: '常规', tone: 'low', rank: 2 },
}

export function reminderTierMeta(tier) {
  return REMINDER_TIERS[tier] ?? REMINDER_TIERS.routine
}

const RISK_SCORES = { high: 3, medium: 2, low: 1 }
const CAPACITY_STRAIN_RATIO = 0.8

// 积压时长：>=21 天记 3 分，>=7 天记 2 分，其余记 1 分
export function backlogScore(days) {
  if (!Number.isFinite(days) || days < 0) return 1
  if (days >= 21) return 3
  if (days >= 7) return 2
  return 1
}

// 容量数据缺失或非法时保持中立：weight 0，不参与升级
export function resolveCapacity(capacity) {
  const total = Number(capacity?.totalSlots)
  const occupied = Number(capacity?.occupiedSlots)
  if (!Number.isFinite(total) || !Number.isFinite(occupied) || total <= 0 || occupied < 0) {
    return { missing: true, strained: false, weight: 0, ratio: null, total: null, occupied: null }
  }
  const ratio = occupied / total
  const strained = ratio >= CAPACITY_STRAIN_RATIO
  return { missing: false, strained, weight: strained ? 1 : 0, ratio, total, occupied }
}

export function tierForScore(score) {
  if (score >= 6) return 'urgent'
  if (score >= 4) return 'priority'
  return 'routine'
}

function backlogReason(days) {
  if (days >= 21) return `积压 ${days} 天，超过 21 天红线`
  if (days >= 7) return `积压 ${days} 天，超过 7 天观察线`
  return `积压 ${days} 天`
}

/**
 * 由批次、预警标记和容量数据构建分级提醒。
 * - 同一批次被重复标记时只计一次，且不因标记次数升级；
 * - 容量数据缺失时不做容量加权，维持积压时长 + 风险等级的结果；
 * - 已处理批次与未知批次的标记直接忽略。
 */
export function buildBacklogReminders({ batches = [], flags = [], capacity = null } = {}) {
  const capacityInfo = resolveCapacity(capacity)

  const activeBatches = new Map()
  for (const batch of Array.isArray(batches) ? batches : []) {
    if (batch && batch.code && !batch.processed) {
      activeBatches.set(batch.code, batch)
    }
  }

  const flaggedCodes = []
  const seen = new Set()
  let duplicateFlags = 0
  for (const flag of Array.isArray(flags) ? flags : []) {
    const code = flag?.code
    if (!code || !activeBatches.has(code)) continue
    if (seen.has(code)) {
      duplicateFlags += 1
      continue
    }
    seen.add(code)
    flaggedCodes.push(code)
  }

  const items = flaggedCodes
    .map((code) => {
      const batch = activeBatches.get(code)
      const days = Number.isFinite(batch.backlogDays) ? batch.backlogDays : 0
      const score = backlogScore(days) + (RISK_SCORES[batch.risk] ?? RISK_SCORES.low) + capacityInfo.weight
      const tier = tierForScore(score)
      const reasons = [backlogReason(days), `风险等级：${riskMeta(batch.risk).label}`]
      if (capacityInfo.missing) {
        reasons.push('容量数据缺失，未做容量加权')
      } else if (capacityInfo.strained) {
        reasons.push(`修复室容量紧张（占用 ${capacityInfo.occupied}/${capacityInfo.total}），已加权升级`)
      }
      return {
        code,
        title: batch.title,
        risk: batch.risk,
        backlogDays: days,
        volumes: batch.volumes ?? 0,
        tier,
        score,
        reasons,
      }
    })
    .sort(
      (a, b) =>
        reminderTierMeta(a.tier).rank - reminderTierMeta(b.tier).rank ||
        b.score - a.score ||
        b.backlogDays - a.backlogDays ||
        a.code.localeCompare(b.code),
    )

  const tierCounts = { urgent: 0, priority: 0, routine: 0 }
  for (const item of items) {
    tierCounts[item.tier] += 1
  }

  return {
    items,
    total: items.length,
    tierCounts,
    duplicateFlags,
    capacityMissing: capacityInfo.missing,
    capacityStrained: capacityInfo.strained,
    capacityLabel: capacityInfo.missing
      ? null
      : `${capacity?.room ?? '修复室'} ${capacityInfo.occupied}/${capacityInfo.total}（${capacityInfo.strained ? '紧张' : '充裕'}）`,
  }
}

export function buildReminderHeadline(summary) {
  if (!summary || !summary.total) {
    return '待处理批次已清空，暂无新的预警标记'
  }
  const base = `${summary.total} 批待处理：紧急 ${summary.tierCounts.urgent} · 优先 ${summary.tierCounts.priority} · 常规 ${summary.tierCounts.routine}`
  const notes = []
  if (summary.capacityMissing) {
    notes.push('容量数据缺失，按积压与风险维持原等级')
  }
  if (summary.duplicateFlags) {
    notes.push(`已合并 ${summary.duplicateFlags} 条重复标记`)
  }
  return notes.length ? `${base}（${notes.join('；')}）` : base
}

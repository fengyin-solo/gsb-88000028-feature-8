import test from 'node:test'
import assert from 'node:assert/strict'

import {
  buildBacklogReminders,
  buildReminderHeadline,
  resolveCapacity,
} from './backlogReminders.js'

const batches = [
  { code: 'A-03', title: '明抄本县志残卷', risk: 'high', backlogDays: 26, volumes: 5, processed: false },
  { code: 'B-11', title: '碑帖拓片册页', risk: 'medium', backlogDays: 9, volumes: 4, processed: false },
  { code: 'C-02', title: '戏曲抄本散页', risk: 'low', backlogDays: 8, volumes: 3, processed: false },
]

const flags = [
  { code: 'A-03', flaggedAt: '2026-09-23 09:10' },
  { code: 'B-11', flaggedAt: '2026-09-24 15:40' },
  { code: 'A-03', flaggedAt: '2026-09-25 08:05' },
  { code: 'C-02', flaggedAt: '2026-09-25 10:20' },
]

const strainedCapacity = { room: '修复室 2', totalSlots: 6, occupiedSlots: 5 }

test('同一批次重复标记只计一次，且不因此升级', () => {
  const withDuplicate = buildBacklogReminders({ batches, flags, capacity: strainedCapacity })
  const withoutDuplicate = buildBacklogReminders({
    batches,
    flags: flags.filter((flag, index) => index !== 2),
    capacity: strainedCapacity,
  })

  assert.equal(withDuplicate.total, 3)
  assert.equal(withDuplicate.duplicateFlags, 1)
  assert.equal(
    withDuplicate.items.find((item) => item.code === 'A-03').tier,
    withoutDuplicate.items.find((item) => item.code === 'A-03').tier,
  )
  assert.deepEqual(
    withDuplicate.items.map((item) => item.code),
    withoutDuplicate.items.map((item) => item.code),
  )
})

test('容量数据缺失时不加权、不升级，提醒数量保持不变', () => {
  const missing = buildBacklogReminders({ batches, flags, capacity: null })
  const strained = buildBacklogReminders({ batches, flags, capacity: strainedCapacity })

  assert.equal(missing.capacityMissing, true)
  assert.equal(missing.total, strained.total)
  // C-02：低风险 + 积压 8 天 = 3 分，容量紧张时才升为“优先”，缺失时保持“常规”
  assert.equal(missing.items.find((item) => item.code === 'C-02').tier, 'routine')
  assert.equal(strained.items.find((item) => item.code === 'C-02').tier, 'priority')
})

test('非法容量字段同样视为缺失', () => {
  for (const capacity of [
    undefined,
    {},
    { totalSlots: null, occupiedSlots: 5 },
    { totalSlots: 6, occupiedSlots: '未知' },
    { totalSlots: 0, occupiedSlots: 0 },
  ]) {
    assert.equal(resolveCapacity(capacity).missing, true)
    assert.equal(resolveCapacity(capacity).weight, 0)
  }
})

test('分级结果由积压时长、风险等级和容量共同决定', () => {
  const summary = buildBacklogReminders({ batches, flags, capacity: strainedCapacity })
  const tiers = Object.fromEntries(summary.items.map((item) => [item.code, item.tier]))

  assert.deepEqual(tiers, { 'A-03': 'urgent', 'B-11': 'priority', 'C-02': 'priority' })
  assert.deepEqual(summary.tierCounts, { urgent: 1, priority: 2, routine: 0 })
  assert.equal(summary.capacityStrained, true)
})

test('已处理批次不再计入提醒，未知批次标记被忽略', () => {
  const processed = batches.map((batch) =>
    batch.code === 'A-03' ? { ...batch, processed: true } : batch,
  )
  const summary = buildBacklogReminders({
    batches: processed,
    flags: [...flags, { code: 'Z-99' }],
    capacity: strainedCapacity,
  })

  assert.equal(summary.total, 2)
  assert.ok(!summary.items.some((item) => item.code === 'A-03'))
  assert.ok(!summary.items.some((item) => item.code === 'Z-99'))
})

test('无新数据时提醒数量与提醒语保持稳定', () => {
  const first = buildBacklogReminders({ batches, flags, capacity: strainedCapacity })
  const second = buildBacklogReminders({ batches, flags, capacity: strainedCapacity })

  assert.equal(buildReminderHeadline(first), buildReminderHeadline(second))
  assert.equal(first.total, second.total)
  assert.match(buildReminderHeadline(first), /3 批待处理：紧急 1 · 优先 2 · 常规 0/)
})

test('全部处理完后提醒语切换为清空状态', () => {
  const done = batches.map((batch) => ({ ...batch, processed: true }))
  const summary = buildBacklogReminders({ batches: done, flags, capacity: strainedCapacity })

  assert.equal(summary.total, 0)
  assert.equal(buildReminderHeadline(summary), '待处理批次已清空，暂无新的预警标记')
})

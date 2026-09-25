<script setup>
import { reminderTierMeta } from '../../utils/restorationFormatters'

defineProps({
  reminders: {
    type: Array,
    required: true,
  },
  capacity: {
    type: Object,
    required: true,
  },
  mergedCount: {
    type: Number,
    default: 0,
  },
})
</script>

<template>
  <section class="reminder-panel">
    <header class="reminder-head">
      <div>
        <h3>待处理批次提醒</h3>
        <p class="capacity-line">
          <template v-if="capacity.known">
            修复室剩余工位 {{ capacity.remainingSlots }} / {{ capacity.totalSlots }}
          </template>
          <template v-else>
            容量数据缺失（{{ capacity.missingRooms.join('、') || '未登记' }}），提醒未按容量升级
          </template>
        </p>
      </div>
      <span class="count-badge">{{ reminders.length }} 项</span>
    </header>

    <ul v-if="reminders.length" class="reminder-list">
      <li
        v-for="reminder in reminders"
        :key="reminder.code"
        :class="['reminder-item', `reminder-item--${reminder.tier}`]"
      >
        <span
          :class="['tier-pill', `tier-pill--${reminderTierMeta(reminder.tier).tone}`]"
        >
          {{ reminderTierMeta(reminder.tier).label }}
        </span>
        <div class="reminder-body">
          <p class="reminder-title">
            批次 {{ reminder.code }} · {{ reminder.title }}
          </p>
          <p class="reminder-message">{{ reminder.message }}</p>
          <p class="reminder-suggestion">{{ reminder.suggestion }}</p>
        </div>
      </li>
    </ul>
    <p v-else class="reminder-empty">暂无待处理提醒，所有批次均在正常流转。</p>

    <footer v-if="mergedCount > 0" class="reminder-foot">
      已合并 {{ mergedCount }} 条重复标记，同一批次不重复计数。
    </footer>
  </section>
</template>

<style scoped>
.reminder-panel {
  border: 1px solid rgba(145, 61, 47, 0.18);
  border-radius: 24px;
  background: rgba(255, 248, 240, 0.92);
  padding: 22px;
  box-shadow: 0 16px 40px rgba(100, 73, 34, 0.08);
}

.reminder-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
}

h3,
p {
  margin: 0;
}

h3 {
  font-size: 1.1rem;
}

.capacity-line {
  margin-top: 8px;
  color: #6a5439;
  font-size: 0.86rem;
}

.count-badge {
  padding: 8px 14px;
  border-radius: 999px;
  background: #5d4322;
  color: #fff8eb;
  font-size: 0.86rem;
  white-space: nowrap;
}

.reminder-list {
  list-style: none;
  margin: 18px 0 0;
  padding: 0;
  display: grid;
  gap: 12px;
}

.reminder-item {
  display: flex;
  gap: 14px;
  align-items: flex-start;
  padding: 14px 16px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.72);
  border-left: 4px solid transparent;
}

.reminder-item--urgent {
  border-left-color: #913d2f;
}

.reminder-item--soon {
  border-left-color: #8b6314;
}

.reminder-item--normal {
  border-left-color: #366338;
}

.tier-pill {
  flex-shrink: 0;
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 0.76rem;
}

.tier-pill--urgent {
  background: #efd0c9;
  color: #913d2f;
}

.tier-pill--soon {
  background: #f6e5b9;
  color: #8b6314;
}

.tier-pill--normal {
  background: #d9ead9;
  color: #366338;
}

.reminder-title {
  font-weight: 600;
}

.reminder-message {
  margin-top: 6px;
  color: #5c4a33;
}

.reminder-suggestion {
  margin-top: 4px;
  color: #82684b;
  font-size: 0.86rem;
}

.reminder-empty {
  margin-top: 18px;
  color: #6a5439;
}

.reminder-foot {
  margin-top: 16px;
  padding-top: 12px;
  border-top: 1px dashed rgba(121, 88, 47, 0.28);
  color: #82684b;
  font-size: 0.82rem;
}
</style>

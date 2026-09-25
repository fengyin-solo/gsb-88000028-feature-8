<script setup>
import PanelSection from '../common/PanelSection.vue'
import { REMINDER_TIERS, reminderTierMeta } from '../../utils/backlogReminders'

defineProps({
  summary: {
    type: Object,
    required: true,
  },
  headline: {
    type: String,
    required: true,
  },
})

const tierOrder = Object.keys(REMINDER_TIERS)
</script>

<template>
  <PanelSection title="待处理批次提醒" badge="持续可见">
    <p class="headline">{{ headline }}</p>

    <div class="tier-chips">
      <span
        v-for="tier in tierOrder"
        :key="tier"
        :class="['tier-chip', `tier-chip--${reminderTierMeta(tier).tone}`]"
      >
        {{ reminderTierMeta(tier).label }} {{ summary.tierCounts[tier] }}
      </span>
    </div>

    <p v-if="summary.capacityMissing" class="notice">
      容量数据缺失：本次不按容量加权，提醒等级维持积压时长与风险等级的结果，不额外升级。
    </p>
    <p v-if="summary.duplicateFlags" class="notice">
      已合并 {{ summary.duplicateFlags }} 条重复标记：同一批次只计一次，不因重复上报而升级。
    </p>

    <ul v-if="summary.items.length" class="reminder-list">
      <li
        v-for="item in summary.items"
        :key="item.code"
        class="reminder-item"
      >
        <span :class="['tier-pill', `tier-pill--${reminderTierMeta(item.tier).tone}`]">
          {{ reminderTierMeta(item.tier).label }}
        </span>
        <div class="reminder-body">
          <strong>批次 {{ item.code }} · {{ item.title }}</strong>
          <small>{{ item.reasons.join('；') }}</small>
        </div>
      </li>
    </ul>
    <p v-else class="empty">
      当前没有待处理批次提醒；已处理批次会同步更新批次档案与任务清单。
    </p>

    <footer class="panel-foot">
      <span v-if="summary.capacityLabel">容量口径：{{ summary.capacityLabel }}。</span>
      <span>无新数据时，提醒数量与提醒语保持当前结果。</span>
    </footer>
  </PanelSection>
</template>

<style scoped>
.headline {
  margin: 0 0 14px;
  font-size: 1.02rem;
  color: #4a3822;
}

.tier-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 14px;
}

.tier-chip {
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 0.8rem;
}

.tier-chip--high {
  background: #efd0c9;
  color: #913d2f;
}

.tier-chip--medium {
  background: #f6e5b9;
  color: #8b6314;
}

.tier-chip--low {
  background: #d9ead9;
  color: #366338;
}

.notice {
  margin: 0 0 10px;
  padding: 10px 14px;
  border-radius: 12px;
  background: #f6ecc9;
  border: 1px dashed rgba(139, 99, 20, 0.35);
  color: #7a5a16;
  font-size: 0.86rem;
}

.reminder-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 10px;
}

.reminder-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 14px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.72);
  border: 1px solid rgba(79, 57, 32, 0.08);
}

.tier-pill {
  flex-shrink: 0;
  padding: 5px 10px;
  border-radius: 999px;
  font-size: 0.76rem;
}

.tier-pill--high {
  background: #efd0c9;
  color: #913d2f;
}

.tier-pill--medium {
  background: #f6e5b9;
  color: #8b6314;
}

.tier-pill--low {
  background: #d9ead9;
  color: #366338;
}

.reminder-body {
  display: grid;
  gap: 4px;
}

.reminder-body strong {
  font-size: 0.95rem;
}

.reminder-body small {
  color: #6a5439;
}

.empty {
  margin: 0;
  color: #6a5439;
}

.panel-foot {
  display: flex;
  flex-wrap: wrap;
  gap: 6px 16px;
  margin-top: 14px;
  padding-top: 12px;
  border-top: 1px dashed rgba(121, 88, 47, 0.22);
  color: #82684b;
  font-size: 0.8rem;
}
</style>

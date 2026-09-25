<script setup>
import { riskMeta } from '../../utils/restorationFormatters'

defineProps({
  rows: {
    type: Array,
    required: true,
  },
})

defineEmits(['complete'])
</script>

<template>
  <div class="task-table">
    <div class="task-row task-head">
      <span>对象</span>
      <span>阶段</span>
      <span>风险</span>
      <span>负责人</span>
      <span>说明</span>
      <span>状态</span>
    </div>
    <div
      v-for="row in rows"
      :key="`${row.title}-${row.owner}`"
      :class="['task-row', { 'task-row--done': row.done }]"
    >
      <span>{{ row.title }}</span>
      <span>{{ row.stage }}</span>
      <span :class="['risk-tag', `risk-tag--${riskMeta(row.risk).tone}`]">
        {{ riskMeta(row.risk).label }}
      </span>
      <span>{{ row.owner }}</span>
      <span>{{ row.note }}</span>
      <span>
        <button
          v-if="!row.done"
          type="button"
          class="complete-btn"
          @click="$emit('complete', row)"
        >
          标记完成
        </button>
        <span v-else class="done-pill">已完成</span>
      </span>
    </div>
  </div>
</template>

<style scoped>
.task-table {
  overflow: hidden;
  border: 1px solid rgba(79, 57, 32, 0.1);
  border-radius: 18px;
}

.task-row {
  display: grid;
  grid-template-columns: 1.2fr 0.8fr 0.6fr 0.7fr 1.3fr 0.6fr;
  gap: 12px;
  align-items: center;
  padding: 14px 16px;
  background: rgba(255, 255, 255, 0.72);
}

.task-row--done {
  opacity: 0.6;
}

.task-row + .task-row {
  border-top: 1px solid rgba(79, 57, 32, 0.08);
}

.task-head {
  background: #efe1c6;
  color: #775936;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 0.76rem;
}

.risk-tag {
  display: inline-flex;
  justify-content: center;
  width: fit-content;
  padding: 6px 10px;
  border-radius: 999px;
}

.risk-tag--high {
  background: #efd0c9;
  color: #913d2f;
}

.risk-tag--medium {
  background: #f6e5b9;
  color: #8b6314;
}

.risk-tag--low {
  background: #d9ead9;
  color: #366338;
}

.complete-btn {
  padding: 6px 12px;
  border-radius: 999px;
  border: 1px solid rgba(93, 67, 34, 0.4);
  background: #5d4322;
  color: #fff8eb;
  font-size: 0.78rem;
  cursor: pointer;
  white-space: nowrap;
}

.complete-btn:hover {
  background: #4c351a;
}

.done-pill {
  display: inline-flex;
  padding: 6px 10px;
  border-radius: 999px;
  background: #d9ead9;
  color: #366338;
  font-size: 0.78rem;
}

@media (max-width: 900px) {
  .task-table {
    overflow-x: auto;
  }

  .task-row {
    min-width: 860px;
  }
}
</style>

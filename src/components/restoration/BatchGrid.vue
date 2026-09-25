<script setup>
import { riskMeta } from '../../utils/restorationFormatters'

defineProps({
  items: {
    type: Array,
    required: true,
  },
})

const emit = defineEmits(['complete'])
</script>

<template>
  <div class="batch-grid">
    <article
      v-for="item in items"
      :key="item.code"
      :class="['batch-card', { 'batch-card--done': item.state === 'done' }]"
    >
      <div class="batch-head">
        <small>批次 {{ item.code }}</small>
        <span :class="['risk-pill', `risk-pill--${riskMeta(item.risk).tone}`]">
          {{ riskMeta(item.risk).label }}
        </span>
      </div>
      <h4>{{ item.title }}</h4>
      <p>页码：{{ item.pages }}</p>
      <p>阶段：{{ item.status }}</p>
      <p>积压：{{ item.waitingDays }} 天</p>
      <small>{{ item.note }}</small>
      <div class="batch-foot">
        <span
          :class="['state-pill', { 'state-pill--done': item.state === 'done' }]"
        >
          {{ item.state === 'done' ? '已处理' : '待处理' }}
        </span>
        <button
          v-if="item.state !== 'done'"
          type="button"
          class="complete-btn"
          @click="emit('complete', item.code)"
        >
          完成处理
        </button>
      </div>
    </article>
  </div>
</template>

<style scoped>
.batch-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
}

.batch-card {
  padding: 18px;
  border-radius: 20px;
  background: #f4ebda;
  border: 1px solid rgba(109, 80, 40, 0.08);
}

.batch-card--done {
  opacity: 0.62;
}

.batch-head {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: center;
}

h4,
p,
small {
  margin: 0;
}

h4 {
  font-size: 1.04rem;
  margin-top: 10px;
}

p,
small {
  color: #6a5439;
}

p + p,
p + small {
  margin-top: 6px;
}

.batch-foot {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-top: 14px;
}

.state-pill {
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 0.76rem;
  background: #f6e5b9;
  color: #8b6314;
}

.state-pill--done {
  background: #d9ead9;
  color: #366338;
}

.complete-btn {
  padding: 7px 12px;
  border: none;
  border-radius: 999px;
  background: #5d4322;
  color: #fff8eb;
  font: inherit;
  font-size: 0.78rem;
  cursor: pointer;
}

.complete-btn:hover {
  background: #4a3319;
}

.risk-pill {
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 0.76rem;
}

.risk-pill--high {
  background: #efd0c9;
  color: #913d2f;
}

.risk-pill--medium {
  background: #f6e5b9;
  color: #8b6314;
}

.risk-pill--low {
  background: #d9ead9;
  color: #366338;
}

@media (max-width: 960px) {
  .batch-grid {
    grid-template-columns: 1fr;
  }
}
</style>

<script setup>
import { riskMeta } from '../../utils/restorationFormatters'

defineProps({
  items: {
    type: Array,
    required: true,
  },
  completable: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['complete'])
</script>

<template>
  <div class="batch-grid">
    <article
      v-for="item in items"
      :key="item.code"
      :class="['batch-card', { 'batch-card--done': item.processed }]"
    >
      <div class="batch-head">
        <small>批次 {{ item.code }}</small>
        <span :class="['risk-pill', `risk-pill--${riskMeta(item.risk).tone}`]">
          {{ riskMeta(item.risk).label }}
        </span>
      </div>
      <h4>{{ item.title }}</h4>
      <p>页码：{{ item.pages }}</p>
      <p>阶段：{{ item.processed ? '已处理' : item.status }}</p>
      <p>积压：{{ item.backlogDays }} 天 · {{ item.volumes }} 册</p>
      <small>{{ item.note }}</small>
      <button
        v-if="completable && !item.processed"
        type="button"
        class="complete-btn"
        @click="$emit('complete', item.code)"
      >
        标记处理完成
      </button>
      <span v-else-if="completable" class="done-tag">已完成处理</span>
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
  border-style: dashed;
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

.complete-btn {
  margin-top: 12px;
  padding: 8px 14px;
  border-radius: 999px;
  border: 1px solid rgba(93, 67, 34, 0.4);
  background: #5d4322;
  color: #fff8eb;
  font-size: 0.82rem;
  cursor: pointer;
}

.complete-btn:hover {
  background: #4c351a;
}

.done-tag {
  display: inline-block;
  margin-top: 12px;
  padding: 6px 12px;
  border-radius: 999px;
  background: #d9ead9;
  color: #366338;
  font-size: 0.78rem;
}

@media (max-width: 960px) {
  .batch-grid {
    grid-template-columns: 1fr;
  }
}
</style>

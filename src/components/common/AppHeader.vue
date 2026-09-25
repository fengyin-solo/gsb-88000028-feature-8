<script setup>
defineProps({
  eyebrow: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  notice: {
    type: String,
    default: '',
  },
})
</script>

<template>
  <header class="page-header">
    <div class="header-text">
      <p class="eyebrow">{{ eyebrow }}</p>
      <h2>{{ title }}</h2>
      <p class="description">{{ description }}</p>
    </div>
    <RouterLink v-if="notice" to="/" class="notice">{{ notice }}</RouterLink>
  </header>
</template>

<style scoped>
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 24px;
}

.eyebrow {
  margin: 0 0 10px;
  text-transform: uppercase;
  letter-spacing: 0.22em;
  font-size: 0.78rem;
  color: #82684b;
}

h2 {
  margin: 0;
  font-size: clamp(2rem, 4vw, 3.3rem);
  line-height: 0.98;
}

.description {
  margin: 14px 0 0;
  max-width: 52rem;
  color: #5f4c33;
}

.notice {
  flex-shrink: 0;
  padding: 10px 16px;
  border-radius: 999px;
  background: #5d4322;
  color: #fff8eb;
  font-size: 0.84rem;
  text-decoration: none;
  white-space: nowrap;
}

.notice:hover {
  background: #4a3319;
}
</style>

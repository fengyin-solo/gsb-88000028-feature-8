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
})
</script>

<template>
  <header class="page-header">
    <p class="eyebrow">{{ eyebrow }}</p>
    <h2>{{ title }}</h2>
    <p class="description">{{ description }}</p>
    <slot />
  </header>
</template>

<style scoped>
.page-header {
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
</style>

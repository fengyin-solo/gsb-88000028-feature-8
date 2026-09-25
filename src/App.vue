<script setup>
import { computed } from 'vue'
import { RouterView } from 'vue-router'
import AppHeader from './components/common/AppHeader.vue'
import AppSidebar from './components/common/AppSidebar.vue'
import { restorationNavigation } from './data/restorationData'
import { useRestorationReminders } from './composables/useRestorationReminders'

const { reminderCount } = useRestorationReminders()

const reminderNotice = computed(() =>
  reminderCount.value > 0
    ? `待处理提醒 ${reminderCount.value} 项`
    : '暂无待处理提醒',
)
</script>

<template>
  <div class="app-shell">
    <AppSidebar
      title="Conservation Desk"
      subtitle="古籍虫蛀修复"
      :items="restorationNavigation"
    />
    <div class="app-main">
      <AppHeader
        eyebrow="Studio Console"
        title="文献修复流程工作台"
        description="补齐路由、视图、业务组件、数据层和工具函数，让这个项目更像一个能持续迭代的正式前端仓库。"
        :notice="reminderNotice"
      />
      <RouterView />
    </div>
  </div>
</template>

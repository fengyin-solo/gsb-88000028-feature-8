export function riskMeta(risk) {
  const map = {
    high: {
      label: '高',
      tone: 'high',
    },
    medium: {
      label: '中',
      tone: 'medium',
    },
    low: {
      label: '低',
      tone: 'low',
    },
  }

  return map[risk] ?? map.low
}

export function reminderTierMeta(tier) {
  const map = {
    urgent: {
      label: '紧急',
      tone: 'urgent',
    },
    soon: {
      label: '优先',
      tone: 'soon',
    },
    normal: {
      label: '常规',
      tone: 'normal',
    },
  }

  return map[tier] ?? map.normal
}

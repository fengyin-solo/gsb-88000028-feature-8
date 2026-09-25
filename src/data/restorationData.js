export const restorationNavigation = [
  { label: '修复总览', to: '/' },
  { label: '批次档案', to: '/batches' },
  { label: '任务清单', to: '/tasks' },
]

export const restorationHero = {
  title: '古籍虫蛀修复批次板',
  description:
    '聚焦修复批次、控湿参数和文献归档风险，适合作为修复工作室内部业务系统的前端原型。',
  backlogLabel: '待处理批次',
  note: '高湿季节前优先清理虫道扩散页。',
}

export const restorationBatches = [
  {
    code: 'A-03',
    title: '明抄本县志残卷',
    pages: '17-29',
    risk: 'high',
    status: '补纸前',
    backlogDays: 26,
    volumes: 5,
    note: '虫道集中在装订线外沿。',
  },
  {
    code: 'B-11',
    title: '碑帖拓片册页',
    pages: '5-14',
    risk: 'medium',
    status: '控湿中',
    backlogDays: 9,
    volumes: 4,
    note: '需先降湿 48 小时，再进入纤维加固。',
  },
  {
    code: 'C-02',
    title: '戏曲抄本散页',
    pages: '1-9',
    risk: 'low',
    status: '归档前',
    backlogDays: 8,
    volumes: 3,
    note: '边角缺损明显，建议先做透明托裱。',
  },
]

// 修复室容量：occupiedSlots / totalSlots >= 0.8 视为紧张并参与提醒加权；
// 数据缺失（字段为空或非法）时不加权、不升级。
export const restorationCapacity = {
  room: '修复室 2',
  totalSlots: 6,
  occupiedSlots: 5,
  updatedAt: '2026-09-25 08:30',
}

// 待处理批次的预警标记；同一批次可能被重复上报，统计时需去重。
export const backlogFlags = [
  { code: 'A-03', flaggedAt: '2026-09-23 09:10', source: '巡检记录' },
  { code: 'B-11', flaggedAt: '2026-09-24 15:40', source: '控湿工单' },
  { code: 'A-03', flaggedAt: '2026-09-25 08:05', source: '晨会复核' },
  { code: 'C-02', flaggedAt: '2026-09-25 10:20', source: '归档前检查' },
]

export const restorationEnvironment = [
  {
    label: '相对湿度',
    value: '52%',
    note: '控制线 50% - 55%',
  },
  {
    label: '纸浆补配',
    value: '2 批',
    note: '桑皮纤维待过滤',
  },
  {
    label: '紫外检查',
    value: '4 页',
    note: '夜间统一复核霉斑残留',
  },
]

export const restorationSteps = [
  '拍照建档并标注虫蛀起止页。',
  '低压吸附除尘，保留边角碎纤维。',
  '喷雾回软后局部补纸，不做整页过度清洗。',
  '平整定型 8 小时后转入无酸盒暂存。',
]

export const restorationTasks = [
  {
    title: '明抄本县志残卷',
    batchCode: 'A-03',
    stage: '补纸前',
    risk: 'high',
    owner: '韩澈',
    note: '虫道贯穿标题栏，需先固色。',
  },
  {
    title: '碑帖拓片册页',
    batchCode: 'B-11',
    stage: '控湿中',
    risk: 'medium',
    owner: '陆宁',
    note: '边缘卷曲，可延后压平。',
  },
  {
    title: '戏曲抄本散页',
    batchCode: 'C-02',
    stage: '归档前',
    risk: 'low',
    owner: '周恬',
    note: '等待封套尺寸确认。',
  },
]

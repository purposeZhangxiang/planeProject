const routers = [{
  path: 'fdrData',
  component: () => import('@/components/views/dataCount/fdrData.vue'),
},
  {
    path: 'fdrBight',
    component: () => import('@/components/views/dataCount/fdrBight.vue'),
  },
  {
    path: 'standMessage',
    component: () => import('@/components/views/dataCount/standMessage.vue'),
  },
  {
    path: 'flexibleStatistics',
    component: () => import('@/components/views/dataCount/flexibleStatistics.vue'),
  },
  {
    path: 'subjectStatistics',
    component: () => import('@/components/views/dataCount/subjectStatistics.vue'),
  },
  {
    path: 'loadStatistics',
    component: () => import('@/components/views/dataCount/loadStatistics.vue'),
  },
  {
    path: 'structuralStatistics',
    component: () => import('@/components/views/dataCount/structuralStatistics.vue'),
  },
  {
    path: 'SingleDamage',
    component: () => import('@/components/views/dataCount/SingleDamage.vue'),
  },
  {
    path: 'structuralGroup',
    component: () => import('@/components/views/dataCount/structuralGroup.vue'),
  },
]

export default routers

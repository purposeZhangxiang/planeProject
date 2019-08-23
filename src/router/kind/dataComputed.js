const routers = [
    {
        path: 'dataComputed',
        component: () => import('@/components/views/dataComputed/dataComputed.vue'),
    },
    {
        path: 'dataSync',
        component: () => import('@/components/views/dataComputed/dataSync.vue'),
    },
    {
        path: 'computedResult',
        component: () => import('@/components/views/dataComputed/computedResult.vue'),
    },
]

export default routers
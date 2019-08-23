const routers = [{
    path: 'modalInfo',
    component: () => import('@/components/views/basicData/modalInfo.vue'),
},
{
    path: 'singelModal',
    component: () => import('@/components/views/basicData/singelModal.vue'),
},
{
    path: 'keyComponentInfo',
    component: () => import('@/components/views/basicData/keyComponentInfo.vue'),
},
{
    path: 'keyPosition',
    component: () => import('@/components/views/basicData/keyPosition.vue'),
},
{
    path: 'equivalent',
    component: () => import('@/components/views/basicData/equivalent.vue'),
},
{
    path: 'keyPosEquivalent',
    component: () => import('@/components/views/basicData/keyPosEquivalent.vue'),
},
{
    path: 'flightCourse',
    component: () => import('@/components/views/basicData/flightCourse.vue'),
},
{
    path: 'materialInfo',
    component: () => import('@/components/views/basicData/materialInfo.vue'),
},]

export default routers
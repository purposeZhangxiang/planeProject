const routers = [{
    path: 'departmentManage',
    component: () => import('@/components/views/systemManage/departmentManage.vue'),
},
{
    path: 'menuManagel',
    component: () => import('@/components/views/systemManage/menuManagel.vue'),
},
{
    path: 'flightField',
    component: () => import('@/components/views/systemManage/flightField.vue'),
},
{
    path: 'paramMaintain',
    component: () => import('@/components/views/systemManage/paramMaintain.vue'),
},
{
    path: 'personnelManage',
    component: () => import('@/components/views/systemManage/personnelManage.vue'),
},
{
    path: 'roleManagel',
    component: () => import('@/components/views/systemManage/roleManagel.vue'),
}
]

export default routers

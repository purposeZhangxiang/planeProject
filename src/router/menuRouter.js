import basic from './kind/basicData'
import dataComputed from './kind/dataComputed'
import dataCount from './kind/dataCount'
import reportCount from './kind/reportCount'
import systemManage from './kind/systemManage'

const menuRouter = {
  path: '/home',
  component: () => import('../components/views/home.vue'),
  redirect: { path: '/home/echars' },
  children: [
    //通用组件展示
    {
      path: 'setting',
      component: () => import('../components/views/setting.vue')
    },
    {
      path: 'list',
      component: () => import('../components/views/list.vue'),
    }, {
      path: 'form',
      component: () => import('../components/common/form.vue'),
    },
    {
      path: 'table',
      component: () => import('../components/common/table.vue'),
    },
    {
      path: 'dialog',
      component: () => import('../components/common/dialog.vue'),
    },
    {
      path: 'echars',
      component: () => import('../components/common/echars.vue'),
    },
    {
      path: 'tree',
      component: () => import('../components/common/tree.vue')
    },
    {
      path: 'vuex',
      component: () => import('../components/views/vuex.vue')
    },
    {
      path: 'search',
      component: () => import('../components/common/search.vue')
    },
    ...basic,
    ...dataComputed,
    ...dataCount,
    ...reportCount,
    ...systemManage,
  ]
}
export default menuRouter


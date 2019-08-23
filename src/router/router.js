import Vue from 'vue'
import Router from 'vue-router'
//导航菜单路由
import menuRouter from './menuRouter';


Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: { path: '/login' }
    },
    {
      path: '*',
      redirect: { path: '/404' }
    },
    {
      path: '/login',
      component: () => import('../components/views/login.vue')
    },
    {
      path: '/404',
      component: ()=>import('../components/views/404.vue')
    },
    menuRouter
  ]
})

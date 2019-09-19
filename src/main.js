import Vue from 'vue'
import App from './App.vue'
import router from './router/router'
import store from './store/store'
import echarts from "echarts";


//全局导入ElementUI模块和CSS样式并使用
import Element from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(Element);

//自定义全局css
import './assets/style.css'

import {
  Loading
} from 'element-ui'
import axios from "axios";
let loading;

function startLoading() { //使用Element loading-start 方法
  loading = Loading.service({
    target: document.getElementsByClassName('route')[0],
    lock: true,
    text: '拼命加载中...',
    fullscreen: false
  })
}

function endLoading() { //使用Element loading-close 方法
  loading.close()
}
//请求数据拦截器
// axios.interceptors.request.use(request => {
//   startLoading();
//   return request
// }, err => {
//   return Promise.reject(err);
// });
// axios.interceptors.response.use(response => {
//   // this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
//   //   loading.close();
//   // });
//   return response
// }, err => {
//   // this.$nextTick(() => {
//   //   loading.close();
//   // });
//   return Promise.reject(err);
// });

//基于ElementUI的表单生成器
// import FormMaking from 'form-making'
// import 'form-making/dist/FormMaking.css'

// Vue.use(FormMaking)

//引入font-face
import './assets/font_face/iconfont.css'
import {
  request
} from 'https';
axios.interceptors.request.use(config => {
    if (sessionStorage.getItem('token')) {
      config.headers["Authorization"] = "Bearer " + sessionStorage.getItem('token');
    } else {
      router.push({
        path: '/login'
      });
      return;
    }
    return config
  },
  err => Promise.reject(err));

Vue.prototype.$echarts = echarts;
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
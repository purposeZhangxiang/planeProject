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



//基于ElementUI的表单生成器
// import FormMaking from 'form-making'
// import 'form-making/dist/FormMaking.css'

// Vue.use(FormMaking)

//引入font-face
import './assets/font_face/iconfont.css'

Vue.prototype.$echarts = echarts;
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

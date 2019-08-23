import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

//独立管理引入
import state from './state'
import mutations from './mutations'
import actions from './actions'
import getters from './getters'




export default new Vuex.Store({
  /**
   * @param {state} 共享状态
   * @param {mutations} 共享方法(主要修改state数据)
   * @param {actions} 类似mutation 不是直接改变state 而是提交mutation
   * @param {getters} 对state 进行计算/过滤(!!不改变原state中的数据)
   * */
  state,
  mutations,
  actions,
  getters
})

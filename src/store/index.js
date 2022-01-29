import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user_configuration: {
      calories_target:2500
    }
  },
  mutations: {
    set_user_configuration(state, config){
      state.user_configuration = config
    }
  },
  actions: {
  },
  modules: {
  }
})

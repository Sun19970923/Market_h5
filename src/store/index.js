"use strict";
import Vue from 'vue'
import Vuex from 'vuex'

// import { createStore } from "vuex";
import VuexPersist from "vuex-persist";
import state from "./state";
import actions from "./actions";
import getters from "./getters";
import mutations from "./mutations";
Vue.use(Vuex)

const vuexLocalStorage = new VuexPersist({
  key: "vuex",
  storage: window.localStorage,
  reducer: state => ({ isLogin:state.isLogin,user: state.user,categorys:state.categorys })
});
const store = new Vuex.Store({
	// modules: {
    plugins: [vuexLocalStorage.plugin],
		state,
		actions,
		getters,
		mutations,
	// }
})

/*
const vuexLocalStorage = new VuexPersist({
  key: "vuex",
  storage: window.localStorage,
  reducer: state => ({ user: state.user })
});

const store = createStore({
  plugins: [vuexLocalStorage.plugin],
  state,
  actions,
  getters,
  mutations
});
*/

export default store;

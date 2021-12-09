import Vue from 'vue'
import App from './App'
import store from '@/store'
import api from "@/api/index.js";
import tools from "@/util/tools.js";
import web3 from "@/util/web3/index.js";
import i18n from "./i18n/i18n.js";
import sdk from '@/util/sdk/index.js';

import truffle_contract from 'truffle-contract';

import '@/static/font/font.css';
import * as filters from '@/filters'
import '@/components.js'
import "@/styles/myicon/iconfont.css";

import VueClipboard from 'vue-clipboard2'
import Popover from 'vue-js-popover'
import uView from "uview-ui";
Vue.use(uView);
Vue.use(Popover)

Vue.use(VueClipboard)
Vue.config.productionTip = false

App.mpType = 'app'
Vue.prototype.$api = api;
Vue.prototype.$tools = tools;
Vue.prototype.$web3 = web3;
Vue.prototype.$filters=filters;
Vue.prototype.$store=store;
Vue.prototype.$sdk=sdk;
Vue.prototype._i18n=i18n;


const app = new Vue({
  store,
  i18n,
  ...App
})
app.$mount()


export default app;


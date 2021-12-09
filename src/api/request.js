import axios from 'axios'
import app from '@/main';

import tools from '@/util/tools.js'
import store from '@/store'
// create an axios instance
const service = axios.create({
  timeout: 50000, // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    if (!config.headers['Finger-Nft-Token']) {
      config.headers['Finger-Nft-Token'] = `${window.localStorage.getItem(
        'Authorization'
      ) || ''}`;
    }
    return config;
  },
  err => Promise.reject(err)
)


// response interceptor
service.interceptors.response.use(
  response => {
    const res = response.data
    if (res.errno === 501) {
      if(!store.state.connected){
        tools.messageConnect();
      }else{
        store.dispatch("signLogin");
      }
      // tools.message("请登录", "error");
      return res;
      //  return Promise.reject('error')
    } else if (res.errno === 502) {
      tools.message(app.$t('global.err502'), "error");
      return res;
      //  return Promise.reject('error')
    } if (res.errno === 401) {
      tools.message(app.$t('global.errParams'), "error");
      return res;
      //  return Promise.reject('error')
    } if (res.errno === 402) {
      tools.message(app.$t('global.errParams'), "error");
      return res;
      // return Promise.reject('error')
    } else if (res.errno !== 0) {
      // 非5xx的错误属于业务错误，留给具体页面处理
      return res;
    } else {
      return res;
    }
  }, error => {
    return Promise.reject(error)
  })

export default service

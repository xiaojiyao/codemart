import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n
import '@/styles/index.scss' // global css
import echarts from 'echarts'

import * as filters from './filters'



import App from './App'
import router from './router'
import store from './store'
import axios from 'axios'
import '@/icons' // icon
axios.defaults.baseURL = process.env.NODE_ENV === 'production' ? '' : '/api/'
Vue.use(ElementUI, {
  locale
})

Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false
Vue.prototype.$http = axios
Vue.prototype.$echarts = echarts

router.beforeEach((to, from, next) => {
  // to: Route: 即将要进入的目标 路由对象
  // from: Route: 当前导航正要离开的路由
  // next: Function: 一定要调用该方法来 resolve 这个钩子。执行效果依赖 next 方法的调用参数。
  // console.log(to);
  // const nextRoute = ['home', 'exportList', 'productList', 'usersList', 'skuReprot'];
  store.dispatch('getUserInfo');
  let UserInfo = store.state.user.user;
  // 未登录状态；当路由到nextRoute指定页时，跳转至login
  if (to.meta.noNeedAuth) {
    next()
  } else {
    if (!UserInfo.id) {
      next('/login');
    } else {
      next()
    }
  }
})

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})

import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n
import '@/styles/index.scss' // global css
import echarts from 'echarts'



import App from './App'
import router from './router'
import store from './store'
import axios from 'axios'
import '@/icons' // icon
import '@/permission' // permission control
axios.defaults.baseURL = process.env.NODE_ENV === 'production' ? '' : '/api/'
Vue.use(ElementUI, {
  locale
})

Vue.config.productionTip = false
Vue.prototype.$http = axios
Vue.prototype.$echarts = echarts

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
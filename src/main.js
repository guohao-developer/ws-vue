import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import './assets/css/global.css'
import * as echarts from 'echarts'
// 引入 socket_service
import SocketService from './utils/socket_service'
import VScaleScreen from 'v-scale-screen'
// 将自动注册所有组件为全局组件
import dataV from '@jiaminghi/data-view'

Vue.use(dataV)
Vue.use(VScaleScreen)
SocketService.Instance.connect()
Vue.prototype.$socket = SocketService.Instance
// 把echarts挂载到 Vue原型上，以便在全局访问
Vue.prototype.$echarts = echarts
Vue.config.productionTip = false
// 请求基准路径配置
axios.defaults.baseURL = 'http://127.0.0.1:3000/api/'
// axios挂载到Vue原型对象
Vue.prototype.$http = axios
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

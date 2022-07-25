import Vue from 'vue'
// 第三方css库 让不同的浏览器的标签一致
import 'normalize.css/normalize.css' //  CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// 国际化
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n
// 公共样式
import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control 权限控制

// 使用虚假路由
/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
// if (process.env.NODE_ENV === 'production') {
//   const { mockXHR } = require('../mock')
//   mockXHR()
// }
// import '@/directive'
// set ElementUI lang to EN
// Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
Vue.use(ElementUI)

Vue.config.productionTip = false
// 什么时候使用插件 ？我们封装了一堆的公共的组件共同时使用的时候 为了同事使用起来方便
import components from '@/components'
// 会自动执行install方法
Vue.use(components)

import * as obj from '@/directive'
Object.keys(obj).forEach(item => {
  Vue.directive(item, obj[item])
})
import * as filters from '@/filters'
Object.keys(filters).forEach(item => {
  Vue.filter(item, filters[item])
})
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})

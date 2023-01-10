import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'

// set ElementUI lang to EN
// 如果想要英文版 element-ui，按如下方式声明
// Vue.use(ElementUI, { locale })
import 'element-ui/lib/theme-chalk/index.css'
//import locale from 'element-ui/lib/locale/lang/en' // lang i18n
import i18n from '@/lang'
import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // 加载进度条控制
import CheckPermission from '@/mixin/checkPermission'
import * as directives from '@/directives'
// 注册自定义指令
// 遍历所有的导出的指令对象 完成自定义全局注册
Object.keys(directives).forEach(key => {
  // 注册自定义指令
  Vue.directive(key, directives[key])
})
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

// 设置element为当前的语言
Vue.use(ElementUI, {
  i18n: (key, value) => i18n.t(key, value)
})

import * as filters from '@/api/filters' // 引入工具类
// 注册全局的过滤器
Object.keys(filters).forEach(key => {
  // 注册过滤器
  Vue.filter(key, filters[key])
})

import Component from '@/components'
Vue.use(Component) // 注册自己的插件
// 全局混入检查对象
Vue.mixin(CheckPermission) // 表示所有的组件都拥有了检查的方法


Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})

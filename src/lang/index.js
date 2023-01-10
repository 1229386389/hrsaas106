import Vue from 'vue'
import Cookie from 'js-cookie'
import VueI18n from 'vue-i18n'//国际化包
import enLocale from 'element-ui/lib/locale/lang/en'//英文包
import zhLocale from 'element-ui/lib/locale/lang/zh-CN'//中文包
import elementJA from 'element-ui/lib/locale/lang/ja' // 日文包
import customZH from './zh.js' // 自定义语言包
import customEN from './en.js' // 自定义语言包
import customJA from './ja.js' // 自定义语言包
Vue.use(VueI18n) // 全局注册国际化包
const messages = {
  en: {
    message: 'hello',
    ...enLocale ,// 或者用 Object.assign({ message: 'hello' }, enLocale)
	...customEN
  },
  zh: {
    message: '你好',
    ...zhLocale, // 或者用 Object.assign({ message: '你好' }, zhLocale)
	...customZH
  },
    ja: {
      ...elementJA,
	  ...customJA
    }
}
// Create VueI18n instance with options
export default new VueI18n({
  locale: Cookie.get('language')||'zh' , // 通过Cookie获取之前切换时缓存的
  messages, // set locale messages
})
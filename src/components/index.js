// 该文件负责所有的公共的组件的全局注册   Vue.use
//工具栏
import PageTools from './PageTools'
//excel上传
import UploadExcel from './UploadExcel'
//图片上传
import ImageUpload from './ImageUpload'
//打印
import Print from 'vue-print-nb'
//全屏
import ScreenFull from './ScreenFull'
//动态主题
import ThemePicker from './ThemePicker'
//国际化
import lang from './lang'
//多页签组件
import TagsView from './TagsView'
export default {
  install(Vue) {
    //  注册全局的通用栏组件对象
    Vue.component('PageTools', PageTools)
	// 注册导入excel组件
	 Vue.component('UploadExcel', UploadExcel) //excel上传组件
	   Vue.component('ImageUpload', ImageUpload) // 注册导入上传组件
		 Vue.use(Print)
		 Vue.component('ScreenFull', ScreenFull) // 注册全屏组件
		 Vue.component('ThemePicker', ThemePicker) 
		 Vue.component('lang', lang) 
		 Vue.component('TagsView', TagsView) 
  }
}
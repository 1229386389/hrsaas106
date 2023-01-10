import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken ,removeToken,setTime,getTime} from '@/utils/auth'
import router from '@/router/index.js'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url 使用开发环境中的baseurl
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 15000 // 定义15s延迟
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    // do something before request is sent

    if (store.getters.token) {
	 //如果有请求头则检验其是否过期 主动处理token失效
	 //token过期了
	 if(isTokenPast()){
		 store.dispatch('user/logout')
	    router.push('/login')
		 return Promise.reject(new Error('token超时了'))
	 }
      config.headers['Authorization'] = 'Bearer '+store.getters.token
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

//  响应拦截器主要处理 返回的**`数据异常`** 和**`数据结构`**问题
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
 // axios默认加了一层data
  const { success, message, data } = response.data
  //   要根据success的成功与否决定下面的操作
  if (success) {
    return data
  } else {
    // 业务已经错误了 还能进then ? 不能 ！ 应该进catch
    Message.error(message) // 提示错误消息
    return Promise.reject(new Error(message))
  }
}, error => {
 //被动处理token失效
    // error 信息 里面 response的对象
    if (error.response && error.response.data && error.response.data.code === 10002) {
      // 当等于10002的时候 表示 后端告诉我token超时了
      store.dispatch('user/logout') // 登出action 删除token
      router.push('/login')
    } else {
      Message.error(error.message) // 提示错误信息
    }
    return Promise.reject(error)
  
}
)

//判断token是否过期
function isTokenPast(){
	let nowTime=Date.now()
	return (nowTime-getTime)/1000>10
}
export default service

import {getToken,setToken,removeToken} from '@/utils/auth.js'
import {login,getInfo,getUserDetailById} from '@/api/user.js'
import router from '@/router'
// 状态
const state = {//getToken()
	token:getToken(),
	userResult:{}
}
// 修改状态
const mutations = {
	//设置token
	setToken(state,token){
		state.token=token
		setToken(token)
	},
	removeToken(state){
		state.token=null
		removeToken()
	},
	//设置用户信息
	setUserInfo(state,data){
		state.userResult={ ...data } // 用 浅拷贝的方式去赋值对象 因为这样数据更新之后，才会触发组件的更新
	},
	  // 删除用户信息
	  removeUserInfo(state) {
	    state.userResult = {}
	  },
}
// 执行异步
const actions = {
	//设置异步登陆
	async login(context,data){
		let res= await login(data).then(res=>{return res})
			      // 现在有用户token
			      // actions 修改state 必须通过mutations
				  //通过响应拦截器获取的res直接就是数据
			    context.commit('setToken',res)  
	},
	 logout(context){
		 //删除token
		context.commit('removeToken')
		//删除用户信息
		context.commit('removeUserInfo')
		//跳转登陆页面
		 router.push('/login')
	 },
	 async getInfo(context,data){
		 //获取基本信息
		 let res=await getInfo().then(res=>{return res})
		 //获取其他的基本信息（包括图片）
		 let res2=await getUserDetailById(res.userId)
		 //合并数据
		 let userInfo={...res,...res2} 
		 //提交mutations
         context.commit('setUserInfo',userInfo)
		 return userInfo
	 }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}

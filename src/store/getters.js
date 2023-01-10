const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token, // 建立token的快捷访问
  name: state => state.user.userResult.username, // 建立对于用户名的快捷访问
  userId: state => state.user.userResult.userId, // 建立对于用户名的快捷访问
	staffPhoto:state=>state.user.userResult.staffPhoto,//用户照片
	 companyId: state => state.user.userResult.companyId ,//公司id
	  routes: state => state.permission.routes // 导出当前的路由
}
export default getters

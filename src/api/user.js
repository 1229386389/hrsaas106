import request from '@/utils/request'
//登陆
export function login(data) {
  return request({
    url: '/sys/login',
    method: 'POST',
    data
  })
}
//获取用户基本信息
export function getInfo() {
  return request({
    url: '/sys/profile',
    method: 'POST'
  })
}
//获取员工基本信息（图片）
export function getUserDetailById(id){
	return request({
		url:`/sys/user/${id}`
	})
}

export function logout() {
  
}

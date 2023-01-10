import request from '@/utils/request'
//获取角色
export function getRole(params) {
  return request({
    url: '/sys/role',
	params
  })
}
//查询企业信息
export function getCompany(id) {
  return request({
    url: `/company/${id}`,
  })
}
//删除角色
export function delRole(id) {
  return request({
    url: `/sys/role/${id}`,
	method:'DELETE'
  })
}
//id获取角色详情
export function getRoleId(id) {
  return request({
    url:`/sys/role/${id}`
  })
}
//id更新角色详情
export function EditRoleId(id,data) {
  return request({
    url:`/sys/role/${id}`,
	method:'PUT',
	data
  })
}
//更新角色
export function addRole(data) {
  return request({
    url:`/sys/role`,
	method:'POST',
	data
  })
}
// 给角色分配权限
export function assignPerm(data) {
  return request({
    url: '/sys/role/assignPrem',
    method: 'put',
    data
  })
}
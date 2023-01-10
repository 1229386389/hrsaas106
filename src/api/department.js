import request from '@/utils/request'
//查询企业部门列表
export function getAllCompany(){
	return request({
		url:'/company/department'
	})
}
//新增部门
export function addAllCompany(data){
	return request({
		url:'/company/department',
		method:'POST',
		data
	})
}
//修改部门
export function alterAllCompany(id,data){
	return request({
		url:`/company/department/${id}`,
		method:'PUT',
		data
	})
}
//删除部门
export function removeCompany(id){
	return request({
		url:`/company/department/${id}`,
		method:'DELETE',
	})
}
//id查询部分详情
export function getCompany(id){
	return request({
		url:`/company/department/${id}`,
		method:'GET',
	})
}
<template>
	<el-row type="flex" justify="space-between" align="middle" style="height: 40px;width: 100%">
    <el-col>
      <!-- 名称应该变成 对应的节点中的name -->
      <span>{{ treeNode.name }}</span>
    </el-col>
    <el-col :span="4">
      <el-row type="flex" justify="end">
        <!-- 两个内容 -->
        <el-col>{{ treeNode.manager }}</el-col>
        <el-col>
          <!-- 下拉菜单 element -->
          <el-dropdown @command="handleCommand">
            <span>
              操作<i class="el-icon-arrow-down" />
            </span>
            <!-- 下拉菜单 -->
            <el-dropdown-menu slot="dropdown" >
              <el-dropdown-item command='add'>添加子部门</el-dropdown-item>
              <el-dropdown-item v-if="isRoot" command='alter'>编辑部门</el-dropdown-item>
              <el-dropdown-item v-if="isRoot" command="del">删除部门</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
import {removeCompany} from '@/api/department.js'
export default{
	props:{
		treeNode:{
			required:true,
			type:Object
		},
		isRoot:{//是否显示编辑和删除
			type:Boolean,
			default:true
		}
	},
	methods:{
		 handleCommand(command) {//监听下拉菜单点击事件 command为点击项command的值
		        if(command==='add'){
					//添加事件
					this.$emit('add',this.treeNode)
				}else if(command==='alter'){
					//编辑事件
					this.$emit('alter',this.treeNode)
				}else{
					//删除事件
					this.$confirm('是否确认删除','删除').then(()=>{
						//调用删除接口并传值回父组件
						return removeCompany(this.treeNode.id).then(res=>{
							//调用父组件方法更新
							this.$emit('delDepts')
						   this.$message('删除成功')
						})
					})
				}
		      }
	}
} 
</script>

<style>
</style>
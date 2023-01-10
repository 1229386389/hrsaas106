<template>
  <div v-loading="loading" class="dashboard-container">
      <div class="app-container">
        <!-- 实现页面的基本布局 -->
        <el-card class="tree-card">
          <!-- 用了一个行列布局 -->
          <!-- 缺少treeNode -->
		  <!-- 树形组件 -->
         	   <!--放置一个属性   这里的props和我们之前学习的父传子 的props没关系
		  props传一个对象，可以指定数据中属性名的对应
		  比如对象中标签属性名为tag 可以将props中的label：tag 使其成为一个映射关系
		  --> 
		 <tree-tools :treeNode="company" :isRoot='false' @delDepts='showCompany' @add='addCompany' @alter='alterCompany'/>
          <el-tree :data="departs" :props="defaultProps" :default-expand-all="true">
		<!-- 传入内容 插槽内容 会循环多次 有多少节点 就循环多少次 -->
		<!-- 作用域插槽 slot-scope="obj" 接收传递给插槽的数据   data 每个节点的数据对象-->
			<tree-tools  slot-scope="{node,data}" :treeNode="data" @delDepts='showCompany' @add='addCompany' @alter='alterCompany'/>
          </el-tree>
        </el-card>
      </div>
	 <!-- 添加和编辑弹框 -->
	 
	     <addTool :showDialog.sync='showDialog' :node='Node' :alterNode.sync='alterNode' @addDepts='showCompany' v-if="showDialog"></addTool>
	  
    </div>
</template>

<script>
import treeTools from './components/tree-tool.vue'
 import addTool from './components/add-tool.vue'
import {getAllCompany} from '@/api/department.js'
import {tranListToTreeData} from '@/utils'//数据转为树
export default {
data(){
	return {
		company:{//最顶层的
			name:'传智',
			manager:'斯大林猫'
		},
		defaultProps:{
			label:'name',//将name映射为label
		},
		departs:[//顶层之下的数据
			
		],
		showDialog:false,//控制弹窗
		loading:false,//控制加载
		Node:{},//添加节点
		alterNode:false//是否编辑节点
	}
},
components:{
	treeTools,
	addTool
},
created(){
	this.showCompany()
	
},
props:{
},
methods:{
	//获取并渲染部门数据
	async showCompany(){
		//开启加载条 
	this.loading=true	
	let res=await getAllCompany()
	this.company={
		name:res.companyName,
		manager:'管理者',
		id:''//防止添加时传id为undefined报错
	}
	//使用工具类中的递归函数把数据变成树状数组
	this.departs=tranListToTreeData(res.depts,'')
	//关闭加载条
	this.loading=false
	},
	alterCompany(treeNode){
		this.showDialog=true
		this.Node=treeNode
		this.alterNode=true
		
	},
	addCompany(treeNode){
		this.showDialog=true
		this.Node=treeNode
	}
}
}
</script>

<style>

</style>

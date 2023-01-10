<template>
  <!-- 新增部门的弹层 -->
  <el-dialog :title="alterNode ? '编辑部门':'新增部门'"  :visible="showDialog" @close='btnCancel'>
    <!-- 表单组件  el-form   label-width设置label的宽度   -->
    <!-- 匿名插槽 -->
    <el-form label-width="120px" :model='formData' :rules='fromRules' ref="departmentsform">
      <el-form-item label="部门名称" prop='name'>
        <el-input style="width:80%" placeholder="3-5个字符" v-model='formData.name'/>
      </el-form-item>
      <el-form-item label="部门编码" prop='code'>
        <el-input style="width:80%" placeholder="1-50个字符" v-model='formData.code'/>
      </el-form-item>
      <el-form-item label="部门负责人" prop='manager'>
        <el-select style="width:80%" placeholder="请选择" v-model='formData.manager' @focus="getEmployeeSimple" >
		<el-option
		      v-for="item in peoples"
		      :key="item.id"
		      :label="item.username"
		      :value="item.username">
		    </el-option>
		</el-select>
      </el-form-item>
      <el-form-item label="部门介绍" prop='introduce'>
        <el-input style="width:80%" placeholder="1-300个字符" type="textarea" :rows="3" v-model='formData.introduce'/>
      </el-form-item>
    </el-form>
    <!-- el-dialog有专门放置底部操作栏的 插槽  具名插槽 -->
    <el-row slot="footer" type="flex" justify="center">
      <!-- 列被分为24 -->
      <el-col :span="6">
        <el-button type="primary" size="small" @click="btnOk">确定</el-button>
        <el-button size="small" @click="btnCancel">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import {getAllCompany,addAllCompany,alterAllCompany} from '@/api/department.js' 
import {getEmployeeSimple} from '@/api/employees.js' 
export default{
	props:{
		showDialog:{
			type:Boolean,
			default:false
		},
		node:{
			type:Object,
			default:null
		},
		alterNode:{
			type:Boolean,
			default:false
		}
	},
	data(){
		//自定义规则
				//部门名称的自定义规则
				var checkName=async(rule, value, callback)=>{
					const {depts}=await getAllCompany()
					if(this.alterNode){//编辑模式下名字校验规则 添加的名字除自己外不能和同pid（父部门）下部门重复
						var isRepeat=depts.filter(item=>{
							//用id搜索同级部门
							return this.node.pid===item.pid
						}).some(item=>{
							//查询同级部门下是否有相同名字部门
							return  item.id!=this.node.id && item.name===value
						})
					}else{//新增模式下的名字校验规则 添加的名字不能和同pid（父部门）下部门重复
						var isRepeat=depts.filter(item=>{
						//用id搜索同级部门
						return this.node.id===item.pid
					}).some(item=>{
						//查询同级部门下是否有相同名字部门
						return item.name===value
					})
					}
					isRepeat ? callback(new Error(`该部门下已经有${value}部门`)) : callback()	
				};
				//编码自定义规则
				var checkCode=async(rule, value, callback)=>{
					const {depts}=await getAllCompany()
					if(this.alterNode){//编辑模式
						var isRepeat=depts.filter(item=>{
							//用id搜索同级部门
							return this.node.pid===item.pid
						}).some(item=>{
							//查询同级部门下是否有相同名字部门
							return item.id!=this.node.id && item.code===value 
						})
					}else{//添加模式
						var isRepeat=depts.filter(item=>{
						//用id搜索同级部门
						return this.node.id===item.pid
					}).some(item=>{
						//查询同级部门下是否有相同名字部门
						return item.code===value
					})
					}
					
					isRepeat ? callback(new Error(`编码重复`)):callback()	
				};
		return {
			 formData: {
			        name: '', // 部门名称
			        code: '', // 部门编码
			        manager: '', // 部门管理者
			        introduce: '' // 部门介绍
			      },
				fromRules:{//非自定义验证规则
					       name: [{ required: true, message: '部门名称不能为空', trigger: 'blur' },
					          { min:3, max:10, message: '部门名称要求3-10个字符', trigger: 'blur' },
							  { trigger: 'blur', validator: checkName}],
					        code: [{ required: true, message: '部门编码不能为空', trigger: 'blur' },
					          { min: 1, max: 50, message: '部门编码要求1-50个字符', trigger: 'blur' },
							  { validator: checkCode, trigger: 'blur'}],
					        manager: [{ required: true, message: '部门负责人不能为空', trigger: 'blur' }],
					        introduce: [{ required: true, message: '部门介绍不能为空', trigger: 'blur' },
					          { trigger: 'blur', min: 1, max: 300, message: '部门介绍要求1-50个字符' }]
				},
				peoples:[]// 接收获取的员工简单列表的数据
				
		}
	},
	created(){
			if(this.alterNode){//若为编辑状态则将表单赋值
				this.formData=this.node
			}
	},
	methods:{
		btnCancel(){
			this.$refs.departmentsform.resetFields() // 重置校验字段
			//父组件更新props中传过来的数据，避免子组件直接修改父组件中数据 
			//父组件传props时要带 名.sync=名
			//可以直接忽略父组件方法和监听，直接修改父组件的showDialog
			this.$emit('update:alterNode', false)
			this.$emit('update:showDialog', false)
		},
		async getEmployeeSimple(){
			this.peoples=await getEmployeeSimple()
		},
		btnOk(){
			this.$refs.departmentsform.validate(async isOk=>{//validate为触发表单校验方法 通过校验时isok为true执行回调
				if(isOk){
					if(this.alterNode){//编辑状态
						//this.formData为表单数据
						await alterAllCompany(this.node.id,{...this.formData,pid:this.node.pid})
						 this.$message('修改成功')
					}else{//添加状态
							//this.formData为表单数据
				await addAllCompany({...this.formData,pid:this.node.id})
				 this.$message('添加成功')
					}
				
				 //触发父组件方法更新视图
				 this.$emit('addDepts')
				 this.$emit('update:showDialog', false)
				}
			})
		}
	}
}
</script>

<style>
</style>
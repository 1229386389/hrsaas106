<template>
	<div class="dashboard-container">
	    <div class="app-container">
	      <el-card>
	        <el-tabs>
	          <el-tab-pane label="登录账户设置">
	
	            <!-- 放置表单 -->
	            <el-form label-width="120px" style="margin-left: 120px; margin-top:30px" ref='userForm' :model='userInfo' :rules="rules">
	              <el-form-item label="姓名:" prop='username'>
	                <el-input style="width:300px" v-model='userInfo.username'/>
	              </el-form-item>
	              <el-form-item label="密码:" prop='password2'>
	                <el-input style="width:300px" type="password" v-model='userInfo.password2'/>
	              </el-form-item>
	              <el-form-item>
	                <el-button type="primary" @click='saveUserDetailById'>更新</el-button>
	              </el-form-item>
	            </el-form>
	          </el-tab-pane>
	          <el-tab-pane label="个人详情" >
				   <el-row type="flex" justify="end">
				              <el-tooltip content="打印个人基本信息">
				                  <router-link :to="`/employees/print/${userId}?type=personal`">
				                    <i class="el-icon-printer" />
				                  </router-link>
				               </el-tooltip>
				    </el-row>
				  <!-- 放置个人详情 -->
				              <component :is="userComponent" />
				              <!-- <user-info /> -->
			  </el-tab-pane>
	          <el-tab-pane label="岗位信息" >
				   <el-row type="flex" justify="end">
				                <el-tooltip content="打印岗位信息">
				                  <router-link :to="`/employees/print/${userId}?type=job`">
				                    <i class="el-icon-printer"  />
				                  </router-link>
				                </el-tooltip>
				      </el-row>
				  <component :is="JobComponent" />
			  </el-tab-pane>
	        </el-tabs>
	      </el-card>
	    </div>
	  </div>
</template>

<script>
import {getUserDetailById} from '@/api/user.js'
import {saveUserDetailById} from '@/api/employees.js'
import userInfo from './components/user-info.vue'
import jobInfo from './components/job-info.vue'
	export default{
		data(){
			return {
				 userId: this.$route.params.id, // 这样可以后面直接通过 this.userId进行获取数据
				 userInfo:{
					 username:'',
					 password2:''//接口中读取的是后端的密文，我们并不能解密，所以当我们没有任何修改就保存时，会校验失败，因为密文超过了规定的12位长度，为了真的修改密码，我们设定了一个临时的字段 **password2**，用它来存储我们的修改值，最后保存的时候，把**password2**传给**password**
				 },
				  rules: {
				         username: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
				         password2: [{ required: true, message: '密码不能为空', trigger: 'blur' },
				           { min: 6, max: 9, message: '密码长度6-9位', trigger: 'blur' }]
				       },
				userComponent:'userInfo',//方便动态组件component的映射切换
				JobComponent:'jobInfo'
			}
		},
		 created(){
			 this.getUserDetailById()
		},
		methods:{
			async getUserDetailById(){
				this.userInfo=await getUserDetailById(this.userId)
			},
			async saveUserDetailById(){
			try{
				await this.$refs.userForm.validate()
				await saveUserDetailById({...this.userInfo,password:this.userInfo.password2})//最后保存的时候，把**password2**传给**password** // 将新密码的值替换原密码的值
				this.$message('修改成功')
				this.getUserDetailById()
			}catch(err){
				console.log(err)
			}
			}
		},
		components:{
			userInfo,
			jobInfo
		}
	}
</script>

<style>
</style>
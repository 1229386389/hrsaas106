<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs>
          <!-- 放置页签 -->
          <el-tab-pane label="角色管理">
            <!-- 新增角色按钮 -->
            <el-row style="height:60px">
              <el-button
                icon="el-icon-plus"
                size="small"
                type="primary"
				@click='showDialog=true'
              >新增角色</el-button>
            </el-row>
            <!-- 表格 -->
                   <el-table border="" :data="roleList">
                       <el-table-column align="center" type="index" label="序号" width="120" />
                       <el-table-column align="center" prop="name" label="名称" width="240" />
                       <el-table-column align="center" prop="description" label="描述" />
                       <el-table-column align="center" label="操作">
						     <template slot-scope="scope">
						 <el-button size="small" type="success" @click="assignPerm(scope.row.id)">分配权限</el-button>
                         <el-button size="small" type="primary" @click="Edit(scope.$index, scope.row)">编辑</el-button>
                         <el-button size="small" type="danger"  @click="Del(scope.$index, scope.row)" >删除</el-button> 
						     </template>
                       </el-table-column>
                    </el-table>
            <!-- 分页组件 -->
            <el-row type="flex" justify="center" align="middle" style="height: 60px">
              <!-- 分页组件 -->
              <el-pagination layout="prev,pager,next"
			  :current-page="page.page"
			  :page-size="page.pagesize"
			  :total="page.total"
			   @current-change='pageChange'/>
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="公司信息">
            <el-alert
              title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改"
              type="info"
              show-icon
              :closable="false"
            />
           <el-form label-width="120px" style="margin-top:50px">
                          <el-form-item label="公司名称">
                            <el-input v-model="formData.name" disabled style="width:400px" />
                          </el-form-item>
                          <el-form-item label="公司地址">
                            <el-input v-model="formData.companyAddress" disabled style="width:400px" />
                          </el-form-item>
                          <el-form-item label="邮箱">
                            <el-input v-model="formData.mailbox" disabled style="width:400px" />
                          </el-form-item>
                          <el-form-item label="备注">
                            <el-input v-model="formData.remarks" type="textarea" :rows="3" disabled style="width:400px" />
                          </el-form-item>
             </el-form>
          </el-tab-pane>

        </el-tabs>
      </el-card>
	  <!-- 编辑弹层 -->
	  <el-dialog title="编辑弹层" :visible="showDialog" @close="btnCancel">
	        <el-form ref="roleForm" :model="roleForm" :rules="rules" label-width="120px">
	          <el-form-item label="角色名称" prop="name">
	            <el-input v-model="roleForm.name" />
	          </el-form-item>
	          <el-form-item label="角色描述">
	            <el-input v-model="roleForm.description" />
	          </el-form-item>
	        </el-form>
	        <!-- 底部 -->
	        <el-row slot="footer" type="flex" justify="center">
	          <el-col :span="6">
	            <el-button size="small" @click="btnCancel">取消</el-button>
	            <el-button size="small" type="primary" @click="btnOK">确定</el-button>
	          </el-col>
	        </el-row>
	 </el-dialog>
	 <!-- 新增角色权限 -->
		<el-dialog title="分配权限" :visible="showPermDialog" @close="btnPermCancel">
		      <!-- 权限是一颗树 -->
		      <!-- 将数据绑定到组件上 -->
		      <!-- check-strictly 如果为true 那表示父子勾选时  不互相关联 如果为false就互相关联 -->
		      <!-- id作为唯一标识 -->
		      <el-tree
		        ref="permTree"
		        :data="permData"
		        :props="defaultProps"
		        :show-checkbox="true"
		        :check-strictly="true"
		        :default-expand-all="true"
		        :default-checked-keys="selectCheck"
		        node-key="id"
				:highlight-current="true"
		      />
		      <!-- 确定 取消 -->
		      <el-row slot="footer" type="flex" justify="center">
		        <el-col :span="6">
		          <el-button type="primary" size="small" @click="btnPermOK">确定</el-button>
		          <el-button size="small" @click="btnPermCancel">取消</el-button>
		        </el-col>
		      </el-row>
		    </el-dialog>
    </div>
  </div>
</template>

<script>
import {getRole,getCompany,delRole,getRoleId,EditRoleId,addRole,assignPerm} from '@/api/setting.js'
import {mapGetters} from 'vuex'
 import { tranListToTreeData } from '@/utils'
import { getPermissionList } from '@/api/permission'
export default {
 data(){
	 return {
		 roleList:[],//角色信息列表
		 page:{
			 page:1,
			 pagesize:10,
			 total:0//记录角色总数
		 },
		 formData:{//公司信息
	      name:'',
		  remarks:'',
		  companyAddress:'',
		  mailbox:''
		 },
		 showDialog:false,//编辑弹层
		 roleForm:{
			 name:'',
			 description:''
		 },
		 rules:{
			  name: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }]
		 },
		 showPermDialog:false,//分配权限弹窗
	  permData:[],//接受权限数据
	  defaultProps: {//配置树的对象名映射
	          label: 'name'
	        },
		selectCheck: [], // 定义一个数组来接收 已经选中的节点
		roleId: null // 用来记录分配角色的id
	 }
 },
 computed:{
	 ...mapGetters(['companyId'])
 },
 created(){
	 this.getCompany()
	 this.getRole()
 },
 methods:{
	 async getRole(){//获取角色列表
		 const res=await getRole(this.page)
		 this.page.total=res.total
		 this.roleList=res.rows
	 },
	 pageChange(newPage){//页码变换时
		 this.page.page=newPage
		 this.getRole()
	 },
	 async getCompany(){//获取公司信息
		 this.formData=await getCompany(this.companyId)
	 },
	async Edit(index,row){//编辑角色
		 this.showDialog=true
		 this.roleForm=await getRoleId(row.id)//调用接口获取信息填充编辑弹层
	 },
	 async Del(index,row){//删除角色
	 try{
		 await this.$confirm('确认关闭？')//点击确认才会执行下面的
		 await delRole(row.id)//删除接口调用
		 this.getRole()//重新渲染
		 this.$message('删除成功')
	 }catch(error){
		 console.log(error)
	 }	 
	 },
	 btnCancel(){
		    this.roleForm = {
		         name: '',
		         description: ''
		       }
		       // 移除校验
		//this.$refs.roleForm.resetFields()
		  this.showDialog=false
	 },
	async btnOK(){
		try{
			await this.$refs.roleForm.validate()//校验通过才执行下面
			if(this.roleForm.id){//有id则为编辑状态
				EditRoleId(this.roleForm.id,this.roleForm)
				
			}else{//新增
				addRole(this.roleForm)
			}
			this.getRole()
			this.$message('操作成功')
			 this.showDialog=false
		
		}catch(err){
			console.log(err)
		}
		 
	 },
	 async assignPerm(id){//初始化弹出分配角色权限弹窗
		 this.permData=tranListToTreeData(await getPermissionList(),'0')//转化数据为树形  
		 this.roleId=id
		  const { permIds } = await getRoleId(id) // permIds是当前角色所拥有的权限点数据
		this.selectCheck = permIds // 将当前角色所拥有的权限id赋值
		 this.showPermDialog=true
	 },
	async btnPermOK(){
		 await assignPerm({permIds:this.$refs.permTree.getCheckedKeys(),id:this.roleId})
		 this.$message('分配成功')
		 this.showPermDialog=false
	 },
	 btnPermCancel(){
		 this.selectCheck=[]//清空数组
		 this.showPermDialog=false
	 }
	 
 }
}
</script>

<style>

</style>

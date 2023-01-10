<template>
  <div class="dashboard-container">
    <div class="app-container">
		<!-- 在组件中使用插槽 -->
      <page-tools :show-before="true">
        <span slot="before">共{{page.total}}条记录</span>
        <template slot="after">
			<el-button type="warning" size="small" @click="$router.push('/import?type=user')">导入</el-button>
          <el-button size="small" type="danger">导出</el-button>
          <el-button size="small" type="primary" @click='showDialog=true'>新增员工</el-button>
        </template>
      </page-tools>
	  	<!-- 在组件中使用插槽 -->
      <!-- 放置表格和分页 -->
            <el-card v-loading="loading">
              <el-table border :data="list">
                <el-table-column label="序号" sortable="" type="index" />
				<el-table-column label="照片" sortable="" type="photo" >
					<template slot-scope="{row}">
						 <img
						                slot="reference"
						                v-imagerror="require('@/assets/common/bigUserHeader.png')"
						                :src="row.staffPhoto "
						                style="border-radius: 50%; width: 100px; height: 100px; padding: 10px"
						                alt=""
										@click="showQrCode(row.staffPhoto)"
						              >
					</template>
				</el-table-column>
                <el-table-column label="姓名" sortable="" prop="username" />
                <el-table-column label="工号" sortable="" prop="workNumber" />
                <el-table-column label="聘用形式" sortable="" prop="formOfEmployment" :formatter='formatEmployment'/>
                <el-table-column label="部门" sortable="" prop="departmentName" />
				<!-- 使用插槽并对时间进行处理 -->
               <el-table-column label="入职时间" sortable prop="timeOfEntry">
                          <template slot-scope="obj">
                            {{
                              obj.row.timeOfEntry |formatDate
                            }}
                          </template>
                </el-table-column>
                <el-table-column label="账户状态" sortable="" prop="enableState" :formatter='formatStausInfos'/>
                <el-table-column label="操作" sortable="" fixed="right" width="280">
                  <template slot-scope="{row}">
					 <!-- mixin中的自定义checkPermission方法会检测vuex中的userResult.points中是否含有该权限字符串，有则可以点击 -->
                   <el-button :disabled='!checkPermission("employees-test")' type="text" size="small" @click="$router.push(`/employees/detail/${row.id}`)">查看</el-button>
                    <el-button type="text" size="small">转正</el-button>
                    <el-button type="text" size="small">调岗</el-button>
                    <el-button type="text" size="small">离职</el-button>
                    <el-button type="text" size="small" @click='showRole(row.id)'>角色</el-button>
                    <el-button type="text" size="small" @click='delEmployee(row.id)'>删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <!-- 分页组件 -->
              <el-row type="flex" justify="center" align="middle" style="height: 60px">
                <el-pagination
                  layout="prev, pager, next"
                  :page-size="page.size"
                  :current-page="page.page"
                  :total="page.total"
                  @current-change="changePage"
                />
              </el-row>
            </el-card>
    </div>
	<!-- 放置新增组件 -->
	 <add-employee :show-dialog.sync="showDialog" />
	<!-- 放置二维码组件 -->
	 <el-dialog title="二维码" :visible.sync="showCodeDialog"  @close="imgUrl=''">
	      <el-row type="flex" justify="center">
	        <canvas ref="myCanvas" />
	      </el-row>
	    </el-dialog>
		<!-- 放置角色设置组件 -->
		<assignRole :showRoleDialog.sync='showRoleDialog' :userId='userId' ref='assignRole'></assignRole>
  </div>
</template>
<script>
import {getEmployeeList,delEmployee} from '@/api/employees.js'
import EmployeeEnum from '@/api/constant/employees.js'
import addEmployee from './components/add-employee.vue'
import QRCode from 'qrcode'
import assignRole from './components/assign-role.vue'

export default {
  data() {
    return {
      loading: false,
      list: [], // 接数据的
      page: {
        page: 1, // 当前页码
        size: 10,
        total: 0 // 总数
      },
	  showDialog:false,//新增弹窗
	  showCodeDialog:false,//二维码弹窗
	  showRoleDialog:false,//角色弹窗
      userId:''//点击角色id
    }
  },
  created() {
    this.getEmployeeList()
  },
  components:{
	 addEmployee,
	 assignRole
  },
  methods: {
    changePage(newPage) {//页码切换
      this.page.page = newPage
      this.getEmployeeList()
    },
    async getEmployeeList() {//获取表格信息并渲染
      this.loading = true
      const { total, rows } = await getEmployeeList(this.page).then(res=>{return res})
      this.page.total = total
      this.list = rows
      this.loading = false
    },
	formatEmployment(row, column, cellValue, index){//格式化聘请时间
		const  obj=EmployeeEnum.hireType.find(item=>{return item.id==cellValue})//在枚举数组（api下constant文件中js文件数组）中寻找对应职位
		return obj?obj.value:'未知'//有则更改没有则未知
	},
	formatStausInfos(row, column, cellValue, index){//格式化聘请时间
		const  obj=EmployeeEnum.stausInfos.find(item=>{return item.id==cellValue})//在枚举数组（api下constant文件中js文件数组）中寻找对应职位
		return obj?obj.value:'未知'//有则更改没有则未知
	},
	async delEmployee(id){
	try {
	        await this.$confirm('您确定删除该员工吗')
	        await delEmployee(id)
	        this.getEmployeeList()
	        this.$message.success('删除员工成功')
	      } catch (error) {
	        console.log(error)
	      }
	},
	showQrCode(url){
		if(url){
			this.showCodeDialog=true
			this.$nextTick(()=>{
				QRCode.toCanvas(this.$refs.myCanvas,url)
			})}
			else{
				this.$message.warning('该用户未上传头像')
			}
			
		
			
	},
	async showRole(id){
		this.userId=id
		await this.$refs.assignRole.getUserDetailById(id)
		this.showRoleDialog=true
	}
  }
 
}
</script>

<style>

</style>
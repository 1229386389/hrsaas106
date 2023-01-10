<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 靠右的按钮 -->
      <page-tools>
        <template v-slot:after>
          <el-button type="primary" size="small" @click="showPermDialog=true">添加权限</el-button>
        </template>
      </page-tools>
      <!-- 表格 -->
	 <!-- 当使用树形数据进行渲染时 row-key是必填项  当 row 中包含 children 字段时，被视为树形数据-->
      <el-table border  :data="list" row-key="id">
        <el-table-column align="center" label="名称" prop='name'/>
        <el-table-column align="center" label="标识" prop='code'/>
        <el-table-column align="center" label="描述" prop='description'/>
        <el-table-column align="center" label="操作">
          <template slot-scope="{ row }">
            <el-button type="text" v-if='row.type===1' @click="addPermission(row.id, 2)">添加</el-button>
           <el-button type="text" @click="editPermission(row.id)">编辑</el-button>
            <el-button type="text" @click="delPermission(row.id)"> 删除</el-button>
          </template>
        </el-table-column>

      </el-table>
    </div>
	 <!-- 放置一个弹层 用来编辑新增节点 -->
	   <el-dialog :title="`${showText}权限点`" :visible="showDialog" @close="btnCancel" ref='perForm'>
	      <!-- 表单 -->
	      <el-form ref="perForm" :model="formData" :rules="rules" label-width="120px">
	        <el-form-item label="权限名称" prop="name">
	          <el-input v-model="formData.name" style="width:90%" />
	        </el-form-item>
	        <el-form-item label="权限标识" prop="code">
	          <el-input v-model="formData.code" style="width:90%" />
	        </el-form-item>
	        <el-form-item label="权限描述">
	          <el-input v-model="formData.description" style="width:90%" />
	        </el-form-item>
	        <el-form-item label="开启">
	          <el-switch
	            v-model="formData.enVisible"
	            active-value="1"
	            inactive-value="0"
	          />
	        </el-form-item>
	      </el-form>
	      <el-row slot="footer" type="flex" justify="center">
	        <el-col :span="6">
	          <el-button size="small" type="primary" @click="btnOK">确定</el-button>
	          <el-button size="small" @click="btnCancel">取消</el-button>
	        </el-col>
	      </el-row>
	    </el-dialog>
      
  </div>
</template>

<script>
import { updatePermission, addPermission, getPermissionDetail, delPermission, getPermissionList} from '@/api/permission'
import { tranListToTreeData } from '@/utils'
export default {
data() {
    return {
      list: [],//表格数据
      formData: {//节点编辑新增表单数据
        name: '', // 名称
        code: '', // 标识
        description: '', // 描述
        type: '', // 类型 该类型 不需要显示 因为点击添加的时候已经知道类型了
        pid: '', // 因为做的是树 需要知道添加到哪个节点下了
        enVisible: '0' // 开启
      },
      rules: {
        name: [{ required: true, message: '权限名称不能为空', trigger: 'blur' }],
        code: [{ required: true, message: '权限标识不能为空', trigger: 'blur' }]
      },
      showDialog: false,
	  
    }
  },
  created() {
    this.getPermissionList()
  },
  computed: {
    showText() {
      return this.formData.id ? '编辑' : '新增'
    }
  },
  methods: {
    async  getPermissionList() {
      this.list = tranListToTreeData(await getPermissionList(), '0')
    },
	async editPermission(id){
		this.formData=await getPermissionDetail(id)
		this.showDialog=true
	},
	async delPermission(id){
		try{
			await this.$confirm('是否删除')
		await delPermission(id)
		this.getPermissionList()
		this.$message.success('删除成功')
		}catch(err){
			console.log(err)
		}
		
	},
	addPermission(pid,type){
		this.formData.pid = pid//需要知道添加的类型和添加到哪个节点下了，所以需要给formdata添加type和pid
		      this.formData.type = type
		this.showDialog=true
		
	},
	btnCancel(){
		this.formData={
        name: '', // 名称
        code: '', // 标识
        description: '', // 描述
        type: '', // 类型 该类型 不需要显示 因为点击添加的时候已经知道类型了
        pid: '', // 因为做的是树 需要知道添加到哪个节点下了
        enVisible: '0' // 开启
      }
	  this.showDialog=false
	},
	async btnOK(){
		try{
			await this.$refs.perForm.validate()
		if(this.formData.id){
			updatePermission(this.formData)
			
		}else{
			addPermission(this.formData)
		}
		this.$message(this.formData.id?'更新成功':'添加成功')
		this.showDialog=false
		this.getPermissionList()
		
		}catch(err){
			console.log(err)
		}
		
	}
  }

}
</script>

<style>

</style>

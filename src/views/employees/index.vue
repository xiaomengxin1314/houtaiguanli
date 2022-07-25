<template>
  <div class="dashboard-container">
    <div class="app-container">
      <PageTool title="共一条记录">
        <template #right>
          <el-button type="danger" size="mini" @click="exportExcel"
            >普通excel导出</el-button
          >
          <el-button type="info" size="mini" @click="exportExcel1"
            >复杂表头excel导出</el-button
          >
          <!-- $router 用来实现路由切换 相当于VueRouter实例 -->
          <!-- route 获取相关路由的参数 -->
          <el-button
            type="succes"
            size="mini"
            @click="$router.push('/import?type=user')"
            >excel导入</el-button
          >
          <el-button
            type="primary"
            size="mini"
            @click="addEmployeeVisible = true"
            >新增员工</el-button
          >
        </template>
      </PageTool>

      <el-card>
        <el-table border :data="employessList">
          <el-table-column label="序号" type="index"></el-table-column>
          <el-table-column
            label="姓名"
            sortable
            prop="username"
          ></el-table-column>
          <el-table-column label="头像" prop="staffPhoto">
            <template v-slot="scope">
              <img
                v-imgerror
                :src="scope.row.staffPhoto"
                style="width: 40px"
                @click="showQrDialog(scope.row)"
              />
            </template>
          </el-table-column>
          <el-table-column label="手机号" prop="mobile"></el-table-column>
          <el-table-column label="工号" prop="workNumber"></el-table-column>
          <el-table-column
            label="聘用形式"
            prop="formOfEmployment"
            :formatter="formatterEmployee"
          ></el-table-column>
          <!-- 第二种的方式
          <el-table-column label="聘用形式" prop="formOfEmployment">
            <template v-slot="scope">
              {{ scope.row.formOfEmployment | formatterType }}
            </template>
          </el-table-column> -->
          <el-table-column label="部门" prop="departmentName"></el-table-column>
          <el-table-column label="入职时间" prop="timeOfEntry">
            <template v-slot="scope">
              {{ scope.row.timeOfEntry | dateFormat }}
            </template>
          </el-table-column>
          <el-table-column label="状态" prop="enableState">
            <template v-slot="scope">
              <el-switch :value="scope.row.enableState"></el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template v-slot="scope">
              <el-button
                type="text"
                @click="$router.push('/employees/detail/' + scope.row.id)"
                >查看</el-button
              >
              <el-button type="text">转正</el-button>
              <el-button type="text">调岗</el-button>
              <el-button type="text">离职</el-button>
              <el-button type="text" @click="showRole(scope.row.id)"
                >角色</el-button
              >
              <el-button type="text">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
    <!-- 分配角色 -->
    <el-dialog title="分配角色" :visible.sync="roleVisible">
      <el-checkbox-group v-model="checkList">
        <el-checkbox v-for="item in roleList" :key="item.id" :label="item.id">
          {{ item.name }}
        </el-checkbox>
      </el-checkbox-group>
      <template #footer>
        <el-button type="primary" @click="assgion">确定</el-button>
        <el-button @click="roleVisible = false">取消</el-button>
      </template>
    </el-dialog>
    <!-- 新增员工 -->
    <el-dialog
      title="新增员工"
      :visible.sync="addEmployeeVisible"
      @close="handleClose"
    >
      <el-form
        ref="employeeRef"
        label-width="80px"
        :model="employeeForm"
        :rules="employeeFormRules"
      >
        <el-form-item label="姓名" prop="username">
          <el-input v-model="employeeForm.username"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="employeeForm.mobile"></el-input>
        </el-form-item>
        <el-form-item label="入职时间" prop="timeOfEntry">
          <el-date-picker
            v-model="employeeForm.timeOfEntry"
            type="date"
            placeholder="选择日期"
            clearable
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="聘用形式" prop="formOfEmployment">
          <!-- <el-input v-model="employeeForm.formOfEmployment"></el-input> -->
          <el-select
            v-model="employeeForm.formOfEmployment"
            placeholder="请选择"
          >
            <el-option
              v-for="item in hireType"
              :key="item.id"
              :label="item.value"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="工号" prop="workNumber">
          <el-input v-model="employeeForm.workNumber"></el-input>
        </el-form-item>
        <el-form-item label="组织名称" prop="departmentName">
          <el-input
            v-model="employeeForm.departmentName"
            @focus="showDepartment"
          ></el-input>
          <el-tree
            v-if="departmentList.length > 0"
            :data="departmentList"
            default-expand-all
            :props="{ label: 'name' }"
            @node-click="handleClick"
          >
          </el-tree>
        </el-form-item>
        <el-form-item label="转正时间" prop="correctionTime">
          <el-date-picker
            v-model="employeeForm.correctionTime"
            type="date"
            placeholder="选择日期"
            clearable
          >
          </el-date-picker>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="primary">确定</el-button>
        <el-button @click="addEmployeeVisible = false">取消</el-button>
      </template>
    </el-dialog>
    <el-dialog title="二维码图片" :visible.sync="QrDialogVisible">
      <el-row type="flex" justify="center">
        <canvas ref="canvas"></canvas>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { validMobile } from '@/utils/validate'
import { getDepartmentList } from '@/api/departments'
import { getEmployee, assignRoles } from '@/api/employess'
import { getRoleList } from '@/api/setting'
import employess from '@/constant/employees'
import { getUserDetailById } from '@/api/user'
import QRCode from 'qrcode'
export default {
  filters: {
    // 过滤器形式 聘用形式第二种方式
    formatterType (id) {
      return employess.hireType.find(item => item.id === id)
    }
  },
  components: {},
  data () {
    const validMobiles = (rule, value, callback) => {
      validMobile(value) ? callback() : callback(new Error('手机格式不正确'))
    }
    return {
      paramsObj: {
        page: 1,
        size: 9999
      },
      employessList: [],
      total: null,
      roleVisible: false,
      checkList: [],
      roleList: [],
      id: null,
      addEmployeeVisible: false,
      employeeForm: {
        username: '', // 姓名
        mobile: '', // 手机号
        formOfEmployment: '', // 聘用形式
        workNumber: '', // 工号
        departmentName: '', // 组织名称
        timeOfEntry: '', // 入职时间
        correctionTime: '' // 转正时间
      },
      hireType: employess.hireType,
      employeeFormRules: {
        mobile: [
          { required: true, message: '必填', trigger: 'blur' },
          { validator: validMobiles, trigger: 'blur' }
        ],
        timeOfEntry: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        workNumber: [
          { required: true, message: '必填', trigger: 'blur' }
        ]
      },
      departmentList: [],
      QrDialogVisible: false
    }
  },
  computed: {},
  watch: {},
  created () {
    this.getEmployee()
  },
  methods: {
    async getEmployee () {
      const res = await getEmployee(this.paramsObj)
      console.log(res)
      this.employessList = res.rows
      this.total = res.toatl
    },
    // 聘用方式 find返回的是一个对象 indexof 返回的是一个对象的索引
    formatterEmployee (row, column, cellValue, index) {
      var obj = employess.hireType.find(item => item.id === cellValue - 0)
      if (obj) {
        return employess.hireType.find(item => item.id === cellValue - 0).value
      } else {
        return '未知'
      }
    },
    async exportExcel () {
      // Object.keys  可以得到对象所有的属性组成的数组
      // Object.values(对象) -> 得到对象所有的数字那个组成的数组
      // 获取所有的列表数据
      const { rows } = await getEmployee({ page: 1, size: 9999 })
      console.log(rows)
      rows.forEach(item => {
        // 遍历数组把数组每一项删除两个属性
        delete item.password
        delete item.staffPhoto
      })
      // 把列表数据进行加工处理变成二维数组
      var data = []
      rows.forEach(item => {
        data.push(Object.values(item))
      })
      const headers = {
        'id': '编号',
        'username': '姓名',
        'mobile': '手机',
        'timeOfEntry': '入职日期',
        'formOfEmployment': '聘用形式',
        'correctionTime': '转正日期',
        'workNumber': '工号',
        'departmentName': '部门'
      }
      var tHeader = Object.keys(rows[0]).map(item => (headers[item]))
      // 只有哦按钮点击才会导出
      import('@/vendor/Export2Excel').then(excel => {
        // 是u用这个插件到处excel
        // 在发送一次请求，这一次size携程9999这样就是下导出所有的数据
        // 把数据每一项转化为数组
        excel.export_json_to_excel({
          header: tHeader, // 表头 必填
          data, // 具体数据 必填
          filename: '员工表单', // 非必填
          autoWidth: true, // 非必填
          bookType: 'xlsx' // 非必填
        })
      })
    },
    exportExcel1 () {
      const mutilist = ['', '主要信息', '']
      const merges = ['A1:A2', 'B1:F1', 'G1:G2']
      const tHeader = ['姓名', '手机号', '入职日期', '聘用形式', '转正日期']
      const data = ['张三', '13000000000', '2019-1-1', '正式', '111', 'java']
      import('@/vendor/Export2Excel').then(excel => {
        // 是u用这个插件到处excel
        // 在发送一次请求，这一次size携程9999这样就是下导出所有的数据
        // 把数据每一项转化为数组
        excel.export_json_to_excel({
          header: tHeader, // 表头 必填
          mutilist,
          merges,
          data, // 具体数据 必填
          filename: '员工表单', // 非必填
          autoWidth: true, // 非必填
          bookType: 'xlsx' // 非必填
        })
      })
    },
    async showRole (id) {
      id = this.id
      this.roleVisible = true
      const { rows } = await getRoleList({ page: 1, size: 9999 })
      const { roleIds } = await getUserDetailById(id)
      console.log(roleIds)
      this.checkList = roleIds
      console.log(rows)
      this.roleList = rows
    },
    // 给员工分配角
    async assgion () {
      const res = await assignRoles({ id: this.id, roleIds: this.checkList })
      console.log(res)
      this.roleVisible = false
    },
    // clone事件
    handleClose () {
      // 清空input里面上一次写的值
      this.$refs.employeeRef.resetFields()
      // 把树形控件念关闭
      this.departmentList = []
    },
    // 树形控件
    async showDepartment () {
      const res = await getDepartmentList()
      // 我们的数据不能直接使用，而是先加工处理一下才能使用 递归在写的时候慢慢就意识到了 层次不确定
      function tranferListToTree (list, pid) {
        var list1 = []
        list.forEach(item => {
          if (item.pid === pid) {
            list1.push(item)
            item.children = tranferListToTree(list, item.id)
          }
        })
        return list1
      }
      this.departmentList = tranferListToTree(res.depts, '')
    },
    handleClick (obj) {
      this.employeeForm.departmentName = obj.name// 当前节点name赋值给表单部门的名字
      this.departmentList = []// 关闭tree
    },
    // 二维码
    // 图片二维码
    // sample text放图片
    showQrDialog (src) {
      this.QrDialogVisible = true
      this.$nextTick(() => {
        QRCode.toCanvas(this.$refs.canvas, 'sample text', function (error) {
          if (error) console.error(error)
          console.log('success!')
        })
      })
    }
  }
}
</script>

<style scoped lang='scss'>
</style>

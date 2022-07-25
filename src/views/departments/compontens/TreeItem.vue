<template>
  <div style="width: 100%">
    <el-row
      type="flex"
      justify="space-between"
      align="middle"
      style="height: 40px; padding: 30px 140px; font-size: 14px; width: 100%"
    >
      <el-col>
        <span>{{ node.data ? node.data.name : node.name }}</span>
      </el-col>
      <el-col :span="4">
        <el-row type="flex" justify="end">
          <!-- 两个内容 -->
          <el-col>{{ node.data ? node.data.manager : "负责人" }}</el-col>
          <el-col>
            <!-- 下拉菜单 element -->
            <el-dropdown @command="onCommand">
              <span> 操作<i class="el-icon-arrow-down" /> </span>
              <!-- 下拉菜单 -->
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="a">添加子部门</el-dropdown-item>
                <template v-if="node.data">
                  <el-dropdown-item command="b">编辑部门</el-dropdown-item>
                  <el-dropdown-item command="c">删除部门</el-dropdown-item>
                </template>
              </el-dropdown-menu>
            </el-dropdown>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      width="50%"
      @click.native.stop
      @close="handlerAddClose"
    >
      <el-form
        ref="addForm"
        label-width="100px"
        :model="addDepartmentForm"
        :rules="rules"
      >
        <el-form-item label="部门名称" prop="name">
          <el-input
            v-model="addDepartmentForm.name"
            placeholder="1-50个字符"
          ></el-input>
        </el-form-item>
        <el-form-item label="部门编码" prop="code">
          <el-input
            v-model="addDepartmentForm.code"
            placeholder="1-50个字符"
          ></el-input>
        </el-form-item>
        <el-form-item label="部门负责人" prop="manager">
          <!-- <el-input
            v-model="addDepartmentForm.manager"
            placeholder="1-50个字符"
          ></el-input> -->
          <el-select
            v-model="addDepartmentForm.manager"
            placeholder="请选择"
            style="width: 100%"
            filterable
          >
            <el-option
              v-for="item in users"
              :key="item.id"
              :label="item.username"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="部门介绍" prop="introduce">
          <el-input
            v-model="addDepartmentForm.introduce"
            type="textarate"
            placeholder="1-300个字符"
          ></el-input>
        </el-form-item>
        ></el-form
      >
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="onSubmit"> 确 定 </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getSimpleUserList } from '@/api/user'
import { delDepartment, addDepartment, getDepartmentList, editDepartment } from '@/api/departments'
export default {
  filters: {},
  components: {},
  props: {
    node: {
      type: Object,
      required: true
    }
  },

  data () {
    const variablesName = async (rule, value, callback) => {
      const res = await getDepartmentList()
      if (this.isEdit) {
        // 标题不存在编辑
        const pid = this.node.data.pid// 把当前的编辑部门父级的id找得到 然后根据pid去找所有的兄弟元素
        // && item.id !== this.node.data.id) 排除自己因为自己可以和自己重名
        res.depts.filter(item => item.pid === pid && item.id !== this.node.data.id).some(item => item.name === value) ? callback(new Error('部门名称不能重复')) : callback()
      } else {
        // 带筛选的所有的子部门的pid值
        const id = this.node.data ? this.node.data.id : ''
        // filter筛选 只要是子部门pid和当前部门id一样说明就是他的子部门
        // some看有没有符合条件
        res.depts.filter(item => item.pid === id).some(item => item.name === value) ? callback(new Error('部门名称不能重复')) : callback()
      }
    }

    return {
      dialogVisible: false,
      addDepartmentForm: {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 部门负责人
        introduce: ''// 部门介绍
      },
      rules: {
        name: [
          { required: true, message: '部门名称不能为空', trigger: 'blur' },
          { min: 1, max: 15, message: '部门名称在1~15之间', trigger: 'blur' },
          { validator: variablesName, trigger: 'change' }
        ]
      },
      users: [],
      isEdit: false
    }
  },
  computed: {
    title () {
      return this.isEdit ? '编辑部门' : '新增部门'
    }
  },
  watch: {},
  created () { },
  methods: {
    async onCommand (key) {
      if (this.users.length === 0) {
        this.getSimpleUserList()
      }
      if (key === 'a') {
        this.dialogVisible = true
        this.isEdit = false
      } else if (key === 'b') {
        console.log('编辑')
        this.isEdit = true
        this.dialogVisible = true
        this.addDepartmentForm = { ...this.node.data }
      } else {
        try {
          await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
          await delDepartment(this.node.data.id)
          this.$emit('delDepartment')
        } catch (err) {
          this.$notify({
            message: '取消了删除',
            duration: 1000
          })
        }
      }
    },
    async getSimpleUserList () {
      const res = await getSimpleUserList()
      console.log(res)
      this.users = res
    },
    handlerAddClose () {
      this.$refs.addForm.resetFields() // 表单重置
    },

    async onSubmit () {
      if (this.isEdit) {
        delete this.addDepartmentForm.children
        await editDepartment(this.addDepartmentForm)
      } else {
        // 在哪一项上面新增，这一项id 就是pid
        this.addDepartmentForm.pid = this.node.data ? this.node.data.id : ''
        await addDepartment(this.addDepartmentForm)
      }
      this.dialogVisible = false
      this.$emit('delDepartment')// 子向父传值 ，数据跟新要刷新
    }

  }
}
</script>

<style scoped lang='scss'>
::v-deep .el-tree-node {
  padding: 10px !important;
  span,
  div {
    font-size: 20px;
  }
}
::v-deep .el-tree-node__content {
  padding: 20px 0 !important;
}
</style>

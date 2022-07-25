<template>
  <div>
    <el-button
      type="primary"
      size="mini"
      @click="
        roleDialogVisible = true;
        isEdit = false;
        labelFrom = {};
      "
      >新增角色</el-button
    >
    <el-table :data="roleList" border>
      <el-table-column type="index" label="序号"></el-table-column>
      <el-table-column
        label="角色名"
        prop="name"
        width="160px"
        sortable
      ></el-table-column>
      <el-table-column
        label="描述"
        prop="description"
        sortable
      ></el-table-column>
      <el-table-column label="操作">
        <template v-slot="scope">
          <el-button type="text" @click="fenpei(scope.row.id)"
            >分配权限</el-button
          >
          <el-button type="text" @click="isDiload(scope.row)">修改</el-button>
          <el-button type="text" @click="del(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-row type="flex" justify="end">
      <el-pagination
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        :current-page="paramsObj.page"
        :page-sizes="[2, 3, 4, 5, 6]"
        :page-size="paramsObj.pagesize"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      >
      </el-pagination>
    </el-row>
    <el-dialog title="分配权限" :visible.sync="rightVisible" width="30%">
      <!-- 只要是vue项目，出下面一个很奇怪的问题的时候，可以试一试v-if或@nextTick 或setTimeout 数据没有同步更新 -->
      <!-- v-if作用：保证每次对话框关闭的时候让tree销毁在显示对话框的时候看到的tree是一个新的el-tree -->
      <el-tree
        v-if="rightVisible"
        ref="myTree"
        :data="permission"
        show-checkbox
        default-expand-all
        :props="{ label: 'name' }"
        node-key="id"
        :default-checked-keys="selectPermission"
      >
      </el-tree>
      <template v-slot:footer>
        <el-button type="primary" @click="save">确定</el-button>
        <el-button @click="rightVisible = false">取消</el-button>
      </template>
    </el-dialog>
    <el-dialog
      :title="isEdit ? '编辑' : '新增'"
      :visible.sync="roleDialogVisible"
      @close="reset"
    >
      <el-form
        ref="myForm"
        label-width="80px"
        :model="labelFrom"
        :rules="rules"
      >
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="labelFrom.name"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="description">
          <el-input v-model="labelFrom.description"></el-input>
        </el-form-item>
      </el-form>
      <template v-slot:footer>
        <el-button type="primary" @click="onClick">确定</el-button>
        <el-button @click="roleDialogVisible = false">取消</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { getRoleList, delRole, addRole, editRole } from '@/api/setting'
import { getPermission, getPermissionsById, assignPermission } from '@/api/permission'
import { tranferListToTree } from '@/utils'
export default {
  filters: {},
  components: {},
  data () {
    return {
      paramsObj: {
        page: 1,
        pagesize: 4
      },
      roleList: [],
      total: null,
      rightVisible: false,
      permission: [],
      selectPermission: [],
      id: null,
      roleDialogVisible: false,
      labelFrom: {
        name: '',
        description: ''
      },
      isEdit: false,
      rules: {
        name: [
          { required: true, message: '角色名但不能为空', trigger: 'blur' },
          { min: 1, max: 8, message: '角色名称在1~8之间', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '角色描述不能为空', trigger: 'blur' },
          { min: 3, max: 50, message: '角色名称在3~50之间', trigger: 'blur' }

        ]
      }
    }
  },
  computed: {},
  watch: {},
  created () {
    this.getRoleList()
  },
  methods: {
    async getRoleList () {
      const res = await getRoleList(this.paramsObj)
      console.log(res)
      this.roleList = res.rows
      this.total = res.total
    },
    handleCurrentChange (page) {
      this.paramsObj.page = page
      this.getRoleList()
    },
    handleSizeChange (pagesize) {
      this.paramsObj.pagesize = pagesize
      this.getRoleList()
    },
    del (id) {
      this.$confirm('确定要删除这一行吗, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        // 删除当前这一页最后一页 就应该跑到上一页
        await delRole(id)
        if (this.roleList.length === 1 && this.paramsObj.page > 1) {
          this.paramsObj.page--
        }
        this.getRoleList()

        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    async fenpei (id) {
      // 获取所有的权限、
      this.id = id
      console.log(id)
      const res = await getPermission()
      console.log(res)
      this.permission = tranferListToTree(res, '0')
      // 获取当前的权限点
      const res1 = await getPermissionsById(id)
      console.log(res1)
      this.selectPermission = res1.permIds
      this.rightVisible = true
    },
    async save () {
      // this.$refs.myTree.getCheckedKeys()
      // getCheckedKeys()获取权限的东西
      await assignPermission(this.id, this.$refs.myTree.getCheckedKeys())
      this.rightVisible = false
    },
    onClick () {
      this.$refs.myForm.validate(async bool => {
        // 二次校验

        if (!bool) return this.$message.error('表单数据非法')
        if (this.isEdit) {
          await editRole(this.labelFrom)
        } else {
          await addRole(this.labelFrom)
        }
        this.getRoleList()
        this.roleDialogVisible = false
      })
    },
    reset () {
      this.$refs.myForm.resetFields()
    },
    isDiload (row) {
      this.isEdit = true
      this.roleDialogVisible = true
      this.labelFrom = { ...row }
    }
  }
}
</script>

<style scoped lang='scss'>
.el-table {
  margin-top: 20px;
  margin-bottom: 20px;
}
</style>

<template>
  <div class="app-container">
    <el-card>
      <el-tabs v-model="activeName">
        <el-tab-pane label="登录" name="first">
          <el-form
            ref="infoRef"
            style="width: 400px; margin-top: 50px; margin-left: 200px"
            label-width="80px"
            :model="userInfo"
            :rules="rules"
          >
            <el-form-item label="姓名" prop="username">
              <el-input v-model="userInfo.username"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input v-model="userInfo.password"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="save">更新</el-button>
              <el-button type="info">取消</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="个人详情" name="second">
          <UserInfo :id="id"></UserInfo>
        </el-tab-pane>
        <el-tab-pane label="岗位信息" name="third">
          <JobInfo></JobInfo>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import { getUserDetailById } from '@/api/user'
import { saveEmployee } from '@/api/employess'
import UserInfo from './components/UserInfo'
import JobInfo from './components/JobInfo.vue'
export default {
  filters: {},
  components: { UserInfo, JobInfo },
  props: {
    id: {
      type: [Number, String],
      required: true
    }
  },
  data () {
    return {
      activeName: 'first',
      userInfo: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, message: '用户名不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {},
  watch: {},
  created () {
    this.getUserDetailById()
  },
  methods: {
    async getUserDetailById () {
      const res = await getUserDetailById(this.id)
      console.log(res)
      // this.userInfo.username = res.username
      this.userInfo = res
      res.password = null
    },
    save () {
      this.$refs.infoRef.validate(async valid => {
        if (!valid) return this.$message.errtr('表单数据校验失败')
        const res = await saveEmployee(this.id, this.userInfo)
        console.log(res)
        this.getUserDetailById()
      })
    }
  }
}
</script>

<style scoped lang='scss'>
</style>

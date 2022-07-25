<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card
        v-loading="isloading"
        style="min-height: 700px"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
      >
        <el-tabs>
          <el-tab-pane label="用户管理">
            <!-- 用了一个行列布局 -->
            <TreeItem
              :node="titleObj"
              @delDepartment="getDepartmentList"
            ></TreeItem>
            <el-tree :data="data" default-expand-all>
              <template v-slot="scope">
                <TreeItem
                  :node="scope.node"
                  @delDepartment="getDepartmentList"
                ></TreeItem>
              </template>
            </el-tree>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
    <el-backtop></el-backtop>
  </div>
</template>

<script>
import { getDepartmentList } from '@/api/departments'
import TreeItem from './compontens/TreeItem.vue'
export default {
  filters: {},
  components: { TreeItem },
  data () {
    return {
      data: [],
      titleObj: {},
      isloading: true
    }
  },
  computed: {},
  watch: {},
  created () {
    this.getDepartmentList()
  },
  methods: {
    async getDepartmentList () {
      const res = await getDepartmentList()
      // 我们的数据不能直接使用，而是先加工处理一下才能使用'递归在写的时候就会慢慢意识到'
      function transitionList (list, pid) {
        var list1 = []
        list.forEach(item => {
          if (item.pid === pid) {
            list1.push(item)
            item.children = transitionList(list, item.id)
          }
        })
        return list1
      }
      this.data = transitionList(res.depts, '')
      this.titleObj = res.depts[0]
      this.isloading = false
    }
  }
}
</script>

<style scoped lang='scss'>
</style>

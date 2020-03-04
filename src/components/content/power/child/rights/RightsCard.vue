<template>
  <el-card>
    <el-table :data="rightsList" border stripe>
      <el-table-column type="index"></el-table-column>
      <!-- prop是对应 table中data绑定对象得属性-->
      <el-table-column label="权限名称" prop="authName"></el-table-column>
      <el-table-column label="路径" prop="path"></el-table-column>
      <el-table-column label="权限等级" prop="level">
        <!--组件里得自定义插槽-->
        <template slot-scope="scope">
          <el-tag v-if="scope.row.level === '0' ">一级</el-tag>
          <el-tag v-else-if="scope.row.level === '1' " type="success">二级</el-tag>
          <el-tag v-else type="warning">三级</el-tag>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>np

<script>
  import {get} from '../../../../../network/get'

  export default {
    name: "test",
    data () {
      return {
        // 权限列表
        rightsList : []
      }
    },
    methods : {
      /**
       * 网络请求方法
       * */
      // 1. 获取权限列表封装到此
      getRightsList () {
        //
        get('rights/list').then(res => {
          // 1.1请求失败
          if (res.meta.status !== 200 ){
            return this.$message.error('获取权限列表失败')
          }

          this.rightsList = res.data
          console.log(this.rightsList)
        })
      }
    },
    created () {
      // 当权限列表被创建时，立即获取数据
      this.getRightsList()

    }
  }
</script>

<style scoped>

</style>
<template>
  <div>
    <!--面包屑导航区域-->
    <breadcrumb>
      <span slot="subName">权限管理</span>
      <span slot="itemName">角色列表</span>
    </breadcrumb>

    <!--卡片视图-->
    <roles-card :rolesList="rolesList"
                @getRolesList="getRolesList"
                :queryInfo="queryInfo"
                :total="total"
                @handleSizeChange="handleSizeChange"
                @handleCurrentChange="handleCurrentChange"
    ></roles-card>
    <!-- -->
  </div>
</template>

<script>
  import { get } from '../../../network/get'

  import Breadcrumb from '../../common/breadcrumb/Breadcrumb'

  import RolesCard from './child/roles/RolesCard'

  export default {
    name: "Roles",
    components : {
      Breadcrumb,
      RolesCard
    },
    data () {
      return {
        rolesList:[],
        //根据API 传回来的数据，设置获取用户列表的参数对象
        queryInfo : {
          // query 用于搜索框绑定
          query : '',
          // 当前页数
          pagenum : 1,
          // 当前煤业显示多少条数据
          pagesize: 10
        },
        total:0
      }
    },
    methods:{
      /**
       *网络请求
       */
      getRolesList () {
        get('roles',this.queryInfo).then(res => {
          // 1.1失败弹框
          if (res.meta.status !== 200) {
            this.$message.error('获取角色列表失败！')
          }
          // 1.2 成功
          this.rolesList = res.data
          this.total = Object.keys(res.data).length
        })
      },

      /**
       *其他事件
       */
      // 改变页面显示数据总数
      handleSizeChange (newSize) {
        this.queryInfo.pagesize = newSize
        this.getRolesList()
      },

      // 改变页面页码显示
      handleCurrentChange (newPage) {
        this.queryInfo.pagenum = newPage;
        this.getRolesList()

      }
    },
    created () {
      this.getRolesList ()
    }
  }
</script>

<style scoped>

</style>
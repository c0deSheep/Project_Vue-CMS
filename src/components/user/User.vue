<template>
  <div class="user">
    <!--面包屑导航区域-->
    <breadcrumb></breadcrumb>
    <!--卡片视图区域-->
    <card :userList="userList"
          :queryInfo="queryInfo"
          :total="total"
          @handleSizeChange="handleSizeChange"
          @handleCurrentChange="handleCurrentChange"
          @getUserList="getUserList"></card>
  </div>
</template>

<script>
  import {get} from '../../network/get.js'

  import Breadcrumb from './child/Breadcrumb'
  import Card from './child/Card'

  export default {
    name: "User",
    components : {
      Breadcrumb,
      Card
    },
    data () {
      return {
        //根据API 传回来的数据，设置获取用户列表的参数对象
        queryInfo : {
          // query 用于搜索框绑定
          query : '',
          // 当前页数
          pagenum : 1,
          // 当前煤业显示多少条数据
          pagesize: 10
        },
        userList : [],
        total:0
      }
    },
    methods : {
      /**
       *网络请求
       */
      // 将获取API的数据方法封装到方法中
      getUserList () {
        get('users',this.queryInfo).then(res => {
          if (res.meta.status !== 200){
            return  $message.error('获取用户列表失败！')
          }
          // 获取成功，将数据添加到组件数据中
          this.userList = res.data.users
          this.total = res.data.total
        })
      },

      /**
       *其他事件
       */
      // 改变页面显示数据总数
      handleSizeChange (newSize) {
          this.queryInfo.pagesize = newSize
          this.getUserList()
      },

      // 改变页面页码显示
      handleCurrentChange (newPage) {
        this.queryInfo.pagenum = newPage;
        this.getUserList()

      }
    },
    created () {
      // 页面一旦创立，立马获取数据方法
      this.getUserList()
    }
  }
</script>

<style scoped>

</style>
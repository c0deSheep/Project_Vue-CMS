<template>
  <!--卡片视图-->
  <el-card class="box-card">
    <!--搜索与添加区域-->
    <el-row :gutter="20">
      <el-col :span="8">
        <!--搜索功能通过v-model双向绑定父传子的queryInfo.query    clearable 表示可以显示一颗清空搜索内容按钮，clear事件用于重置页面数据-->
        <el-input placeholder="请输入姓名" v-model="queryInfo.query" clearable @clear="getUserList" @input="getUserList">
          <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
        </el-input>
      </el-col>
      <el-col :span="4">
        <el-button type="primary" @click="dialogVisible = true">添加</el-button>
      </el-col>
    </el-row>

    <!--用户列表区域-->
    <!--el-table标签用于转载表格，data为接收的数据   border为表格加边框 ； stripe为隔行变色-->
    <el-table :data="userList" border stripe="">
      <!--el-column表示一列，label为表头，prop表示要传入的值，为table绑定的data中的属性,在API接口中说明-->
      <el-table-column type="index"></el-table-column>
      <el-table-column label="姓名" prop="username"></el-table-column>
      <el-table-column label="邮箱" prop="email"></el-table-column>
      <el-table-column label="电话" prop="mobile"></el-table-column>
      <el-table-column label="角色" prop="role_name"></el-table-column>
      <el-table-column label="状态">
        <!--使用模板插槽，将开关组件放进-->
        <!--template 是一个插槽 , slot-scope表示拿外面的data数据(userList),可以获取当前一行的数据,  scope.row.XXX 拿到当前行数据的XXX属性值-->
        <template slot-scope="slotProps">
          <el-switch v-model="slotProps.row.mg_state"  @change="userStateChanged(slotProps.row)"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" prop="">
        <!--同样使用模板插槽-->
        <!--<template slot-scope="slotProps">-->
        <template slot-scope="slotProps">
          <!--修改-->
          <el-tooltip class="item" effect="dark" content="编辑" placement="top" :enterable="false">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(slotProps.row.id)"></el-button>
          </el-tooltip>
          <!--删除-->
          <el-tooltip class="item" effect="dark" content="删除" placement="top" :enterable="false">
            <el-button type="danger" icon="el-icon-delete" size="mini" title="删除" @click="removeUserById(slotProps.row.id)"></el-button>
          </el-tooltip>
          <!--分配角色-->
          <el-tooltip class="item" effect="dark" content="分配角色" placement="top" :enterable="false">
            <el-button type="warning" icon="el-icon-setting" size="mini" title="分配角色"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <!--分页区域-->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
      <!--layout就是这个分页区域的展示排布-->
    </el-pagination>

    <Dialog :dialogVisible="dialogVisible" @hideDialog="hideDialog" @getUserList="getUserList">
    </Dialog>

    <edit-dialog :editDialogVisible="editDialogVisible" :editForm="editForm" @hideDialog="hideDialog" @getUserList="getUserList"></edit-dialog>
  </el-card>
</template>

<script>
  import {put} from '../../../network/put.js'
  import {get} from '../../../network/get.js'
  import {remove} from '../../../network/remove.js'

  import Dialog from './Dialog'
  import editDialog from './editDialog'

  export default {
    name: "Card",
    components:{
      Dialog,
      editDialog
    },
    props:{
      userList:{
        type:Array,
        default(){
          return []
        }
      },
      queryInfo : {
        type:Object,
        default () {
          return {}
        }
      },
      total : {
        type:Number,
        default : 0
      }
    },
    data () {
      return {
        // 添加按钮后，消息框的显示控制布尔值
        dialogVisible : false,
        // 编辑按钮后，消息框的显示控制布尔值
        editDialogVisible : false,
        // 查询到的用户信息对象
        editForm : {}
      }
    },
    methods : {
      /**
       *其他事件
       */
      // 监听 pagesize 改变
      handleSizeChange (newSize) {
        this.$emit('handleSizeChange',newSize)
      },

      // 监听 页码值 改变的事件
      handleCurrentChange (newPage) {
        this.$emit('handleCurrentChange',newPage)
      },
      /**
       *网络请求
       */
      // 1.封装方法
      put (userinfo) {
        // 安装API发送修改请求
        put (`users/${userinfo.id}/state/${userinfo.mg_state}`).then(res => {
          if (res.meta.status !== 200) {
            // 失败就不允许用户改变，将结果更改会原样
            userinfo.mg_state = !userinfo.mg_state
            return this.$message.error('用户状态更改失败')
          }
          // 成功
          this.$message.success('用户状态更改成功')
        })
      },
      // 1.2 修改用户状态信息
      // 监听状态改变，将其保存到数据库中
      userStateChanged (userinfo) {
        this.put(userinfo)
      },
      // 1.5
      // 监听搜索框输入内容，并点击搜索按钮，发射getUserList方法，调用父组件User中的getUserList
      getUserList () {
        this.$emit('getUserList')
      },

      // 2.封装获取用户信息数据方法
      get (url) {
        get(url).then(res => {
          if (res.meta.status !== 200) {
            // 失败就不允许用户改变，将结果更改会原样
            return this.$message.error('查询用户信息失败')
          }
          this.editForm = res.data
        })
      },
      // 2.5 点击编辑按钮，弹出信息框
      showEditDialog (id) {
        // 2.5.1 查询用户信息
        this.get('users/' + id)
        // 2.5.2显示
        this.editDialogVisible = true
      },

      // 3.封装删除用户方法
      remove (url) {
        return remove(url).then(res=>{
          console.log(res);
          // 失败弹框提示
          if (res.meta.status !== 200) {
            return this.$message.error('删除用户失败！')
          }
        })
      },

      // 3.5封装删除用户方法,根据用户ID
      removeUserById (id) {
        // 3.5.1弹框提示用户是否操作this.$confirm返回的是一个Promise对象
        this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // 3.5.2调用封装好的删除用户方法
          console.log(id)
          this.remove('users/' + id)
          // 成功弹框提示
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          // 3.5.3 删除后要重新获取所有用户数据
          this.getUserList()
        }).catch(() => {  // 取消必须添加catch
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },

      /**
       *其他事件
       */

      hideDialog () {
        this.dialogVisible = false
        this.editDialogVisible = false
      },
    }
  }
</script>

<style scoped>

</style>
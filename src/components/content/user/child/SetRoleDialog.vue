<!--用户管理路由的分配角色弹框组件-->
<template>
  <el-dialog
    title="分配角色"
    :visible.sync="setRoleDialogVisible"
    :close-on-click-modal="false"
    :before-close="hideDialog"
    width="30%"
    @close="setRoleDialogClosed"><!--visible.sync控制消息框显示与否 el-dialog模态框点击空白不消失  设置属性:close-on-click-modal=“false”-->
    <!--作为子组件，接收父传来的dialogVisible，需要更改时通过发射函数包括这个before-close属性-->
    <!--内容主题区域-->
    <!--表单-->
    <div>
      <p>当前用户： {{setRoleForm.username}}</p>
      <p>当前角色： {{setRoleForm.role_name}}</p>
      <!-- 下拉菜单 v-model双向绑定一个变量，将选中的选项绑定到此，v-for遍历需要展示的信息，label就是每项展示的信息-->
      分配新角色：
      <el-select v-model="selectedRoleId" placeholder="请选择">
        <el-option
          v-for="item in rolesList"
          :key="item.id"
          :label="item.roleName"
          :value="item.id">
        </el-option>
      </el-select>
    </div>

    <!--底部区域-->
    <span slot="footer" class="dialog-footer">
      <el-button @click="hideDialog">取 消</el-button>
      <el-button type="primary" @click="saveNewRoleInfo" >确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import { put } from '../../../../network/put'

  export default {
    name: "RoleDialog",
    props:{
      setRoleDialogVisible:{
        type:Boolean,
        default : false
      },
      // 由Card组件传递进来的单个用户的信息对象
      setRoleForm : {
        type: Object,
        default () {
          return {}
        }
      },
      rolesList : {
        type : Array,
        default () {
          return []
        }
      }
    },
    data () {
      return {
        // 选中角色的id
        selectedRoleId : ''
      }
    },
    methods:{
      /**
       * 网络请求方法
       * */
      // 封装 put 修改用户角色请求
      setRole(url,data){
        return put(url,data).then(res=> {
          // 请求失败
          if (res.meta.status !== 200) {
            console.log(res)
            return this.$message.error('重新分配角色失败！')
          }
          // 请求成功
          this.$message.success('重新分配角色成功！')
          // 刷新列表
          this.$emit('getUserList')
          // 关闭弹框
          this.hideDialog()
        })
      },

      //1.点击确定分配角色，发送请求
      saveNewRoleInfo() {
        if (!this.selectedRoleId) {
          this.$message.error('请选择要分配的角色')
        }
        console.log(this.setRoleForm.id +',' + this.selectedRoleId)
        return this.setRole(`users/${this.setRoleForm.id}/role` ,{rid:this.selectedRoleId})
      },


      /**
       * 其他方法
       * */
      // 向父组件发射关闭消息框方法
      hideDialog () {
        this.$emit('hideDialog')
      },

      // 监听添加用户对话框的关闭事件
      setRoleDialogClosed () {
        // 重置选择框，通过发送请求让父组件清空setRoleForm 和 自己清空已选择id
        // 1.发射清空setRoleForm指令
        this.$emit('clearSetRoleForm')
        // 2.清空自身的已选择id
        this.selectedRoleId = ''
      },

    }
  }
</script>

<style scoped>

</style>
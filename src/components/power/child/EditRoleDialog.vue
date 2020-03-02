<!--修改角色弹框-->
<template>
  <el-dialog
    title="修改用户"
    :visible.sync="editDialogVisible"
    width="50%"
    :close-on-click-modal="false"
    :before-close="hideDialog"
    @close="editDialogClosed"
  >
    <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
      <el-form-item label="角色名" prop="roleName">
        <el-input v-model="editForm.roleName"></el-input>
      </el-form-item>
      <el-form-item label="角色描述" prop="roleDesc">
        <el-input v-model="editForm.roleDesc"></el-input>
      </el-form-item>
    </el-form>
    <!--底部区域-->
    <span slot="footer" class="dialog-footer">
      <el-button @click="hideDialog">取 消</el-button>
      <el-button type="primary" @click="editRoleInfo">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import { put } from '../../../network/put'

  export default {
    name: "EditRoleDialog",
    props:{
      editDialogVisible:{
        type:Boolean,
        default : false
      },
      editForm : {
        type : Object,
        default () {
          return {}
        }
      }
    },
    data () {
      return {
        editFormRules:{
          roleName:[{required:true,message:'请输入角色名',trigger:'blur'},
            { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' },
            {pattern: /^[\u4e00-\u9fa5_a-zA-Z0-9.·-]+$/,
              message: '姓名不支持特殊字符',
              trigger: 'blur'}],
          roleDesc:[{message:'请输入角色描述',trigger:'blur'},{min:6, max:16, message:'角色描述长度在6-16个字符',trigger:'blur'}],
        },
      }
    },
    methods:{
      // 向父组件发射关闭消息框方法
      hideDialog () {
        this.$emit('hideDialog')
      },

      // 监听添加用户对话框的关闭事件
      editDialogClosed () {
        // 重置表单,给el-form调用resetFields方法
        this.$refs.editFormRef.resetFields()
      },

      /**
      * 网络请求
      * */
      /**
       * 网络请求方法
       */
      // 1.封装put方法到私有方法
      put (url,data={}) {
        // 安装API发送修改请求
        return put (url,data)
      },
      // 2.修改用户信息并提交
      editRoleInfo () {
        //  1.先对信息进行与校验,validate是elementUI的表单校验方法
        this.$refs.editFormRef.validate(valid => {
          // 1.1判断校验结果
          if (valid !== true) return
          // 1.2成功就发起添加用户的网络请求
          // 根据API 接口规则，这里传递这个地址，并传递参数
          this.put('roles/' + this.editForm.roleId, {
            roleName : this.editForm.roleName,
            roleDesc : this.editForm.roleDesc,
          }).then(res => {
            if (res.meta.status !== 200) {
              console.log(res)
              return this.$message.error('修改角色信息失败!')
            }

            this.$message.success('修改角色信息成功！')
            // 隐藏消息框
            this.$emit('hideDialog')
            // 重新获取用户列表数据
            this.$emit('getRolesList')
          })
        })
      }
    }
  }
</script>

<style scoped>

</style>
<!--弹出添加角色对话框-->
<template>
  <el-dialog
    title="添加角色"
    :visible.sync="roleDialogVisible"
    :close-on-click-modal="false"
    :before-close="hideDialog"
    width="30%"
    @close="addDialogClosed">
    <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="90px">
      <el-form-item label="角色名" prop="roleName"><!--prop传递的是el-form中rules的属性值-->
        <el-input v-model="addForm.roleName"></el-input>
      </el-form-item>
      <el-form-item label="角色描述" prop="roleDesc">
        <el-input v-model="addForm.roleDesc"></el-input>
      </el-form-item>
    </el-form>
        <!--底部区域-->
    <span slot="footer" class="dialog-footer">
      <el-button @click="hideDialog">取 消</el-button>
      <el-button type="primary" @click="addRole" >确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import {post} from '../../../network/post'

  export default {
    name: "RoleDialog",
    props : {
      roleDialogVisible:{
        type:Boolean,
        default : false
      }
    },
    data () {
      return {
        addForm:{
          roleName : '',
          roleDesc : ''
        },
        addFormRules : {
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
      /**
       * 网络请求
       * */
      // 封装post角色方法
      post(){
        return post('roles',this.addForm)
      },
      // 1. 添加角色
      addRole () {
        //  1.先对信息进行与校验,validate是elementUI的表单校验方法
        this.$refs.addFormRef.validate(valid => {
          // 1.1判断校验结果
          if (valid !== true) return
          // 1.2成功就发起添加用户的网络请求
          this.post().then(res => {
            if (res.meta.status !== 201) {
              console.log(res)
              return this.$message.error('添加新角色失败!')
            }
            this.$message.success('添加新角色成功')
            // 隐藏消息框
            this.$emit('hideDialog')
            // 重新获取用户列表数据
            this.$emit('getRolesList')
          })
        })
      },

      /**
       * 其他事件方法
       * */
      // 向父组件发射关闭消息框方法
      hideDialog () {
        this.$emit('hideDialog')
      },

      // 监听添加用户对话框的关闭事件
      addDialogClosed () {
        // 重置表单,给el-form调用resetFields方法
        this.$refs.addFormRef.resetFields()
      },

    }
  }
</script>

<style scoped>

</style>
<!--修改用户信息弹框-->
<template>
  <el-dialog
    title="修改用户"
    :visible.sync="editDialogVisible"
    width="50%"
    :close-on-click-modal="false"
    :before-close="hideDialog"
    @close="addDialogClosed"
    >
    <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
      <el-form-item label="用户名">
        <el-input v-model="editForm.username" disabled></el-input>
      </el-form-item>
      <el-form-item label="电话" prop="mobile">
        <el-input v-model="editForm.mobile"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="editForm.email"></el-input>
      </el-form-item>
    </el-form>
    <!--底部区域-->
    <span slot="footer" class="dialog-footer">
      <el-button @click="hideDialog">取 消</el-button>
      <el-button type="primary" @click="editUserInfo">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import { put } from '../../../network/put'


  export default {
    name: "editDialog",
    props:{
      editDialogVisible : {
        type:Boolean,
        default: false
      },
      editForm : {
        type: Object,
        default () {
          return {}
        }
      }
    },
    data () {
      return {
        editFormRules:{
          email:[{required:true,message:'请输入用户邮箱',trigger:'blur'},
            {
              type: 'email',//要检验的类型（number，email，date等）
              message: '请输入正确的邮箱地址',
              trigger: ['blur']//（change为检验的字符变化的时候）
            }
          ],
          mobile:[{required:true,message:'请输入用户手机',trigger:'blur'},
            // {pattern: /^1[3456789]\d{9}$/,message:'请输入正确手机',trigger:['blur']}
            {pattern: /^(0|86|17951)?(13[0-9]|15[0123456789]|17[678]|18[0-9]|14[57])[0-9]{8}$/,message:'请输入正确手机',trigger:['blur']}
          ], // 邮箱和手机都支持对应的规则，邮箱直接有一个type:'email' ，而手机则可以设置正则表达式
        }
      }
    },
    methods:{
      // 向父组件发射关闭消息框方法
      hideDialog () {
        this.$emit('hideDialog')
      },

      // 监听添加用户对话框的关闭事件
      addDialogClosed () {
        // 重置表单,给el-form调用resetFields方法
        this.$refs.editFormRef.resetFields()
      },

    /**
     * 网络请求方法
     */
    // 1.封装put方法到私有方法
      put (url,data={}) {
      // 安装API发送修改请求
        return put (url,data)
      },
    // 2.修改用户信息并提交
      editUserInfo () {
        //  1.先对信息进行与校验,validate是elementUI的表单校验方法
        this.$refs.editFormRef.validate(valid => {
          // 1.1判断校验结果
          if (valid !== true) return
          // 1.2成功就发起添加用户的网络请求
          // 根据API 接口规则，这里传递这个地址，并传递参数
          this.put('users/' + this.editForm.id, {
            email : this.editForm.email,
            mobile : this.editForm.mobile,
          }).then(res => {
            if (res.meta.status !== 200) {
              console.log(res)
              return this.$message.error('修改用户信息失败!')
            }

            this.$message.success('修改用户信息成功！')
            // 隐藏消息框
            this.$emit('hideDialog')
            // 重新获取用户列表数据
            this.$emit('getUserList')
          })
        })
      }
    }
  }
</script>

<style scoped>

</style>
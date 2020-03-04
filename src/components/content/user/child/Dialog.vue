<!--用户管理路由的弹出添加用户对话框组件-->
<template>
  <el-dialog
    title="添加用户"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :before-close="hideDialog"
    width="30%"
    @close="addDialogClosed"><!--visible.sync控制消息框显示与否 el-dialog模态框点击空白不消失  设置属性:close-on-click-modal=“false”-->
    <!--作为子组件，接收父传来的dialogVisible，需要更改时通过发射函数包括这个before-close属性-->
    <!--内容主题区域-->
    <!--表单-->
    <!--el-form绑定的model是自定义绑定，而item绑定的是双向绑定v-model-->
    <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
      <el-form-item label="用户名" prop="username"><!--prop传递的是el-form中rules的属性值-->
        <el-input v-model="addForm.username"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="addForm.password"></el-input>
      </el-form-item>
      <el-form-item label="电话" prop="mobile">
        <el-input v-model="addForm.mobile"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="addForm.email"></el-input>
      </el-form-item>
    </el-form>
     <!--底部区域-->
    <span slot="footer" class="dialog-footer">
      <el-button @click="hideDialog">取 消</el-button>
      <el-button type="primary" @click="addUser" >确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import { post } from '../../../../network/post'

  export default {
    name: "Dialog",
    props:{
      dialogVisible : {
        type:Boolean,
        default:false
      }
    },
    data () {
      return {
        // 添加用户的表单数据
        addForm: {
          username:'',
          password:'',
          email:'',
          mobile:''
        },
        // 添加表单验证规则对象
        addFormRules : {
          username:[{required:true,message:'请输入用户名',trigger:'blur'},{min:3, max:10, message:'用户名长度在3-10个字符',trigger:'blur'}],
          password:[{required:true,message:'请输入用户密码',trigger:'blur'},{min:6, max:16, message:'用户名长度在6-16个字符',trigger:'blur'}],
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
        },
      }
    },
    methods : {
      /**
       * 网络请求方法
       * */
      post(){
        return post('users',this.addForm)
      },

      // 添加新用户
      addUser () {
        //  1.先对信息进行与校验,validate是elementUI的表单校验方法
        this.$refs.addFormRef.validate(valid => {
          // 1.1判断校验结果
          if (valid !== true) return
          // 1.2成功就发起添加用户的网络请求
          this.post().then(res => {
            if (res.meta.status !== 201) {
              console.log(res)
              return this.$message.error('添加新用户失败!')
            }
            this.$message.success('添加新用户成功')
            // 隐藏消息框
            this.$emit('hideDialog')
            // 重新获取用户列表数据
            this.$emit('getUserList')
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
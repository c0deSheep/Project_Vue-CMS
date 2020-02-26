<template>
  <div class="login">
    <div class="login_box">
      <!--头像区域-->
      <div class="avatar_box">
        <img src="../../assets/images/vans.jpg" alt="">
      </div>
      <!--登录表单区域-->
      <el-form :model="loginForm" :rules="loginFormRules" ref="loginFormRef" label-width="0px" class="login_form">
        <!--用户名-->
        <el-form-item  prop="username">
          <el-input  v-model="loginForm.username" ref="usernameRef" v-focus prefix-icon="iconfont icon-user-fill" ></el-input>
        </el-form-item>
        <!--密码-->
        <el-form-item style="position: relative;" prop="password">
          <!--需要在element-ul中的input里使用键盘事件，需要加修饰符native-->
          <el-input :type="passwordType"  v-model="loginForm.password"   @keyup.13.native="login()" ref="passwordRef" prefix-icon="iconfont icon-key" >
          </el-input>
          <!--密码框中的可视按钮-->
          <i @click="seePassword" class="iconfont" :class="eye" style="font-size: 25px;color: rgba(192,196,203,1); position: absolute; right: 5px;"></i>
        </el-form-item>
        <!--按钮区域-->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  // 引入封装好的post请求
  import {post} from '../../network/login.js'

  export default {
    name: "Login",
    data () {
      return {
        //这是登录表单的数据绑定对象
        loginForm : {
          //  账号
          username : 'admin',
          //  密码
          password : '123456',
        },
        passwordType : 'password',
        eye:'icon-visible',
        // 这是表单验证规则，添加到el-form中，
        // 里面的属性通过prop到el-form-item中使用,同时这个属性要和input标签里v-model的属性一致
        loginFormRules :  {
          // username是否合法
          username : [
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
          ],
          // password是否合法
          password : [
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 6, max: 15, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ]
        }
      }
    },
    methods : {
      // 将post方法封装到methods中，这样通过直接调用即可获得data
      post () {
        post("login",this.loginForm).then(data => {
          console.log(data)
        })
      },
      seePassword () {
        // if (this.eye === 'icon-visible') {
        //   this.eye = 'icon-eye_protection'
        // }
        this.eye = this.eye==='icon-visible'?'icon-eye_protection':'icon-visible';
        this.passwordType = this.passwordType === 'password'? '':'password';
        // setTimeout(()=>{
        //   //因为vue页面使用jquery在DOM未渲染完成之前事件绑定不上，所有需要延时（jquery不适合在vue页面中使用，但查了好多资料，没找到合适的vux获取input焦点的代码，就果断选择了这个
        //   this.$refs.pw.focus()
        // },20)
        if (this.loginForm.password !== '') {
          this.$nextTick(()=>{
            this.$refs.passwordRef.focus()
          })
        }
      },
      //点击重置按钮，重置登录表单
      resetLoginForm () {
        this.$refs.loginFormRef.resetFields()

        this.$nextTick(()=>{
          this.$refs.usernameRef.focus()
        })
      },

      // 登录事件，发送表单数据之前，要先对数据进行校验,使用validate这个校验方法，接收一个callback，callback传递的是一个boolean值，
      // 只有正确校验才能返回true
      login () {
        this.$refs.loginFormRef.validate(valid=>{
          if (!valid) return;
         // 使用封装好的post请求，获取响应数据
          post("login",this.loginForm).then(res => {
            // 失败弹框
            if (res.meta.status !== 200) {return this.$message({message:'账号密码错误',type:'error',center:true,
              duration:700,
              offset:300})}
            // 只有status为200时成功登录，此时弹框
            this.$message({
              message: '登录成功！',
              type: 'success',
              center:'true',
              duration:700,
              offset:300
            });
          //  完善登录后的操作：
            //  1.将登陆成功之后的 token （唯一身份令牌） 保存的客户端的sessionStorage中（只在页面会话期间可用），localStorage则会一直可用，除非清楚数据
              // 1.1 项目中除了登录之外的其他API接口，必须在登录之后才能访问
              // 1.2 token 只因在当前网站打开期间生效，所以将token 保存在sessionStorage中、
            window.sessionStorage.setItem('token', res.data.token)
            //  2.通过编程式导航跳转到后台主页，路由地址式/home
            this.$router.push('home')


          })
        })
      }
    },
    directives: {
      focus: {
        // 当绑定元素插入到 DOM 中。
        inserted: function (el) {
          // 聚焦元素
          el.querySelector('input').focus()
        }
      }
    },
    mounted () {

    }

  }
</script>

<style lang="less" scoped>
  .login {
    background-color: #2b4b6b;
    height: 100%;
  }
  
  .login_box {
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 3px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
  }

  .login_box .avatar_box {
    height: 130px;
    width: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%,-60%);
    background-color: #fff;
  }

  .avatar_box img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: #eee;
  }

  .login_form {
    position: absolute;
    top: 85px;
    width: 100%;
    padding: 0 40px;
    bottom: 0;
    box-sizing: border-box;
  }


  .btns {
    display: flex;
    justify-content: flex-end;
    transform: translateY(20px);
  }


</style>
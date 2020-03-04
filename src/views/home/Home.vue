<template>

    <el-container>
      <!--头部区域-->
      <el-header>
        <div>
          <img src="../../assets/images/logo.png" alt="">
          <span>CONTENT MANAGEMENT SYSTEM</span>
        </div>
        <!--当前时间组件-->
        <current-time class="current-time"></current-time>
        <el-tooltip class="item" effect="dark" content="退出" placement="bottom" :enterable="false">
          <el-button type="danger"  @click="logout">
          <i class="iconfont icon-tuichu"></i>
          <!--<div>-->
            <!--退出-->
          <!--</div>-->
           </el-button>
        </el-tooltip>
      </el-header>
      <!--页面主体区域-->
      <el-container>
        <!--侧边栏-->
        <!--侧边的宽度应该根据注册菜单栏是否被折叠来设置，所以不写死-->
        <el-aside :width="isCollapse ? '64px':'200px'">
          <!--折叠功能区域-->
          <div class="toggle-button" @click="toggleCollapse">|||</div>
          <!--侧边栏菜单区域-->
          <el-menu
            background-color="#fff"
            text-color="rgb(121, 126, 160)"
            active-text-color="#03A9F4"
            unique-opened
            :collapse="isCollapse"
            :collapse-transition="false"
            router
            :default-active="activePath"><!--unique-opened	是否只保持一个子菜单的展开 ; collapse是决定是否折叠展开; router也是el-menu中拥有的属性，可以自动为下面的子菜单(el-menu-item)添加路由，路由路径为index绑定的值，需要在值前加 / 表示路由
                                default-active 表示默认激活状态，值为index 联动session storage可以将刷新页面的路径放入此，实现记录激活-->
            <!--这是一级菜单-->
            <!--将menuList中保存的左侧一级菜单数据遍历-->
            <!--index是el-submenu自带属性，用于控制点击和打开二级菜单，只接收字符串,解决方法就是将id拼接''-->
            <el-submenu :index="item.id + '' " v-for="item in menuList" :key="item.id">
              <!--一级菜单模板区域-->
              <template slot="title">
                <!--图标-->
                <!--图标通过动态绑定-->
                <i :class="iconsObj[item.id]"></i>
                <!--文本-->
                <span>{{item.authName}}</span>
              </template>
              <!--二级菜单-->
              <el-menu-item :index="'/' + subItem.path" v-for="subItem in item.children" :key="subItem.id"
                            @click="saveNavState('/' + subItem.path)"> <!--当点击子菜单时，保存当前点击的路由地址到SessionStorage中，在下次刷新时自动跳转到该路径-->
                <!--二级菜单模板区域-->
                <!--将遍历的menuList中的children的二级菜单数据-->
                <template slot="title">
                  <!--图标-->
                  <i class="iconfont icon-dt_icon_1"></i>
                  <!--文本-->
                  <span>{{subItem.authName}}</span>
                </template>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <!--右侧内容主题-->
        <el-main>
          <!--路由占位符-->
          <!--element-UI中的el-menu有router属性可以给子菜单直接导航到router-view-->
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>

</template>

<script>
  import {get} from '../../network/get.js'

  import CurrentTime from '../../components/common/time/CurrentTime'

  export default {
    name: "Home",
    components:{
      CurrentTime
    },
    data () {
      return {
      //  左侧菜单数据
        menuList : [],
      //  左侧一级菜单的图标通过对象形式来传入
        iconsObj:{
          '125':'iconfont icon-group',
          '103':'iconfont icon-dns',
          '101':'iconfont icon-local_bar',
          '102':'iconfont icon-description',
          '145':'iconfont icon-trending_up',
        },
        // false表示不遮挡整个左侧菜单
        isCollapse :false,
        // 被激活的链接地址，中间保存
        activePath : ''
      }
    },
    methods: {
      /**
       *网络请求
       */
      // 获取左侧菜单栏数据,将axios封装到getMenuList方法里
      getMenuList() {
         get('menus').then(res => {
          // 成功与否取决于meta中的status，只有200才成功
          if (res.meta.status !== 200) {
            return this.$message.error(res.meta.msg)
          }
          //  成功就将获取的菜单数据保存到menuList中
          this.menuList = res.data
        })
      },
      /**
       *其他事件
       */

      // 退出
      logout () {
        console.log('works')
        window.sessionStorage.clear()
        this.$router.push('/login')
      },
      // 点击折叠按钮，切换整个左侧菜单折叠张卡
      toggleCollapse () {
        // elementUI中有个collapse属性，判断折叠收起，默认是false
        this.isCollapse = !this.isCollapse
      },

      // 保存链接的激活状态
      saveNavState (activePath) {
        // sessionStorage是以键值对形式保存
        window.sessionStorage.setItem('activePath',activePath)
        this.activePath = activePath
      }
    },
    created() {
      // 页面一加载立马请求数据，将左侧菜单栏数据获取
      this.getMenuList()

      // 当网页被创建时，立马设置好保存地址的激活状态
      this.activePath = window.sessionStorage.getItem('activePath')
    }
  }
</script>

<style scoped>
  .iconfont {
    font-size: 20px;
    margin-right: 10px;
  }



  .el-button {
    padding: 6px 10px;
    padding-left: 20px;
    text-align: center;
  }

  /*.el-button div {*/
    /*margin-top: 5px;*/
    /*margin-left: -5px;*/
  /*}*/



  /*需要注意的是：每个elementUI中的标签要为其添加样式，用的类就是这个标签的名称*/
  .el-container {
    height: 100%;
    /*不可被鼠标选设置*/
    moz-user-select: -moz-none;
    -moz-user-select: none;
    -o-user-select:none;
    -khtml-user-select:none;
    -webkit-user-select:none;
    -ms-user-select:none;
    user-select:none;
  }

  /*顶部start*/

  .el-header {
    background-color: #03A9F4;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0  1px 5px 3px rgba(132, 128, 10, 0.3);
    position: relative;
  }

  .el-header div {
    /*实现纵向居中的设置*/
    display: flex;
    align-items: center;
  }

  .el-header div span {
    padding-left: 15px;
    color: #fff;
    font-size: 24px;
  }

  .current-time {
    position: absolute;
    right: 5%;
  }

  /*顶部end*/

  /*左侧菜单栏start*/

  .el-aside {
    background-color:#fff;
  }

  /*el-menu默认是右侧有边框，取消之*/
  .el-aside .el-menu{
    border-right: none;
  }

  .toggle-button {
    background-color: #ffd202;
    position: relative;
    z-index: 2;
    font-size: 10px;
    font-weight: 600;
    line-height: 24px;
    color: #f6f6f6;
    text-align: center;
    letter-spacing: 0.3em;
    cursor: pointer;
  }


  /*左侧菜单栏end*/

  /*右侧主体区start*/

  .el-main {
    background-color: rgba(243, 246, 250, 0.98);
  }

  /*右侧主体区end*/
</style>
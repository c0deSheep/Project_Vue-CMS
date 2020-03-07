import Vue from 'vue'
import VueRouter from 'vue-router'

// vue-cli脚手架中可以import导入时不添加文件后缀名
import Login from '../views/login/Login'
import Home from '../views/home/Home'

import Welcome from '../components/content/welcome/Welcome'
import Users from '../components/content/user/User'
import Rights from '../components/content/power/Rights'
import Roles from '../components/content/power/Roles'
import Cate from '../components/content/goods/Cate'
import Params from '../components/content/goods/Params'
import GoodsList from '../components/content/goods/List'
import GoodsAdd from '../components/content/goods/GoodsAdd'

Vue.use(VueRouter)

const routes = [
  {
    path : '/',
    redirect : '/login'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: Home,
    redirect:'/welcome',
    //需要掩盖其他组件，就需要使用子路由
    children:[
      {
        path: '/welcome',
        component: Welcome
      },
      {
        path: '/users',
        component:Users
      },
      {
        path:'/rights',
        component:Rights
      },
      {
        path:'/roles',
        component:Roles
      },
      {
        path:'/categories',
        component:Cate
      },
      {
        path:'/params',
        component:Params
      },
      {
        path:'/goods',
        component:GoodsList
      },
      {
        path:'/goods/add',
        component:GoodsAdd
      },
    ]
  },

]

const router = new VueRouter({
  mode:'history',
  routes
})

// 挂载路由导航守卫
router.beforeEach((to,from,next) =>{
  //to 将要访问的路径
  //from 代表从那个路径跳转出来
  // next是一个函数，表示放行
  // next（）放行， next('/login')强制跳转
  if (to.path === '/login') return next()

  // 获取token
  const tokenStr = window.sessionStorage.getItem('token')
  //判断token
  // 如果没有token令牌，即没登录，此时想要到别的路径都会返回到登录界面
  if (!tokenStr) return next('/login')
  // 不是没有token令牌，即已经登录，此时可以放行
  next()
})

export default router

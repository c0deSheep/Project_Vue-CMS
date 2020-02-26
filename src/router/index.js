import Vue from 'vue'
import VueRouter from 'vue-router'

import Login from '../components/login/Login.vue'

import Home from '../views/home/Home.vue'

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
    component: Home
  }
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

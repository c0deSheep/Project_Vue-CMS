// 导入axios包
import axios from 'axios'
// 将axios挂载到原型上，这样每个Vue组件都能使用axios
// Vue.prototype.$http = axios

export function request (config) {
  const instance = axios.create({
    baseURL: 'http://127.0.0.1:8888/api/private/v1/',
    timeout: 5000
  })

  //请求拦截器
  instance.interceptors.request.use(config => {

    return config
  }, err => {
    // console.log(err)
  });

  //响应拦截器
  instance.interceptors.response.use(res => {
    return res.data
  },err => {
    console.log(err)
  })

  return instance(config)
}
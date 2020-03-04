import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'

//导入字体图标
import './assets/fonts/iconfont.css'

// 导入全局样式表
import './assets/css/base.css'

import './assets/css/elementUI.css'

// 导入第三方组件TreeTable 用于商品分类展示属性表格
import TreeTable from 'vue-table-with-tree-grid'
// 全局注册该组件
Vue.component('tree-table',TreeTable)


Vue.config.productionTip = false

Vue.prototype.$EventBus = new Vue()


new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

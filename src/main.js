import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'

//导入字体图标
import './assets/fonts/iconfont.css'

// 导入全局样式表
import './assets/css/base.css'
// 导入单独设置的elementUI样式表
import './assets/css/elementUI.css'

// 导入vue-quill-editor富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// require styles富文本编辑器样式表
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
//全局使用富文本编辑器

// 导入第三方组件TreeTable 用于商品分类展示属性表格
import TreeTable from 'vue-table-with-tree-grid'
// 全局注册该组件
Vue.component('tree-table',TreeTable)
Vue.use(VueQuillEditor)
Vue.config.productionTip = false



new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'

//导入字体图标
import './assets/fonts/iconfont.css'

// 导入全局样式表
import './assets/css/base.css'

import './assets/css/elementUI.css'

Vue.config.productionTip = false

Vue.prototype.$EventBus = new Vue()


new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

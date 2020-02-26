import Vue from 'vue'
//导入弹框提示
import { Button,
          Form,
           FormItem,
            Input,
              Message } from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
import lang from 'element-ui/lib/locale/lang/zh-CN.js'
import locale from 'element-ui/lib/locale'

locale.use(lang)

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
// 不同的是，这个弹框需要全局设置,$message是自定义属性
Vue.prototype.$message = Message
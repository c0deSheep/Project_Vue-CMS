import Vue from 'vue'
//导入弹框提示
import { Button,
          Form,
           FormItem,
            Input,
              Message,
                Container,
                  Header,
                    Aside,
                      Main,
                        Menu,
                          Submenu,
                            MenuItem,
                              Breadcrumb,
                                BreadcrumbItem,
                                  Card,
                                    Row,
                                      Col,
                                        Table,
                                          TableColumn,
                                            Switch,
                                              Tooltip,
                                                Pagination,
                                                  Dialog,
                                                    MessageBox,
                                                      Tag,
                                                        Tree,
                                                          Select,
                                                            Option,
                                                              Cascader,
                                                                Alert,
                                                                  Tabs,
                                                                    TabPane} from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
import lang from 'element-ui/lib/locale/lang/zh-CN.js'
import locale from 'element-ui/lib/locale'

locale.use(lang)

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Tag)
Vue.use(Tree)
Vue.use(Select)
Vue.use(Option)
Vue.use(Cascader)
Vue.use(Alert)
Vue.use(Tabs)
Vue.use(TabPane)
// 不同的是，这个自定义弹框需要全局设置,$message是自定义属性
Vue.prototype.$message = Message
// 同样MessageBox也不需要全局使用，而是全局挂载
Vue.prototype.$confirm = MessageBox.confirm
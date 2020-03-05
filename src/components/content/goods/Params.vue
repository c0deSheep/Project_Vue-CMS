<!--分类参数路由，依然使用Card和Dialog-->
<template>
  <div>
    <!--面包屑导航区域-->
    <breadcrumb>
      <span slot="subName">商品管理</span>
      <span slot="itemName">分类参数</span>
    </breadcrumb>

    <!--卡片视图区域-->
    <card>
      <!--警告区域-->
      <el-row slot="row">
        <el-alert show-icon type="warning" title="注意：只允许第三级分类设置相关参数" :closable="false"></el-alert>
      </el-row>

      <!--选中商品分类区域-->
      <el-row slot="row" class="cat_opt">
        <el-col>
          <span>选中商品分类：</span>
          <!--选中商品分类的级联选择框-->
          <!--使用 级联选择器 elementUI组件-->
          <el-cascader
            v-model="selectedCateId"
            :options="allCateList"
            :props="{expandTrigger:'hover',value:'cat_id',label:'cat_name',children:'children',checkStrictly: true}"
            @change="cateChanged"
            clearable
          >
          </el-cascader><!--option用来指定数据源，绑定到一二层级分类数据，props为配置选择选项有value绑定数据源中的哪个属性，label展示的名字，children表示下一句关联选项，clearable表示关闭时重置，change-on-select表示每一级选项都可以选择-->
        </el-col>
      </el-row>

      <!--tab页标签区域-->
      <el-tabs v-model="activeName" @tab-click="handleClick" slot="tabs">
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" :disabled="isSelected" size="mini"  @click="showAddDialog">
            添加参数
          </el-button>
          <!--动态参数列表区域-->
          <!--el-table标签用于转载表格，data为接收的数据   border为表格加边框 ； stripe为隔行变色-->
          <el-table :data="paramsList" border stripe>
            <!--展开列-->
            <el-table-column type="expand">
              <!--列内容-->
              <template slot-scope="scope ">
                <!--循环渲染tag标签（vals）-->
                <el-tag v-for="(item,index) in scope.row.attr_vals" :key="index" closable @close="removeVal(index,scope.row)">{{item}}</el-tag>
                <!--可变输入文本框--><!--巧妙的利用每个scope.row，即每个参数的独立性，在获取并处理vals时，赋值inputVisible和inputValue，保持独立性-->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <!--可变添加的文本框-->
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <!--el-column表示一列，label为表头，prop表示要传入的值，为table绑定的data中的属性,在API接口中说明-->
            <el-table-column type="index"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="slotProps">
                <!--修改-->
                  <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(slotProps.row.attr_id)">修改</el-button>
                <!--删除-->
                  <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeAttrById(slotProps.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary" :disabled="isSelected" size="mini" @click="showAddDialog">
            添加属性
          </el-button>
          <el-table :data="attrList" border stripe>
            <!--el-column表示一列，label为表头，prop表示要传入的值，为table绑定的data中的属性,在API接口中说明-->
            <!--展开列-->
            <el-table-column type="expand">
              <!--列内容-->
              <template slot-scope="scope ">
                <!--循环渲染tag标签（vals）-->
                <el-tag v-for="(item,index) in scope.row.attr_vals" :key="index" closable @close="removeVal(index,scope.row)">{{item}}</el-tag>
                <!--可变输入文本框--><!--巧妙的利用每个scope.row，即每个参数的独立性，在获取并处理vals时，赋值inputVisible和inputValue，保持独立性-->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <!--可变添加的文本框-->
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="属性名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="slotProps">
                <!--修改-->
                <el-tooltip class="item" effect="dark" content="编辑" placement="top" :enterable="false">
                  <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(slotProps.row.attr_id)"></el-button>
                </el-tooltip>
                <!--删除-->
                <el-tooltip class="item" effect="dark" content="删除" placement="top" :enterable="false">
                  <el-button type="danger" icon="el-icon-delete" size="mini" title="删除" @click="removeAttrById(slotProps.row.attr_id)"></el-button>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>

        </el-tab-pane>
      </el-tabs>
    </card>

    <!--点击添加参数/添加属性弹框，两个tab列表公用一个弹框-->
    <Dialog :title="'添加'+titleText" :dialogVisible="addDialogVisible" @hideDialog="hideDialog"  @dialogClosed="addDialogClosed" @addForm="addAttrForm">
      <el-form :model="addForm" :rules="addFormRules" ref="addFormFormRef" label-width="100px">
        <el-form-item :label="labelText" prop="attr_name"><!--prop，验证规则传递的是el-form中rules的属性值-->
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
    </Dialog>

    <!--点击编辑参数/属性弹框，两个tab公用一个弹框-->
    <Dialog :title="'修改'+titleText" :dialogVisible="editDialogVisible" @hideDialog="hideDialog"  @dialogClosed="editDialogClosed" @addForm="editAttrForm">
      <el-form :model="editForm" :rules="editFormRules" ref="editFormFormRef" label-width="100px">
        <el-form-item :label="labelText" prop="attr_name"><!--prop，验证规则传递的是el-form中rules的属性值-->
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
    </Dialog>
  </div>
</template>

<script>
  import { get } from '../../../network/get'
  import { post } from '../../../network/post'
  import { put } from '../../../network/put'
  import { remove } from '../../../network/remove'

  import Breadcrumb from '../../common/breadcrumb/Breadcrumb'
  import Card from '../../common/card/Card'
  import Dialog from '../../common/dialog/Dialog'

  export default {
    name: "Params",
    components:{
      Breadcrumb,
      Card,
      Dialog
    },
    data () {
      return {
        // 所有分类数据的保存变量
        allCateList : [],
        // 级联选中框双向选定选中的id,包括所有父层
        selectedCateId: [],
        // tabs展示组件的双向绑定数据,被激活的标签的names会存放到此，双向绑定给tabs做展示
        // 同时基于获取分类的参数有 动态参数 和 静态参数，要get传参时，传入对应sel：many或sel：only，因此与tabs中的分页双向绑定的name呼应，将name改造
        activeName : "many",
        // 装载请求回来【动态参数】的属性
        paramsList : [],
        // 装载请求回来【静态属性】的属性
        attrList : [],
        // ------------添加part-----------
        // 判断添加动态参数弹框或添加静态属性弹框
        addDialogVisible : false,
        // 添加表单的验证规则对象
        addFormRules:{
          attr_name:[{required:true,message:'请输入名称',trigger:'blur'}]
        },
        // 用于保存表单中用户输入的名称
        addForm : {
          attr_name:''
        },

        // -------------修改part-----------
        // 判断添加动态参数弹框或添加静态属性弹框
        editDialogVisible : false,
        // 添加表单的验证规则对象
        editFormRules:{
          attr_name:[{required:true,message:'请输入名称',trigger:'blur'}]
        },
        // 用于保存表单中用户输入的名称
        editForm : {
          attr_name:'',
        },



      }
    },
    // 监听属性绑定使用计算属性
    computed:{
      // 控制动态参数中的添加参数是否可选
      isSelected (){
        return  this.selectedCateId.length !== 3? true:false
      },
      // 当前选中的三级分类id
      cateId () {
        return  this.selectedCateId.length === 3? this.selectedCateId[2]:null
      },
      // 用于判断点击添加参数还是添加属性的弹框标题
      titleText () {
        return this.activeName === "many"? "动态参数":"静态属性"
      },
      // 用于判断添加参数/属性弹框的input标题
      labelText () {
        return this.activeName === "many"? "参数名称":"属性名称"
      },
    },
    methods:{
      /**
       * 网络请求方法
       * */
      // 1.封装请求级联选择器中所有分类的数据
      getAllCate () {
        get('categories').then(res => {
          // 失败的获取数据
          if (res.meta.status !== 200 ) {
            return this.$message.error('获取所有数据分类失败')
          }
          // 成功时候获取的数据
          this.allCateList = res.data
        })
      },
      // 2.封装请求分类参数数据，根据传参不同获取动态或静态
      getCateAttr (id,sel) {
        get(`categories/${id}/attributes`,sel).then(res => {
          if (res.meta.status !== 200 ){
            return this.$message.error('获取动态参数/静态属性失败！')
          }
          // 需要对每个动态参数的vals进行数组化
          res.data.forEach(item => {
            // 判断是否有vals，没有就返回字符串
            item.attr_vals = item.attr_vals ?item.attr_vals.split(' '):[]
            // 同时为解决出现所有item共用一个inputVisible和inputValue，应该在这里获得vals时生成自己的两个控件属性
            item.inputVisible = false
            item.inputValue = ''
          })
          // 做一层判断，判断当前时动态参数，还是 静态属性，将请求回来的参数对应保存到该页面中
          if( this.activeName === 'many'){
            this.paramsList = res.data
          }else {
            this.attrList = res.data
          }
        })
      },
      // 3.封装添加动态参数或静态属性的post方法
      postAddForm (id,obj) {
        this.$refs.addFormFormRef.validate(valid => {
          // 对提交的表单进行表单规则的校验
          if (!valid) return
          post(`categories/${id}/attributes`,obj).then((res)=>{
            // 添加失败返回
            if (res.meta.status !== 201) {
              console.log(res)
              return this.$message.error('添加失败！')
            }
            // 添加成功返回
            this.$message.success('添加成功')
            // 关闭弹框
            this.addDialogClosed ()
            // 重新获取参数数据
            this.getCateAttr(this.cateId,{sel:this.activeName})
          })  
        })
      },
      // 4.根据id查询参数
      getAttrById (cate_id,attr_id,obj) {
        get(`categories/${cate_id}/attributes/${attr_id}`,obj).then(res => {
          if (res.meta.status !== 200) {
            this.$message.error('查询参数失败')
          }
          this.editForm = res.data
        })
      },
      // 5.封装编辑提交参数请求
      putEditForm (cate_id, attr_id, obj) {
        // if (this.editForm.attr_name)
        this.$refs.editFormFormRef.validate(valid => {
          // 对提交的表单进行表单规则的校验
          if (!valid) return
          put(`categories/${cate_id}/attributes/${attr_id}`,obj).then(res => {
            if(res.meta.status !== 200){
              return this.$message.error('修改失败！')
            }
            // 编辑成功返回
            this.$message.success('修改成功')
            // 关闭弹框
            this.editDialogClosed ()
            // 重新获取参数数据
            this.getCateAttr(this.cateId,{sel:this.activeName})
          })
        })
      },
      // 6.封装删除参数请求
      removeAttr(cate_id,attr_id){
        remove(`categories/${cate_id}/attributes/${attr_id}`).then(res => {
          if (res.meta.status !== 200) {
            console.log(res)
            this.$message.error('删除失败！')
          }
          this.$message.success('删除成功！')
          this.getCateAttr(this.cateId,{sel:this.activeName})
        })
      },
      // 8.封装提交vals修改请求
      putValsEdit(cate_id, attr_id, obj){
            put(`categories/${cate_id}/attributes/${attr_id}`,obj).then(res => {
              if(res.meta.status !== 200){
                return this.$message.error('修改失败！')
              }

        })
      },


      /**
       * 其他方法
       * */
      // 弹框公共部分隐藏弹框---------------
      hideDialog () {
        if(this.addDialogVisible){return this.addDialogVisible = false}

        if(this.editDialogVisible){
          this.editDialogVisible = false
          this.editForm.attr_id = ''
          console.log(this.editForm.attr_id)
          return
          }
        },
      // a.级联选择框选中项变化时，触发这个函数
      cateChanged () {
        // 双向选中的数组长度是否等于3来判断是否选中第三层分类
        if ( this.selectedCateId.length !== 3 ) {
          // 重置数组
          this.selectedCateId = []
          // 清空动态参数和静态属性的值，防止，选中一二层时有遗留
          this.paramsList = []
          this.attrList = []
          return
        }
        // 证明选中第三层分类，发起get请求，获取默认动态参数的数据，并渲染
        this.getCateAttr(this.cateId,{sel:this.activeName})
      },

      // b.当点击不同的tab标签展示页重新获取参数/属性
      handleClick () {
        this.cateChanged ()
      },
      // ---------------添加part--------------------------------
      // 展示弹框
      showAddDialog () {
        this.addDialogVisible = true
      },
      // 弹框确认提交添加参数/属性请求
      addAttrForm(){
        this.postAddForm(this.cateId,{attr_name:this.addForm.attr_name,attr_sel:this.activeName})
      },
      //关闭弹框，重置表单
      addDialogClosed () {
        this.$refs.addFormFormRef.resetFields()
        this.hideDialog()
      },
      // ----------------修改part---------------------------------
      // 展示弹框
      showEditDialog (attr_id) {
        this.getAttrById(this.cateId,attr_id,{sel:this.activeName})
        this.editDialogVisible = true
      },
      // 弹框确认提交添加参数/属性请求
      editAttrForm(){
        this.putEditForm(this.cateId,this.editForm.attr_id,{attr_name:this.editForm.attr_name,attr_sel:this.activeName})
      },
      //关闭弹框，重置表单
      editDialogClosed () {
        this.$refs.editFormFormRef.resetFields()
        this.hideDialog()
      },

      // ----------------删除part-----------------------------------
      removeAttrById (id) {
        // 弹框提示用户是否操作this.$confirm返回的是一个Promise对象
        this.$confirm('此操作移除该权限, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // 调用封装好的删除参数方法
          // 根据API的接口传入url
          this.removeAttr(this.cateId,id)
          // 删除后要重新获取所有参数数据
        }).catch(() => {  // 取消必须添加catch
          this.$message({
            type: 'info',
            message: '已取消移除权限'
          });
        });
      },

      // --------------vals可变按钮和文本框的操作函数part------------------
      // 都是又inputVisible数据来控制显示与否
      // input聚焦过程input失去焦点或按enter时发生的函数
      handleInputConfirm (rowData) {
        // 判断是否有输入东西，没有就清空
        if (rowData.inputValue.trim().length === 0) {
          rowData.inputValue = ''
          rowData.inputVisible = false
          return
        }
        // 如果没有return 则证明输入内容，需要后续处理
        rowData.attr_vals.push(rowData.inputValue.trim())
        rowData.inputValue = ''
        // 要发送编辑提交参数
        this.putValsEdit(this.cateId,rowData.attr_id,{
          attr_name:rowData.attr_name,
          attr_sel:rowData.attr_sel,
          attr_vals:rowData.attr_vals.join(' ')
        })
        rowData.inputVisible = false
      },
      // 点击按钮变成文本框
      showInput (rowData) {
        rowData.inputVisible = true
        // $nextTick 方法的作用，就是当页面的元素被重新选然后，才会指定回调函数中的代码
        this.$nextTick(()=>{
          this.$refs.saveTagInput.$refs.input.focus()
        })
      },
      // 点击X删除tag
      removeVal (index,rowData) {
        rowData.attr_vals.splice(index,1)
        this.putValsEdit(this.cateId,rowData.attr_id,{
          attr_name:rowData.attr_name,
          attr_sel:rowData.attr_sel,
          attr_vals:rowData.attr_vals.join(' ')
        })
      },
    },
    created () {
      // 路由生成时获取所有分类数据
      this.getAllCate()
    }
  }
</script>

<style scoped>
  .cat_opt {
    margin: 25px 0;
  }

  .el-tag {
    margin: 10px;
  }

  .input-new-tag {
    width: 120px;
  }
</style>
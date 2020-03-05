<!--这是商品分类路由视图组件-->
<!--这里尝试将需要的组件Card和弹框Dialog封装到common组件中进行引用使用-->
<!--power和user都是使用独立封装card和dialog组件-->
<template>
  <div>
    <!--面包屑导航区域-->
    <breadcrumb>
      <span slot="subName">商品管理</span>
      <span slot="itemName">商品分类</span>
    </breadcrumb>

    <!--卡片视图区域-->
    <card>
      <!--添加商品按钮-->
      <el-row slot="row">
        <el-col>
          <el-button type="primary" @click="showDialog">添加分类</el-button>
        </el-col>
      </el-row>

      <!--商品分类表格区域-->
        <!--注意：在商品分类表格这部分使用第三份组件TreeTable树形表格,
        需要绑定一个数组作为数据源data,columns为表格中的设置,两个type负责设置复选和展开，
        show-index表示序列，index-text表示序列的表头名称-->
      <tree-table slot="tree-table"
                  :data="cateList"
                  :columns="columns"
                  :selection-type="false"
                  :expand-type="false"
                  :show-index="true"
                  :index-text="'#'"
                  border :show-row-hover="false"
      >
        <!--模板插槽：是否有效列，对应template：isOk-->
        <template slot="isOk" slot-scope="scope" style="align-items: center"><!--在里面放置一个自定义模板列，slot-scope="scope"为将行数据保存到scope中,scope.row即该行单项分类数据,也就是prop-->
          <el-tooltip class="item" effect="dark" content="无效" placement="right"  v-if="scope.row.cat_deleted">
            <i class="el-icon-error" style="color:red"></i>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="有效" placement="right" v-else>
            <i class="el-icon-success"   style="color:lightgreen"></i>
          </el-tooltip>

        </template>
        <!--模板插槽：是否排序，对应template：order-->
        <template slot="order" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level===0" >一级</el-tag>
          <el-tag size="mini" v-else-if="scope.row.cat_level===1" type="success">二级</el-tag>
          <el-tag size="mini" v-else type="error">三级</el-tag>
        </template>
        <!--模板插槽：操作按钮，对应template：operation-->
        <template slot="operate" slot-scope="scope">
          <el-button size="mini" type="primary" icon="el-icon-edit" @click="editCateById(scope.row.cat_id)">编辑</el-button>
          <el-button size="mini" type="danger" icon="el-icon-delete" @click="removeCateById(scope.row.cat_id)">删除</el-button>
        </template>
      </tree-table>

      <!--分页区域-->
      <el-pagination
        slot="pagination"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination> <!--page-sizes表示可供选择页面展示数-->
    </card>

    <!--点击添加分类弹框组件，使用里面的插槽-->
    <Dialog :dialogVisible="addCateDialogVisible" :add-form="addCateForm" title="添加分类" width="50%" @hideDialog="hideDialog"  @dialogClosed="addCateDialogClosed" @addForm="judgeIsExisted">
      <!--添加分类的表单-->
      <el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateFormRef" label-width="100px">
        <el-form-item label="分类名称" prop="cat_name"><!--prop，验证规则传递的是el-form中rules的属性值-->
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类" >
          <!--使用 级联选择器 elementUI组件-->
          <el-cascader
            v-model="selectedCatePid"
            :options="parentCateList"
            :props="{expandTrigger:'hover',value:'cat_id',label:'cat_name',children:'children',checkStrictly: true}"
            @change="parentCateChanged"
            clearable
          >
          </el-cascader><!--option用来指定数据源，绑定到一二层级分类数据，props为配置选择选项有value绑定数据源中的哪个属性，label展示的名字，children表示下一句关联选项，clearable表示关闭时重置，change-on-select表示每一级选项都可以选择-->
        </el-form-item>
      </el-form>
    </Dialog>

    <!--点击编辑分类弹框组件，使用里面的插槽-->
    <Dialog title="编辑分类" :dialogVisible="editCateDialogVisible" @hideDialog="hideDialog"  @dialogClosed="editCateDialogClosed" @addForm="confirmEditCate">
      <el-form :model="editCateForm" :rules="addCateFormRules" ref="editCateFormRef" label-width="100px">
        <el-form-item label="分类名称" prop="cat_name"><!--prop，验证规则传递的是el-form中rules的属性值-->
          <el-input v-model="editCateForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
    </Dialog>


  </div>
</template>

<script>
  import { get } from  '../../../network/get'
  import { post } from  '../../../network/post'
  import { put } from  '../../../network/put'
  import { remove } from '../../../network/remove'

  import Breadcrumb from '../../common/breadcrumb/Breadcrumb'
  import Card from '../../common/card/Card'
  import Dialog from '../../common/dialog/Dialog'

  export default {
    name: "Cate",
    props:{

    },
    data () {
      return {
        // 需要发送的页面相关请求参数，包括类型，页数，页面展示数
        queryInfo : {
          // 1，2，3分别表示显示一层二层三层分类列表
          type:3,
          pagenum:1,
          pagesize : 5
        },
        // 商品分类的数据列表，默认为空
        cateList:[],
        // 商品分类总数
        total : 0,
        // columns为树形表格中的列设置进行指定，为一个数组
        columns:[
          {
          //第一列
          //label为列标题
          label:'分类名称',
          //prop为表格实际绑定数据来源data的属性
          prop:'cat_name'
        },
          {
          // 第二列
            label:'是否有效',
            //表示当前定义为模板列
            type:'template',
            //表示这一列使用的模板对应名称
            template:'isOk'
          },
          {
            //  第三列
            label:'排序',
            //表示当前定义为模板列
            type:'template',
            //表示这一列使用的模板对应名称
            template:'order'
          },
          {
            //  第四列
            label:'操作',
            //表示当前定义为模板列
            type:'template',
            //表示这一列使用的模板对应名称
            template:'operate'
          }
        ],
        // 添加分类弹框是否展示控件
        addCateDialogVisible : false,
        // 需要发送的添加分类表单对象
        addCateForm:{
          // 将要添加的分类的名称
          cat_name:'',
          // 名称的父级id
          cat_pid:0,
          // 分类名称的等级
          cat_level:0
        },
        // 添加分类表单规则
        addCateFormRules:{
          cat_name:[{required:true,message:'请输入分类名称',trigger:'blur'}],
        },
        // 一层二层父级商品分类数据
        parentCateList : [],
        // 双向绑定 在 级关联选择器的变量，必须为数组,这里即将父级分类pid保存到数组中
        selectedCatePid :[],
        // 全部cate分类，不只是当前页面
        all:[],
        // 编辑分类控件是否展示
        editCateDialogVisible : false,
        // 编辑请求发送保存对象
        editCateForm : {
          // 将要编辑的分类的id
          cat_id:'',
          // 将要编辑的分类的名称
          cat_name:''
        },
        // 删除分类控件是否展示
        removeCateDialogVisible : false,
        // 删除分类请求发送保存的id
        removeCateId:''
      }
    },
    components : {
      Breadcrumb,
      Card,
      Dialog
    },
    methods:{
      /**
       * 网络请求
       * */
      // 1.封装get请求
      //  获取商品数据列表
      getCateList(){
        // 根据API接口，传入请求参数有type，pagenum，pagesize，设置变量保存
        get('categories',this.queryInfo).then(res => {
          // 失败返回
          if (res.meta.status !== 200) {
            return this.$message.error('获取商品分类数据失败！')
          }
          // 成功返回
          // 1.1当前页商品分类数据在结果data中的result数组，将其保存到catelist
          this.cateList = res.data.result
          // 1.2商品分类总数在total中，用total保存
          this.total = res.data.total
        })
      },
      // 2.获取一二层的商品分类数据
      // 根据API接口，传入路径，参数定为type:2
      getParentCateList(){
        get('categories',{type:2}).then(res=>{
          // 失败返回
          if (res.meta.status !== 200) {
            this.$message.error('获取父级商品分类失败')
          }
          // 成功返回
            this.parentCateList = res.data
        })
      },
      // 3. 发送添加分类的请求
      postAddForm () {
        // 表单验证和发送添加分类请求
        this.$refs.addCateFormRef.validate(valid => {
          if (!valid) return
          post('categories',this.addCateForm).then(res => {
            if (res.meta.status !== 201) {
              return this.$message.error('添加分类失败！')
            }
            this.getCateList()
              this.$message({
                type: 'success',
                message: '添加分类成功！',
            })
          })
        })
      },
      // 4. 发送编辑提交分类请求
      putEditForm (object) {
        this.$refs.editCateFormRef.validate(valid => {
          if (!valid) return
          put(`categories/${object.cat_id}`, {cat_name:object.cat_name}).then(res => {
            if (res.meta.status !== 200) {
              return this.$message.error('编辑分类失败！')
            }
            this.getCateList()
            this.editCateDialogClosed()
              this.$message({
                type: 'success',
                message: '编辑分类成功！',
            })
          })
        })
      },
      // 5. 发送删除分类请求
      removeCate(id) {
        remove(`categories/${id}`).then(res => {
          // 请求失败
          if (res.meta.status !== 200) {
            this.$message.error('删除分类失败！')
          }
          // 请求成功
          this.$message({
            message:'删除分类成功！',
            type:'success',
            duration:300
          })
          this.getCateList()
        })
      },
      /**
       * 其他方法
       * */
      // ----公共部分 start----------------------------------
      // 隐藏弹框
      hideDialog () {
        if (this.addCateDialogVisible) {
          return this.addCateDialogVisible = false
        }
        if (this.editCateDialogVisible) {
          return this.editCateDialogVisible = false
        }
        if (this.removeCateDialogVisible) {
          return this.removeCateDialogVisible = false
        }
      },
      // ----公共部分 end----------------------------------------

      // ----页码部分函数 start----------------------------------
      // 1.监听页面展示数改变
      handleSizeChange (newSize) {
        // 1.1将请求参数中的页面展示数更改
        this.queryInfo.pagesize = newSize
        // 1.2立即重新发送请求，并自动更新数据和页面
        this.getCateList()
      },
      // c.监听页码改变
      handleCurrentChange (newNum) {
        // 2.1 将请求参数中的页数更改
        this.queryInfo.pagenum = newNum
        // 2.2立即重新发送请求，并自动更新数据和页面
        this.getCateList()
      },
      // ----页码部分函数 end--------------------------------------

      //-----添加分类部分函数 start---------------------------------
      // 展示添加分类弹框
      showDialog () {
        this.getParentCateList()
        this.addCateDialogVisible = true
        // 获取全分类（包括一二三层）
        get('categories').then(res=>{
          this.all = res.data
        })
      },
      // 监听确认时判断分类是否重复
      judgeIsExisted () {
        // 将判断分类是否重复，是则提示
        for (let i=0;i < this.all.length; i++ ) {
          if (this.all[i].cat_name === this.addCateForm.cat_name) {
            return this.openAddConfirm ()
          }
            if (this.all[i].children) {
                for (let j=0;j < this.all[i].children.length; j++) {
                  if (this.all[i].children[j].cat_name === this.addCateForm.cat_name) {
                    return this.openAddConfirm ()
                  }
                    if (this.all[i].children[j].children) {
                        for (let k=0;k < this.all[i].children[j].children.length; k++) {
                          if  (this.all[i].children[j].children[k] === this.addCateForm.cat_name ) {
                            return this.openAddConfirm()
                          }
                        }
                    }
                }
            }
        }
      this.postAddForm()
      },
      // 添加分类重复时弹框确认
      openAddConfirm() {
        this.$confirm('已存在该分类, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.postAddForm ()
          ;
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '添加已取消'
          });
        });
      },
      // f.弹框级联选择器选项发生变化触发这个事件
      parentCateChanged () {
        // 如果级联选择器双向绑定数组selectedCatePid 的length大于0，证明有重新选择父级分类，反之没有选中父级分类
        if (this.selectedCatePid.length > 0 ) {
          //父级分类id赋值
          this.addCateForm.cat_pid = this.selectedCatePid[this.selectedCatePid.length - 1]
          // 为当前添加的分类层级赋值，level层级和数组长度一致
          this.addCateForm.cat_level = this.selectedCatePid.length
          return
        }else  {
          //父级分类id
          this.addCateForm.cat_pid = 0
          // 为当前添加的分类层级赋值，level层级和数组长度一致
          this.addCateForm.cat_level = 0
        }
      },
      // 在dialog中点击关闭发射事件到这里，处理事件重置添加分类表单
      addCateDialogClosed () {
        this.$refs.addCateFormRef.resetFields()
        this.selectedCatePid = []
        this.addCateForm.cat_pid = 0
        this.addCateForm.cat_level = 0
      },
      //-----添加分类部分函数 end---------------------------------

      // ----编辑分类部分函数 start-------------------------------
      // h.编辑当前分类
      editCateById(id) {
        this.editCateDialogVisible = true
        this.editCateForm.cat_id = id
      },
      // 发送编辑请求
      confirmEditCate() {
        this.putEditForm(this.editCateForm)
      },
      // 编辑弹框关闭
      editCateDialogClosed () {
        this.$refs.editCateFormRef.resetFields()
        this.editCateDialogVisible = false
      },
      // ----编辑分类部分函数 end---------------------------------

      // ----删除分类部分函数 end---------------------------------
      // 删除当前分类
      removeCateById(id) {
        this.removeCateDialogVisible =true
        this.removeCateId = id
        this.openRemove()
      },
      openRemove () {
        this.$confirm('是否永久删除该分类?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // 确认删除
          this.removeCate(this.removeCateId)
          this.getCateList()
          ;
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '添加已取消',
            duration:300
          });
        });
      },
      // 删除弹框关闭
      removeCateDialogClosed () {
        this.removeCateDialogVisible = false
        this.removeCateId = ''
      },

    },
    created () {
      this.getCateList()
    }
  }
</script>

<style scoped>
  .el-cascader-panel {
    user-select: none !important;
  }

  .el-row {
    margin-bottom: 15px;
  }

  .el-cascader {
    width: 100%;
  }
</style>
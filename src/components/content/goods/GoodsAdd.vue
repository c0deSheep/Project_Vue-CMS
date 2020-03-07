<template>
  <div>
    <!--面包导航区域-->
    <breadcrumb>
      <span slot="subName">商品管理</span>
      <span slot="itemName">添加商品</span>
    </breadcrumb>

    <!--卡片视图-->
    <card>
      <!--提示区域-->
      <el-alert
        slot="row"
        title="添加商品信息"
        type="info"
        center
        show-icon>
      </el-alert>
      <!--步骤进度条-->
      <el-steps :space="400" :active="+ activeIndex" finish-status="success" slot="tabs" size="mini" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品照片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <!--商品信息表单-->
      <el-form slot="form" :model="addForm" :label-position="'top'"  :rules="addFormRules" ref="addRuleFormRef" label-width="100px" label-posittion="top">
        <!--tab栏区域-->
        <!-- tabs中可以v-model双向绑定数据，通过tab-pane中name属性，实现联动，即v-model绑定的值就等于name，
        绑定的before-leave是一个钩子函数，即触发tab切换前触发函数，接收两个值，一个是activeName，一个是oldActiveName，tab-click就是正式切换tab触发的函数-->
        <el-tabs v-model="activeIndex" :tab-position="'left'" :before-leave="beforeTabLeave"  @tab-click="tabClicked" >
          <!--渲染商品基本信息-->
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_number">
              <el-cascader
                v-model="addForm.goods_cat"
                :options="allCateList"
                :props="{expandTrigger:'hover',value:'cat_id',label:'cat_name',children:'children',checkStrictly: true}"
                @change="cateChanged"
                clearable
              >
              </el-cascader><!--option用来指定数据源，绑定到一二层级分类数据，props为配置选择选项有value绑定数据源中的哪个属性，label展示的名字，children表示下一句关联选项，clearable表示关闭时重置，change-on-select表示每一级选项都可以选择-->
            </el-form-item>
          </el-tab-pane>
          <!--渲染商品动态参数，依据基本属性中的级联选择器选中的第三层分类id-->
          <el-tab-pane label="商品参数" name="1">
            <!--循环遍历基于基本信息级联选择器选中的第三层分类id获得的动态参数，并将其名字赋值到label-->
            <el-form-item :label="item.attr_name" v-for="(item) in paramsList" prop="" :key="item.attr_id">
              <!--动态参数的具体参数使用复选框组来渲染，双向绑定每组动态参数的具体参数值-->
              <el-checkbox-group v-model="item.attr_vals">
                <!--再循环遍历这组动态参数的具体参数值，进行渲染复选框,label为具体名称-->
                <el-checkbox :label="cb" v-for="(cb,i) in item.attr_vals" :key="i"  border></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <!--商品属性的渲染思想与动态参数一致-->
          <el-tab-pane label="商品属性" name="2">
            <el-form-item v-for="item in attrList" :label="item.attr_name" :key="item.attr_id">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品照片" name="3">
            <!--上传图片区，使用组件Upload-->
            <!--action是图片要上传到后台API的地址http://127.0.0.1:8888/api/private/v1/ 加上 upload接口,使用data属性转载，
            on-preview是点击上传的图片预览大图，limit和on-exceed来限制上传文件的个数和定义超出限制时的行为。
            可通过设置before-remove来阻止文件移除操作。-->
            <!--在使用upload组件进行上传文件时，本身的组件是不包含设置好的网络请求的token，所以利用组件自身的属性headers绑定需要的请求头-->
            <!--同时，这个upload只是代表上传服务器成功，还需要将其信息进行表单形式添加到商品的信息中-->
            <!--upload成功时会返回数据，其中包含图片服务器路径url，图片服务器临时路径tmp_path, on-success属性就是文件上传成功时的钩子函数，在此进行表单设置-->
            <el-upload
              :action="uploadURL"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="uploadHeaderObj"
              :on-success="handleUploadSuccess">
              <el-button size="small" type="primary" >点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <!--富文本编辑器组件-->
            <quill-editor v-model="addForm.goods_introduce"
                          ref="myQuillEditor">
            </quill-editor>
            <!--最终添加商品按钮-->
            <el-button type="primary" class="btnAdd" @click="add">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </card>

    <!--图片预览弹框-->
    <el-dialog
      title="图片预览"
      :visible.sync="previewDialogVisible"
      :close-on-click-modal="false"
      width="50%">
      <!--图片与预览-->
      <img :src="uploadPreviewPath" alt="图片预览" class="previewImg">
    </el-dialog>
  </div>
</template>

<script>
  import { get } from '../../../network/get.js'
  import { post } from '../../../network/post.js'

  // 使用_一个下划线作为lodash的标识符
  import  _ from 'lodash'

  import Breadcrumb from '../../common/breadcrumb/Breadcrumb'
  import Card from '../../common/card/Card'

  export default {
    name: "GoodsAdd",
    components : {
      Breadcrumb,
      Card
    },
    data () {
      return {
        // -----------关于tabs和进度条联动的关键的在于共同绑定同一个index上-----------

        // 因为双向绑定到tab中的tab-pane的name，所以需要变成字符串
        // 但在进度条组件中需要是数字，所以标签中需要操作
        activeIndex : '0',
        // 需要提交添加的信息表单数据对象
        addForm : {
          goods_name:'',
          goods_number:0,
          goods_weight:0,
          goods_price:0,
          // 级联选择器选中的分类的id，是一个数组，用来装id，最多可以包括三层，双向绑定到要发送的表单中
          goods_cat:[],
          // 在发送表单时，图片的请求是以上传图片的临时路径（对象），是一个数组
          pics:[],
          // 商品的详情描述（内容）
          goods_introduce:'',
          // 商品的动态参数和静态属性发送请求存放的属性
          attrs : [],
        },
        // 表单验证规则
        addFormRules : {
          goods_name:[{required:true,message:'请输入商品名称',trigger:'blur'}],
          goods_number:[{required:true,message:'请输入商品数量',trigger:'blur'}],
          goods_weight:[{required:true,message:'请输入商品重量',trigger:'blur'}],
          goods_price:[{required:true,message:'请输入商品价格',trigger:'blur'}],
          goods_cat:[{required:true,message:'请选择商品分类',trigger:'blur'}],
        },
        // 所有商品分类数据
        allCateList : [],
        // 商品动态参数
        paramsList:[],
        // 商品的静态属性
        attrList : [],
        // 图片需要上传的后台地址
        uploadURL: "http://127.0.0.1:8888/api/private/v1/upload",
        // 图片上传使用axios发送请求的请求头
        uploadHeaderObj : {
          Authorization : window.sessionStorage.getItem('token')
        },
        // 图片上传后预览时，请求存放的图片路径
        uploadPreviewPath:'',
        // 预览图片弹框关闭控件
        previewDialogVisible : false
      }
    },
    computed :{
      // 当前选中的三级分类id
      cateId () {
        return  this.addForm.goods_cat.length === 3? this.addForm.goods_cat[2]:null
      },
    },
    methods:{
      /**
       * 网络请求
       * */
      // 1.获取所有（一二三层）商品分类数据
      getCateList () {
        get('categories').then(res => {
          if  (res.meta.status !== 200) {
            return this.$message.error('获取所有商品分类失败！')
          }
          this.allCateList = res.data
        })
      },
      // 2.封装请求分类参数数据，根据传参不同获取动态或静态
      getCateAttr (sel) {
        get(`categories/${this.cateId}/attributes`,{sel:sel}).then(res => {
          if (res.meta.status !== 200 ){
            return this.$message.error('获取动态参数/静态属性失败！')
          }
          // 做一层判断，判断当前时动态参数，还是 静态属性，将请求回来的参数对应保存到该页面中
          if( sel === 'many'){
            // 需要对每个动态参数的vals进行数组化
            res.data.forEach(item => {
              // 判断是否有vals，没有就返回字符串
              item.attr_vals = item.attr_vals ?item.attr_vals.split(' '):[]
              // 同时为解决出现所有item共用一个inputVisible和inputValue，应该在这里获得vals时生成自己的两个控件属性
            })
            this.paramsList = res.data

          }else{
            this.attrList = res.data
          }
        })
      },
      // 3.封装添加商品的请求，传递的参数就是深度拷贝并进行处理过的addForm对象
      postForm (formObj) {
        post('goods',formObj).then(res => {
          // 失败返回
          if (res.meta.status !== 201 ) {
            console.log(res)
            return this.$message.error('添加商品失败！ '+res.meta.msg)
          }
          // 成功返回
          this.$message.success('添加商品成功！')

        })
      },


      /**
       * 其他事件
       * */
      // 级联选择器选中分类触发的事件
      cateChanged () {
        if (this.addForm.goods_cat.length !== 3) {
          this.addForm.goods_cat = []
        }
      },
      // tab标签切换前触发的函数，接收两个值，一个新active，一个旧
      beforeTabLeave (activeName,oldActiveName) {
        // 如果商品分类没有选择，则触发切换函数，并return false来阻止切换
        if(oldActiveName === '0' && this.addForm.goods_cat.length !== 3) {
          this.$message.error('请先选择商品分类！')
          return false
        }
      },
      // tab变迁切换时触发的函数
      tabClicked () {
        //判断当前Tab标签的activeIndex是否为1，即商品动态参数，2是就获取其数据
        if (this.activeIndex === '1') {
          this.getCateAttr('many')
        }
        else if (this.activeIndex === '2') {
          this.getCateAttr('only')
        }
      },
      // ------------图片上传区域------
      // 监听图片上传成功的事件,response的参数就是上传成功返回的res
      handleUploadSuccess (response) {
        // 1.拼接得到一个图片信息对象
        const picInfo = { pic : response.data.tmp_path}
        // 2.将图片信息对象，push到pics中
        this.addForm.pics.push(picInfo)
        console.log(this.addForm)
      },
      // 点击上传的图片预览大图,固定接收文件file
      handlePreview (file) {
        // 获取上传图片的服务器url地址
        this.uploadPreviewPath = file.response.data.url
        // 展示图片弹框
        this.previewDialogVisible = true
      },
      // 点击删除移除删除的图片,固定接收文件file
      handleRemove (file) {
        // 1.获取将要删除的图片的临时路径
        const filePath = file.response.data.tmp_path
        // 2.从pics数组中，找到图片对应的索引值
        const i = this.addForm.pics.findIndex(x => {
          x.pic === filePath
        })
        // 3.调用数组的splice方法，将图片对象信息，从pics中删除
        this.addForm.pics.splice(i,1)
        console.log(this.addForm)
      },

      // ----------最终提交添加商品------------
      add () {
        // 进行表单组件自带校验
        this.$refs.addRuleFormRef.validate(valid => {
          // 如果不合法表单规则
          if (!valid) {return this.$message.error('请填写完整表单信息')}
          // 符合,执行添加商品的业务逻辑
          // 1.因为分类提交需要按字符串间隔 ， 形式发送请求，所以想进行预处理
          // this.addForm.goods_cat =  this.addForm.goods_cat.join(',')
          // 但是如此进行处理，会因v-model双向绑定影响级联选择器的id，所以需要拷贝一份一模一样的addForm，这里使用lodash深拷贝模块
          //  lodash cloneDeep(obj),会返回一个全新的赋值，用变量接收
          const form = _.cloneDeep(this.addForm)
          form.goods_cat =  form.goods_cat.join(',')
          // 2.处理动态参数 (由于API中发送的参数/属性请求，是集成在addForm中的atr数组中的对象，而且只是需要attr_id和attr_value，所以也需要预处理,id对应id，value对应vals，并且需要将vals从数组拼接成字符串)
          this.paramsList.forEach(item => {
            //由于获取动态参数时，将字符串分隔成数组，此处需将数组再拼接成字符串
            const newInfo = {
              attr_id:item.attr_id,
              attr_value:item.attr_vals.join(' ')
            }
            this.addForm.attrs.push(newInfo)
          })
          // 3.处理静态属性
          this.attrList.forEach(item => {
            const newInfo = {attr_id:item.attr_id, attr_value:item.attr_vals}
            this.addForm.attrs.push(newInfo)
          })
          // 4. 将新addForm再赋值给深拷贝form
          form.attrs = this.addForm.attrs

          // 5.发起请求添加商品
          // 商品的名称，必须是唯一的
          this.postForm(form)
          // 跳转到商品列表
          this.$router.push('/goods')
        })
      }
    },
    created () {
      this.getCateList()
    }
  }
</script>
<style scoped>
  .el-form-item{
    margin-bottom: 10px;
    margin-left: 10px;
  }

  .el-checkbox {
    margin: 0 10px 0 0  !important;
  }

  /*预览图片*/
  .previewImg {
    width: 100%;
  }

  /*添加商品按钮*/
  .btnAdd {
    float: right;
    margin-top: 30px;
  }

</style>
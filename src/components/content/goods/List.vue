<template>
  <div>
    <!--面包导航区域-->
    <breadcrumb>
      <span slot="subName">商品管理</span>
      <span slot="itemName">商品列表</span>
    </breadcrumb>

    <!--卡片视图-->
    <card>
      <!--搜索与添加区域-->
      <el-row :gutter="20" slot="row">
        <el-col :span="8">
          <!--搜索功能通过v-model双向绑定父传子的queryInfo.query    clearable 表示可以显示一颗清空搜索内容按钮，clear事件用于重置页面数据-->
          <el-input placeholder="请输入商品名称" v-model="queryInfo.query" clearable @clear="getGoodsList" @input="getGoodsList">
            <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goAddPage">添加商品</el-button>
        </el-col>
      </el-row>

      <!--用户列表区域-->
      <!--el-table标签用于转载表格，data为接收的数据   border为表格加边框 ； stripe为隔行变色-->
      <el-table slot="table" :data="goodsList" border stripe="">
        <!--el-column表示一列，label为表头，prop表示要传入的值，为table绑定的data中的属性,在API接口中说明-->
        <el-table-column label="#" type="index" ></el-table-column>
        <el-table-column label="商品名称" prop="goods_name"></el-table-column>
        <el-table-column label="商品价格（元）" prop="goods_price" width="95px"></el-table-column>
        <el-table-column label="商品数量" prop="goods_number" width="95px"></el-table-column>
        <el-table-column label="商品重量" prop="goods_weight" width="70px"></el-table-column>
        <el-table-column label="创建时间" prop="add_time" width="200px">
          <template slot-scope="scope">
            {{scope.row.add_time | showDate }}
          </template>
        </el-table-column>
        <el-table-column label="操作" prop=""  width="200px">
          <!--同样使用模板插槽-->
          <!--<template slot-scope="slotProps">-->
          <template slot-scope="scope">
            <!--修改-->
            <el-tooltip class="item" effect="dark" content="编辑" placement="top" :enterable="false">
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.goods_id)"></el-button>
            </el-tooltip>
            <!--删除-->
            <el-tooltip class="item" effect="dark" content="删除" placement="top" :enterable="false">
              <el-button type="danger" icon="el-icon-delete" size="mini"  @click="removeGoodsById(scope.row.goods_id)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!--分页区域-->
      <el-pagination
        slot="pagination"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
        <!--layout就是这个分页区域的展示排布-->
      </el-pagination>

    </card>

    <Dialog title="修改商品" :dialogVisible="editDialogVisible" @hideDialog="hideDialog"  @dialogClosed="editDialogClosed" @addForm="editGoodsForm">
       <el-form :model="editForm" :rules="editFormRules" ref="editFormFormRef" label-width="100px">
       <el-form-item label="商品名称" prop="goods_name"><!--prop，验证规则传递的是el-form中rules的属性值-->
          <el-input v-model="editForm.goods_name"></el-input>
        </el-form-item>
         <el-form-item label="商品价格" prop="goods_price" type="number"><!--prop，验证规则传递的是el-form中rules的属性值-->
           <el-input v-model="editForm.goods_price"></el-input>
         </el-form-item>
         <el-form-item label="商品数量" prop="goods_number" type="number"><!--prop，验证规则传递的是el-form中rules的属性值-->
           <el-input v-model="editForm.goods_number"></el-input>
         </el-form-item>
         <el-form-item label="商品重量" prop="goods_weight" type="number" ><!--prop，验证规则传递的是el-form中rules的属性值-->
           <el-input v-model="editForm.goods_weight"></el-input>
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

  import _ from 'lodash'

  import {formatDate} from "../../../common/utils";

  import Breadcrumb from '../../common/breadcrumb/Breadcrumb'
  import Card from '../../common/card/Card'
  import Dialog from '../../common/dialog/Dialog'


  export default {
    name: "List",
    components:{
      Breadcrumb,
      Card,
      Dialog
    },
    data () {
      return {
        queryInfo :{
          query:'',
          pagenum:1,
          pagesize:10
        },
        goodsList : [],
        total: 0,
        // ------编辑弹框-------------
        editDialogVisible : false,
        editForm:{
          goods_name:'',
          goods_price:'',
          goods_weight:'',
          goods_number:'',
        },
        editFormRules : {
          goods_name:[{require:true,message:'请填写商品名称',trigger:'blur'}],
          goods_price:[{required:true,message:'请输入商品价格',trigger:'blur'}],
          goods_number:[{required:true,message:'请输入商品数量',trigger:'blur'}],
          goods_weight:[{required:true,message:'请输入商品重量',trigger:'blur'}],
        },
        goods_id:'',
        obj : {}
      }
    },
    filters:{
      showDate : function (value) {
        // 1.将时间戳转成Date对象
        const date = new Date(value*1000)

        // 2.将data转成时间,运用formateDate函数
        return formatDate(date,'yyyy-MM-dd hh:mm:ss')
      },
    },
    methods:{
      /**
       * 网络请求
       * */
      // 1.封装获取所有商品数据的方法
      getGoodsList () {
        get('goods',this.queryInfo).then(res => {
          if(res.meta.status !== 200 ) {
            console.log(res)
            return this.$message.error('获取商品数据失败！')
          }
          this.goodsList = res.data.goods
          this.total = res.data.total
        })
      },
      // 2.封装获取单个商品数据的请求
      getGoodById (id) {
        get(`goods/${id}`).then(res => {
          if (res.meta.status !== 200) {
            console.log(res);
            return this.$message({
              type:'error',
              message:'获取此商品数据失败！',
              duration:800,
            })
          }
          this.editForm = res.data
        })
      },
      // 3.封装提交编辑商品数据请求
      putEditForm (id,obj) {
        put(`goods/${id}`,obj).then(res => {
          if (res.meta.status !== 200) {
            console.log(res)
            return this.$message({
              type:'error',
              message:'修改此商品数据失败！',
              duration:800,
            })
          }
           this.$message({
            type:'success',
            message:'修改此商品数据成功！',
            duration:800,
          })
        })
      },
      // 4.封装删除单个商品的请求
      removeGoods(id) {
        remove(`goods/${id}`).then(res => {
          if(res.meta.status !== 200) {
            console.log(res)
            return this.$message({
              type:'error',
              message:'删除此商品失败！',
              duration:800
            })
          }
          this.$message({
            type:'success',
            message:'删除此商品成功！',
            duration:800
          })
        })
      },
      /**
       * 其他事件
       * */
      // 弹框公共事件
      hideDialog () {
        if  (this.editDialogVisible){
          this.editDialogVisible = false
        }
      },

      handleCurrentChange (newPage) {
        this.queryInfo.pagenum = newPage
        this.getGoodsList()
      },

      handleSizeChange (newSize) {
        this.queryInfo.pagesize = newSize
        this.getGoodsList()
      },

      // --add page ------
      // 点击添加商品跳转到添加商品专门的页面
      goAddPage () {
        this.$router.push('/goods/add')
      },


      // -------edit part-----------
      showEditDialog (id) {
        this.getGoodById(id)
        this.goods_id = id
        this.editDialogVisible = true
      },
      editDialogClosed () {
        this.hideDialog()
        this.getGoodsList()
      },
      editGoodsForm () {
        this.putEditForm(this.goods_id,this.editForm)
        this.$nextTick(() => {
          this.editDialogClosed ()
        })
      },


      // ---------remove(delete) part-------
      removeGoodsById (id) {
        this.$confirm('是否永久删除该商品?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // 确认删除
          this.removeGoods(id)
          this.$nextTick(()=>{
            this.getGoodsList()
          })

        }).catch(() => {
          this.$message({
            type: 'info',
            message: '添加已取消',
            duration:300
          });
        });
      }
    },
    created () {
      this.getGoodsList()
    }
  }
</script>

<style scoped>

</style>
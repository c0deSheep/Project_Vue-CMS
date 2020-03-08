<template>
  <div ref="divs">
    <!--面包屑导航区域-->
    <breadcrumb>
      <span slot="subName">订单管理</span>
      <span slot="itemName">订单列表</span>
    </breadcrumb>

    <!--卡片视图区域-->
    <card>
      <!--搜索与添加区域-->
      <el-row :gutter="20" slot="row">
        <el-col :span="8">
          <!--搜索功能通过v-model双向绑定父传子的queryInfo.query    clearable 表示可以显示一颗清空搜索内容按钮，clear事件用于重置页面数据-->
          <el-input placeholder="请输入商品名称" v-model="queryInfo.query" clearable @clear="getOrderList" @input="getOrderList">
            <el-button slot="append" icon="el-icon-search" @click="getOrderList"></el-button>
          </el-input>
        </el-col>
      </el-row>

      <!--订单表格视图-->
      <el-table :data="orderList" border stripe slot="table">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="order_number" label="订单编号"></el-table-column>
        <el-table-column prop="order_price" label="订单金额"></el-table-column>
        <el-table-column prop="pay_status" label="是否付款">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.pay_status === '1'">已付款</el-tag>
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货"></el-table-column>
        <el-table-column prop="create_time" label="下单时间">
          <template slot-scope="scope">
            {{scope.row.create_time | showDate}}
          </template>
        </el-table-column>
        <el-table-column  label="操作">
          <template>
            <el-tooltip class="item" effect="dark" content="编辑" placement="top" :enterable="false">
              <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEditOrder"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="物流进度" placement="top" :enterable="false">
              <el-button size="mini" type="success" icon="el-icon-location"  @click="showProgressBox" ></el-button>
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

    <!--订单编辑弹框-->
    <Dialog title="修改订单地址" :dialogVisible="editDialogVisible" @hideDialog="hideDialog"  @dialogClosed="editDialogClosed" @addForm="editAddressForm">
      <el-form :model="addressForm" :rules="addressFormRules" ref="editAddressFormRef" label-width="100px">
        <el-form-item label="省市区/县" prop="address1"><!--prop，验证规则传递的是el-form中rules的属性值-->
          <el-cascader
            v-model="addressForm.address1"
            :options="citydata"
            :props="{expandTrigger:'hover',value:'value',label:'label',children:'children',checkStrictly: true}"
            @change="address1Changed"
            clearable
          >
          </el-cascader><!--option用来指定数据源，绑定到一二层级分类数据，props为配置选择选项有value绑定数据源中的哪个属性，label展示的名字，children表示下一句关联选项，clearable表示关闭时重置，change-on-select表示每一级选项都可以选择-->

        </el-form-item>
        <el-form-item label="详细地址" prop="address2" ><!--prop，验证规则传递的是el-form中rules的属性值-->
          <el-input v-model="addressForm.address2"></el-input>
        </el-form-item>
      </el-form>
    </Dialog>

    <!--订单物流进度弹框-->
    <Dialog title="订单物流进度" :dialogVisible="progressDialogVisible" @hideDialog="hideDialog" @addForm="editAddressForm">
      <div class='time-line'>
        <div v-for='(item,i) in progressMessage' class='time-line-div' :key="i">
          <p>{{item.time}}</p>
          <p ref="circular" class="pic" ></p>
          <p>{{item.context}}</p>
        </div>
        <div class='img-dotted'  ref="dotted"></div>
      </div>
    </Dialog>
  </div>
</template>

<script>
  import { get } from  '../../../network/get'
  import { post } from  '../../../network/post'
  import { put } from  '../../../network/put'
  import { remove } from '../../../network/remove'

  import {formatDate} from "../../../common/utils";
  import citydata from "../../../common/citydata";

  import Breadcrumb from '../../common/breadcrumb/Breadcrumb'
  import Card from '../../common/card/Card'
  import Dialog from '../../common/dialog/Dialog'

  export default {
    name: "Order",
    components : {
      Breadcrumb,
      Card,
      Dialog
    },
    data () {
      return {
        // 获取订单请求的请求体
        queryInfo: {
          // 请求具体订单数据
          query: '',
          // 页数
          pagenum: 1,
          // 页面展示数
          pagesize: 10
        },
        // 存放获取返回到的所有订单数据
        orderList : [],
        // 存放获取总共订单数目
        total:0,
        // 控制编辑订单弹框
        editDialogVisible : false,
        // 编辑弹框的form表单
        addressForm: {
          address1 : [],
          address2 : ''
        },
        // 表单规则
        addressFormRules : {
          address1 : [{required:true,message:'请选择省市区/县',trigger:'blur'}],
          address2 : [{required:true,message:'请输入详细地址',trigger:'blur'}]
        },
        // 选择省市区/县的级联选择器的数据来自导入的citydata
        citydata : citydata,
        // 物流进度弹框显示控件
        progressDialogVisible : false,
        // 存放物流信息
        progressMessage: []
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
    methods: {
      /**
       * 网络请求
       * */
      // 1.封装请求所有订单数据的方法
      getOrderList () {
        get('orders',this.queryInfo).then(res => {
          if (res.meta.status !== 200) {
            console.log(res)
            return this.$message.error('获取所有订单数据失败！')
          }
          this.orderList = res.data.goods
          this.total = res.data.total
          console.log(this.orderList)
          console.log(this.total)
        })
      },
      // 2.封装获取测试的订单物流进度方法
      getProgress () {
        get(`/kuaidi/804909574412544580`).then(res => {
          if (res.meta.status !== 200) {
            return this.$message.error('获取订单物流信息失败')
          }
          this.progressMessage = res.data
        })
      },

      /**
       * 其他方法
       * */
      // --------编辑订单部分----------
      showEditOrder () {
        this.editDialogVisible = true
      },
      hideDialog () {
        if (this.editDialogVisible) {
          return this.editDialogVisible = false
        }
        if (this.progressDialogVisible) {
          return this.progressDialogVisible = false
        }
      },
      editDialogClosed () {
        this.$refs.editAddressFormRef.resetFields()
        this.hideDialog()
      },
      address1Changed () {
        // if (this.addressForm.address1.length !== 3) {}
      },
      editAddressForm () {
        this.editDialogClosed ()
      },

      // ---------订单物流部分--------------
      showProgressBox () {
        this.getProgress()
        this.progressDialogVisible = true
        ////---- no work! -----
        // this.$nextTick(() => {
        //   //this.$refs.dotted.style.left = this.$refs.circular.offsetLeft - 12 + 'px'
        // })

      },
      // ---------分页操作--------------
      // 页面展示数改变触发函数
      handleSizeChange (newSize) {
        this.queryInfo.pagesize = newSize
        this.getOrderList()
      },

      // 页数改变触发函数
      handleCurrentChange (newPage) {
        this.queryInfo.pagenum = newPage
        this.getOrderList()
      },

    },
    created () {
      //  创建网页请求所有数据
      this.getOrderList()
    },
  }
</script>

<style scoped>
  .el-cascader {
    width: 100%;
  }
  .time h2{
    color:#FF6600;
    margin: 20px auto 30px auto;
  }
  .time-line{
    position: relative;
    margin:0 auto;
  }
  .time-line-div{
    position:relative;
    min-height:100px;
  }
  .time-line-div>p:nth-child(1){
    position: absolute;
    left:0;
    width:90px;
  }
  .time-line-div>p:nth-child(2){
    position:absolute;
    left: 100px;
    width:20px;
    height:20px;
    top:10px;
    background:#5CB85C;
    z-index: 10;
    background:url('../../../assets/images/progress.png');

  }
  .time-line-div>p:nth-child(3){
    position:absolute;
    left: 130px;
    padding: 10px;
    background: #317EF3;
    font-size:.8rem;
    color:#fff;
    border-radius: 10px;

  }
  .img-dotted{
    position:absolute;
    width:5px;
    height:100%;
    top:0;
    left: 107px;
    background:url('../../../assets/images/dash.png')  repeat;
    z-index: 1;
  }

  .time-line-detail>p{
    margin-left: 30px;
    margin-bottom: 40px;
  }

</style>